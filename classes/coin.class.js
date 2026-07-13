/**
 * Represents a collectible coin.
 */
class Coin extends CollectibleObject {

    /**
     * Creates a new instance.
     * @param {number} x - Horizontal canvas or world position.
     * @param {number} y - Vertical canvas or world position.
     */
    constructor(x,y) {
        const IMAGES = Array.from({length: 4}, (_, i) => `./assets/img/Marcadores/1. Coins/${i+1}.png`);
        super(IMAGES, x, y, 40, 40);
    }
}