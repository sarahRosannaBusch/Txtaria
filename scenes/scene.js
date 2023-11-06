export default class SCENE extends Phaser.Scene {
    constructor() {
        super("SCENE");
    }

    init() {
        this.score = 0;
        this.level = 0;
        this.helpShowing = false;
        this.soundOn = false;
        this.tick = 0;
        this.hintIdx = 0;
        this.tweening = true;
        this.gameOver = false;
        this.touchY = 0;
    }

    preload() {  
        this.load.spritesheet('asciiRain', 'assets/asciiRain.png', { 
            frameWidth: 10, frameHeight: 1059
        });      
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
        this.base = this.physics.add.staticGroup();
        this.platforms = this.physics.add.staticGroup();

        this.createTutorial();     
        this.createMobs();
        this.createStars();
        this.createRain();
        this.createPlatforms();
        this.createPlayer();
        this.createUI(); 
                    
        this.physics.add.collider(this.player, this.base);  
        this.physics.add.collider(this.player, this.platforms);  
        this.physics.add.collider(this.mobs, this.base); 
        this.physics.add.collider(this.mobs, this.platforms);
        this.physics.add.collider(this.stars, this.base);
        this.physics.add.collider(this.stars, this.platforms);

        this.physics.add.overlap(this.player, this.mobs, this.hitMob, null, this);
        this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);

        this.playTween();
    }
    
    update (time, delta) { 
        if(this.gameOver) {
            this.rollCredits();
        } else {
            if(!this.tweening) {
                this.movePlayer();
                if(time - this.tick > 5000) {
                    this.tick = time;
                    this.bounceStars();
                    if(this.level === 0) {
                        this.changeHint();
                    }
                }
            }
        } 
    }

    ////////////////////////////////////////////////////////////////////
    //                            Tweens                              //
    ////////////////////////////////////////////////////////////////////

    playTween() {
        let params = [{
            at: 0,
            run: () => {
                this.tweening = true;
            }
        }, {
            at: 3000,
            run: () => {
                this.tweening = false;
            }
        }];
        if(this.level === 0) {
            params.push({
                    at: 0,
                    run: () => {
                        this.rainAscii();
                    }
                }, {
                    at: 600,
                    tween: {
                        targets: this.tutorial,
                        y: 0, 
                        ease: 'Power0',
                        duration: 2000
                    }
                }, {
                    at: 1000,
                    run: () => {
                        this.player.setCollideWorldBounds(true);
                    }
                }, {
                    at: 1500,
                    run: () => {
                        this.rainCoins();
                    }
                }
            );
        } else {
            params.push({
                    at: 0,
                    run: () => {                        
                        this.player.anims.play('dance');
                    }
                }, {
                    at: 250,
                    run: () => {
                        this.rainAscii();
                    }
                }, {
                    at: 2000,
                    run: () => {
                        this.createPlatforms();
                    }
                }, {
                    at: 2500,
                    run: () => {
                        this.rainCoins();
                    },
                    tween: {
                        targets: this.player,
                        x: 375,
                        ease: 'Power0',
                        duration: 1000
                    }
                }
            );
        }
        const timeline = this.add.timeline(params);
        timeline.play();
    }

    createRain() {  
        this.asciiRain = this.physics.add.group();    
        for(let i = 0; i < 103; i++) {
            let x = i * 10;
            let drop = this.physics.add.sprite(x, 0, 'asciiRain');
            drop.setDepth(50);  
            drop.disableBody(true, true); 
            this.asciiRain.add(drop);
        }   
    }

    rainAscii() {       
        this.asciiRain.children.iterate(function (child) {
            child.enableBody(true, child.x, Phaser.Math.FloatBetween(-500, -750), true, true);
            child.setVelocityY(Phaser.Math.FloatBetween(-50, 300));    
            child.setFrame(Phaser.Math.Between(0, 4));
        });      
    }

    ////////////////////////////////////////////////////////////////////
    //                            Levels                              //
    ////////////////////////////////////////////////////////////////////

    levelUp() {
        this.level++;            
        this.levelText.setText(`level: ${this.level} / 12`);
        this.playTween();

        if(this.helpShowing) {
            this.showHelp(false);
        } 
    }

    createTutorial() {        
        let scroll = this.add.image(0, 350, 'scroll');
        let headerTxt = this.add.text(0, 200, 'Welcome to', {
            fontSize: '24pt', fill: '#FFF'
        }).setOrigin(0.5);                
        let title = this.add.image(0, 275, 'title').setOrigin(0.5);
        let subtitle = this.add.text(0, 365, 'Where ASCII rains', {
            fontSize: '24pt', fill: '#FFF'
        }).setOrigin(0.5);
        this.hints = [
            'Click the [?] to see controls and options',
            'Click the [+] or [-] to toggle fullscreen',
            'Collect all the {$} to progress to next level'
        ]
        this.hint = this.add.text(0, 430, this.hints[0], {
            fontSize: '18pt', fill: '#FFF', fontStyle: 'italic'
        }).setOrigin(0.5);
        this.tutorial = this.add.container(512, -700, [scroll, headerTxt, title, subtitle, this.hint]);
    }

    createPlatforms() {        
        switch(this.level) {
            case 0:
                this.ground = this.base.create(512, 748, 'ground').setDepth(75);
            break;
            case 1:
                this.tutorial.destroy();
                this.platforms.create(420, 300, 'platform0').setOrigin(0, 0).refreshBody();
                this.platforms.create(744, 440, 'platform1').setOrigin(0, 0).refreshBody();
                this.platforms.create(5, 460, 'platform2').setOrigin(0, 0).refreshBody();
                this.platforms.create(460, 600, 'platform3').setOrigin(0, 0).refreshBody();
            break;
            case 2: 
                this.platforms.clear(true, true);
            break;
            case 3:
                var x = (this.player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
                var mob = this.mobs.create(x, 16, 'mob0');
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
        this.player = this.physics.add.sprite(375, -250, 'dude');
        this.player.setBounce(0.2);
        //this.player.setCollideWorldBounds(true);
    
        //  Player animations, turning, walking left and walking right.    
        this.anims.create({
            key: 'turn',
            frames: [ { key: 'dude', frame: 0 } ],
            frameRate: 20
        });

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 1, end: 3 }),
            frameRate: 8,
            repeat: -1
        });
    
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 6, end: 8 }),
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: 'dance',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 12 }),
            frameRate: 8,
            repeat: -1
        });        

        this.anims.create({
            key: 'jump',
            frames: [ { key: 'dude', frame: 11 } ],
            frameRate: 20,
            repeat: -1
        });      

        this.anims.create({
            key: 'jumpRight',
            frames: [ { key: 'dude', frame: 5 } ],
            frameRate: 20,
            repeat: -1
        });      

        this.anims.create({
            key: 'jumpLeft',
            frames: [ { key: 'dude', frame: 4 } ],
            frameRate: 20,
            repeat: -1
        });

        this.anims.create({
            key: 'stomp',
            frames: [ { key: 'dude', frame: 12 } ],
            frameRate: 20,
            repeat: -1
        });
    }

    movePlayer() {
        let dirPointer = this.input.pointer1;
        let jumpPointer = this.input.pointer2;
    
        let jump = jumpPointer.isDown ? true : false;
        let stomp = false;
        let dir;
    
        //touch controls
        if(dirPointer.isDown) {
            let x = dirPointer.position.x;
            let y = dirPointer.position.y;
            if(this.touchY === 0) {
                this.touchY = y;
            } else if(y > this.touchY) {                
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
            this.touchY = 0;
            dir = false;
            if(dirPointer.getDuration() > 0 && dirPointer.getDuration() < 150) {
                //if dirPointer isn't down and screen is tapped, jump
                jump = true;
            }
        }

        //keyboard controls
        if(this.cursors.left.isDown || this.wasd.A.isDown) {
            dir = 'left';
        } else if(this.cursors.right.isDown || this.wasd.D.isDown) {
            dir = 'right';
        }

        if(this.cursors.up.isDown || this.wasd.W.isDown) {
            jump = true;
        } else if(this.cursors.down.isDown || this.wasd.S.isDown) {
            stomp = true;
        }
    
        //play anims
        if(dir === 'left') {
            this.player.setVelocityX(-260);
            if(jump) {
                this.player.anims.play('jumpLeft', true);
            } else {
                this.player.anims.play('left', true);
            }
        } else if(dir === 'right') {
            this.player.setVelocityX(260);
            if(jump) {
                this.player.anims.play('jumpRight', true);
            } else {
                this.player.anims.play('right', true);
            }
        } else {
            this.player.setVelocityX(0);
            if(jump) {                
                this.player.anims.play('jump');
            } else if(stomp) {
                this.player.anims.play('stomp');
                this.player.setVelocityY(330);
            } else {
                this.player.anims.play('turn');
            }
        }        
    
        if(jump && this.player.body.touching.down){
            this.player.setVelocityY(-400);
        }
    }

    ////////////////////////////////////////////////////////////////////
    //                             Coins                              //
    ////////////////////////////////////////////////////////////////////

    createStars() {  
        this.stars = this.physics.add.group({
            key: 'star',
            repeat: 11,
            setXY: { x: 42, y: 0, stepX: 85 }
        });            
        this.stars.children.iterate(function (child) {
            child.disableBody(true, true); //wait for trigger to rain stars
        });        
    }

    rainCoins() {
        //  A new batch of stars to collect
        this.stars.children.iterate(function (child) {
            child.enableBody(true, child.x, Phaser.Math.FloatBetween(0, -75), true, true);
            child.setBounceY(Phaser.Math.FloatBetween(0.2, 0.4));
            child.setVelocityY(Phaser.Math.FloatBetween(0, 250));
        });
    }
        
    collectStar (player, star) {
        star.disableBody(true, true);
    
        //  Add and update the score
        this.score += 10;
        this.scoreText.setText('score: $' + this.score);
    
        if (!this.gameOver && this.stars.countActive(true) === 0)
        {
            this.levelUp();
        }
    }

    bounceStars() {
        this.stars.children.iterate(function (child) {
            if(child.body.touching.down) {
                child.setVelocityY(Phaser.Math.FloatBetween(-25, -75));
            }
        });
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
        let fontStyle = { fontSize: '24pt', fill: '#FFF', backgroundColor: this.game.config.backgroundColor.rgba };
        
        //  Input Events
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys('W,S,A,D');
        this.input.addPointer(1); //for multi-touch

        //UI
        this.scoreText = this.add.text(16, 16, 'score: $0', fontStyle);
        this.levelText = this.add.text(512, 32, 'level: 0 / 12', fontStyle).setOrigin(0.5);
        
        //help button
        this.helpBtn = this.add.text(1024 - 80, 16, '[?]', fontStyle).setOrigin(1, 0).setInteractive();
        this.helpBtn.on('pointerup', function () {            
            this.showHelp(!this.helpShowing);
        }, this);                
        this.input.keyboard.on('keydown-ESC', () => {
            this.showHelp(!this.helpShowing);
        });

        //fullscreen button
        this.fsBtn = this.add.text(1024 - 16, 16, '[+]', fontStyle).setOrigin(1, 0).setInteractive();
        this.fsBtn.on('pointerup', () => {
            this.toggleFullscreen();
        });

        this.ui = this.add.container(0, 0, [this.scoreText, this.levelText, this.helpBtn, this.fsBtn]);
        this.ui.setDepth(100);
    }
    
    changeHint() {
        if(this.hintIdx < 2) {
            this.hintIdx++;
        } else {
            this.hintIdx = 0;
        }
        this.hint.setText(this.hints[this.hintIdx]);
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
            this.helpScroll = this.add.image(512, 350, 'scroll');
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

    rollCredits() {            
        this.add.image(512, 350, 'scroll');    
        const button = this.add.text(450, 320, '[retry]', {
            color:'white', fontSize:'xx-large', 
        }).setInteractive();
        button.on('pointerup', () => {
            this.scene.restart();
        });
    }
}