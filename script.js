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
        arcade: { 
            gravity: { y: 0 },
            debug: false
        }
    }
};

const game = new Phaser.Game(config);
let player;
let cursors;
let touchControl = {
    active: false,
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0
};
let isMobile = false;

function preload() {
    // Load assets or use fallbacks
    this.load.setBaseURL('https://labs.phaser.io');
    this.load.image('player', 'assets/sprites/phaser-dude.png');
    this.load.image('enemy', 'assets/sprites/alien.png');
    this.load.image('wall', 'assets/skies/space-bg.png');
}

function create() {
    // Check if mobile
    isMobile = this.sys.game.device.os.android || this.sys.game.device.os.iOS;
    
    // Create player
    player = this.physics.add.sprite(400, 300, 'player');
    player.setCollideWorldBounds(true);
    
    // Create some walls
    this.physics.add.staticGroup()
        .create(200, 200, 'wall').setScale(0.5).refreshBody()
        .create(600, 400, 'wall').setScale(0.5).refreshBody();
    
    // Keyboard controls
    cursors = this.input.keyboard.createCursorKeys();
    this.input.keyboard.on('keydown-SPACE', () => blink(this));
    
    // Mobile controls
    if (isMobile) {
        document.getElementById('mobile-controls').style.display = 'flex';
        
        // Virtual joystick
        const joystickArea = document.getElementById('joystick-area');
        joystickArea.addEventListener('touchstart', handleTouchStart);
        joystickArea.addEventListener('touchmove', handleTouchMove);
        joystickArea.addEventListener('touchend', handleTouchEnd);
        
        // Blink button
        document.getElementById('blink-btn').addEventListener('touchstart', () => blink(this));
    }
    
    // Regular mouse click for blink
    this.input.on('pointerdown', () => blink(this));
}

function update() {
    // Movement controls
    if (isMobile && touchControl.active) {
        const dx = touchControl.currentX - touchControl.startX;
        const dy = touchControl.currentY - touchControl.startY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 10) { // Deadzone
            const angle = Math.atan2(dy, dx);
            player.setVelocityX(Math.cos(angle) * 200);
            player.setVelocityY(Math.sin(angle) * 200);
        } else {
            player.setVelocity(0);
        }
    } else {
        // Keyboard controls
        player.setVelocity(0);
        
        if (cursors.left.isDown) {
            player.setVelocityX(-200);
        } else if (cursors.right.isDown) {
            player.setVelocityX(200);
        }
        
        if (cursors.up.isDown) {
            player.setVelocityY(-200);
        } else if (cursors.down.isDown) {
            player.setVelocityY(200);
        }
    }
}

function blink(scene) {
    scene.cameras.main.flash(300);
    scene.tweens.add({
        targets: player,
        scaleX: 1.5,
        scaleY: 1.5,
        duration: 200,
        yoyo: true
    });
}

function handleTouchStart(e) {
    const touch = e.touches[0];
    touchControl.active = true;
    touchControl.startX = touch.clientX;
    touchControl.startY = touch.clientY;
    touchControl.currentX = touch.clientX;
    touchControl.currentY = touch.clientY;
    e.preventDefault();
}

function handleTouchMove(e) {
    if (touchControl.active) {
        const touch = e.touches[0];
        touchControl.currentX = touch.clientX;
        touchControl.currentY = touch.clientY;
        e.preventDefault();
    }
}

function handleTouchEnd() {
    touchControl.active = false;
    player.setVelocity(0);
}
