class Endboss extends MovableObject {

    IMAGES_HURT = Array.from({length: 4}, (_, i) => `../assets/img/Enemy/FinalBoss/Hurt/${i+1}.png`);
    IMAGES_DEAD = Array.from({length: 6}, (_, i) => `../assets/img/Enemy/FinalBoss/Dead/Dead_${i+1}.png`);
    IMAGES_FLOATING =  Array.from({length: 13}, (_, i) =>`../assets/img/Enemy/FinalBoss/2.floating/${i+1}.png`);
    IMAGES_SPAWN = Array.from({length: 10}, (_, i) => `../assets/img/Enemy/FinalBoss/1.Introduce/${i+1}.png`);
    IMAGES_ATTACK = Array.from({length: 6}, (_, i) => `../assets/img/Enemy/FinalBoss/Attack/${i+1}.png`);

    isSpawned = false;
    isSpawning = false;
    height = 400;
    width = 400;
    y  = -20
    damage = 25;
    energy = 100;
    maxEnergy = 100;
    shouldRemove = false;
    spawnInterval = null;
    isAttacking = false;
    lastAttack = 0;
    attackCooldown = 2000;
    attackDamageApplied = false;
    chaseInterval = null;
    chaseSpeed = 2;
    minY = -80;
    maxY = 180;

    constructor() {
        super();
        this.loadImage(this.IMAGES_FLOATING[0]);
        this.loadImages(this.IMAGES_FLOATING);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD); 
        this.loadImages(this.IMAGES_SPAWN);
        this.loadImages(this.IMAGES_ATTACK);
        this.x = 4200;
        this.speed = 2;
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

        this.spawnInterval = setInterval(() => {
            if (this.world && this.world.isPaused) {
                return;
            }

            this.playAnimation(this.IMAGES_SPAWN);
            if (this.currentImage >= this.IMAGES_SPAWN.length) {
                this.isSpawning = false;
                this.isSpawned = true;
                clearInterval(this.spawnInterval);
                this.spawnInterval = null;
                this.animate();
                this.startChasing();
            }
        }, 200);
    }

    animate() {
        if (!this.isSpawning) {
            this.animationInterval = setInterval(() => {
                if (this.world && this.world.isPaused) {
                    return;
                }

                if(this.isDead()) {
                    if(!this.hasStartedDeadAnimation) {
                        this.currentImage = 0;
                        this.hasStartedDeadAnimation = true;
                    }
                    this.playAnimation(this.IMAGES_DEAD);
                    if(this.currentImage >= this.IMAGES_DEAD.length) {
                         this.shouldRemove = true;
                         this.clearAnimationInterval();
                    }
                }
                else if (this.isAttacking) {
                    this.playAnimation(this.IMAGES_ATTACK);
                    if (!this.attackDamageApplied && this.currentImage >= 3) {
                        this.applyAttackDamage();
                    }
                    if (this.currentImage >= this.IMAGES_ATTACK.length) {
                        this.isAttacking = false;
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

    startChasing() {
        if (this.chaseInterval) {
            return;
        }

        this.chaseInterval = setInterval(() => {
            this.chaseCharacter();
        }, 1000 / 60);
    }

    stopChasing() {
        if (this.chaseInterval) {
            clearInterval(this.chaseInterval);
            this.chaseInterval = null;
        }
    }

    chaseCharacter() {
        if (!this.world || !this.world.character || this.isDead() ||
            this.world.character.isDead() || this.world.gameOver || this.world.win) {
            this.stopChasing();
            return;
        }

        if (this.world.isPaused) {
            return;
        }

        const bossCenterX = this.x + this.width / 2;
        const bossCenterY = this.y + this.height / 2;
        const characterCenterX = this.world.character.x + this.world.character.width / 2;
        const characterCenterY = this.world.character.y + this.world.character.height / 2;
        const dx = characterCenterX - bossCenterX;
        const dy = characterCenterY - bossCenterY;

        this.otherDiretion = dx > 0;

        if (this.isAttacking) {
            return;
        }

        const distance = Math.hypot(dx, dy);
        if (distance === 0) {
            return;
        }

        this.x += (dx / distance) * this.chaseSpeed;
        this.y += (dy / distance) * this.chaseSpeed;
        this.y = Math.min(this.maxY, Math.max(this.minY, this.y));
    }

    isPlayerInAttackRange() {
        if (!this.world || !this.world.character) {
            return false;
        }

        const bossCenterX = this.x + this.width / 2;
        const bossCenterY = this.y + this.height / 2;
        const characterCenterX = this.world.character.x + this.world.character.width / 2;
        const characterCenterY = this.world.character.y + this.world.character.height / 2;
        return Math.abs(bossCenterX - characterCenterX) <= 250 &&
            Math.abs(bossCenterY - characterCenterY) <= 220;
    }

    tryAttack() {
        const now = Date.now();
        if (!this.isSpawned || this.isDead() || this.isAttacking ||
            now - this.lastAttack < this.attackCooldown || !this.isPlayerInAttackRange()) {
            return;
        }

        this.lastAttack = now;
        this.isAttacking = true;
        this.attackDamageApplied = false;
        this.currentImage = 0;
    }

    applyAttackDamage() {
        this.attackDamageApplied = true;
        if (this.isPlayerInAttackRange()) {
            this.world.damageCharacter(this.damage);
        }
    }

    cleanup() {
        if (this.spawnInterval) {
            clearInterval(this.spawnInterval);
            this.spawnInterval = null;
        }
        this.stopChasing();
        super.cleanup();
    }
}

