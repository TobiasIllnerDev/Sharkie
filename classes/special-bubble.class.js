class SpecialBubble extends ThrowableObject {

    constructor(x, y, otherDirection, world) {
        super(x, y, otherDirection);
        this.loadImage('../assets/img/Sharkie/4.Attack/Bubbletrap/Poisoned Bubble (for whale).png'); 
        this.world = world;
        this.damage = world.character.attackPower * 2; 
    }
}