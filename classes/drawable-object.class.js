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
        this.img = new Image();
        this.img.src = path;
    }

    draw(ctx) {
        ctx.drawImage(this.img, this.x , this.y, this.width, this.height);
    }

    loadImages(arr) {
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        })
    }

    drawFrame(ctx) {
        if(this instanceof JellyFish || this instanceof Endboss) {
            ctx.beginPath();
            ctx.lineWidth = '3';
            ctx.strokeStyle = 'blue';
            ctx.rect(this.x , this.y, this.width, this.height);
            ctx.stroke(); 
        } 
    }

    drawFrameCharater(ctx) {
        if(this instanceof Character) {
            ctx.beginPath();
            ctx.lineWidth = '3';
            ctx.strokeStyle = 'red';
            ctx.rect(this.x + 40 , this.y + 90, this.width -75, this.height -120);
            ctx.stroke(); 
        } 
    }
}