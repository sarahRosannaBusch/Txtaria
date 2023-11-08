import PLAYER from "./player.js";
import COINS from "./coins.js";
import ASCIIRAIN from "./asciiRain.js";
import MOBS from "./mobs.js";
import UI from "./ui.js";
import PLATFORMS from "./platforms.js";

export default class SCENE extends Phaser.Scene {
    constructor() {
        super("SCENE");
    }

    init() {
        this.score = 0;
        this.level = 0;
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
        this.load.image('coin', 'assets/coin.png');
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
        let world = this.physics.world;
        
        //  Input Events
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys('W,S,A,D');
        this.input.addPointer(1); //for multi-touch

        this.ui = new UI(this);
        
        this.base = this.physics.add.staticGroup();
        this.base.create(512, 748, 'ground').setDepth(75);

        this.platforms = new PLATFORMS(world, this, {}); 
        this.createLevel();

        this.player = new PLAYER(this, 375, -250, 'dude', 0);
        this.coins = new COINS(world, this, {
            key: 'coin',
            repeat: 11,
            setXY: { x: 42, y: 0, stepX: 85 }
        });
        this.asciiRain = new ASCIIRAIN(world, this, {});
        this.mobs = new MOBS(world, this, {});
                    
        this.physics.add.collider(this.player, this.base);  
        this.physics.add.collider(this.player, this.platforms);  
        this.physics.add.collider(this.mobs, this.base); 
        this.physics.add.collider(this.mobs, this.platforms);
        this.physics.add.collider(this.coins, this.base);
        this.physics.add.collider(this.coins, this.platforms);

        this.physics.add.overlap(this.player, this.mobs, this.hitMob, null, this);
        this.physics.add.overlap(this.player, this.coins, this.collectCoin, null, this);

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
                    this.coins.bounce();
                    if(this.level === 0) {
                        this.changeHint();
                    }
                }
            }
        } 
    }

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
                        this.asciiRain.rain();
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
                        this.coins.rain();
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
                        this.asciiRain.rain();
                    }
                }, {
                    at: 2000,
                    run: () => {
                        this.createLevel();
                    }
                }, {
                    at: 2500,
                    run: () => {
                        this.coins.rain();
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

    levelUp() {
        this.level++;            
        this.ui.updateLevel(this.level);
        this.playTween();

        if(this.ui.helpShowing) {
            this.ui.showHelp(false);
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
    
    changeHint() {
        if(this.hintIdx < 2) {
            this.hintIdx++;
        } else {
            this.hintIdx = 0;
        }
        this.hint.setText(this.hints[this.hintIdx]);
    }

    createLevel() {    
        switch(this.level) {
            case 0:
                this.createTutorial(); 
            break;
            case 1:
                this.tutorial.destroy();
                this.mobs.spawn(512, 16, 'bomb');
                this.platforms.build([
                    {x: 420, y: 300, key: 'platform0'},
                    {x: 744, y: 440, key: 'platform1'},
                    {x: 5, y: 460, key: 'platform2'},
                    {x: 460, y: 600, key: 'platform3'},
                ]);
            break;
            case 2: 
                this.platforms.clear(true, true);
                this.mobs.clear(true, true);    
                this.mobs.spawn(512, 16, 'mob0');
            break;
            case 3:                
                this.mobs.spawn(512, 16, 'mob1');
            break;
            default: break;
        }
    }

    //based on user input
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
    
        this.player.playAnims(dir, jump, stomp);
    }
  
    collectCoin (player, coin) {
        coin.disableBody(true, true);
    
        //  Add and update the score
        this.score += 10;
        this.ui.updateScore(this.score);
        if (!this.gameOver && this.coins.countActive(true) === 0) {
            this.levelUp();
        }
    }

    hitMob (player, mob) {
        this.physics.pause();
        player.setTint(0xff0000);
        player.anims.play('turn');
        this.gameOver = true;
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