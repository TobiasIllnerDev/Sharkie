class Character extends MovableObject {
    IMAGES_SWIM = [
            '../assets/img/Sharkie/3.Swim/1.png',
            '../assets/img/Sharkie/3.Swim/2.png',
            '../assets/img/Sharkie/3.Swim/3.png',
            '../assets/img/Sharkie/3.Swim/4.png',
            '../assets/img/Sharkie/3.Swim/5.png',
            '../assets/img/Sharkie/3.Swim/6.png',
        ];
    world;    
    height = 300;
    speed = 4;

    constructor() {
        super().loadImage('../assets/img/Sharkie/1.IDLE/1.png')
        this.loadImages(this.IMAGES_SWIM);
        this.animate();
    }

    animate() {
        setInterval(() => {
            if(this.world.keyboard.RIGHT || this.world.keyboard.LEFT || this.world.keyboard.UP || this.world.keyboard.DOWN) {
                //SWIM Animation
                let i = this.currentImage % this.IMAGES_SWIM.length;
                let path = this.IMAGES_SWIM[i];
                this.img = this.imageCache[path];
                this.currentImage ++;
            }
           
        }, 50);

        setInterval(() => {
            if(this.world.keyboard.RIGHT) {
                this.x += this.speed;
                this.otherDiretion = false;
            }

            if(this.world.keyboard.LEFT) {
                this.x -= this.speed;
                this.otherDiretion = true;
            }
            if(this.world.keyboard.UP) {
                this.y -= this.speed;
            }
            if(this.world.keyboard.DOWN) {
                this.y += this.speed;
            }
        }, 1000 / 60);
        
    }
}