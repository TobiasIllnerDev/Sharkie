class StatusBarBoss extends StatusBar {
    IMAGES = Array.from({length: 6}, (_, i) => `../assets/img/Marcadores/green/Life/${i+1}_Lifebar.png`);

    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.x = 480;
        this.y = 10;
        this.width = 160;
        this.height = 70;
        this.setPercentage(100);
    }
}