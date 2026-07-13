class UIControls {
    x;
    y;
    buttonSize = 40;
    padding = 15;
    edgeOffset = 25;
    soundManager;

    constructor(soundManager) {
        this.soundManager = soundManager;
        this.x = canvas.width - this.edgeOffset - (this.buttonSize * 3 + this.padding * 2);
        this.y = this.edgeOffset;
    }

    draw(ctx) {
        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.fillRect(this.x - 10, this.y - 10, this.buttonSize * 3 + this.padding * 2 + 20, this.buttonSize + 20);

        this.drawButton(ctx, this.x, this.y, this.buttonSize, this.buttonSize, this.soundManager.muted ? '🔊' : '🔇');

        const backX = this.x + this.buttonSize + this.padding;
        this.drawButton(ctx, backX, this.y, this.buttonSize, this.buttonSize, '↩');

        const fullscreenX = backX + this.buttonSize + this.padding;
        this.drawButton(ctx, fullscreenX, this.y, this.buttonSize, this.buttonSize, '⛶');
        ctx.restore();
    }

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

    isInsideButton(x, y, buttonX, buttonY) {
        return x >= buttonX && x <= buttonX + this.buttonSize &&
               y >= buttonY && y <= buttonY + this.buttonSize;
    }

    isButtonHovered(x, y) {
        const backX = this.x + this.buttonSize + this.padding;
        const fullscreenX = backX + this.buttonSize + this.padding;

        return this.isInsideButton(x, y, this.x, this.y) ||
               this.isInsideButton(x, y, backX, this.y) ||
               this.isInsideButton(x, y, fullscreenX, this.y);
    }

    handleClick(x, y) {
        const backX = this.x + this.buttonSize + this.padding;
        const fullscreenX = backX + this.buttonSize + this.padding;

        if (this.isInsideButton(x, y, this.x, this.y)) {
            this.soundManager.setMuted(!this.soundManager.muted);
            return 'mute';
        }

        if (this.isInsideButton(x, y, backX, this.y)) {
            return 'back';
        }

        if (this.isInsideButton(x, y, fullscreenX, this.y)) {
            return 'fullscreen';
        }

        return null;
    }
}
