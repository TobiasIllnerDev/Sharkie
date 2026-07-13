/**
 * Displays the character health percentage.
 */
class StatusBarLife extends StatusBar {
    IMAGES = [
        './assets/img/Marcadores/green/Life/1_Lifebar.png',
        './assets/img/Marcadores/green/Life/2_Lifebar.png',
        './assets/img/Marcadores/green/Life/3_lifebar.png',
        './assets/img/Marcadores/green/Life/4_lifebar.png',
        './assets/img/Marcadores/green/Life/5_lifebar.png',
        './assets/img/Marcadores/green/Life/6_lifebar.png'
    ];

    /**
     * Creates a new instance.
     */
    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.x = 30;
        this.y = 10;
        this.setPercentage(100);
    }
}
