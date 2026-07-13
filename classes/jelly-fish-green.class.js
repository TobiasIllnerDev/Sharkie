class JellyFishGreen extends JellyFish {
    damage = 10;
    IMAGES_FLOATING = Array.from({length: 4}, (_, i) => `./assets/img/Enemy/JellyFish/Súper dangerous/Green ${i+1}.png`);
    IMAGES_DEAD = Array.from({length: 4}, (_, i) => `./assets/img/Enemy/JellyFish/Dead/green/g${i+1}.png`);

    /** Creates this object. */
    constructor(x = 200, y = 200) {
        super();
        this.initJellyFish(x, y);
    }
}
