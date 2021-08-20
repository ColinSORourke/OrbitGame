class Pause extends Phaser.Scene {
    constructor() {
        super("pauseScene");
    }
    
    init(data){
        this.pausedScene = data.srcScene;
    }

    create(){
        var spacing = 64;

        // Add Reset text & button
        var resetButton = this.add.text(game.config.width/2, game.config.height/3, 'RESET', 32).setOrigin(0.5);
        resetButton.setInteractive();
        resetButton.on('pointerdown', () => {
            this.scene.stop(this.pausedScene);
            this.scene.start('playScene');
        });

        // Add Back text & button
        var backButton = this.add.text(game.config.width/2, game.config.height * (2/3), 'BACK', 32).setOrigin(0.5);
        backButton.setInteractive();
        backButton.on('pointerdown', () => {
            this.scene.resume(this.pausedScene);
            this.scene.stop();
        });
    }
}