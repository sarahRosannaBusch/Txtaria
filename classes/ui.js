export default class UI {
    constructor(scene, level) {  
        this.scene = scene;
        this.helpShowing = false;
        this.soundOn = false;

        let fontStyle = { fontSize: '24pt', fill: '#FFF', backgroundColor: this.scene.game.config.backgroundColor.rgba };
        
        //UI
        this.scoreText = this.scene.add.text(16, 16, 'score: $0', fontStyle);
        this.levelText = this.scene.add.text(512, 32, `level: ${level} / 12`, fontStyle).setOrigin(0.5);
        
        //help button
        this.helpBtn = this.scene.add.text(1024 - 120, 16, '[?]', fontStyle).setOrigin(1, 0).setInteractive();
        this.helpBtn.on('pointerup', () => {            
            this.showHelp(!this.helpShowing);
        });                
        this.scene.input.keyboard.on('keydown-ESC', () => {
            this.showHelp(!this.helpShowing);
        });

        //fullscreen button
        this.fsBtn = this.scene.add.text(1024 - 16, 16, '[+]', fontStyle).setOrigin(1, 0).setInteractive();
        this.fsBtn.on('pointerup', () => {
            this.toggleFullscreen();
        });

        let container = this.scene.add.container(0, 0, [this.scoreText, this.levelText, this.helpBtn, this.fsBtn]);
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
            this.scene.physics.pause();
            this.helpBtn.setText("[X]");
            this.helpScroll = this.scene.add.image(512, 350, 'scroll');
            let fs = this.scene.scale.isFullscreen ? 'X' : ' ';
            this.helpText = this.scene.add.text(200, 180, `
KEYBOARD CONTROLS:
w,a,s,d or arrow keys

TWO-FINGER TOUCH:
1. hold left/right side of screen to move
2. tap anywhere to jump
3. swipe down to stomp

OPTIONS:
            `, { fontSize: '24px', fill: '#FFF' });

            this.optFS = this.scene.add.text(200, 415, `[${fs}] fullscreen`,
                { fontSize: '24px', fill: '#FFF' }).setInteractive();
            this.optFS.on('pointerup', () => {
                this.toggleFullscreen();
            });

            let s = this.soundOn ? 'X' : ' ';
            this.optSound = this.scene.add.text(200, 435, `[${s}] sound`,
                { fontSize: '24px', fill: '#FFF' }).setInteractive();
            this.optSound.on('pointerup', () => {
                this.toggleSound();
                s = this.soundOn ? 'X' : ' ';
                this.optSound.setText(`[${s}] sound`);
            });
            
            this.help = this.scene.add.container(0, 0, [this.helpScroll, this.helpText, this.optFS, this.optSound]);
            this.help.setDepth(100);
        } else {
            this.scene.physics.resume();
            this.helpBtn.setText("[?]");
            this.help.destroy();
        }
        
        this.helpShowing = !this.helpShowing;
    }
}