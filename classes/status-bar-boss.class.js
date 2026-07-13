class StatusBarBoss extends StatusBar {
    IMAGES = [
        './assets/img/Marcadores/green/Life/1_Lifebar.png',
        './assets/img/Marcadores/green/Life/2_Lifebar.png',
        './assets/img/Marcadores/green/Life/3_lifebar.png',
        './assets/img/Marcadores/green/Life/4_lifebar.png',
        './assets/img/Marcadores/green/Life/5_lifebar.png',
        './assets/img/Marcadores/green/Life/6_lifebar.png'
    ];

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
