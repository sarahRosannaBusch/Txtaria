class LVL_0 extends Phaser.Scene {
    constructor() {
        super({key:"LVL_0"});
        this.score = 0;
        this.gameOver = false;
    }

    preload() {
        this.load.image('ground', 'assets/ground.png');
        this.load.image('scroll', 'assets/scroll.png');
        this.load.image('header', 'assets/header.png');
        this.load.spritesheet('dude', 'assets/dude.png', { 
            frameWidth: 51.888, frameHeight: 98 
        });
        //this.soundFX = this.load.audio('sound', ['assets/sound.mp3]);
        //this.soundFX.play();
    }

    create () {
        // Platforms
        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(512, 748, 'ground');

        this.tutorial = this.physics.add.staticGroup();
        this.tutorial.create(512, 350, 'scroll');
        this.tutorial.create(512, 300, 'header');

        this.createPlayer();
            
        //  Collide the player and the ground
        this.physics.add.collider(this.player, this.platforms);
    
        //  Input Events
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys('W,S,A,D');
        this.input.addPointer(1); //for multi-touch
        
        this.scene.run('UI_SCENE');
    }
    
    update () {    
        this.dirPointer = this.input.pointer1;
        this.jumpPointer = this.input.pointer2;
    
        this.jump = this.jumpPointer.isDown ? true : false;
    
        if(this.dirPointer.isDown) {
            let x = this.dirPointer.position.x;
            if(x > 400) {
                this.dir = 'right';
            } else {            
                this.dir = 'left';
            }
        } else {
            this.dir = false;
            if(this.dirPointer.getDuration() > 0 && this.dirPointer.getDuration() < 150) {
                //if dirPointer isn't down and screen is tapped, jump
                this.jump = true;
            }
        }
    
        if (this.dir === 'left' || this.cursors.left.isDown || this.wasd.A.isDown) {
            this.player.setVelocityX(-160);
            this.player.anims.play('left', true);
        }
        else if (this.dir === 'right' || this.cursors.right.isDown || this.wasd.D.isDown) {
            this.player.setVelocityX(160);
            this.player.anims.play('right', true);
        }
        else {
            this.player.setVelocityX(0);
            this.player.anims.play('turn');
        }
    
        if ((this.jump === true || this.cursors.up.isDown || this.wasd.W.isDown) && this.player.body.touching.down){
            this.player.setVelocityY(-330);
        }
    }

    createPlayer() {                
        // The player and its settings
        this.player = this.physics.add.sprite(100, 650, 'dude');
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);
    
        //  Player animations, turning, walking left and walking right.
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 2 }),
            frameRate: 8,
            repeat: -1
        });
    
        this.anims.create({
            key: 'turn',
            frames: [ { key: 'dude', frame: 3 } ],
            frameRate: 20
        });
    
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 4, end: 6 }),
            frameRate: 8,
            repeat: -1
        });
    }
}