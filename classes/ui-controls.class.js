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

    handleClick(x, y) {
        const backX = this.x + this.buttonSize + this.padding;
        const fullscreenX = backX + this.buttonSize + this.padding;

        if (x >= this.x && x <= this.x + this.buttonSize && y >= this.y && y <= this.y + this.buttonSize) {
            this.soundManager.setMuted(!this.soundManager.muted);
            return 'mute';
        }

        if (x >= backX && x <= backX + this.buttonSize && y >= this.y && y <= this.y + this.buttonSize) {
            return 'back';
        }

        if (x >= fullscreenX && x <= fullscreenX + this.buttonSize && y >= this.y && y <= this.y + this.buttonSize) {
            return 'fullscreen';
        }

        return null;
    }
}
