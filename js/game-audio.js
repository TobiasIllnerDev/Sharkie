/** Loads all sounds used by the game. */
function loadGameSounds() {
    soundManager.loadSound('background', '../assets/sounds/background-musik.mp3', true);
    soundManager.loadSound('coin', '../assets/sounds/Coin-Colleted.mp3');
    soundManager.loadSound('bottle', '../assets/sounds/bottle-pick-up.mp3');
    soundManager.loadSound('enemy_die', '../assets/sounds/enemy-die.mp3');
    soundManager.loadSound('attack', '../assets/sounds/Attack-sound.mp3');
    soundManager.loadSound('character_swim', '../assets/sounds/Character-swim.mp3');
    loadExtraGameSounds();
}

/** Loads additional character and result sounds. */
function loadExtraGameSounds() {
    soundManager.loadSound('damage', '../assets/sounds/characterDamage.mp3');
    soundManager.loadSound('dead', '../assets/sounds/characterDead.wav');
    soundManager.loadSound('snoring', '../assets/sounds/characterSnoring.mp3', false, true);
    soundManager.loadSound('fail', '../assets/sounds/Fail-sound.mp3');
    soundManager.loadSound('win', '../assets/sounds/Win-Sound.mp3');
}

/** Applies saved volume and mute state to the sound manager. */
function applySavedSoundSettings() {
    const savedVol = localStorage.getItem('sharkieSavedVolume');
    if (savedVol !== null) savedVolume = parseFloat(savedVol);
    soundManager.setVolume(savedVolume);
    soundManager.setMuted(isMuted);
}

/** Stores and applies a new global volume. */
function setVolume(value) {
    savedVolume = Math.min(1, Math.max(0, value));
    localStorage.setItem('sharkieSavedVolume', savedVolume);
    if (startScreen) startScreen.setVolume(savedVolume);
    if (soundManager) soundManager.setVolume(savedVolume);
}

/** Toggles global mute state. */
function toggleMute() {
    isMuted = !isMuted;
    if (soundManager) soundManager.setMuted(isMuted);
}

/** Reduces or restores the background music volume. */
function setBackgroundVolumeFactor(factor) {
    if (soundManager && soundManager.backgroundSound) {
        soundManager.backgroundSound.audio.volume = soundManager.volume * factor;
    }
}

/** Stops and removes the current sound manager. */
function cleanupSoundManager() {
    if (!soundManager) return;
    savedVolume = soundManager.volume;
    localStorage.setItem('sharkieSavedVolume', savedVolume);
    soundManager.stopAllSounds();
    soundManager = null;
}
