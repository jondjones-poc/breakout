import Phaser from "phaser";

export default class GameOver extends Phaser.Scene 
{
    constructor()
    {
        super('game-over')
    }

    create(data: { title: string, color: string})
    {
        const { width, height } = this.scale;

        this.add.text(width * 0.5, height * 0.5, data.title, {
            fontSize: '48px',
            color: '#fff',
            backgroundColor: data.color || '#D82727',
            padding: { left: 0, right: 10, top: 10, bottom: 10 }
        })
    }

}
