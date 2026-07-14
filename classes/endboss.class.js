/**
 * Represents the final boss enemy.
 */
class Endboss extends MovableObject {

    IMAGES_HURT = Array.from({length: 4}, (_, i) => `./assets/img/Enemy/FinalBoss/Hurt/${i+1}.png`);
    IMAGES_DEAD = Array.from({length: 6}, (_, i) => `./assets/img/Enemy/FinalBoss/Dead/Dead_${i+1}.png`);
    IMAGES_FLOATING =  Array.from({length: 13}, (_, i) =>`./assets/img/Enemy/FinalBoss/2.floating/${i+1}.png`);
    IMAGES_SPAWN = Array.from({length: 10}, (_, i) => `./assets/img/Enemy/FinalBoss/1.Introduce/${i+1}.png`);
    IMAGES_ATTACK = Array.from({length: 6}, (_, i) => `./assets/img/Enemy/FinalBoss/Attack/${i+1}.png`);

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

    /**
     * Creates a new instance.
     */
    constructor() {
        super();
        this.loadBossImages();
        this.setBossStats();
        this.setBossOffsets();
    }

    /**
     * Load boss images.
     */
    loadBossImages() {
        this.loadImage(this.IMAGES_FLOATING[0]);
        this.loadImages(this.IMAGES_FLOATING);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD); 
        this.loadImages(this.IMAGES_SPAWN);
        this.loadImages(this.IMAGES_ATTACK);
    }

    /**
     * Set boss stats.
     */
    setBossStats() {
        this.x = 4200;
        this.speed = 2;
        this.hasStartedDeadAnimation = false;
    }

    /**
     * Set boss offsets.
     */
    setBossOffsets() {
        this.offsetX = 20;
        this.offsetY = 150;
        this.offsetWidth = 40;
        this.offsetHeight = 220;
    }

    /**
     * Start spawn.
     */
    startSpawn() {
        this.isSpawning = true;
        this.isSpawned = false;
        this.currentImage = 0;
        this.showFirstSpawnFrame();
        this.spawnInterval = setInterval(() => this.updateSpawnAnimation(), 200);
    }

    /**
     * Shows the first spawn frame before the interval advances the animation.
     */
    showFirstSpawnFrame() {
        const firstSpawnFrame = this.IMAGES_SPAWN[0];
        this.img = this.imageCache[firstSpawnFrame] || this.img;
        this.currentImage = 1;
    }

    /**
     * Update spawn animation.
     */
    updateSpawnAnimation() {
        if (this.world && this.world.isPaused) return;
        this.playAnimation(this.IMAGES_SPAWN);
        if (this.currentImage >= this.IMAGES_SPAWN.length) this.finishSpawn();
    }

    /**
     * Finish spawn.
     */
    finishSpawn() {
        this.isSpawning = false;
        this.isSpawned = true;
        this.clearSpawnInterval();
        this.animate();
        this.startChasing();
    }

    /**
     * Clear spawn interval.
     */
    clearSpawnInterval() {
        clearInterval(this.spawnInterval);
        this.spawnInterval = null;
    }

    /**
     * Animate.
     */
    animate() {
        if (this.isSpawning) return;
        this.animationInterval = setInterval(() => this.updateAnimation(), 200);
    }

    /**
     * Update animation.
     */
    updateAnimation() {
        if (this.world && this.world.isPaused) return;
        if (this.isDead()) return this.playDeadAnimation();
        if (this.isAttacking) return this.playAttackAnimation();
        if (this.isHurt()) return this.playAnimation(this.IMAGES_HURT);
        this.playAnimation(this.IMAGES_FLOATING);
    }

    /**
     * Play dead animation.
     */
    playDeadAnimation() {
        if (!this.hasStartedDeadAnimation) this.startDeadAnimation();
        this.playAnimation(this.IMAGES_DEAD);
        if (this.currentImage >= this.IMAGES_DEAD.length) this.finishDeadAnimation();
    }

    /**
     * Start dead animation.
     */
    startDeadAnimation() {
        this.currentImage = 0;
        this.hasStartedDeadAnimation = true;
    }

    /**
     * Finish dead animation.
     */
    finishDeadAnimation() {
        this.shouldRemove = true;
        this.clearAnimationInterval();
    }

    /**
     * Play attack animation.
     */
    playAttackAnimation() {
        this.playAnimation(this.IMAGES_ATTACK);
        if (!this.attackDamageApplied && this.currentImage >= 3) this.applyAttackDamage();
        if (this.currentImage >= this.IMAGES_ATTACK.length) this.isAttacking = false;
    }

    /**
     * Start chasing.
     */
    startChasing() {
        if (this.chaseInterval) {
            return;
        }

        this.chaseInterval = setInterval(() => {
            this.chaseCharacter();
        }, 1000 / 60);
    }

    /**
     * Stop chasing.
     */
    stopChasing() {
        if (this.chaseInterval) {
            clearInterval(this.chaseInterval);
            this.chaseInterval = null;
        }
    }

    /**
     * Chase character.
     */
    chaseCharacter() {
        if (this.shouldStopChasing()) return this.stopChasing();
        if (this.world.isPaused) return;
        const direction = this.getDirectionToCharacter();
        this.otherDiretion = direction.dx > 0;
        if (this.isAttacking || direction.distance === 0) return;
        this.moveTowardsCharacter(direction);
    }

    /**
     * Should stop chasing.
     * @returns {boolean} True when the condition is met.
     */
    shouldStopChasing() {
        return !this.world || !this.world.character || this.isDead() ||
            this.world.character.isDead() || this.world.gameOver || this.world.win;
    }

    /**
     * Get direction to character.
     * @returns {Object} Calculated layout or data object.
     */
    getDirectionToCharacter() {
        const boss = this.getCenter(this);
        const character = this.getCenter(this.world.character);
        const dx = character.x - boss.x;
        const dy = character.y - boss.y;
        return { dx, dy, distance: Math.hypot(dx, dy) };
    }

    /**
     * Get center.
     * @param {DrawableObject} object - Object to inspect.
     * @returns {Object} Calculated layout or data object.
     */
    getCenter(object) {
        return { x: object.x + object.width / 2, y: object.y + object.height / 2 };
    }

    /**
     * Move towards character.
     * @param {{dx: number, dy: number, distance: number}} direction - Direction vector to the character.
     */
    moveTowardsCharacter(direction) {
        this.x += (direction.dx / direction.distance) * this.chaseSpeed;
        this.y += (direction.dy / direction.distance) * this.chaseSpeed;
        this.y = Math.min(this.maxY, Math.max(this.minY, this.y));
    }

    /**
     * Is player in attack range.
     * @returns {boolean} True when the condition is met.
     */
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

    /**
     * Try attack.
     */
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

    /**
     * Apply attack damage.
     */
    applyAttackDamage() {
        this.attackDamageApplied = true;
        if (this.isPlayerInAttackRange()) {
            this.world.damageCharacter(this.damage);
        }
    }

    /**
     * Cleans up timers and resources.
     */
    cleanup() {
        if (this.spawnInterval) {
            clearInterval(this.spawnInterval);
            this.spawnInterval = null;
        }
        this.stopChasing();
        super.cleanup();
    }
}

