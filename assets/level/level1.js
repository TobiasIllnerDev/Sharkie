function getLevel1() {
    return new Level(
        [
            new JellyFishPurple(1350, 350), new JellyFishPurple(2300, 380), new JellyFishPurple(1000, 380),
            new JellyFishYellow(700, 100), new JellyFishYellow(1600, 220), new JellyFishYellow(1750, 90),
            new JellyFishGreen(3150, 220), new JellyFishGreen(2350, 250), new JellyFishGreen(850, 240),
            new JellyFishPink(2800, 350), new JellyFishPink(2200, 100), new JellyFishPink(3300, 90),
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
            new Coin(300, 140), new Coin(380, 220), new Coin(460, 280), new Coin(540, 220), new Coin(620, 140),
            new Coin(1050, 120), new Coin(1130, 170), new Coin(1210, 220), new Coin(1290, 270), new Coin(1370, 320),
            new Coin(2500, 140), new Coin(2580, 220), new Coin(2660, 280), new Coin(2740, 220), new Coin(2820, 140),
            new Coin(3650, 280), new Coin(3740, 250), new Coin(3830, 220), new Coin(3920, 190), new Coin(4010, 160),

            new Bottle(400, 330), new Bottle(480, 260), new Bottle(560, 220), new Bottle(640, 260), new Bottle(720, 330),
            new Bottle(1450, 340), new Bottle(1530, 290), new Bottle(1610, 240), new Bottle(1690, 290), new Bottle(1770, 340),
            new Bottle(2700, 340), new Bottle(2780, 290), new Bottle(2860, 240), new Bottle(2940, 290), new Bottle(3020, 340),
            new Bottle(3550, 330), new Bottle(3630, 260), new Bottle(3710, 220), new Bottle(3790, 260), new Bottle(3870, 330),
        ]
    );
}
