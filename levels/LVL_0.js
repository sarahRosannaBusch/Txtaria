class LVL_0 extends Phaser.Scene {
    constructor() {
        super({key:"LVL_0"});
        this.score = 0;
        this.level = 0;
        this.gameOver = false;
    }

    preload() {
        this.load.image('scroll', 'assets/scroll.png');
        this.load.image('header', 'assets/header.png');
        this.load.image('ground', 'assets/ground.png');
        this.load.image('platform0', 'assets/platform0.png');
        this.load.image('platform1', 'assets/platform1.png');
        this.load.image('platform2', 'assets/platform2.png');
        this.load.image('platform3', 'assets/platform3.png');
        this.load.image('star', 'assets/star.png');
        this.load.image('healthPot', 'assets/healthPot.png');
        this.load.image('mob0', 'assets/mob0.png');    
        this.load.image('mob1', 'assets/mob1.png');
        this.load.image('bomb', 'assets/bomb.png');
        this.load.spritesheet('dude', 'assets/dude.png', { 
            frameWidth: 51.888, frameHeight: 98 
        });
        //this.soundFX = this.load.audio('sound', ['assets/sound.mp3]);
        //this.soundFX.play();
    }

    create () {    
        this.createUI();    
        this.createPlatforms();
        this.createPlayer();
        this.createMobs();
                    
        this.physics.add.collider(this.player, this.platforms);    
    }
    
    update () {    
        this.movePlayer();
    }

    createUI() {        
        //  Input Events
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys('W,S,A,D');
        this.input.addPointer(1); //for multi-touch

        this.scoreText = this.add.text(16, 16, 'score: $0', { fontSize: '32px', fill: '#FFF' });
        
        const button = this.add.text(1024 - 16, 16, '[+]', { fontSize: '32px', fill: '#FFF' }).setOrigin(1, 0).setInteractive();
        button.on('pointerup', function () {
            if (this.scale.isFullscreen) {
                this.scale.stopFullscreen();
            } else {
                this.scale.startFullscreen();
            }
        }, this);
    }

    createPlatforms() {        
        switch(this.level) {
            case 0:
                this.platforms = this.physics.add.staticGroup();
                this.platforms.create(512, 748, 'ground');
        
                this.tutorial = this.physics.add.staticGroup();
                this.scroll = this.tutorial.create(512, 350, 'scroll');
                let title = this.tutorial.create(512, 300, 'header');
                let subtitle = this.add.text(430, 380, 'Where it rains money', {
                    fontSize: '16px', fill: '#FFF'
                });

                let button = this.add.text(470, 420, '[Play]', { 
                    fontSize: '32px', fill: '#FFF' 
                }).setInteractive();
                
                button.on('pointerup', () => {
                    //this.scene.start("LVL_X");
                    title.destroy();
                    subtitle.destroy();
                    button.destroy();

                    this.text = this.add.text(200, 180, `
KEYBOARD CONTROLS:
w,a,s,d or arrow keys

TWO-FINGER TOUCH:
1. hold left/right side of screen to move
2. tap anywhere to jump
3. swipe down to stomp

OPTIONS:
[ ] fullscreen
[X] sound
                    `, { fontSize: '24px', fill: '#FFF' });
                    
                    this.createStars();
                });
            break;
            case 1:
                this.scroll.destroy();
                this.text.destroy();
                this.platforms.create(420, 250, 'platform0').setOrigin(0, 0).refreshBody();
                this.platforms.create(744, 370, 'platform1').setOrigin(0, 0).refreshBody();
                this.platforms.create(5, 410, 'platform2').setOrigin(0, 0).refreshBody();
                this.platforms.create(460, 550, 'platform3').setOrigin(0, 0).refreshBody();
            break;
            case 2:                
                var x = (this.player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
                var mob = this.mobs.create(x, 16, 'mob0');
                mob.setBounce(0.2);
                mob.setCollideWorldBounds(true);
                mob.setVelocity(Phaser.Math.Between(-200, 200), 20);
                mob.allowGravity = true;
            break;
            case 3:
                var x = (this.player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
                var mob = this.mobs.create(x, 16, 'mob1');
                mob.setBounce(0.2);
                mob.setCollideWorldBounds(true);
                mob.setVelocity(Phaser.Math.Between(-200, 200), 20);
                mob.allowGravity = false;
            break;
            case 4:
                var x = (this.player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
                var bomb = this.mobs.create(x, 16, 'bomb');
                bomb.setBounce(1);
                bomb.setCollideWorldBounds(true);
                bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
                bomb.allowGravity = false;
            break;
            default: break;
        }
    }

    createMobs() {
        this.mobs = this.physics.add.group();
        this.physics.add.collider(this.mobs, this.platforms);
        this.physics.add.collider(this.mobs, this.player);
        this.physics.add.overlap(this.player, this.mobs, this.hitMob, null, this);
    }

    createPlayer() {                
        // The player and its settings
        this.player = this.physics.add.sprite(350, 650, 'dude');
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

    movePlayer() {
        let dirPointer = this.input.pointer1;
        let jumpPointer = this.input.pointer2;
    
        let jump = jumpPointer.isDown ? true : false;
        let dir;
    
        if(dirPointer.isDown) {
            let x = dirPointer.position.x;
            if(x > 400) {
                dir = 'right';
            } else {            
                dir = 'left';
            }
        } else {
            dir = false;
            if(dirPointer.getDuration() > 0 && dirPointer.getDuration() < 150) {
                //if dirPointer isn't down and screen is tapped, jump
                jump = true;
            }
        }
    
        if (dir === 'left' || this.cursors.left.isDown || this.wasd.A.isDown) {
            this.player.setVelocityX(-260);
            this.player.anims.play('left', true);
        }
        else if (dir === 'right' || this.cursors.right.isDown || this.wasd.D.isDown) {
            this.player.setVelocityX(260);
            this.player.anims.play('right', true);
        }
        else {
            this.player.setVelocityX(0);
            this.player.anims.play('turn');
        }
    
        if ((jump === true || this.cursors.up.isDown || this.wasd.W.isDown) && this.player.body.touching.down){
            this.player.setVelocityY(-330);
        }
    }

    createStars() {  
        this.stars = this.physics.add.group({
            key: 'star',
            repeat: 11,
            setXY: { x: 25, y: 0, stepX: 85 }
        });            
        this.stars.children.iterate(function (child) {
            //  Give each star a slightly different bounce
            child.setBounceY(Phaser.Math.FloatBetween(0.2, 0.4));
        });        

        this.physics.add.collider(this.stars, this.platforms);
        this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);
    }
        
    collectStar (player, star) {
        star.disableBody(true, true);
    
        //  Add and update the score
        this.score += 10;
        this.scoreText.setText('Score: $' + this.score);
    
        if (!this.gameOver && this.stars.countActive(true) === 0)
        {
            this.level++;
            this.createPlatforms();
            //  A new batch of stars to collect
            this.stars.children.iterate(function (child) {
                child.enableBody(true, child.x, 0, true, true);
            });
        }
    }
    
    hitMob (player, mob) {
        this.physics.pause();
        player.setTint(0xff0000);
        player.anims.play('turn');
        this.gameOver = true;
    }
}