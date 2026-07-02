class StatusBarPosion extends StatusBar {
    IMAGES = Array.from({length: 6}, (_, i) => `../assets/img/Marcadores/green/Posion/${1}_Posion.png`);

    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.x = 30;
        this.y = 90;
        this.setPercentage(0);
    }
}