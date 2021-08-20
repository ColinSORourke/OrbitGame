class Preload extends Phaser.Scene
{
    constructor() {
        super("preloadScene");
    }

    preload ()
    {   
        this.load.image('Head', './assets/ColinHead.jpg');
        this.load.image('Sun', './assets/kenney_simplespace/PNG/Retina/meteor_squareLarge.png')
        this.load.image('Comet', './assets/kenney_simplespace/PNG/Retina/meteor_squareDetailedSmall.png')
        this.load.image('Ship', './assets/kenney_simplespace/PNG/Retina/ship_A.png')

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
            this.scene.start('playScene');

        }, this);
    }
}