/* ==========================================================================
   PHYSICS DETECTIVE - Web Audio FX & Vietnamese Speech Synthesizer
   Zero-dependency procedural sound generator + SpeechSynthesis
   ========================================================================== */

class AudioFX {
  constructor() {
    this.ctx = null;
    this.soundEnabled = true;
    this.speechEnabled = true;
    this.voices = [];

    // Lazy init audio context on first user gesture
    document.addEventListener('click', () => this.initContext(), { once: true });
    
    if ('speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = () => {
        this.voices = window.speechSynthesis.getVoices();
      };
    }
  }

  initContext() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
  }

  playClick() {
    if (!this.soundEnabled || !this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.04);
    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.04);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.04);
  }

  playSuccess() {
    if (!this.soundEnabled || !this.ctx) return;
    const now = this.ctx.currentTime;
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + i * 0.08);
      gain.gain.setValueAtTime(0.15, now + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 0.25);
    });
  }

  playDamage() {
    if (!this.soundEnabled || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(240, now);
    osc.frequency.exponentialRampToValueAtTime(60, now + 0.2);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(now + 0.2);
  }

  playAlert() {
    if (!this.soundEnabled || !this.ctx) return;
    const now = this.ctx.currentTime;
    [440, 370].forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, now + i * 0.1);
      gain.gain.setValueAtTime(0.08, now + i * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.09);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + i * 0.1);
      osc.stop(now + i * 0.1 + 0.09);
    });
  }

  playPurified() {
    if (!this.soundEnabled || !this.ctx) return;
    const now = this.ctx.currentTime;
    [440, 554.37, 659.25, 880, 1108.73, 1318.51].forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.09);
      gain.gain.setValueAtTime(0.18, now + i * 0.09);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.09 + 0.4);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + i * 0.09);
      osc.stop(now + i * 0.09 + 0.4);
    });
  }

  speak(text, persona = 'socrates') {
    if (!this.speechEnabled || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel(); // Stop current speech

    const cleanText = text.replace(/<[^>]*>/g, '').replace(/[\$\*\#]/g, '');
    const utter = new SpeechSynthesisUtterance(cleanText);
    utter.lang = 'vi-VN';

    // Giọng đọc Adam TikTok: Âm vực trầm ấm (deep baritone), ngữ điệu tự tin, nhịp điệu kể chuyện cuốn hút
    if (persona === 'sophos') {
      // Dr. Sophos: Trầm lạnh, sắc sảo, chất giọng phản diện
      utter.pitch = 0.76;
      utter.rate = 0.94;
    } else {
      // Socrates / Người dẫn chuyện: Tông trầm sâu, chậm rãi truyền cảm chuẩn phong cách Adam TikTok
      utter.pitch = 0.68;
      utter.rate = 0.88;
    }
    utter.volume = 1.0;

    // Tìm kiếm giọng tối ưu nhất (ưu tiên giọng Adam hoặc giọng nam trầm tiếng Việt)
    if (!this.voices.length) {
      this.voices = window.speechSynthesis.getVoices();
    }

    // 1. Giọng có tên Adam (nếu trình duyệt có cài TTS Adam)
    let bestVoice = this.voices.find(v => v.name.toLowerCase().includes('adam'));

    // 2. Giọng nam tiếng Việt chuẩn (Microsoft Nam, An, Male)
    if (!bestVoice) {
      bestVoice = this.voices.find(v =>
        (v.lang.includes('vi') || v.lang.includes('VIE')) &&
        (v.name.toLowerCase().includes('nam') || v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('an'))
      );
    }

    // 3. Giọng tiếng Việt bất kỳ (hạ pitch trầm thành giọng Adam)
    if (!bestVoice) {
      bestVoice = this.voices.find(v => v.lang.includes('vi') || v.lang.includes('VIE'));
    }

    // 4. Giọng nam tiếng Anh trầm nếu không có tiếng Việt
    if (!bestVoice) {
      bestVoice = this.voices.find(v =>
        v.name.toLowerCase().includes('david') ||
        v.name.toLowerCase().includes('guy') ||
        v.name.toLowerCase().includes('male')
      );
    }

    if (bestVoice) {
      utter.voice = bestVoice;
    }

    window.speechSynthesis.speak(utter);
  }

  stopSpeech() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}

window.audioFX = new AudioFX();
