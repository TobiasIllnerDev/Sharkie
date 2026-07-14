/**
 * Draws the win and game over screens.
 */
class EndScreen {
    gameOverImgWidth = 350;
    gameOverImgHeight = 200;

    winImgWidth = 500;
    winImgHeight = 300;
    buttonWidth = 200;
    buttonHeight = 70;
    menuButtonHeight = 70;
    gap = 20;
    buttonGap = 12;

    /**
     * Creates a new instance.
     */
    constructor() {
        this.gameOverImg = new Image();
        this.gameOverImg.src = './assets/img/Botones/Tittles/Game Over/Recurso 9.png';

        this.winImg = new Image();
        this.winImg.src = './assets/img/Botones/Tittles/You win/Mesa de trabajo 1.png';

        this.buttonImg = new Image();
        this.buttonImg.src = './assets/img/Botones/Try again/Recurso 15.png';
    }

    /**
     * Draws the object.
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context.
     * @param {string} type - End screen type.
     */
    draw(ctx, type) {
        ctx.save();
        this.drawOverlay(ctx);
        this.drawTitleImage(ctx, type);
        this.drawRetryButton(ctx, type);
        this.drawMenuButton(ctx);
        ctx.restore();
    }

    /**
     * Draw overlay.
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context.
     */
    drawOverlay(ctx) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }

    /**
     * Draw title image.
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context.
     * @param {string} type - End screen type.
     */
    drawTitleImage(ctx, type) {
        const layout = this.getLayout(ctx, type);
        ctx.drawImage(layout.img, layout.imgX, layout.startY, layout.imgWidth, layout.imgHeight);
    }

    /**
     * Draw retry button.
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context.
     * @param {string} type - End screen type.
     */
    drawRetryButton(ctx, type) {
        const layout = this.getLayout(ctx, type);
        this.buttonX = (ctx.canvas.width - this.buttonWidth) / 2;
        this.buttonY = layout.startY + layout.imgHeight + this.gap;
        ctx.drawImage(this.buttonImg, this.buttonX, this.buttonY, this.buttonWidth, this.buttonHeight);
    }

    /**
     * Draws the menu button on the end screen.
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context.
     */
    drawMenuButton(ctx) {
        this.menuButtonX = (ctx.canvas.width - this.buttonWidth) / 2;
        this.menuButtonY = this.buttonY + this.buttonHeight + this.buttonGap;
        this.drawTextButton(ctx, this.menuButtonX, this.menuButtonY, this.buttonWidth, this.menuButtonHeight, 'MENU');
    }

    /**
     * Draws a canvas text button.
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context.
     * @param {number} x - Horizontal canvas position.
     * @param {number} y - Vertical canvas position.
     * @param {number} width - Button width in pixels.
     * @param {number} height - Button height in pixels.
     * @param {string} text - Button label.
     */
    drawTextButton(ctx, x, y, width, height, text) {
        this.roundRect(ctx, x, y, width, height, 14);
        ctx.fillStyle = '#f8f40b';
        ctx.fill();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = '#601d7c';
        ctx.font = '30px Luckiest Guy';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, x + width / 2, y + height / 2);
    }

    /**
     * Get layout.
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context.
     * @param {string} type - End screen type.
     * @returns {Object} Calculated layout or data object.
     */
    getLayout(ctx, type) {
        const img = type === 'win' ? this.winImg : this.gameOverImg;
        const imgWidth = type === 'win' ? this.winImgWidth : this.gameOverImgWidth;
        const imgHeight = type === 'win' ? this.winImgHeight : this.gameOverImgHeight;
        return this.createLayout(ctx, img, imgWidth, imgHeight, type);
    }

    /**
     * Create layout.
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context.
     * @param {HTMLImageElement} img - Image to draw.
     * @param {number} imgWidth - Image width in pixels.
     * @param {number} imgHeight - Image height in pixels.
     * @param {string} type - End screen type.
     * @returns {Object} Calculated data object.
     */
    createLayout(ctx, img, imgWidth, imgHeight, type) {
        const totalHeight = imgHeight + this.gap + this.getButtonAreaHeight(type);
        const startY = (ctx.canvas.height - totalHeight) / 2;
        return { img, imgWidth, imgHeight, startY, imgX: (ctx.canvas.width - imgWidth) / 2 };
    }

    /**
     * Returns the total height used by end screen buttons.
     * @param {string} type - End screen type.
     * @returns {number} Button area height in pixels.
     */
    getButtonAreaHeight(type) {
        return this.buttonHeight + this.buttonGap + this.menuButtonHeight;
    }

    /**
     * Returns the clicked end screen action.
     * @param {number} x - Horizontal canvas or world position.
     * @param {number} y - Vertical canvas or world position.
     * @param {string} type - End screen type.
     * @returns {string|null} Clicked action, or null when no button was hit.
     */
    getClickedAction(x, y, type) {
        if (this.isInsideButton(x, y, this.buttonX, this.buttonY, this.buttonWidth, this.buttonHeight)) return 'restart';
        if (this.isInsideButton(x, y, this.menuButtonX, this.menuButtonY, this.buttonWidth, this.menuButtonHeight)) return 'menu';
        return null;
    }

    /**
     * Checks whether a position is inside a button rectangle.
     * @param {number} x - Horizontal canvas position.
     * @param {number} y - Vertical canvas position.
     * @param {number} buttonX - Button horizontal position.
     * @param {number} buttonY - Button vertical position.
     * @param {number} buttonWidth - Button width in pixels.
     * @param {number} buttonHeight - Button height in pixels.
     * @returns {boolean} True when the position is inside the button.
     */
    isInsideButton(x, y, buttonX, buttonY, buttonWidth, buttonHeight) {
        return x >= buttonX && x <= buttonX + buttonWidth &&
               y >= buttonY && y <= buttonY + buttonHeight;
    }

    /**
     * Draws a rounded rectangle path.
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context.
     * @param {number} x - Horizontal canvas position.
     * @param {number} y - Vertical canvas position.
     * @param {number} width - Width in pixels.
     * @param {number} height - Height in pixels.
     * @param {number} radius - Corner radius in pixels.
     */
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
}
