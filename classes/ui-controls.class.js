/**
 * Draws and handles the in-game canvas control buttons.
 */
class UIControls {
    x;
    y;
    buttonSize = 40;
    padding = 15;
    edgeOffset = 25;
    soundManager;
    hoveredButton = null;

    /**
     * Creates a new instance.
     * @param {SoundManager} soundManager - Sound manager used by the game.
     */
    constructor(soundManager) {
        this.soundManager = soundManager;
        this.x = canvas.width - this.edgeOffset - (this.buttonSize * 3 + this.padding * 2);
        this.y = this.edgeOffset;
    }

    /**
     * Draws the object.
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context.
     */
    draw(ctx) {
        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.fillRect(this.x - 10, this.y - 10, this.buttonSize * 3 + this.padding * 2 + 20, this.buttonSize + 20);

        this.drawSoundButton(ctx, this.x, this.y);

        const fullscreenX = this.x + this.buttonSize + this.padding;
        this.drawFullscreenButton(ctx, fullscreenX, this.y);

        const pauseX = fullscreenX + this.buttonSize + this.padding;
        this.drawPauseButton(ctx, pauseX, this.y);
        ctx.restore();
    }

    /**
     * Draw button.
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context.
     * @param {number} x - Horizontal canvas or world position.
     * @param {number} y - Vertical canvas or world position.
     * @param {number} width - Width in pixels.
     * @param {number} height - Height in pixels.
     * @param {string} text - Button text.
     */
    drawButton(ctx, x, y, width, height, text) {
        ctx.fillStyle = 'rgba(200, 200, 200, 0.3)';
        ctx.fillRect(x, y, width, height);
        ctx.strokeStyle = '#fff';
        ctx.strokeRect(x, y, width, height);

        ctx.fillStyle = '#fff';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, x + width / 2, y + height / 2);
    }

    /**
     * Draw sound button.
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context.
     * @param {number} x - Horizontal canvas or world position.
     * @param {number} y - Vertical canvas or world position.
     */
    drawSoundButton(ctx, x, y) {
        this.drawButtonBase(ctx, x, y, this.hoveredButton === 'mute');
        this.drawSpeakerIcon(ctx, x, y);
        this.soundManager.muted ? this.drawMutedLine(ctx, x, y) : this.drawSoundWave(ctx, x, y);
    }

    /**
     * Draw speaker icon.
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context.
     * @param {number} x - Horizontal canvas or world position.
     * @param {number} y - Vertical canvas or world position.
     */
    drawSpeakerIcon(ctx, x, y) {
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x + 11, y + 23);
        ctx.lineTo(x + 18, y + 23);
        ctx.lineTo(x + 27, y + 15);
        ctx.lineTo(x + 27, y + 31);
        ctx.lineTo(x + 18, y + 23);
        ctx.stroke();
    }

    /**
     * Draw muted line.
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context.
     * @param {number} x - Horizontal canvas or world position.
     * @param {number} y - Vertical canvas or world position.
     */
    drawMutedLine(ctx, x, y) {
        ctx.beginPath();
        ctx.moveTo(x + 31, y + 13);
        ctx.lineTo(x + 13, y + 31);
        ctx.stroke();
    }

    /**
     * Draw sound wave.
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context.
     * @param {number} x - Horizontal canvas or world position.
     * @param {number} y - Vertical canvas or world position.
     */
    drawSoundWave(ctx, x, y) {
        ctx.beginPath();
        ctx.arc(x + 27, y + 23, 7, -0.7, 0.7);
        ctx.stroke();
    }

    /**
     * Draw fullscreen button.
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context.
     * @param {number} x - Horizontal canvas or world position.
     * @param {number} y - Vertical canvas or world position.
     */
    drawFullscreenButton(ctx, x, y) {
        this.drawButtonBase(ctx, x, y, this.hoveredButton === 'fullscreen');
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 3;
        ctx.strokeRect(x + 11, y + 11, 18, 18);
        ctx.beginPath();
        ctx.moveTo(x + 24, y + 11);
        ctx.lineTo(x + 31, y + 11);
        ctx.lineTo(x + 31, y + 18);
        ctx.moveTo(x + 16, y + 29);
        ctx.lineTo(x + 9, y + 29);
        ctx.lineTo(x + 9, y + 22);
        ctx.stroke();
    }

    /**
     * Draw pause button.
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context.
     * @param {number} x - Horizontal canvas or world position.
     * @param {number} y - Vertical canvas or world position.
     */
    drawPauseButton(ctx, x, y) {
        this.drawButtonBase(ctx, x, y, this.hoveredButton === 'pause');
        ctx.fillStyle = '#fff';
        ctx.fillRect(x + 13, y + 11, 5, 18);
        ctx.fillRect(x + 23, y + 11, 5, 18);
    }

    /**
     * Draw button base.
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context.
     * @param {number} x - Horizontal canvas or world position.
     * @param {number} y - Vertical canvas or world position.
     * @param {boolean} isHovered - Whether the button is hovered.
     */
    drawButtonBase(ctx, x, y, isHovered = false) {
        ctx.fillStyle = isHovered ? 'rgba(255, 255, 255, 0.42)' : 'rgba(200, 200, 200, 0.3)';
        ctx.fillRect(x, y, this.buttonSize, this.buttonSize);
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = isHovered ? 2 : 1;
        ctx.strokeRect(x, y, this.buttonSize, this.buttonSize);
    }

    /**
     * Is inside button.
     * @param {number} x - Horizontal canvas or world position.
     * @param {number} y - Vertical canvas or world position.
     * @param {number} buttonX - Button horizontal position.
     * @param {number} buttonY - Button vertical position.
     * @returns {boolean} True when the condition is met.
     */
    isInsideButton(x, y, buttonX, buttonY) {
        return x >= buttonX && x <= buttonX + this.buttonSize &&
               y >= buttonY && y <= buttonY + this.buttonSize;
    }

    /**
     * Is button hovered.
     * @param {number} x - Horizontal canvas or world position.
     * @param {number} y - Vertical canvas or world position.
     * @returns {boolean} True when the condition is met.
     */
    isButtonHovered(x, y) {
        return Boolean(this.getButtonAt(x, y));
    }

    /**
     * Get button at.
     * @param {number} x - Horizontal canvas or world position.
     * @param {number} y - Vertical canvas or world position.
     * @returns {Object} Calculated layout or data object.
     */
    getButtonAt(x, y) {
        const button = this.getButtons().find(button => this.isInsideButton(x, y, button.x, button.y));
        return button ? button.action : null;
    }

    /**
     * Get buttons.
     * @returns {Object} Calculated layout or data object.
     */
    getButtons() {
        const fullscreenX = this.x + this.buttonSize + this.padding;
        const pauseX = fullscreenX + this.buttonSize + this.padding;
        return [
            { action: 'mute', x: this.x, y: this.y },
            { action: 'fullscreen', x: fullscreenX, y: this.y },
            { action: 'pause', x: pauseX, y: this.y }
        ];
    }

    /**
     * Handle click.
     * @param {number} x - Horizontal canvas or world position.
     * @param {number} y - Vertical canvas or world position.
     */
    handleClick(x, y) {
        const action = this.getButtonAt(x, y);
        if (action === 'mute') this.soundManager.setMuted(!this.soundManager.muted);
        return action;
    }
}
