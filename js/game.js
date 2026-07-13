let canvas;
let gameContainer;
let world;
let keyboard = new Keyboard();
let ctx;
let currentScreen = 'loading';
let startScreen;
let endScreen;
let soundManager;
let uiControls;
let savedVolume = 0.5;
let level1 = null;
let isMuted = false;
let loadedAssets = 0;
let totalAssets = 0;
let loadingFinished = false;
let hoveredPauseAction = null;
window.DEBUG = false;
window.sharkieImageCache = window.sharkieImageCache || {};

function range(length, callback) {
    return Array.from({ length }, (_, i) => callback(i + 1));
}

const INITIAL_IMAGE_ASSETS = [
    './assets/img/Background/underwater.png',
    './assets/img/Botones/Key/arrow keys.png',
    './assets/img/Botones/Key/WASD-Key.png',
    './assets/img/Botones/Key/Space Bar key.png',
    './assets/img/Botones/Key/E-Key.png',
    './assets/img/Botones/Start/Start-button.png',
    './assets/img/Botones/Start/Einstellung-button.png',
    './assets/img/Botones/Start/Anleitung-button.png',
    '../assets/img/Botones/Tittles/Game Over/Recurso 9.png',
    '../assets/img/Botones/Tittles/You win/Mesa de trabajo 1.png',
    '../assets/img/Botones/Try again/Recurso 15.png',
    '../assets/img/Sharkie/1.IDLE/1.png',
    '../assets/img/Sharkie/4.Attack/Bubbletrap/Bubble.png',
    '../assets/img/Sharkie/4.Attack/Bubbletrap/Poisoned Bubble (for whale).png',
    '../assets/img/Background/Layers/1. Light/1.png',
    '../assets/img/Background/Layers/5. Water/D1.png',
    '../assets/img/Background/Layers/5. Water/D2.png',
    '../assets/img/Background/Layers/3.Fondo 1/L1.png',
    '../assets/img/Background/Layers/3.Fondo 1/L2.png',
    '../assets/img/Background/Layers/4.Fondo 2/L1.png',
    '../assets/img/Background/Layers/4.Fondo 2/L2.png',
    '../assets/img/Background/Layers/2. Floor/D1.png',
    '../assets/img/Background/Layers/2. Floor/D2.png',
    ...range(18, i => `../assets/img/Sharkie/1.IDLE/${i}.png`),
    ...range(6, i => `../assets/img/Sharkie/3.Swim/${i}.png`),
    ...range(12, i => `../assets/img/Sharkie/6.dead/1.Poisoned/${i}.png`),
    ...range(5, i => `../assets/img/Sharkie/5.Hurt/1.Poisoned/${i}.png`),
    ...range(14, i => `../assets/img/Sharkie/2.Long_IDLE/i${i}.png`),
    ...range(8, i => `../assets/img/Sharkie/4.Attack/Bubbletrap/op1 (with bubble formation)/${i}.png`),
    ...range(4, i => `../assets/img/Enemy/JellyFish/Regular/Yellow ${i}.png`),
    ...range(4, i => `../assets/img/Enemy/JellyFish/Dead/Yellow/y${i}.png`),
    ...range(4, i => `../assets/img/Enemy/JellyFish/Regular/Purpel${i}.png`),
    ...range(4, i => `../assets/img/Enemy/JellyFish/Dead/Lila/L${i}.png`),
    ...range(4, i => `../assets/img/Enemy/JellyFish/Súper dangerous/Pink ${i}.png`),
    ...range(4, i => `../assets/img/Enemy/JellyFish/Dead/Pink/P${i}.png`),
    ...range(4, i => `../assets/img/Enemy/JellyFish/Súper dangerous/Green ${i}.png`),
    ...range(4, i => `../assets/img/Enemy/JellyFish/Dead/green/g${i}.png`),
    ...range(13, i => `../assets/img/Enemy/FinalBoss/2.floating/${i}.png`),
    ...range(10, i => `../assets/img/Enemy/FinalBoss/1.Introduce/${i}.png`),
    ...range(6, i => `../assets/img/Enemy/FinalBoss/Attack/${i}.png`),
    ...range(4, i => `../assets/img/Enemy/FinalBoss/Hurt/${i}.png`),
    ...range(5, i => `../assets/img/Enemy/FinalBoss/Dead/Dead_${i}.png`),
    ...range(6, i => `../assets/img/Marcadores/green/Life/${i}_Lifebar.png`),
    ...range(6, i => `../assets/img/Marcadores/green/Coin/${i}_Coin.png`),
    ...range(6, i => `../assets/img/Marcadores/green/Posion/${i}_Posion.png`),
    ...range(4, i => `../assets/img/Marcadores/1. Coins/${i}.png`)
];

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

