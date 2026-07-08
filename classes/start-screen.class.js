class StartScreen {
    backgroundImg;
    arrowKeysImg;
    wasdKeyImg;
    spaceKeyImg;
    eKeyImg;
    buttons = [
        { name: 'start', x: 270, y: 200, width: 180, height: 50, text: 'SPIEL STARTEN' },
        { name: 'settings', x: 270, y: 265, width: 180, height: 50, text: 'EINSTELLUNGEN' },
        { name: 'tutorial', x: 270, y: 330, width: 180, height: 50, text: 'ANLEITUNG' }
    ];
    showingTutorial = false;

    constructor() {
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

                ctx.font = '20px Luckiest Guy';
                ctx.fillStyle = 'white';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(button.text, button.x + button.width / 2, button.y + button.height / 2);
            });
        }
        else {
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

    checkClick(x, y, startGameCallback, settingsCallback) {
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
                }
            }
        }
    }
}