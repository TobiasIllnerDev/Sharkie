/**
 * Represents the playable Sharkie character.
 */
class Character extends MovableObject {
    IMAGES_SWIM = Array.from({length: 6}, (_, i) => `./assets/img/Sharkie/3.Swim/${i+1}.png`);
    IMAGES_DEAD = Array.from({length: 12}, (_, i) => `./assets/img/Sharkie/6.dead/1.Poisoned/${i+1}.png`);
    IMAGES_HURT = Array.from({length: 4}, (_, i) => `./assets/img/Sharkie/5.Hurt/1.Poisoned/${i+1}.png`);
    IMAGES_IDLE = Array.from({length: 18}, (_, i) => `./assets/img/Sharkie/1.IDLE/${i+1}.png`);
    IMAGES_SLEEP = [
        './assets/img/Sharkie/2.Long_IDLE/i1.png',
        ...Array.from({length: 13}, (_, i) => `./assets/img/Sharkie/2.Long_IDLE/I${i+2}.png`)
    ];
    IMAGES_ATTACK = Array.from({length: 8}, (_, i) => `./assets/img/Sharkie/4.Attack/Bubbletrap/op1 (with bubble formation)/${i+1}.png`);
    world;
    isAttacking = false;
    attackAnimationFinished = false;
    speed = 4;
    attackPower = 10;
    soundManager;
    deadSoundPlayed = false;
    isCurrentlySnoring = false;
    animationIntervalId = null;
    moveIntervalId = null;

    /**
     * Creates a new instance.
     */
    constructor() {
        super().loadImage('./assets/img/Sharkie/1.IDLE/1.png');
        this.loadAllImages();
        this.setSize();
        this.setOffsets();
    }

    /**
     * Load all images.
     */
    loadAllImages() {
        [this.IMAGES_SWIM, this.IMAGES_DEAD, this.IMAGES_HURT,
            this.IMAGES_IDLE, this.IMAGES_SLEEP, this.IMAGES_ATTACK]
            .forEach(images => this.loadImages(images));
    }

    /**
     * Set size.
     */
    setSize() {
        this.height = 200;
        this.width = 200;
    }

    /**
     * Set offsets.
     */
    setOffsets() {
        this.offsetX = 40;
        this.offsetY = 90;
        this.offsetWidth = 75;
        this.offsetHeight = 120;
    }

    /**
     * Set sound manager.
     * @param {SoundManager} soundManager - Sound manager used by the game.
     */
    setSoundManager(soundManager) {
        this.soundManager = soundManager;
    }

    /**
     * Stop snoring.
     */
    stopSnoring() {
        this.isCurrentlySnoring = false;

        if (this.soundManager && this.soundManager.sounds['snoring']) {
            this.soundManager.sounds['snoring'].audio.pause();
            this.soundManager.sounds['snoring'].audio.currentTime = 0;
        }
    }

    /**
     * Cleans up timers and resources.
     */
    cleanup() {
        this.stopSnoring();

        if (this.animationIntervalId) {
            clearInterval(this.animationIntervalId);
            this.animationIntervalId = null;
        }

        if (this.moveIntervalId) {
            clearInterval(this.moveIntervalId);
            this.moveIntervalId = null;
        }
    }

    /**
     * Animate.
     */
    animate() {
        this.startAnimationInterval();
        this.startMoveInterval();
    }

    /**
     * Start animation interval.
     */
    startAnimationInterval() {
        this.animationIntervalId = setInterval(() => this.updateAnimation(), 150);
    }

    /**
     * Start move interval.
     */
    startMoveInterval() {
        this.moveIntervalId = setInterval(() => this.updateMovement(), 1000 / 60);
    }

    /**
     * Update animation.
     */
    updateAnimation() {
        if (this.world.isPaused) return;
        if (this.world.win) return this.playWinIdle();
        if (this.isDead()) return this.playDeadAnimation();
        if (this.isHurt()) return this.playAnimation(this.IMAGES_HURT);
        if (this.isAttacking) return this.playAttackAnimation();
        if (this.isMoving()) return this.playSwimAnimation();
        if (this.isAFK()) return this.playSleepAnimation();
        this.playIdleAnimation();
    }

    /**
     * Play win idle.
     */
    playWinIdle() {
        this.stopSnoring();
        this.playAnimation(this.IMAGES_IDLE);
    }

    /**
     * Play dead animation.
     */
    playDeadAnimation() {
        this.playAnimation(this.IMAGES_DEAD);
        if (!this.deadSoundPlayed) this.playDeadSound();
    }

    /**
     * Play dead sound.
     */
    playDeadSound() {
        this.soundManager.playSound('dead');
        this.deadSoundPlayed = true;
    }

    /**
     * Play attack animation.
     */
    playAttackAnimation() {
        this.playAnimation(this.IMAGES_ATTACK);
        if (this.currentImage >= this.IMAGES_ATTACK.length) {
            this.attackAnimationFinished = true;
        }
    }

    /**
     * Is moving.
     * @returns {boolean} True when the condition is met.
     */
    isMoving() {
        return this.world.keyboard.RIGHT || this.world.keyboard.LEFT ||
            this.world.keyboard.UP || this.world.keyboard.DOWN;
    }

    /**
     * Play swim animation.
     */
    playSwimAnimation() {
        this.playAnimation(this.IMAGES_SWIM);
        if (this.isCurrentlySnoring) this.stopSnoring();
    }

    /**
     * Play sleep animation.
     */
    playSleepAnimation() {
        this.playAnimation(this.IMAGES_SLEEP);
        if (!this.isCurrentlySnoring) this.startSnoring();
    }

    /**
     * Start snoring.
     */
    startSnoring() {
        this.soundManager.playSound('snoring');
        this.isCurrentlySnoring = true;
    }

    /**
     * Play idle animation.
     */
    playIdleAnimation() {
        this.playAnimation(this.IMAGES_IDLE);
        if (this.isCurrentlySnoring) this.stopSnoring();
    }

    /**
     * Update movement.
     */
    updateMovement() {
        if (this.world.isPaused) return;
        this.moveHorizontally();
        this.moveVertically();
        this.world.camera_x = -this.x + 50;
    }

    /**
     * Move horizontally.
     */
    moveHorizontally() {
        if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) this.swimRight();
        if (this.world.keyboard.LEFT && this.x > -650) this.swimLeft();
    }

    /**
     * Move vertically.
     */
    moveVertically() {
        if (this.world.keyboard.UP && this.y > -90) this.swimUp();
        if (this.world.keyboard.DOWN && this.y < 320) this.swimDown();
    }

    /**
     * Swim right.
     */
    swimRight() {
        this.x += this.speed;
        this.otherDiretion = false;
        this.dontMove();
    }

    /**
     * Swim left.
     */
    swimLeft() {
        this.x -= this.speed;
        this.otherDiretion = true;
        this.dontMove();
    }

    /**
     * Swim up.
     */
    swimUp() {
        this.y -= this.speed;
        this.dontMove();
    }

    /**
     * Swim down.
     */
    swimDown() {
        this.y += this.speed;
        this.dontMove();
    }

    /**
     * Start attack.
     */
    startAttack() {
        this.isAttacking = true;
        this.attackAnimationFinished = false;
        this.currentImage = 0;
    }

    /**
     * Reset attack.
     */
    resetAttack() {
        this.isAttacking = false;
        this.attackAnimationFinished = false;
    }
}
