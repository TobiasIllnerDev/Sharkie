class SoundManager {
    muted = false;
    volume = 0.5;
    sounds = {};
    backgroundSound = null;

    loadSound(name, path, isBackground = false, isLooping = false) {
        const audio = new Audio(path);
        audio.volume = this.volume;
        audio.muted = this.muted;

        if (isBackground) {
            audio.loop = true;
            this.backgroundSound = { audio, name };
        }

        if (isLooping) {
            audio.loop = true;
        }

        this.sounds[name] = { audio };
    }

    playSound(name) {
        const sound = this.sounds[name];
        if (sound && !this.muted) {
            sound.audio.currentTime = 0;
            sound.audio.volume = this.volume;
            sound.audio.muted = this.muted;
            sound.audio.play().catch(e => {});
        }
    }

    playBackground() {
        if (this.backgroundSound) {
            this.backgroundSound.audio.volume = this.volume;
            this.backgroundSound.audio.muted = this.muted;
            if (!this.muted) {
                this.backgroundSound.audio.play().catch(e => {});
            }
        }
    }

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

    setVolume(volume) {
        this.volume = Math.min(1, Math.max(0, volume));
        this.updateAllVolumes();
    }

    setMuted(muted) {
        this.muted = muted;
        this.updateAllVolumes();
    }

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