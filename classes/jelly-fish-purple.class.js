class JellyFishPurple extends JellyFish {
    damage = 5;
    constructor(x) {
        super(); // ⚠️ WICHTIG: Ruft MovableObject Constructor auf
        this.loadImage('../assets/img/Enemy/JellyFish/Regular/Purpel1.png');
        this.loadImages(Array.from({length: 4}, (_, i) => `../assets/img/Enemy/JellyFish/Regular/Purpel${i+1}.png`));
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
            this.playAnimation(Array.from({length: 4}, (_, i) => `../assets/img/Enemy/JellyFish/Regular/Purpel${i+1}.png`));
        }, 250);
    }
}