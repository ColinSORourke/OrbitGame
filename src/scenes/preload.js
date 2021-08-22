class Preload extends Phaser.Scene
{
    constructor() {
        super("preloadScene");
    }

    preload ()
    {   
        this.load.image('Head', './assets/ColinHead.jpg');
        this.load.image('meteor_000', './assets/kenney_simplespace/PNG/Retina/meteor_small.png')
        this.load.image('meteor_001', './assets/kenney_simplespace/PNG/Retina/meteor_large.png')
        this.load.image('meteor_100', './assets/kenney_simplespace/PNG/Retina/meteor_squareSmall.png')
        this.load.image('meteor_101', './assets/kenney_simplespace/PNG/Retina/meteor_squareLarge.png')
        this.load.image('meteor_010', './assets/kenney_simplespace/PNG/Retina/meteor_detailedSmall.png')
        this.load.image('meteor_011', './assets/kenney_simplespace/PNG/Retina/meteor_detailedLarge.png')
        this.load.image('meteor_110', './assets/kenney_simplespace/PNG/Retina/meteor_squareDetailedSmall.png')
        this.load.image('meteor_111', './assets/kenney_simplespace/PNG/Retina/meteor_squareDetailedLarge.png')
        this.load.image('starA', './assets/kenney_simplespace/PNG/Retina/star_large.png')
        this.load.image('starB', './assets/kenney_simplespace/PNG/Retina/star_medium.png')
        this.load.image('starParticle', './assets/kenney_simplespace/PNG/Retina/star_small.png')
        this.load.image('Ship', './assets/kenney_simplespace/PNG/Retina/ship_L.png')
        this.load.image('Trail', './assets/kenney_simplespace/PNG/Retina/effect_purple.png')
        this.load.image('UISquare', './assets/uipack-space/PNG/glassPanel_cornerBR.png')
        this.load.image('Satellite', './assets/kenney_simplespace/PNG/Retina/satellite_A.png')
        this.load.image('Enemy', './assets/kenney_simplespace/PNG/Retina/enemy_A.png')

        this.load.image('BG', './assets/spaceshooter/Backgrounds/blue.png')

        this.load.svg('FullSet', './assets/kenney_simplespace/Vector/simpleSpace_vector.svg', { scale: 1})

        // https://twitter.com/everydaylouie/status/1253021154857508864 
        this.load.audio('Cycad', './assets/LZ_Greenhouse/CycadConga.mp3')

        //this.load.audio('test', './assets/spaceshooter/Bonus/sfx_twoTone.ogg')

        this.createProgressbar(game.config.width / 2, game.config.height / 2);
    }

    createProgressbar (x, y)
    {
        // size & position
        let width = 400;
        let height = 20;
        let xStart = x - width / 2;
        let yStart = y - height / 2;

        // border size
        let borderOffset = 2;

        let borderRect = new Phaser.Geom.Rectangle(
            xStart - borderOffset,
            yStart - borderOffset,
            width + borderOffset * 2,
            height + borderOffset * 2);

        let border = this.add.graphics({
            lineStyle: {
                width: 5,
                color: 0xaaaaaa
            }
        });
        border.strokeRectShape(borderRect);

        let progressbar = this.add.graphics();

        /**
         * Updates the progress bar.
         * 
         * @param {number} percentage 
         */
        let updateProgressbar = function (percentage)
        {
            progressbar.clear();
            progressbar.fillStyle(0xffffff, 1);
            progressbar.fillRect(xStart, yStart, percentage * width, height);
        };

        this.load.on('progress', updateProgressbar);

        this.load.once('complete', function ()
        {

            this.load.off('progress', updateProgressbar);
            this.scene.start('menuScene');

        }, this);
    }
}