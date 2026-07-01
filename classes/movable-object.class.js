class MovableObject extends DrawableObject{
    speed = 0.15
    otherDiretion = false;
    energy = 100;
    lastHit = 0;
    lastMove = 0;

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

    
    isColliding(mo) {
        return this.x + this.offsetX + (this.width - this.offsetWidth) > mo.x + mo.offsetX &&
            this.y + this.offsetY + (this.height - this.offsetHeight) > mo.y + mo.offsetY &&
            this.x + this.offsetX < mo.x + mo.offsetX + (mo.width - mo.offsetWidth) &&
            this.y + this.offsetY < mo.y + mo.offsetY + (mo.height - mo.offsetHeight)
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

}