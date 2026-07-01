class StatusBar extends DrawableObject{

    IMAGES = Array.from({length: 6}, (_, i) => `../assets/img/Marcadores/green/Life/${i+1}_Lifebar.png`)
    percentage = 100;

    constructor() {
        this.loadImages(this.IMAGES);
    }

    setPercentage(percentage) {
        this.percentage = percentage;
        let path = this.IMAGES[this.resolveImageIndex()];
        this.img = this.imageCache[path]   
    }

    resolveImageIndex(){

         if(this.percentage === 100) {
            return 5;
        } else if (this.percentage > 80) {
            return 4;
        }  else if (this.percentage > 60) {
            return 3;
        }  else if (this.percentage > 40) {
            return 2;
        }  else if (this.percentage > 20) {
            return 1;
        } else {
            return 0;
        }
    }
}