/**
 * Draws settings and imprint overlays on the start screen.
 */
class StartScreenOverlayRenderer {
    /**
     * Creates a renderer for start screen overlays.
     * @param {string} screen - Screen name to activate.
     */
    constructor(screen) {
        this.screen = screen;
    }

    /**
     * Draws the active overlay.
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context.
     */
    draw(ctx) {
        this.drawOverlayBackground(ctx);
        this.drawOverlayPanel(ctx);
        this.drawOverlayTitle(ctx);
        this.screen.activeOverlay === 'settings' ? this.drawSettingsOverlay(ctx) : this.drawImprintOverlay(ctx);
        this.drawCloseButton(ctx);
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
    roundRect(ctx, x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        this.finishRoundRect(ctx, x, y, width, height, radius);
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
    finishRoundRect(ctx, x, y, width, height, radius) {
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
    }

    /**
     * Draws the overlay background.
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context.
     */
    drawOverlayBackground(ctx) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, 720, 480);
    }

    /**
     * Draws the overlay panel.
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context.
     */
    drawOverlayPanel(ctx) {
        this.roundRect(ctx, 150, 70, 420, 340, 20);
        ctx.fillStyle = '#0f3f56';
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'white';
        ctx.stroke();
    }

    /**
     * Draws the overlay title.
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context.
     */
    drawOverlayTitle(ctx) {
        ctx.font = '36px Luckiest Guy';
        ctx.fillStyle = '#1a8fb4';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.getOverlayTitle(), 360, 140);
    }

    /**
     * Returns the title for the active overlay.
     * @returns {string} Active overlay title.
     */
    getOverlayTitle() {
        return this.screen.activeOverlay === 'settings' ? 'EINSTELLUNGEN' : 'IMPRESSUM';
    }

    /**
     * Draws settings content.
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context.
     */
    drawSettingsOverlay(ctx) {
        ctx.font = '24px Luckiest Guy';
        ctx.fillStyle = 'white';
        ctx.fillText('Lautstaerke', 360, 195);
        this.drawVolumeSlider(ctx);
    }

    /**
     * Draws the volume slider.
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context.
     */
    drawVolumeSlider(ctx) {
        const slider = this.screen.getVolumeSlider();
        this.drawSliderTrack(ctx, slider);
        this.drawSliderValue(ctx, slider);
        this.drawVolumeHandle(ctx, slider);
    }

    /**
     * Draws the volume slider track.
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context.
     * @param {{x: number, y: number, width: number, height: number}} slider - Volume slider layout.
     */
    drawSliderTrack(ctx, slider) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fillRect(slider.x, slider.y, slider.width, slider.height);
    }

    /**
     * Draws the volume slider fill.
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context.
     * @param {{x: number, y: number, width: number, height: number}} slider - Volume slider layout.
     */
    drawSliderValue(ctx, slider) {
        ctx.fillStyle = '#1a8fb4';
        ctx.fillRect(slider.x, slider.y, slider.width * this.screen.volume, slider.height);
    }

    /**
     * Draws the volume slider handle.
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context.
     * @param {{x: number, y: number, width: number, height: number}} slider - Volume slider layout.
     */
    drawVolumeHandle(ctx, slider) {
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(slider.x + slider.width * this.screen.volume, slider.y + slider.height / 2, 8, 0, Math.PI * 2);
        ctx.fill();
    }

    /**
     * Draws imprint content.
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context.
     */
    drawImprintOverlay(ctx) {
        ctx.font = '22px Luckiest Guy';
        ctx.fillStyle = 'white';
        ctx.fillText('Verantwortlich fuer den Inhalt:', 360, 190);
        this.drawImprintAddress(ctx);
    }

    /**
     * Draws the imprint address.
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context.
     */
    drawImprintAddress(ctx) {
        ctx.font = '28px Luckiest Guy';
        ctx.fillText('Tobias Illner', 360, 245);
        ctx.font = '20px Luckiest Guy';
        ctx.fillText('Hirtenweg 13', 360, 280);
        ctx.fillText('38536 Meinersen', 360, 308);
    }

    /**
     * Draws the close button.
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context.
     */
    drawCloseButton(ctx) {
        const button = this.screen.getCloseButton();
        this.roundRect(ctx, button.x, button.y, button.width, button.height, 12);
        ctx.fillStyle = this.screen.hoveredElement === 'close' ? '#ff6666' : '#ff4444';
        ctx.fill();
        this.drawCloseButtonText(ctx);
    }

    /**
     * Draws the close button text.
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context.
     */
    drawCloseButtonText(ctx) {
        ctx.fillStyle = 'white';
        ctx.font = '22px Luckiest Guy';
        ctx.fillText('Schliessen', 360, 370);
    }
}
