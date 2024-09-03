export default class TIPS {
    constructor(scene) {  
        this.scene = scene;

        scene.input.keyboard.on('keydown-ENTER', () => {
            if(this.scene.tipsShowing) {
                this.payFine();
            }
        });
    }

    showTips(mob) {  
        this.mob = mob;
        this.scene.tipsShowing = true;        
        this.tips = [];
        this.tips.push(this.scene.add.image(512, 350, 'scrollBG').setDepth(97).setTint(this.scene.theme.bg));
        this.tips.push(this.scene.add.image(512, 350, 'scroll').setDepth(98).setTint(this.scene.theme.scroll));

        this.tips.push(this.scene.add.image(500, 250, mob.key).setDepth(99).setTint(this.scene.theme.scroll).setOrigin(0.5, 0.5)); 
        this.tips.push(this.scene.add.text(350, 325, mob.tip, {
            color:'white', fontSize:'xx-large',
        }).setDepth(99).setTint(this.scene.theme.scroll).setOrigin(0.5, 0.5)); 

        const payBtn = this.scene.add.text(512, 420, `[${mob.button}]`, {
            color:'white', fontSize:'xx-large', 
        }).setInteractive().setDepth(99).setOrigin(0.5, 0.5).setTint(this.scene.theme.scroll);
        payBtn.on('pointerup', () => {
            this.payFine();
        });
        this.tips.push(payBtn);
    }

    hideTips() {
        this.tips.forEach((t) => t.destroy());
        this.scene.physics.resume();
        this.scene.tipsShowing = false; 
        this.mob.destroy();
    }

    payFine() {          
        this.scene.ui.updateScore(this.scene.score - this.mob.fine);
    }
}