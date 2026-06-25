class MovableObject {
    x = 120;
    y = 100;
    height = 200;
    width = 300;
    img;

    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    moveRight() {
        console.log('Moving right')
    }

    moveLeft() {

    }
}