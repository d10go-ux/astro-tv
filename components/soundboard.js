/* ============================================================
   ASTRO TV — Soundboard Broadcast Component
   Sintetizador Web Audio API de efeitos sonoros esportivos ao vivo
   ============================================================ */

const Soundboard = {
  ctx: null,

  initContext() {
    if (!Soundboard.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) Soundboard.ctx = new AudioCtx();
    }
    if (Soundboard.ctx && Soundboard.ctx.state === 'suspended') {
      Soundboard.ctx.resume();
    }
  },

  render() {
    return `
      <div class="panel" style="margin-bottom: var(--sp-4);">
        <div class="panel-header flex justify-between items-center">
          <h3>🎧 Soundboard (Efeitos Sonoros)</h3>
          <span class="badge badge-secondary">WEB AUDIO</span>
        </div>
        <div class="panel-body">
          <div class="soundboard-grid">
            <button class="btn-sound" onclick="Soundboard.playWhistle()">
              <span style="font-size:1.4rem;">📯</span>
              <span>Apito Juiz</span>
            </button>
            <button class="btn-sound" onclick="Soundboard.playGoalHorn()">
              <span style="font-size:1.4rem;">⚽</span>
              <span>Vinheta Gol</span>
            </button>
            <button class="btn-sound" onclick="Soundboard.playCrowdHorn()">
              <span style="font-size:1.4rem;">🎺</span>
              <span>Corneta</span>
            </button>
            <button class="btn-sound" onclick="Soundboard.playWhoosh()">
              <span style="font-size:1.4rem;">🔊</span>
              <span>Whoosh Wipe</span>
            </button>
            <button class="btn-sound" onclick="Soundboard.playEndBuzzer()">
              <span style="font-size:1.4rem;">🚨</span>
              <span>Fim de Tempo</span>
            </button>
          </div>
        </div>
      </div>
    `;
  },

  /**
   * 📯 Apito de Juiz (Sintetizado com modulação de frequência de dois tons altos)
   */
  playWhistle() {
    Soundboard.initContext();
    if (!Soundboard.ctx) return;

    const ctx = Soundboard.ctx;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sine';
    osc2.type = 'sine';
    osc1.frequency.setValueAtTime(2800, ctx.currentTime);
    osc2.frequency.setValueAtTime(3200, ctx.currentTime);

    // Efeito de trêmulo do apito
    const lfo = ctx.createOscillator();
    lfo.frequency.setValueAtTime(25, ctx.currentTime);
    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(200, ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(osc1.frequency);
    lfoGain.connect(osc2.frequency);

    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    lfo.start();
    osc1.start();
    osc2.start();

    lfo.stop(ctx.currentTime + 0.6);
    osc1.stop(ctx.currentTime + 0.6);
    osc2.stop(ctx.currentTime + 0.6);

    if (typeof App !== 'undefined') App.showToast('📯 Apito do Juiz disparado!', 'info');
  },

  /**
   * ⚽ Vinheta de Gol / Ponto / Cesta por Modalidade
   */
  playGoalHorn() {
    Soundboard.initContext();
    if (!Soundboard.ctx) return;

    const ctx = Soundboard.ctx;
    const sport = typeof AppState !== 'undefined' ? AppState.get('sport') : 'futsal';

    let notes = [130.81, 164.81, 196.00, 261.63]; // Futsal: Fanfarra de C3, E3, G3, C4
    let label = '⚽ Vinheta de Gol';

    if (sport === 'volei') {
      notes = [261.63, 329.63, 392.00, 523.25]; // Vôlei: Tons agudos vibrantes C4, E4, G4, C5
      label = '🏐 Vinheta de Ponto do Vôlei';
    } else if (sport === 'basquete') {
      notes = [110.00, 138.59, 164.81, 220.00]; // Basquete: Buzina grave A2, C#3, E3, A3
      label = '🏀 Vinheta de Cesta do Basquete';
    }

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = sport === 'basquete' ? 'square' : 'sawtooth';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.1);

      gain.gain.setValueAtTime(0.25, ctx.currentTime + idx * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + idx * 0.1);
      osc.stop(ctx.currentTime + 1.4);
    });

    if (typeof App !== 'undefined') App.showToast(`${label} disparada!`, 'success');
  },

  /**
   * 🎺 Corneta da Torcida
   */
  playCrowdHorn() {
    Soundboard.initContext();
    if (!Soundboard.ctx) return;

    const ctx = Soundboard.ctx;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, ctx.currentTime); // A3
    osc.frequency.setValueAtTime(440, ctx.currentTime + 0.2); // A4

    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.8);

    if (typeof App !== 'undefined') App.showToast('🎺 Corneta disparada!', 'info');
  },

  /**
   * 🔊 Whoosh Transição Gráfica (Ruído branco com filtro varrendo frequência)
   */
  playWhoosh() {
    Soundboard.initContext();
    if (!Soundboard.ctx) return;

    const ctx = Soundboard.ctx;
    const bufferSize = ctx.sampleRate * 0.4;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(200, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(3000, ctx.currentTime + 0.2);
    filter.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.4);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.4, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    whiteNoise.start();

    if (typeof App !== 'undefined') App.showToast('🔊 Whoosh disparado!', 'info');
  },

  /**
   * 🚨 Buzina de Fim de Tempo
   */
  playEndBuzzer() {
    Soundboard.initContext();
    if (!Soundboard.ctx) return;

    const ctx = Soundboard.ctx;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(150, ctx.currentTime);

    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.0);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 1.0);

    if (typeof App !== 'undefined') App.showToast('🚨 Buzina de Fim de Tempo!', 'warning');
  }
};
