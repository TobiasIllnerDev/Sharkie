class Endboss extends MovableObject {


    IMAGES_FLOATING = [
        '../assets/img/Enemy/FinalBoss/2.floating/1.png',
        '../assets/img/Enemy/FinalBoss/2.floating/2.png',
        '../assets/img/Enemy/FinalBoss/2.floating/3.png',
        '../assets/img/Enemy/FinalBoss/2.floating/4.png',
        '../assets/img/Enemy/FinalBoss/2.floating/5.png',
        '../assets/img/Enemy/FinalBoss/2.floating/6.png',
        '../assets/img/Enemy/FinalBoss/2.floating/7.png',
        '../assets/img/Enemy/FinalBoss/2.floating/8.png',
        '../assets/img/Enemy/FinalBoss/2.floating/9.png',
        '../assets/img/Enemy/FinalBoss/2.floating/10.png',
        '../assets/img/Enemy/FinalBoss/2.floating/11.png',
        '../assets/img/Enemy/FinalBoss/2.floating/12.png',
        '../assets/img/Enemy/FinalBoss/2.floating/13.png',
    ];

    height = 400;
    width = 400;
    y  = -20

    constructor() {
        super().loadImage(this.IMAGES_FLOATING[0]);
        this.loadImages(this.IMAGES_FLOATING);

        this.x = 200 + Math.random() * 500;
        this.speed = 0.15 ;

        this.animate();
    }

    animate() {
        this.moveLeft();

        setInterval(() => {
           this.playAnimation(this.IMAGES_FLOATING)
        }, 100);
    }
}