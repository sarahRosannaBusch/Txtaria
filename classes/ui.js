import { themes } from "../../themes.js";

export default class UI {
    constructor(scene) {  
        this.scene = scene;
        this.helpShowing = false;
        this.soundOn = false;

        let fontStyle = { 
            fontSize: '24pt', 
            fill: '#FFF'
        };
        
        //UI
        this.scoreText = scene.add.text(16, 16, `score: $${scene.score}`, fontStyle)
            .setTint(scene.theme.ui);
        this.levelText = scene.add.text(512, 32, `level: ${scene.level} / 12`, fontStyle)
            .setOrigin(0.5).setTint(scene.theme.ui);
        
        //help button
        this.helpBtn = scene.add.text(1024 - 120, 16, '[?]', fontStyle).setOrigin(1, 0)
            .setInteractive().setTint(scene.theme.ui);
        this.helpBtn.on('pointerup', () => {            
            this.showHelp(!this.helpShowing);
        });                
        scene.input.keyboard.on('keydown-ESC', () => {
            this.showHelp(!this.helpShowing);
        });

        //fullscreen button
        this.fsBtn = scene.add.text(1024 - 16, 16, '[+]', fontStyle).setOrigin(1, 0)
            .setInteractive().setTint(scene.theme.ui);
        this.fsBtn.on('pointerup', () => {
            this.toggleFullscreen();
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
        this.levelText.setText(`level: ${level} / 12`);
    }

    toggleFullscreen() {
        let fs = this.scene.scale.isFullscreen ? ' ' : 'X';
        if(this.helpShowing) {
            this.optFS.setText(`[${fs}] fullscreen`);
            console.log(fs);
        }
        if(this.scene.scale.isFullscreen) {
            this.scene.scale.stopFullscreen();
            this.fsBtn.setText("[+]");
            fs = ' ';
        } else {
            this.scene.scale.startFullscreen();
            this.fsBtn.setText("[-]");
            fs = 'X';
        }
    }

    toggleSound() {
        this.soundOn = !this.soundOn;
        //todo
    }

    showHelp(show) {     
        if(show) {   
            let fontStyle = { fontSize: '24px', fill: '#FFF' };
            let tint = this.scene.theme.scroll;
            let fs = this.scene.scale.isFullscreen ? 'X' : ' ';
            let s = this.soundOn ? 'X' : ' ';
            //this.scene.physics.pause(); //todo: just pause the mobs instead

            this.helpBtn.setText("[X]");
            this.helpScrollBG = this.scene.add.image(512, 350, 'scrollBG')
                .setTint(this.scene.theme.bg);
            this.helpScroll = this.scene.add.image(512, 350, 'scroll')
                .setTint(tint);

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

            this.optFS = this.scene.add.text(x, 230, `[${fs}] fullscreen`,
                fontStyle).setInteractive().setTint(tint);
            this.optFS.on('pointerup', () => {
                this.toggleFullscreen();
            });

            this.optSound = this.scene.add.text(x, 260, `[${s}] sound`,
                fontStyle).setInteractive().setTint(tint);
            this.optSound.on('pointerup', () => {
                this.toggleSound();
                s = this.soundOn ? 'X' : ' ';
                this.optSound.setText(`[${s}] sound`);
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
                });
            });
            
            this.help = this.scene.add.container(0, 0, [
                this.helpScrollBG, 
                this.helpScroll, 
                this.controlsText, 
                this.optsText, 
                this.optFS, 
                this.optSound,
                this.themesText,
                this.themeOpts.Textarea, //todo: iterate these instead
                this.themeOpts.Coding_Vibes,
                this.themeOpts.Light_Bright,
                this.themeOpts.Matrix_Mode,
                this.themeOpts.Paper
            ]);
            this.help.setDepth(100);
        } else {
            this.scene.physics.resume();
            this.helpBtn.setText("[?]");
            this.help.destroy();
        }
        
        this.helpShowing = !this.helpShowing;
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
        this.scene.themeName = themeName;
        localStorage.setItem("theme", themeName);

        this.scene.cameras.main.setBackgroundColor(theme.bg);
        this.changeTint();
        
        if(this.scene.player) this.scene.player.setTint(theme.player);
        if(this.scene.base) this.scene.base.setTint(theme.base);
        if(this.scene.coins) this.scene.coins.setTint(theme.coins);
        if(this.scene.platforms) this.scene.platforms.setTint(theme.platforms);
        if(this.scene.mobs) this.scene.mobs.setTint(theme.mobs);
        if(this.scene.pots) this.scene.pots.setTint(theme.pots);

        if(this.scene.tutorial) this.scene.tutorial.changeTint();
        if(this.scene.asciiRain) this.scene.asciiRain.changeTint();
    }
}