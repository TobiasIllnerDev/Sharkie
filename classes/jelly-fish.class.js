class JellyFish extends MovableObject {
    damage = 10;
    height = 55;
    width = 55;
    speed = 0.15 + Math.random() * 0.25;
    energy = 10;
    shouldRemove = false;

    initJellyFish(x, y) {
        this.loadImage(this.IMAGES_FLOATING[0]);
        this.loadImages(this.IMAGES_FLOATING);
        this.loadImages(this.IMAGES_DEAD);
        this.setPosition(x, y);
        this.setCollisionOffsets();
        this.hasStartedDeadAnimation = false;
        this.animate();
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }

    setCollisionOffsets() {
        this.offsetHeight = 10;
        this.offsetWidth = 10;
        this.offsetX = 5;
        this.offsetY = 5;
    }

    animate() {
        this.moveLeft();
        this.animationInterval = setInterval(() => this.updateAnimation(), 250);
    }

    updateAnimation() {
        if (this.isDead()) return this.playDeadAnimation();
        this.playAnimation(this.IMAGES_FLOATING);
    }

    playDeadAnimation() {
        if (!this.hasStartedDeadAnimation) this.startDeadAnimation();
        this.playAnimation(this.IMAGES_DEAD);
        if (this.currentImage >= this.IMAGES_DEAD.length) this.shouldRemove = true;
    }

    startDeadAnimation() {
        this.currentImage = 0;
        this.hasStartedDeadAnimation = true;
    }
}
