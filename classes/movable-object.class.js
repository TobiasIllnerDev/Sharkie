class MovableObject extends DrawableObject{
    speed = 0.15
    otherDiretion = false;
    energy = 100;
    lastHit = 0;
    lastMove = 0;
    moveInterval = null;
    animationInterval = null;

    /** move right. */
    moveRight() {
        this.clearMoveInterval();
        this.moveInterval = setInterval(() => {
            if (this.world && this.world.isPaused) {
                return;
            }

            let speedX = 10;
            this.x += speedX;
        }, 1000 / 60);
    }

    /** move left. */
    moveLeft() {
        this.clearMoveInterval();
        this.moveInterval = setInterval(() => {
            if (this.world && this.world.isPaused) {
                return;
            }

            this.x -= this.speed;
        }, 1000 / 60);
    }

    /** clear move interval. */
    clearMoveInterval() {
        if (this.moveInterval) {
            clearInterval(this.moveInterval);
            this.moveInterval = null;
        }
    }

    /** clear animation interval. */
    clearAnimationInterval() {
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
            this.animationInterval = null;
        }
    }

    /** cleanup. */
    cleanup() {
        this.clearMoveInterval();
        this.clearAnimationInterval();
    }
    
    /** play animation. */
    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    /** get collision box. */
    getCollisionBox() {
        const collisionWidth = this.width - this.offsetWidth;
        const collisionHeight = this.height - this.offsetHeight;
        const collisionX = this.otherDiretion
            ? this.width - this.offsetX - collisionWidth
            : this.offsetX;

        return {
            left: this.x + collisionX,
            top: this.y + this.offsetY,
            right: this.x + collisionX + collisionWidth,
            bottom: this.y + this.offsetY + collisionHeight
        };
    }

    /** get object collision box. */
    getObjectCollisionBox(object) {
        if (object.getCollisionBox) {
            return object.getCollisionBox();
        }

        return this.createCollisionBox(object);
    }

    /** create collision box. */
    createCollisionBox(object) {
        const collisionWidth = object.width - object.offsetWidth;
        const collisionHeight = object.height - object.offsetHeight;
        const collisionX = this.getMirroredOffsetX(object, collisionWidth);
        return {
            left: object.x + collisionX,
            top: object.y + object.offsetY,
            right: object.x + collisionX + collisionWidth,
            bottom: object.y + object.offsetY + collisionHeight
        };
    }

    /** get mirrored offset x. */
    getMirroredOffsetX(object, collisionWidth) {
        return object.otherDiretion
            ? object.width - object.offsetX - collisionWidth
            : object.offsetX;
    }

    /** is colliding. */
    isColliding(mo, padding = 0) {
        const ownBox = this.getCollisionBox();
        const otherBox = this.getObjectCollisionBox(mo);

        return ownBox.right + padding > otherBox.left - padding &&
            ownBox.bottom + padding > otherBox.top - padding &&
            ownBox.left - padding < otherBox.right + padding &&
            ownBox.top - padding < otherBox.bottom + padding;
    }


    /** hit. */
    hit(damage = 10){
        this.energy -= damage;
        this.lastHit = new Date().getTime(); 
        if(this.energy < 0 ){
            this.energy = 0;
        }
    }

    /** dont move. */
    dontMove() {
        if(!this.isDead() && !this.isHurt()) {
            this.lastMove = new Date().getTime();
        }
    }

    /** is a f k. */
    isAFK() {
        if(this.lastMove == 0) return false;
        let noMove = new Date().getTime() - this.lastMove;
        noMove = noMove / 1000;
        return noMove > 5;
    }

    /** is hurt. */
    isHurt() {
        let timepassed = new Date().getTime() - this.lastHit;
        timepassed = timepassed / 1000;
        return timepassed < 2;
    }

    /** is dead. */
    isDead() {
        return this.energy <= 0;
    }

}
