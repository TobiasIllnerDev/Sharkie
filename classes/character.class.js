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
    height = 200;
    width = 200;
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
                this.playAnimation(this.IMAGES_SWIM)
            }
           
        }, 50);

        setInterval(() => {
            if(this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
                this.x += this.speed;
                this.otherDiretion = false;
            }

            if(this.world.keyboard.LEFT && this.x > -650) {
                this.x -= this.speed;
                this.otherDiretion = true;
            }
            if(this.world.keyboard.UP) {
                this.y -= this.speed;
            }
            if(this.world.keyboard.DOWN) {
                this.y += this.speed;
            }

            this.world.camera_x = -this.x + 50;
        }, 1000 / 60);
        
    }
}