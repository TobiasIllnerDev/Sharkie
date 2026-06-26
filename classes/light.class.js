class Light extends MovableObject {
    x = 420 
    y = 0
    height = 500
    width = 300
    constructor() {
        super().loadImage('../assets/img/Background/Layers/1. Light/1.png');
        
        this.animate();
    }

    animate() {
        setInterval(() => {
            this.x -= 0.15;
        }, 1000 / 60);
    }
}