// audio.js - Web Audio API Beep utility

let audioCtx = null;

export const playBeep = (freq = 600, duration = 150) => {
    try {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        
        // Resume if suspended (mobile browsers auto-suspend AudioContext until interaction)
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        oscillator.type = 'sine';
        oscillator.frequency.value = freq;

        // Envelope to avoid clicking
        gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + 0.02);
        gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + (duration / 1000));

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        oscillator.start();
        oscillator.stop(audioCtx.currentTime + (duration / 1000) + 0.1);
    } catch (e) {
        console.warn("AudioContext no configurado o no soportado:", e);
    }
};
