const level1 = new Level(
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
        new Endboss(),
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
        new BackgroundObject('../assets/img/Background/Layers/2. Floor/D1.png', 719*2),

        new BackgroundObject('../assets/img/Background/Layers/5. Water/D2.png', 719*3),
        new BackgroundObject('../assets/img/Background/Layers/3.Fondo 1/L2.png', 719*3),
        new BackgroundObject('../assets/img/Background/Layers/4.Fondo 2/L2.png', 719*3),
        new BackgroundObject('../assets/img/Background/Layers/2. Floor/D2.png', 719*3),

        new BackgroundObject('../assets/img/Background/Layers/5. Water/D1.png', 719*4),
        new BackgroundObject('../assets/img/Background/Layers/3.Fondo 1/L1.png', 719*4),
        new BackgroundObject('../assets/img/Background/Layers/4.Fondo 2/L1.png', 719*4),
        new BackgroundObject('../assets/img/Background/Layers/2. Floor/D1.png', 719*4),

        new BackgroundObject('../assets/img/Background/Layers/5. Water/D2.png', 719*5),
        new BackgroundObject('../assets/img/Background/Layers/3.Fondo 1/L2.png', 719*5),
        new BackgroundObject('../assets/img/Background/Layers/4.Fondo 2/L2.png', 719*5),
        new BackgroundObject('../assets/img/Background/Layers/2. Floor/D2.png', 719*5),

        new BackgroundObject('../assets/img/Background/Layers/5. Water/D1.png', 719*6),
        new BackgroundObject('../assets/img/Background/Layers/3.Fondo 1/L1.png', 719*6),
        new BackgroundObject('../assets/img/Background/Layers/4.Fondo 2/L1.png', 719*6),
        new BackgroundObject('../assets/img/Background/Layers/2. Floor/D1.png', 719*6),   
    ],
    [
        new Coin(500, 300),
        new Coin(800, 250),
        new Bottle(1200, 350),
        new Bottle(1500, 200),
    ]
)