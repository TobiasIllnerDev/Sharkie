/**
 * Represents a stronger throwable bubble.
 */
class SpecialBubble extends ThrowableObject {

    /**
     * Creates a new instance.
     * @param {number} x - Horizontal canvas or world position.
     * @param {number} y - Vertical canvas or world position.
     * @param {boolean} otherDirection - Whether the projectile faces left.
     * @param {World} world - World instance.
     */
    constructor(x, y, otherDirection, world) {
        super(x, y, otherDirection, world);
        this.loadImage('./assets/img/Sharkie/4.Attack/Bubbletrap/Poisoned Bubble (for whale).png'); 
        this.world = world;
        this.damage = world.character.attackPower * 2; 
    }
}
