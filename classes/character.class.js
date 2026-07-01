class Character extends MovableObject {
    IMAGES_SWIM = Array.from({length: 6}, (_, i) => `../assets/img/Sharkie/3.Swim/${i+1}.png`);
    IMAGES_DEAD = Array.from({length: 12}, (_, i) => `../assets/img/Sharkie/6.dead/1.Poisoned/${i+1}.png`);
    IMAGES_HURT = Array.from({length: 4}, (_, i) => `../assets/img/Sharkie/5.Hurt/1.Poisoned/${i+1}.png`);
    IMAGES_IDLE = Array.from({length: 18}, (_, i) => `../assets/img/Sharkie/1.IDLE/${i+1}.png`);
    IMAGES_SLEEP = Array.from({length: 14}, (_, i) => `../assets/img/Sharkie/2.Long_IDLE/i${i+1}.png`);
    world;
    speed = 4;

    constructor() {
        super().loadImage('../assets/img/Sharkie/1.IDLE/1.png')
        this.loadImages(this.IMAGES_SWIM);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_SLEEP);
        this.animate();
        this.height = 200;
        this.width = 200;
        this.offsetX = 40;
        this.offsetY = 90;
        this.offsetWidth = 75;
        this.offsetHeight = 120;
    }

    animate() {
        setInterval(() => {
            if (this.isDead()) {
                this.playAnimation(this.IMAGES_DEAD);
            }
            else if (this.isHurt()) {
                this.playAnimation(this.IMAGES_HURT);
            }
            else if(this.world.keyboard.RIGHT || this.world.keyboard.LEFT || this.world.keyboard.UP || this.world.keyboard.DOWN) {
                //SWIM Animation
                this.playAnimation(this.IMAGES_SWIM);
            }
            else {
                if(this.isAFK()) {
                    this.playAnimation(this.IMAGES_SLEEP);
                } else {
                    this.playAnimation(this.IMAGES_IDLE);
                }
            }
           
        }, 100);

        setInterval(() => {
            if(this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
                this.x += this.speed;
                this.otherDiretion = false;
                this.lastMove = new Date().getTime();
            }

            if(this.world.keyboard.LEFT && this.x > -650) {
                this.x -= this.speed;
                this.otherDiretion = true;
                this.lastMove = new Date().getTime();
            }
            if(this.world.keyboard.UP) {
                this.y -= this.speed;
                this.lastMove = new Date().getTime();
            }
            if(this.world.keyboard.DOWN) {
                this.y += this.speed;
                this.lastMove = new Date().getTime();
            }

            this.world.camera_x = -this.x + 50;
        }, 1000 / 60);

    }
}