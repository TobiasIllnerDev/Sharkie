/**
 * Base class for jelly fish enemies.
 */
class JellyFish extends MovableObject {
    damage = 10;
    height = 55;
    width = 55;
    speed = 0.8 + Math.random() * 0.25;
    energy = 10;
    shouldRemove = false;

    /**
     * Init jelly fish.
     * @param {number} x - Horizontal canvas or world position.
     * @param {number} y - Vertical canvas or world position.
     */
    initJellyFish(x, y) {
        this.loadImage(this.IMAGES_FLOATING[0]);
        this.loadImages(this.IMAGES_FLOATING);
        this.loadImages(this.IMAGES_DEAD);
        this.setPosition(x, y);
        this.setCollisionOffsets();
        this.hasStartedDeadAnimation = false;
        this.animate();
    }

    /**
     * Set position.
     * @param {number} x - Horizontal canvas or world position.
     * @param {number} y - Vertical canvas or world position.
     */
    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }

    /**
     * Set collision offsets.
     */
    setCollisionOffsets() {
        this.offsetHeight = 10;
        this.offsetWidth = 10;
        this.offsetX = 5;
        this.offsetY = 5;
    }

    /**
     * Animate.
     */
    animate() {
        this.moveLeft();
        this.animationInterval = setInterval(() => this.updateAnimation(), 250);
    }

    /**
     * Update animation.
     */
    updateAnimation() {
        if (this.isDead()) return this.playDeadAnimation();
        this.playAnimation(this.IMAGES_FLOATING);
    }

    /**
     * Play dead animation.
     */
    playDeadAnimation() {
        if (!this.hasStartedDeadAnimation) this.startDeadAnimation();
        this.playAnimation(this.IMAGES_DEAD);
        if (this.currentImage >= this.IMAGES_DEAD.length) this.shouldRemove = true;
    }

    /**
     * Start dead animation.
     */
    startDeadAnimation() {
        this.currentImage = 0;
        this.hasStartedDeadAnimation = true;
    }
}