function preloadImage(path) {
    return new Promise(resolve => {
        if (window.sharkieImageCache[path]) {
            return resolveLoadedAsset(resolve);
        }

        const img = new Image();
        img.onload = () => cacheLoadedImage(path, img, resolve);
        img.onerror = () => resolveLoadedAsset(resolve);
        img.src = path;
    });
}

function cacheLoadedImage(path, img, resolve) {
    window.sharkieImageCache[path] = img;
    resolveLoadedAsset(resolve);
}

function resolveLoadedAsset(resolve) {
    loadedAssets++;
    resolve();
}

function loadInitialAssets() {
    const uniqueAssets = [...new Set(INITIAL_IMAGE_ASSETS)];
    totalAssets = uniqueAssets.length;
    loadedAssets = 0;

    Promise.all(uniqueAssets.map(path => preloadImage(path))).then(() => {
        finishLoading();
    });
}

function finishLoading() {
    loadingFinished = true;
    endScreen = new EndScreen();
    startScreen = new StartScreen();
    startScreen.setVolume(savedVolume);
    currentScreen = 'start';
}

function drawLoadingScreen() {
    const progress = totalAssets === 0 ? 0 : loadedAssets / totalAssets;
    const bar = getLoadingBar();
    drawLoadingBackground();
    drawLoadingTitle();
    drawLoadingBar(bar, progress);
    drawLoadingProgress(progress);
}

function getLoadingBar() {
    return { width: 360, height: 24, x: (canvas.width - 360) / 2, y: 270 };
}

function drawLoadingBackground() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#0a2e38';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawLoadingTitle() {
    ctx.font = '52px Luckiest Guy';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Sharkie', 360, 165);
    ctx.font = '28px Luckiest Guy';
    ctx.fillText('Laedt...', 360, 230);
}

function drawLoadingBar(bar, progress) {
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 3;
    ctx.strokeRect(bar.x, bar.y, bar.width, bar.height);
    ctx.fillStyle = '#1a8fb4';
    ctx.fillRect(bar.x, bar.y, bar.width * progress, bar.height);
}

function drawLoadingProgress(progress) {
    ctx.font = '18px Luckiest Guy';
    ctx.fillStyle = 'white';
    ctx.fillText(`${Math.round(progress * 100)}%`, 360, 320);
}

function init() {
    ctx = canvas.getContext('2d');
    soundManager = new SoundManager();
    loadGameSounds();
    applySavedSoundSettings();
    createGameWorld();
    prepareStartScreenAfterInit();
    soundManager.playBackground();
}

function loadGameSounds() {
    soundManager.loadSound('background', '../assets/sounds/background-musik.mp3', true);
    soundManager.loadSound('coin', '../assets/sounds/Coin-Colleted.mp3');
    soundManager.loadSound('bottle', '../assets/sounds/bottle-pick-up.mp3');
    soundManager.loadSound('enemy_die', '../assets/sounds/enemy-die.mp3');
    soundManager.loadSound('attack', '../assets/sounds/Attack-sound.mp3');
    soundManager.loadSound('character_swim', '../assets/sounds/Character-swim.mp3');
    loadExtraGameSounds();
}

