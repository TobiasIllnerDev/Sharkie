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

        this.drawSoundButton(ctx, this.x, this.y);

        const fullscreenX = this.x + this.buttonSize + this.padding;
        this.drawFullscreenButton(ctx, fullscreenX, this.y);

        const pauseX = fullscreenX + this.buttonSize + this.padding;
        this.drawPauseButton(ctx, pauseX, this.y);
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

    drawSoundButton(ctx, x, y) {
        this.drawButtonBase(ctx, x, y);
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x + 11, y + 23);
        ctx.lineTo(x + 18, y + 23);
        ctx.lineTo(x + 27, y + 15);
        ctx.lineTo(x + 27, y + 31);
        ctx.lineTo(x + 18, y + 23);
        ctx.stroke();

        if (this.soundManager.muted) {
            ctx.beginPath();
            ctx.moveTo(x + 31, y + 13);
            ctx.lineTo(x + 13, y + 31);
            ctx.stroke();
        } else {
            ctx.beginPath();
            ctx.arc(x + 27, y + 23, 7, -0.7, 0.7);
            ctx.stroke();
        }
    }

    drawFullscreenButton(ctx, x, y) {
        this.drawButtonBase(ctx, x, y);
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

    drawPauseButton(ctx, x, y) {
        this.drawButtonBase(ctx, x, y);
        ctx.fillStyle = '#fff';
        ctx.fillRect(x + 13, y + 11, 5, 18);
        ctx.fillRect(x + 23, y + 11, 5, 18);
    }

    drawButtonBase(ctx, x, y) {
        ctx.fillStyle = 'rgba(200, 200, 200, 0.3)';
        ctx.fillRect(x, y, this.buttonSize, this.buttonSize);
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, this.buttonSize, this.buttonSize);
    }

    isInsideButton(x, y, buttonX, buttonY) {
        return x >= buttonX && x <= buttonX + this.buttonSize &&
               y >= buttonY && y <= buttonY + this.buttonSize;
    }

    isButtonHovered(x, y) {
        const fullscreenX = this.x + this.buttonSize + this.padding;
        const pauseX = fullscreenX + this.buttonSize + this.padding;

        return this.isInsideButton(x, y, this.x, this.y) ||
               this.isInsideButton(x, y, fullscreenX, this.y) ||
               this.isInsideButton(x, y, pauseX, this.y);
    }

    handleClick(x, y) {
        const fullscreenX = this.x + this.buttonSize + this.padding;
        const pauseX = fullscreenX + this.buttonSize + this.padding;

        if (this.isInsideButton(x, y, this.x, this.y)) {
            this.soundManager.setMuted(!this.soundManager.muted);
            return 'mute';
        }

        if (this.isInsideButton(x, y, fullscreenX, this.y)) {
            return 'fullscreen';
        }

        if (this.isInsideButton(x, y, pauseX, this.y)) {
            return 'pause';
        }

        return null;
    }
}
