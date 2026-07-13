/**
 * Represents one scrolling background image in the level.
 */
class BackgroundObject extends MovableObject {
width = 720;
height = 480;

    /**
     * Creates a new instance.
     * @param {string} imagePath - Background image path.
     * @param {number} x - Horizontal canvas or world position.
     */
    constructor(imagePath, x) {
        super().loadImage(imagePath);
        this.x = x
        this.y = 480 - this.height;
    }
}