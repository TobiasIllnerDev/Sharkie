class UIControls {
    x;
    y;
    buttonSize = 40;
    padding = 15;
    edgeOffset = 25;
    soundManager;
    hoveredButton = null;

    /** Creates this object. */
    constructor(soundManager) {
        this.soundManager = soundManager;
        this.x = canvas.width - this.edgeOffset - (this.buttonSize * 3 + this.padding * 2);
        this.y = this.edgeOffset;
    }

    /** draw. */
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

    /** draw button. */
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

    /** draw sound button. */
    drawSoundButton(ctx, x, y) {
        this.drawButtonBase(ctx, x, y, this.hoveredButton === 'mute');
        this.drawSpeakerIcon(ctx, x, y);
        this.soundManager.muted ? this.drawMutedLine(ctx, x, y) : this.drawSoundWave(ctx, x, y);
    }

    /** draw speaker icon. */
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

    /** draw muted line. */
    drawMutedLine(ctx, x, y) {
        ctx.beginPath();
        ctx.moveTo(x + 31, y + 13);
        ctx.lineTo(x + 13, y + 31);
        ctx.stroke();
    }

    /** draw sound wave. */
    drawSoundWave(ctx, x, y) {
        ctx.beginPath();
        ctx.arc(x + 27, y + 23, 7, -0.7, 0.7);
        ctx.stroke();
    }

    /** draw fullscreen button. */
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

    /** draw pause button. */
    drawPauseButton(ctx, x, y) {
        this.drawButtonBase(ctx, x, y, this.hoveredButton === 'pause');
        ctx.fillStyle = '#fff';
        ctx.fillRect(x + 13, y + 11, 5, 18);
        ctx.fillRect(x + 23, y + 11, 5, 18);
    }

    /** draw button base. */
    drawButtonBase(ctx, x, y, isHovered = false) {
        ctx.fillStyle = isHovered ? 'rgba(255, 255, 255, 0.42)' : 'rgba(200, 200, 200, 0.3)';
        ctx.fillRect(x, y, this.buttonSize, this.buttonSize);
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = isHovered ? 2 : 1;
        ctx.strokeRect(x, y, this.buttonSize, this.buttonSize);
    }

    /** is inside button. */
    isInsideButton(x, y, buttonX, buttonY) {
        return x >= buttonX && x <= buttonX + this.buttonSize &&
               y >= buttonY && y <= buttonY + this.buttonSize;
    }

    /** is button hovered. */
    isButtonHovered(x, y) {
        return Boolean(this.getButtonAt(x, y));
    }

    /** get button at. */
    getButtonAt(x, y) {
        const button = this.getButtons().find(button => this.isInsideButton(x, y, button.x, button.y));
        return button ? button.action : null;
    }

    /** get buttons. */
    getButtons() {
        const fullscreenX = this.x + this.buttonSize + this.padding;
        const pauseX = fullscreenX + this.buttonSize + this.padding;
        return [
            { action: 'mute', x: this.x, y: this.y },
            { action: 'fullscreen', x: fullscreenX, y: this.y },
            { action: 'pause', x: pauseX, y: this.y }
        ];
    }

    /** handle click. */
    handleClick(x, y) {
        const action = this.getButtonAt(x, y);
        if (action === 'mute') this.soundManager.setMuted(!this.soundManager.muted);
        return action;
    }
}
