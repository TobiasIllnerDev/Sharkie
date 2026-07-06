class JellyFishGreen extends JellyFish {
    damage = 10;
    IMAGES_FLOATING = Array.from({length: 4}, (_, i) => `../assets/img/Enemy/JellyFish/Súper dangerous/Green ${i+1}.png`);
    IMAGES_DEAD = Array.from({length: 4}, (_, i) => `../assets/img/Enemy/JellyFish/Dead/green/g${i+1}.png`);

    constructor(x = 200) {
        super();
        this.loadImage(this.IMAGES_FLOATING[0]);
        this.loadImages(this.IMAGES_FLOATING);
        this.x = x + Math.random() * 500;
        this.y = 0 + Math.random() * 400;
        this.animate();

    }

    animate() {
        this.moveLeft();

        setInterval(() => {
            if(this.isDead()) {
                this.playAnimation(this.IMAGES_DEAD);
            }
            else {
                this.playAnimation(this.IMAGES_FLOATING);
            }
        }, 150);
    }

}