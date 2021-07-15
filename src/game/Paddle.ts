import Phaser from "phaser";

export default class Paddle extends Phaser.Physics.Matter.Image 
{
    private ball?: Phaser.Physics.Matter.Image;
    private ITEM_HEIGHT: number = 0.5;

    constructor(
        world: Phaser.Physics.Matter.World, 
        x: number,
        y: number,
        texture: string, 
        config?: Phaser.Types.Physics.Matter.MatterBodyConfig)
    {
        super(world, x, y, texture, undefined, config)

        world.scene.add.existing(this)
    }

    attachBall(ball: Phaser.Physics.Matter.Image)
    {
        this.ball = ball;
        this.ball.x = this.x;
        this.ball.y = this.y - (this.height * this.ITEM_HEIGHT) - (ball.height * this.ITEM_HEIGHT);
    
        this.ball.setVelocity(0, 0);
    }

    launch()
    {
        if (!this.ball)
        {
            return;
        }

        const { width , height } = this.scene.scale;
        const x = width * this.ITEM_HEIGHT;
        const y = height * this.ITEM_HEIGHT;

        const vectorX = x - this.ball.x;
        const vectorY = y - this.ball.y;

        const vector = new Phaser
                                .Math
                                .Vector2(vectorX, vectorY)
                                .normalize()
                                .scale(8);

        this.ball.setVelocity(vector.x, vector.y);
        this.ball = undefined;
    }

    update(cursors: Phaser.Types.Input.Keyboard.CursorKeys)
    {
        const speed = 15
        if (cursors.left?.isDown) 
        {
            this.x -= speed;
        } else if (cursors.right?.isDown) {
            this.x += speed;
        }

        if (this.ball) {
            this.ball.x = this.x;
        }
    }
}