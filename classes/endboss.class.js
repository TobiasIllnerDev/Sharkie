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

    /** Creates this object. */
    constructor() {
        super();
        this.loadBossImages();
        this.setBossStats();
        this.setBossOffsets();
    }

    /** load boss images. */
    loadBossImages() {
        this.loadImage(this.IMAGES_FLOATING[0]);
        this.loadImages(this.IMAGES_FLOATING);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD); 
        this.loadImages(this.IMAGES_SPAWN);
        this.loadImages(this.IMAGES_ATTACK);
    }

    /** set boss stats. */
    setBossStats() {
        this.x = 4200;
        this.speed = 2;
        this.hasStartedDeadAnimation = false;
    }

    /** set boss offsets. */
    setBossOffsets() {
        this.offsetX = 20;
        this.offsetY = 150;
        this.offsetWidth = 40;
        this.offsetHeight = 220;
    }

    /** start spawn. */
    startSpawn() {
        this.isSpawning = true;
        this.isSpawned = false;
        this.currentImage = 0;
        this.spawnInterval = setInterval(() => this.updateSpawnAnimation(), 200);
    }

    /** update spawn animation. */
    updateSpawnAnimation() {
        if (this.world && this.world.isPaused) return;
        this.playAnimation(this.IMAGES_SPAWN);
        if (this.currentImage >= this.IMAGES_SPAWN.length) this.finishSpawn();
    }

    /** finish spawn. */
    finishSpawn() {
        this.isSpawning = false;
        this.isSpawned = true;
        this.clearSpawnInterval();
        this.animate();
        this.startChasing();
    }

    /** clear spawn interval. */
    clearSpawnInterval() {
        clearInterval(this.spawnInterval);
        this.spawnInterval = null;
    }

    /** animate. */
    animate() {
        if (this.isSpawning) return;
        this.animationInterval = setInterval(() => this.updateAnimation(), 200);
    }

    /** update animation. */
    updateAnimation() {
        if (this.world && this.world.isPaused) return;
        if (this.isDead()) return this.playDeadAnimation();
        if (this.isAttacking) return this.playAttackAnimation();
        if (this.isHurt()) return this.playAnimation(this.IMAGES_HURT);
        this.playAnimation(this.IMAGES_FLOATING);
    }

    /** play dead animation. */
    playDeadAnimation() {
        if (!this.hasStartedDeadAnimation) this.startDeadAnimation();
        this.playAnimation(this.IMAGES_DEAD);
        if (this.currentImage >= this.IMAGES_DEAD.length) this.finishDeadAnimation();
    }

    /** start dead animation. */
    startDeadAnimation() {
        this.currentImage = 0;
        this.hasStartedDeadAnimation = true;
    }

    /** finish dead animation. */
    finishDeadAnimation() {
        this.shouldRemove = true;
        this.clearAnimationInterval();
    }

    /** play attack animation. */
    playAttackAnimation() {
        this.playAnimation(this.IMAGES_ATTACK);
        if (!this.attackDamageApplied && this.currentImage >= 3) this.applyAttackDamage();
        if (this.currentImage >= this.IMAGES_ATTACK.length) this.isAttacking = false;
    }

    /** start chasing. */
    startChasing() {
        if (this.chaseInterval) {
            return;
        }

        this.chaseInterval = setInterval(() => {
            this.chaseCharacter();
        }, 1000 / 60);
    }

    /** stop chasing. */
    stopChasing() {
        if (this.chaseInterval) {
            clearInterval(this.chaseInterval);
            this.chaseInterval = null;
        }
    }

    /** chase character. */
    chaseCharacter() {
        if (this.shouldStopChasing()) return this.stopChasing();
        if (this.world.isPaused) return;
        const direction = this.getDirectionToCharacter();
        this.otherDiretion = direction.dx > 0;
        if (this.isAttacking || direction.distance === 0) return;
        this.moveTowardsCharacter(direction);
    }

    /** should stop chasing. */
    shouldStopChasing() {
        return !this.world || !this.world.character || this.isDead() ||
            this.world.character.isDead() || this.world.gameOver || this.world.win;
    }

    /** get direction to character. */
    getDirectionToCharacter() {
        const boss = this.getCenter(this);
        const character = this.getCenter(this.world.character);
        const dx = character.x - boss.x;
        const dy = character.y - boss.y;
        return { dx, dy, distance: Math.hypot(dx, dy) };
    }

    /** get center. */
    getCenter(object) {
        return { x: object.x + object.width / 2, y: object.y + object.height / 2 };
    }

    /** move towards character. */
    moveTowardsCharacter(direction) {
        this.x += (direction.dx / direction.distance) * this.chaseSpeed;
        this.y += (direction.dy / direction.distance) * this.chaseSpeed;
        this.y = Math.min(this.maxY, Math.max(this.minY, this.y));
    }

    /** is player in attack range. */
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

    /** try attack. */
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

    /** apply attack damage. */
    applyAttackDamage() {
        this.attackDamageApplied = true;
        if (this.isPlayerInAttackRange()) {
            this.world.damageCharacter(this.damage);
        }
    }

    /** cleanup. */
    cleanup() {
        if (this.spawnInterval) {
            clearInterval(this.spawnInterval);
            this.spawnInterval = null;
        }
        this.stopChasing();
        super.cleanup();
    }
}

