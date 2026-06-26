class JellyFish extends MovableObject {


    constructor() {
        super().loadImage('../assets/img/Enemy/JellyFish/Regular/Purpel1.png')
        this.x = 200 + Math.random() * 500;
        this.height = 70;
        this.width = 70;
    }
}