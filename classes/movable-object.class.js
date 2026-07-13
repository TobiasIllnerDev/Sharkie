/**
 * Base class for drawable objects that move or collide.
 */
class MovableObject extends DrawableObject{
    speed = 0.15
    otherDiretion = false;
    energy = 100;
    lastHit = 0;
    lastMove = 0;
    moveInterval = null;
    animationInterval = null;

    /**
     * Starts moving to the right.
     */
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

    /**
     * Starts moving to the left.
     */
    moveLeft() {
        this.clearMoveInterval();
        this.moveInterval = setInterval(() => {
            if (this.world && this.world.isPaused) {
                return;
            }

            this.x -= this.speed;
        }, 1000 / 60);
    }

    /**
     * Clears the movement interval.
     */
    clearMoveInterval() {
        if (this.moveInterval) {
            clearInterval(this.moveInterval);
            this.moveInterval = null;
        }
    }

    /**
     * Clears the animation interval.
     */
    clearAnimationInterval() {
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
            this.animationInterval = null;
        }
    }

    /**
     * Cleans up timers and resources.
     */
    cleanup() {
        this.clearMoveInterval();
        this.clearAnimationInterval();
    }
    
    /**
     * Plays an animation sequence.
     * @param {string[]} images - Animation image paths.
     */
    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    /**
     * Returns the collision box.
     * @returns {Object} Calculated layout or data object.
     */
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

    /**
     * Returns another object collision box.
     * @param {DrawableObject} object - Object to inspect.
     * @returns {Object} Calculated layout or data object.
     */
    getObjectCollisionBox(object) {
        if (object.getCollisionBox) {
            return object.getCollisionBox();
        }

        return this.createCollisionBox(object);
    }

    /**
     * Creates a collision box for an object.
     * @param {DrawableObject} object - Object to inspect.
     * @returns {Object} Created collision box.
     */
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

    /**
     * Returns the horizontal offset for mirrored objects.
     * @param {DrawableObject} object - Object to inspect.
     * @param {number} collisionWidth - Collision box width.
     * @returns {number} Horizontal collision offset.
     */
    getMirroredOffsetX(object, collisionWidth) {
        return object.otherDiretion
            ? object.width - object.offsetX - collisionWidth
            : object.offsetX;
    }

    /**
     * Checks whether this object collides with another object.
     * @param {MovableObject} mo - Other movable object.
     * @param {number} padding - Additional collision padding.
     * @returns {boolean} True when the condition is met.
     */
    isColliding(mo, padding = 0) {
        const ownBox = this.getCollisionBox();
        const otherBox = this.getObjectCollisionBox(mo);

        return ownBox.right + padding > otherBox.left - padding &&
            ownBox.bottom + padding > otherBox.top - padding &&
            ownBox.left - padding < otherBox.right + padding &&
            ownBox.top - padding < otherBox.bottom + padding;
    }


    /**
     * Applies damage.
     * @param {number} damage - Damage amount.
     */
    hit(damage = 10) {
        this.energy -= damage;
        this.lastHit = new Date().getTime(); 
        if(this.energy < 0 ){
            this.energy = 0;
        }
    }

    /**
     * Marks the object as recently active.
     */
    dontMove() {
        if(!this.isDead() && !this.isHurt()) {
            this.lastMove = new Date().getTime();
        }
    }

    /**
     * Checks whether the object has been idle for a while.
     * @returns {boolean} True when the condition is met.
     */
    isAFK() {
        if(this.lastMove == 0) return false;
        let noMove = new Date().getTime() - this.lastMove;
        noMove = noMove / 1000;
        return noMove > 5;
    }

    /**
     * Checks whether the object is currently hurt.
     * @returns {boolean} True when the condition is met.
     */
    isHurt() {
        let timepassed = new Date().getTime() - this.lastHit;
        timepassed = timepassed / 1000;
        return timepassed < 2;
    }

    /**
     * Checks whether the object is dead.
     * @returns {boolean} True when the condition is met.
     */
    isDead() {
        return this.energy <= 0;
    }

}
