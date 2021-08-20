let config = {
    type: Phaser.WEBGL,
    width: 1000,
    height: 750,
    scene: [Preload, Play, Pause],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: true
        }
    },
  }

let game = new Phaser.Game(config);

// reserve keyboard vars
let keyUP, keyDOWN, keyLEFT, keyRIGHT, keySPACE;
let key0, key1, key2, key3, key4, key5, key6, key7, key8, key9;