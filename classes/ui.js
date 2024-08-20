import { themes } from "../themes.js";

export default class UI {
    constructor(scene) {  
        this.scene = scene;
        this.helpShowing = false;
        this.fsBtnClicked = false;

        let fontStyle = { 
            fontSize: '24pt', 
            fill: '#FFF'
        };
        
        //UI
        this.scoreText = scene.add.text(16, 16, `score: $${scene.score}`, fontStyle)
            .setTint(scene.theme.ui);
        this.levelText = scene.add.text(512, 32, `level: ${scene.level} / ${this.scene.maxLevel}`, fontStyle)
            .setOrigin(0.5).setTint(scene.theme.ui);
        
        //help button
        this.helpBtn = scene.add.text(1024 - 120, 16, '[?]', fontStyle).setOrigin(1, 0)
            .setInteractive().setTint(scene.theme.ui);
        this.helpBtn.on('pointerup', () => {            
            this.showHelp(!this.helpShowing);
        });                
        scene.input.keyboard.on('keydown-X', () => {
            this.showHelp(!this.helpShowing);
        });

        //fullscreen button
        let fs = this.scene.scale.isFullscreen ? '[-]' : '[+]';
        this.fsBtn = scene.add.text(1024 - 16, 16, fs, fontStyle).setOrigin(1, 0)
            .setInteractive().setTint(scene.theme.ui);
        this.fsBtn.on('pointerup', () => {
            this.fsBtnClicked = true;
            this.toggleFullscreen();
        });
        document.addEventListener("fullscreenchange", (e) => { 
            if(this.fsBtnClicked) {
                this.fsBtnClicked = false;
            } else {       
                //user closed fs the default way (ESC, swipe, etc)
                let fs = this.scene.scale.isFullscreen ? 'X' : ' ';
                if(this.helpShowing) {
                    this.optFS.setText(`[${fs}] fullscreen`);
                }
                fs = fs === ' ' ? "[+]" : "[-]";
                this.fsBtn.setText(fs);
            }
        });

        let container = scene.add.container(0, 0, [
            this.scoreText, this.levelText, this.helpBtn, this.fsBtn
        ]);
        container.setDepth(100);
    }
    
    updateScore(score) {        
        this.scoreText.setText('score: $' + score);
    }

    updateLevel(level) {
        this.levelText.setText(`level: ${level} / ${this.scene.maxLevel}`);
    }

    toggleFullscreen() {
        let fs = this.scene.scale.isFullscreen ? ' ' : 'X';
        if(this.helpShowing) {
            this.optFS.setText(`[${fs}] fullscreen`);
        }
        fs = fs === ' ' ? "[+]" : "[-]";
        this.fsBtn.setText(fs);
        if(this.scene.scale.isFullscreen) {
            this.scene.scale.stopFullscreen();
        } else {
            this.scene.scale.startFullscreen();
        }
    }

