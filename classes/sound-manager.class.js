class SoundManager {
    muted = false;
    volume = 0.5; 
    sounds = {};
    backgroundSound = null;

    
    soundCategories = {
        background: { volume: 0.3, enabled: true },
        effects: { volume: 1.0, enabled: true },
        collectibles: { volume: 1.0, enabled: true }
    };

    loadSound(name, path, category = 'effects', isBackground = false) {
        const audio = new Audio(path);
        audio.volume = this.soundCategories[category].volume * this.volume;
        audio.muted = this.muted || !this.soundCategories[category].enabled;

        if (isBackground) {
            audio.loop = true;
            this.backgroundSound = { audio, category, name };
        }

        this.sounds[name] = { audio, category };
    }

    playSound(name) {
        const sound = this.sounds[name];
        if (sound && !this.muted && this.soundCategories[sound.category].enabled) {
            sound.audio.currentTime = 0;
            sound.audio.volume = this.soundCategories[sound.category].volume * this.volume;
            sound.audio.play().catch(e => {});
        }
    }

    playBackground() {
        if (this.backgroundSound && !this.muted && this.soundCategories[this.backgroundSound.category].enabled) {
            this.backgroundSound.audio.volume = this.soundCategories[this.backgroundSound.category].volume * this.volume;
            this.backgroundSound.audio.play().catch(e => {});
        }
    }

    stopBackground() {
        if (this.backgroundSound) {
            this.backgroundSound.audio.pause();
            this.backgroundSound.audio.currentTime = 0;
        }
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
            sound.audio.volume = this.soundCategories[sound.category].volume * this.volume;
            sound.audio.muted = this.muted || !this.soundCategories[sound.category].enabled;
        });
        if (this.backgroundSound) {
            this.backgroundSound.audio.volume = this.soundCategories[this.backgroundSound.category].volume * this.volume;
            this.backgroundSound.audio.muted = this.muted || !this.soundCategories[this.backgroundSound.category].enabled;
        }
    }
}