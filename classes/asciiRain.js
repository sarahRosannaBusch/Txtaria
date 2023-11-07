export default class ASCIIRAIN extends Phaser.Physics.Arcade.Group {
    constructor(world, scene, config) {
        super(world, scene, config); //calls constructor of the class being extended
        scene.add.existing(this); //so this will show up in the scene
        scene.physics.add.existing(this);    
        for(let i = 0; i < 103; i++) {
            let x = i * 10;
            let drop = scene.physics.add.sprite(x, 0, 'asciiRain');
            drop.setDepth(50);  
            drop.disableBody(true, true); 
            this.add(drop);
        } 
    }

    rain() {
        this.children.iterate(function (child) {
            child.enableBody(true, child.x, Phaser.Math.FloatBetween(-500, -750), true, true);
            child.setVelocityY(Phaser.Math.FloatBetween(-50, 300));    
            child.setFrame(Phaser.Math.Between(0, 4));
        }); 
    }
}