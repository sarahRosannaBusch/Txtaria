import PLAYER from "./player.js";
import COINS from "./coins.js";
import ASCIIRAIN from "./asciiRain.js";
import MOBS from "./mobs.js";
import UI from "./ui.js";
import PLATFORMS from "./platforms.js";
import TUTORIAL from "./tutorial.js";
import { LEVELS } from "../levels.js";
import { themes } from "../themes.js";

export default class SCENE extends Phaser.Scene {
    constructor() {
        super("SCENE");
    }

    init() {   
        this.devMode = parseInt(localStorage.getItem("devMode"));
        
        this.tick = 0;
        this.tweening = true;
        this.gameOver = false;
        this.maxLevel = LEVELS.length - 1;

        this.level = localStorage.getItem("level");
        if(!this.level) this.level = "0";
        let lvl = parseInt(this.level);
        this.score = lvl * 120; //12 stars per level    

        this.themeName = localStorage.getItem("theme");
        if(!this.themeName) this.themeName = "Textarea"; //default
        this.theme = themes[this.themeName];

        let mute = localStorage.getItem("mute");
        if(mute) {
            this.soundOn = mute === "false" ? true : false; 
        } else {
            this.soundOn = true; //default
        }
    }

    preload() {          
        this.showLoadingScreen();

        //sprites
        this.load.spritesheet('asciiRain', 'assets/asciiRain.png', { 
            frameWidth: 16.6, frameHeight: 2074
        });     
        this.load.spritesheet('dude', 'assets/dude.png', { 
            frameWidth: 51.888, frameHeight: 98 
        });
        
        //objects
        this.load.image('rainBG', 'assets/rainBG.png');
        this.load.image('scroll', 'assets/scroll.png');
        this.load.image('scrollBG', 'assets/scrollBG.png');
        this.load.image('title', 'assets/title.png');
        this.load.image('ground', 'assets/ground.png');
        this.load.image('platform0', 'assets/platform0.png'); // !!!!!
        this.load.image('platform1', 'assets/platform1.png'); // &&&&&
        this.load.image('platform2', 'assets/platform2.png'); // %%%%%
        this.load.image('platform3', 'assets/platform3.png'); // #####
        this.load.image('platform4', 'assets/platform4.png'); // /////
        this.load.image('platform5', 'assets/platform5.png'); // \\\\\
        this.load.image('platform6', 'assets/platform6.png'); // |_|_|_|
        this.load.image('platform7', 'assets/platform7.png'); // |_|_|_|_|_|_|
        this.load.image('coin', 'assets/coin.png');
        this.load.image('healthPot', 'assets/healthPot.png');
        this.load.image('mob0', 'assets/mob0.png');    
        this.load.image('mob1', 'assets/mob1.png');
        this.load.image('bomb', 'assets/bomb.png');

        //art
        this.load.image('cloud0', 'assets/cloud0.png');
        this.load.image('cloud1', 'assets/cloud1.png');
        this.load.image('tree0', 'assets/tree0.png');
        this.load.image('tree1', 'assets/tree1.png');
        this.load.image('tree2', 'assets/tree2.png');
        this.load.image('tree3', 'assets/tree3.png');
        this.load.image('shrub0', 'assets/shrub0.png');
        this.load.image('mushroom0', 'assets/mushroom0.png');
        this.load.image('mushroom1', 'assets/mushroom1.png');
        this.load.image('flower0', 'assets/flower0.png');
        this.load.image('flower1', 'assets/flower1.png');
        this.load.image('flower2', 'assets/flower2.png');
        this.load.image('flower3', 'assets/flower3.png');
        this.load.image('flower4', 'assets/flower4.png');
        this.load.image('tower0', 'assets/tower0.png');
        this.load.image('hut', 'assets/hut.png');
        this.load.image('rat', 'assets/rat.png');
        this.load.image('wagon', 'assets/wagon.png');

        //sounds
        this.load.audio('rain', ['assets/asciiRain.mp3']);
        this.load.audio('coin', ['assets/collectCoin.mp3']);
        this.load.audio('death', ['assets/death.mp3']);
    }

