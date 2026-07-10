let canvas;
let world;
let keyboard = new Keyboard();
let ctx;
let currentScreen = 'start';
let startScreen;
let soundManager;
let uiControls;
let savedVolume = 0.5;
let level1 = null;
let isMuted = false;

function init() {
    ctx = canvas.getContext('2d');
    soundManager = new SoundManager();

    soundManager.loadSound('background', '../assets/sounds/background-musik.mp3', true);
    soundManager.loadSound('coin', '../assets/sounds/Coin-Colleted.mp3');
    soundManager.loadSound('bottle', '../assets/sounds/bottle-pick-up.mp3');
    soundManager.loadSound('enemy_die', '../assets/sounds/enemy-die.mp3');
    soundManager.loadSound('attack', '../assets/sounds/Attack-sound.mp3');
    soundManager.loadSound('character_swim', '../assets/sounds/Character-swim.mp3');
    soundManager.loadSound('damage', '../assets/sounds/characterDamage.mp3');
    soundManager.loadSound('dead', '../assets/sounds/characterDead.wav');
    soundManager.loadSound('snoring', '../assets/sounds/characterSnoring.mp3', false, true);
    soundManager.loadSound('fail', '../assets/sounds/Fail-sound.mp3');
    soundManager.loadSound('win', '../assets/sounds/Win-Sound.mp3');

    const savedVol = localStorage.getItem('sharkieSavedVolume');
    if (savedVol !== null) {
        savedVolume = parseFloat(savedVol);
    }

    soundManager.setVolume(savedVolume);
    soundManager.setMuted(isMuted);

    resetKeyboard();
    world = new World(canvas, keyboard, soundManager);
    uiControls = new UIControls(soundManager);

    if (startScreen) {
        startScreen.closeOverlay();
        startScreen.setVolume(savedVolume);
    }

    soundManager.playBackground();
}

function startGame() {
    level1 = null;
    currentScreen = 'playing';
    init();
}

function stopGame() {
    if (soundManager) {
        soundManager.stopBackground();
    }
}

function resetKeyboard() {
    keyboard.LEFT = false;
    keyboard.RIGHT = false;
    keyboard.UP = false;
    keyboard.DOWN = false;
    keyboard.SPACE = false;
    keyboard.E = false;
}

function setVolume(value) {
    savedVolume = Math.min(1, Math.max(0, value));
    localStorage.setItem('sharkieSavedVolume', savedVolume);
    if (startScreen) {
        startScreen.setVolume(savedVolume);
    }
    if (soundManager) {
        soundManager.setVolume(savedVolume);
    }
}

function toggleMute() {
    isMuted = !isMuted;
    if (soundManager) {
        soundManager.setMuted(isMuted);
    }
}

function showSettings() {
    if (startScreen) {
        startScreen.openSettings();
    }
}

function showImprint() {
    if (startScreen) {
        startScreen.openImprint();
    }
}

function closeOverlay() {
    if (startScreen) {
        startScreen.closeOverlay();
    }
}

function toggleFullscreen() {
    if (!document.fullscreenElement && canvas.requestFullscreen) {
        canvas.requestFullscreen().catch(err => {
            console.error('Fullscreen-Fehler:', err);
        });
    } else if (document.exitFullscreen) {
        document.exitFullscreen();
    }
}

function resetGame() {
    if (soundManager) {
        savedVolume = soundManager.volume;
        localStorage.setItem('sharkieSavedVolume', savedVolume);
        soundManager.stopAllSounds();
        soundManager = null;
    }

    if (world) {
        world.cleanup();
        world = null;
    }

    level1 = null;

    if (uiControls) {
        uiControls = null;
    }

    resetKeyboard();
    currentScreen = 'start';

    if (!startScreen) {
        startScreen = new StartScreen();
    } else {
        startScreen.closeOverlay();
        startScreen.setVolume(savedVolume);
    }
}

function draw() {
    if (currentScreen === 'start') {
        startScreen.draw(ctx);
    } else if (currentScreen === 'playing' && world) {
        world.draw();
        if (uiControls) {
            uiControls.draw(ctx);
        }
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
        startScreen.checkClick(x, y, startGame, showSettings, showImprint, toggleFullscreen, closeOverlay, setVolume);
    } else if (currentScreen === 'playing' && uiControls) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const result = uiControls.handleClick(x, y);
        if (result === 'back') {
            resetGame();
        } else if (result === 'mute') {
            toggleMute();
        } else if (result === 'fullscreen') {
            toggleFullscreen();
        }
    }
});

canvas.addEventListener('mousedown', (e) => {
    if (currentScreen === 'start' && startScreen && startScreen.activeOverlay === 'settings') {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        startScreen.startVolumeDrag(x);
    }
});

document.addEventListener('mousemove', (e) => {
    if (currentScreen === 'playing' && uiControls && uiControls.isDragging) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        uiControls.handleMouseMove(x);
    } else if (currentScreen === 'start' && startScreen && startScreen.isVolumeDragging) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        startScreen.updateVolumeFromX(x);
    }
});

document.addEventListener('mouseup', () => {
    if (currentScreen === 'playing' && uiControls) {
        uiControls.handleMouseUp();
    }
    if (startScreen) {
        startScreen.stopVolumeDrag();
    }
});

window.addEventListener('keydown', (e) => {
    const keyCode = e.keyCode || e.which;
    if (keyCode === 39 || keyCode === 68) keyboard.RIGHT = true;
    if (keyCode === 37 || keyCode === 65) keyboard.LEFT = true;
    if (keyCode === 40 || keyCode === 83) keyboard.DOWN = true;
    if (keyCode === 38 || keyCode === 87) keyboard.UP = true;
    if (keyCode === 32) keyboard.SPACE = true;
    if (keyCode === 69) keyboard.E = true;
});

window.addEventListener('keyup', (e) => {
    const keyCode = e.keyCode || e.which;
    if (keyCode === 39 || keyCode === 68) keyboard.RIGHT = false;
    if (keyCode === 37 || keyCode === 65) keyboard.LEFT = false;
    if (keyCode === 40 || keyCode === 83) keyboard.DOWN = false;
    if (keyCode === 38 || keyCode === 87) keyboard.UP = false;
    if (keyCode === 32) keyboard.SPACE = false;
    if (keyCode === 69) keyboard.E = false;
});

document.addEventListener('fullscreenchange', () => {
    if (document.fullscreenElement === canvas) {
        canvas.style.width = '100vw';
        canvas.style.height = '100vh';
    } else {
        canvas.style.width = '';
        canvas.style.height = '';
    }
});

startScreen = new StartScreen();
startScreen.setVolume(savedVolume);
draw();