class Play extends Phaser.Scene {
    constructor(){
        super("playScene")    
    }

    create(){

        let graphics = this.add.graphics();

        // Add Sun in Center
        this.star = this.physics.add.sprite(game.config.width, game.config.height, 'meteor_101')
        this.star.setCircle(50, 15, 15)
        this.star.body.angularVelocity = 30

        // Create Orbit Path
        this.orbit = this.createOrbit(300, game.config.width, game.config.height)
        this.orbit.draw(graphics)

        // Add Planet to Orbit
        let planets = this.add.group({
            classType: Phaser.GameObjects.Sprite,
            defaultKey: null,
            defaultFrame: null,
            active: true,
            maxSize: -1,
            runChildUpdate: true
        })
        console.log(planets)


        let i = 0
        while (i < 1){
            let planet = this.createPlanet(this.orbit, true, true, false)
            this.initPlanet(planet, 10000, i, 15, 0xA5FFD6)
            planets.add(planet)
            i += 0.2
        }
        

        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        this.ship = this.physics.add.sprite(game.config.width, game.config.height, 'Ship')
        this.playerSpeed = 250
        this.ship.body.setSize(64,64)
        this.ship.setScale(0.5)
        this.changeDir(this.ship)

        this.landing = this.physics.add.overlap(this.ship, planets, function(ship, planet){
            ship.setVelocity(0,0)
            ship.x = planet.x
            ship.y = planet.y
            ship.body.angularVelocity = planet.body.angularVelocity
        })

        // set up main camera to follow the player
        this.cameras.main.setBounds(0, 0, 2000, 1500);
        this.cameras.main.setZoom(1);
        this.cameras.main.startFollow(this.ship);

        // Add Pause Button
        this.pauseButton = this.add.text(game.config.width/2, game.config.height - 25, 'PAUSE', 20).setOrigin(0.5)
        this.pauseButton.setInteractive();
        this.pauseButton.on('pointerdown', () => {
            this.pause();
        });
        this.pauseButton.setScrollFactor(0)
    }

    update(){
        if(Phaser.Input.Keyboard.JustDown(keyRIGHT)){
            this.changeDir(this.ship)
            this.ship.setAngularVelocity(90) 
            this.landing.active = false        
        }
        if(Phaser.Input.Keyboard.JustUp(keyRIGHT)){
            this.ship.setAngularVelocity(0)
            this.changeDir(this.ship)
            this.landing.active = true
        }
        if(Phaser.Input.Keyboard.JustDown(keyLEFT)){
            this.changeDir(this.ship)
            this.ship.setAngularVelocity(-90) 
            this.landing.active = false        
        }
        if(Phaser.Input.Keyboard.JustUp(keyLEFT)){
            this.ship.setAngularVelocity(0)
            this.changeDir(this.ship)
            this.landing.active = true
        }
    }

    pause() {
        this.scene.pause();
        this.scene.launch('pauseScene', { srcScene: "playScene" });
    }

    createOrbit(radius, x, y){
        let orbit = this.add.path(x + radius, y)
        orbit.circleTo(radius)
        return orbit
    }

    createPlanet(path, square = true, detailed = true, large = true){
        let s = path.getStartPoint()
        let planet = this.add.follower(path, s.x, s.y, "meteor_" + (square | 0) + (detailed | 0) + (large | 0))
        this.physics.add.existing(planet)
        if (large){
            planet.body.setCircle(50, 15, 15)
        } else {
            planet.body.setCircle(35, 30, 30)
        }
        return planet
    }

    initPlanet(planet, orbitalSpd = 10000, startPnt = 0, angularSpd = 15, tint = 0xA5FFD6){
        console.log(planet)
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

    changeDir(object){
        let origVel = object.body.velocity
        let direction = object.angle * (Math.PI/180)
        let newX = Math.sin(direction) * this.playerSpeed
        let newY = - ( Math.cos(direction) * this.playerSpeed )
        object.setVelocity(newX, newY)
    }
}