class Pause extends Phaser.Scene {
    constructor() {
        super("pauseScene");
    }
    
    init(data){
        this.pausedScene = data.srcScene;
    }

    create(){
        var spacing = 64;

        console.log("Paused")

        // Add Reset text & button
        var resetButton = this.add.text(game.config.width/3, game.config.height/3, 'RESET', { fontFamily: 'font1', fontSize: 50}).setOrigin(0.5);
        resetButton.setInteractive();
        resetButton.on('pointerdown', () => {
            this.scene.stop(this.pausedScene);
            this.scene.start('playScene');
        });

        var menuButton = this.add.text(game.config.width/3, game.config.height/2, 'Menu', { fontFamily: 'font1', fontSize: 50}).setOrigin(0.5);
        menuButton.setInteractive();
        menuButton.on('pointerdown', () => {
            this.scene.stop(this.pausedScene);
            this.scene.start('menuScene');
        });

        // Add Back text & button
        var backButton = this.add.text(game.config.width/3, game.config.height * (2/3), 'BACK', { fontFamily: 'font1', fontSize: 50}).setOrigin(0.5);
        backButton.setInteractive();
        backButton.on('pointerdown', () => {
            this.scene.resume(this.pausedScene);
            this.scene.stop();
        });

        let panel = this.add.sprite(750, game.config.height/2, 'Panel').setScale(4)
        let title = this.add.text(750, game.config.height/3 - 15, 'Controls', { fontFamily: 'font1', fontSize: 50}).setOrigin(0.5,0.5)
        let controls1 = this.add.text(750, game.config.height/3 + 40, 'Left and Right arrows to rotate', { fontFamily: 'font1', fontSize: 18}).setOrigin(0.5,0.5)
        let controls2 = this.add.text(750, game.config.height/3 + 80, 'Up arrow to lift off planet', { fontFamily: 'font1', fontSize: 18}).setOrigin(0.5,0.5)
        let controls3 = this.add.text(750, game.config.height/3 + 120, 'Do a 180 spin for a speed boost', { fontFamily: 'font1', fontSize: 18}).setOrigin(0.5,0.5)
        let controls4 = this.add.text(750, game.config.height/3 + 160, 'Press space for a galaxy map', { fontFamily: 'font1', fontSize: 18}).setOrigin(0.5,0.5)
    }
}