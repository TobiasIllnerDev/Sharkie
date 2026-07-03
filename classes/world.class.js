class World {
    character = new Character();
    level = level1
    canvas;
    keyboard;
    ctx;
    camera_x = 0;
    statusBarLife = new StatusBarLife();
    statusBarCoin = new StatusBarCoin();
    statusBarPosion = new StatusBarPosion();
    throwableObjects = [];

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.draw();
        this.setWorld();
        this.run();
    }

    setWorld() {
       this.character.world = this;
    }

    run() {
        setInterval(() => {
           this.checkCollisions();
           this.checkThrowObjects();
        }, 200)
    }

    checkThrowObjects() {
        if(this.keyboard.SPACE && !this.character.isAttacking) {
            this.character.startAttack();
        }
        if(this.character.attackAnimationFinished) {
            let bubble = new ThrowableObject(this.character.x + 100, this.character.y + 100);
            this.throwableObjects.push(bubble);
            this.character.resetAttack();
        }
        this.throwableObjects = this.throwableObjects.filter((bubble) => {
            const distance = Math.abs(bubble.x - bubble.startX);
            return distance < (bubble.maxDistance || 500);
        });
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
                    enemy.hit(this.character.attackPower); 
                    this.throwableObjects.splice(bubbleIndex, 1); 
                }
            });
        });
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.backgroundObjects);
        
        this.ctx.translate(-this.camera_x, 0);
        this.addToMap(this.statusBarLife);
        this.addToMap(this.statusBarCoin);
        this.addToMap(this.statusBarPosion);
        this.ctx.translate(this.camera_x, 0);

        this.addToMap(this.character);
        this.addObjectsToMap(this.level.lights);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.throwableObjects);
        this.ctx.translate(-this.camera_x, 0);
        
        
        let self = this;
        requestAnimationFrame(function(){
            self.draw();
        });
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
        mo.drawFrame(this.ctx);
        mo.drawFrameCharater(this.ctx);

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