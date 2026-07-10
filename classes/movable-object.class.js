class MovableObject extends DrawableObject{
    speed = 0.15
    otherDiretion = false;
    energy = 100;
    lastHit = 0;
    lastMove = 0;
    moveInterval = null;
    animationInterval = null;

    moveRight() {
        this.clearMoveInterval();
        this.moveInterval = setInterval(() => {
            let speedX = 10;
            this.x += speedX;
        }, 1000 / 60);
    }

    moveLeft() {
        this.clearMoveInterval();
        this.moveInterval = setInterval(() => {
            this.x -= this.speed;
        }, 1000 / 60);
    }

    clearMoveInterval() {
        if (this.moveInterval) {
            clearInterval(this.moveInterval);
            this.moveInterval = null;
        }
    }

    clearAnimationInterval() {
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
            this.animationInterval = null;
        }
    }

    cleanup() {
        this.clearMoveInterval();
        this.clearAnimationInterval();
    }
    
    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }
    
    isColliding(mo, padding = 0) {
        return this.x + this.offsetX + (this.width - this.offsetWidth) + padding > mo.x + mo.offsetX - padding &&
            this.y + this.offsetY + (this.height - this.offsetHeight) + padding > mo.y + mo.offsetY - padding &&
            this.x + this.offsetX - padding < mo.x + mo.offsetX + (mo.width - mo.offsetWidth) + padding &&
            this.y + this.offsetY - padding < mo.y + mo.offsetY + (mo.height - mo.offsetHeight) + padding
    }


    hit(damage = 10){
        this.energy -= damage;
        this.lastHit = new Date().getTime(); 
        if(this.energy < 0 ){
            this.energy = 0;
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
        return this.energy <= 0;
    }

}
