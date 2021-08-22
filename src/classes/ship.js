class Ship extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, key, frame){
        super(scene, x, y, key, frame)
        this.trail = scene.add.sprite(this.x, this.y, 'Trail')
        this.trail.setOrigin(0.5,0)
        this.trail.setScale(0.25)
        this.scene = scene
        let ship = this

        this.sfxConfig = scene.sfxConfig
        this.boostSound = scene.sound.add("jumpSound", this.sfxConfig)
        this.turnSound = scene.sound.add("jumpSlow", this.sfxConfig)
        this.landSound = scene.sound.add("landSound", this.sfxConfig)
        this.launchSound = scene.sound.add("launchSound", this.sfxConfig)

        this.particles = scene.add.particles('shipParticle');
        this.particles.createEmitter({
            angle: { min: 240, max: 300 },
            speed: { min: 200, max: 300 },
            quantity: 8,
            lifespan: 800,
            alpha: { start: 1, end: 0 },
            scale: { start: 1.5, end: 0.5 },
            tint: 0x6457A6,
            on: false
        });

        scene.physics.world.enable(this)
        scene.add.existing(this)
        this.body.setSize(64,64)
        this.setScale(0.3)        

        this.fuel = 1
        this.speed = 300
        this.landed = false
        this.on = false
        this.empty = false

        let width = 400;
        let height = 20;
        let xStart = 300;
        let yStart = 20;
        // border size
        let borderOffset = 2;

        let borderRect = new Phaser.Geom.Rectangle(
            xStart - borderOffset,
            yStart - borderOffset,
            width + borderOffset * 2,
            height + borderOffset * 2);

        let border = scene.add.graphics({
            lineStyle: {
                width: 5,
                color: 0xaaaaaa
            }
        });
        border.strokeRectShape(borderRect)
        border.setScrollFactor(0)
        this.fuelBar = scene.add.graphics();
        this.fuelBar.setScrollFactor(0)
        this.updateFuel()
        let fuelText = scene.add.text(xStart + width/2, yStart + 35, "Fuel", { fontFamily: 'font1', fontSize: 25}).setOrigin(0.5,0.5)
        fuelText.setScrollFactor(0)
        scene.UIGroup.add(border)
        scene.UIGroup.add(fuelText)
        scene.UIGroup.add(this.fuelBar)

        var fuelTime = this.scene.time.addEvent({
            delay: 500,                // ms
            callback: function(){
                if (!(this.landed) && this.fuel > 0){
                    this.fuel -= 0.02
                    this.updateFuel()
                }
            },
            callbackScope: ship,
            loop: true
        });

        this.snapDirection()
        this.origAngle = 0
    }

    update(){
        this.trail.x = this.x
        this.trail.y = this.y
        this.trail.angle = this.angle
        

        if (!this.empty){
            this.speed = 300
            if (Phaser.Input.Keyboard.JustDown(keyUP)){
                this.launchSound.play()
                this.scene.planetCollider.active = false
                this.landed = false
                this.on = false
                this.snapDirection()
                this.body.setAngularVelocity(0)
                var timer = this.scene.time.addEvent({
                    delay: 750,                // ms
                    callback: function(){
                        this.scene.planetCollider.active = true
                    },
                    callbackScope: this,
                    loop: false
                });
            }
            if (!(this.landed)){
                if(Phaser.Input.Keyboard.JustDown(keyRIGHT)){
                    this.snapDirection(this.speed - 180)
                    this.origAngle = this.angle
                    this.fuel -= 0.03
                    this.trail.visible = false
                    this.body.setAngularVelocity(240)     
                }
                if(Phaser.Input.Keyboard.JustUp(keyRIGHT)){
                    this.body.setAngularVelocity(0)
                    if (Math.abs(this.origAngle - this.angle) > 160 && Math.abs(this.origAngle - this.angle) < 200){
                        this.boostSound.play()
                        this.particles.emitParticleAt(this.x, this.y);
                        this.snapDirection(this.speed + 140)
                    } else {
                        this.turnSound.play()
                        this.snapDirection()
                    }
                    
                }
                if(Phaser.Input.Keyboard.JustDown(keyLEFT)){
                    this.snapDirection(this.speed - 180)
                    this.origAngle = this.angle
                    this.fuel -= 0.03
                    this.trail.visible = false
                    this.body.setAngularVelocity(-240)    
                }
                if(Phaser.Input.Keyboard.JustUp(keyLEFT)){
                    this.body.setAngularVelocity(0)
                    if (Math.abs(this.origAngle - this.angle) > 160 && Math.abs(this.origAngle - this.angle) < 190){
                        this.boostSound.play()
                        this.particles.emitParticleAt(this.x, this.y);
                        this.snapDirection(this.speed + 140)
                    } else {
                        this.turnSound.play()
                        this.snapDirection()
                    }
                }
            }
        }
    }

    land(ship, planet){
        if (!ship.landed){
            ship.landSound.play()
            ship.body.setVelocity(0,0)
            ship.body.angularVelocity = planet.body.angularVelocity
            if (ship.empty){
                ship.scene.cameras.main.fadeFrom(1000, 0, 0, 0, true)
                ship.empty = false
            }
            ship.fuel = 1
            ship.updateFuel()
            ship.landed = true
            ship.on = planet.name
            ship.trail.visible = false
        }
        ship.x = planet.x
        ship.y = planet.y
    }

    snapDirection(speed = this.speed){
        let direction = this.angle * (Math.PI/180)
        let newX = Math.sin(direction) * speed
        let newY = - ( Math.cos(direction) * speed )
        this.body.setVelocity(newX, newY)
        this.trail.visible = true
        this.updateFuel()
    }

    updateFuel(){
        let width = 400;
        let height = 20;
        let xStart = 300;
        let yStart = 20;
        this.fuelBar.clear();
        this.fuelBar.fillStyle(0x9FD8CB, 1);
        this.fuelBar.fillRect(xStart, yStart, Math.max(0, this.fuel) * width, height);
        if (this.fuel <= 0){
            this.body.setVelocity(0,0)
            this.body.setAngularVelocity(0)
            this.speed = 0
            this.trail.visible = false
            this.empty = true
            this.scene.cameras.main.fadeOut(6000)
        }
    }
}