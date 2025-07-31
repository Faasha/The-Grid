// Fun Enhancement: Audio System for Enhanced Atmosphere
// Atmospheric audio and sound effects for The Grid

class AudioManager {
    constructor() {
        this.audioContext = null;
        this.sounds = new Map();
        this.ambientSounds = new Map();
        this.musicTracks = new Map();
        this.masterVolume = 0.7;
        this.sfxVolume = 0.8;
        this.musicVolume = 0.5;
        this.ambientVolume = 0.3;
        this.currentAmbient = null;
        this.currentMusic = null;
        this.isInitialized = false;
        
        this.initializeAudioContext();
        this.generateSyntheticSounds();
    }

    async initializeAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.isInitialized = true;
        } catch (error) {
            console.warn('Audio context not supported:', error);
            this.isInitialized = false;
        }
    }

    // Fun Enhancement: Procedural Sound Generation
    generateSyntheticSounds() {
        if (!this.isInitialized) return;
        
        // Generate cyberpunk-style sound effects procedurally
        this.sounds.set('scan', this.createScanSound());
        this.sounds.set('connect', this.createConnectSound());
        this.sounds.set('hack', this.createHackSound());
        this.sounds.set('success', this.createSuccessSound());
        this.sounds.set('error', this.createErrorSound());
        this.sounds.set('levelup', this.createLevelUpSound());
        this.sounds.set('combo', this.createComboSound());
        this.sounds.set('move', this.createMoveSound());
        this.sounds.set('notification', this.createNotificationSound());
        
        // Generate ambient soundscapes
        this.ambientSounds.set('grid_hum', this.createGridHumAmbient());
        this.ambientSounds.set('data_flow', this.createDataFlowAmbient());
        this.ambientSounds.set('deep_net', this.createDeepNetAmbient());
    }

    createScanSound() {
        return () => {
            const duration = 0.8;
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            const filter = this.audioContext.createBiquadFilter();
            
            oscillator.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            // Scan sweep effect
            oscillator.type = 'sawtooth';
            oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(800, this.audioContext.currentTime + duration * 0.3);
            oscillator.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + duration);
            
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(400, this.audioContext.currentTime);
            filter.frequency.exponentialRampToValueAtTime(1200, this.audioContext.currentTime + duration * 0.5);
            filter.frequency.exponentialRampToValueAtTime(200, this.audioContext.currentTime + duration);
            
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.3 * this.sfxVolume, this.audioContext.currentTime + 0.05);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
            
            oscillator.start();
            oscillator.stop(this.audioContext.currentTime + duration);
        };
    }

    createConnectSound() {
        return () => {
            const duration = 1.2;
            
            // Create handshake-like connection sound
            for (let i = 0; i < 3; i++) {
                const delay = i * 0.3;
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(this.audioContext.destination);
                
                oscillator.type = 'square';
                oscillator.frequency.setValueAtTime(440 + i * 220, this.audioContext.currentTime + delay);
                
                gainNode.gain.setValueAtTime(0, this.audioContext.currentTime + delay);
                gainNode.gain.linearRampToValueAtTime(0.2 * this.sfxVolume, this.audioContext.currentTime + delay + 0.05);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + delay + 0.3);
                
                oscillator.start(this.audioContext.currentTime + delay);
                oscillator.stop(this.audioContext.currentTime + delay + 0.3);
            }
        };
    }

    createHackSound() {
        return () => {
            const duration = 0.6;
            
            // Digital interference effect
            const noiseBuffer = this.createNoiseBuffer(duration, 0.1);
            const noiseSource = this.audioContext.createBufferSource();
            const filter = this.audioContext.createBiquadFilter();
            const gainNode = this.audioContext.createGain();
            
            noiseSource.buffer = noiseBuffer;
            noiseSource.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(1000, this.audioContext.currentTime);
            filter.frequency.exponentialRampToValueAtTime(2000, this.audioContext.currentTime + duration);
            filter.Q.value = 10;
            
            gainNode.gain.setValueAtTime(0.4 * this.sfxVolume, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
            
            noiseSource.start();
            noiseSource.stop(this.audioContext.currentTime + duration);
        };
    }

    createSuccessSound() {
        return () => {
            const duration = 1.0;
            
            // Ascending arpeggio
            const frequencies = [262, 330, 392, 523]; // C major chord
            frequencies.forEach((freq, index) => {
                const delay = index * 0.15;
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(this.audioContext.destination);
                
                oscillator.type = 'sine';
                oscillator.frequency.value = freq;
                
                gainNode.gain.setValueAtTime(0, this.audioContext.currentTime + delay);
                gainNode.gain.linearRampToValueAtTime(0.3 * this.sfxVolume, this.audioContext.currentTime + delay + 0.05);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + delay + 0.5);
                
                oscillator.start(this.audioContext.currentTime + delay);
                oscillator.stop(this.audioContext.currentTime + delay + 0.5);
            });
        };
    }

    createErrorSound() {
        return () => {
            const duration = 0.5;
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.type = 'sawtooth';
            oscillator.frequency.setValueAtTime(150, this.audioContext.currentTime);
            oscillator.frequency.linearRampToValueAtTime(100, this.audioContext.currentTime + duration);
            
            gainNode.gain.setValueAtTime(0.4 * this.sfxVolume, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
            
            oscillator.start();
            oscillator.stop(this.audioContext.currentTime + duration);
        };
    }

    createComboSound() {
        return (comboLevel = 1) => {
            const duration = 0.4;
            const frequency = 440 + (comboLevel * 110);
            
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            const filter = this.audioContext.createBiquadFilter();
            
            oscillator.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.type = 'triangle';
            oscillator.frequency.value = frequency;
            
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(frequency * 2, this.audioContext.currentTime);
            filter.frequency.exponentialRampToValueAtTime(frequency * 4, this.audioContext.currentTime + duration);
            
            const volume = Math.min(0.5, 0.2 + (comboLevel * 0.05)) * this.sfxVolume;
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(volume, this.audioContext.currentTime + 0.05);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
            
            oscillator.start();
            oscillator.stop(this.audioContext.currentTime + duration);
        };
    }

    createMoveSound() {
        return () => {
            const duration = 0.2;
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(600, this.audioContext.currentTime + duration);
            
            gainNode.gain.setValueAtTime(0.1 * this.sfxVolume, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
            
            oscillator.start();
            oscillator.stop(this.audioContext.currentTime + duration);
        };
    }

    createLevelUpSound() {
        return () => {
            const duration = 2.0;
            
            // Triumphant fanfare
            const melody = [262, 330, 392, 523, 659, 784, 1047]; // C major scale
            melody.forEach((freq, index) => {
                const delay = index * 0.2;
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(this.audioContext.destination);
                
                oscillator.type = 'square';
                oscillator.frequency.value = freq;
                
                gainNode.gain.setValueAtTime(0, this.audioContext.currentTime + delay);
                gainNode.gain.linearRampToValueAtTime(0.3 * this.sfxVolume, this.audioContext.currentTime + delay + 0.05);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + delay + 0.8);
                
                oscillator.start(this.audioContext.currentTime + delay);
                oscillator.stop(this.audioContext.currentTime + delay + 0.8);
            });
        };
    }

    createNotificationSound() {
        return () => {
            const duration = 0.3;
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(1000, this.audioContext.currentTime);
            oscillator.frequency.setValueAtTime(1200, this.audioContext.currentTime + 0.1);
            
            gainNode.gain.setValueAtTime(0.2 * this.sfxVolume, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
            
            oscillator.start();
            oscillator.stop(this.audioContext.currentTime + duration);
        };
    }

    // Fun Enhancement: Ambient Soundscapes
    createGridHumAmbient() {
        if (!this.isInitialized) return null;
        
        return () => {
            const oscillator1 = this.audioContext.createOscillator();
            const oscillator2 = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            const filter = this.audioContext.createBiquadFilter();
            
            oscillator1.connect(filter);
            oscillator2.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator1.type = 'sine';
            oscillator1.frequency.value = 60;
            oscillator2.type = 'sine';
            oscillator2.frequency.value = 120;
            
            filter.type = 'lowpass';
            filter.frequency.value = 200;
            
            gainNode.gain.value = 0.1 * this.ambientVolume;
            
            oscillator1.start();
            oscillator2.start();
            
            return {
                stop: () => {
                    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 1.0);
                    setTimeout(() => {
                        oscillator1.stop();
                        oscillator2.stop();
                    }, 1000);
                }
            };
        };
    }

    createDataFlowAmbient() {
        if (!this.isInitialized) return null;
        
        return () => {
            const noiseBuffer = this.createNoiseBuffer(10, 0.05);
            const noiseSource = this.audioContext.createBufferSource();
            const filter = this.audioContext.createBiquadFilter();
            const gainNode = this.audioContext.createGain();
            
            noiseSource.buffer = noiseBuffer;
            noiseSource.loop = true;
            noiseSource.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            filter.type = 'bandpass';
            filter.frequency.value = 2000;
            filter.Q.value = 0.5;
            
            gainNode.gain.value = 0.15 * this.ambientVolume;
            
            noiseSource.start();
            
            return {
                stop: () => {
                    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 2.0);
                    setTimeout(() => {
                        noiseSource.stop();
                    }, 2000);
                }
            };
        };
    }

    createDeepNetAmbient() {
        if (!this.isInitialized) return null;
        
        return () => {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            const filter = this.audioContext.createBiquadFilter();
            
            oscillator.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.type = 'sawtooth';
            oscillator.frequency.value = 40;
            
            filter.type = 'lowpass';
            filter.frequency.value = 100;
            
            gainNode.gain.value = 0.08 * this.ambientVolume;
            
            oscillator.start();
            
            return {
                stop: () => {
                    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 3.0);
                    setTimeout(() => {
                        oscillator.stop();
                    }, 3000);
                }
            };
        };
    }

    createNoiseBuffer(duration, amplitude) {
        const sampleRate = this.audioContext.sampleRate;
        const length = sampleRate * duration;
        const buffer = this.audioContext.createBuffer(1, length, sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < length; i++) {
            data[i] = (Math.random() * 2 - 1) * amplitude;
        }
        
        return buffer;
    }

    // Public API
    playSound(soundName, ...args) {
        if (!this.isInitialized) return;
        
        const sound = this.sounds.get(soundName);
        if (sound) {
            sound(...args);
        }
    }

    startAmbient(ambientName) {
        if (!this.isInitialized) return;
        
        this.stopAmbient();
        
        const ambient = this.ambientSounds.get(ambientName);
        if (ambient) {
            this.currentAmbient = ambient();
        }
    }

    stopAmbient() {
        if (this.currentAmbient && this.currentAmbient.stop) {
            this.currentAmbient.stop();
            this.currentAmbient = null;
        }
    }

    setMasterVolume(volume) {
        this.masterVolume = Math.max(0, Math.min(1, volume));
    }

    setSfxVolume(volume) {
        this.sfxVolume = Math.max(0, Math.min(1, volume));
    }

    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
    }

    setAmbientVolume(volume) {
        this.ambientVolume = Math.max(0, Math.min(1, volume));
        if (this.currentAmbient && this.currentAmbient.setVolume) {
            this.currentAmbient.setVolume(volume);
        }
    }

    // Initialize on user interaction (required for web audio)
    async enableAudio() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            await this.audioContext.resume();
        }
    }

    // Cleanup
    destroy() {
        this.stopAmbient();
        if (this.audioContext) {
            this.audioContext.close();
        }
    }
}

// Export for use in main game
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AudioManager;
} else {
    window.AudioManager = AudioManager;
}