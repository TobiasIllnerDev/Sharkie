class StartScreen {
    backgroundImg;
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

        this.buttons.forEach(button => {
            const gradient = ctx.createLinearGradient(button.x, button.y, button.x, button.y + button.height);
            gradient.addColorStop(0, '#1a8fb4');
            gradient.addColorStop(1, '#0e6b86');

            ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
            ctx.shadowBlur = 10;
            ctx.shadowOffsetY = 5;

            ctx.beginPath();
            ctx.roundRect(button.x, button.y, button.width, button.height, 15);
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

    checkClick(x, y, startGameCallback, settingsCallback) {
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
                    this.showingTutorial = !this.showingTutorial;
                    return;
                }
            }
        }
    }
}