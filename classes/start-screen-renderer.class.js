class StartScreenRenderer {
    constructor(screen) {
        this.screen = screen;
    }

    draw(ctx) {
        this.drawBackground(ctx);
        if (this.screen.activeOverlay) return this.drawOverlay(ctx);
        if (this.screen.showingTutorial) return this.drawTutorial(ctx);
        this.drawMenu(ctx);
    }

    roundRect(ctx, x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        this.finishRoundRect(ctx, x, y, width, height, radius);
    }

    finishRoundRect(ctx, x, y, width, height, radius) {
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
    }

    drawBackground(ctx) {
        if (this.screen.backgroundImg.complete && this.screen.backgroundImg.naturalWidth > 0) {
            ctx.drawImage(this.screen.backgroundImg, 0, 0, 720, 480);
        } else this.drawFallbackBackground(ctx);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.fillRect(0, 0, 720, 480);
    }

    drawFallbackBackground(ctx) {
        ctx.fillStyle = '#0a2e38';
        ctx.fillRect(0, 0, 720, 480);
    }

    drawOverlay(ctx) {
        this.drawOverlayBackground(ctx);
        this.drawOverlayPanel(ctx);
        this.drawOverlayTitle(ctx);
        this.screen.activeOverlay === 'settings'
            ? this.drawSettingsOverlay(ctx)
            : this.drawImprintOverlay(ctx);
        this.drawCloseButton(ctx);
    }

    drawOverlayBackground(ctx) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, 720, 480);
    }

    drawOverlayPanel(ctx) {
        this.roundRect(ctx, 150, 70, 420, 340, 20);
        ctx.fillStyle = '#0f3f56';
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'white';
        ctx.stroke();
    }

    drawOverlayTitle(ctx) {
        ctx.font = '36px Luckiest Guy';
        ctx.fillStyle = '#1a8fb4';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.getOverlayTitle(), 360, 140);
    }

    getOverlayTitle() {
        return this.screen.activeOverlay === 'settings' ? 'EINSTELLUNGEN' : 'IMPRESSUM';
    }

    drawSettingsOverlay(ctx) {
        ctx.font = '24px Luckiest Guy';
        ctx.fillStyle = 'white';
        ctx.fillText('Lautstaerke', 360, 195);
        this.drawVolumeSlider(ctx);
    }

    drawVolumeSlider(ctx) {
        const slider = this.screen.getVolumeSlider();
        this.drawSliderTrack(ctx, slider);
        this.drawSliderValue(ctx, slider);
        this.drawVolumeHandle(ctx, slider);
    }

    drawSliderTrack(ctx, slider) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fillRect(slider.x, slider.y, slider.width, slider.height);
    }

    drawSliderValue(ctx, slider) {
        ctx.fillStyle = '#1a8fb4';
        ctx.fillRect(slider.x, slider.y, slider.width * this.screen.volume, slider.height);
    }

    drawVolumeHandle(ctx, slider) {
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(slider.x + slider.width * this.screen.volume, slider.y + slider.height / 2, 8, 0, Math.PI * 2);
        ctx.fill();
    }

    drawImprintOverlay(ctx) {
        ctx.font = '22px Luckiest Guy';
        ctx.fillStyle = 'white';
        ctx.fillText('Verantwortlich fuer den Inhalt:', 360, 190);
        this.drawImprintAddress(ctx);
    }

    drawImprintAddress(ctx) {
        ctx.font = '28px Luckiest Guy';
        ctx.fillText('Tobias Illner', 360, 245);
        ctx.font = '20px Luckiest Guy';
        ctx.fillText('Hirtenweg 13', 360, 280);
        ctx.fillText('38536 Meinersen', 360, 308);
    }

    drawCloseButton(ctx) {
        const button = this.screen.getCloseButton();
        this.roundRect(ctx, button.x, button.y, button.width, button.height, 12);
        ctx.fillStyle = this.screen.hoveredElement === 'close' ? '#ff6666' : '#ff4444';
        ctx.fill();
        this.drawCloseButtonText(ctx);
    }

    drawCloseButtonText(ctx) {
        ctx.fillStyle = 'white';
        ctx.font = '22px Luckiest Guy';
        ctx.fillText('Schliessen', 360, 370);
    }

    drawMenu(ctx) {
        if (!this.areMenuImagesLoaded()) return this.drawLoadingText(ctx);
        this.screen.buttons.forEach(button => this.drawMenuButton(ctx, button));
        this.drawFullscreenButton(ctx);
    }

    areMenuImagesLoaded() {
        return this.screen.startButtonImg.complete && this.screen.settingsButtonImg.complete &&
            this.screen.tutorialButtonImg.complete && this.screen.arrowKeysImg.complete &&
            this.screen.wasdKeyImg.complete && this.screen.spaceKeyImg.complete && this.screen.eKeyImg.complete;
    }

    drawLoadingText(ctx) {
        ctx.font = '32px Luckiest Guy';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Laedt...', 360, 240);
    }

    drawMenuButton(ctx, button) {
        this.enableButtonShadow(ctx);
        this.drawMenuButtonImage(ctx, button);
        this.drawButtonFeedback(ctx, button);
        this.disableButtonShadow(ctx);
    }

    enableButtonShadow(ctx) {
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetY = 5;
    }

    disableButtonShadow(ctx) {
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetY = 0;
    }

    drawMenuButtonImage(ctx, button) {
        const buttonImg = this.getButtonImage(button.name);
        if (buttonImg && buttonImg.complete) {
            ctx.drawImage(buttonImg, button.x, button.y, button.width, button.height);
        } else if (button.name === 'imprint') this.drawImprintButton(ctx, button);
    }

    getButtonImage(buttonName) {
        if (buttonName === 'start') return this.screen.startButtonImg;
        if (buttonName === 'settings') return this.screen.settingsButtonImg;
        if (buttonName === 'tutorial') return this.screen.tutorialButtonImg;
        return null;
    }

    drawFullscreenButton(ctx) {
        const button = this.screen.fullscreenButton;
        this.drawFullscreenButtonBase(ctx, button);
        this.drawFullscreenIcon(ctx, button);
    }

    drawFullscreenButtonBase(ctx, button) {
        ctx.fillStyle = this.screen.hoveredElement === 'fullscreen' ? 'rgba(255, 255, 255, 0.42)' : 'rgba(200, 200, 200, 0.3)';
        ctx.fillRect(button.x, button.y, button.width, button.height);
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = this.screen.hoveredElement === 'fullscreen' ? 2 : 1;
        ctx.strokeRect(button.x, button.y, button.width, button.height);
    }

    drawFullscreenIcon(ctx, button) {
        ctx.fillStyle = '#fff';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('[]', button.x + button.width / 2, button.y + button.height / 2);
    }

    drawImprintButton(ctx, button) {
        this.roundRect(ctx, button.x, button.y, button.width, button.height, 12);
        ctx.fillStyle = this.screen.hoveredElement === button.name ? '#25a9d3' : '#1a8fb4';
        ctx.fill();
        this.drawImprintButtonBorder(ctx);
        this.drawImprintButtonText(ctx, button);
    }

    drawImprintButtonBorder(ctx) {
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'white';
        ctx.stroke();
    }

    drawImprintButtonText(ctx, button) {
        ctx.fillStyle = 'white';
        ctx.font = '22px Luckiest Guy';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('IMPRESSUM', button.x + button.width / 2, button.y + button.height / 2);
    }

    drawButtonFeedback(ctx, button, radius = 12) {
        if (this.screen.hoveredElement !== button.name) return;
        this.roundRect(ctx, button.x, button.y, button.width, button.height, radius);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.18)';
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.strokeStyle = 'white';
        ctx.stroke();
    }

    isTouchDevice() {
        return window.matchMedia('(pointer: coarse), (hover: none)').matches;
    }

    drawTutorial(ctx) {
        this.drawTutorialBackground(ctx);
        this.drawTutorialTitle(ctx);
        this.isTouchDevice() ? this.drawMobileTutorial(ctx) : this.drawKeyboardTutorial(ctx);
        this.drawTutorialCloseButton(ctx);
    }

    drawTutorialBackground(ctx) {
        ctx.fillStyle = 'rgba(0, 0, 30, 0.6)';
        ctx.fillRect(0, 0, 720, 480);
    }

    drawTutorialTitle(ctx) {
        ctx.font = '48px Luckiest Guy';
        ctx.fillStyle = '#1a8fb4';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('STEUERUNG', 360, 80);
    }

    drawKeyboardTutorial(ctx) {
        ctx.font = '28px Luckiest Guy';
        ctx.fillStyle = 'white';
        ctx.fillText('Bewegung', 360, 130);
        this.drawKeyboardMovementImages(ctx);
        ctx.fillText('Angriff', 360, 270);
        this.drawKeyboardAttackImages(ctx);
        this.drawKeyboardAttackLabels(ctx);
    }

    drawKeyboardMovementImages(ctx) {
        this.drawScaledImage(ctx, this.screen.arrowKeysImg, 120, 150, 0.35);
        this.drawScaledImage(ctx, this.screen.wasdKeyImg, 400, 100, 0.18);
    }

    drawKeyboardAttackImages(ctx) {
        this.drawScaledImage(ctx, this.screen.spaceKeyImg, 120, 290, 0.35);
        this.drawScaledImage(ctx, this.screen.eKeyImg, 440, 270, 0.10);
    }

    drawKeyboardAttackLabels(ctx) {
        ctx.font = '24px Luckiest Guy';
        ctx.fillText('Normaler Angriff', this.getImageCenterX(this.screen.spaceKeyImg, 120, 0.35), 390);
        ctx.fillText('Spezialangriff', this.getImageCenterX(this.screen.eKeyImg, 440, 0.10), 390);
    }

    drawScaledImage(ctx, image, x, y, scale) {
        if (image.complete) {
            ctx.drawImage(image, x, y, image.naturalWidth * scale, image.naturalHeight * scale);
        }
    }

    getImageCenterX(image, x, scale) {
        return x + (image.naturalWidth * scale) / 2;
    }

    drawMobileTutorial(ctx) {
        ctx.font = '28px Luckiest Guy';
        ctx.fillStyle = 'white';
        ctx.fillText('Touch Steuerung', 360, 135);
        this.drawTouchPreviewGroup(ctx);
        this.drawMobileTutorialLabels(ctx);
    }

    drawTouchPreviewGroup(ctx) {
        this.drawTouchDpadPreview(ctx, 210, 205);
        this.drawTouchActionPreview(ctx, 505, 205, 68, 'A');
        this.drawTouchActionPreview(ctx, 595, 220, 54, 'E');
    }

    drawMobileTutorialLabels(ctx) {
        ctx.font = '22px Luckiest Guy';
        ctx.fillText('Bewegung', 210, 340);
        ctx.fillText('Angriff', 505, 340);
        ctx.fillText('Spezial', 595, 340);
    }

    drawTouchDpadPreview(ctx, centerX, centerY) {
        const size = 48;
        this.drawTouchPreviewButton(ctx, centerX, centerY - size, size, '^');
        this.drawTouchPreviewButton(ctx, centerX - size, centerY, size, '<');
        this.drawTouchPreviewButton(ctx, centerX, centerY + size, size, 'v');
        this.drawTouchPreviewButton(ctx, centerX + size, centerY, size, '>');
    }

    drawTouchActionPreview(ctx, centerX, centerY, size, label) {
        this.drawTouchPreviewButton(ctx, centerX, centerY, size, label);
    }

    drawTouchPreviewButton(ctx, centerX, centerY, size, label) {
        this.drawTouchPreviewCircle(ctx, centerX, centerY, size);
        this.drawTouchPreviewText(ctx, centerX, centerY, size, label);
    }

    drawTouchPreviewCircle(ctx, centerX, centerY, size) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, size / 2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(10, 46, 56, 0.8)';
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'white';
        ctx.stroke();
    }

    drawTouchPreviewText(ctx, centerX, centerY, size, label) {
        ctx.fillStyle = 'white';
        ctx.font = `${Math.round(size * 0.42)}px Luckiest Guy`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(label, centerX, centerY + 1);
    }

    drawTutorialCloseButton(ctx) {
        const button = this.screen.getTutorialCloseButton();
        ctx.fillStyle = this.screen.hoveredElement === 'tutorial-close' ? '#ff6666' : '#ff4444';
        this.roundRect(ctx, button.x, button.y, button.width, button.height, 10);
        ctx.fill();
        this.drawTutorialCloseBorder(ctx);
        this.drawTutorialCloseText(ctx);
    }

    drawTutorialCloseBorder(ctx) {
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'white';
        ctx.stroke();
    }

    drawTutorialCloseText(ctx) {
        ctx.font = '20px Luckiest Guy';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('SCHLIESSEN', 360, 430);
    }
}
