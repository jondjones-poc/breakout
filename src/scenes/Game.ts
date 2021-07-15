import Phaser from "phaser";
import Paddle from "~/game/Paddle";

export default class Game extends Phaser.Scene 
{
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
    private paddle!: Paddle;
    private ball!: Phaser.Physics.Matter.Image;
    private blocks: Phaser.Physics.Matter.Image[] = [];
        
    private livesLabel!: Phaser.GameObjects.Text;
    private lives = 3;

    constructor()
    {
        super('game')
    }

    init()
    {
        this.cursors = this.input.keyboard.createCursorKeys();
        this.lives = 3;
    }

    create()
    {
        const { width, height } = this.scale;


		const map = this.make.tilemap({ key: 'level1' })
		const tileSet = map.addTilesetImage('block', 'block')

		map.createLayer('Level', tileSet, 0, 0);
        this.blocks = map.createFromTiles(1, 0, {key: 'block'})
            .map(tile => {
                tile.x += tile.width * 0.5
                tile.y += tile.height * 0.5

                const block = this.matter
                                    .add.gameObject(tile, { isStatic: true});
                block.setData('type', 'block');
                return block as Phaser.Physics.Matter.Sprite;
        })

        this.ball = this.matter.add.image(
            400, 
            300, 
            'ball',
            undefined,
            {
                circleRadius: 12
            });

        this.ball.setFriction(0, 0);
        this.ball.setBounce(1.1);

        const body =  this.ball.body as MatterJS.BodyType;
        this.matter.body.setInertia(body, Infinity);

        this.paddle = new Paddle(
            this.matter.world,
            width * 0.5, 
            height * 0.9, 
            'paddle',
            {
                isStatic: true,
                chamfer: {
                    radius: 16
                }
            }
        );

        this.paddle.attachBall(this.ball);
        this.livesLabel = this.add.text(10, 1, `Lives: ${this.lives}`)
        this.ball.setOnCollide(this.handleBallCollide.bind(this));
    }

    update(t: number, dt: number)
    {
        if (this.ball.y > this.scale.height + 100) 
        {
            --this.lives;
            this.livesLabel.text = `Lives: ${this.lives}`;

            if (this.lives <= 0)
            {
                this.scene.start('game-over', { title: 'Game Over'});
                return;
            }

            this.paddle.attachBall(this.ball);
            return;
        }

        const spaceDown = Phaser.Input.Keyboard.JustDown(this.cursors.space!);
        if (spaceDown)
        {
            this.paddle.launch();
        }

        this.paddle.update(this.cursors);
    }

    private handleBallCollide(data: Phaser.Types.Physics.Matter.MatterCollisionData)
    {
        const { bodyA } = data;

        if (!bodyA.gameObject) {
            return;
        }

        const gameObjectA  = bodyA.gameObject as Phaser.GameObjects.GameObject;
        if (gameObjectA.getData('type') !== 'block') {
            this.sound.play('paddle-tone');
            return;
        }

        const index = this.blocks.findIndex(block => block === gameObjectA)
        if (index >= 0)
        {
            this.blocks.splice(index, 1)
        }

        this.sound.play('tone1');
        gameObjectA.destroy(true);
        if (this.blocks.length <= 0)
        {
            this.scene.start('game-over', { title: 'You Win', color: '#42f563'});
        }
    }
}