    create () {       
        let world = this.physics.world;

        this.cameras.main.setBackgroundColor(this.theme.bg);
        this.ui = new UI(this, this.level, this.score);
        
        this.base = this.physics.add.staticGroup();
        this.base.create(512, 748, 'ground').setDepth(75).setTint(this.theme.base);
        this.platforms = new PLATFORMS(world, this, {}); 

        this.player = new PLAYER(this, 375, 300, 'dude', 0);        
        this.player.setCollideWorldBounds(true);

        this.coins = new COINS(world, this, {
            key: 'coin',
            repeat: 11,
            setXY: { x: 42, y: 0, stepX: 85 }
        });
        this.asciiRain = new ASCIIRAIN(world, this, {});
        this.mobs = new MOBS(world, this, {});
        this.art = [];
                    
        this.physics.add.collider(this.player, this.base);  
        this.physics.add.collider(this.player, this.platforms);  
        this.physics.add.collider(this.mobs, this.base); 
        this.physics.add.collider(this.mobs, this.platforms);
        this.physics.add.collider(this.coins, this.base);
        this.physics.add.collider(this.coins, this.platforms);

        this.physics.add.collider(this.mobs, this.mobs, this.mobHit, null, this);
        this.physics.add.collider(this.player, this.mobs, this.hitMob, null, this);  
        this.physics.add.overlap(this.player, this.coins, this.collectCoin, null, this);

        if(this.level == 0) {
            this.buildLevel();
        }
        this.playTween();
        
        this.rainFX = this.sound.add('rain');
        this.coinFX = this.sound.add('coin');
        this.deathFX = this.sound.add('death');
        if(this.soundOn) {
            this.rainFX.play();
        } else {
            this.ui.toggleSound('true')
        }
    }
    
    update (time, delta) { 
        if(this.gameOver) {
            this.rollCredits();
        } else {
            if(!this.tweening) {
                this.player.move();
                if(time - this.tick > 3000) {
                    this.tick = time;
                    this.coins.bounce();
                    if(this.level == 0) {
                        this.tutorial.changeHint();
                    }
                }
            }
        } 
    }

    /////////////////////////////////////////////////////////////////////////////
    //                               Game events                               //
    /////////////////////////////////////////////////////////////////////////////

    collectCoin(player, coin) {
        this.coinFX.play();
        coin.disableBody(true, true);
    
        //  Add and update the score
        this.score += 10;
        this.ui.updateScore(this.score);
        if (!this.gameOver && this.coins.countActive(true) === 0) {
            this.levelUp();
        }
    }

    hitMob(player, mob) {
        switch(mob.key) {
            case 'mob0': //witchhazel
                //player can kick mob0 from the sides,
                //but landing on it's pointy hat is bad news
                if(player.y + 50 < mob.y) {
                    this.killPlayer(player, mob);
                }
            break;
            case 'mob1': //scuttlebot
                //runs player down from the sides,
                //but player can hop on it's head
                if(player.y + 50 > mob.y) {
                    this.killPlayer(player, mob);
                }
            break;
            default:
                this.killPlayer(player, mob);
            break;
        }
    }

    mobHit(mob1, mob2) {
        console.log(mob1.key + " hit " + mob2.key);
    }

    killPlayer(player, mob) {
        this.physics.pause(); //todo: this makes whole browser hang...
        this.deathFX.play();
        player.setTint(this.theme.kill);
        player.anims.play('turn');

        if(!this.gameOver) {
            this.showTips(mob);
        }
    }

