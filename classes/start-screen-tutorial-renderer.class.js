class StartScreenTutorialRenderer {
    /** Creates a renderer for the tutorial screen. */
    constructor(screen) {
        this.screen = screen;
        this.overlayRenderer = new StartScreenOverlayRenderer(screen);
    }

    /** Draws the tutorial screen. */
    draw(ctx) {
        this.drawTutorialBackground(ctx);
        this.drawTutorialTitle(ctx);
        this.isTouchDevice() ? this.drawMobileTutorial(ctx) : this.drawKeyboardTutorial(ctx);
        this.drawTutorialCloseButton(ctx);
    }

    /** Returns whether touch instructions should be shown. */
    isTouchDevice() {
        return window.matchMedia('(pointer: coarse), (hover: none)').matches;
    }

    /** Draws the tutorial background. */
    drawTutorialBackground(ctx) {
        ctx.fillStyle = 'rgba(0, 0, 30, 0.6)';
        ctx.fillRect(0, 0, 720, 480);
    }

    /** Draws the tutorial title. */
    drawTutorialTitle(ctx) {
        ctx.font = '48px Luckiest Guy';
        ctx.fillStyle = '#1a8fb4';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('STEUERUNG', 360, 80);
    }

    /** Draws desktop keyboard instructions. */
    drawKeyboardTutorial(ctx) {
        ctx.font = '28px Luckiest Guy';
        ctx.fillStyle = 'white';
        ctx.fillText('Bewegung', 360, 130);
        this.drawKeyboardMovementImages(ctx);
        ctx.fillText('Angriff', 360, 270);
        this.drawKeyboardAttackImages(ctx);
        this.drawKeyboardAttackLabels(ctx);
    }

    /** Draws keyboard movement images. */
    drawKeyboardMovementImages(ctx) {
        this.drawScaledImage(ctx, this.screen.arrowKeysImg, 120, 150, 0.35);
        this.drawScaledImage(ctx, this.screen.wasdKeyImg, 400, 100, 0.18);
    }

    /** Draws keyboard attack images. */
    drawKeyboardAttackImages(ctx) {
        this.drawScaledImage(ctx, this.screen.spaceKeyImg, 120, 290, 0.35);
        this.drawScaledImage(ctx, this.screen.eKeyImg, 440, 270, 0.10);
    }

    /** Draws keyboard attack labels. */
    drawKeyboardAttackLabels(ctx) {
        ctx.font = '24px Luckiest Guy';
        ctx.fillText('Normaler Angriff', this.getImageCenterX(this.screen.spaceKeyImg, 120, 0.35), 390);
        ctx.fillText('Spezialangriff', this.getImageCenterX(this.screen.eKeyImg, 440, 0.10), 390);
    }

    /** Draws one scaled image if loaded. */
    drawScaledImage(ctx, image, x, y, scale) {
        if (image.complete) {
            ctx.drawImage(image, x, y, image.naturalWidth * scale, image.naturalHeight * scale);
        }
    }

    /** Returns the centered x coordinate for a scaled image. */
    getImageCenterX(image, x, scale) {
        return x + (image.naturalWidth * scale) / 2;
    }

    /** Draws mobile touch instructions. */
    drawMobileTutorial(ctx) {
        ctx.font = '28px Luckiest Guy';
        ctx.fillStyle = 'white';
        ctx.fillText('Touch Steuerung', 360, 135);
        this.drawTouchPreviewGroup(ctx);
        this.drawMobileTutorialLabels(ctx);
    }

    /** Draws all touch preview buttons. */
    drawTouchPreviewGroup(ctx) {
        this.drawTouchDpadPreview(ctx, 210, 205);
        this.drawTouchActionPreview(ctx, 505, 205, 68, 'A');
        this.drawTouchActionPreview(ctx, 595, 220, 54, 'E');
    }

    /** Draws mobile tutorial labels. */
    drawMobileTutorialLabels(ctx) {
        ctx.font = '22px Luckiest Guy';
        ctx.fillText('Bewegung', 210, 340);
        ctx.fillText('Angriff', 505, 340);
        ctx.fillText('Spezial', 595, 340);
    }

    /** Draws the touch dpad preview. */
    drawTouchDpadPreview(ctx, centerX, centerY) {
        const size = 48;
        this.drawTouchPreviewButton(ctx, centerX, centerY - size, size, '^');
        this.drawTouchPreviewButton(ctx, centerX - size, centerY, size, '<');
        this.drawTouchPreviewButton(ctx, centerX, centerY + size, size, 'v');
        this.drawTouchPreviewButton(ctx, centerX + size, centerY, size, '>');
    }

    /** Draws one touch action preview. */
    drawTouchActionPreview(ctx, centerX, centerY, size, label) {
        this.drawTouchPreviewButton(ctx, centerX, centerY, size, label);
    }

    /** Draws one touch preview button. */
    drawTouchPreviewButton(ctx, centerX, centerY, size, label) {
        this.drawTouchPreviewCircle(ctx, centerX, centerY, size);
        this.drawTouchPreviewText(ctx, centerX, centerY, size, label);
    }

    /** Draws a touch preview circle. */
    drawTouchPreviewCircle(ctx, centerX, centerY, size) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, size / 2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(10, 46, 56, 0.8)';
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'white';
        ctx.stroke();
    }

    /** Draws touch preview text. */
    drawTouchPreviewText(ctx, centerX, centerY, size, label) {
        ctx.fillStyle = 'white';
        ctx.font = `${Math.round(size * 0.42)}px Luckiest Guy`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(label, centerX, centerY + 1);
    }

    /** Draws the tutorial close button. */
    drawTutorialCloseButton(ctx) {
        const button = this.screen.getTutorialCloseButton();
        ctx.fillStyle = this.screen.hoveredElement === 'tutorial-close' ? '#ff6666' : '#ff4444';
        this.overlayRenderer.roundRect(ctx, button.x, button.y, button.width, button.height, 10);
        ctx.fill();
        this.drawTutorialCloseBorder(ctx);
        this.drawTutorialCloseText(ctx);
    }

    /** Draws the tutorial close border. */
    drawTutorialCloseBorder(ctx) {
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'white';
        ctx.stroke();
    }

    /** Draws the tutorial close label. */
    drawTutorialCloseText(ctx) {
        ctx.font = '20px Luckiest Guy';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('SCHLIESSEN', 360, 430);
    }
}
