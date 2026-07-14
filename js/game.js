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

/**
 * Initializes canvas references and starts the game loop.
 */
function bootstrapGame() {
    canvas = document.getElementById('canvas');
    gameContainer = document.getElementById('game-container');
    ctx = canvas.getContext('2d');
    restoreSavedVolume();
    restoreSavedMuteState();
    initTouchControls();
    registerInputListeners();
    loadInitialAssets();
    draw();
}

bootstrapGame();
