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

    /** Creates this object. */
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

    /** init counters. */
    initCounters() {
        this.coinCount = 0;
        this.bottleCount = 0;
    }

    /** init state. */
    initState() {
        this.isSpecialAttackPending = false;
        this.isNormalAttackPending = false;
        this.endboss = null;
        this.spawnTriggerDistance = 500;
    }

    /** init bars and character. */
    initBarsAndCharacter() {
        this.statusBarBoss = new StatusBarBoss();
        this.character = new Character();
        this.draw();
        this.setWorld();
        this.character.animate();
        this.run();
    }

    /** set world. */
    setWorld() {
        this.character.world = this;
        this.character.setSoundManager(this.soundManager);
        this.level.enemies.forEach(enemy => enemy.world = this);
    }

    /** pause. */
    pause() {
        this.isPaused = true;
        resetKeyboard();
    }

    /** resume. */
    resume() {
        this.isPaused = false;
        if (this.character) {
            this.character.dontMove();
        }
    }

    /** cleanup. */
    cleanup() {
        this.clearRunInterval();
        this.cleanupCharacter();
        this.cleanupLevelObjects();
        this.cleanupThrowableObjects();
        this.endboss = null;
    }

    /** clear run interval. */
    clearRunInterval() {
        if (!this.runInterval) return;
        clearInterval(this.runInterval);
        this.runInterval = null;
    }

    /** cleanup character. */
    cleanupCharacter() {
        if (this.character && this.character.cleanup) {
            this.character.cleanup();
        }
    }

    /** cleanup level objects. */
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

    /** cleanup object list. */
    cleanupObjectList(key) {
        this.level[key].forEach(object => object.cleanup?.());
        this.level[key] = [];
    }

    /** cleanup throwable objects. */
    cleanupThrowableObjects() {
        this.throwableObjects.forEach(throwableObject => throwableObject.cleanup?.());
        this.throwableObjects = [];
    }

    /** run. */
    run() {
        this.runInterval = setInterval(() => {
            if (this.isPaused || this.gameOver || this.win) return;
            this.checkCollisions();
            this.checkThrowObjects();
            this.checkBossSpawn();
        }, 200);
    }

    /** check throw objects. */
    checkThrowObjects() {
        this.handleAttackInput();
        this.throwPendingAttack();
        this.removeInactiveBubbles();
        this.removeDefeatedEnemies();
    }

    /** handle attack input. */
    handleAttackInput() {
        if (this.keyboard.SPACE && !this.character.isAttacking) this.startNormalAttack();
        if (this.keyboard.E && !this.character.isAttacking && this.bottleCount > 0) this.startSpecialAttack();
    }

    /** start normal attack. */
    startNormalAttack() {
        this.character.startAttack();
        this.isNormalAttackPending = true;
    }

    /** start special attack. */
    startSpecialAttack() {
        this.character.startAttack();
        this.isSpecialAttackPending = true;
    }

    /** throw pending attack. */
    throwPendingAttack() {
        if (!this.character.attackAnimationFinished) return;
        if (this.isNormalAttackPending) return this.throwNormalBubble();
        if (this.isSpecialAttackPending && this.bottleCount > 0) this.throwSpecialBubble();
    }

    /** throw normal bubble. */
    throwNormalBubble() {
        this.throwableObjects.push(this.createBubble(ThrowableObject));
        this.finishAttack();
        this.isNormalAttackPending = false;
    }

    /** throw special bubble. */
    throwSpecialBubble() {
        this.throwableObjects.push(this.createBubble(SpecialBubble));
        this.consumeBottle();
        this.finishAttack();
        this.isSpecialAttackPending = false;
    }

    /** create bubble. */
    createBubble(BubbleClass) {
        return new BubbleClass(this.character.x + 100, this.character.y + 100, this.character.otherDiretion, this);
    }

    /** consume bottle. */
    consumeBottle() {
        this.bottleCount--;
        this.statusBarPosion.setPercentage((this.bottleCount / this.maxBottles) * 100);
    }

    /** finish attack. */
    finishAttack() {
        this.character.resetAttack();
        this.soundManager.playSound('attack');
    }

    /** remove inactive bubbles. */
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

    /** check collisions. */
    checkCollisions() {
        this.checkEnemyCollisions();
        this.checkBubbleCollisions();
        this.checkCollectibleCollisions();
    }

    /** check enemy collisions. */
    checkEnemyCollisions() {
        this.level.enemies.forEach(enemy => {
            if (this.canEnemyDamageCharacter(enemy)) this.damageCharacter(enemy.damage);
        });
    }

    /** can enemy damage character. */
    canEnemyDamageCharacter(enemy) {
        return !(enemy instanceof Endboss) && !this.character.isHurt() &&
            this.character.isColliding(enemy);
    }

    /** check bubble collisions. */
    checkBubbleCollisions() {
        this.throwableObjects.forEach((bubble, index) => this.checkBubbleHit(bubble, index));
    }

    /** check bubble hit. */
    checkBubbleHit(bubble, bubbleIndex) {
        this.level.enemies.forEach(enemy => {
            if (bubble.isColliding(enemy, 6)) this.hitEnemyWithBubble(bubble, bubbleIndex, enemy);
        });
    }

    /** hit enemy with bubble. */
    hitEnemyWithBubble(bubble, bubbleIndex, enemy) {
        enemy.hit(bubble.damage || this.character.attackPower);
        this.throwableObjects.splice(bubbleIndex, 1);
        if (enemy.isDead()) this.soundManager.playSound('enemy_die');
    }

    /** check collectible collisions. */
    checkCollectibleCollisions() {
        this.level.collectibles.forEach((collectible, index) => {
            if (this.canCollect(collectible)) this.collectItem(collectible, index);
        });
    }

    /** can collect. */
    canCollect(collectible) {
        return !collectible.collected && this.character.isColliding(collectible);
    }

    /** collect item. */
    collectItem(collectible, index) {
        collectible.collect();
        if (collectible instanceof Coin) this.collectCoin();
        else if (collectible instanceof Bottle) this.collectBottle();
        collectible.cleanup?.();
        this.level.collectibles.splice(index, 1);
    }

    /** collect coin. */
    collectCoin() {
        this.coinCount++;
        this.statusBarCoin.setPercentage((this.coinCount / this.maxCoins) * 100);
        this.soundManager.playSound('coin');
    }

    /** collect bottle. */
    collectBottle() {
        this.bottleCount++;
        this.statusBarPosion.setPercentage((this.bottleCount / this.maxBottles) * 100);
        this.soundManager.playSound('bottle');
    }

    /** damage character. */
    damageCharacter(damage) {
        this.character.hit(damage);
        this.statusBarLife.setPercentage(this.character.energy);
        this.soundManager.playSound('damage');
        if (this.character.isDead() && !this.gameOver) {
            this.soundManager.playSound('fail');
            this.gameOver = true;
        }
    }

    /** check boss spawn. */
    checkBossSpawn() {
        this.spawnBossIfNeeded();
        if (this.endboss && this.endboss.isSpawned) this.updateBossFight();
    }

    /** spawn boss if needed. */
    spawnBossIfNeeded() {
        const distanceToEnd = this.level.level_end_x - this.character.x;
        if (!this.endboss && distanceToEnd < this.spawnTriggerDistance) {
            this.endboss = new Endboss();
            this.endboss.world = this;
            this.endboss.startSpawn();
            this.level.enemies.push(this.endboss);
        }
    }

    /** update boss fight. */
    updateBossFight() {
        this.updateBossBar();
        this.endboss.tryAttack();
        if (this.endboss.isDead() && !this.win) this.finishWin();
    }

    /** update boss bar. */
    updateBossBar() {
        const percentage = (this.endboss.energy / this.endboss.maxEnergy) * 100;
        this.statusBarBoss.setPercentage(percentage);
    }

    /** finish win. */
    finishWin() {
        this.win = true;
        this.soundManager.playSound('win');
    }

    /** remove defeated enemies. */
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

    /** draw. */
    draw() {
        this.renderer.draw();
    }
}
