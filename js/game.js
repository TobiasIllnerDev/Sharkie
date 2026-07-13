let canvas;
let gameContainer;
let world;
let keyboard = new Keyboard();
let ctx;
let currentScreen = 'start';
let startScreen;
let endScreen = new EndScreen();
let soundManager;
let uiControls;
let savedVolume = 0.5;
let level1 = null;
let isMuted = false;

function restoreSavedVolume() {
    const storedVolume = localStorage.getItem('sharkieSavedVolume');
    if (storedVolume === null) {
        return;
    }

    const parsedVolume = Number.parseFloat(storedVolume);
    if (Number.isFinite(parsedVolume)) {
        savedVolume = Math.min(1, Math.max(0, parsedVolume));
    }
}

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
    if (!document.fullscreenElement && gameContainer.requestFullscreen) {
        gameContainer.requestFullscreen().catch(err => {
            console.error('Fullscreen-Fehler:', err);
        });
    } else if (document.exitFullscreen) {
        document.exitFullscreen();
    }
}

const pauseMenuButtons = [
    { action: 'resume', text: 'WEITER', x: 240, y: 170, width: 240, height: 50 },
    { action: 'restart', text: 'NEUSTART', x: 240, y: 240, width: 240, height: 50 },
    { action: 'menu', text: 'MENU', x: 240, y: 310, width: 240, height: 50 }
];

function pauseGame() {
    if (currentScreen === 'playing' && world) {
        world.pause();
        currentScreen = 'paused';
    }
}

function resumeGame() {
    if (currentScreen === 'paused' && world) {
        world.resume();
        currentScreen = 'playing';
    }
}

function isPauseMenuButtonHovered(x, y, button) {
    return x >= button.x && x <= button.x + button.width &&
           y >= button.y && y <= button.y + button.height;
}

function getPauseMenuAction(x, y) {
    const button = pauseMenuButtons.find(menuButton => isPauseMenuButtonHovered(x, y, menuButton));
    return button ? button.action : null;
}

function handlePauseMenuClick(x, y) {
    const action = getPauseMenuAction(x, y);

    if (action === 'resume') {
        resumeGame();
    } else if (action === 'restart') {
        restartGame();
    } else if (action === 'menu') {
        resetGame();
    }
}

function drawPauseOverlay(ctx) {
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#1a8fb4';
    ctx.font = '48px Luckiest Guy';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('PAUSE', 360, 105);

    pauseMenuButtons.forEach(button => {
        ctx.fillStyle = 'rgba(26, 143, 180, 0.85)';
        ctx.fillRect(button.x, button.y, button.width, button.height);
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.strokeRect(button.x, button.y, button.width, button.height);

        ctx.fillStyle = 'white';
        ctx.font = '24px Luckiest Guy';
        ctx.fillText(button.text, button.x + button.width / 2, button.y + button.height / 2);
    });

    ctx.restore();
}

function getCanvasCoordinates(event) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: (event.clientX - rect.left) * (canvas.width / rect.width),
        y: (event.clientY - rect.top) * (canvas.height / rect.height)
    };
}

function initTouchControls() {
    const touchButtons = document.querySelectorAll('#touch-controls [data-key]');

    touchButtons.forEach(button => {
        const key = button.dataset.key;

        button.addEventListener('pointerdown', (event) => {
            event.preventDefault();
            button.setPointerCapture(event.pointerId);
            keyboard[key] = true;
            button.classList.add('is-pressed');
        });

        button.addEventListener('pointerup', (event) => {
            event.preventDefault();
            keyboard[key] = false;
            button.classList.remove('is-pressed');
        });

        button.addEventListener('pointercancel', () => {
            keyboard[key] = false;
            button.classList.remove('is-pressed');
        });

        button.addEventListener('lostpointercapture', () => {
            keyboard[key] = false;
            button.classList.remove('is-pressed');
        });

        button.addEventListener('contextmenu', (event) => {
            event.preventDefault();
        });
    });
}

function updateTouchControlsVisibility() {
    gameContainer.classList.toggle('show-touch-controls', currentScreen === 'playing');
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

function restartGame() {
    resetGame();
    startGame();
}

function draw() {
    updateTouchControlsVisibility();

    if (currentScreen === 'start') {
        startScreen.draw(ctx);
    } else if (currentScreen === 'playing' && world) {
        world.draw();
        if (uiControls) uiControls.draw(ctx);

        if (world.gameOver) {
            currentScreen = 'gameover';
        } else if (world.win) {
            currentScreen = 'win';
        }
    } else if (currentScreen === 'gameover') {
        world.draw();
        endScreen.draw(ctx, 'gameover');
    } else if (currentScreen === 'win') {
        world.draw();
        endScreen.draw(ctx, 'win');
    } else if (currentScreen === 'paused') {
        world.draw();
        if (uiControls) uiControls.draw(ctx);
        drawPauseOverlay(ctx);
    }
    requestAnimationFrame(draw);
}

canvas = document.getElementById('canvas');
gameContainer = document.getElementById('game-container');
ctx = canvas.getContext('2d');

canvas.addEventListener('click', (e) => {
    const { x, y } = getCanvasCoordinates(e);
    if (currentScreen === 'paused') {
        handlePauseMenuClick(x, y);
    } else if (currentScreen === 'start') {
        startScreen.checkClick(x, y, startGame, showSettings, showImprint, toggleFullscreen, closeOverlay, setVolume);
    } else if (currentScreen === 'playing' && uiControls) {
        const result = uiControls.handleClick(x, y);
        if (result === 'mute') {
            toggleMute();
        } else if (result === 'fullscreen') {
            toggleFullscreen();
        } else if (result === 'pause') {
            pauseGame();
        }
    } else if ((currentScreen === 'gameover' || currentScreen === 'win') && endScreen.isButtonClicked(x, y)) {
        restartGame();
    }
});

document.addEventListener('mousemove', (e) => {
    const { x, y } = getCanvasCoordinates(e);

    if (currentScreen === 'playing' && uiControls && uiControls.isDragging) {
        uiControls.handleMouseMove(x);
    } else if (currentScreen === 'start' && startScreen && startScreen.isVolumeDragging) {
        startScreen.updateVolumeFromX(x);
        setVolume(startScreen.volume);
    }

    let isPointer = false;

    if (currentScreen === 'start' && startScreen) {
        isPointer = startScreen.isInteractiveElementHovered(x, y);
    } else if (currentScreen === 'playing' && uiControls) {
        isPointer = uiControls.isButtonHovered(x, y);
    } else if (currentScreen === 'paused') {
        isPointer = Boolean(getPauseMenuAction(x, y));
    } else if ((currentScreen === 'gameover' || currentScreen === 'win') && endScreen) {
        isPointer = endScreen.isButtonClicked(x, y);
    }

    canvas.style.cursor = isPointer ? 'pointer' : 'default';
}, { passive: true });

canvas.addEventListener('mousedown', (e) => {
    if (currentScreen === 'start' && startScreen && startScreen.activeOverlay === 'settings') {
        const { x } = getCanvasCoordinates(e);
        startScreen.startVolumeDrag(x);
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
    if (keyCode === 27 || keyCode === 80) {
        if (currentScreen === 'playing') {
            pauseGame();
        } else if (currentScreen === 'paused') {
            resumeGame();
        }
        return;
    }

    if (currentScreen === 'paused') {
        return;
    }

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

window.addEventListener('blur', resetKeyboard);

restoreSavedVolume();
startScreen = new StartScreen();
startScreen.setVolume(savedVolume);
initTouchControls();
draw();
