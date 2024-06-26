export default class TUTORIAL extends Phaser.GameObjects.Container {
    constructor(scene, x, y) {  
        super(scene, x, y);
        scene.add.existing(this);

        let tint = this.scene.theme.scroll;
        
        this.scroll = scene.add.image(0, 350, 'scroll')
            .setTint(tint);
        this.headerTxt = scene.add.text(0, 225, 'Welcome to', {
            fontSize: '24pt', fill: '#FFF'
        }).setOrigin(0.5).setTint(tint);                
        this.title = scene.add.image(0, 300, 'title').setOrigin(0.5)
            .setTint(tint);

        this.hintIdx = 0;
        this.hints = [
            'Collect all the {$} to progress to next level',
            'Click the [+] or [-] to toggle fullscreen',
            'Click the [?] to see controls and options'
        ]
        this.hint = scene.add.text(0, 400, this.hints[0], {
            fontSize: '18pt', fill: '#FFF', fontStyle: 'italic'
        }).setOrigin(0.5).setTint(tint);
        
        this.add([this.scroll, this.headerTxt, this.title, this.hint]);
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
        this.hint.setTint(colour);
    }
}