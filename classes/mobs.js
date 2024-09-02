export default class MOBS extends Phaser.Physics.Arcade.Group {
    constructor(world, scene, config) {
        super(world, scene, config); //calls constructor of the class being extended
        scene.add.existing(this); //so this will show up in the scene
        scene.physics.add.existing(this); 
    }

    spawn(x, y, key, dir) {
        let mob = this.create(x, y, key).setTint(this.scene.theme.mobs);
        mob.key = key;
        if(key === 'bomb') {
            mob.setBounce(1);
        } else {
            mob.setBounce(0.2);
        }
        
        switch(key) {
            case "mob0": //witchhazel
                mob.setMass(1);
                mob.tip = `
                Witchazel is fun to kick around, but
                 watch out for its poisonous thorn!`;
                mob.fine = 5;
                mob.button = `BUY ANTIDOTE`;
            break;
            case "mob1": //scuttlebot
                let x = (dir === 'right') ? 75 : -75;
                mob.setVelocity(x, 0);
                mob.setMass(20);
                mob.tip = `
                Scuttlebots have a job to do, 
                  so stay out of their way!`;
                mob.fine = 10;
                mob.button = `PAY FINE`;
            break;
            case "bomb":
                mob.setCollideWorldBounds(true);
                mob.setVelocity(-100, 50);
                mob.tip = `
                   Spiky bombs don't explode,
                but they will crush your skull!`;
                mob.fine = 15;
                mob.button = `RESURRECT`;
            break;
            default: break;
        }
    }
}