class JellyFishPink extends JellyFish {
    damage = 10;
    IMAGES_FLOATING = Array.from({length: 4}, (_, i) => `../assets/img/Enemy/JellyFish/Súper dangerous/Pink ${i+1}.png`)
    IMAGES_DEAD = Array.from({length: 4}, (_, i) => `../assets/img/Enemy/JellyFish/Dead/Pink/P${i+1}.png`);

    constructor(x = 200) {
        super();
        this.loadImage(this.IMAGES_FLOATING[0]);
        this.loadImages(this.IMAGES_FLOATING);
        this.loadImages(this.IMAGES_DEAD);
        this.x = x + Math.random() * 500;
        this.y = 0 + Math.random() * 400;
        this.offsetHeight = 10;
        this.offsetWidth = 10;
        this.offsetX = 5;
        this.offsetY = 5;
        this.hasStartedDeadAnimation = false;
        this.animate();
    }

    animate() {
        this.moveLeft();

        this.animationInterval = setInterval(() => {
            if(this.isDead()) {
                if(!this.hasStartedDeadAnimation) {
                    this.currentImage = 0;
                    this.hasStartedDeadAnimation = true;
                }
                this.playAnimation(this.IMAGES_DEAD);
                if(this.currentImage >= this.IMAGES_DEAD.length) {
                     this.shouldRemove = true; 
                }
            }
            else {
                this.playAnimation(this.IMAGES_FLOATING);
            }
        }, 250);
    }
}
