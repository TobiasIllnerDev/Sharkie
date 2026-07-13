class StatusBarBoss extends StatusBar {
    IMAGES = Array.from({length: 6}, (_, i) => `../assets/img/Marcadores/green/Life/${i+1}_Lifebar.png`);

    /** Creates this object. */
    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.x = 530;
        this.y = 90;
        this.width = 160;
        this.height = 50;
        this.setPercentage(100);
    }
}
