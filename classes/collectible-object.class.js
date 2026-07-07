class CollectibleObject extends DrawableObject {
    collected = false;
    offsetX = 0;
    offsetY = 0;
    offsetWidth = 0;
    offsetHeight = 0;

    constructor(path,x,y,width,height) {
        super().loadImage(path);
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
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