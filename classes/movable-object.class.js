class MovableObject {
    x = 120;
    y = 100;
    height;
    width;
    img;
    imageCache = [];
    currentImage = 0;
    speed = 0.15
    otherDiretion = false;
    energy = 100;
    lastHit = 0;
    lastMove = 0;

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

    isColliding(mo){
        return this.x + this.width > mo.x &&
            this.y + this.height > mo.y &&
            this.x < mo.x &&
            this.y < mo.y + mo.height
    }

    draw(ctx) {
        ctx.drawImage(this.img, this.x , this.y, this.width, this.height);
    }

    hit(){        
        this.energy -= 10;
        if(this.energy < 0 ){
            this.energy = 0;
        } else {
            this.lastHit = new Date().getTime();
        }
    }

    dontMove() {
        if(!this.isDead() && !this.isHurt()) {
            this.lastMove = new Date().getTime();
        }
    }

    isAFK() {
        if(this.lastMove == 0) return false;
        let noMove = new Date().getTime() - this.lastMove;
        noMove = noMove / 1000;
        return noMove > 5;
    }

    isHurt() {
        let timepassed = new Date().getTime() - this.lastHit;
        timepassed = timepassed / 1000;
        return timepassed < 2;
    }

    isDead() {
        return this.energy == 0;
    }

    drawFrame(ctx) {
        if(this instanceof Character || this instanceof JellyFish || this instanceof Endboss) {
            ctx.beginPath();
            ctx.lineWidth = '3';
            ctx.strokeStyle = 'blue';
            ctx.rect(this.x , this.y, this.width, this.height);
            ctx.stroke(); 
        } 
    }

}