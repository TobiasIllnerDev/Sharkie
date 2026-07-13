/**
 * Represents a collectible poison bottle.
 */
class Bottle extends CollectibleObject {
    

    /**
     * Creates a new instance.
     * @param {number} x - Horizontal canvas or world position.
     * @param {number} y - Vertical canvas or world position.
     */
    constructor(x, y) {
        const IMAGES = Array.from({length: 8}, (_, i) => `./assets/img/Marcadores/Posión/Animada/${i+1}.png`);
        super(IMAGES, x, y, 50, 70);
    }
}
