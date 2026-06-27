class World {
    character = new Character();
    enemies = [
        new JellyFish(),
        new JellyFish(),
        new JellyFish(),
    ];
    lights = [
        new Light()
    ]
    backgroundObjects =  [
        new BackgroundObject('../assets/img/Background/Layers/5. Water/D1.png', 0 ),
        new BackgroundObject('../assets/img/Background/Layers/3.Fondo 1/L1.png', 0),
        new BackgroundObject('../assets/img/Background/Layers/4.Fondo 2/L1.png', 0),
        new BackgroundObject('../assets/img/Background/Layers/2. Floor/D1.png', 0),   
    ]
    canvas;
    keyboard;
    ctx;

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.draw();
        this.setWorld();
    }

    setWorld() {
       this.character.world = this;
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.addObjectsToMap(this.backgroundObjects);
        this.addToMap(this.character)
        this.addObjectsToMap(this.lights)
        this.addObjectsToMap(this.enemies)
        
        
        let self = this;
        requestAnimationFrame(function(){
            self.draw();
        });
    }

    addObjectsToMap(objects){
        objects.forEach((obj) => {
            this.addToMap(obj);
        })
    }

    addToMap(mo) {
        this.ctx.drawImage(mo.img, mo.x , mo.y, mo.width, mo.height);
    }
}