class Character extends MovableObject {
    IMAGES_WALKING = [
            '../assets/img/Sharkie/1.IDLE/1.png',
            '../assets/img/Sharkie/1.IDLE/2.png',
            '../assets/img/Sharkie/1.IDLE/3.png',
            '../assets/img/Sharkie/1.IDLE/4.png',
            '../assets/img/Sharkie/1.IDLE/5.png',
            '../assets/img/Sharkie/1.IDLE/6.png'
        ];
    currentImage = 0;
    height = 300;

    constructor() {
        super().loadImage('../assets/img/Sharkie/1.IDLE/1.png')
        this.loadImages(this.IMAGES_WALKING);

        this.animate();
    }

    animate() {

        setInterval(() => {
            let i = this.currentImage % this.IMAGES_WALKING.length;
            let path = this.IMAGES_WALKING[i];
            this.img = this.imageCache[path];
            this.currentImage ++;
        }, 100);
        
    }
}