    showTips(mob) {          
        this.add.image(512, 350, 'scrollBG').setDepth(97).setTint(this.theme.bg); 
        this.add.image(512, 350, 'scroll').setDepth(98).setTint(this.theme.scroll);

        this.add.image(500, 250, mob.key).setDepth(99).setTint(this.theme.scroll)
            .setOrigin(0.5, 0.5); 

        this.add.text(350, 325, mob.tip, {
            color:'white', fontSize:'xx-large',
        }).setDepth(99).setTint(this.theme.scroll).setOrigin(0.5, 0.5); 

        const button = this.add.text(435, 400, '[retry]', {
            color:'white', fontSize:'xx-large', 
        }).setInteractive().setDepth(99).setTint(this.theme.scroll);
        button.on('pointerup', () => {
            this.scene.restart();
        });
    }

    levelUp() { 
        if(this.ui.helpShowing) {
            this.ui.showHelp(false);
        }

        let level = parseInt(this.level);
        level++; 

        if(level > this.maxLevel) {
            this.gameOver = true;
        } else { 
            this.level = level;
            localStorage.setItem("level", this.level);       
            this.ui.updateLevel(this.level);
            this.rainFX.play();
            this.playTween();
        } 
    }
    
    rollCredits() {            
        this.add.image(512, 350, 'scrollBG').setDepth(97).setTint(this.theme.bg); 
        this.add.image(512, 350, 'scroll').setDepth(98).setTint(this.theme.scroll); 

        this.add.text(330, 280, 'Thanks for playing!', {
            color:'white', fontSize:'xx-large', 
        }).setDepth(99).setTint(this.theme.scroll);

        const button = this.add.text(400, 350, '[play again]', {
            color:'white', fontSize:'xx-large', 
        }).setInteractive().setDepth(99).setTint(this.theme.scroll);
        button.on('pointerup', () => {
            this.level = 0;
            localStorage.setItem("level", this.level);
            this.scene.restart();
        });
    }

    /////////////////////////////////////////////////////////////////////////////
    //                                 Levels                                  //
    /////////////////////////////////////////////////////////////////////////////
    
    buildLevel() { 
        let lvl = parseInt(this.level);
        let LEVEL =  LEVELS[lvl]; 
        if(lvl === 0) {
            this.tutorial = new TUTORIAL(this, 512, -700); 
        } else {
            this.platforms.build(LEVEL.plats);  
            this.platforms.setTint(this.theme.platforms);
        }

        if(LEVEL && LEVEL.art) {
            let n = LEVEL.art.length;
            for(let i = 0; i < n; i++){
                let art = LEVEL.art[i];
                let img = this.add.image(art.x, art.y, art.key).setDepth(0).setOrigin(0, 1)
                    .setTint(this.theme.art);
                this.art.push(img);
            }
        }
    }

    addMobs() {
        let lvl = parseInt(this.level);   
        let mobs = LEVELS[lvl].mobs;
        if(mobs) {
            let n = mobs.length;
            for(let i = 0; i < n; i++) {
                this.mobs.spawn(...mobs[i]);
            }
        }
    }

    killMobs() {
        if(this.mobs) this.mobs.clear(true, true);
    }

    demoLevel() {
        if(this.tutorial) this.tutorial.destroy();
        if(this.platforms) this.platforms.clear(true, true);
        if(this.art) {
            let n = this.art.length;
            for(let i = 0; i < n; i++) {
                this.art[i].destroy();
            }
        }
    }

    /////////////////////////////////////////////////////////////////////////////
    //                            Tween Timeline                               //
    /////////////////////////////////////////////////////////////////////////////

    // tween scenes
    playTween() {
        let params = [{
            at: 0,
            run: () => {
                this.tweening = true;
                if(!this.devMode) this.asciiRain.rain();
            }
        }, {
            at: 1500,
            run: () => {
                this.coins.rain();
            }
        }, {
            at: 3000,
            run: () => {
                this.tweening = false;
            }
        }];

        if(this.level == 0) {
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
                    this.killMobs();
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