    showHelp(show) {     
        if(show) {   
            let fontStyle = { fontSize: '24px', fill: '#FFF' };
            let tint = this.scene.theme.scroll;
            if(this.scene.level !== "0") { 
                this.scene.physics.pause();
            }

            this.helpBtn.setText("[X]");
            this.helpScrollBG = this.scene.add.image(512, 350, 'scrollBG')
                .setTint(this.scene.theme.bg);
            this.helpScroll = this.scene.add.image(512, 350, 'scroll')
                .setTint(tint);
                
            //manually clear browser data
            this.clearData = this.scene.add.text(675, 120, ``, fontStyle).setTint(tint).setInteractive();
            const addClearDataBtn = () => {
                this.clearData.setText(`[DELETE DATA]`);
                this.clearData.on('pointerup', () => {
                    localStorage.clear();
                    this.clearData.setText(``);
                });
            }
            if(localStorage.length) {
                addClearDataBtn();
            }

            //left side
            this.controlsText = this.scene.add.text(200, 180, `
CONTROLS:

KEYBOARD
w,a,s,d or arrow keys

TWO-FINGER TOUCH
move: hold left/right 
      side of screen
jump: tap anywhere
stomp: swipe down
            `, fontStyle).setTint(tint);

            //right side
            let x = 550;
            this.optsText = this.scene.add.text(x, 180, `
OPTIONS:`, fontStyle).setTint(tint);

            let fs = this.scene.scale.isFullscreen ? 'X' : ' ';
            this.optFS = this.scene.add.text(x, 230, `[${fs}] fullscreen`,
                fontStyle).setInteractive().setTint(tint);
            this.optFS.on('pointerup', () => {
                this.fsBtnClicked = true;
                this.toggleFullscreen();
            });

            let s = this.scene.soundOn === '1' ? 'X' : ' ';
            this.optSound = this.scene.add.text(x, 260, `[${s}] sound`, fontStyle).setInteractive().setTint(tint);
            this.optSound.on('pointerup', () => {       
                let soundOn = parseInt(this.scene.soundOn);      
                soundOn = 1 - soundOn;
                s = soundOn ? 'X' : ' ';
                this.optSound.setText(`[${s}] sound`);
                this.scene.setUserData("soundOn", soundOn);
                this.toggleSound();
                addClearDataBtn();
            });

            this.themesText = this.scene.add.text(x, 300, `
THEMES:`, fontStyle).setTint(tint);
            this.themeOpts = {};
            let themeNames = Object.keys(themes);
            themeNames.forEach((name, i) => {
                let height = 350 + (i * 30);
                let sel = (name === this.scene.themeName) ? 'X' : ' ';
                this.themeOpts[name] = this.scene.add.text(x, height, `[${sel}] ${name}`,
                    fontStyle).setInteractive().setTint(tint);                
                this.themeOpts[name].on('pointerup', () => {
                    let cur = this.scene.themeName;
                    this.themeOpts[cur].setText(`[ ] ${cur}`);
                    this.themeOpts[name].setText(`[X] ${name}`);
                    this.changeTheme(name);
                    addClearDataBtn();
                });
            });
            
            this.help = this.scene.add.container(0, 0, [
                this.helpScrollBG, 
                this.helpScroll, 
                this.controlsText, 
                this.clearData,
                this.optsText, 
                this.optFS, 
                this.optSound,
                this.themesText,
                this.themeOpts.Textarea, //todo: iterate these instead
                this.themeOpts.Coding_Vibes,
                this.themeOpts.Light_Bright,
                this.themeOpts.Matrix_Mode,
                this.themeOpts.Parchment
            ]);
            this.help.setDepth(100);
        } else {
            if(!this.scene.tipsShowing) this.scene.physics.resume();
            this.helpBtn.setText("[?]");
            this.help.destroy();
        }
        
        this.helpShowing = !this.helpShowing;
    }

    toggleSound() {  
        let mute = 1 - parseInt(this.scene.soundOn);       
        this.scene.rainFX.setMute(mute);
        this.scene.coinFX.setMute(mute);
        this.scene.deathFX.setMute(mute);
    }

    //change tint of ui
    changeTint() {
        let colours = this.scene.theme;
        this.scoreText.setTint(colours.ui);
        this.levelText.setTint(colours.ui);
        this.helpBtn.setTint(colours.ui);
        this.fsBtn.setTint(colours.ui);
        if(this.helpShowing) {
            this.helpScrollBG.setTint(colours.bg);
            this.helpScroll.setTint(colours.scroll);
            this.controlsText.setTint(colours.scroll);
            this.clearData.setTint(colours.scroll);
            this.optsText.setTint(colours.scroll);
            this.optFS.setTint(colours.scroll);
            this.optSound.setTint(colours.scroll);
            this.themesText.setTint(colours.scroll);
            for(let key in this.themeOpts) {
                this.themeOpts[key].setTint(colours.scroll);
            };
        }
    }

    //modifies scene
    changeTheme(themeName) {
        let theme = this.scene.theme = themes[themeName];
        this.scene.setUserData("themeName", themeName);

        this.scene.cameras.main.setBackgroundColor(theme.bg);
        this.changeTint();
        
        if(this.scene.player) this.scene.player.setTint(theme.player);
        if(this.scene.base) this.scene.base.setTint(theme.base);
        if(this.scene.coins) this.scene.coins.setTint(theme.coins);
        if(this.scene.platforms) this.scene.platforms.setTint(theme.platforms);
        if(this.scene.mobs) this.scene.mobs.setTint(theme.mobs);
        if(this.scene.pots) this.scene.pots.setTint(theme.pots);

        if(this.scene.tutorial?.active) this.scene.tutorial.changeTint();
        if(this.scene.asciiRain) this.scene.asciiRain.changeTint();

        if(this.scene.art) {
            let n = this.scene.art.length;
            for(let i = 0; i < n; i++) {
                let piece = this.scene.art[i];
                piece.setTint(theme.art);
            }
        }
    }
}