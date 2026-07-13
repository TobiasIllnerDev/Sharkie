class Level {
    enemies;
    lights;
    backgroundObjects;
    collectibles;
    level_end_x = 4200;

    /** Creates this object. */
    constructor(enemies, lights, backgroundObjects,collectibles) {
        this.enemies = enemies;
        this.lights = lights;
        this.backgroundObjects = backgroundObjects;
        this.collectibles = collectibles;
    }
}