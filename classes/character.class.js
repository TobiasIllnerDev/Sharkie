class Character extends MovableObject {
    IMAGES_SWIM = Array.from({length: 6}, (_, i) => `../assets/img/Sharkie/3.Swim/${i+1}.png`);
    IMAGES_DEAD = Array.from({length: 12}, (_, i) => `../assets/img/Sharkie/6.dead/1.Poisoned/${i+1}.png`);
    IMAGES_HURT = Array.from({length: 4}, (_, i) => `../assets/img/Sharkie/5.Hurt/1.Poisoned/${i+1}.png`);
    IMAGES_IDLE = Array.from({length: 18}, (_, i) => `../assets/img/Sharkie/1.IDLE/${i+1}.png`);
    IMAGES_SLEEP = Array.from({length: 14}, (_, i) => `../assets/img/Sharkie/2.Long_IDLE/i${i+1}.png`);
    IMAGES_ATTACK = Array.from({length: 8}, (_, i) => `../assets/img/Sharkie/4.Attack/Bubbletrap/op1 (with bubble formation)/${i+1}.png`)
    world;
    isAttacking = false;
    attackAnimationFinished = false;
    speed = 4;
    attackPower = 90;
    soundManager;
    deadSoundPlayed = false;
    isCurrentlySnoring = false; 

    constructor() {
        super().loadImage('../assets/img/Sharkie/1.IDLE/1.png')
        this.loadImages(this.IMAGES_SWIM);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_SLEEP);
        this.loadImages(this.IMAGES_ATTACK);
        this.height = 200;
        this.width = 200;
        this.offsetX = 40;
        this.offsetY = 90;
        this.offsetWidth = 75;
        this.offsetHeight = 120;
    }


    setSoundManager(soundManager) {
        this.soundManager = soundManager;
    }

    animate() {
        setInterval(() => {
            if (this.isDead()) {
                this.playAnimation(this.IMAGES_DEAD);
                if (!this.deadSoundPlayed) {
                    this.soundManager.playSound('dead');
                    this.deadSoundPlayed = true;
                }
            }
            else if (this.isHurt()) {
                this.playAnimation(this.IMAGES_HURT);
            }
            else if (this.isAttacking) {
                this.playAnimation(this.IMAGES_ATTACK);
                if (this.currentImage >= this.IMAGES_ATTACK.length) {
                    this.attackAnimationFinished = true;
                }
            }
            else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT ||
                    this.world.keyboard.UP || this.world.keyboard.DOWN) {
                this.playAnimation(this.IMAGES_SWIM);
                if (this.isCurrentlySnoring) {
                    if (this.soundManager && this.soundManager.sounds['snoring']) {
                        this.soundManager.sounds['snoring'].audio.pause();
                        this.soundManager.sounds['snoring'].audio.currentTime = 0;
                    }
                    this.isCurrentlySnoring = false;
                }
            }
            else if (this.isAFK()) {
                this.playAnimation(this.IMAGES_SLEEP);
                if (!this.isCurrentlySnoring) {
                    this.soundManager.playSound('snoring');
                    this.isCurrentlySnoring = true;
                }
            }
            else {
                this.playAnimation(this.IMAGES_IDLE);
                
                if (this.isCurrentlySnoring) {
                    if (this.soundManager && this.soundManager.sounds['snoring']) {
                        this.soundManager.sounds['snoring'].audio.pause();
                        this.soundManager.sounds['snoring'].audio.currentTime = 0;
                    }
                    this.isCurrentlySnoring = false;
                }
            }
        }, 150);

        // Bewegung alle 16.67ms
        setInterval(() => {
            if(this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
                this.x += this.speed;
                this.otherDiretion = false;
                this.dontMove();
            }
            if(this.world.keyboard.LEFT && this.x > -650) {
                this.x -= this.speed;
                this.otherDiretion = true;
                this.dontMove();
            }
            if(this.world.keyboard.UP && this.y > -90) {
                this.y -= this.speed;
                this.dontMove();
            }
            if(this.world.keyboard.DOWN && this.y < 320) {
                this.y += this.speed;
                this.dontMove();
            }
            this.world.camera_x = -this.x + 50;
        }, 1000 / 60);
    }

    startAttack() {
        this.isAttacking = true;
        this.attackAnimationFinished = false;
        this.currentImage = 0;
    }

    resetAttack() {
        this.isAttacking = false;
        this.attackAnimationFinished = false;
    }
}