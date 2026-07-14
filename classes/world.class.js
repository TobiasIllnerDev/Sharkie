/** Coordinates the game world, objects, collisions and state. */
class World {
    character;
    level = getLevel1();
    canvas;
    keyboard;
    soundManager;
    ctx;
    camera_x = 0;
    statusBarLife = new StatusBarLife();
    statusBarCoin = new StatusBarCoin();
    statusBarPosion = new StatusBarPosion();
    throwableObjects = [];
    runInterval = null;
    isPaused = false;
    maxCoins = 10;
    maxBottles = 10;
    
    /**
     * Creates a new instance.
     * @param {HTMLCanvasElement} canvas - Game canvas element.
     * @param {Keyboard} keyboard - Keyboard state object.
     * @param {SoundManager} soundManager - Sound manager used by the game.
     */
    constructor(canvas, keyboard, soundManager) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.soundManager = soundManager;
        this.initCounters();
        this.initState();
        this.renderer = new WorldRenderer(this);
        this.initBarsAndCharacter();
    }

    /** Initializes collectible counters. */
    initCounters() {
        this.coinCount = 0;
        this.bottleCount = 0;
    }

    /** Initializes runtime state. */
    initState() {
        this.isSpecialAttackPending = false;
        this.isNormalAttackPending = false;
        this.endboss = null;
        this.spawnTriggerDistance = 500;
    }

    /** Initializes status bars and the character. */
    initBarsAndCharacter() {
        this.statusBarBoss = new StatusBarBoss();
        this.character = new Character();
        this.draw();
        this.setWorld();
        this.character.animate();
        this.run();
    }

    /** Connects world references to game objects. */
    setWorld() {
        this.character.world = this;
        this.character.setSoundManager(this.soundManager);
        this.level.enemies.forEach(enemy => enemy.world = this);
    }

    /** Pauses the world. */
    pause() {
        this.isPaused = true;
        resetKeyboard();
    }

    /** Resumes the world. */
    resume() {
        this.isPaused = false;
        if (this.character) {
            this.character.dontMove();
        }
    }

    /** Cleans up timers and resources. */
    cleanup() {
        this.clearRunInterval();
        this.cleanupCharacter();
        this.cleanupLevelObjects();
        this.cleanupThrowableObjects();
        this.endboss = null;
    }

    /** Clear run interval. */
    clearRunInterval() {
        if (!this.runInterval) return;
        clearInterval(this.runInterval);
        this.runInterval = null;
    }

    /** Cleanup character. */
    cleanupCharacter() {
        if (this.character && this.character.cleanup) {
            this.character.cleanup();
        }
    }

    /** Cleanup level objects. */
    cleanupLevelObjects() {
        if (this.level && this.level.enemies) {
            this.cleanupObjectList('enemies');
        }
        if (this.level && this.level.collectibles) {
            this.cleanupObjectList('collectibles');
        }
        if (this.level && this.level.lights) {
            this.cleanupObjectList('lights');
        }
    }

    /**
     * Cleans up one level object list.
     * @param {string} key - Level object list key.
     */
    cleanupObjectList(key) {
        this.level[key].forEach(object => object.cleanup?.());
        this.level[key] = [];
    }

    /** Cleanup throwable objects. */
    cleanupThrowableObjects() {
        this.throwableObjects.forEach(throwableObject => throwableObject.cleanup?.());
        this.throwableObjects = [];
    }

    /** Starts the world update loop. */
    run() {
        this.runInterval = setInterval(() => {
            if (this.isPaused || this.gameOver || this.win) return;
            this.checkCollisions();
            this.checkThrowObjects();
            this.checkBossSpawn();
        }, 200);
    }

    /** Updates throwable objects. */
    checkThrowObjects() {
        this.handleAttackInput();
        this.throwPendingAttack();
        this.removeInactiveBubbles();
        this.removeDefeatedEnemies();
    }

    /** Handles attack input. */
    handleAttackInput() {
        if (this.keyboard.SPACE && !this.character.isAttacking) this.startNormalAttack();
        if (this.keyboard.E && !this.character.isAttacking && this.bottleCount > 0) this.startSpecialAttack();
    }
    
    /** Starts a normal attack. */
    startNormalAttack() {
        this.character.startAttack();
        this.isNormalAttackPending = true;
    }

    /** Starts a special attack. */
    startSpecialAttack() {
        this.character.startAttack();
        this.isSpecialAttackPending = true;
    }

    /** Throws the pending attack projectile. */
    throwPendingAttack() {
        if (!this.character.attackAnimationFinished) return;
        if (this.isNormalAttackPending) return this.throwNormalBubble();
        if (this.isSpecialAttackPending && this.bottleCount > 0) this.throwSpecialBubble();
    }

    /** Throws a normal bubble. */
    throwNormalBubble() {
        this.throwableObjects.push(this.createBubble(ThrowableObject));
        this.finishAttack();
        this.isNormalAttackPending = false;
    }

    /** Throws a special bubble. */
    throwSpecialBubble() {
        this.throwableObjects.push(this.createBubble(SpecialBubble));
        this.consumeBottle();
        this.finishAttack();
        this.isSpecialAttackPending = false;
    }

    /**
     * Creates a bubble projectile.
     * @param {typeof ThrowableObject} BubbleClass - Bubble class constructor.
     * @returns {ThrowableObject} Created bubble projectile.
     */
    createBubble(BubbleClass) {
        return new BubbleClass(this.character.x + 100, this.character.y + 100, this.character.otherDiretion, this);
    }

    /** Consumes one poison bottle. */
    consumeBottle() {
        this.bottleCount--;
        this.statusBarPosion.setPercentage((this.bottleCount / this.maxBottles) * 100);
    }

    /** Finishes the current attack. */
    finishAttack() {
        this.character.resetAttack();
        this.soundManager.playSound('attack');
    }

    /** Removes bubbles that exceeded their range. */
    removeInactiveBubbles() {
        this.throwableObjects = this.throwableObjects.filter((bubble) => {
            const distance = Math.abs(bubble.x - bubble.startX);
            const isStillActive = distance < (bubble.maxDistance || 500);
            if (!isStillActive) {
                bubble.cleanup?.();
            }
            return isStillActive;
        });
    }

    /** Checks all collision groups. */
    checkCollisions() {
        this.checkEnemyCollisions();
        this.checkBubbleCollisions();
        this.checkCollectibleCollisions();
    }

    /** Checks collisions with enemies. */
    checkEnemyCollisions() {
        this.level.enemies.forEach(enemy => {
            if (this.canEnemyDamageCharacter(enemy)) this.damageCharacter(enemy.damage);
        });
    }

    /**
     * Checks whether an enemy can damage the character.
     * @param {MovableObject} enemy - Enemy object.
     * @returns {boolean} True when the condition is met.
     */
    canEnemyDamageCharacter(enemy) {
        return !(enemy instanceof Endboss) && !this.character.isHurt() &&
            this.character.isColliding(enemy);
    }
    /** Checks collisions between bubbles and enemies. */
    checkBubbleCollisions() {
        this.throwableObjects.forEach((bubble, index) => this.checkBubbleHit(bubble, index));
    }

    /**
     * Checks whether one bubble hits an enemy.
     * @param {ThrowableObject} bubble - Bubble projectile.
     * @param {number} bubbleIndex - Index of the bubble in the throwable list.
     */
    checkBubbleHit(bubble, bubbleIndex) {
        this.level.enemies.forEach(enemy => {
            if (bubble.isColliding(enemy, 6)) this.hitEnemyWithBubble(bubble, bubbleIndex, enemy);
        });
    }

    /**
     * Applies bubble damage to an enemy.
     * @param {ThrowableObject} bubble - Bubble projectile.
     * @param {number} bubbleIndex - Index of the bubble in the throwable list.
     * @param {MovableObject} enemy - Enemy object.
     */
    hitEnemyWithBubble(bubble, bubbleIndex, enemy) {
        enemy.hit(bubble.damage || this.character.attackPower);
        this.throwableObjects.splice(bubbleIndex, 1);
        if (enemy.isDead()) this.soundManager.playSound('enemy_die');
    }

    /** Checks collectible collisions. */
    checkCollectibleCollisions() {
        this.level.collectibles.forEach((collectible, index) => {
            if (this.canCollect(collectible)) this.collectItem(collectible, index);
        });
    }

    /**
     * Checks whether a collectible can be collected.
     * @param {CollectibleObject} collectible - Collectible object.
     * @returns {boolean} True when the condition is met.
     */
    canCollect(collectible) {
        return !collectible.collected && this.character.isColliding(collectible);
    }

    /**
     * Collects one item.
     * @param {CollectibleObject} collectible - Collectible object.
     * @param {number} index - Index in the object list.
     */
    collectItem(collectible, index) {
        collectible.collect();
        if (collectible instanceof Coin) this.collectCoin();
        else if (collectible instanceof Bottle) this.collectBottle();
        collectible.cleanup?.();
        this.level.collectibles.splice(index, 1);
    }

    /** Collects one coin. */
    collectCoin() {
        this.coinCount++;
        this.statusBarCoin.setPercentage((this.coinCount / this.maxCoins) * 100);
        this.soundManager.playSound('coin');
    }

    /** Collects one bottle. */
    collectBottle() {
        this.bottleCount++;
        this.statusBarPosion.setPercentage((this.bottleCount / this.maxBottles) * 100);
        this.soundManager.playSound('bottle');
    }

    /**
     * Damages the character.
     * @param {number} damage - Damage amount.
     */
    damageCharacter(damage) {
        this.character.hit(damage);
        this.statusBarLife.setPercentage(this.character.energy);
        this.soundManager.playSound('damage');
        if (this.character.isDead() && !this.gameOver) {
            this.soundManager.playSound('fail');
            this.gameOver = true;
        }
    }

    /** Checks boss spawning and boss updates. */
    checkBossSpawn() {
        this.spawnBossIfNeeded();
        if (this.endboss && this.endboss.isSpawned) this.updateBossFight();
    }

    /** Spawns the boss when the trigger is reached. */
    spawnBossIfNeeded() {
        const distanceToEnd = this.level.level_end_x - this.character.x;
        if (!this.endboss && distanceToEnd < this.spawnTriggerDistance) {
            this.endboss = new Endboss();
            this.endboss.world = this;
            this.endboss.startSpawn();
            this.level.enemies.push(this.endboss);
        }
    }

    /** Updates the boss fight. */
    updateBossFight() {
        this.updateBossBar();
        this.endboss.tryAttack();
        if (this.endboss.isDead() && !this.win) this.finishWin();
    }

    /** Updates the boss status bar. */
    updateBossBar() {
        const percentage = (this.endboss.energy / this.endboss.maxEnergy) * 100;
        this.statusBarBoss.setPercentage(percentage);
    }

    /** Finishes the game with a win. */
    finishWin() {
        this.win = true;
        this.soundManager.playSound('win');
    }

    /**
     * Removes defeated enemies from the level.
     */
    removeDefeatedEnemies() {
        this.level.enemies = this.level.enemies.filter(enemy => {
            if (!enemy.shouldRemove) {
                return true;
            }

            enemy.cleanup?.();
            if (enemy === this.endboss) {
                this.endboss = null;
            }
            return false;
        });
    }

    /** Draws the object. */
    draw() {
        this.renderer.draw();
    }
}
