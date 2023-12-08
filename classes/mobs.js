export default class MOBS extends Phaser.Physics.Arcade.Group {
    constructor(world, scene, config) {
        super(world, scene, config); //calls constructor of the class being extended
        scene.add.existing(this); //so this will show up in the scene
        scene.physics.add.existing(this); 
    }

    spawn(x, y, key) {
        let mob = this.create(x, y, key).setTint(this.scene.theme.mobs);
        mob.key = key;
        if(key === 'bomb') {
            mob.setBounce(1);
        } else {
            mob.setBounce(0.2);
        }
        
        switch(key) {
            case "mob0":
                mob.setCollideWorldBounds(true);
                mob.tip = `
                You can safely kick witchhazel,
                but don't land on it's pointy hat!`;
            break;
            case "mob1":
                mob.setVelocity(-50, 0);
                mob.tip = `
                Scuttlebots will run you down, 
                so stay out of their way.`;
            break;
            case "bomb":
                mob.setCollideWorldBounds(true);
                mob.setVelocity(-100, 50);
                mob.tip = `
                Spiky bombs don't usually explode,
                but getting hit by one still hurts.`;
            break;
            default: break;
        }
    }
}