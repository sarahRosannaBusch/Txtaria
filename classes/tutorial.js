export default class TUTORIAL extends Phaser.GameObjects.Container {
    constructor(scene, x, y) {  
        super(scene, x, y);
        scene.add.existing(this);
        
        let scroll = scene.add.image(0, 350, 'scroll');
        let headerTxt = scene.add.text(0, 200, 'Welcome to', {
            fontSize: '24pt', fill: '#FFF'
        }).setOrigin(0.5);                
        let title = scene.add.image(0, 275, 'title').setOrigin(0.5);
        let subtitle = scene.add.text(0, 365, 'Where ASCII rains', {
            fontSize: '24pt', fill: '#FFF'
        }).setOrigin(0.5);

        this.hintIdx = 0;
        this.hints = [
            'Click the [?] to see controls and options',
            'Click the [+] or [-] to toggle fullscreen',
            'Collect all the {$} to progress to next level'
        ]
        this.hint = scene.add.text(0, 430, this.hints[0], {
            fontSize: '18pt', fill: '#FFF', fontStyle: 'italic'
        }).setOrigin(0.5);
        
        this.add([scroll, headerTxt, title, subtitle, this.hint]);
    }

    changeHint() {
        if(this.hintIdx < 2) {
            this.hintIdx++;
        } else {
            this.hintIdx = 0;
        }
        this.hint.setText(this.hints[this.hintIdx]);
    }
}