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

    constructor(canvas, keyboard, soundManager) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.soundManager = soundManager;
        this.initCounters();
        this.initState();
        this.initBarsAndCharacter();
    }

    initCounters() {
        this.coinCount = 0;
        this.bottleCount = 0;
    }

    initState() {
        this.isSpecialAttackPending = false;
        this.isNormalAttackPending = false;
        this.endboss = null;
        this.spawnTriggerDistance = 500;
    }

    initBarsAndCharacter() {
        this.statusBarBoss = new StatusBarBoss();
        this.character = new Character();
        this.draw();
        this.setWorld();
        this.character.animate();
        this.run();
    }

    setWorld() {
        this.character.world = this;
        this.character.setSoundManager(this.soundManager);
        this.level.enemies.forEach(enemy => enemy.world = this);
    }

    pause() {
        this.isPaused = true;
        resetKeyboard();
    }

    resume() {
        this.isPaused = false;
        if (this.character) {
            this.character.dontMove();
        }
    }

    cleanup() {
        this.clearRunInterval();
        this.cleanupCharacter();
        this.cleanupLevelObjects();
        this.cleanupThrowableObjects();
        this.endboss = null;
    }

    clearRunInterval() {
        if (!this.runInterval) return;
        clearInterval(this.runInterval);
        this.runInterval = null;
    }

    cleanupCharacter() {
        if (this.character && this.character.cleanup) {
            this.character.cleanup();
        }
    }

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

    cleanupObjectList(key) {
        this.level[key].forEach(object => object.cleanup?.());
        this.level[key] = [];
    }

    cleanupThrowableObjects() {
        this.throwableObjects.forEach(throwableObject => throwableObject.cleanup?.());
        this.throwableObjects = [];
    }

    run() {
        this.runInterval = setInterval(() => {
            if (this.isPaused || this.gameOver || this.win) return;
            this.checkCollisions();
            this.checkThrowObjects();
            this.checkBossSpawn();
        }, 200);
    }

    checkThrowObjects() {
        this.handleAttackInput();
        this.throwPendingAttack();
        this.removeInactiveBubbles();
        this.removeDefeatedEnemies();
    }

    handleAttackInput() {
        if (this.keyboard.SPACE && !this.character.isAttacking) this.startNormalAttack();
        if (this.keyboard.E && !this.character.isAttacking && this.bottleCount > 0) this.startSpecialAttack();
    }

    startNormalAttack() {
        this.character.startAttack();
        this.isNormalAttackPending = true;
    }

    startSpecialAttack() {
        this.character.startAttack();
        this.isSpecialAttackPending = true;
    }

    throwPendingAttack() {
        if (!this.character.attackAnimationFinished) return;
        if (this.isNormalAttackPending) return this.throwNormalBubble();
        if (this.isSpecialAttackPending && this.bottleCount > 0) this.throwSpecialBubble();
    }

    throwNormalBubble() {
        this.throwableObjects.push(this.createBubble(ThrowableObject));
        this.finishAttack();
        this.isNormalAttackPending = false;
    }

    throwSpecialBubble() {
        this.throwableObjects.push(this.createBubble(SpecialBubble));
        this.consumeBottle();
        this.finishAttack();
        this.isSpecialAttackPending = false;
    }

    createBubble(BubbleClass) {
        return new BubbleClass(this.character.x + 100, this.character.y + 100, this.character.otherDiretion, this);
    }

    consumeBottle() {
        this.bottleCount--;
        this.statusBarPosion.setPercentage((this.bottleCount / this.maxBottles) * 100);
    }

    finishAttack() {
        this.character.resetAttack();
        this.soundManager.playSound('attack');
    }

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

    checkCollisions() {
        this.checkEnemyCollisions();
        this.checkBubbleCollisions();
        this.checkCollectibleCollisions();
    }

    checkEnemyCollisions() {
        this.level.enemies.forEach(enemy => {
            if (this.canEnemyDamageCharacter(enemy)) this.damageCharacter(enemy.damage);
        });
    }

    canEnemyDamageCharacter(enemy) {
        return !(enemy instanceof Endboss) && !this.character.isHurt() &&
            this.character.isColliding(enemy);
    }

    checkBubbleCollisions() {
        this.throwableObjects.forEach((bubble, index) => this.checkBubbleHit(bubble, index));
    }

    checkBubbleHit(bubble, bubbleIndex) {
        this.level.enemies.forEach(enemy => {
            if (bubble.isColliding(enemy, 6)) this.hitEnemyWithBubble(bubble, bubbleIndex, enemy);
        });
    }

    hitEnemyWithBubble(bubble, bubbleIndex, enemy) {
        enemy.hit(bubble.damage || this.character.attackPower);
        this.throwableObjects.splice(bubbleIndex, 1);
        if (enemy.isDead()) this.soundManager.playSound('enemy_die');
    }

    checkCollectibleCollisions() {
        this.level.collectibles.forEach((collectible, index) => {
            if (this.canCollect(collectible)) this.collectItem(collectible, index);
        });
    }

    canCollect(collectible) {
        return !collectible.collected && this.character.isColliding(collectible);
    }

    collectItem(collectible, index) {
        collectible.collect();
        if (collectible instanceof Coin) this.collectCoin();
        else if (collectible instanceof Bottle) this.collectBottle();
        collectible.cleanup?.();
        this.level.collectibles.splice(index, 1);
    }

    collectCoin() {
        this.coinCount++;
        this.statusBarCoin.setPercentage((this.coinCount / this.maxCoins) * 100);
        this.soundManager.playSound('coin');
    }

    collectBottle() {
        this.bottleCount++;
        this.statusBarPosion.setPercentage((this.bottleCount / this.maxBottles) * 100);
        this.soundManager.playSound('bottle');
    }

    damageCharacter(damage) {
        this.character.hit(damage);
        this.statusBarLife.setPercentage(this.character.energy);
        this.soundManager.playSound('damage');
        if (this.character.isDead() && !this.gameOver) {
            this.soundManager.playSound('fail');
            this.gameOver = true;
        }
    }

    checkBossSpawn() {
        this.spawnBossIfNeeded();
        if (this.endboss && this.endboss.isSpawned) this.updateBossFight();
    }

    spawnBossIfNeeded() {
        const distanceToEnd = this.level.level_end_x - this.character.x;
        if (!this.endboss && distanceToEnd < this.spawnTriggerDistance) {
            this.endboss = new Endboss();
            this.endboss.world = this;
            this.endboss.startSpawn();
            this.level.enemies.push(this.endboss);
        }
    }

    updateBossFight() {
        this.updateBossBar();
        this.endboss.tryAttack();
        if (this.endboss.isDead() && !this.win) this.finishWin();
    }

    updateBossBar() {
        const percentage = (this.endboss.energy / this.endboss.maxEnergy) * 100;
        this.statusBarBoss.setPercentage(percentage);
    }

    finishWin() {
        this.win = true;
        this.soundManager.playSound('win');
    }

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

    draw() {
        this.removeDefeatedEnemies();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawBackgroundLayer();
        this.drawStatusBars();
        this.drawWorldLayer();
    }

    drawBackgroundLayer() {
        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.backgroundObjects);
        this.ctx.translate(-this.camera_x, 0);
    }

    drawStatusBars() {
        this.addToMap(this.statusBarLife);
        this.addToMap(this.statusBarCoin);
        this.addToMap(this.statusBarPosion);
        if (this.endboss && this.endboss.isSpawned) {
            this.addToMap(this.statusBarBoss);
        }
    }

    drawWorldLayer() {
        this.ctx.translate(this.camera_x, 0);
        this.addToMap(this.character);
        this.addObjectsToMap(this.level.collectibles);
        this.addObjectsToMap(this.level.lights);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.throwableObjects);
        this.ctx.translate(-this.camera_x, 0);
    }

    addObjectsToMap(objects) {
        objects.forEach((obj) => {
            this.addToMap(obj);
        });
    }

    addToMap(mo) {
        if (mo.otherDiretion) this.flipImage(mo);
        mo.draw(this.ctx);
        this.drawDebugFrame(mo);
        if (mo.otherDiretion) this.flipImageBack(mo);
    }

    drawDebugFrame(mo) {
        if (!window.DEBUG) return;
        if (mo instanceof Character) mo.drawFrameCharater(this.ctx);
        else if (mo instanceof JellyFish || mo instanceof Endboss) mo.drawFrame(this.ctx);
    }

    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    flipImageBack(mo) {
        this.ctx.restore();
        mo.x = mo.x * -1;
    }
}
