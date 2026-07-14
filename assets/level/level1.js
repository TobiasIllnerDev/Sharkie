const LEVEL_END_X = 4200;
const BOSS_SAFE_DISTANCE = 300;
const RANDOM_AREA_END_X = LEVEL_END_X - BOSS_SAFE_DISTANCE;

/** random number. */
function randomNumber(min, max) {
    return Math.random() * (max - min) + min;
}

/** random int. */
function randomInt(min, max) {
    return Math.floor(randomNumber(min, max + 1));
}

/** is far enough. */
function isFarEnough(position, usedPositions, minDistance) {
    return usedPositions.every(usedPosition => {
        const dx = position.x - usedPosition.x;
        const dy = position.y - usedPosition.y;
        return Math.hypot(dx, dy) >= minDistance;
    });
}

/** create random position. */
function createRandomPosition(zone, usedPositions, minDistance) {
    for (let i = 0; i < 80; i++) {
        const position = getRandomZonePosition(zone);
        if (isFarEnough(position, usedPositions, minDistance)) {
            usedPositions.push(position);
            return position;
        }
    }
    return createFallbackPosition(zone, usedPositions);
}

/** get random zone position. */
function getRandomZonePosition(zone) {
    return {
        x: randomInt(zone.minX, zone.maxX),
        y: randomInt(zone.minY, zone.maxY)
    };
}

/** create fallback position. */
function createFallbackPosition(zone, usedPositions) {
    const fallbackPosition = getRandomZonePosition(zone);
    usedPositions.push(fallbackPosition);
    return fallbackPosition;
}

/** create random objects. */
function createRandomObjects(zones, createObject, minDistance) {
    const usedPositions = [];

    return zones.flatMap(zone => {
        return Array.from({ length: zone.count }, () => {
            const position = createRandomPosition(zone, usedPositions, minDistance);
            return createObject(position.x, position.y);
        });
    });
}

/** create random enemies. */
function createRandomEnemies() {
    const enemyTypes = [JellyFishPurple, JellyFishYellow, JellyFishGreen, JellyFishPink];
    return createRandomObjects(getEnemyZones(), (x, y) => createRandomEnemy(enemyTypes, x, y), 180);
}

/** Returns the enemy spawn zones, with extra pressure before the boss trigger. */
function getEnemyZones() {
    return [
        { minX: 650, maxX: 1150, minY: 80, maxY: 380, count: 3 },
        { minX: 1250, maxX: 2000, minY: 80, maxY: 380, count: 3 },
        { minX: 2100, maxX: 2850, minY: 80, maxY: 380, count: 4 },
        { minX: 2950, maxX: RANDOM_AREA_END_X, minY: 80, maxY: 380, count: 7 }
    ];
}

/** create random enemy. */
function createRandomEnemy(enemyTypes, x, y) {
    const EnemyType = enemyTypes[randomInt(0, enemyTypes.length - 1)];
    return new EnemyType(x, y);
}

/** create random coins. */
function createRandomCoins() {
    return createRandomObjects(getCoinZones(), (x, y) => new Coin(x, y), 95);
}

/** get coin zones. */
function getCoinZones() {
    return [
        { minX: 500, maxX: 1300, minY: 110, maxY: 320, count: 3 },
        { minX: 1450, maxX: 2300, minY: 110, maxY: 320, count: 3 },
        { minX: 2450, maxX: RANDOM_AREA_END_X, minY: 110, maxY: 320, count: 4 }
    ];
}

/** create random bottles. */
function createRandomBottles() {
    return createRandomObjects(getBottleZones(), (x, y) => new Bottle(x, y), 105);
}

/** get bottle zones. */
function getBottleZones() {
    return [
        { minX: 650, maxX: 1450, minY: 220, maxY: 350, count: 3 },
        { minX: 1600, maxX: 2450, minY: 220, maxY: 350, count: 3 },
        { minX: 2600, maxX: RANDOM_AREA_END_X, minY: 220, maxY: 350, count: 4 }
    ];
}

/** create background objects. */
function createBackgroundObjects() {
    return getBackgroundTiles().map(tile => createBackgroundTile(tile));
}

/** get background tiles. */
function getBackgroundTiles() {
    return getBackgroundPositions().flatMap(position => getBackgroundLayers(position));
}

/** get background positions. */
function getBackgroundPositions() {
    return [-719, 0, 719, 719 * 2, 719 * 3, 719 * 4, 719 * 5, 719 * 6];
}

/** get background layers. */
function getBackgroundLayers(x) {
    const suffix = getBackgroundSuffix(x);
    return [
        { path: `./assets/img/Background/Layers/5. Water/${suffix}.png`, x },
        { path: `./assets/img/Background/Layers/3.Fondo 1/L${suffix.slice(1)}.png`, x },
        { path: `./assets/img/Background/Layers/4.Fondo 2/L${suffix.slice(1)}.png`, x },
        { path: `./assets/img/Background/Layers/2. Floor/${suffix}.png`, x }
    ];
}

/** get background suffix. */
function getBackgroundSuffix(x) {
    return x === 0 || x % (719 * 2) === 0 ? 'D1' : 'D2';
}

/** create background tile. */
function createBackgroundTile(tile) {
    return new BackgroundObject(tile.path, tile.x);
}

/** get level1. */
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
