class Coin extends CollectibleObject {

    /** Creates this object. */
    constructor(x,y) {
        const IMAGES = Array.from({length: 4}, (_, i) => `../assets/img/Marcadores/1. Coins/${i+1}.png`);
        super(IMAGES, x, y, 40, 40);
    }
}