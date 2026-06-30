class MovableObject {
    x = 120;
    y = 100;
    height = 200;
    width = 300;
    img;
    imageCache = [];
    currentImage = 0;
    speed = 0.15
    otherDiretion = false;

    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    loadImages(arr) {
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        })
    }

    moveRight() {
        console.log('Moving right')
    }

    moveLeft() {
        setInterval(() => {
            this.x -= this.speed;
        }, 1000 / 60);
    }

    playAnimation(images) {
        let i = this.currentImage % images.length;
                let path = images[i];
                this.img = this.imageCache[path];
                this.currentImage ++;
    }

    draw(ctx) {
        ctx.drawImage(this.img, this.x , this.y, this.width, this.height);
    }

    drawFrame(ctx) {
        ctx.beginPath();
        ctx.lineWidth = '10';
        ctx.strokeStyle = 'blue';
        ctx.rect(this.x , this.y, this.width, this.height);
        ctx.stroke(); 
    }
}