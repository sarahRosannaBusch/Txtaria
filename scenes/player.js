export default class PLAYER extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame); //calls constructor of the class being extended
        scene.add.existing(this); //so this will show up in the scene
        scene.physics.add.existing(this);
        this.setInteractive();
        this.setBounce(0.2);
        this.createAnims(scene);
    }

    createAnims(scene) {
        //  Player animations, turning, walking left and walking right.    
        scene.anims.create({
            key: 'turn',
            frames: [ { key: 'dude', frame: 0 } ],
            frameRate: 20
        });

        scene.anims.create({
            key: 'left',
            frames: scene.anims.generateFrameNumbers('dude', { start: 1, end: 3 }),
            frameRate: 8,
            repeat: -1
        });
    
        scene.anims.create({
            key: 'right',
            frames: scene.anims.generateFrameNumbers('dude', { start: 6, end: 8 }),
            frameRate: 8,
            repeat: -1
        });

        scene.anims.create({
            key: 'dance',
            frames: scene.anims.generateFrameNumbers('dude', { start: 0, end: 12 }),
            frameRate: 8,
            repeat: -1
        });        

        scene.anims.create({
            key: 'jump',
            frames: [ { key: 'dude', frame: 11 } ],
            frameRate: 20,
            repeat: -1
        });      

        scene.anims.create({
            key: 'jumpRight',
            frames: [ { key: 'dude', frame: 5 } ],
            frameRate: 20,
            repeat: -1
        });      

        scene.anims.create({
            key: 'jumpLeft',
            frames: [ { key: 'dude', frame: 4 } ],
            frameRate: 20,
            repeat: -1
        });

        scene.anims.create({
            key: 'stomp',
            frames: [ { key: 'dude', frame: 12 } ],
            frameRate: 20,
            repeat: -1
        });
    }

    playAnims(dir, jump, stomp) {
        if(dir === 'left') {
            this.setVelocityX(-260);
            if(jump) {
                this.anims.play('jumpLeft', true);
            } else {
                this.anims.play('left', true);
            }
        } else if(dir === 'right') {
            this.setVelocityX(260);
            if(jump) {
                this.anims.play('jumpRight', true);
            } else {
                this.anims.play('right', true);
            }
        } else {
            this.setVelocityX(0);
            if(jump) {                
                this.anims.play('jump');
            } else if(stomp) {
                this.anims.play('stomp');
                this.setVelocityY(330);
            } else {
                this.anims.play('turn');
            }
        }        
    
        if(jump && this.body.touching.down){
            this.setVelocityY(-400);
        }
    }
}