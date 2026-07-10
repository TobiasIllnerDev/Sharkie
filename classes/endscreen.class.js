class EndScreen {
    imgWidth = 500;
    imgHeight = 300;
    buttonWidth = 200;
    buttonHeight = 70;
    gap = 20;

    constructor() {
        this.gameOverImg = new Image();
        this.gameOverImg.src = '../assets/img/Botones/Tittles/Game Over/Recurso 9.png';

        this.winImg = new Image();
        this.winImg.src = '../assets/img/Botones/Tittles/You win/Mesa de trabajo 1.png';

        this.buttonImg = new Image();
        this.buttonImg.src = '../assets/img/Botones/Try again/Recurso 15.png';
    }

    draw(ctx, type) {
        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        const img = type === 'win' ? this.winImg : this.gameOverImg;

        const totalHeight = this.imgHeight + this.gap + this.buttonHeight;
        const startY = (ctx.canvas.height - totalHeight) / 2;

        const imgX = (ctx.canvas.width - this.imgWidth) / 2;
        const imgY = startY;
        ctx.drawImage(img, imgX, imgY, this.imgWidth, this.imgHeight);

        this.buttonX = (ctx.canvas.width - this.buttonWidth) / 2;
        this.buttonY = startY + this.imgHeight + this.gap;
        ctx.drawImage(this.buttonImg, this.buttonX, this.buttonY, this.buttonWidth, this.buttonHeight);

        ctx.restore();
    }

    isButtonClicked(x, y) {
        return x >= this.buttonX && x <= this.buttonX + this.buttonWidth &&
               y >= this.buttonY && y <= this.buttonY + this.buttonHeight;
    }
}