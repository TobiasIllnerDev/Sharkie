let canvas;
let world;
let keyboard = new Keyboard();
let ctx;
let currentScreen = 'start';
let startScreen;
let soundManager;

function init(){
    ctx = canvas.getContext('2d');
    soundManager = new SoundManager();

    
    soundManager.loadSound('background', '../assets/sounds/background-musik.mp3', 'background', true);
    soundManager.loadSound('coin', '../assets/sounds/Coin-Colleted.mp3', 'collectibles');
    soundManager.loadSound('bottle', '../assets/sounds/bottle-pick-up.mp3', 'collectibles');
    soundManager.loadSound('enemy_die', '../assets/sounds/enemy-die.mp3', 'effects');
    soundManager.loadSound('attack', '../assets/sounds/Attack-sound.mp3', 'effects');
    soundManager.loadSound('character_swim', '../assets/sounds/Character-swim.mp3', 'character');
    soundManager.loadSound('damage', '../assets/sounds/characterDamage.mp3', 'effects');
    soundManager.loadSound('dead', '../assets/sounds/characterDead.wav', 'character');
    soundManager.loadSound('snoring', '../assets/sounds/characterSnoring.mp3', 'character');
    soundManager.loadSound('fail', '../assets/sounds/Fail-sound.mp3', 'effects');
    soundManager.loadSound('win', '../assets/sounds/Win-Sound.mp3', 'effects');

    world = new World(canvas, keyboard, soundManager);
    soundManager.playBackground();
}

function startGame() {
    currentScreen = 'playing';
    init();
}

function stopGame() {
    if (soundManager) {
        soundManager.stopBackground();
    }
}

window.addEventListener('beforeunload', () => {
    stopGame();
});

function showSettings() {
    console.log('Einstellungen geöffnet');
}

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.error('Fullscreen-Fehler:', err);
        });
    } else {
        document.exitFullscreen();
    }
}

function draw() {
    if(currentScreen === 'start') {
        startScreen.draw(ctx);
    } else if (currentScreen === 'playing' && world) {
        world.draw();
    }

    requestAnimationFrame(draw);
}

canvas = document.getElementById('canvas');
ctx = canvas.getContext('2d');

canvas.addEventListener('click', (e) => {
    if (currentScreen === 'start') {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        startScreen.checkClick(x, y, startGame, showSettings, toggleFullscreen);
    }
});

window.addEventListener('keydown', (e) => {
    if(e.keyCode == 39 || e.keyCode == 68) {
        keyboard.RIGHT = true;
    }

    if(e.keyCode == 37 || e.keyCode == 65) {
        keyboard.LEFT = true;
    }

    if(e.keyCode == 40 || e.keyCode == 83) {
        keyboard.DOWN = true;
    }

    if(e.keyCode == 38 || e.keyCode == 87) {
        keyboard.UP = true;
    }

    if(e.keyCode == 32) {
        keyboard.SPACE  = true;
    }
    if(e.keyCode == 69) { 
        keyboard.E = true;
    }
})

window.addEventListener('keyup', (e) => {
    if(e.keyCode == 39 || e.keyCode == 68) {
        keyboard.RIGHT = false;
    }

    if(e.keyCode == 37 || e.keyCode == 65) {
        keyboard.LEFT = false;
    }

    if(e.keyCode == 40 || e.keyCode == 83) {
        keyboard.DOWN = false;
    }

    if(e.keyCode == 38 || e.keyCode == 87) {
        keyboard.UP = false;
    }

    if(e.keyCode == 32) {
        keyboard.SPACE  = false;
    }
    if(e.keyCode == 69) {
        keyboard.E = false;
    }
})


startScreen = new StartScreen();
draw();