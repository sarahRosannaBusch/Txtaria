# Description

A single-pane ASCII-art platformer made with Phaser.io

## To Run locally
- install node (if you don't have it)
- run `node server` from project root
- open http://localhost:9999/index.html

## Design
- responsive
- consistent experience in all browsers
- accessible (both visual and auditory cues, big font, 5 colour themes)
- toggle fullscreen and sound
- simple keyboard and touch controls (left, right, jump, stomp)
- TODO: controller controls

### Landing Page
- Simple animated banner and play button.
- Completely contained in index.html
- Loads nicely even over slow connections

### Data
- stored in localStorage: level, themeName, soundOn, devMode
- `localStorage.clear();` in browser console to wipe memory

### Dev Mode
- `localStorage.setItem("devMode", 1);` in browser console to skip title screen and asciiRain tween

### Game Area
- 1024 x 768 px, scaled to fit
- This provides the most consistent experience across devices and browsers

### Scene
- single scene object that has components swapped out from level to level
- game logic and event handling done in scene.js, everything else is modular components
- base, player, and ui always persist

## Phaser References
- tutorial: https://phaser.io/tutorials/making-your-first-phaser-3-game/part1
- responsiveness: https://newdocs.phaser.io/docs/3.60.0/Phaser.Scale
- WASD controls: https://newdocs.phaser.io/docs/3.60.0/Phaser.Input.Keyboard.KeyboardPlugin#addKeys
- Touch input: https://newdocs.phaser.io/docs/3.60.0/Phaser.Input.Pointer
- Fullscreen button: https://github.com/photonstorm/phaser3-examples/blob/master/public/src/scalemanager/full%20screen%20game.js
- Retry button: https://newdocs.phaser.io/docs/3.60.0/Phaser.Scenes.ScenePlugin#restart
    and https://newdocs.phaser.io/docs/3.60.0/Phaser.GameObjects.Text
- Containers: https://newdocs.phaser.io/docs/3.60.0/focus/Phaser.GameObjects.GameObjectFactory-container
- Tweens: https://labs.phaser.io/edit.html?src=src/time\timeline\create%20timeline.js
    and https://newdocs.phaser.io/docs/3.60.0/Phaser.Tweens.TweenManager#tweens
- Class extends: https://phasergames.com/extend-a-sprite-in-phaser-3/?mc_cid=3f4ee26e5d&mc_eid=a4d9ee0291
    and https://newdocs.phaser.io/docs/3.55.2/Phaser.Physics.Arcade.Sprite
    and https://newdocs.phaser.io/docs/3.55.2/Phaser.Physics.Arcade.Group
- Tinting: https://newdocs.phaser.io/docs/3.55.2/Phaser.GameObjects.Components.Tint
- Sound FX: https://newdocs.phaser.io/docs/3.55.2/Phaser.Sound.Events and
    https://newdocs.phaser.io/docs/3.54.0/focus/Phaser.Loader.LoaderPlugin-audio
- Loading Screen: https://gamedevacademy.org/creating-a-preloading-screen-in-phaser-3/