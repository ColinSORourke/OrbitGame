class Menu extends Phaser.Scene {
    constructor() {
      super("menuScene");
    }
    
    create() {
      // Add music
      this.musicConfig =  {
        mute: false,
        volume: 1,
        rate: 1,
        detune: 0,
        seek: 0,
        loop: true,
        delay: 0
      };

      if (!game.music){ 
        game.music = this.sound.add('Cycad', this.musicConfig);
      }
      game.music.stop();

    // Start Button
    let startButton = this.add.rectangle(game.config.width/2, game.config.height/2, 300, 90, 0xFF0000);
    startButton.setInteractive();
    startButton.on('pointerdown', () => {
      game.music.play();
      this.scene.start('playScene');
    });
  }
}