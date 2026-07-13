/**
 * Controls the start screen state and interactions.
 */
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

    /**
     * Creates a new instance.
     */
    constructor() {
        this.volume = typeof savedVolume !== 'undefined' ? savedVolume : 0.5;
        this.loadImages();
        this.renderer = new StartScreenRenderer(this);
    }

    /**
     * Loads multiple images.
     */
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

    /**
     * Create image.
     * @param {string} path - Image or asset path.
     * @returns {HTMLImageElement} Created image element.
     */
    createImage(path) {
        const image = new Image();
        image.src = path;
        return image;
    }

    /**
     * Draws the object.
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context.
     */
    draw(ctx) {
        this.renderer.draw(ctx);
    }

    /**
     * Set volume.
     * @param {number} value - New value.
     */
    setVolume(value) {
        this.volume = Math.min(1, Math.max(0, value));
        if (this.volumeChangeCallback) this.volumeChangeCallback(this.volume);
    }

    /**
     * Open settings.
     */
    openSettings() {
        this.activeOverlay = 'settings';
    }

    /**
     * Open imprint.
     */
    openImprint() {
        this.activeOverlay = 'imprint';
    }

    /**
     * Close overlay.
     */
    closeOverlay() {
        this.activeOverlay = null;
    }

    /**
     * Start volume drag.
     * @param {number} x - Horizontal canvas or world position.
     * @param {number} y - Vertical canvas or world position.
     */
    startVolumeDrag(x, y) {
        if (this.activeOverlay !== 'settings') return;
        if (!this.isSettingsSliderHovered(x, y)) return;
        this.isVolumeDragging = true;
        this.updateVolumeFromX(x);
    }

    /**
     * Update volume from x.
     * @param {number} x - Horizontal canvas or world position.
     */
    updateVolumeFromX(x) {
        if (this.activeOverlay !== 'settings') return;
        const slider = this.getVolumeSlider();
        this.setVolume((x - slider.x) / slider.width);
    }

    /**
     * Stop volume drag.
     */
    stopVolumeDrag() {
        this.isVolumeDragging = false;
    }

    /**
     * Is inside rect.
     * @param {number} x - Horizontal canvas or world position.
     * @param {number} y - Vertical canvas or world position.
     * @param {{x: number, y: number, width: number, height: number}} rect - Rectangle to test.
     * @returns {boolean} True when the condition is met.
     */
    isInsideRect(x, y, rect) {
        return x >= rect.x && x <= rect.x + rect.width &&
            y >= rect.y && y <= rect.y + rect.height;
    }

    /**
     * Get volume slider.
     * @returns {Object} Calculated layout or data object.
     */
    getVolumeSlider() {
        return { x: 200, y: 225, width: 320, height: 12 };
    }

    /**
     * Is settings slider hovered.
     * @param {number} x - Horizontal canvas or world position.
     * @param {number} y - Vertical canvas or world position.
     * @returns {boolean} True when the condition is met.
     */
    isSettingsSliderHovered(x, y) {
        const slider = this.getVolumeSlider();
        return x >= slider.x && x <= slider.x + slider.width &&
            y >= slider.y - 20 && y <= slider.y + slider.height + 20;
    }

    /**
     * Is close button hovered.
     * @param {number} x - Horizontal canvas or world position.
     * @param {number} y - Vertical canvas or world position.
     * @returns {boolean} True when the condition is met.
     */
    isCloseButtonHovered(x, y) {
        return this.isInsideRect(x, y, this.getCloseButton());
    }

    /**
     * Get close button.
     * @returns {Object} Calculated layout or data object.
     */
    getCloseButton() {
        return { x: 240, y: 348, width: 240, height: 44 };
    }

    /**
     * Is interactive element hovered.
     * @param {number} x - Horizontal canvas or world position.
     * @param {number} y - Vertical canvas or world position.
     * @returns {boolean} True when the condition is met.
     */
    isInteractiveElementHovered(x, y) {
        return Boolean(this.getInteractiveElementAt(x, y));
    }

    /**
     * Get interactive element at.
     * @param {number} x - Horizontal canvas or world position.
     * @param {number} y - Vertical canvas or world position.
     * @returns {string|null} Matching element name, or null when nothing is hit.
     */
    getInteractiveElementAt(x, y) {
        if (this.activeOverlay) return this.getOverlayElementAt(x, y);
        if (this.showingTutorial) return this.getTutorialElementAt(x, y);
        if (this.isInsideRect(x, y, this.fullscreenButton)) return 'fullscreen';
        return this.getMenuElementAt(x, y);
    }

    /**
     * Get overlay element at.
     * @param {number} x - Horizontal canvas or world position.
     * @param {number} y - Vertical canvas or world position.
     * @returns {string|null} Matching element name, or null when nothing is hit.
     */
    getOverlayElementAt(x, y) {
        if (this.isCloseButtonHovered(x, y)) return 'close';
        if (this.activeOverlay === 'settings' && this.isSettingsSliderHovered(x, y)) return 'volume';
        return null;
    }

    /**
     * Get tutorial element at.
     * @param {number} x - Horizontal canvas or world position.
     * @param {number} y - Vertical canvas or world position.
     * @returns {string|null} Matching element name, or null when nothing is hit.
     */
    getTutorialElementAt(x, y) {
        return this.isInsideRect(x, y, this.getTutorialCloseButton()) ? 'tutorial-close' : null;
    }

    /**
     * Get tutorial close button.
     * @returns {Object} Calculated layout or data object.
     */
    getTutorialCloseButton() {
        return { x: 300, y: 410, width: 120, height: 40 };
    }

    /**
     * Get menu element at.
     * @param {number} x - Horizontal canvas or world position.
     * @param {number} y - Vertical canvas or world position.
     * @returns {string|null} Matching element name, or null when nothing is hit.
     */
    getMenuElementAt(x, y) {
        const button = this.buttons.find(button => this.isInsideRect(x, y, button));
        return button ? button.name : null;
    }

    /**
     * Check click.
     * @param {number} x - Horizontal canvas or world position.
     * @param {number} y - Vertical canvas or world position.
     * @param {Function} startGameCallback - Callback function.
     * @param {Function} settingsCallback - Callback function.
     * @param {Function} imprintCallback - Callback function.
     * @param {Function} fullscreenCallback - Callback function.
     * @param {Function} closeOverlayCallback - Callback function.
     * @param {Function} setVolumeCallback - Callback function.
     */
    checkClick(x, y, startGameCallback, settingsCallback, imprintCallback, fullscreenCallback, closeOverlayCallback, setVolumeCallback) {
        if (this.activeOverlay) return this.handleOverlayClick(x, y, closeOverlayCallback, setVolumeCallback);
        if (this.showingTutorial) return this.handleTutorialClick(x, y);
        if (this.handleFullscreenClick(x, y, fullscreenCallback)) return;
        this.handleMenuClick(x, y, startGameCallback, settingsCallback, imprintCallback);
    }

    /**
     * Handle overlay click.
     * @param {number} x - Horizontal canvas or world position.
     * @param {number} y - Vertical canvas or world position.
     * @param {Function} closeOverlayCallback - Callback function.
     * @param {Function} setVolumeCallback - Callback function.
     */
    handleOverlayClick(x, y, closeOverlayCallback, setVolumeCallback) {
        if (this.handleSliderClick(x, y, setVolumeCallback)) return;
        if (this.isCloseButtonHovered(x, y) && closeOverlayCallback) closeOverlayCallback();
    }

    /**
     * Handle slider click.
     * @param {number} x - Horizontal canvas or world position.
     * @param {number} y - Vertical canvas or world position.
     * @param {Function} setVolumeCallback - Callback function.
     * @returns {boolean} Boolean result.
     */
    handleSliderClick(x, y, setVolumeCallback) {
        if (this.activeOverlay !== 'settings' || !this.isSettingsSliderHovered(x, y)) return false;
        this.updateVolumeFromX(x);
        if (setVolumeCallback) setVolumeCallback(this.volume);
        return true;
    }

    /**
     * Handle tutorial click.
     * @param {number} x - Horizontal canvas or world position.
     * @param {number} y - Vertical canvas or world position.
     */
    handleTutorialClick(x, y) {
        if (this.getTutorialElementAt(x, y)) this.showingTutorial = false;
    }

    /**
     * Handle fullscreen click.
     * @param {number} x - Horizontal canvas or world position.
     * @param {number} y - Vertical canvas or world position.
     * @param {Function} fullscreenCallback - Callback function.
     * @returns {boolean} Boolean result.
     */
    handleFullscreenClick(x, y, fullscreenCallback) {
        if (!this.isInsideRect(x, y, this.fullscreenButton)) return false;
        if (fullscreenCallback) fullscreenCallback();
        return true;
    }

    /**
     * Handle menu click.
     * @param {number} x - Horizontal canvas or world position.
     * @param {number} y - Vertical canvas or world position.
     * @param {Function} startGameCallback - Callback function.
     * @param {Function} settingsCallback - Callback function.
     * @param {Function} imprintCallback - Callback function.
     */
    handleMenuClick(x, y, startGameCallback, settingsCallback, imprintCallback) {
        const name = this.getMenuElementAt(x, y);
        if (name) this.runMenuAction(name, startGameCallback, settingsCallback, imprintCallback);
    }

    /**
     * Run menu action.
     * @param {string} name - Name used by this function.
     * @param {Function} startGameCallback - Callback function.
     * @param {Function} settingsCallback - Callback function.
     * @param {Function} imprintCallback - Callback function.
     */
    runMenuAction(name, startGameCallback, settingsCallback, imprintCallback) {
        if (name === 'start' && startGameCallback) startGameCallback();
        else if (name === 'settings' && settingsCallback) settingsCallback();
        else if (name === 'tutorial') this.showingTutorial = true;
        else if (name === 'imprint' && imprintCallback) imprintCallback();
    }
}
