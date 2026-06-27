class JellyFish extends MovableObject {

    IMAGES_IDLE = [
            '../assets/img/Enemy/JellyFish/Regular/Purpel1.png',
            '../assets/img/Enemy/JellyFish/Regular/Purpel2.png',
            '../assets/img/Enemy/JellyFish/Regular/Purpel3.png',
            '../assets/img/Enemy/JellyFish/Regular/Purpel4.png'
        ];
    

    constructor() {
        super().loadImage('../assets/img/Enemy/JellyFish/Regular/Purpel1.png')
        this.loadImages(this.IMAGES_IDLE);
        this.x = 200 + Math.random() * 500;
        this.y = 0 + Math.random() * 400;
        this.height = 70;
        this.width = 70;
        this.animate(); 
        this.speed = 0.15 + Math.random() * 0.25;
        
    }

    animate() {
        this.moveLeft();

        setInterval(() => {
            let i = this.currentImage % this.IMAGES_IDLE.length;
            let path = this.IMAGES_IDLE[i];
            this.img = this.imageCache[path];
            this.currentImage ++;
        }, 250);
    }
}