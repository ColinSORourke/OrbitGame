class Play extends Phaser.Scene {
    constructor(){
        super("playScene")    
    }

    create(){
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP)
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT)
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)

        let galaxySizeX = 4200
        let galaxySizeY = 4200
        let galaxyMiddleX = galaxySizeX/2
        let galaxyMiddleY = galaxySizeY/2

        let camera = this.cameras.main
        let BG = this.add.tileSprite(-400,-400, 5000, 5000, "BG").setOrigin(0,0)
        this.UIGroup = this.add.group()

        // Add Sun in Center
        var particles = this.add.particles('starParticle');
        var emitter = particles.createEmitter({
            x: galaxyMiddleX,
            y: galaxyMiddleY,
            speed: 80,
            lifespan: {min: 1000, max: 1500},
            frequency: 120,
            tint: 0xFC814A,
            rotate: {min: -30, max: 30},
            alpha: {min: 0.25, max: 0.75},
            scale: {min: 0.6, max: 1.2}
        })
        this.starBG = this.physics.add.sprite(galaxyMiddleX, galaxyMiddleY, 'starB').setScale(2)
        this.starBG.setTint(0xE9D758)
        this.star = this.physics.add.sprite(galaxyMiddleX, galaxyMiddleY, 'starA').setTint(0xFFAB45)
        this.starBG.angle = 45
        this.starBG.body.angularVelocity = 30
        this.star.setCircle(50, 15, 15)
        this.starBG.setSize(2,2)
        this.star.body.angularVelocity = 30
        this.star.setScale(1.5)

        let randomPlanet = this.randomGalaxy(galaxyMiddleX, galaxyMiddleY)

        this.ship = new Ship(this, randomPlanet.x, randomPlanet.y, 'Ship', null)
        this.planetCollider = this.physics.add.overlap(this.ship, this.planets, this.ship.land, null, this)
        this.sunCollider = this.physics.add.overlap(this.ship, this.star, this.gameOver, null, this)

        // set up main camera to follow the player
        this.cameras.main.setBounds(0, 0, galaxySizeX, galaxySizeY);
        this.cameras.main.setZoom(1);
        this.cameras.main.startFollow(this.ship);
        this.minimap = this.cameras.add(300, 175, 400, 400).setZoom(400/galaxySizeX).setName('mini');
        this.minimap.centerOn(galaxyMiddleX, galaxyMiddleY)
        this.minimap.setVisible(false)
        this.minimap.ignore(BG)

        // Add Pause Button
        this.pauseButton = this.add.text(game.config.width/2, game.config.height - 25, 'PAUSE', 20).setOrigin(0.5)
        this.pauseButton.setInteractive();
        this.pauseButton.on('pointerdown', () => {
            this.pause();
        });
        this.pauseButton.setScrollFactor(0)

        this.cameras.main.once('camerafadeoutcomplete', function () {
            this.minimap.visible = false
            this.gameOver();
        }, this);

        this.UIGroup.add(this.pauseButton)
        this.minimap.ignore(this.UIGroup)
    }

    update(){
        if (Phaser.Input.Keyboard.JustDown(keySPACE)){
            this.minimap.setVisible(true)
        }
        if (Phaser.Input.Keyboard.JustUp(keySPACE)){
            this.minimap.setVisible(false)
        }

        this.ship.update()
    }

    pause() {
        this.scene.pause();
        this.scene.launch('pauseScene', { srcScene: "playScene" });
    }

    createOrbit(radius, x, y, dir){
        let orbit = this.add.path(x + radius, y)
        orbit.circleTo(radius, dir)
        return orbit
    }

    createPlanet(path, square = true, detailed = true, large = true, scale = 1){
        let s = path.getStartPoint()
        let planet = this.add.follower(path, s.x, s.y, "meteor_" + (square | 0) + (detailed | 0) + (large | 0))
        planet.setScale(scale)
        this.physics.add.existing(planet)
        if (large){
            planet.body.setCircle(40, 24, 24)
        } else {
            planet.body.setCircle(35, 30, 30)
        }
        return planet
    }

    initPlanet(planet, orbitalSpd = 10000, startPnt = 0, angularSpd = 15, tint = 0xA5FFD6){
        planet.startFollow({
            duration: orbitalSpd,
            from: 0,
            to: 1,
            startAt: startPnt,
            repeat: -1
        })
        planet.body.angularVelocity = angularSpd
        planet.setTint(tint)
    }

    randomGalaxy(galaxyMiddleX, galaxyMiddleY){
        let graphics = this.add.graphics();
        const color = new Phaser.Display.Color();

        this.planets = this.add.group({
            classType: Phaser.GameObjects.Sprite,
            defaultKey: null,
            defaultFrame: null,
            active: true,
            maxSize: -1,
            runChildUpdate: true
        })

        // Create Orbit Path
        this.orbits = []
        let i = 0
        let maxOrb = Phaser.Math.Between(5,8)
        let startingOrbit = 120
        let target = Phaser.Math.Between(0, maxOrb - 1)

        while (i < maxOrb){
            startingOrbit += Phaser.Math.Between(120,320)
            let dir = (Math.random() > 0.5)
            this.orbits.push(this.createOrbit(startingOrbit, galaxyMiddleX, galaxyMiddleY, dir))
            this.orbits[i].draw(graphics)
            
            let square = (Math.random() > 0.5)
            let detailed = (Math.random() > 0.5)
            let large = (Math.random() > 0.5)
            let size = (Math.random() + 0.6)
            if (!(size < 1.1)){
                size = 1
            }
            let planet = this.createPlanet(this.orbits[i], square, detailed, large, size)

            let time = 6000 + (i+1) * 2250 + Phaser.Math.Between(1,62 - (4*maxOrb)) * 750 
            let pos = Math.random()
            let angle = Phaser.Math.Between(20,60)
            color.random();
            
            if (i == target){
                pos = 0
            }

            this.initPlanet(planet, time, pos, angle, color.color, dir)
            if (Math.random() > 0.9){
                color.random()
                let colorA = color.color
                color.random()
                let colorB = color.color
                color.random()
                let colorC = color.color
                color.random()
                let colorD = color.color
                planet.setTint(colorA, colorB, colorC, colorD)
            }

            this.planets.add(planet)
            if (i == target){
                target = planet
            }

            i += 1
        }        
        return target
    }

    gameOver(){
        this.pause()
    }
}