class StartScreenRenderer {
    /** Creates the main start screen renderer. */
    constructor(screen) {
        this.screen = screen;
        this.overlayRenderer = new StartScreenOverlayRenderer(screen);
        this.tutorialRenderer = new StartScreenTutorialRenderer(screen);
    }

    /** Draws the visible start screen state. */
    draw(ctx) {
        this.drawBackground(ctx);
        if (this.screen.activeOverlay) return this.overlayRenderer.draw(ctx);
        if (this.screen.showingTutorial) return this.tutorialRenderer.draw(ctx);
        this.drawMenu(ctx);
    }

    /** Draws the background image or fallback color. */
    drawBackground(ctx) {
        if (this.hasBackgroundImage()) ctx.drawImage(this.screen.backgroundImg, 0, 0, 720, 480);
        else this.drawFallbackBackground(ctx);
        this.drawBackgroundShade(ctx);
    }

    /** Returns whether the background image is drawable. */
    hasBackgroundImage() {
        return this.screen.backgroundImg.complete && this.screen.backgroundImg.naturalWidth > 0;
    }

    /** Draws the fallback background color. */
    drawFallbackBackground(ctx) {
        ctx.fillStyle = '#0a2e38';
        ctx.fillRect(0, 0, 720, 480);
    }

    /** Draws the dark background shade. */
    drawBackgroundShade(ctx) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.fillRect(0, 0, 720, 480);
    }

    /** Draws the main menu buttons. */
    drawMenu(ctx) {
        if (!this.areMenuImagesLoaded()) return this.drawLoadingText(ctx);
        this.screen.buttons.forEach(button => this.drawMenuButton(ctx, button));
        this.drawFullscreenButton(ctx);
    }

    /** Returns whether all menu images are ready. */
    areMenuImagesLoaded() {
        return this.screen.startButtonImg.complete && this.screen.settingsButtonImg.complete &&
            this.screen.tutorialButtonImg.complete && this.screen.arrowKeysImg.complete &&
            this.screen.wasdKeyImg.complete && this.screen.spaceKeyImg.complete && this.screen.eKeyImg.complete;
    }

    /** Draws the loading label on the menu. */
    drawLoadingText(ctx) {
        ctx.font = '32px Luckiest Guy';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Laedt...', 360, 240);
    }

    /** Draws one menu button. */
    drawMenuButton(ctx, button) {
        this.enableButtonShadow(ctx);
        this.drawMenuButtonImage(ctx, button);
        this.drawButtonFeedback(ctx, button);
        this.disableButtonShadow(ctx);
    }

    /** Enables menu button shadow. */
    enableButtonShadow(ctx) {
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetY = 5;
    }

    /** Disables menu button shadow. */
    disableButtonShadow(ctx) {
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetY = 0;
    }

    /** Draws the correct image for one menu button. */
    drawMenuButtonImage(ctx, button) {
        const buttonImg = this.getButtonImage(button.name);
        if (buttonImg && buttonImg.complete) {
            ctx.drawImage(buttonImg, button.x, button.y, button.width, button.height);
        } else if (button.name === 'imprint') this.drawImprintButton(ctx, button);
    }

    /** Returns the image for a menu button name. */
    getButtonImage(buttonName) {
        if (buttonName === 'start') return this.screen.startButtonImg;
        if (buttonName === 'settings') return this.screen.settingsButtonImg;
        if (buttonName === 'tutorial') return this.screen.tutorialButtonImg;
        return null;
    }

    /** Draws the fullscreen button. */
    drawFullscreenButton(ctx) {
        const button = this.screen.fullscreenButton;
        this.drawFullscreenButtonBase(ctx, button);
        this.drawFullscreenIcon(ctx, button);
    }

    /** Draws the fullscreen button base. */
    drawFullscreenButtonBase(ctx, button) {
        ctx.fillStyle = this.screen.hoveredElement === 'fullscreen' ? 'rgba(255, 255, 255, 0.42)' : 'rgba(200, 200, 200, 0.3)';
        ctx.fillRect(button.x, button.y, button.width, button.height);
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = this.screen.hoveredElement === 'fullscreen' ? 2 : 1;
        ctx.strokeRect(button.x, button.y, button.width, button.height);
    }

    /** Draws the fullscreen button icon. */
    drawFullscreenIcon(ctx, button) {
        ctx.fillStyle = '#fff';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('[]', button.x + button.width / 2, button.y + button.height / 2);
    }

    /** Draws the imprint menu button. */
    drawImprintButton(ctx, button) {
        this.overlayRenderer.roundRect(ctx, button.x, button.y, button.width, button.height, 12);
        ctx.fillStyle = this.screen.hoveredElement === button.name ? '#25a9d3' : '#1a8fb4';
        ctx.fill();
        this.drawImprintButtonBorder(ctx);
        this.drawImprintButtonText(ctx, button);
    }

    /** Draws the imprint button border. */
    drawImprintButtonBorder(ctx) {
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'white';
        ctx.stroke();
    }

    /** Draws the imprint button text. */
    drawImprintButtonText(ctx, button) {
        ctx.fillStyle = 'white';
        ctx.font = '22px Luckiest Guy';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('IMPRESSUM', button.x + button.width / 2, button.y + button.height / 2);
    }

    /** Draws hover feedback for one button. */
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
