class StartScreen {
    buttons = [
        { name: 'start', x: 270, y: 150, width: 180, height: 50 },
        { name: 'settings', x: 270, y: 215, width: 180, height: 50 },
        { name: 'tutorial', x: 270, y: 280, width: 180, height: 50 },
        { name: 'imprint', x: 270, y: 345, width: 180, height: 50 }
    ];
    fullscreenButton = { x: 655, y: 25, width: 40, height: 40 };
    showingTutorial = false;
    activeOverlay = null;
    volume = 0.5;
    isVolumeDragging = false;
    volumeChangeCallback = null;
    hoveredElement = null;

    /** Creates this object. */
    constructor() {
        this.volume = typeof savedVolume !== 'undefined' ? savedVolume : 0.5;
        this.loadImages();
        this.renderer = new StartScreenRenderer(this);
    }

    /** load images. */
    loadImages() {
        this.backgroundImg = this.createImage('./assets/img/Background/underwater.png');
        this.arrowKeysImg = this.createImage('./assets/img/Botones/Key/arrow keys.png');
        this.wasdKeyImg = this.createImage('./assets/img/Botones/Key/WASD-Key.png');
        this.spaceKeyImg = this.createImage('./assets/img/Botones/Key/Space Bar key.png');
        this.eKeyImg = this.createImage('./assets/img/Botones/Key/E-Key.png');
        this.startButtonImg = this.createImage('./assets/img/Botones/Start/Start-button.png');
        this.settingsButtonImg = this.createImage('./assets/img/Botones/Start/Einstellung-button.png');
        this.tutorialButtonImg = this.createImage('./assets/img/Botones/Start/Anleitung-button.png');
    }

    /** create image. */
    createImage(path) {
        const image = new Image();
        image.src = path;
        return image;
    }

    /** draw. */
    draw(ctx) {
        this.renderer.draw(ctx);
    }

    /** set volume. */
    setVolume(value) {
        this.volume = Math.min(1, Math.max(0, value));
        if (this.volumeChangeCallback) this.volumeChangeCallback(this.volume);
    }

    /** open settings. */
    openSettings() {
        this.activeOverlay = 'settings';
    }

    /** open imprint. */
    openImprint() {
        this.activeOverlay = 'imprint';
    }

    /** close overlay. */
    closeOverlay() {
        this.activeOverlay = null;
    }

    /** start volume drag. */
    startVolumeDrag(x, y) {
        if (this.activeOverlay !== 'settings') return;
        if (!this.isSettingsSliderHovered(x, y)) return;
        this.isVolumeDragging = true;
        this.updateVolumeFromX(x);
    }

    /** update volume from x. */
    updateVolumeFromX(x) {
        if (this.activeOverlay !== 'settings') return;
        const slider = this.getVolumeSlider();
        this.setVolume((x - slider.x) / slider.width);
    }

    /** stop volume drag. */
    stopVolumeDrag() {
        this.isVolumeDragging = false;
    }

    /** is inside rect. */
    isInsideRect(x, y, rect) {
        return x >= rect.x && x <= rect.x + rect.width &&
            y >= rect.y && y <= rect.y + rect.height;
    }

    /** get volume slider. */
    getVolumeSlider() {
        return { x: 200, y: 225, width: 320, height: 12 };
    }

    /** is settings slider hovered. */
    isSettingsSliderHovered(x, y) {
        const slider = this.getVolumeSlider();
        return x >= slider.x && x <= slider.x + slider.width &&
            y >= slider.y - 20 && y <= slider.y + slider.height + 20;
    }

    /** is close button hovered. */
    isCloseButtonHovered(x, y) {
        return this.isInsideRect(x, y, this.getCloseButton());
    }

    /** get close button. */
    getCloseButton() {
        return { x: 240, y: 348, width: 240, height: 44 };
    }

    /** is interactive element hovered. */
    isInteractiveElementHovered(x, y) {
        return Boolean(this.getInteractiveElementAt(x, y));
    }

    /** get interactive element at. */
    getInteractiveElementAt(x, y) {
        if (this.activeOverlay) return this.getOverlayElementAt(x, y);
        if (this.showingTutorial) return this.getTutorialElementAt(x, y);
        if (this.isInsideRect(x, y, this.fullscreenButton)) return 'fullscreen';
        return this.getMenuElementAt(x, y);
    }

    /** get overlay element at. */
    getOverlayElementAt(x, y) {
        if (this.isCloseButtonHovered(x, y)) return 'close';
        if (this.activeOverlay === 'settings' && this.isSettingsSliderHovered(x, y)) return 'volume';
        return null;
    }

    /** get tutorial element at. */
    getTutorialElementAt(x, y) {
        return this.isInsideRect(x, y, this.getTutorialCloseButton()) ? 'tutorial-close' : null;
    }

    /** get tutorial close button. */
    getTutorialCloseButton() {
        return { x: 300, y: 410, width: 120, height: 40 };
    }

    /** get menu element at. */
    getMenuElementAt(x, y) {
        const button = this.buttons.find(button => this.isInsideRect(x, y, button));
        return button ? button.name : null;
    }

    /** check click. */
    checkClick(x, y, startGameCallback, settingsCallback, imprintCallback, fullscreenCallback, closeOverlayCallback, setVolumeCallback) {
        if (this.activeOverlay) return this.handleOverlayClick(x, y, closeOverlayCallback, setVolumeCallback);
        if (this.showingTutorial) return this.handleTutorialClick(x, y);
        if (this.handleFullscreenClick(x, y, fullscreenCallback)) return;
        this.handleMenuClick(x, y, startGameCallback, settingsCallback, imprintCallback);
    }

    /** handle overlay click. */
    handleOverlayClick(x, y, closeOverlayCallback, setVolumeCallback) {
        if (this.handleSliderClick(x, y, setVolumeCallback)) return;
        if (this.isCloseButtonHovered(x, y) && closeOverlayCallback) closeOverlayCallback();
    }

    /** handle slider click. */
    handleSliderClick(x, y, setVolumeCallback) {
        if (this.activeOverlay !== 'settings' || !this.isSettingsSliderHovered(x, y)) return false;
        this.updateVolumeFromX(x);
        if (setVolumeCallback) setVolumeCallback(this.volume);
        return true;
    }

    /** handle tutorial click. */
    handleTutorialClick(x, y) {
        if (this.getTutorialElementAt(x, y)) this.showingTutorial = false;
    }

    /** handle fullscreen click. */
    handleFullscreenClick(x, y, fullscreenCallback) {
        if (!this.isInsideRect(x, y, this.fullscreenButton)) return false;
        if (fullscreenCallback) fullscreenCallback();
        return true;
    }

    /** handle menu click. */
    handleMenuClick(x, y, startGameCallback, settingsCallback, imprintCallback) {
        const name = this.getMenuElementAt(x, y);
        if (name) this.runMenuAction(name, startGameCallback, settingsCallback, imprintCallback);
    }

    /** run menu action. */
    runMenuAction(name, startGameCallback, settingsCallback, imprintCallback) {
        if (name === 'start' && startGameCallback) startGameCallback();
        else if (name === 'settings' && settingsCallback) settingsCallback();
        else if (name === 'tutorial') this.showingTutorial = true;
        else if (name === 'imprint' && imprintCallback) imprintCallback();
    }
}