function loadExtraGameSounds() {
    soundManager.loadSound('damage', '../assets/sounds/characterDamage.mp3');
    soundManager.loadSound('dead', '../assets/sounds/characterDead.wav');
    soundManager.loadSound('snoring', '../assets/sounds/characterSnoring.mp3', false, true);
    soundManager.loadSound('fail', '../assets/sounds/Fail-sound.mp3');
    soundManager.loadSound('win', '../assets/sounds/Win-Sound.mp3');
}

function applySavedSoundSettings() {
    const savedVol = localStorage.getItem('sharkieSavedVolume');
    if (savedVol !== null) savedVolume = parseFloat(savedVol);
    soundManager.setVolume(savedVolume);
    soundManager.setMuted(isMuted);
}

function createGameWorld() {
    resetKeyboard();
    world = new World(canvas, keyboard, soundManager);
    uiControls = new UIControls(soundManager);
}

function prepareStartScreenAfterInit() {
    if (!startScreen) return;
    startScreen.closeOverlay();
    startScreen.setVolume(savedVolume);
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

function roundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
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
    { action: 'resume', text: 'WEITER', x: 240, y: 185, width: 240, height: 48 },
    { action: 'restart', text: 'NEUSTART', x: 240, y: 250, width: 240, height: 48 },
    { action: 'menu', text: 'MENU', x: 240, y: 315, width: 240, height: 48 }
];

function setBackgroundVolumeFactor(factor) {
    if (soundManager && soundManager.backgroundSound) {
        soundManager.backgroundSound.audio.volume = soundManager.volume * factor;
    }
}

function pauseGame() {
    if (currentScreen === 'playing' && world) {
        world.pause();
        setBackgroundVolumeFactor(0.7);
        currentScreen = 'paused';
    }
}

function resumeGame() {
    if (currentScreen === 'paused' && world) {
        world.resume();
        setBackgroundVolumeFactor(1);
        currentScreen = 'playing';
        hoveredPauseAction = null;
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
        setBackgroundVolumeFactor(1);
        restartGame();
    } else if (action === 'menu') {
        setBackgroundVolumeFactor(1);
        resetGame();
    }
}

function drawPauseOverlay(ctx) {
    ctx.save();
    drawPauseBackdrop(ctx);
    drawPausePanel(ctx);
    drawPauseTitle(ctx);
    pauseMenuButtons.forEach(button => drawPauseButton(ctx, button));
    ctx.restore();
}

function drawPauseBackdrop(ctx) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.68)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawPausePanel(ctx) {
    roundRect(ctx, 170, 78, 380, 320, 24);
    ctx.fillStyle = '#0f3f56';
    ctx.fill();
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.stroke();
}

function drawPauseTitle(ctx) {
    ctx.fillStyle = '#1a8fb4';
    ctx.font = '48px Luckiest Guy';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('PAUSE', 360, 135);
}

function drawPauseButton(ctx, button) {
    roundRect(ctx, button.x, button.y, button.width, button.height, 14);
    ctx.fillStyle = hoveredPauseAction === button.action ? '#25a9d3' : '#1a8fb4';
    ctx.fill();
    drawPauseButtonBorder(ctx);
    drawPauseButtonText(ctx, button);
}

function drawPauseButtonBorder(ctx) {
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.stroke();
}

function drawPauseButtonText(ctx, button) {
    ctx.fillStyle = 'white';
    ctx.font = '24px Luckiest Guy';
    ctx.fillText(button.text, button.x + button.width / 2, button.y + button.height / 2);
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
    touchButtons.forEach(button => initTouchButton(button));
}

function initTouchButton(button) {
    const key = button.dataset.key;
    button.addEventListener('pointerdown', event => pressTouchButton(event, button, key));
    button.addEventListener('pointerup', event => releaseTouchButton(event, button, key));
    button.addEventListener('pointercancel', () => releaseTouchKey(button, key));
    button.addEventListener('lostpointercapture', () => releaseTouchKey(button, key));
    button.addEventListener('contextmenu', event => event.preventDefault());
}

