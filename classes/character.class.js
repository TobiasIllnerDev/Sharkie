class Character extends MovableObject {

    height = 300;

    constructor() {
        super().loadImage('../assets/img/Sharkie/1.IDLE/1.png')
        this.loadImages([
            '../assets/img/Sharkie/1.IDLE/1.png',
            '../assets/img/Sharkie/1.IDLE/2.png',
            '../assets/img/Sharkie/1.IDLE/3.png',
            '../assets/img/Sharkie/1.IDLE/4.png',
            '../assets/img/Sharkie/1.IDLE/5.png',
            '../assets/img/Sharkie/1.IDLE/6.png'
        ]);
    }
}