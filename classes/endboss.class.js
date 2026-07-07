class Endboss extends MovableObject {

    IMAGES_HURT = Array.from({length: 4}, (_, i) => `../assets/img/Enemy/FinalBoss/Hurt/${i+1}.png`);
    IMAGES_DEAD = Array.from({length: 5}, (_, i) => `../assets/img/Enemy/FinalBoss/Dead/Dead_${i+1}.png`);
    IMAGES_FLOATING =  Array.from({length: 13}, (_, i) =>`../assets/img/Enemy/FinalBoss/2.floating/${i+1}.png`);
    IMAGES_SPAWN = Array.from({length: 10}, (_, i) => `../assets/img/Enemy/FinalBoss/1.Introduce/${i+1}.png`);

    isSpawned = false;
    isSpawning = false;
    height = 400;
    width = 400;
    y  = -20
    damage = 20;
    energy = 500;
    shouldRemove = false;

    constructor() {
        super();
        this.loadImage(this.IMAGES_FLOATING[0]);
        this.loadImages(this.IMAGES_FLOATING);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD); 
        this.loadImages(this.IMAGES_SPAWN);
        this.x = 4200;
        this.speed = 0.15;
        this.offsetX = 20;
        this.offsetY = 150;
        this.offsetWidth = 40;
        this.offsetHeight = 220;
        this.hasStartedDeadAnimation = false;
    }

    startSpawn() {
        this.isSpawning = true;
        this.isSpawned = false;
        this.currentImage = 0;

        let spawnInterval = setInterval(() => {
            this.playAnimation(this.IMAGES_SPAWN);
            if (this.currentImage >= this.IMAGES_SPAWN.length) {
                this.isSpawning = false;
                this.isSpawned = true;
                clearInterval(spawnInterval);
                this.animate(); 
            }
        }, 200);
    }

    animate() {
        if (!this.isSpawning) {
            this.moveLeft();

            setInterval(() => {
                if(this.isDead()) {
                    if(!this.hasStartedDeadAnimation) {
                        this.currentImage = 0;
                        this.hasStartedDeadAnimation = true;
                    }
                    this.playAnimation(this.IMAGES_DEAD);
                    if(this.currentImage >= this.IMAGES_DEAD.length) {
                         this.shouldRemove = true;
                    }
                }
                else if(this.isHurt()) {
                    this.playAnimation(this.IMAGES_HURT);
                }
                else {
                    this.playAnimation(this.IMAGES_FLOATING);
                }
            }, 200);
        }
    }
}

