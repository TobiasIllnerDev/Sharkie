class StartScreen {
    backgroundImg;
    arrowKeysImg;
    wasdKeyImg;
    spaceKeyImg;
    eKeyImg;
    startButtonImg;
    settingsButtonImg;
    tutorialButtonImg;
    fullscreenButtonImg;
    buttons = [
        { name: 'start', x: 270, y: 150, width: 180, height: 50 },
        { name: 'settings', x: 270, y: 215, width: 180, height: 50 },
        { name: 'tutorial', x: 270, y: 280, width: 180, height: 50 },
        { name: 'fullscreen', x: 270, y: 345, width: 180, height: 50 }
    ];
    showingTutorial = false;
    activeOverlay = null;
    volume = 0.5;
    isVolumeDragging = false;
    volumeChangeCallback = null;

    constructor() {
        this.volume = typeof savedVolume !== 'undefined' ? savedVolume : 0.5;
        this.loadImages();
    }

    loadImages() {
        this.backgroundImg = new Image();
        this.backgroundImg.src = './assets/img/Background/underwater.png';

        this.arrowKeysImg = new Image();
        this.arrowKeysImg.src = './assets/img/Botones/Key/arrow keys.png';

        this.wasdKeyImg = new Image();
        this.wasdKeyImg.src = './assets/img/Botones/Key/WASD-Key.png';

        this.spaceKeyImg = new Image();
        this.spaceKeyImg.src = './assets/img/Botones/Key/Space Bar key.png';

        this.eKeyImg = new Image();
        this.eKeyImg.src = './assets/img/Botones/Key/E-Key.png';

        this.startButtonImg = new Image();
        this.startButtonImg.src = './assets/img/Botones/Start/Start-button.png';

        this.settingsButtonImg = new Image();
        this.settingsButtonImg.src = './assets/img/Botones/Start/Einstellung-button.png';

        this.tutorialButtonImg = new Image();
        this.tutorialButtonImg.src = './assets/img/Botones/Start/Anleitung-button.png';

        this.fullscreenButtonImg = new Image();
        this.fullscreenButtonImg.src = './assets/img/Botones/Start/Fullscreen-button.png';
    }

    setVolume(value) {
        this.volume = Math.min(1, Math.max(0, value));
        if (this.volumeChangeCallback) {
            this.volumeChangeCallback(this.volume);
        }
    }

    openSettings() {
        this.activeOverlay = 'settings';
    }

    openImprint() {
        this.activeOverlay = 'imprint';
    }

    closeOverlay() {
        this.activeOverlay = null;
    }

    startVolumeDrag(x) {
        if (this.activeOverlay === 'settings') {
            this.isVolumeDragging = true;
            this.updateVolumeFromX(x);
        }
    }

    updateVolumeFromX(x) {
        if (this.activeOverlay === 'settings') {
            const sliderX = 200;
            const sliderWidth = 320;
            const value = (x - sliderX) / sliderWidth;
            this.setVolume(value);
        }
    }

    stopVolumeDrag() {
        this.isVolumeDragging = false;
    }

    roundRect(ctx, x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
    }

    draw(ctx) {
        if (this.backgroundImg.complete && this.backgroundImg.naturalWidth > 0) {
            ctx.drawImage(this.backgroundImg, 0, 0, 720, 480);
        } else {
            ctx.fillStyle = '#0a2e38';
            ctx.fillRect(0, 0, 720, 480);
        }

        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.fillRect(0, 0, 720, 480);

        if (this.activeOverlay) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(0, 0, 720, 480);

            this.roundRect(ctx, 150, 90, 420, 300, 20);
            ctx.fillStyle = '#0f3f56';
            ctx.fill();
            ctx.lineWidth = 2;
            ctx.strokeStyle = 'white';
            ctx.stroke();

            ctx.font = '36px Luckiest Guy';
            ctx.fillStyle = '#1a8fb4';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            if (this.activeOverlay === 'settings') {
                ctx.fillText('EINSTELLUNGEN', 360, 140);

                ctx.font = '24px Luckiest Guy';
                ctx.fillStyle = 'white';
                ctx.fillText('Lautstärke', 360, 195);

                const sliderX = 200;
                const sliderY = 225;
                const sliderWidth = 320;
                const sliderHeight = 12;

                ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
                ctx.fillRect(sliderX, sliderY, sliderWidth, sliderHeight);
                ctx.fillStyle = '#1a8fb4';
                ctx.fillRect(sliderX, sliderY, sliderWidth * this.volume, sliderHeight);
                ctx.fillStyle = 'white';
                ctx.beginPath();
                ctx.arc(sliderX + sliderWidth * this.volume, sliderY + sliderHeight / 2, 8, 0, Math.PI * 2);
                ctx.fill();

                this.roundRect(ctx, 240, 290, 240, 44, 12);
                ctx.fillStyle = '#1a8fb4';
                ctx.fill();

                this.roundRect(ctx, 240, 348, 240, 44, 12);
                ctx.fillStyle = '#ff4444';
                ctx.fill();

                ctx.fillStyle = 'white';
                ctx.font = '22px Luckiest Guy';
                ctx.fillText('Impressum', 360, 312);
                ctx.fillText('Schließen', 360, 370);
            } else {
                ctx.fillText('IMPRESSUM', 360, 140);

                ctx.font = '22px Luckiest Guy';
                ctx.fillStyle = 'white';
                ctx.fillText('Sharkie', 360, 200);
                ctx.fillText('Ein kleines 2D-Actionspiel', 360, 232);
                ctx.fillText('mit Pixel-Art-Charakteren.', 360, 264);

                this.roundRect(ctx, 240, 348, 240, 44, 12);
                ctx.fillStyle = '#ff4444';
                ctx.fill();

                ctx.fillStyle = 'white';
                ctx.font = '22px Luckiest Guy';
                ctx.fillText('Schließen', 360, 370);
            }

            return;
        }

        if (!this.showingTutorial) {
            const allImagesLoaded = this.startButtonImg.complete && this.settingsButtonImg.complete &&
                                    this.tutorialButtonImg.complete && this.fullscreenButtonImg.complete &&
                                    this.arrowKeysImg.complete && this.wasdKeyImg.complete &&
                                    this.spaceKeyImg.complete && this.eKeyImg.complete;

            if (!allImagesLoaded) {
                ctx.font = '32px Luckiest Guy';
                ctx.fillStyle = 'white';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('Lädt...', 360, 240);
                return;
            }

            this.buttons.forEach(button => {
                ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
                ctx.shadowBlur = 10;
                ctx.shadowOffsetY = 5;

                let buttonImg;
                if (button.name === 'start') buttonImg = this.startButtonImg;
                else if (button.name === 'settings') buttonImg = this.settingsButtonImg;
                else if (button.name === 'tutorial') buttonImg = this.tutorialButtonImg;
                else if (button.name === 'fullscreen') buttonImg = this.fullscreenButtonImg;

                if (buttonImg && buttonImg.complete) {
                    ctx.drawImage(buttonImg, button.x, button.y, button.width, button.height);
                }

                ctx.shadowColor = 'transparent';
                ctx.shadowBlur = 0;
                ctx.shadowOffsetY = 0;
            });
        } else {
            ctx.fillStyle = 'rgba(0, 0, 30, 0.6)';
            ctx.fillRect(0, 0, 720, 480);

            ctx.font = '48px Luckiest Guy';
            ctx.fillStyle = '#1a8fb4';
            ctx.textAlign = 'center';
            ctx.fillText('STEUERUNG', 360, 80);

            ctx.font = '28px Luckiest Guy';
            ctx.fillStyle = 'white';
            ctx.fillText('Bewegung', 360, 130);

            const scale1 = 0.35;
            const wasdScale = 0.18;
            const eScale = 0.10;

            if (this.arrowKeysImg.complete) {
                ctx.drawImage(this.arrowKeysImg, 120, 150, this.arrowKeysImg.naturalWidth * scale1, this.arrowKeysImg.naturalHeight * scale1);
            }
            if (this.wasdKeyImg.complete) {
                ctx.drawImage(this.wasdKeyImg, 400, 100, this.wasdKeyImg.naturalWidth * wasdScale, this.wasdKeyImg.naturalHeight * wasdScale);
            }

            ctx.fillText('Angriff', 360, 270);

            if (this.spaceKeyImg.complete) {
                ctx.drawImage(this.spaceKeyImg, 120, 290, this.spaceKeyImg.naturalWidth * scale1, this.spaceKeyImg.naturalHeight * scale1);
            }
            if (this.eKeyImg.complete) {
                ctx.drawImage(this.eKeyImg, 440, 270, this.eKeyImg.naturalWidth * eScale, this.eKeyImg.naturalHeight * eScale);
            }

            ctx.font = '24px Luckiest Guy';
            ctx.fillText('Normaler Angriff', 120 + (this.spaceKeyImg.naturalWidth * scale1) / 2, 390);
            ctx.fillText('Spezialangriff', 440 + (this.eKeyImg.naturalWidth * eScale) / 2, 390);

            ctx.fillStyle = '#ff4444';
            this.roundRect(ctx, 300, 410, 120, 40, 10);
            ctx.fill();

            ctx.lineWidth = 2;
            ctx.strokeStyle = 'white';
            ctx.stroke();

            ctx.font = '20px Luckiest Guy';
            ctx.fillStyle = 'white';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('SCHLIESSEN', 360, 430);
        }
    }

    checkClick(x, y, startGameCallback, settingsCallback, imprintCallback, fullscreenCallback, closeOverlayCallback, setVolumeCallback) {
        if (this.activeOverlay) {
            if (this.activeOverlay === 'settings') {
                const sliderX = 200;
                const sliderY = 225;
                const sliderWidth = 320;
                const sliderHeight = 12;
                if (x >= sliderX && x <= sliderX + sliderWidth && y >= sliderY - 20 && y <= sliderY + sliderHeight + 20) {
                    this.updateVolumeFromX(x);
                    if (setVolumeCallback) {
                        setVolumeCallback(this.volume);
                    }
                    return;
                }
                if (x >= 240 && x <= 480 && y >= 290 && y <= 334) {
                    if (imprintCallback) {
                        imprintCallback();
                    }
                    return;
                }
                if (x >= 240 && x <= 480 && y >= 348 && y <= 392) {
                    if (closeOverlayCallback) {
                        closeOverlayCallback();
                    }
                    return;
                }
            } else if (x >= 240 && x <= 480 && y >= 348 && y <= 392) {
                if (closeOverlayCallback) {
                    closeOverlayCallback();
                }
                return;
            }
            return;
        }

        if (this.showingTutorial) {
            if (x >= 300 && x <= 420 && y >= 410 && y <= 450) {
                this.showingTutorial = false;
                return;
            }
            return;
        }

        for (const button of this.buttons) {
            if (x >= button.x && x <= button.x + button.width &&
                y >= button.y && y <= button.y + button.height) {
                if (button.name === 'start' && startGameCallback) {
                    startGameCallback();
                    return;
                } else if (button.name === 'settings' && settingsCallback) {
                    settingsCallback();
                    return;
                } else if (button.name === 'tutorial') {
                    this.showingTutorial = true;
                    return;
                } else if (button.name === 'fullscreen' && fullscreenCallback) {
                    fullscreenCallback();
                    return;
                }
            }
        }
    }
}