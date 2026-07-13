/**
 * Base class for objects that can be drawn on the canvas.
 */
class DrawableObject {
    img;
    imageCache = [];
    currentImage = 0;
    x = 120;
    y = 100;
    height;
    width;
    offsetX = 0;
    offsetY = 0;
    offsetWidth = 0;
    offsetHeight = 0;

     /**
      * Loads one image.
      * @param {string} path - Image or asset path.
      */
     loadImage(path) {
        if (window.sharkieImageCache && window.sharkieImageCache[path]) {
            this.img = window.sharkieImageCache[path];
            return;
        }

        this.img = new Image();
        this.img.src = path;
    }

    /**
     * Loads multiple images.
     * @param {string[]} arr - Image paths to load.
     */
    loadImages(arr) {
        arr.forEach((path) => {
            if (window.sharkieImageCache && window.sharkieImageCache[path]) {
                this.imageCache[path] = window.sharkieImageCache[path];
            } else {
                let img = new Image();
                img.src = path;
                this.imageCache[path] = img;
            }
        })
    }

    /**
     * Draws the object.
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context.
     */
    draw(ctx) {
        if (this.img && this.img.complete && this.img.naturalWidth > 0) {
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        }
    }

    /**
     * Draws the debug frame.
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context.
     */
    drawFrame(ctx) {
        if (this instanceof JellyFish || this instanceof Endboss) {
            this.drawCollisionFrame(ctx, 'blue');
        }
    }

    /**
     * Draws the character debug frame.
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context.
     */
    drawFrameCharater(ctx) {
        if (this instanceof Character) {
            this.drawCollisionFrame(ctx, 'red');
        } else if (this instanceof Endboss) {
            this.drawCollisionFrame(ctx, 'purple');
        }
    }

    /**
     * Draws the collision debug frame.
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context.
     * @param {string} color - Stroke color.
     */
    drawCollisionFrame(ctx, color) {
        const box = this.getDebugCollisionBox();
        ctx.beginPath();
        ctx.lineWidth = '3';
        ctx.strokeStyle = color;
        ctx.rect(box.x, box.y, box.width, box.height);
        ctx.stroke();
    }

    /**
     * Returns the debug collision box.
     * @returns {Object} Calculated layout or data object.
     */
    getDebugCollisionBox() {
        const width = this.width - this.offsetWidth;
        const x = this.otherDiretion ? this.width - this.offsetX - width : this.offsetX;
        return {
            x: this.x + x,
            y: this.y + this.offsetY,
            width,
            height: this.height - this.offsetHeight
        };
    }
}
