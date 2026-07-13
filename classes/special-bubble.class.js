class SpecialBubble extends ThrowableObject {

    /** Creates this object. */
    constructor(x, y, otherDirection, world) {
        super(x, y, otherDirection, world);
        this.loadImage('../assets/img/Sharkie/4.Attack/Bubbletrap/Poisoned Bubble (for whale).png'); 
        this.world = world;
        this.damage = world.character.attackPower * 2; 
    }
}
