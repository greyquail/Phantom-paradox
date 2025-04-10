// Game config
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: { gravity: { y: 0 } }
    }
};

const game = new Phaser.Game(config);

function preload() {
    // Load assets (replace with your GitHub-hosted files)
    this.load.image('player', 'assets/images/player.png');
    this.load.image('enemy', 'assets/images/enemy.png');
    this.load.image('wall', 'assets/images/wall.png');
    this.load.audio('blink', 'assets/sounds/blink.wav');
}

function create() {
    // Create maze, player, enemies
    this.player = this.physics.add.sprite(400, 300, 'player');
    this.enemies = this.physics.add.group();
    this.walls = this.physics.add.staticGroup();

    // Generate procedural maze
    generateMaze(this);

    // Blink mechanic (spacebar/tap)
    this.input.keyboard.on('keydown-SPACE', () => blink(this));
    this.input.on('pointerdown', () => blink(this));

    // Mobile controls
    if (this.sys.game.device.os.android || this.sys.game.device.os.iOS) {
        addMobileControls(this);
    }
}

function update() {
    // Enemy AI: Only moves when player isn't looking
    if (!this.isBlinking) {
        this.enemies.getChildren().forEach(enemy => {
            // Chase player logic
        });
    }
}

function blink(scene) {
    scene.isBlinking = true;
    scene.cameras.main.flash(300);
    scene.sound.play('blink');
    setTimeout(() => { scene.isBlinking = false; }, 1000);
}
