class EndScreen {
    gameOverImgWidth = 350;
    gameOverImgHeight = 200;

    winImgWidth = 500;
    winImgHeight = 300;
    buttonWidth = 200;
    buttonHeight = 70;
    gap = 20;

    /** Creates this object. */
    constructor() {
        this.gameOverImg = new Image();
        this.gameOverImg.src = './assets/img/Botones/Tittles/Game Over/Recurso 9.png';

        this.winImg = new Image();
        this.winImg.src = './assets/img/Botones/Tittles/You win/Mesa de trabajo 1.png';

        this.buttonImg = new Image();
        this.buttonImg.src = './assets/img/Botones/Try again/Recurso 15.png';
    }

    /** draw. */
    draw(ctx, type) {
        ctx.save();
        this.drawOverlay(ctx);
        this.drawTitleImage(ctx, type);
        this.drawRetryButton(ctx, type);
        ctx.restore();
    }

    /** draw overlay. */
    drawOverlay(ctx) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }

    /** draw title image. */
    drawTitleImage(ctx, type) {
        const layout = this.getLayout(ctx, type);
        ctx.drawImage(layout.img, layout.imgX, layout.startY, layout.imgWidth, layout.imgHeight);
    }

    /** draw retry button. */
    drawRetryButton(ctx, type) {
        const layout = this.getLayout(ctx, type);
        this.buttonX = (ctx.canvas.width - this.buttonWidth) / 2;
        this.buttonY = layout.startY + layout.imgHeight + this.gap;
        ctx.drawImage(this.buttonImg, this.buttonX, this.buttonY, this.buttonWidth, this.buttonHeight);
    }

    /** get layout. */
    getLayout(ctx, type) {
        const img = type === 'win' ? this.winImg : this.gameOverImg;
        const imgWidth = type === 'win' ? this.winImgWidth : this.gameOverImgWidth;
        const imgHeight = type === 'win' ? this.winImgHeight : this.gameOverImgHeight;
        return this.createLayout(ctx, img, imgWidth, imgHeight);
    }

    /** create layout. */
    createLayout(ctx, img, imgWidth, imgHeight) {
        const totalHeight = imgHeight + this.gap + this.buttonHeight;
        const startY = (ctx.canvas.height - totalHeight) / 2;
        return { img, imgWidth, imgHeight, startY, imgX: (ctx.canvas.width - imgWidth) / 2 };
    }

    /** is button clicked. */
    isButtonClicked(x, y) {
        return x >= this.buttonX && x <= this.buttonX + this.buttonWidth &&
               y >= this.buttonY && y <= this.buttonY + this.buttonHeight;
    }
}
