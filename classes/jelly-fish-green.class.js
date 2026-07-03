class JellyFishGreen extends JellyFish {
    damage = 10;
    constructor(x) {
        super();
        this.loadImage('../assets/img/Enemy/JellyFish/Súper dangerous/Green 1.png');
        this.loadImages(Array.from({length: 4}, (_, i) => `../assets/img/Enemy/JellyFish/Súper dangerous/Green ${i+1}.png`));
        this.x = x + Math.random() * 500;
        this.y = 0 + Math.random() * 400;
        this.height = 55;
        this.width = 55;
        this.speed = 0.15 + Math.random() * 0.25;
        this.animate();
    }

    animate() {
        this.moveLeft();
        setInterval(() => {
            this.playAnimation(Array.from({length: 4}, (_, i) => `../assets/img/Enemy/JellyFish/Súper dangerous/Green ${i+1}.png`));
        }, 250);
    }
}