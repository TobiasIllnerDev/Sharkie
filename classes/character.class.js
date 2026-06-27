class Character extends MovableObject {
    IMAGES_IDLE = [
            '../assets/img/Sharkie/1.IDLE/1.png',
            '../assets/img/Sharkie/1.IDLE/2.png',
            '../assets/img/Sharkie/1.IDLE/3.png',
            '../assets/img/Sharkie/1.IDLE/4.png',
            '../assets/img/Sharkie/1.IDLE/5.png',
            '../assets/img/Sharkie/1.IDLE/6.png',
            '../assets/img/Sharkie/1.IDLE/7.png',
            '../assets/img/Sharkie/1.IDLE/8.png',
            '../assets/img/Sharkie/1.IDLE/9.png',
            '../assets/img/Sharkie/1.IDLE/10.png',
            '../assets/img/Sharkie/1.IDLE/11.png',
            '../assets/img/Sharkie/1.IDLE/12.png',
            '../assets/img/Sharkie/1.IDLE/13.png',
            '../assets/img/Sharkie/1.IDLE/14.png',
            '../assets/img/Sharkie/1.IDLE/15.png',
            '../assets/img/Sharkie/1.IDLE/16.png',
            '../assets/img/Sharkie/1.IDLE/17.png',
            '../assets/img/Sharkie/1.IDLE/18.png'
        ];
        
    height = 300;

    constructor() {
        super().loadImage('../assets/img/Sharkie/1.IDLE/1.png')
        this.loadImages(this.IMAGES_IDLE);

        this.animate();
    }

    animate() {

        setInterval(() => {
            let i = this.currentImage % this.IMAGES_IDLE.length;
            let path = this.IMAGES_IDLE[i];
            this.img = this.imageCache[path];
            this.currentImage ++;
        }, 100);
        
    }
}