class ThrowableObject extends MovableObject {
    maxDistance = 400;
    startX = 0;
    constructor(x, y, otherDiretion = false, world = null) {
        super().loadImage('../assets/img/Sharkie/4.Attack/Bubbletrap/Bubble.png');
        this.world = world;
        this.startX = x;
        this.x = x;
        this.y = y;
        this.height = 40;
        this.width = 40;
        this.otherDiretion = otherDiretion; 
        this.trow();
    }

   trow() {
        if(this.otherDiretion) {
            this.moveLeft();
        } else {
            this.moveRight();  
        }
    }

    moveLeft() {
        this.clearMoveInterval();
        this.moveInterval = setInterval(() => {
            if (this.world && this.world.isPaused) {
                return;
            }

            let speedX = 10;
            this.x -= speedX;
        }, 1000 / 60);
    }
}
