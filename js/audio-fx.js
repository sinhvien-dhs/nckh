/* ==========================================================================
   PHYSICS DETECTIVE - Web Audio FX
   Procedural Sound Effects for Simulation UI (Zero-dependency Web Audio API)
   Speech Synthesis has been disabled per user requirements.
   ========================================================================== */

class AudioFX {
  constructor() {
    this.ctx = null;
    this.soundEnabled = true;
    this.speechEnabled = false; // Disabled completely

    // Lazy init audio context on first user gesture (touch or click)
    const unlock = () => {
      this.initContext();
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    };
    document.addEventListener('click', unlock, { once: true });
    document.addEventListener('touchstart', unlock, { once: true });
  }

  initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  playClick() {
    if (!this.soundEnabled || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch (e) {}
  }

  playSuccess() {
    if (!this.soundEnabled || !this.ctx) return;
    this.initContext();
    try {
      const now = this.ctx.currentTime;

      // 1. Tiếng nhạc khải hoàn hoan hỉ (Major Triad Fanfare Chime: C5 -> E5 -> G5 -> C6 -> E6)
      const notes = [
        { f: 523.25, t: 0.00, dur: 0.35, vol: 0.12 }, // C5
        { f: 659.25, t: 0.06, dur: 0.35, vol: 0.13 }, // E5
        { f: 783.99, t: 0.13, dur: 0.45, vol: 0.15 }, // G5
        { f: 1046.50, t: 0.20, dur: 0.70, vol: 0.18 }, // C6
        { f: 1318.51, t: 0.27, dur: 0.60, vol: 0.14 }  // E6 chime
      ];

      notes.forEach(n => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(n.f, now + n.t);

        gain.gain.setValueAtTime(0.001, now + n.t);
        gain.gain.exponentialRampToValueAtTime(n.vol, now + n.t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + n.t + n.dur);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + n.t);
        osc.stop(now + n.t + n.dur);
      });

      // 2. Hiệu ứng đám đông hoan hô & vỗ tay rào rào (Procedural Cheering & Applause)
      const bufferSize = Math.floor(this.ctx.sampleRate * 1.1);
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      // Lớp 1: Tiếng reo hò tập thể (Crowd cheer roar qua lọc dải 1200Hz)
      const cheerSource = this.ctx.createBufferSource();
      cheerSource.buffer = noiseBuffer;
      const cheerFilter = this.ctx.createBiquadFilter();
      cheerFilter.type = 'bandpass';
      cheerFilter.frequency.setValueAtTime(1100, now);
      cheerFilter.Q.setValueAtTime(1.6, now);

      const cheerGain = this.ctx.createGain();
      cheerGain.gain.setValueAtTime(0.001, now);
      cheerGain.gain.linearRampToValueAtTime(0.13, now + 0.12);
      cheerGain.gain.exponentialRampToValueAtTime(0.001, now + 1.1);

      cheerSource.connect(cheerFilter);
      cheerFilter.connect(cheerGain);
      cheerGain.connect(this.ctx.destination);
      cheerSource.start(now);
      cheerSource.stop(now + 1.1);

      // Lớp 2: Tiếng vỗ tay ròn rã (Rhythmic claps đa âm sắc)
      for (let c = 0; c < 14; c++) {
        const clapTime = now + 0.04 + Math.random() * 0.85;
        const clapSource = this.ctx.createBufferSource();
        clapSource.buffer = noiseBuffer;

        const clapFilter = this.ctx.createBiquadFilter();
        clapFilter.type = 'bandpass';
        clapFilter.frequency.setValueAtTime(1800 + Math.random() * 700, clapTime);
        clapFilter.Q.setValueAtTime(2.8, clapTime);

        const clapGain = this.ctx.createGain();
        const clapVol = 0.04 + Math.random() * 0.04;
        clapGain.gain.setValueAtTime(0.001, clapTime);
        clapGain.gain.linearRampToValueAtTime(clapVol, clapTime + 0.008);
        clapGain.gain.exponentialRampToValueAtTime(0.001, clapTime + 0.05);

        clapSource.connect(clapFilter);
        clapFilter.connect(clapGain);
        clapGain.connect(this.ctx.destination);
        clapSource.start(clapTime);
        clapSource.stop(clapTime + 0.06);
      }
    } catch (e) {}
  }

  playDamage() {
    if (!this.soundEnabled || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(240, now);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.18);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(now + 0.18);
    } catch (e) {}
  }

  playAlert() {
    if (!this.soundEnabled || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      [440, 370].forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, now + i * 0.09);
        gain.gain.setValueAtTime(0.06, now + i * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.09 + 0.08);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + i * 0.09);
        osc.stop(now + i * 0.09 + 0.08);
      });
    } catch (e) {}
  }

  playPurified() {
    if (!this.soundEnabled || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      [440, 554.37, 659.25, 880, 1108.73, 1318.51].forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.08);
        gain.gain.setValueAtTime(0.12, now + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.35);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.35);
      });
    } catch (e) {}
  }

  // Speech disabled completely
  speak(text, persona = 'socrates') {
    // No-op per requirement
    return;
  }

  stopSpeech() {
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {}
    }
  }
}

window.audioFX = new AudioFX();
