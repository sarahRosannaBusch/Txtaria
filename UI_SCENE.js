class UI_SCENE extends Phaser.Scene {
    constructor() {
        super('UI_SCENE');
    }

    create() {
        this.scoreText = this.add.text(16, 16, 'score: 0', { 
            fontSize: '32px', fill: '#FFF' 
        });
        
        eventsCenter.on('update-score', this.updateScore, this);

        // clean up when Scene is shutdown
        this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
            eventsCenter.off('update-score', this.updateScore, this)
        });
    }

    updateScore(score) {
        this.scoreText.setText(`score: ${score}`);
    }
}