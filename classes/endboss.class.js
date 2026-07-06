class Endboss extends MovableObject {

    IMAGES_HURT = Array.from({length: 4}, (_, i) => `../assets/img/Enemy/FinalBoss/Hurt/${i+1}.png`);
    IMAGES_DEAD = Array.from({length: 5}, (_, i) => `../assets/img/Enemy/FinalBoss/Dead/Dead_${i+1}.png`);
    IMAGES_FLOATING =  Array.from({length: 13}, (_, i) =>`../assets/img/Enemy/FinalBoss/2.floating/${i+1}.png`);

    height = 400;
    width = 400;
    y  = -20
    damage = 20;

    constructor() {
        super().loadImage(this.IMAGES_FLOATING[0]);
        this.loadImages(this.IMAGES_FLOATING);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD); 
        this.x = 200 + Math.random() * 500;
        this.speed = 0.15;
        this.animate();
        this.offsetX = 20;
        this.offsetY = 150;
        this.offsetWidth = 40;
        this.offsetHeight = 220;
    }

    animate() {
        this.moveLeft();

        setInterval(() => {
            if(this.isDead()) {
                this.playAnimation(this.IMAGES_DEAD);
            }
            else if(this.isHurt()) {
                this.playAnimation(this.IMAGES_HURT); 
            }
            else {
                this.playAnimation(this.IMAGES_FLOATING);
            }
        }, 150);
    }
}

