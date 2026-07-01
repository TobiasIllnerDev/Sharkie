class Character extends MovableObject {
    IMAGES_SWIM = [
            '../assets/img/Sharkie/3.Swim/1.png',
            '../assets/img/Sharkie/3.Swim/2.png',
            '../assets/img/Sharkie/3.Swim/3.png',
            '../assets/img/Sharkie/3.Swim/4.png',
            '../assets/img/Sharkie/3.Swim/5.png',
            '../assets/img/Sharkie/3.Swim/6.png',
        ];
    IMAGES_DEAD = [
        '../assets/img/Sharkie/6.dead/1.Poisoned/1.png',
        '../assets/img/Sharkie/6.dead/1.Poisoned/2.png',
        '../assets/img/Sharkie/6.dead/1.Poisoned/3.png',
        '../assets/img/Sharkie/6.dead/1.Poisoned/4.png',
        '../assets/img/Sharkie/6.dead/1.Poisoned/5.png',
        '../assets/img/Sharkie/6.dead/1.Poisoned/6.png',
        '../assets/img/Sharkie/6.dead/1.Poisoned/7.png',
        '../assets/img/Sharkie/6.dead/1.Poisoned/8.png',
        '../assets/img/Sharkie/6.dead/1.Poisoned/9.png',
        '../assets/img/Sharkie/6.dead/1.Poisoned/10.png',
        '../assets/img/Sharkie/6.dead/1.Poisoned/11.png',
        '../assets/img/Sharkie/6.dead/1.Poisoned/12.png',
    ];

    IMAGES_HURT = [
        '../assets/img/Sharkie/5.Hurt/1.Poisoned/1.png',
        '../assets/img/Sharkie/5.Hurt/1.Poisoned/2.png',
        '../assets/img/Sharkie/5.Hurt/1.Poisoned/3.png',
        '../assets/img/Sharkie/5.Hurt/1.Poisoned/4.png',
    ];

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
        '../assets/img/Sharkie/1.IDLE/18.png',
    ];

    IMAGES_SLEEP = [
        '../assets/img/Sharkie/2.Long_IDLE/i1.png',
        '../assets/img/Sharkie/2.Long_IDLE/i2.png',
        '../assets/img/Sharkie/2.Long_IDLE/i3.png',
        '../assets/img/Sharkie/2.Long_IDLE/i4.png',
        '../assets/img/Sharkie/2.Long_IDLE/i5.png',
        '../assets/img/Sharkie/2.Long_IDLE/i6.png',
        '../assets/img/Sharkie/2.Long_IDLE/i7.png',
        '../assets/img/Sharkie/2.Long_IDLE/i8.png',
        '../assets/img/Sharkie/2.Long_IDLE/i9.png',
        '../assets/img/Sharkie/2.Long_IDLE/i10.png',
        '../assets/img/Sharkie/2.Long_IDLE/i11.png',
        '../assets/img/Sharkie/2.Long_IDLE/i12.png',
        '../assets/img/Sharkie/2.Long_IDLE/i13.png',
        '../assets/img/Sharkie/2.Long_IDLE/i14.png',
    ];

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