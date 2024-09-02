import TUTORIAL from "./tutorial.js";
import UI from "./ui.js";
import TIPS from "./tips.js";
import PLAYER from "./player.js";
import PLATFORMS from "./platforms.js";
import COINS from "./coins.js";
import MOBS from "./mobs.js";
import ASCIIRAIN from "./asciiRain.js";
import { LEVELS } from "../levels.js";
import { themes } from "../themes.js";

export default class SCENE extends Phaser.Scene {
    constructor() {
        super("SCENE");
    }

    getUserData(item, defaultValue) {
        let data = localStorage.getItem(item);
        if(!data && defaultValue) {
            this.setUserData(item, defaultValue);
            data = defaultValue;
        }
        return data;
    }

    setUserData(item, value) {        
        localStorage.setItem(item, value);
        this[item] = value;
    }

    init() {   
        this.devMode = parseInt(this.getUserData("devMode", "0")); 
        this.level = this.getUserData("level", "0");   
        this.themeName = this.getUserData("themeName", "Textarea");
        this.soundOn = this.getUserData("soundOn", "1");

        this.tick = 0;
        this.tweening = true;
        this.tipsShowing = false;
        this.gameOver = false;
        this.maxLevel = LEVELS.length - 1;
        this.score = parseInt(this.level) * 12; //12 stars per level 
        this.theme = themes[this.themeName];
    }

    preload() {          
        this.showLoadingScreen();

        // LOAD ASSETS

        //tutorial and ui
        this.load.image('scroll', 'assets/tutorialUI/scroll.png');
        this.load.image('scrollBG', 'assets/tutorialUI/scrollBG.png');
        this.load.image('title', 'assets/tutorialUI/title.png');

        //player    
        this.load.spritesheet('dude', 'assets/dude/dude.png', { 
            frameWidth: 51.888, frameHeight: 98 
        });

        //platforms
        this.load.image('ground', 'assets/platforms/ground.png');
        this.load.image('platform0', 'assets/platforms/platform0.png'); // !!!!!
        this.load.image('platform1', 'assets/platforms/platform1.png'); // &&&&&
        this.load.image('platform2', 'assets/platforms/platform2.png'); // %%%%%
        this.load.image('platform3', 'assets/platforms/platform3.png'); // #####
        this.load.image('platform4', 'assets/platforms/platform4.png'); // /////
        this.load.image('platform5', 'assets/platforms/platform5.png'); // \\\\\
        this.load.image('platform6', 'assets/platforms/platform6.png'); // |_|_|_|
        this.load.image('platform7', 'assets/platforms/platform7.png'); // |_|_|_|_|_|_|

        //mobs
        this.load.image('coin', 'assets/mobs/coin.png');
        this.load.image('mob0', 'assets/mobs/mob0.png');    
        this.load.image('mob1', 'assets/mobs/mob1.png');
        this.load.image('bomb', 'assets/mobs/bomb.png');
        //this.load.image('healthPot', 'assets/healthPot.png');
        
        //ascii rain
        this.load.spritesheet('asciiRain', 'assets/asciiRain/asciiRain.png', { 
            frameWidth: 16.6, frameHeight: 2074
        }); 
        this.load.image('rainBG', 'assets/asciiRain/rainBG.png');

        //art
        this.load.image('cloud0', 'assets/art/cloud0.png');
        this.load.image('cloud1', 'assets/art/cloud1.png');
        this.load.image('tree0', 'assets/art/tree0.png');
        this.load.image('tree1', 'assets/art/tree1.png');
        this.load.image('tree2', 'assets/art/tree2.png');
        this.load.image('tree3', 'assets/art/tree3.png');
        this.load.image('shrub0', 'assets/art/shrub0.png');
        this.load.image('mushroom0', 'assets/art/mushroom0.png');
        this.load.image('mushroom1', 'assets/art/mushroom1.png');
        this.load.image('flower0', 'assets/art/flower0.png');
        this.load.image('flower1', 'assets/art/flower1.png');
        this.load.image('flower2', 'assets/art/flower2.png');
        this.load.image('flower3', 'assets/art/flower3.png');
        this.load.image('flower4', 'assets/art/flower4.png');
        this.load.image('tower0', 'assets/art/tower0.png');
        this.load.image('hut', 'assets/art/hut.png');
        this.load.image('rat', 'assets/art/rat.png');
        this.load.image('wagon', 'assets/art/wagon.png');
        this.load.image('moon', 'assets/art/moon.png');
        this.load.image('star', 'assets/art/star.png');

        //sounds
        this.load.audio('rain', ['assets/soundFX/asciiRain.mp3']);
        this.load.audio('coin', ['assets/soundFX/collectCoin.mp3']);
        this.load.audio('death', ['assets/soundFX/death.mp3']);
    }

    create () {       
        let world = this.physics.world;

        this.cameras.main.setBackgroundColor(this.theme.bg);
        this.ui = new UI(this, this.level, this.score);
        this.tips = new TIPS(this);
        
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
        if(this.soundOn === "1") {
            this.rainFX.play();
        } else {
            this.ui.toggleSound()
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
        coin.disableBody(true, true);
    
        //  Add and update the score
        this.ui.updateScore(this.score + 1);
        if (!this.gameOver && this.coins.countActive(true) === 0) {
            this.levelUp();
        }
    }

    hitMob(player, mob) {
        switch(mob.key) {
            case 'mob0': //witchhazel
                //player can kick mob0 from the sides,
                //but landing on it's pointy hat is bad news
                if((player.x > mob.x-25) && (player.x < mob.x+25)) {
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
        //console.log(mob1.key + " hit " + mob2.key);
    }

    killPlayer(player, mob) {
        this.physics.pause(); 
        this.deathFX.play({seek: 2.5}); //starts at 2.5s in
        //player.setTint(this.theme.kill);
        player.anims.play('turn');

        if(!this.gameOver && !this.tipsShowing) {
            this.tips.showTips(mob);
        }
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

        let text = ``;
        if(this.score > 0) {
            text = `
       Congratulations!

       You earned $${this.score} 
by taking a walk in the park.

      Welcome to Txtaria!`
        } else {
            text = `
         Impressive!

   In a world where money 
     falls from the sky,
you accumulated $${-this.score} in debt.

     Welcome to Txtaria!`
        }

        this.add.text(512, 270, text, {
            color:'white', fontSize:'xx-large', 
        }).setDepth(99).setOrigin(0.5, 0.5).setTint(this.theme.scroll);


        const button = this.add.text(512, 430, '[PLAY AGAIN]', {
            color:'white', fontSize:'xx-large', 
        }).setInteractive().setDepth(99).setOrigin(0.5, 0.5).setTint(this.theme.scroll);
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
        if(this.tutorial) this.tutorial.destroy(); //doesn't actually destroy, just sets .active to false
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