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

     loadImage(path) {
        if (window.sharkieImageCache && window.sharkieImageCache[path]) {
            this.img = window.sharkieImageCache[path];
            return;
        }

        this.img = new Image();
        this.img.src = path;
    }

    draw(ctx) {
        ctx.drawImage(this.img, this.x , this.y, this.width, this.height);
    }

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

    draw(ctx) {
        if (this.img && this.img.complete && this.img.naturalWidth > 0) {
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        }
    }

    drawFrame(ctx) {
    if(this instanceof JellyFish || this instanceof Endboss) {
        const collisionWidth = this.width - this.offsetWidth;
        const collisionX = this.otherDiretion
            ? this.width - this.offsetX - collisionWidth
            : this.offsetX;
        ctx.beginPath();
        ctx.lineWidth = '3';
        ctx.strokeStyle = 'blue';
        ctx.rect(
            this.x + collisionX,
            this.y + this.offsetY,
            collisionWidth,
            this.height - this.offsetHeight
        );
        ctx.stroke();
    }
}

    drawFrameCharater(ctx) {
    if(this instanceof Character) {
        const collisionWidth = this.width - this.offsetWidth;
        const collisionX = this.otherDiretion
            ? this.width - this.offsetX - collisionWidth
            : this.offsetX;
        ctx.beginPath();
        ctx.lineWidth = '3';
        ctx.strokeStyle = 'red';
        ctx.rect(this.x + collisionX, this.y + this.offsetY, collisionWidth, this.height - this.offsetHeight);
        ctx.stroke();
    }
    else if(this instanceof Endboss) {
        ctx.beginPath();
        ctx.lineWidth = '3';
        ctx.strokeStyle = 'purple';
        ctx.rect(
            this.x + this.offsetX,
            this.y + this.offsetY,
            this.width - this.offsetWidth,
            this.height - this.offsetHeight
        );
        ctx.stroke();
    }
}
}
