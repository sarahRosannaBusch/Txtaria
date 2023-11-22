export default class ASCIIRAIN extends Phaser.Physics.Arcade.Group {
    constructor(world, scene, config) {
        super(world, scene, config);
        scene.add.existing(this);
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
            child.enableBody(true, child.x, Phaser.Math.Between(-750, -1000), true, true);
            child.setVelocityY(Phaser.Math.FloatBetween(-150, 300));    
            child.setFrame(Phaser.Math.Between(0, 4));
        }); 
    }
}