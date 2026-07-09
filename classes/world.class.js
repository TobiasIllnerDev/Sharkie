class World {
    character = new Character();
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

    constructor(canvas, keyboard, soundManager) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.soundManager = soundManager;
        this.coinCount = 0;
        this.bottleCount = 0;
        this.isSpecialAttackPending = false;
        this.isNormalAttackPending = false; 
        this.endboss = null;
        this.spawnTriggerDistance = 500;
        this.statusBarBoss = new StatusBarBoss();
        this.draw();
        this.setWorld();
        this.character.animate();
        this.run();
    }

    setWorld() {
       this.character.world = this;
    }

    run() {
        setInterval(() => {
           this.checkCollisions();
           this.checkThrowObjects();
           this.checkBossSpawn(); 
        }, 200)
    }

   checkThrowObjects() {
        if(this.keyboard.SPACE && !this.character.isAttacking) {
            this.character.startAttack();
            this.isNormalAttackPending = true;
        }
        
        
        if(this.keyboard.E && !this.character.isAttacking && this.bottleCount > 0) {
            this.character.startAttack();
            this.isSpecialAttackPending = true;
        }

        if(this.character.attackAnimationFinished) {
            
            if(this.isNormalAttackPending) {
                let bubble = new ThrowableObject(this.character.x + 100, this.character.y + 100, this.character.otherDiretion);
                this.throwableObjects.push(bubble);
                this.character.resetAttack();
                this.soundManager.playSound('attack');
                this.isNormalAttackPending = false;
            }
            
            else if(this.isSpecialAttackPending && this.bottleCount > 0) {
                let specialBubble = new SpecialBubble(this.character.x + 100, this.character.y + 100, this.character.otherDiretion, this);
                this.throwableObjects.push(specialBubble);

                
                this.bottleCount--;
                let percentage = (this.bottleCount / 20) * 100;
                this.statusBarPosion.setPercentage(percentage);

                this.character.resetAttack();
                this.soundManager.playSound('attack');
                this.isSpecialAttackPending = false;  
            }
        }
        this.throwableObjects = this.throwableObjects.filter((bubble) => {
            const distance = Math.abs(bubble.x - bubble.startX);
            return distance < (bubble.maxDistance || 500);
        });
        this.level.enemies = this.level.enemies.filter(enemy => !enemy.shouldRemove);
    }

    checkCollisions() {
        this.level.enemies.forEach((enemy) => {
            if(this.character.isColliding(enemy)) {
                this.character.hit(enemy.damage);
                this.statusBarLife.setPercentage(this.character.energy);
            }
        });
        this.throwableObjects.forEach((bubble, bubbleIndex) => {
            this.level.enemies.forEach((enemy) => {
                if(bubble.isColliding(enemy)) {
                    let damage = bubble.damage || this.character.attackPower;
                    enemy.hit(damage);
                    this.throwableObjects.splice(bubbleIndex, 1);

                    if(enemy.isDead()) {
                        this.soundManager.playSound('enemy_die');
                        this.level.enemies.splice(enemyIndex, 1)
                    }
                }
            });
        });
        this.level.collectibles.forEach((collectible, index) => {
            if (!collectible.collected && this.character.isColliding(collectible)) {
                collectible.collect();

                if (collectible instanceof Coin) {
                    this.coinCount++;
                    let percentage = (this.coinCount / 20) * 100;
                    this.statusBarCoin.setPercentage(percentage);
                    this.soundManager.playSound('coin')
                }
                else if (collectible instanceof Bottle) {
                    this.bottleCount++;
                    let percentage = (this.bottleCount / 20) * 100;
                    this.statusBarPosion.setPercentage(percentage);
                    this.soundManager.playSound('bottle')
                }
                this.level.collectibles.splice(index, 1);
            }
        });
    }

    checkBossSpawn() {
    const distanceToEnd = this.level.level_end_x - this.character.x;
    if (!this.endboss && distanceToEnd < this.spawnTriggerDistance) {
        this.endboss = new Endboss();
        this.endboss.startSpawn();
        this.level.enemies.push(this.endboss);  
    }
    if (this.endboss && this.endboss.isSpawned) {
        this.statusBarBoss.setPercentage(this.endboss.energy);
    }
}

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.backgroundObjects); 
        this.ctx.translate(-this.camera_x, 0);
        this.addToMap(this.statusBarLife);
        this.addToMap(this.statusBarCoin);
        this.addToMap(this.statusBarPosion);
        if (this.endboss && this.endboss.isSpawned) {
            this.addToMap(this.statusBarBoss);
        }
        this.ctx.translate(this.camera_x, 0);
        this.addToMap(this.character);
        this.addObjectsToMap(this.level.collectibles);
        this.addObjectsToMap(this.level.lights);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.throwableObjects);
        this.ctx.translate(-this.camera_x, 0);
    }

    addObjectsToMap(objects){
        objects.forEach((obj) => {
            this.addToMap(obj);
        })
    }

   addToMap(mo) {
        if(mo.otherDiretion) {
            this.flipImage(mo);
        }

        mo.draw(this.ctx);

        if (mo instanceof Character) {
            mo.drawFrameCharater(this.ctx);
        }
        else if (mo instanceof JellyFish || mo instanceof Endboss) {
            mo.drawFrame(this.ctx);
        }

        if(mo.otherDiretion) {
            this.flipImageBack(mo);
        }
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