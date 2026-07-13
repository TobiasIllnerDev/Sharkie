/** Creates a numbered array with a mapper callback. */
function range(length, callback) {
    return Array.from({ length }, (_, i) => callback(i + 1));
}

const INITIAL_IMAGE_ASSETS = [
    './assets/img/Background/underwater.png',
    './assets/img/Botones/Key/arrow keys.png',
    './assets/img/Botones/Key/WASD-Key.png',
    './assets/img/Botones/Key/Space Bar key.png',
    './assets/img/Botones/Key/E-Key.png',
    './assets/img/Botones/Start/Start-button.png',
    './assets/img/Botones/Start/Einstellung-button.png',
    './assets/img/Botones/Start/Anleitung-button.png',
    '../assets/img/Botones/Tittles/Game Over/Recurso 9.png',
    '../assets/img/Botones/Tittles/You win/Mesa de trabajo 1.png',
    '../assets/img/Botones/Try again/Recurso 15.png',
    '../assets/img/Sharkie/1.IDLE/1.png',
    '../assets/img/Sharkie/4.Attack/Bubbletrap/Bubble.png',
    '../assets/img/Sharkie/4.Attack/Bubbletrap/Poisoned Bubble (for whale).png',
    '../assets/img/Background/Layers/1. Light/1.png',
    '../assets/img/Background/Layers/5. Water/D1.png',
    '../assets/img/Background/Layers/5. Water/D2.png',
    '../assets/img/Background/Layers/3.Fondo 1/L1.png',
    '../assets/img/Background/Layers/3.Fondo 1/L2.png',
    '../assets/img/Background/Layers/4.Fondo 2/L1.png',
    '../assets/img/Background/Layers/4.Fondo 2/L2.png',
    '../assets/img/Background/Layers/2. Floor/D1.png',
    '../assets/img/Background/Layers/2. Floor/D2.png',
    ...range(18, i => `../assets/img/Sharkie/1.IDLE/${i}.png`),
    ...range(6, i => `../assets/img/Sharkie/3.Swim/${i}.png`),
    ...range(12, i => `../assets/img/Sharkie/6.dead/1.Poisoned/${i}.png`),
    ...range(5, i => `../assets/img/Sharkie/5.Hurt/1.Poisoned/${i}.png`),
    ...range(14, i => `../assets/img/Sharkie/2.Long_IDLE/i${i}.png`),
    ...range(8, i => `../assets/img/Sharkie/4.Attack/Bubbletrap/op1 (with bubble formation)/${i}.png`),
    ...range(4, i => `../assets/img/Enemy/JellyFish/Regular/Yellow ${i}.png`),
    ...range(4, i => `../assets/img/Enemy/JellyFish/Dead/Yellow/y${i}.png`),
    ...range(4, i => `../assets/img/Enemy/JellyFish/Regular/Purpel${i}.png`),
    ...range(4, i => `../assets/img/Enemy/JellyFish/Dead/Lila/L${i}.png`),
    ...range(4, i => `../assets/img/Enemy/JellyFish/Súper dangerous/Pink ${i}.png`),
    ...range(4, i => `../assets/img/Enemy/JellyFish/Dead/Pink/P${i}.png`),
    ...range(4, i => `../assets/img/Enemy/JellyFish/Súper dangerous/Green ${i}.png`),
    ...range(4, i => `../assets/img/Enemy/JellyFish/Dead/green/g${i}.png`),
    ...range(13, i => `../assets/img/Enemy/FinalBoss/2.floating/${i}.png`),
    ...range(10, i => `../assets/img/Enemy/FinalBoss/1.Introduce/${i}.png`),
    ...range(6, i => `../assets/img/Enemy/FinalBoss/Attack/${i}.png`),
    ...range(4, i => `../assets/img/Enemy/FinalBoss/Hurt/${i}.png`),
    ...range(5, i => `../assets/img/Enemy/FinalBoss/Dead/Dead_${i}.png`),
    ...range(6, i => `../assets/img/Marcadores/green/Life/${i}_Lifebar.png`),
    ...range(6, i => `../assets/img/Marcadores/green/Coin/${i}_Coin.png`),
    ...range(6, i => `../assets/img/Marcadores/green/Posion/${i}_Posion.png`),
    ...range(4, i => `../assets/img/Marcadores/1. Coins/${i}.png`)
];

/** Restores the persisted volume from local storage. */
function restoreSavedVolume() {
    const storedVolume = localStorage.getItem('sharkieSavedVolume');
    if (storedVolume === null) return;
    const parsedVolume = Number.parseFloat(storedVolume);
    if (Number.isFinite(parsedVolume)) savedVolume = Math.min(1, Math.max(0, parsedVolume));
}

/** Preloads one image and never blocks loading on errors. */
function preloadImage(path) {
    return new Promise(resolve => {
        if (window.sharkieImageCache[path]) return resolveLoadedAsset(resolve);
        const img = new Image();
        img.onload = () => cacheLoadedImage(path, img, resolve);
        img.onerror = () => resolveLoadedAsset(resolve);
        img.src = path;
    });
}

/** Stores a loaded image in the shared image cache. */
function cacheLoadedImage(path, img, resolve) {
    window.sharkieImageCache[path] = img;
    resolveLoadedAsset(resolve);
}

/** Counts one asset as loaded and resolves its promise. */
function resolveLoadedAsset(resolve) {
    loadedAssets++;
    resolve();
}

/** Starts loading all initial image assets. */
function loadInitialAssets() {
    const uniqueAssets = [...new Set(INITIAL_IMAGE_ASSETS)];
    totalAssets = uniqueAssets.length;
    loadedAssets = 0;
    Promise.all(uniqueAssets.map(path => preloadImage(path))).then(finishLoading);
}

/** Creates screens after preloading is complete. */
function finishLoading() {
    loadingFinished = true;
    endScreen = new EndScreen();
    startScreen = new StartScreen();
    startScreen.setVolume(savedVolume);
    currentScreen = 'start';
}
