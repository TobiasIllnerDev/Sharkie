function getLevel1() {
    // 🔥 IMMER NEU ERSTELLEN - kein Caching!
    return new Level(
        [
            new JellyFishPurple(300),
            new JellyFishPurple(600),
            new JellyFishPurple(900),
            new JellyFishYellow(1200),
            new JellyFishYellow(1500),
            new JellyFishYellow(1800),
            new JellyFishGreen(2100),
            new JellyFishGreen(2400),
            new JellyFishGreen(2700),
            new JellyFishPink(3000),
            new JellyFishPink(3300),
            new JellyFishPink(3600),
        ],
        [
            new Light()
        ],
        [
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
            new BackgroundObject('../assets/img/Background/Layers/2. Floor/D2.png', 719*2),

            new BackgroundObject('../assets/img/Background/Layers/5. Water/D2.png', 719*3),
            new BackgroundObject('../assets/img/Background/Layers/3.Fondo 1/L2.png', 719*3),
            new BackgroundObject('../assets/img/Background/Layers/4.Fondo 2/L2.png', 719*3),
            new BackgroundObject('../assets/img/Background/Layers/2. Floor/D2.png', 719*3),

            new BackgroundObject('../assets/img/Background/Layers/5. Water/D1.png', 719*4),
            new BackgroundObject('../assets/img/Background/Layers/3.Fondo 1/L1.png', 719*4),
            new BackgroundObject('../assets/img/Background/Layers/4.Fondo 2/L1.png', 719*4),
            new BackgroundObject('../assets/img/Background/Layers/2. Floor/D2.png', 719*4),

            new BackgroundObject('../assets/img/Background/Layers/5. Water/D1.png', 719*5),
            new BackgroundObject('../assets/img/Background/Layers/3.Fondo 1/L2.png', 719*5),
            new BackgroundObject('../assets/img/Background/Layers/4.Fondo 2/L2.png', 719*5),
            new BackgroundObject('../assets/img/Background/Layers/2. Floor/D2.png', 719*5),

            new BackgroundObject('../assets/img/Background/Layers/5. Water/D1.png', 719*6),
            new BackgroundObject('../assets/img/Background/Layers/3.Fondo 1/L1.png', 719*6),
            new BackgroundObject('../assets/img/Background/Layers/4.Fondo 2/L1.png', 719*6),
            new BackgroundObject('../assets/img/Background/Layers/2. Floor/D2.png', 719*6),
        ],
        [
            new Coin(500, 300), new Coin(600, 250), new Coin(700, 320), new Coin(800, 280),
            new Coin(900, 350), new Coin(1000, 200), new Coin(1100, 300), new Coin(1200, 250),
            new Coin(1300, 320), new Coin(1400, 280), new Coin(1500, 350), new Coin(1600, 200),
            new Coin(1700, 300), new Coin(1800, 250), new Coin(1900, 320), new Coin(2000, 280),
            new Coin(2100, 350), new Coin(2200, 200), new Coin(2300, 300), new Coin(2400, 250),

            new Bottle(2500, 300), new Bottle(2600, 250), new Bottle(2700, 320),
            new Bottle(2800, 280), new Bottle(2900, 350), new Bottle(3000, 200),
            new Bottle(3100, 300), new Bottle(3200, 250), new Bottle(3300, 320),
            new Bottle(3400, 280), new Bottle(3500, 350), new Bottle(3600, 200),
            new Bottle(3700, 300), new Bottle(3800, 250), new Bottle(3900, 320),
            new Bottle(4000, 280), new Bottle(4100, 350), new Bottle(4200, 200),
            new Bottle(4300, 300), new Bottle(4400, 250),
        ]
    );
}