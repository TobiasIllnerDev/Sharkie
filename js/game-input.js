/** Converts a pointer event to canvas coordinates. */
function getCanvasCoordinates(event) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: (event.clientX - rect.left) * (canvas.width / rect.width),
        y: (event.clientY - rect.top) * (canvas.height / rect.height)
    };
}

/** Registers all touch control buttons. */
function initTouchControls() {
    const touchButtons = document.querySelectorAll('#touch-controls [data-key]');
    touchButtons.forEach(initTouchButton);
}

/** Registers pointer events for one touch button. */
function initTouchButton(button) {
    const key = button.dataset.key;
    button.addEventListener('pointerdown', event => pressTouchButton(event, button, key));
    button.addEventListener('pointerup', event => releaseTouchButton(event, button, key));
    button.addEventListener('pointercancel', () => releaseTouchKey(button, key));
    button.addEventListener('lostpointercapture', () => releaseTouchKey(button, key));
    button.addEventListener('contextmenu', preventDefaultEvent);
}

/** Prevents the browser default action. */
function preventDefaultEvent(event) {
    event.preventDefault();
}

/** Marks one touch key as pressed. */
function pressTouchButton(event, button, key) {
    event.preventDefault();
    button.setPointerCapture(event.pointerId);
    keyboard[key] = true;
    button.classList.add('is-pressed');
}

/** Marks one touch key as released. */
function releaseTouchButton(event, button, key) {
    event.preventDefault();
    releaseTouchKey(button, key);
}

/** Clears one touch key and its visual state. */
function releaseTouchKey(button, key) {
    keyboard[key] = false;
    button.classList.remove('is-pressed');
}

/** Shows touch controls only while playing. */
function updateTouchControlsVisibility() {
    gameContainer.classList.toggle('show-touch-controls', currentScreen === 'playing');
}

/** Handles a click on the canvas. */
function handleCanvasClick(event) {
    const { x, y } = getCanvasCoordinates(event);
    handleScreenClick(x, y);
}

/** Routes a click to the current screen. */
function handleScreenClick(x, y) {
    if (currentScreen === 'paused') return handlePauseMenuClick(x, y);
    if (currentScreen === 'start') return handleStartScreenClick(x, y);
    if (currentScreen === 'playing' && uiControls) return handleUiControlClick(x, y);
    if (isEndScreenButtonClicked(x, y)) restartGame();
}

/** Handles a start screen click. */
function handleStartScreenClick(x, y) {
    startScreen.checkClick(x, y, startGame, showSettings, showImprint, toggleFullscreen, closeOverlay, setVolume);
}

/** Handles an ingame UI control click. */
function handleUiControlClick(x, y) {
    const result = uiControls.handleClick(x, y);
    if (result === 'mute') toggleMute();
    else if (result === 'fullscreen') toggleFullscreen();
    else if (result === 'pause') pauseGame();
}

/** Checks whether an end screen button was clicked. */
function isEndScreenButtonClicked(x, y) {
    const isEndScreen = currentScreen === 'gameover' || currentScreen === 'win';
    return isEndScreen && endScreen.isButtonClicked(x, y);
}

/** Handles mouse movement over the document. */
function handleDocumentMouseMove(event) {
    const { x, y } = getCanvasCoordinates(event);
    updateDraggedVolume(x);
    updateCanvasHoverState(x, y);
}

/** Updates settings volume while dragging the slider. */
function updateDraggedVolume(x) {
    if (!startScreen || !startScreen.isVolumeDragging) return;
    startScreen.updateVolumeFromX(x);
    setVolume(startScreen.volume);
}

/** Updates hover state and cursor for the canvas. */
function updateCanvasHoverState(x, y) {
    const isPointer = getPointerState(x, y);
    canvas.style.cursor = isPointer ? 'pointer' : 'default';
}

/** Returns whether the cursor should be a pointer. */
function getPointerState(x, y) {
    if (currentScreen === 'start' && startScreen) return updateStartHover(x, y);
    if (currentScreen === 'playing' && uiControls) return updateUiHover(x, y);
    if (currentScreen === 'paused') return updatePauseHover(x, y);
    if (currentScreen === 'gameover' || currentScreen === 'win') return endScreen.isButtonClicked(x, y);
    return false;
}

/** Updates start screen hover state. */
function updateStartHover(x, y) {
    startScreen.hoveredElement = startScreen.getInteractiveElementAt(x, y);
    return Boolean(startScreen.hoveredElement);
}

/** Updates ingame UI hover state. */
function updateUiHover(x, y) {
    uiControls.hoveredButton = uiControls.getButtonAt(x, y);
    return Boolean(uiControls.hoveredButton);
}

/** Updates pause menu hover state. */
function updatePauseHover(x, y) {
    hoveredPauseAction = getPauseMenuAction(x, y);
    return Boolean(hoveredPauseAction);
}

/** Starts settings volume dragging when the slider is pressed. */
function handleCanvasMouseDown(event) {
    if (!isSettingsScreenOpen()) return;
    const { x, y } = getCanvasCoordinates(event);
    startScreen.startVolumeDrag(x, y);
}

/** Returns whether the settings overlay is open. */
function isSettingsScreenOpen() {
    return currentScreen === 'start' && startScreen && startScreen.activeOverlay === 'settings';
}

/** Stops active volume dragging. */
function handleDocumentMouseUp() {
    if (startScreen) startScreen.stopVolumeDrag();
}

/** Handles keydown input. */
function handleKeyDown(event) {
    const keyCode = event.keyCode || event.which;
    if (handlePauseKey(keyCode)) return;
    if (currentScreen !== 'playing') return;
    setKeyboardKey(keyCode, true);
}

/** Handles pause and resume keys. */
function handlePauseKey(keyCode) {
    if (keyCode !== 27 && keyCode !== 80) return false;
    if (currentScreen === 'playing') pauseGame();
    else if (currentScreen === 'paused') resumeGame();
    return true;
}

/** Handles keyup input. */
function handleKeyUp(event) {
    const keyCode = event.keyCode || event.which;
    setKeyboardKey(keyCode, false);
}

/** Sets the matching keyboard flag for a key code. */
function setKeyboardKey(keyCode, value) {
    if (keyCode === 39 || keyCode === 68) keyboard.RIGHT = value;
    if (keyCode === 37 || keyCode === 65) keyboard.LEFT = value;
    if (keyCode === 40 || keyCode === 83) keyboard.DOWN = value;
    if (keyCode === 38 || keyCode === 87) keyboard.UP = value;
    if (keyCode === 32) keyboard.SPACE = value;
    if (keyCode === 69) keyboard.E = value;
}

/** Registers all browser input listeners. */
function registerInputListeners() {
    canvas.addEventListener('click', handleCanvasClick);
    document.addEventListener('mousemove', handleDocumentMouseMove, { passive: true });
    canvas.addEventListener('mousedown', handleCanvasMouseDown);
    document.addEventListener('mouseup', handleDocumentMouseUp);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', resetKeyboard);
}
