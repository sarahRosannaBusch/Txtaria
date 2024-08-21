export default class PLAYER extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame); //calls constructor of the class being extended
        
        this.scene.add.existing(this); //so this will show up in the scene
        this.scene.physics.add.existing(this);
        this.setInteractive();
        this.setBounce(0.25);
        this.setDepth(25); //z-index
        this.setTint(scene.theme.player);
        this.createAnims();

        //  Input Events
        this.cursors = scene.input.keyboard.createCursorKeys();
        this.wasd = scene.input.keyboard.addKeys('W,S,A,D');
        scene.input.addPointer(1); //for multi-touch
        this.touchY = 0;
        this.click = 0; //duration of last click
    }

    createAnims() {
        //  Player animations, turning, walking left and walking right.    
        this.scene.anims.create({
            key: 'turn',
            frames: [ { key: 'dude', frame: 0 } ],
            frameRate: 20
        });

        this.scene.anims.create({
            key: 'left',
            frames: this.scene.anims.generateFrameNumbers('dude', { start: 1, end: 3 }),
            frameRate: 8,
            repeat: -1
        });
    
        this.scene.anims.create({
            key: 'right',
            frames: this.scene.anims.generateFrameNumbers('dude', { start: 6, end: 8 }),
            frameRate: 8,
            repeat: -1
        });

        this.scene.anims.create({
            key: 'dance',
            frames: this.scene.anims.generateFrameNumbers('dude', { start: 0, end: 12 }),
            frameRate: 8,
            repeat: -1
        });        

        this.scene.anims.create({
            key: 'jump',
            frames: [ { key: 'dude', frame: 11 } ],
            frameRate: 20,
            repeat: -1
        });      

        this.scene.anims.create({
            key: 'jumpRight',
            frames: [ { key: 'dude', frame: 5 } ],
            frameRate: 20,
            repeat: -1
        });      

        this.scene.anims.create({
            key: 'jumpLeft',
            frames: [ { key: 'dude', frame: 4 } ],
            frameRate: 20,
            repeat: -1
        });

        this.scene.anims.create({
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

    //based on user input
    move() {
        let dirPointer = this.scene.input.pointer1;
        let jumpPointer = this.scene.input.pointer2;
    
        let jump = jumpPointer.isDown ? true : false;
        let stomp = false;
        let dir;
    
        //touch controls
        if(dirPointer.isDown) {
            let x = dirPointer.position.x;
            let y = dirPointer.position.y;
            if(this.scene.touchY === 0) {
                this.scene.touchY = y;
            } else if(y > this.scene.touchY) {                
                stomp = true;
                //console.log('touchY: ' + this.touchY);
            } else {
                if(x > 400) {
                    dir = 'right';
                } else {            
                    dir = 'left';
                }
            }
        } else {            
            this.scene.touchY = 0;
            dir = false;
            let dur = dirPointer.getDuration();
            if((this.click !== dur) && (dur > 0) && (dur < 150)) {
                //if dirPointer isn't down and screen is tapped, jump
                jump = true;
                this.click = dur; //to disable autojumping
            }
        }

        //keyboard controls
        if(this.cursors.left.isDown || this.wasd.A.isDown) {
            dir = 'left';
        } else if(this.cursors.right.isDown || this.wasd.D.isDown) {
            dir = 'right';
        }

        if(Phaser.Input.Keyboard.JustDown(this.cursors.up) || Phaser.Input.Keyboard.JustDown(this.wasd.W)) {
            jump = true;
        } else if(this.cursors.down.isDown || this.wasd.S.isDown) {
            stomp = true;
        }
    
        this.playAnims(dir, jump, stomp);
    }
}