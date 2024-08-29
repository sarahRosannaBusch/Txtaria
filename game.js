import SCENE from "./classes/scene.js";

const config = {
    parent: "game",
    type: Phaser.AUTO, //falls back to canvas if webgl isn't available
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
            gravity: { y: 500 },
            debug: false
        }
    },
    scene: [ SCENE ]
};

export default function playGame() {
    const game = new Phaser.Game(config);
}