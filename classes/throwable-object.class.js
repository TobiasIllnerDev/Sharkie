class ThrowableObject extends MovableObject {

    constructor(x, y) {
        super().loadImage('../assets/img/Sharkie/4.Attack/Bubbletrap/Bubble.png');
        this.x = x;
        this.y = y;
        this.height = 40;
        this.width = 40;
        this.trow();
    }

    trow() {
        
        this.moveRight();
        
    }
}