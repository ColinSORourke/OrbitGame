class Gameover extends Phaser.Scene {
    constructor() {
        super("gameoverScene");
    }
    
    init(data){
        this.pausedScene = data.srcScene;
        this.cause = data.string
        this.score = data.score
    }

    create(){
        var spacing = 64;

        // Add Reset text & button
        var text = this.add.text(game.config.width/2, game.config.height/5, this.cause, { fontFamily: 'font1', fontSize: 50}).setOrigin(0.5)
        var text2 = this.add.text(game.config.width/2, game.config.height/3, "Final Score: " + this.score, { fontFamily: 'font1', fontSize: 50}).setOrigin(0.5)

        var resetButton = this.add.text(game.config.width/2, game.config.height/2, 'RESET', { fontFamily: 'font1', fontSize: 50}).setOrigin(0.5);
        resetButton.setInteractive();
        resetButton.on('pointerdown', () => {
            this.scene.stop(this.pausedScene);
            this.scene.start('playScene');
        });

        var menuButton = this.add.text(game.config.width/2, game.config.height*0.7, 'Menu', { fontFamily: 'font1', fontSize: 50}).setOrigin(0.5);
        menuButton.setInteractive();
        menuButton.on('pointerdown', () => {
            this.scene.stop(this.pausedScene);
            this.scene.start('menuScene');
        });
    }
}