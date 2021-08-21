class Ship extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, key, frame){
        super(scene, x, y, key, frame)
        this.trail = scene.add.sprite(this.x, this.y, 'Trail')
        this.trail.setOrigin(0.5,0)
        this.trail.setScale(0.25)
        this.scene = scene
        let ship = this


        scene.physics.world.enable(this)
        scene.add.existing(this)
        this.body.setSize(64,64)
        this.setScale(0.3)        

        this.fuel = 1
        this.speed = 300
        this.landed = false
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

        scene.UIGroup.add(border)
        scene.UIGroup.add(this.fuelBar)

        var fuelTime = this.scene.time.addEvent({
            delay: 500,                // ms
            callback: function(){
                if (!(this.landed) && this.fuel > 0){
                    this.fuel -= 0.015
                    this.updateFuel()
                }
            },
            callbackScope: ship,
            loop: true
        });

        this.snapDirection()

        console.log("All done!")
        console.log(this)
    }

    update(){
        this.trail.x = this.x
        this.trail.y = this.y
        this.trail.angle = this.angle

        if (!this.empty){
            this.speed = 300
            if (Phaser.Input.Keyboard.JustDown(keyUP)){
                this.scene.planetCollider.active = false
                this.landed = false
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
                    this.snapDirection()
                    this.fuel -= 0.05
                    this.trail.visible = false
                    this.body.setAngularVelocity(150)     
                }
                if(Phaser.Input.Keyboard.JustUp(keyRIGHT)){
                    this.body.setAngularVelocity(0)
                    this.snapDirection()
                }
                if(Phaser.Input.Keyboard.JustDown(keyLEFT)){
                    this.snapDirection()
                    this.fuel -= 0.05
                    this.trail.visible = false
                    this.body.setAngularVelocity(-150)    
                }
                if(Phaser.Input.Keyboard.JustUp(keyLEFT)){
                    this.body.setAngularVelocity(0)
                    this.snapDirection()
                }
            }
        }
    }

    land(ship, planet){
        if (!ship.landed){
            ship.body.setVelocity(0,0)
            ship.body.angularVelocity = planet.body.angularVelocity
            if (ship.empty){
                ship.scene.cameras.main.fadeFrom(1000, 0, 0, 0, true)
                ship.empty = false
            }
            ship.fuel = 1
            ship.updateFuel()
            ship.landed = true
            ship.trail.visible = false
        }
        ship.x = planet.x
        ship.y = planet.y
    }

    snapDirection(){
        let direction = this.angle * (Math.PI/180)
        let newX = Math.sin(direction) * this.speed
        let newY = - ( Math.cos(direction) * this.speed )
        this.body.setVelocity(newX, newY)
        this.trail.visible = true
        this.updateFuel()
    }

    updateFuel(){
        console.log(this.fuel)
        let width = 400;
        let height = 20;
        let xStart = 300;
        let yStart = 20;
        this.fuelBar.clear();
        this.fuelBar.fillStyle(0xffffff, 1);
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