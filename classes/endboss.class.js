class Endboss extends MovableObject {


    IMAGES_FLOATING =  Array.from({length: 13}, (_, i) =>`../assets/img/Enemy/FinalBoss/2.floating/${i+1}.png`);

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