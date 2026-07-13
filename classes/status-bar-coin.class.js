class StatusBarCoin extends StatusBar {
    IMAGES = Array.from({length: 6}, (_, i) => `./assets/img/Marcadores/green/Coin/${i+1}_Coin.png`);

    /** Creates this object. */
    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.x = 30;
        this.y = 50;
        this.setPercentage(0);
    }
}