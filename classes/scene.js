import PLAYER from "./player.js";
import COINS from "./coins.js";
import ASCIIRAIN from "./asciiRain.js";
import MOBS from "./mobs.js";
import UI from "./ui.js";
import PLATFORMS from "./platforms.js";
import TUTORIAL from "./tutorial.js";
import { themes } from "../themes.js";

export default class SCENE extends Phaser.Scene {
    constructor() {
        super("SCENE");
    }

    init() {
        this.score = 0;
        this.level = 0;
        this.tick = 0;
        this.tweening = true;
        this.gameOver = false;
        this.themeName = localStorage.getItem("theme");
        if(!this.themeName) this.themeName = "Textarea";
        this.theme = themes[this.themeName];
    }

    preload() {          
        this.showLoadingScreen();

        this.load.spritesheet('asciiRain', 'assets/asciiRain.png', { 
            frameWidth: 16.6, frameHeight: 2074
        });      
        this.load.image('rainBG', 'assets/rainBG.png');
        this.load.image('scroll', 'assets/scroll.png');
        this.load.image('scrollBG', 'assets/scrollBG.png');
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
        this.load.audio('rain', ['assets/asciiRain.mp3']);
    }

    create () {       
        let world = this.physics.world;

        this.cameras.main.setBackgroundColor(this.theme.bg);
        this.ui = new UI(this, this.level, this.score);
        
        this.base = this.physics.add.staticGroup();
        this.base.create(512, 748, 'ground').setDepth(75).setTint(this.theme.base);
        this.platforms = new PLATFORMS(world, this, {}); 

        this.player = new PLAYER(this, 375, -500, 'dude', 0);
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

        this.buildLevel();
        this.playTween();
        
        this.rainFX = this.sound.add('rain');
        this.rainFX.play();
    }
    
    update (time, delta) { 
        if(this.gameOver) {
            this.rollCredits();
        } else {
            if(!this.tweening) {
                this.player.move();
                if(time - this.tick > 5000) {
                    this.tick = time;
                    this.coins.bounce();
                    if(this.level === 0) {
                        this.tutorial.changeHint();
                    }
                }
            }
        } 
    }

    /////////////////////////////////////////////////////////////////////////////
    //                               Game events                               //
    /////////////////////////////////////////////////////////////////////////////

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
        this.physics.pause(); //todo: this makes whole browser hang...
        player.setTint(this.theme.kill);
        player.anims.play('turn');
        this.gameOver = true;
    }

    levelUp() {
        this.level++;            
        this.ui.updateLevel(this.level);
        if(this.ui.helpShowing) {
            this.ui.showHelp(false);
        } 
        this.playTween();
    }
    
    rollCredits() {            
        this.add.image(512, 350, 'scrollBG').setDepth(97).setTint(this.theme.bg); 
        this.add.image(512, 350, 'scroll').setDepth(98).setTint(this.theme.scroll);   
        const button = this.add.text(450, 320, '[retry]', {
            color:'white', fontSize:'xx-large', 
        }).setInteractive().setDepth(99).setTint(this.theme.scroll);
        button.on('pointerup', () => {
            this.scene.restart();
        });
    }

    /////////////////////////////////////////////////////////////////////////////
    //                                 Levels                                  //
    /////////////////////////////////////////////////////////////////////////////
    
    buildLevel() {    
        switch(this.level) {
            case 0:
                this.tutorial = new TUTORIAL(this, 512, -700); 
            break;
            default:              
                this.platforms.build([
                    {x: 435, y: 330, key: 'platform0'},
                    {x: 744, y: 440, key: 'platform1'},
                    {x: 5, y: 460, key: 'platform2'},
                    {x: 460, y: 580, key: 'platform3'},
                ]);  
                this.platforms.setTint(this.theme.platforms);
            break;
        }
    }

    addMobs() {
        switch(this.level) {
            case 2:    
                this.mobs.spawn(512, 16, 'mob0');
            break;
            case 3:                
                this.mobs.spawn(512, 16, 'mob1');
            break;
            case 4:
                this.mobs.spawn(512, 16, 'bomb');
                break;
            default: break;
        }
    }

    demoLevel() {
        if(this.tutorial) this.tutorial.destroy();
        if(this.platforms) this.platforms.clear(true, true);
        if(this.mobs) this.mobs.clear(true, true);
    }

    /////////////////////////////////////////////////////////////////////////////
    //                            Tween Timeline                               //
    /////////////////////////////////////////////////////////////////////////////

    playTween() {
        let params = [{
            at: 0,
            run: () => {
                this.tweening = true;
                this.asciiRain.rain();
            }
        }, {
            at: 1500,
            run: () => {
                this.coins.rain();
            }
        }, {
            at: 3000,
            run: () => {
                this.player.setCollideWorldBounds(true);
                this.tweening = false;
            }
        }];

        if(this.level === 0) {
            params.push({
                at: 1000,
                tween: {
                    targets: this.tutorial,
                    y: 0, 
                    ease: 'Power0',
                    duration: 2000
                }
            });
        } else {
            params.push({
                at: 0,
                run: () => {           
                    this.player.setDepth(75);
                }
            }, {
                at: 500,
                tween: {
                    targets: this.player,
                    x: 350,
                    ease: 'Power0',
                    duration: 1500
                }
            }, {
                at: 2000,
                run: () => {             
                    this.demoLevel();
                    this.buildLevel();
                }
            }, {
                at: 2500,
                run: () => {
                    this.addMobs();
                }
            });
        }

        const timeline = this.add.timeline(params);
        timeline.play();
    }

    /////////////////////////////////////////////////////////////////////////////
    //                            Loading Screen                               //
    /////////////////////////////////////////////////////////////////////////////
    
    showLoadingScreen() {        
        //src: https://gamedevacademy.org/creating-a-preloading-screen-in-phaser-3/ 
        //I just modified this to center it properly, and
        //didn't include the fileprogress part cuz the event wasn't triggering and game loads fast anyway

        var width = this.cameras.main.width / 2;
        var height = this.cameras.main.height / 2;

        var progressBar = this.add.graphics();
        var progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(width - 160, height - 25, 320, 50); //x, y, w, h

        var loadingText = this.make.text({
            x: width,
            y: height - 50,
            text: 'Loading...',
            style: {
                font: '20px monospace',
                fill: '#ffffff'
            }
        });
        loadingText.setOrigin(0.5, 0.5);

        var percentText = this.make.text({
            x: width,
            y: height,
            text: '0%',
            style: {
                font: '18px monospace',
                fill: '#ffffff'
            }
        });
        percentText.setOrigin(0.5, 0.5);

        this.load.on('progress', function (value) {
            //console.log(value);
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(width - 150, height - 15, 300 * value, 30);
            percentText.setText(parseInt(value * 100) + '%');
        }); 

        this.load.on('complete', function () {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            percentText.destroy();
        });
    }
}