class StartScreenOverlayRenderer {
    /** Creates a renderer for start screen overlays. */
    constructor(screen) {
        this.screen = screen;
    }

    /** Draws the active overlay. */
    draw(ctx) {
        this.drawOverlayBackground(ctx);
        this.drawOverlayPanel(ctx);
        this.drawOverlayTitle(ctx);
        this.screen.activeOverlay === 'settings' ? this.drawSettingsOverlay(ctx) : this.drawImprintOverlay(ctx);
        this.drawCloseButton(ctx);
    }

    /** Draws a rounded rectangle path. */
    roundRect(ctx, x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        this.finishRoundRect(ctx, x, y, width, height, radius);
    }

    /** Finishes a rounded rectangle path. */
    finishRoundRect(ctx, x, y, width, height, radius) {
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
    }

    /** Draws the overlay background. */
    drawOverlayBackground(ctx) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, 720, 480);
    }

    /** Draws the overlay panel. */
    drawOverlayPanel(ctx) {
        this.roundRect(ctx, 150, 70, 420, 340, 20);
        ctx.fillStyle = '#0f3f56';
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'white';
        ctx.stroke();
    }

    /** Draws the overlay title. */
    drawOverlayTitle(ctx) {
        ctx.font = '36px Luckiest Guy';
        ctx.fillStyle = '#1a8fb4';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.getOverlayTitle(), 360, 140);
    }

    /** Returns the title for the active overlay. */
    getOverlayTitle() {
        return this.screen.activeOverlay === 'settings' ? 'EINSTELLUNGEN' : 'IMPRESSUM';
    }

    /** Draws settings content. */
    drawSettingsOverlay(ctx) {
        ctx.font = '24px Luckiest Guy';
        ctx.fillStyle = 'white';
        ctx.fillText('Lautstaerke', 360, 195);
        this.drawVolumeSlider(ctx);
    }

    /** Draws the volume slider. */
    drawVolumeSlider(ctx) {
        const slider = this.screen.getVolumeSlider();
        this.drawSliderTrack(ctx, slider);
        this.drawSliderValue(ctx, slider);
        this.drawVolumeHandle(ctx, slider);
    }

    /** Draws the volume slider track. */
    drawSliderTrack(ctx, slider) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fillRect(slider.x, slider.y, slider.width, slider.height);
    }

    /** Draws the volume slider fill. */
    drawSliderValue(ctx, slider) {
        ctx.fillStyle = '#1a8fb4';
        ctx.fillRect(slider.x, slider.y, slider.width * this.screen.volume, slider.height);
    }

    /** Draws the volume slider handle. */
    drawVolumeHandle(ctx, slider) {
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(slider.x + slider.width * this.screen.volume, slider.y + slider.height / 2, 8, 0, Math.PI * 2);
        ctx.fill();
    }

    /** Draws imprint content. */
    drawImprintOverlay(ctx) {
        ctx.font = '22px Luckiest Guy';
        ctx.fillStyle = 'white';
        ctx.fillText('Verantwortlich fuer den Inhalt:', 360, 190);
        this.drawImprintAddress(ctx);
    }

    /** Draws the imprint address. */
    drawImprintAddress(ctx) {
        ctx.font = '28px Luckiest Guy';
        ctx.fillText('Tobias Illner', 360, 245);
        ctx.font = '20px Luckiest Guy';
        ctx.fillText('Hirtenweg 13', 360, 280);
        ctx.fillText('38536 Meinersen', 360, 308);
    }

    /** Draws the close button. */
    drawCloseButton(ctx) {
        const button = this.screen.getCloseButton();
        this.roundRect(ctx, button.x, button.y, button.width, button.height, 12);
        ctx.fillStyle = this.screen.hoveredElement === 'close' ? '#ff6666' : '#ff4444';
        ctx.fill();
        this.drawCloseButtonText(ctx);
    }

    /** Draws the close button text. */
    drawCloseButtonText(ctx) {
        ctx.fillStyle = 'white';
        ctx.font = '22px Luckiest Guy';
        ctx.fillText('Schliessen', 360, 370);
    }
}
