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

     /** load image. */
     loadImage(path) {
        if (window.sharkieImageCache && window.sharkieImageCache[path]) {
            this.img = window.sharkieImageCache[path];
            return;
        }

        this.img = new Image();
        this.img.src = path;
    }

    /** load images. */
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

    /** draw. */
    draw(ctx) {
        if (this.img && this.img.complete && this.img.naturalWidth > 0) {
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        }
    }

    /** draw frame. */
    drawFrame(ctx) {
        if (this instanceof JellyFish || this instanceof Endboss) {
            this.drawCollisionFrame(ctx, 'blue');
        }
    }

    /** draw frame charater. */
    drawFrameCharater(ctx) {
        if (this instanceof Character) {
            this.drawCollisionFrame(ctx, 'red');
        } else if (this instanceof Endboss) {
            this.drawCollisionFrame(ctx, 'purple');
        }
    }

    /** draw collision frame. */
    drawCollisionFrame(ctx, color) {
        const box = this.getDebugCollisionBox();
        ctx.beginPath();
        ctx.lineWidth = '3';
        ctx.strokeStyle = color;
        ctx.rect(box.x, box.y, box.width, box.height);
        ctx.stroke();
    }

    /** get debug collision box. */
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
