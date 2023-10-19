const config = {
    parent: "game",
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
    scene: [ GAME ]
};

const game = new Phaser.Game(config);