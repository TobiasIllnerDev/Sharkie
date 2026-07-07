class StatusBarBoss extends StatusBar {
    IMAGES = Array.from({length: 6}, (_, i) => `../assets/img/Marcadores/green/Life/${i+1}_Lifebar.png`);

    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.x = 550;
        this.y = 10;
        this.width = 160;
        this.height = 50;
        this.setPercentage(100);
    }
}