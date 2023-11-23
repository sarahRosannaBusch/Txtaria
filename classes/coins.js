export default class COINS extends Phaser.Physics.Arcade.Group {
    constructor(world, scene, config) {
        super(world, scene, config); //calls constructor of the class being extended
        scene.add.existing(this); //so this will show up in the scene
        scene.physics.add.existing(this);
        this.children.iterate(function (child) {
            child.setDepth(20);
            child.setTint(scene.theme.coins);
            child.disableBody(true, true); //wait for trigger to rain coins
        }); 
    }

    rain() {
        //  A new batch of coins to collect
        this.children.iterate(function (child) {
            child.enableBody(true, child.x, Phaser.Math.FloatBetween(0, -75), true, true);
            child.setBounceY(Phaser.Math.FloatBetween(0.2, 0.4));
            child.setVelocityY(Phaser.Math.FloatBetween(0, 250));
        });
    }

    bounce() {
        this.children.iterate(function (child) {
            if(child.body.touching.down) {
                child.setVelocityY(Phaser.Math.FloatBetween(-25, -75));
            }
        });
    }
}