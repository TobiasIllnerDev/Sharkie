class UIControls {
    x;
    y;
    buttonSize = 40;
    sliderWidth = 120;
    sliderHeight = 10;
    padding = 5;
    soundManager;
    isDragging = false;

    constructor(soundManager) {
        this.soundManager = soundManager;
        this.x = canvas.width - 220;
        this.y = 10;
    }

    draw(ctx) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.fillRect(this.x - 5, this.y - 5, 210, this.buttonSize + 10);

        this.drawButton(ctx, this.x, this.y, this.buttonSize, this.buttonSize,
                       this.soundManager.muted ? '🔊' : '🔇');

        const sliderX = this.x + this.buttonSize + this.padding;
        this.drawSlider(ctx, sliderX, this.y + 15, this.sliderWidth, this.sliderHeight);

        const backX = this.x + this.buttonSize + this.padding + this.sliderWidth + this.padding;
        this.drawButton(ctx, backX, this.y, this.buttonSize, this.buttonSize, '↩️');
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

    drawSlider(ctx, x, y, width, height) {
        ctx.fillStyle = 'rgba(100, 100, 100, 0.5)';
        ctx.fillRect(x, y - height/2, width, height);

        ctx.fillStyle = '#4CAF50';
        ctx.fillRect(x, y - height/2, width * this.soundManager.volume, height);

        const knobX = x + width * this.soundManager.volume;
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(knobX, y, 8, 0, Math.PI * 2);
        ctx.fill();
    }

    handleClick(x, y) {
        const sliderX = this.x + this.buttonSize + this.padding;
        const backX = this.x + this.buttonSize + this.padding + this.sliderWidth + this.padding;

        if (x >= backX && x <= backX + this.buttonSize &&
            y >= this.y && y <= this.y + this.buttonSize) {
            return 'back';
        }

        if (x >= this.x && x <= this.x + this.buttonSize &&
            y >= this.y && y <= this.y + this.buttonSize) {
            this.soundManager.setMuted(!this.soundManager.muted);
            return 'mute';
        }

        const knobX = sliderX + this.sliderWidth * this.soundManager.volume;
        if (x >= knobX - 8 && x <= knobX + 8 &&
            y >= this.y && y <= this.y + this.buttonSize) {
            this.isDragging = true;
            this.updateSlider(x, sliderX);
            return 'slider';
        }

        if (x >= sliderX && x <= sliderX + this.sliderWidth &&
            y >= this.y - 5 && y <= this.y + this.buttonSize + 5) {
            this.updateSlider(x, sliderX);
            return 'slider';
        }

        return null;
    }

    handleMouseMove(x) {
        if (this.isDragging) {
            const sliderX = this.x + this.buttonSize + this.padding;
            this.updateSlider(x, sliderX);
        }
    }

    handleMouseUp() {
        this.isDragging = false;
    }

    updateSlider(x, sliderX) {
        const newValue = Math.min(1, Math.max(0, (x - sliderX) / this.sliderWidth));
        this.soundManager.setVolume(newValue);
    }
}