function pressTouchButton(event, button, key) {
    event.preventDefault();
    button.setPointerCapture(event.pointerId);
    keyboard[key] = true;
    button.classList.add('is-pressed');
}

function releaseTouchButton(event, button, key) {
    event.preventDefault();
    releaseTouchKey(button, key);
}

function releaseTouchKey(button, key) {
    keyboard[key] = false;
    button.classList.remove('is-pressed');
}

function updateTouchControlsVisibility() {
    gameContainer.classList.toggle('show-touch-controls', currentScreen === 'playing');
}

function finishRound(screen) {
    resetKeyboard();
    document.querySelectorAll('#touch-controls .is-pressed').forEach(button => {
        button.classList.remove('is-pressed');
    });
    if (screen === 'win' && world && world.character) {
        world.character.stopSnoring();
    }
    currentScreen = screen;
}

function resetGame() {
    setBackgroundVolumeFactor(1);
    hoveredPauseAction = null;
    cleanupSoundManager();
    cleanupWorld();
    resetGameStateToStart();
}

function cleanupSoundManager() {
    if (soundManager) {
        savedVolume = soundManager.volume;
        localStorage.setItem('sharkieSavedVolume', savedVolume);
        soundManager.stopAllSounds();
        soundManager = null;
    }
}

function cleanupWorld() {
    if (world) {
        world.cleanup();
        world = null;
    }
}

function resetGameStateToStart() {
    level1 = null;
    uiControls = null;
    resetKeyboard();
    currentScreen = 'start';
    resetStartScreen();
}

function resetStartScreen() {
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
    drawCurrentScreen();
    requestAnimationFrame(draw);
}

function drawCurrentScreen() {
    if (currentScreen === 'loading') return drawLoadingScreen();
    if (currentScreen === 'start') return startScreen.draw(ctx);
    if (currentScreen === 'playing' && world) return drawPlayingScreen();
    if (currentScreen === 'gameover') return drawEndScreen('gameover');
    if (currentScreen === 'win') return drawEndScreen('win');
    if (currentScreen === 'paused') drawPausedScreen();
}

function drawPlayingScreen() {
    world.draw();
    if (uiControls) uiControls.draw(ctx);
    checkRoundFinished();
}

function checkRoundFinished() {
    if (world.gameOver) finishRound('gameover');
    else if (world.win) finishRound('win');
}

function drawEndScreen(type) {
    world.draw();
    endScreen.draw(ctx, type);
}

function drawPausedScreen() {
    world.draw();
    if (uiControls) uiControls.draw(ctx);
    drawPauseOverlay(ctx);
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

    if (currentScreen === 'start' && startScreen && startScreen.isVolumeDragging) {
        startScreen.updateVolumeFromX(x);
        setVolume(startScreen.volume);
    }

    let isPointer = false;

    if (currentScreen === 'start' && startScreen) {
        startScreen.hoveredElement = startScreen.getInteractiveElementAt(x, y);
        isPointer = Boolean(startScreen.hoveredElement);
    } else if (currentScreen === 'playing' && uiControls) {
        uiControls.hoveredButton = uiControls.getButtonAt(x, y);
        isPointer = Boolean(uiControls.hoveredButton);
    } else if (currentScreen === 'paused') {
        hoveredPauseAction = getPauseMenuAction(x, y);
        isPointer = Boolean(hoveredPauseAction);
    } else if ((currentScreen === 'gameover' || currentScreen === 'win') && endScreen) {
        isPointer = endScreen.isButtonClicked(x, y);
    }

    canvas.style.cursor = isPointer ? 'pointer' : 'default';
}, { passive: true });

canvas.addEventListener('mousedown', (e) => {
    if (currentScreen === 'start' && startScreen && startScreen.activeOverlay === 'settings') {
        const { x, y } = getCanvasCoordinates(e);
        startScreen.startVolumeDrag(x, y);
    }
});

document.addEventListener('mouseup', () => {
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

    if (currentScreen !== 'playing') {
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
initTouchControls();
loadInitialAssets();
draw();
