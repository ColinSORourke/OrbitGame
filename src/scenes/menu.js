class Menu extends Phaser.Scene {
  constructor() {
    super("menuScene");
  }
  
  create() {
    this.BG = this.add.tileSprite(0,0, 1000, 750, "BG").setOrigin(0,0)
    this.shipTrail = this.add.sprite(game.config.width/2, 620, "Trail").setOrigin(0.5,0)
    this.ship = this.add.sprite(game.config.width/2, 600, "Ship")
    if (!game.highScore){
      game.highScore = 0
    }
    
    
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

    this.sfxConfig = {
      mute: false,
      volume: 1,
      rate: 1,
      detune: 0,
      seek: 0,
      loop: false,
      delay: 0
    };

    
    if (!game.music){ 
      game.music = this.sound.add('Cycad', this.musicConfig);
      game.menuAmbience = this.sound.add('Waltz')
    }
    game.music.stop();
    game.button = this.sound.add('button', this.sfxConfig)
    game.menuAmbience.play();

    let logo = this.physics.add.sprite(200,200, 'Logo').setScale(0.5)
    logo.setAngularVelocity(5)

    // Start Button
    let startButton = this.add.text(350, game.config.height/2, 'LAUNCH', { fontFamily: 'font1', fontSize: 50}).setOrigin(0.5,0.5)
    startButton.setInteractive();
    startButton.on('pointerdown', () => {
      game.button.play()
      game.menuAmbience.stop()
      game.music.play();
      this.scene.start('playScene');
    });

    let panel = this.add.sprite(750, game.config.height/2, 'Panel').setScale(4)
    let title = this.add.text(750, game.config.height/3 - 15, 'Controls', { fontFamily: 'font1', fontSize: 50}).setOrigin(0.5,0.5)
    let controls1 = this.add.text(750, game.config.height/3 + 40, 'Left and Right arrows to rotate', { fontFamily: 'font1', fontSize: 18}).setOrigin(0.5,0.5)
    let controls2 = this.add.text(750, game.config.height/3 + 80, 'Up arrow to lift off planet', { fontFamily: 'font1', fontSize: 18}).setOrigin(0.5,0.5)
    let controls3 = this.add.text(750, game.config.height/3 + 120, 'Do a 180 spin for a speed boost', { fontFamily: 'font1', fontSize: 18}).setOrigin(0.5,0.5)
    let controls4 = this.add.text(750, game.config.height/3 + 160, 'Press space for a galaxy map', { fontFamily: 'font1', fontSize: 18}).setOrigin(0.5,0.5)
    if (game.highScore > 0){
      let controls5 = this.add.text(750, game.config.height/3 + 260, "Your High Score is: " + game.highScore, { fontFamily: 'font1', fontSize: 24}).setOrigin(0.5,0.5)
    }
    

    let panel2 = this.add.sprite(0, game.config.height - 40, 'Tab').setScale(3).setOrigin(0,0)
    panel2.setInteractive();
    let creditsText = this.add.text(15, game.config.height, 'Big thanks to Kenny for hosting the Jam & providing these awesome assets! Music is by @LouieZong', { fontFamily: 'font1', fontSize: 20, wordWrap: {width: 250}, lineSpacing: 10}).setOrigin(0,0)
    panel2.on('pointerover',function(pointer){
      panel2.y = game.config.height - 300
      creditsText.y = game.config.height - 240
    })
    
    panel2.on('pointerout',function(pointer){
      panel2.y = game.config.height - 40
      creditsText.y = game.config.height
    })

    let theme = this.add.sprite(500,500, 'Theme').setOrigin(0,0).setScale(0.4)
  }
  
  update(){
    this.BG.tilePositionY -= 7
  }
}