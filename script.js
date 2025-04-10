// script.js - Full Phaser game with asset fallbacks
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
    arcade: { debug: false }
  }
};

const game = new Phaser.Game(config);

// Fallback graphics (emoji)
const assets = {
  player: '🟢',
  enemy: '👻',
  wall: '🧱',
  blinkSound: 'https://assets.mixkit.co/sfx/preview/mixkit-quick-jump-arcade-game-239.mp3'
};

function preload() {
  // Try loading assets, fallback to emoji
  try {
    this.load.image('player', 'assets/images/player.png');
    this.load.image('enemy', 'assets/images/enemy.png');
    this.load.audio('blink', assets.blinkSound);
  } catch (e) {
    console.log("Using fallback assets");
  }
}

function create() {
  // Create game objects
  this.player = this.add.text(400, 300, assets.player, { fontSize: '32px' });
  this.physics.add.existing(this.player);

  // Generate maze
  for (let i = 0; i < 10; i++) {
    const wall = this.add.text(Phaser.Math.Between(0, 800), 
                              Phaser.Math.Between(0, 600), 
                              assets.wall, { fontSize: '32px' });
    this.physics.add.existing(wall, true);
  }

  // Blink mechanic
  this.input.keyboard.on('keydown-SPACE', () => blink(this));
  this.input.on('pointerdown', () => blink(this));

  // Mobile controls
  if (this.sys.game.device.os.android || this.sys.game.device.os.iOS) {
    const btn = document.createElement('div');
    btn.className = 'control-btn';
    btn.innerText = 'BLINK';
    btn.addEventListener('touchstart', () => blink(this));
    document.getElementById('mobile-controls').appendChild(btn);
  }
}

function update() {
  // Movement logic
  const cursors = this.input.keyboard.createCursorKeys();
  if (cursors.left.isDown) this.player.x -= 5;
  if (cursors.right.isDown) this.player.x += 5;
  if (cursors.up.isDown) this.player.y -= 5;
  if (cursors.down.isDown) this.player.y += 5;
}

function blink(scene) {
  scene.cameras.main.flash(300);
  try {
    scene.sound.play('blink');
  } catch (e) {
    console.log("Sound not loaded");
  }
}
