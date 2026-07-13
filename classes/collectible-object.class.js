/**
 * Base class for animated collectible objects.
 */
class CollectibleObject extends DrawableObject {
    collected = false;
    offsetX = 0;
    offsetY = 0;
    offsetWidth = 0;
    offsetHeight = 0;
    currentImage = 0;
    animationInterval = null;

    /**
     * Creates a new instance.
     * @param {string[]} paths - Image paths used by the object.
     * @param {number} x - Horizontal canvas or world position.
     * @param {number} y - Vertical canvas or world position.
     * @param {number} width - Width in pixels.
     * @param {number} height - Height in pixels.
     */
    constructor(paths,x,y,width,height) {
        super()
        this.images = paths;
        this.loadImages(paths);
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.animate();

    }

    /**
     * Animate.
     */
    animate() {
        this.animationInterval = setInterval(() => {
            this.playAnimation(this.images);
        }, 200);
    }

    /**
     * Cleans up timers and resources.
     */
    cleanup() {
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
            this.animationInterval = null;
        }
    }

    /**
     * Plays an animation sequence.
     * @param {string[]} images - Animation image paths.
     */
    playAnimation(images) {
        if (!images || images.length === 0) return; 
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }
    
    /**
     * Collect.
     */
    collect() {
        this.collected = true;
    }

    /**
     * Checks whether this object collides with another object.
     * @param {MovableObject} mo - Other movable object.
     * @returns {boolean} True when the condition is met.
     */
    isColliding(mo) {
        return this.x + this.offsetX + (this.width - this.offsetWidth) > mo.x + mo.offsetX &&
            this.y + this.offsetY + (this.height - this.offsetHeight) > mo.y + mo.offsetY &&
            this.x + this.offsetX < mo.x + mo.offsetX + (mo.width - mo.offsetWidth) &&
            this.y + this.offsetY < mo.y + mo.offsetY + (mo.height - mo.offsetHeight);
    }
}
