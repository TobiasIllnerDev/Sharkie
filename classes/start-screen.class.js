class StartScreen {
    backgroundImg;
    arrowKeysImg;
    wasdKeyImg;
    spaceKeyImg;
    eKeyImg;
    buttons = [
        { name: 'start', x: 250, y: 200, width: 220, height: 60, text: 'SPIEL STARTEN' },
        { name: 'settings', x: 250, y: 280, width: 220, height: 60, text: 'EINSTELLUNGEN' },
        { name: 'tutorial', x: 250, y: 360, width: 220, height: 60, text: 'ANLEITUNG' }
    ];
    showingTutorial = false;

    constructor() {
        this.loadImages();
    }

    loadImages() {
        this.backgroundImg = new Image();
        this.backgroundImg.src = './assets/img/Background/underwater.png';

        // 4 Tasten-Bilder laden
        this.arrowKeysImg = new Image();
        this.arrowKeysImg.src = './assets/img/Botones/Key/arrow keys.png';

        this.wasdKeyImg = new Image();
        this.wasdKeyImg.src = './assets/img/Botones/Key/WASD-Key.png';

        this.spaceKeyImg = new Image();
        this.spaceKeyImg.src = './assets/img/Botones/Key/Space Bar key.png';

        this.eKeyImg = new Image();
        this.eKeyImg.src = './assets/img/Botones/Key/E-Key.png';
    }

    // Hilfsfunktion für abgerundete Rechtecke
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
        // 1. Hintergrund
        if (this.backgroundImg.complete && this.backgroundImg.naturalWidth > 0) {
            ctx.drawImage(this.backgroundImg, 0, 0, 720, 480);
        } else {
            ctx.fillStyle = '#0a2e38';
            ctx.fillRect(0, 0, 720, 480);
        }

        // 2. Overlay
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.fillRect(0, 0, 720, 480);

        // 3. Buttons (wenn kein Tutorial aktiv)
        if (!this.showingTutorial) {
            this.buttons.forEach(button => {
                const gradient = ctx.createLinearGradient(button.x, button.y, button.x, button.y + button.height);
                gradient.addColorStop(0, '#1a8fb4');
                gradient.addColorStop(1, '#0e6b86');

                ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
                ctx.shadowBlur = 10;
                ctx.shadowOffsetY = 5;

                this.roundRect(ctx, button.x, button.y, button.width, button.height, 15);
                ctx.fillStyle = gradient;
                ctx.fill();

                ctx.lineWidth = 3;
                ctx.strokeStyle = '#ffffff80';
                ctx.stroke();

                ctx.shadowColor = 'transparent';
                ctx.shadowBlur = 0;
                ctx.shadowOffsetY = 0;

                ctx.font = '24px Luckiest Guy';
                ctx.fillStyle = 'white';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(button.text, button.x + button.width / 2, button.y + button.height / 2);
            });
        }
        // 4. Tutorial mit 4 Tasten-Bildern
        else {
            // Dunkler Hintergrund
            ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
            ctx.fillRect(0, 0, 720, 480);

            // Überschrift
            ctx.font = '48px Luckiest Guy';
            ctx.fillStyle = '#1a8fb4';
            ctx.textAlign = 'center';
            ctx.fillText('STEUERUNG', 360, 80);

            // Bewegung (Pfeiltasten & WASD)
            ctx.font = '28px Luckiest Guy';
            ctx.fillStyle = 'white';
            ctx.fillText('BEWEGUNG', 360, 140);

            const keyWidth = 140;
            const keyHeight = 140;
            const startX = (720 - 2 * keyWidth - 40) / 2;

            // Pfeiltasten
            if (this.arrowKeysImg.complete) {
                ctx.drawImage(this.arrowKeysImg, startX, 160, keyWidth, keyHeight);
            }

            // WASD
            if (this.wasdKeyImg.complete) {
                ctx.drawImage(this.wasdKeyImg, startX + keyWidth + 40, 160, keyWidth, keyHeight);
            }

            // Angriffe
            ctx.font = '28px Luckiest Guy';
            ctx.fillText('ANGRiffe', 360, 320);

            // SPACE (normaler Angriff)
            if (this.spaceKeyImg.complete) {
                ctx.drawImage(this.spaceKeyImg, startX, 340, keyWidth, keyHeight);
            }

            // Text unter SPACE
            ctx.font = '20px Luckiest Guy';
            ctx.fillText('Normaler Angriff', startX + keyWidth/2, 490);

            // E (Spezialangriff)
            if (this.eKeyImg.complete) {
                ctx.drawImage(this.eKeyImg, startX + keyWidth + 40, 340, keyWidth, keyHeight);
            }

            // Text unter E
            ctx.fillText('Spezial Angriff', startX + keyWidth + 40 + keyWidth/2, 490);

            // Schließen-Button
            ctx.fillStyle = '#ff4444';
            this.roundRect(ctx, 300, 440, 120, 40, 10);
            ctx.fill();

            ctx.lineWidth = 2;
            ctx.strokeStyle = 'white';
            ctx.stroke();

            ctx.font = '20px Luckiest Guy';
            ctx.fillStyle = 'white';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('SCHLIESSEN', 360, 460);
        }
    }

    checkClick(x, y, startGameCallback, settingsCallback) {
        if (this.showingTutorial) {
            // Schließen-Button im Tutorial
            if (x >= 300 && x <= 420 && y >= 440 && y <= 480) {
                this.showingTutorial = false;
                return;
            }
            return;
        }

        // Normale Buttons
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
                }
            }
        }
    }
}