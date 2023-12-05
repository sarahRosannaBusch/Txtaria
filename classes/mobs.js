export default class MOBS extends Phaser.Physics.Arcade.Group {
    constructor(world, scene, config) {
        super(world, scene, config); //calls constructor of the class being extended
        scene.add.existing(this); //so this will show up in the scene
        scene.physics.add.existing(this); 
        this.scene = scene;
    }

    spawn(x, y, key) {
        this.key = key;
        let mob = this.create(x, y, key).setTint(this.scene.theme.mobs);
        mob.setCollideWorldBounds(true);
        mob.allowGravity = false;
        if(key === 'bomb') {
            mob.setBounce(1);
        } else {
            mob.setBounce(0.2);
        }
        
        switch(key) {
            case "mob1":
                mob.setVelocity(Phaser.Math.Between(-200, 200), 20);
            break;
            default: break;
        }
    }
}