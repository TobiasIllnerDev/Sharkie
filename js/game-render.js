const pauseMenuButtons = [
    { action: 'resume', text: 'WEITER', x: 240, y: 185, width: 240, height: 48 },
    { action: 'restart', text: 'NEUSTART', x: 240, y: 250, width: 240, height: 48 },
    { action: 'menu', text: 'MENU', x: 240, y: 315, width: 240, height: 48 }
];

/**
 * Checks if a position is inside a pause menu button.
 * @param {number} x - Horizontal canvas or world position.
 * @param {number} y - Vertical canvas or world position.
 * @param {Object} button - Button data or element.
 * @returns {boolean} True when the condition is met.
 */
function isPauseMenuButtonHovered(x, y, button) {
    return x >= button.x && x <= button.x + button.width &&
        y >= button.y && y <= button.y + button.height;
}

/**
 * Returns the action for a hovered pause menu button.
 * @param {number} x - Horizontal canvas or world position.
 * @param {number} y - Vertical canvas or world position.
 * @returns {string|null} Matching action name, or null when nothing is hit.
 */
function getPauseMenuAction(x, y) {
    const button = pauseMenuButtons.find(menuButton => isPauseMenuButtonHovered(x, y, menuButton));
    return button ? button.action : null;
}

/**
 * Draws the current frame.
 */
function draw() {
    updateTouchControlsVisibility();
    drawCurrentScreen();
    requestAnimationFrame(draw);
}

/**
 * Draws the screen matching the current game state.
 */
function drawCurrentScreen() {
    if (currentScreen === 'loading') return drawLoadingScreen();
    if (currentScreen === 'start') return startScreen.draw(ctx);
    if (currentScreen === 'playing' && world) return drawPlayingScreen();
    if (currentScreen === 'gameover') return drawEndScreen('gameover');
    if (currentScreen === 'win') return drawEndScreen('win');
    if (currentScreen === 'paused') drawPausedScreen();
}

/**
 * Draws the loading screen.
 */
function drawLoadingScreen() {
    const progress = totalAssets === 0 ? 0 : loadedAssets / totalAssets;
    const bar = getLoadingBar();
    drawLoadingBackground();
    drawLoadingTitle();
    drawLoadingBar(bar, progress);
    drawLoadingProgress(progress);
}

/**
 * Returns the loading bar layout.
 * @returns {Object} Calculated layout or data object.
 */
function getLoadingBar() {
    return { width: 360, height: 24, x: (canvas.width - 360) / 2, y: 270 };
}

/**
 * Draws the loading screen background.
 */
function drawLoadingBackground() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#0a2e38';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

/**
 * Draws the loading screen title.
 */
function drawLoadingTitle() {
    ctx.font = '52px Luckiest Guy';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Sharkie', 360, 165);
    ctx.font = '28px Luckiest Guy';
    ctx.fillText('Laedt...', 360, 230);
}

/**
 * Draws the loading progress bar.
 * @param {{x: number, y: number, width: number, height: number}} bar - Loading bar layout.
 * @param {number} progress - Loading progress from 0 to 1.
 */
function drawLoadingBar(bar, progress) {
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 3;
    ctx.strokeRect(bar.x, bar.y, bar.width, bar.height);
    ctx.fillStyle = '#1a8fb4';
    ctx.fillRect(bar.x, bar.y, bar.width * progress, bar.height);
}

/**
 * Draws the loading percentage text.
 * @param {number} progress - Loading progress from 0 to 1.
 */
function drawLoadingProgress(progress) {
    ctx.font = '18px Luckiest Guy';
    ctx.fillStyle = 'white';
    ctx.fillText(`${Math.round(progress * 100)}%`, 360, 320);
}

/**
 * Draws the playing screen and checks round end.
 */
function drawPlayingScreen() {
    world.draw();
    if (uiControls) uiControls.draw(ctx);
    checkRoundFinished();
}

/**
 * Switches to the correct end screen if the round ended.
 */
