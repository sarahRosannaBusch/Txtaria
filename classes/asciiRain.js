export default class ASCIIRAIN extends Phaser.Physics.Arcade.Group {
    constructor(world, scene, config) {
        super(world, scene, config); //calls constructor of the class being extended
        scene.add.existing(this); //so this will show up in the scene
        scene.physics.add.existing(this); 
        let dropWidth = 16.2;   
        let numDrops = 1024 / dropWidth;
        for(let i = 0; i < numDrops; i++) {
            let x = i * dropWidth;
            let drop = scene.physics.add.sprite(x, 0, 'asciiRain');
            drop.setDepth(50);  
            drop.disableBody(true, true); 
            this.add(drop);
        } 
    }

    rain() {
        this.children.iterate(function (child) {
            child.enableBody(true, child.x, Phaser.Math.Between(-500, -750), true, true);
            child.setVelocityY(Phaser.Math.FloatBetween(-150, 300));    
            child.setFrame(Phaser.Math.Between(0, 4));
        }); 
    }
}