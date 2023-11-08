export default class PLATFORMS extends Phaser.Physics.Arcade.StaticGroup {
    constructor(world, scene, config) {
        super(world, scene, config); 
        scene.add.existing(this); 
        scene.physics.add.existing(this);
    }

    build(platform) {
        let numPlats = platform.length;
        for(let i = 0; i < numPlats; i++) {
            let p = platform[i];
            this.create(p.x, p.y, p.key).setOrigin(0, 0).refreshBody();
        }
    }
}