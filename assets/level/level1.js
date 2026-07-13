const LEVEL_END_X = 4200;
const BOSS_SAFE_DISTANCE = 800;
const RANDOM_AREA_END_X = LEVEL_END_X - BOSS_SAFE_DISTANCE;

function randomNumber(min, max) {
    return Math.random() * (max - min) + min;
}

function randomInt(min, max) {
    return Math.floor(randomNumber(min, max + 1));
}

function isFarEnough(position, usedPositions, minDistance) {
    return usedPositions.every(usedPosition => {
        const dx = position.x - usedPosition.x;
        const dy = position.y - usedPosition.y;
        return Math.hypot(dx, dy) >= minDistance;
    });
}

function createRandomPosition(zone, usedPositions, minDistance) {
    for (let i = 0; i < 80; i++) {
        const position = {
            x: randomInt(zone.minX, zone.maxX),
            y: randomInt(zone.minY, zone.maxY)
        };

        if (isFarEnough(position, usedPositions, minDistance)) {
            usedPositions.push(position);
            return position;
        }
    }

    const fallbackPosition = {
        x: randomInt(zone.minX, zone.maxX),
        y: randomInt(zone.minY, zone.maxY)
    };
    usedPositions.push(fallbackPosition);
    return fallbackPosition;
}

function createRandomObjects(zones, createObject, minDistance) {
    const usedPositions = [];

    return zones.flatMap(zone => {
        return Array.from({ length: zone.count }, () => {
            const position = createRandomPosition(zone, usedPositions, minDistance);
            return createObject(position.x, position.y);
        });
    });
}

function createRandomEnemies() {
    const enemyTypes = [JellyFishPurple, JellyFishYellow, JellyFishGreen, JellyFishPink];
    const enemyZones = [
        { minX: 650, maxX: 1150, minY: 80, maxY: 380, count: 3 },
        { minX: 1250, maxX: 2000, minY: 80, maxY: 380, count: 3 },
        { minX: 2100, maxX: 2850, minY: 80, maxY: 380, count: 4 },
        { minX: 2950, maxX: RANDOM_AREA_END_X, minY: 80, maxY: 380, count: 2 }
    ];

    return createRandomObjects(
        enemyZones,
        (x, y) => {
            const EnemyType = enemyTypes[randomInt(0, enemyTypes.length - 1)];
            return new EnemyType(x, y);
        },
        180
    );
}

function createRandomCoins() {
    const coinZones = [
        { minX: 500, maxX: 1300, minY: 110, maxY: 320, count: 3 },
        { minX: 1450, maxX: 2300, minY: 110, maxY: 320, count: 3 },
        { minX: 2450, maxX: RANDOM_AREA_END_X, minY: 110, maxY: 320, count: 4 }
    ];

    return createRandomObjects(coinZones, (x, y) => new Coin(x, y), 95);
}

function createRandomBottles() {
    const bottleZones = [
        { minX: 650, maxX: 1450, minY: 220, maxY: 350, count: 3 },
        { minX: 1600, maxX: 2450, minY: 220, maxY: 350, count: 3 },
        { minX: 2600, maxX: RANDOM_AREA_END_X, minY: 220, maxY: 350, count: 4 }
    ];

    return createRandomObjects(bottleZones, (x, y) => new Bottle(x, y), 105);
}

function createBackgroundObjects() {
    return [
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
    ];
}

function getLevel1() {
    return new Level(
        createRandomEnemies(),
        [
            new Light()
        ],
        createBackgroundObjects(),
        [
            ...createRandomCoins(),
            ...createRandomBottles()
        ]
    );
}
