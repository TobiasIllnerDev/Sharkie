/**
 * Stores all objects and bounds for one level.
 */
class Level {
    enemies;
    lights;
    backgroundObjects;
    collectibles;
    level_end_x = 4200;

    /**
     * Creates a new instance.
     * @param {MovableObject[]} enemies - Level enemies.
     * @param {Light[]} lights - Level lights.
     * @param {BackgroundObject[]} backgroundObjects - Level background objects.
     * @param {CollectibleObject[]} collectibles - Level collectibles.
     */
    constructor(enemies, lights, backgroundObjects,collectibles) {
        this.enemies = enemies;
        this.lights = lights;
        this.backgroundObjects = backgroundObjects;
        this.collectibles = collectibles;
    }
}