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
        new BackgroundObject('../assets/img/Background/Layers/5. Water/D2.png', -719),
        new BackgroundObject('../assets/img/Background/Layers/3.Fondo 1/L2.png', -719),
        new BackgroundObject('../assets/img/Background/Layers/4.Fondo 2/L2.png', -719),
        new BackgroundObject('../assets/img/Background/Layers/2. Floor/D2.png', -719),

        new BackgroundObject('../assets/img/Background/Layers/5. Water/D1.png', 0),
        new BackgroundObject('../assets/img/Background/Layers/3.Fondo 1/L1.png', 0),
        new BackgroundObject('../assets/img/Background/Layers/4.Fondo 2/L1.png', 0),
        new BackgroundObject('../assets/img/Background/Layers/2. Floor/D1.png', 0), 

        new BackgroundObject('../assets/img/Background/Layers/5. Water/D2.png', 719),
        new BackgroundObject('../assets/img/Background/Layers/3.Fondo 1/L2.png', 719),
        new BackgroundObject('../assets/img/Background/Layers/4.Fondo 2/L2.png', 719),
        new BackgroundObject('../assets/img/Background/Layers/2. Floor/D2.png', 719),
        
        new BackgroundObject('../assets/img/Background/Layers/5. Water/D1.png', 719*2),
        new BackgroundObject('../assets/img/Background/Layers/3.Fondo 1/L1.png', 719*2),
        new BackgroundObject('../assets/img/Background/Layers/4.Fondo 2/L1.png', 719*2),
        new BackgroundObject('../assets/img/Background/Layers/2. Floor/D1.png', 719*2),

        new BackgroundObject('../assets/img/Background/Layers/5. Water/D2.png', 719*3),
        new BackgroundObject('../assets/img/Background/Layers/3.Fondo 1/L2.png', 719*3),
        new BackgroundObject('../assets/img/Background/Layers/4.Fondo 2/L2.png', 719*3),
        new BackgroundObject('../assets/img/Background/Layers/2. Floor/D2.png', 719*3),
        
    ]
    canvas;
    keyboard;
    ctx;
    camera_x = 0;

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
        
        this.ctx.translate(this.camera_x, 0);

        this.addObjectsToMap(this.backgroundObjects);
        this.addToMap(this.character)
        this.addObjectsToMap(this.lights)
        this.addObjectsToMap(this.enemies)
        
        this.ctx.translate(-this.camera_x, 0);
        
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
        if(mo.otherDiretion) {
            this.ctx.save();
            this.ctx.translate(mo.width, 0);
            this.ctx.scale(-1, 1);
            mo.x = mo.x * -1;
        }
        this.ctx.drawImage(mo.img, mo.x , mo.y, mo.width, mo.height);
        if(mo.otherDiretion) {
            this.ctx.restore();
            mo.x = mo.x * -1;
        }
        
    }
}