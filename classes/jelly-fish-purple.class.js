/**
 * Represents a purple jelly fish enemy.
 */
class JellyFishPurple extends JellyFish {
    damage = 10;
    IMAGES_FLOATING = Array.from({length: 4}, (_, i) => `./assets/img/Enemy/JellyFish/Regular/Purpel${i+1}.png`);
    IMAGES_DEAD = Array.from({length: 4}, (_, i) => `./assets/img/Enemy/JellyFish/Dead/Lila/L${i+1}.png`);

    /**
     * Creates a new instance.
     * @param {number} x - Horizontal canvas or world position.
     * @param {number} y - Vertical canvas or world position.
     */
    constructor(x = 200, y = 200) {
        super();
        this.initJellyFish(x, y);
    }
}
