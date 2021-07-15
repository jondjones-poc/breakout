import Phaser from "phaser";

export default class Paddle extends Phaser.Physics.Matter.Image 
{
    private ball?: Phaser.Physics.Matter.Image;
    private ballHeight: number = 0.5;

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
        this.ball.y = this.y - this.height * this.ballHeight - (ball.height * this.ballHeight);
    
        this.ball.setVelocity(0, 0);
    }

    update(cursors: Phaser.Types.Input.Keyboard.CursorKeys)
    {
        const speed = 10
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