function checkRoundFinished() {
    if (world.gameOver) finishRound('gameover');
    else if (world.win) finishRound('win');
}

/**
 * Draws the win or gameover screen.
 * @param {string} type - End screen type.
 */
function drawEndScreen(type) {
    world.draw();
    endScreen.draw(ctx, type);
}

/**
 * Draws the paused game with overlay.
 */
function drawPausedScreen() {
    world.draw();
    if (uiControls) uiControls.draw(ctx);
    drawPauseOverlay(ctx);
}

/**
 * Draws the pause overlay.
 * @param {CanvasRenderingContext2D} ctx - Canvas rendering context.
 */
function drawPauseOverlay(ctx) {
    ctx.save();
    drawPauseBackdrop(ctx);
    drawPausePanel(ctx);
    drawPauseTitle(ctx);
    pauseMenuButtons.forEach(drawPauseButtonFromList);
    ctx.restore();
}

/**
 * Draws one pause button from the menu list.
 * @param {Object} button - Button data or element.
 */
function drawPauseButtonFromList(button) {
    drawPauseButton(ctx, button);
}

/**
 * Draws the pause backdrop.
 * @param {CanvasRenderingContext2D} ctx - Canvas rendering context.
 */
function drawPauseBackdrop(ctx) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.68)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

/**
 * Draws the pause panel.
 * @param {CanvasRenderingContext2D} ctx - Canvas rendering context.
 */
function drawPausePanel(ctx) {
    roundRect(ctx, 170, 78, 380, 320, 24);
    ctx.fillStyle = '#0f3f56';
    ctx.fill();
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.stroke();
}

/**
 * Draws the pause title.
 * @param {CanvasRenderingContext2D} ctx - Canvas rendering context.
 */
function drawPauseTitle(ctx) {
    ctx.fillStyle = '#1a8fb4';
    ctx.font = '48px Luckiest Guy';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('PAUSE', 360, 135);
}

/**
 * Draws one pause menu button.
 * @param {CanvasRenderingContext2D} ctx - Canvas rendering context.
 * @param {Object} button - Button data or element.
 */
function drawPauseButton(ctx, button) {
    roundRect(ctx, button.x, button.y, button.width, button.height, 14);
    ctx.fillStyle = hoveredPauseAction === button.action ? '#25a9d3' : '#1a8fb4';
    ctx.fill();
    drawPauseButtonBorder(ctx);
    drawPauseButtonText(ctx, button);
}

/**
 * Draws the pause button border.
 * @param {CanvasRenderingContext2D} ctx - Canvas rendering context.
 */
function drawPauseButtonBorder(ctx) {
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.stroke();
}

/**
 * Draws the pause button label.
 * @param {CanvasRenderingContext2D} ctx - Canvas rendering context.
 * @param {Object} button - Button data or element.
 */
function drawPauseButtonText(ctx, button) {
    ctx.fillStyle = 'white';
    ctx.font = '24px Luckiest Guy';
    ctx.fillText(button.text, button.x + button.width / 2, button.y + button.height / 2);
}

/**
 * Draws a rounded rectangle path.
 * @param {CanvasRenderingContext2D} ctx - Canvas rendering context.
 * @param {number} x - Horizontal canvas or world position.
 * @param {number} y - Vertical canvas or world position.
 * @param {number} width - Width in pixels.
 * @param {number} height - Height in pixels.
 * @param {number} radius - Corner radius in pixels.
 */
function roundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    finishRoundRect(ctx, x, y, width, height, radius);
}

/**
 * Finishes a rounded rectangle path.
 * @param {CanvasRenderingContext2D} ctx - Canvas rendering context.
 * @param {number} x - Horizontal canvas or world position.
 * @param {number} y - Vertical canvas or world position.
 * @param {number} width - Width in pixels.
 * @param {number} height - Height in pixels.
 * @param {number} radius - Corner radius in pixels.
 */
function finishRoundRect(ctx, x, y, width, height, radius) {
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
}
