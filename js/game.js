let canvas;
let world;
let keyboard = new Keyboard();
let ctx;
let currentScreen = 'start';
let startScreen;

function init(){
    ctx = canvas.getContext('2d');
    world = new World(canvas, keyboard);
}

function startGame() {
    currentScreen = 'playing';
    init();
}

function showSettings() {
    console.log('Einstellungen geöffnet');
}

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.error('Fullscreen-Fehler:', err);
        });
    } else {
        document.exitFullscreen();
    }
}

function draw() {
    if(currentScreen === 'start') {
        startScreen.draw(ctx);
    } else if (currentScreen === 'playing' && world) {
        world.draw();
    }

    requestAnimationFrame(draw);
}

canvas = document.getElementById('canvas');
ctx = canvas.getContext('2d');

canvas.addEventListener('click', (e) => {
    if (currentScreen === 'start') {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        startScreen.checkClick(x, y, startGame, showSettings, toggleFullscreen);
    }
});

window.addEventListener('keydown', (e) => {
    if(e.keyCode == 39 || e.keyCode == 68) {
        keyboard.RIGHT = true;
    }

    if(e.keyCode == 37 || e.keyCode == 65) {
        keyboard.LEFT = true;
    }

    if(e.keyCode == 40 || e.keyCode == 83) {
        keyboard.DOWN = true;
    }

    if(e.keyCode == 38 || e.keyCode == 87) {
        keyboard.UP = true;
    }

    if(e.keyCode == 32) {
        keyboard.SPACE  = true;
    }
    if(e.keyCode == 69) { 
        keyboard.E = true;
    }
})

window.addEventListener('keyup', (e) => {
    if(e.keyCode == 39 || e.keyCode == 68) {
        keyboard.RIGHT = false;
    }

    if(e.keyCode == 37 || e.keyCode == 65) {
        keyboard.LEFT = false;
    }

    if(e.keyCode == 40 || e.keyCode == 83) {
        keyboard.DOWN = false;
    }

    if(e.keyCode == 38 || e.keyCode == 87) {
        keyboard.UP = false;
    }

    if(e.keyCode == 32) {
        keyboard.SPACE  = false;
    }
    if(e.keyCode == 69) {
        keyboard.E = false;
    }
})


startScreen = new StartScreen();
draw();