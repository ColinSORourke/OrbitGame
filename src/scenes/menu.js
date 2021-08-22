class Menu extends Phaser.Scene {
  constructor() {
    super("menuScene");
  }
  
  create() {
    this.BG = this.add.tileSprite(0,0, 1000, 750, "BG").setOrigin(0,0)
    this.shipTrail = this.add.sprite(game.config.width/2, 620, "Trail").setOrigin(0.5,0)
    this.ship = this.add.sprite(game.config.width/2, 600, "Ship")
    
    
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
    let startButton = this.add.text(350, game.config.height/2, 'LAUNCH', { fontFamily: 'font1', fontSize: 50}).setOrigin(0.5,0.5)
    startButton.setInteractive();
    startButton.on('pointerdown', () => {
      game.music.play();
      this.scene.start('playScene');
    });

    let panel = this.add.sprite(750, game.config.height/2, 'Panel').setScale(4)
    let title = this.add.text(750, game.config.height/3 - 15, 'Controls', { fontFamily: 'font1', fontSize: 50}).setOrigin(0.5,0.5)
    let controls1 = this.add.text(750, game.config.height/3 + 40, 'Left and Right arrows to rotate', { fontFamily: 'font1', fontSize: 18}).setOrigin(0.5,0.5)
    let controls2 = this.add.text(750, game.config.height/3 + 80, 'Up arrow to lift off planet', { fontFamily: 'font1', fontSize: 18}).setOrigin(0.5,0.5)
    let controls3 = this.add.text(750, game.config.height/3 + 120, 'Do a 180 spin for a speed boost', { fontFamily: 'font1', fontSize: 18}).setOrigin(0.5,0.5)
    let controls4 = this.add.text(750, game.config.height/3 + 160, 'Press space for a galaxy map', { fontFamily: 'font1', fontSize: 18}).setOrigin(0.5,0.5)
  }
  
  update(){
    this.BG.tilePositionY -= 7
  }
}