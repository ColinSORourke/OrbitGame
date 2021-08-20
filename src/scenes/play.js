class Play extends Phaser.Scene {
    constructor(){
        super("playScene")    
    }

    create(){

        let graphics = this.add.graphics();

        // Add Sun in Center
        this.star = this.physics.add.sprite(game.config.width, game.config.height, 'Sun')
        this.star.setCircle(50, 15, 15)
        this.star.body.angularVelocity = 30

        // Create Orbit Path
        this.orbit = this.createOrbit(300, game.config.width, game.config.height)
        this.orbit.draw(graphics)

        // Add Planet to Orbit
        let s = this.orbit.getStartPoint()
        this.planet = this.add.follower(this.orbit, s.x, s.y, 'Comet')
        this.planet.startFollow({
            duration: 10000,
            from: 0,
            to: 1,
            rotateToPath: false,
            startAt: 0,
            repeat: -1
        })
        this.physics.add.existing(this.planet)
        this.planet.body.setCircle(35, 30, 30)
        this.planet.body.angularVelocity = 15
        this.planet.setTint(0xA5FFD6)

        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.ship = this.physics.add.sprite(game.config.width, game.config.height, 'Ship')
        this.ship.body.setSize(64,64)
        this.ship.setScale(0.5)
        this.ship.setVelocity(0,-50)

        this.landing = this.physics.add.overlap(this.ship, this.planet, function(ship, planet){
            ship.setVelocity(0,0)
            ship.x = planet.x
            ship.y = planet.y
            ship.body.angularVelocity = planet.body.angularVelocity
        })
        console.log(this.landing)

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
        if(Phaser.Input.Keyboard.JustDown(keySPACE)){
            this.ship.setAngularVelocity(45) 
            this.landing.active = false        
        }
        if(Phaser.Input.Keyboard.JustUp(keySPACE)){
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

    changeDir(object){
        let origVel = object.body.velocity
        let direction = object.angle * (Math.PI/180)
        let magnitude = Math.sqrt(Math.pow(origVel.x, 2) + Math.pow(origVel.y, 2))
        let newX = Math.sin(direction) * magnitude
        let newY = - ( Math.cos(direction) * magnitude )
        object.setVelocity(newX, newY)
    }
}