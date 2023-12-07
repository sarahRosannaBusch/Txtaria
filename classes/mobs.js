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
            break;
            case "mob1":
                mob.setVelocity(-50, 0);
            break;
            default: break;
        }
    }
}