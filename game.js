var config = {
    type: Phaser.AUTO,
    width: 1024, 
    height: 768,    
    backgroundColor: '#121212',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: [ LVL_0, UI_SCENE ]
};

const eventsCenter = new Phaser.Events.EventEmitter();

var game = new Phaser.Game(config);
