class Bottle extends CollectibleObject {
    

    constructor(x, y) {
        const IMAGES = Array.from({length: 8}, (_, i) => `../assets/img/Marcadores/Posión/Animada/${i+1}.png`);
        super(IMAGES, x, y, 50, 70);
    }
}