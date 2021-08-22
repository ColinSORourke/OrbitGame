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
        var resetButton = this.add.text(game.config.width/2, game.config.height/3, 'RESET', { fontFamily: 'font1', fontSize: 50}).setOrigin(0.5);
        resetButton.setInteractive();
        resetButton.on('pointerdown', () => {
            this.scene.stop(this.pausedScene);
            this.scene.start('playScene');
        });

        var menuButton = this.add.text(game.config.width/2, game.config.height/2, 'Menu', { fontFamily: 'font1', fontSize: 50}).setOrigin(0.5);
        menuButton.setInteractive();
        menuButton.on('pointerdown', () => {
            this.scene.stop(this.pausedScene);
            this.scene.start('menuScene');
        });

        // Add Back text & button
        var backButton = this.add.text(game.config.width/2, game.config.height * (2/3), 'BACK', { fontFamily: 'font1', fontSize: 50}).setOrigin(0.5);
        backButton.setInteractive();
        backButton.on('pointerdown', () => {
            this.scene.resume(this.pausedScene);
            this.scene.stop();
        });
    }
}