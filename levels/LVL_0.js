class LVL_0 extends Phaser.Scene {
    constructor() {
        super({key:"LVL_0"});
    }

    preload() {
        this.load.image('ground', 'assets/ground.png');
        this.load.image('platform0', 'assets/platform0.png');
        this.load.image('platform1', 'assets/platform1.png');
        this.load.image('platform2', 'assets/platform2.png');
        this.load.image('platform3', 'assets/platform3.png');
        this.load.image('star', 'assets/star.png');
        this.load.image('healthPot', 'assets/healthPot.png');
        this.load.image('mob0', 'assets/mob0.png');    
        this.load.image('mob1', 'assets/mob1.png');
        this.load.image('bomb', 'assets/bomb.png');
        this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 51.888, frameHeight: 98 });
        //this.soundFX = this.load.audio('sound', ['assets/sound.mp3]);
        //this.soundFX.play();

        this.score = 0;
        this.gameOver = false;
    }

    create () {
        //  The platforms group contains the ground and the 3 ledges we can jump on
        this.platforms = this.physics.add.staticGroup();
    
        //  Here we create the ground.
        this.platforms.create(512, 748, 'ground');
    
        //  Now let's create some ledges
        this.platforms.create(420, 250, 'platform0').setOrigin(0, 0).refreshBody();
        this.platforms.create(744, 370, 'platform1').setOrigin(0, 0).refreshBody();
        this.platforms.create(5, 410, 'platform2').setOrigin(0, 0).refreshBody();
        this.platforms.create(460, 550, 'platform3').setOrigin(0, 0).refreshBody();
    
        // The player and its settings
        this.player = this.physics.add.sprite(100, 650, 'dude');
    
        //  Player physics properties. Give the little guy a slight bounce.
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);
    
        //  Our player animations, turning, walking left and walking right.
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 2 }),
            frameRate: 8,
            repeat: -1
        });
    
        this.anims.create({
            key: 'turn',
            frames: [ { key: 'dude', frame: 3 } ],
            frameRate: 20
        });
    
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 4, end: 6 }),
            frameRate: 8,
            repeat: -1
        });
    
        //  Some stars to collect, 12 in total, evenly spaced 70 pixels apart along the x axis
        this.stars = this.physics.add.group({
            key: 'star',
            repeat: 11,
            setXY: { x: 25, y: 0, stepX: 85 }
        });
    
        this.stars.children.iterate(function (child) {
            //  Give each star a slightly different bounce
            child.setBounceY(Phaser.Math.FloatBetween(0.2, 0.4));
        });
    
        this.bombs = this.physics.add.group();
        this.mobs = this.physics.add.group();
        
        //  Collide the player and the stars with the platforms
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.stars, this.platforms);
        this.physics.add.collider(this.bombs, this.platforms);
        this.physics.add.collider(this.mobs, this.platforms);
        this.physics.add.collider(this.mobs, this.player);
    
        //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
        this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);
        this.physics.add.overlap(this.player, this.bombs, this.hitMob, null, this);
        this.physics.add.overlap(this.player, this.mobs, this.hitMob, null, this);
    
        //  Input Events
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys('W,S,A,D');
        this.input.addPointer(1); //for multi-touch
            
        //adding fullscreen buttons from phaser3-examples
        const button = this.add.text(1024 - 16, 16, '[+]', { fontSize: '32px', fill: '#FFF' }).setOrigin(1, 0).setInteractive();
        button.on('pointerup', function () {
            if (this.scale.isFullscreen) {
                this.scale.stopFullscreen();
            } else {
                this.scale.startFullscreen();
            }
        }, this);
        
        this.scene.run('UI_SCENE');
    }
    
    update () {
        if (this.gameOver) {
            const button = this.add.text(470, 384, 'retry', {
                color:'white', fontSize:'xx-large', fixedWidth: 100, fixedHeight: 35
            }).setInteractive();
            button.on('pointerup', function () {
                //this.scene.start("LVL_1");
                this.scene.restart();
                this.gameOver = false;
            }, this);
            return;
        }
    
        this.dirPointer = this.input.pointer1;
        this.jumpPointer = this.input.pointer2;
    
        this.jump = this.jumpPointer.isDown ? true : false;
    
        if(this.dirPointer.isDown) {
            let x = this.dirPointer.position.x;
            let y = this.dirPointer.position.y;
            if(x > 400) {
                this.dir = 'right';
            } else {            
                this.dir = 'left';
            }
        } else {
            this.dir = false;
            if(this.dirPointer.getDuration() > 0 && this.dirPointer.getDuration() < 150) {
                //if dirPointer isn't down and screen is tapped, jump
                this.jump = true;
            }
        }
    
        if (this.dir === 'left' || this.cursors.left.isDown || this.wasd.A.isDown) {
            this.player.setVelocityX(-160);
            this.player.anims.play('left', true);
        }
        else if (this.dir === 'right' || this.cursors.right.isDown || this.wasd.D.isDown) {
            this.player.setVelocityX(160);
            this.player.anims.play('right', true);
        }
        else {
            this.player.setVelocityX(0);
            this.player.anims.play('turn');
        }
    
        if ((this.jump === true || this.cursors.up.isDown || this.wasd.W.isDown) && this.player.body.touching.down){
            this.player.setVelocityY(-330);
        }
    }
    
    collectStar (player, star) {
        star.disableBody(true, true);
    
        //  Add and update the score
        this.score += 10;
        eventsCenter.emit('update-score', this.score);
    
        if (!this.gameOver && this.stars.countActive(true) === 0)
        {
            //  A new batch of stars to collect
            this.stars.children.iterate(function (child) {
                child.enableBody(true, child.x, 0, true, true);
            });
    
            var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
    
            if(this.score === 120) {
                var mob = this.mobs.create(x, 16, 'mob0');
                mob.setBounce(0.2);
                mob.setCollideWorldBounds(true);
                mob.setVelocity(Phaser.Math.Between(-200, 200), 20);
                mob.allowGravity = true;
            } else if(this.score === 240) {
                var mob = this.mobs.create(x, 16, 'mob1');
                mob.setBounce(0.2);
                mob.setCollideWorldBounds(true);
                mob.setVelocity(Phaser.Math.Between(-200, 200), 20);
                mob.allowGravity = false;
            } else {
                var bomb = this.bombs.create(x, 16, 'bomb');
                bomb.setBounce(1);
                bomb.setCollideWorldBounds(true);
                bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
                bomb.allowGravity = false;
            }
        }
    }
    
    hitMob (player, mob) {
        this.physics.pause();
        player.setTint(0xff0000);
        player.anims.play('turn');
        this.gameOver = true;
    }
}