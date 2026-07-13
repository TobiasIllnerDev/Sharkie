/**
 * Loads and controls all game sounds.
 */
class SoundManager {
    muted = false;
    volume = 0.5;
    sounds = {};
    backgroundSound = null;

    /**
     * Load sound.
     * @param {string} name - Name used by this function.
     * @param {string} path - Image or asset path.
     * @param {boolean} isBackground - Whether the sound is background music.
     * @param {boolean} isLooping - Whether the sound should loop.
     */
    loadSound(name, path, isBackground = false, isLooping = false) {
        const audio = new Audio(path);
        this.applyAudioSettings(audio);

        if (isBackground) this.setBackgroundSound(audio, name);
        if (isLooping) audio.loop = true;

        this.sounds[name] = { audio };
    }

    /**
     * Apply audio settings.
     * @param {HTMLAudioElement} audio - Audio element.
     */
    applyAudioSettings(audio) {
        audio.volume = this.volume;
        audio.muted = this.muted;
    }

    /**
     * Set background sound.
     * @param {HTMLAudioElement} audio - Audio element.
     * @param {string} name - Name used by this function.
     */
    setBackgroundSound(audio, name) {
        audio.loop = true;
        this.backgroundSound = { audio, name };
    }

    /**
     * Play sound.
     * @param {string} name - Name used by this function.
     */
    playSound(name) {
        const sound = this.sounds[name];
        if (sound && !this.muted) {
            sound.audio.currentTime = 0;
            sound.audio.volume = this.volume;
            sound.audio.muted = this.muted;
            sound.audio.play().catch(e => {});
        }
    }

    /**
     * Play background.
     */
    playBackground() {
        if (this.backgroundSound) {
            this.backgroundSound.audio.volume = this.volume;
            this.backgroundSound.audio.muted = this.muted;
            if (!this.muted) {
                this.backgroundSound.audio.play().catch(e => {});
            }
        }
    }

    /**
     * Stop all sounds.
     */
    stopAllSounds() {
        if (this.backgroundSound) {
            this.backgroundSound.audio.pause();
            this.backgroundSound.audio.currentTime = 0;
        }
        Object.values(this.sounds).forEach(sound => {
            sound.audio.pause();
            sound.audio.currentTime = 0;
        });
    }

    /**
     * Set volume.
     * @param {number} volume - Volume from 0 to 1.
     */
    setVolume(volume) {
        this.volume = Math.min(1, Math.max(0, volume));
        this.updateAllVolumes();
    }

    /**
     * Set muted.
     * @param {boolean} muted - Whether audio is muted.
     */
    setMuted(muted) {
        this.muted = muted;
        this.updateAllVolumes();
    }

    /**
     * Update all volumes.
     */
    updateAllVolumes() {
        Object.values(this.sounds).forEach(sound => {
            sound.audio.volume = this.volume;
            sound.audio.muted = this.muted;
        });
        if (this.backgroundSound) {
            this.backgroundSound.audio.volume = this.volume;
            this.backgroundSound.audio.muted = this.muted;
        }
    }
}
