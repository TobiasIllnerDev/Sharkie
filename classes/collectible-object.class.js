class CollectibleObject extends DrawableObject {
    collected = false;
    offsetX = 0;
    offsetY = 0;
    offsetWidth = 0;
    offsetHeight = 0;
    currentImage = 0;
    animationInterval = null;

    constructor(paths,x,y,width,height) {
        super()
        this.images = paths;
        this.loadImages(paths);
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.animate();

    }

    animate() {
        this.animationInterval = setInterval(() => {
            this.playAnimation(this.images);
        }, 200);
    }

    cleanup() {
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
            this.animationInterval = null;
        }
    }

    playAnimation(images) {
        if (!images || images.length === 0) return; 
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }
    
    collect() {
        this.collected = true;
    }

    isColliding(mo) {
        return this.x + this.offsetX + (this.width - this.offsetWidth) > mo.x + mo.offsetX &&
            this.y + this.offsetY + (this.height - this.offsetHeight) > mo.y + mo.offsetY &&
            this.x + this.offsetX < mo.x + mo.offsetX + (mo.width - mo.offsetWidth) &&
            this.y + this.offsetY < mo.y + mo.offsetY + (mo.height - mo.offsetHeight);
    }
}
