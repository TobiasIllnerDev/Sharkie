/** Initializes one new game world. */
function init() {
    ctx = canvas.getContext('2d');
    soundManager = new SoundManager();
    loadGameSounds();
    applySavedSoundSettings();
    createGameWorld();
    prepareStartScreenAfterInit();
    soundManager.playBackground();
}

/** Creates the world and ingame UI controls. */
function createGameWorld() {
    resetKeyboard();
    world = new World(canvas, keyboard, soundManager);
    uiControls = new UIControls(soundManager);
}

/** Resets start screen state after game initialization. */
function prepareStartScreenAfterInit() {
    if (!startScreen) return;
    startScreen.closeOverlay();
    startScreen.setVolume(savedVolume);
}

/** Starts a fresh play session. */
function startGame() {
    level1 = null;
    currentScreen = 'playing';
    init();
}

/** Resets all keyboard flags. */
function resetKeyboard() {
    keyboard.LEFT = false;
    keyboard.RIGHT = false;
    keyboard.UP = false;
    keyboard.DOWN = false;
    keyboard.SPACE = false;
    keyboard.E = false;
}

/** Opens the settings overlay. */
function showSettings() {
    if (startScreen) startScreen.openSettings();
}

/** Opens the imprint overlay. */
function showImprint() {
    if (startScreen) startScreen.openImprint();
}

/** Closes the active start screen overlay. */
function closeOverlay() {
    if (startScreen) startScreen.closeOverlay();
}

/** Toggles browser fullscreen mode. */
function toggleFullscreen() {
    if (!document.fullscreenElement && gameContainer.requestFullscreen) {
        gameContainer.requestFullscreen().catch(logFullscreenError);
    } else if (document.exitFullscreen) document.exitFullscreen();
}

/** Logs fullscreen errors without stopping the game. */
function logFullscreenError(error) {
    console.error('Fullscreen-Fehler:', error);
}

/** Pauses the running game. */
function pauseGame() {
    if (currentScreen !== 'playing' || !world) return;
    world.pause();
    setBackgroundVolumeFactor(0.7);
    currentScreen = 'paused';
}

/** Resumes the paused game. */
function resumeGame() {
    if (currentScreen !== 'paused' || !world) return;
    world.resume();
    setBackgroundVolumeFactor(1);
    currentScreen = 'playing';
    hoveredPauseAction = null;
}

/** Handles a click on the pause menu. */
function handlePauseMenuClick(x, y) {
    const action = getPauseMenuAction(x, y);
    if (action === 'resume') resumeGame();
    else if (action === 'restart') restartFromPause();
    else if (action === 'menu') returnToMenuFromPause();
}

/** Restarts the game from the pause menu. */
function restartFromPause() {
    setBackgroundVolumeFactor(1);
    restartGame();
}

/** Returns to the start menu from pause. */
function returnToMenuFromPause() {
    setBackgroundVolumeFactor(1);
    resetGame();
}

/** Marks the current round as finished. */
function finishRound(screen) {
    resetKeyboard();
    releasePressedTouchButtons();
    if (screen === 'win' && world && world.character) world.character.stopSnoring();
    currentScreen = screen;
}

/** Removes pressed styling from touch buttons. */
function releasePressedTouchButtons() {
    document.querySelectorAll('#touch-controls .is-pressed').forEach(releasePressedTouchButton);
}

/** Removes pressed styling from one touch button. */
function releasePressedTouchButton(button) {
    button.classList.remove('is-pressed');
}

/** Resets the game back to the start screen. */
function resetGame() {
    setBackgroundVolumeFactor(1);
    hoveredPauseAction = null;
    cleanupSoundManager();
    cleanupWorld();
    resetGameStateToStart();
}

/** Cleans the current world instance. */
function cleanupWorld() {
    if (world) {
        world.cleanup();
        world = null;
    }
}

/** Clears runtime state for a menu reset. */
function resetGameStateToStart() {
    level1 = null;
    uiControls = null;
    resetKeyboard();
    currentScreen = 'start';
    resetStartScreen();
}

/** Creates or resets the start screen. */
function resetStartScreen() {
    if (!startScreen) startScreen = new StartScreen();
    else resetExistingStartScreen();
}

/** Resets an existing start screen. */
function resetExistingStartScreen() {
    startScreen.closeOverlay();
    startScreen.setVolume(savedVolume);
}

/** Restarts the game from scratch. */
function restartGame() {
    resetGame();
    startGame();
}
