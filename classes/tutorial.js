export default class TUTORIAL extends Phaser.GameObjects.Container {
    constructor(scene, x, y) {  
        super(scene, x, y);
        scene.add.existing(this);

        let tint = this.scene.theme.scroll;
        
        this.scroll = scene.add.image(0, 350, 'scroll')
            .setTint(tint);
        this.headerTxt = scene.add.text(0, 200, 'Welcome to', {
            fontSize: '24pt', fill: '#FFF'
        }).setOrigin(0.5).setTint(tint);                
        this.title = scene.add.image(0, 275, 'title').setOrigin(0.5)
            .setTint(tint);
        this.subtitle = scene.add.text(0, 365, 'Where ASCII rains', {
            fontSize: '24pt', fill: '#FFF'
        }).setOrigin(0.5).setTint(tint);

        this.hintIdx = 0;
        this.hints = [
            'Click the [?] to see controls and options',
            'Click the [+] or [-] to toggle fullscreen',
            'Collect all the {$} to progress to next level'
        ]
        this.hint = scene.add.text(0, 430, this.hints[0], {
            fontSize: '18pt', fill: '#FFF', fontStyle: 'italic'
        }).setOrigin(0.5).setTint(tint);
        
        this.add([this.scroll, this.headerTxt, this.title, this.subtitle, this.hint]);
        this.setDepth(0);
    }

    changeHint() {
        if(this.hintIdx < 2) {
            this.hintIdx++;
        } else {
            this.hintIdx = 0;
        }
        this.hint.setText(this.hints[this.hintIdx]);
    }

    changeTint() {
        let colour = this.scene.theme.scroll;

        this.scroll.setTint(colour);
        this.headerTxt.setTint(colour);
        this.title.setTint(colour);
        this.subtitle.setTint(colour);
        this.hint.setTint(colour);
    }
}