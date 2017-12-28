(function() {
    let GAME_NAME       = 'GAME';
    let GAME_STATE_BOOT = 'BOOT';

    var Boot = function(game) {
        this.game      = game;
        this.cursor    = null;
        this.player    = null;
        this.ground    = null;
        this.stars     = null;
        this.scoreText = null;
        this.score     = 0;
        this.starsNum  = 0;
    };

    Boot.prototype = {    
        imageLoader : function (key) {
            this.game.load.image(key, 'assets/{0}.png'.format(key));
        },

        sheetLoader : function (key, w, h) {
            this.game.load.spritesheet(key, 'assets/{0}.png'.format(key), w, h);
        },

        resetStars : function() {
            for (var i=0; i<this.stars.length; i++) {
                this.stars.getChildAt(i).reset(i*70, 0);
                this.starsNum += 1;
            }
        },

        preload : function() {
            this.imageLoader('star');
            this.imageLoader('sky');
            this.imageLoader('platform');
            this.sheetLoader('dude', 32, 48);
        },

        create : function() {
            console.log("create");

            this.cursor = this.game.input.keyboard.createCursorKeys();

            this.game.physics.startSystem(Phaser.Physics.ARCADE);
            this.game.add.sprite(0, 0, 'sky');

            this.ground = this.game.add.group();
            this.ground.enableBody = true;
            var ground = this.ground.create(0, this.game.height-64, 'platform');
            ground.scale.setTo(2,2);
            ground.body.immovable = true;
            ground = this.ground.create(400, 400, 'platform');
            ground.body.immovable = true;
            ground = this.ground.create(-150, 250, 'platform');
            ground.body.immovable = true;
            
            this.player = this.game.add.sprite(32, this.game.world.height - 150, 'dude');
            this.game.physics.arcade.enable(this.player);
            this.player.body.collideWorldBounds = true;
            this.player.body.gravity.y = 300;
            this.player.body.bounce.y = 0.2;
            this.player.animations.add('left', [0,1,2,3], 10, true);
            this.player.animations.add('right', [5,6,7,8], 10, true);

            this.stars = this.game.add.group();
            this.stars.enableBody = true;
            for(i=0; i<12; i++) {
                var star = this.stars.create(i*70, 0, 'star');
                star.body.gravity.y = 120;
                star.body.bounce.y = 0.5 + Math.random() * 0.2;
                star.body.collideWorldBounds = true;
                this.starsNum += 1;
            }

            this.scoreText = this.game.add.text(16, 16, 'score: 0', { fontSize: '20px', fill: '#fff' });
        },

        update : function() {
            this.player.body.velocity.x = 0;
            var hitGround  = this.game.physics.arcade.collide(this.player, this.ground);
            this.game.physics.arcade.collide(this.ground, this.stars);
            
            if (this.cursor.left.isDown) {
                this.player.body.velocity.x = -150;
                this.player.animations.play('left');
            } else if (this.cursor.right.isDown) {
                this.player.body.velocity.x = 150;
                this.player.animations.play('right');
            } 
            else {
                this.player.animations.stop();
                this.player.frame = 4;
            }

            if (this.cursor.up.isDown && hitGround && this.player.body.touching.down) {
                this.player.body.velocity.y = -300;
            }
            
            this.game.physics.arcade.overlap(this.player, this.stars, function(_, star) {
                star.kill();
                this.score += 1;
                this.starsNum -= 1;
                this.scoreText.text = "score: " + this.score;
                if (this.starsNum <= 0) {
                    this.resetStars();
                }
            }, null, this);
        }
    }

    var Game = function() {};
    Game.main = function() {
        var game = new Phaser.Game(800, 600, Phaser.AUTO, GAME_NAME);
        game.state.add(GAME_STATE_BOOT, Boot);
        game.state.start(GAME_STATE_BOOT);
    }

    Game.main();
})();