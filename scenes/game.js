class GAME extends Phaser.Scene {
    constructor() {
        super("GAME");
    }

    init() {
        this.score = 0;
        this.level = 0;
        this.helpShowing = false;
        this.soundOn = false;
        this.gameOver = false;
    }

    preload() {
        this.load.image('scroll', 'assets/scroll.png');
        this.load.image('title', 'assets/title.png');
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
        this.createStars();
                    
        this.physics.add.collider(this.player, this.platforms);  
        this.physics.add.collider(this.mobs, this.platforms);
        this.physics.add.collider(this.stars, this.platforms);

        this.physics.add.overlap(this.player, this.mobs, this.hitMob, null, this);
        this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);
    }
    
    update () { 
        if(this.gameOver) {
            const button = this.add.text(470, 384, 'retry', {
                color:'white', fontSize:'xx-large', fixedWidth: 100, fixedHeight: 35
            }).setInteractive();
            button.on('pointerup', () => {
                this.scene.restart();
            });
            return;
        } else {
            this.movePlayer();
        } 
    }

    ////////////////////////////////////////////////////////////////////
    //                            Levels                              //
    ////////////////////////////////////////////////////////////////////

    createPlatforms() {        
        switch(this.level) {
            case 0:
                this.platforms = this.physics.add.staticGroup();
                this.platforms.create(512, 748, 'ground');
        
                this.tutorial = this.physics.add.staticGroup();
                this.scroll = this.tutorial.create(512, 350, 'scroll');
                this.headerTxt = this.add.text(450, 200, 'Welcome to', {
                    fontSize: '24px', fill: '#FFF'
                });
                this.title = this.tutorial.create(512, 300, 'title');
                this.subtitle = this.add.text(380, 370, 'Where it rains money', {
                    fontSize: '24px', fill: '#FFF'
                });
                this.hint = this.add.text(290, 440, 'Hint: click the [?] to see controls and options', {
                    fontSize: '16px', fill: '#FFF', fontStyle: 'italic'
                });
            break;
            case 1:
                this.scroll.destroy();
                this.headerTxt.destroy();
                this.title.destroy();
                this.subtitle.destroy();
                this.hint.destroy();
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

    ////////////////////////////////////////////////////////////////////
    //                            Player                              //
    ////////////////////////////////////////////////////////////////////

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

    ////////////////////////////////////////////////////////////////////
    //                             Coins                              //
    ////////////////////////////////////////////////////////////////////

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
    }
        
    collectStar (player, star) {
        star.disableBody(true, true);
    
        //  Add and update the score
        this.score += 10;
        this.scoreText.setText('Score: $' + this.score);
    
        if (!this.gameOver && this.stars.countActive(true) === 0)
        {
            this.level++;            
            this.levelText.setText(`level: ${this.level} / 12`);
            this.createPlatforms();
            //  A new batch of stars to collect
            this.stars.children.iterate(function (child) {
                child.enableBody(true, child.x, 0, true, true);
            });

            if(this.helpShowing) {
                this.showHelp(false);
            } 
        }
    }

    ////////////////////////////////////////////////////////////////////
    //                         Mobile Objects                         //
    ////////////////////////////////////////////////////////////////////
    
    createMobs() {
        this.mobs = this.physics.add.group();
    }
    
    hitMob (player, mob) {
        this.physics.pause();
        player.setTint(0xff0000);
        player.anims.play('turn');
        this.gameOver = true;
    }

    ////////////////////////////////////////////////////////////////////
    //                  User Interface and Controls                   //
    ////////////////////////////////////////////////////////////////////
    
    createUI() {        
        //  Input Events
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys('W,S,A,D');
        this.input.addPointer(1); //for multi-touch

        this.scoreText = this.add.text(16, 16, 'score: $0', { fontSize: '24px', fill: '#FFF' });
        this.levelText = this.add.text(430, 24, 'level: 0 / 12', { fontSize: '24px', fill: '#FFF' });
        
        //help button
        this.helpBtn = this.add.text(1024 - 80, 16, '[?]', { fontSize: '24px', fill: '#FFF' }).setOrigin(1, 0).setInteractive();
        this.helpBtn.on('pointerup', function () {            
            this.showHelp(!this.helpShowing);
        }, this);                
        this.input.keyboard.on('keydown-ESC', () => {
            this.showHelp(!this.helpShowing);
        });

        //fullscreen button
        this.fsBtn = this.add.text(1024 - 16, 16, '[+]', { fontSize: '24px', fill: '#FFF' }).setOrigin(1, 0).setInteractive();
        this.fsBtn.on('pointerup', function () {
            this.toggleFullscreen();
        }, this);
    }

    toggleFullscreen() {
        if (this.scale.isFullscreen) {
            this.scale.stopFullscreen();
            this.fsBtn.setText("[+]");
        } else {
            this.scale.startFullscreen();
            this.fsBtn.setText("[-]");
        }
    }

    toggleSound() {
        this.soundOn = !this.soundOn;
        //todo
    }

    showHelp(show) {     
        if(show) {   
            this.physics.pause();
            this.helpBtn.setText("[X]");
            this.helpScroll = this.tutorial.create(512, 350, 'scroll');
            let fs = this.scale.isFullscreen ? 'X' : ' ';
            this.helpText = this.add.text(200, 180, `
KEYBOARD CONTROLS:
w,a,s,d or arrow keys

TWO-FINGER TOUCH:
1. hold left/right side of screen to move
2. tap anywhere to jump
3. swipe down to stomp

OPTIONS:
            `, { fontSize: '24px', fill: '#FFF' });

            this.optFS = this.add.text(200, 415, `[${fs}] fullscreen`,
                { fontSize: '24px', fill: '#FFF' }).setInteractive();
            this.optFS.on('pointerup', () => {
                this.toggleFullscreen();
                fs = this.scale.isFullscreen ? ' ' : 'X';
                this.optFS.setText(`[${fs}] fullscreen`);
            });

            let s = this.soundOn ? 'X' : ' ';
            this.optSound = this.add.text(200, 435, `[${s}] sound`,
                { fontSize: '24px', fill: '#FFF' }).setInteractive();
            this.optSound.on('pointerup', () => {
                this.toggleSound();
                s = this.soundOn ? 'X' : ' ';
                this.optSound.setText(`[${s}] sound`);
            });
        } else {
            this.physics.resume();
            this.helpBtn.setText("[?]");
            this.helpScroll.destroy();
            this.helpText.destroy();
            this.optFS.destroy();
            this.optSound.destroy();
        }
        
        this.helpShowing = !this.helpShowing;
    }
}