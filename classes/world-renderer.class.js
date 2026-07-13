class WorldRenderer {
    /** Creates a renderer for one world. */
    constructor(world) {
        this.world = world;
    }

    /** Draws the complete world. */
    draw() {
        this.world.removeDefeatedEnemies();
        this.clearCanvas();
        this.drawBackgroundLayer();
        this.drawStatusBars();
        this.drawWorldLayer();
    }

    /** Clears the world canvas. */
    clearCanvas() {
        const { ctx, canvas } = this.world;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    /** Draws scrolling background objects. */
    drawBackgroundLayer() {
        this.translateCamera();
        this.addObjectsToMap(this.world.level.backgroundObjects);
        this.resetCamera();
    }

    /** Draws fixed status bars. */
    drawStatusBars() {
        this.addToMap(this.world.statusBarLife);
        this.addToMap(this.world.statusBarCoin);
        this.addToMap(this.world.statusBarPosion);
        if (this.world.endboss && this.world.endboss.isSpawned) this.addToMap(this.world.statusBarBoss);
    }

    /** Draws moving world objects. */
    drawWorldLayer() {
        this.translateCamera();
        this.addToMap(this.world.character);
        this.addObjectsToMap(this.world.level.collectibles);
        this.addObjectsToMap(this.world.level.lights);
        this.addObjectsToMap(this.world.level.enemies);
        this.addObjectsToMap(this.world.throwableObjects);
        this.resetCamera();
    }

    /** Translates the canvas to the camera position. */
    translateCamera() {
        this.world.ctx.translate(this.world.camera_x, 0);
    }

    /** Resets the canvas camera translation. */
    resetCamera() {
        this.world.ctx.translate(-this.world.camera_x, 0);
    }

    /** Draws a list of drawable objects. */
    addObjectsToMap(objects) {
        objects.forEach(obj => this.addToMap(obj));
    }

    /** Draws one object with optional mirroring. */
    addToMap(mo) {
        if (mo.otherDiretion) this.flipImage(mo);
        mo.draw(this.world.ctx);
        this.drawDebugFrame(mo);
        if (mo.otherDiretion) this.flipImageBack(mo);
    }

    /** Draws a debug collision frame if enabled. */
    drawDebugFrame(mo) {
        if (!window.DEBUG) return;
        if (mo instanceof Character) mo.drawFrameCharater(this.world.ctx);
        else if (mo instanceof JellyFish || mo instanceof Endboss) mo.drawFrame(this.world.ctx);
    }

    /** Mirrors an object before drawing. */
    flipImage(mo) {
        this.world.ctx.save();
        this.world.ctx.translate(mo.width, 0);
        this.world.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    /** Restores an object after mirrored drawing. */
    flipImageBack(mo) {
        this.world.ctx.restore();
        mo.x = mo.x * -1;
    }
}
