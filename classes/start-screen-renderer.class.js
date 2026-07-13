/**
 * Draws the main start screen.
 */
class StartScreenRenderer {
    /**
     * Creates the main start screen renderer.
     * @param {string} screen - Screen name to activate.
     */
    constructor(screen) {
        this.screen = screen;
        this.overlayRenderer = new StartScreenOverlayRenderer(screen);
        this.tutorialRenderer = new StartScreenTutorialRenderer(screen);
    }

    /**
     * Draws the visible start screen state.
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context.
     */
    draw(ctx) {
        this.drawBackground(ctx);
        if (this.screen.activeOverlay) return this.overlayRenderer.draw(ctx);
        if (this.screen.showingTutorial) return this.tutorialRenderer.draw(ctx);
        this.drawMenu(ctx);
    }

    /**
     * Draws the background image or fallback color.
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context.
     */
    drawBackground(ctx) {
        if (this.hasBackgroundImage()) ctx.drawImage(this.screen.backgroundImg, 0, 0, 720, 480);
        else this.drawFallbackBackground(ctx);
        this.drawBackgroundShade(ctx);
    }

    /**
     * Returns whether the background image is drawable.
     * @returns {boolean} True when the background image is loaded.
     */
    hasBackgroundImage() {
        return this.screen.backgroundImg.complete && this.screen.backgroundImg.naturalWidth > 0;
    }

    /**
     * Draws the fallback background color.
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context.
     */
    drawFallbackBackground(ctx) {
        ctx.fillStyle = '#0a2e38';
        ctx.fillRect(0, 0, 720, 480);
    }

    /**
     * Draws the dark background shade.
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context.
     */
    drawBackgroundShade(ctx) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.fillRect(0, 0, 720, 480);
    }

    /**
     * Draws the main menu buttons.
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context.
     */
    drawMenu(ctx) {
        if (!this.areMenuImagesLoaded()) return this.drawLoadingText(ctx);
        this.screen.buttons.forEach(button => this.drawMenuButton(ctx, button));
        this.drawFullscreenButton(ctx);
    }

    /**
     * Returns whether all menu images are ready.
     * @returns {boolean} True when all menu images are loaded.
     */
    areMenuImagesLoaded() {
        return this.screen.startButtonImg.complete && this.screen.settingsButtonImg.complete &&
            this.screen.tutorialButtonImg.complete && this.screen.arrowKeysImg.complete &&
            this.screen.wasdKeyImg.complete && this.screen.spaceKeyImg.complete && this.screen.eKeyImg.complete;
    }

    /**
     * Draws the loading label on the menu.
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context.
     */
    drawLoadingText(ctx) {
        ctx.font = '32px Luckiest Guy';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Laedt...', 360, 240);
    }

    /**
     * Draws one menu button.
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context.
     * @param {Object} button - Button data or element.
     */
    drawMenuButton(ctx, button) {
        this.enableButtonShadow(ctx);
        this.drawMenuButtonImage(ctx, button);
        this.drawButtonFeedback(ctx, button);
        this.disableButtonShadow(ctx);
    }

    /**
     * Enables menu button shadow.
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context.
     */
    enableButtonShadow(ctx) {
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetY = 5;
    }

    /**
     * Disables menu button shadow.
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context.
     */
    disableButtonShadow(ctx) {
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetY = 0;
    }

    /**
     * Draws the correct image for one menu button.
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context.
     * @param {Object} button - Button data or element.
     */
    drawMenuButtonImage(ctx, button) {
        const buttonImg = this.getButtonImage(button.name);
        if (buttonImg && buttonImg.complete) {
            ctx.drawImage(buttonImg, button.x, button.y, button.width, button.height);
        } else if (button.name === 'imprint') this.drawImprintButton(ctx, button);
    }

    /**
     * Returns the image for a menu button name.
     * @param {string} buttonName - Button name.
     * @returns {HTMLImageElement|null} Matching image, or null when no image exists.
     */
    getButtonImage(buttonName) {
        if (buttonName === 'start') return this.screen.startButtonImg;
        if (buttonName === 'settings') return this.screen.settingsButtonImg;
        if (buttonName === 'tutorial') return this.screen.tutorialButtonImg;
        return null;
    }

    /**
     * Draws the fullscreen button.
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context.
     */
    drawFullscreenButton(ctx) {
        const button = this.screen.fullscreenButton;
        this.drawFullscreenButtonBase(ctx, button);
        this.drawFullscreenIcon(ctx, button);
    }

    /**
     * Draws the fullscreen button base.
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context.
     * @param {Object} button - Button data or element.
     */
    drawFullscreenButtonBase(ctx, button) {
        ctx.fillStyle = this.screen.hoveredElement === 'fullscreen' ? 'rgba(255, 255, 255, 0.42)' : 'rgba(200, 200, 200, 0.3)';
        ctx.fillRect(button.x, button.y, button.width, button.height);
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = this.screen.hoveredElement === 'fullscreen' ? 2 : 1;
        ctx.strokeRect(button.x, button.y, button.width, button.height);
    }

    /**
     * Draws the fullscreen button icon.
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context.
     * @param {Object} button - Button data or element.
     */
    drawFullscreenIcon(ctx, button) {
        ctx.fillStyle = '#fff';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('[]', button.x + button.width / 2, button.y + button.height / 2);
    }

    /**
     * Draws the imprint menu button.
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context.
     * @param {Object} button - Button data or element.
     */
    drawImprintButton(ctx, button) {
        this.overlayRenderer.roundRect(ctx, button.x, button.y, button.width, button.height, 12);
        ctx.fillStyle = this.screen.hoveredElement === button.name ? '#25a9d3' : '#1a8fb4';
        ctx.fill();
        this.drawImprintButtonBorder(ctx);
        this.drawImprintButtonText(ctx, button);
    }

    /**
     * Draws the imprint button border.
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context.
     */
    drawImprintButtonBorder(ctx) {
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'white';
        ctx.stroke();
    }

    /**
     * Draws the imprint button text.
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context.
     * @param {Object} button - Button data or element.
     */
    drawImprintButtonText(ctx, button) {
        ctx.fillStyle = 'white';
        ctx.font = '22px Luckiest Guy';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('IMPRESSUM', button.x + button.width / 2, button.y + button.height / 2);
    }

    /**
     * Draws hover feedback for one button.
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context.
     * @param {Object} button - Button data or element.
     */
    drawButtonFeedback(ctx, button) {
        if (this.screen.hoveredElement !== button.name) return;
        this.overlayRenderer.roundRect(ctx, button.x, button.y, button.width, button.height, 12);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.18)';
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.strokeStyle = 'white';
        ctx.stroke();
    }
}
