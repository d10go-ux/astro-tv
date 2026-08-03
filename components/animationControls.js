/* ============================================================
   ASTRO TV — Animation Controls Component
   Painel de gatilhos de animação broadcast em tempo real para OBS
   ============================================================ */

const AnimationControls = {
  // Estado visual do overlay no OBS
  overlayVisible: true,
  activeBanner: null,

  /**
   * Renderiza a mesa de controle de animações
   */
  render() {
    const sport = AppState.get('sport');
    const pointLabel = sport === 'volei' ? '🏐 PONTO DO SET!' : sport === 'basquete' ? '🏀 CESTA DE 3!' : '⚽ GOL!';

    return `
      <div class="panel" style="margin-bottom: var(--sp-6)">
        <div class="panel-header">
          <h3>🎬 Controles de Animação (Ao Vivo)</h3>
          <span class="badge ${AnimationControls.overlayVisible ? 'badge-secondary' : 'badge-primary'}">
            ${AnimationControls.overlayVisible ? '● Placar no Ar' : '○ Placar Oculto'}
          </span>
        </div>
        <div class="panel-body">
          <div class="anim-trigger-grid">
            <!-- Entrar / Sair do Ar -->
            <button class="btn-anim ${AnimationControls.overlayVisible ? 'active-trigger' : ''}" 
                    onclick="AnimationControls.toggleOverlayVisibility()">
              <span class="anim-icon">${AnimationControls.overlayVisible ? '👁️' : '🙈'}</span>
              <span>${AnimationControls.overlayVisible ? 'Ocultar Placar' : 'Exibir Placar'}</span>
            </button>

            <!-- Vinheta Ponto / Gol -->
            <button class="btn-anim" onclick="AnimationControls.triggerBanner('GOAL', '${pointLabel}')">
              <span class="anim-icon">💥</span>
              <span>Vinheta ${sport === 'futsal' ? 'Gol' : 'Ponto'}</span>
            </button>

            <!-- Pedido de Tempo -->
            <button class="btn-anim" onclick="AnimationControls.triggerBanner('TIMEOUT', '⏱️ TEMPO TÉCNICO')">
              <span class="anim-icon">⏱️</span>
              <span>Pedido de Tempo</span>
            </button>

            <!-- Cartão Amarelo -->
            <button class="btn-anim" onclick="AnimationControls.triggerCard('YELLOW')">
              <span class="anim-icon">🟨</span>
              <span>Cartão Amarelo</span>
            </button>

            <!-- Cartão Vermelho -->
            <button class="btn-anim" onclick="AnimationControls.triggerCard('RED')">
              <span class="anim-icon">🟥</span>
              <span>Cartão Vermelho</span>
            </button>

            <!-- Exibir Patrocinador -->
            <button class="btn-anim" onclick="AnimationControls.triggerSponsor()">
              <span class="anim-icon">🏢</span>
              <span>Patrocinadores</span>
            </button>

            <!-- Alerta de VAR -->
            <button class="btn-anim" onclick="AnimationControls.triggerVAR()">
              <span class="anim-icon">🚨</span>
              <span>Alerta VAR</span>
            </button>

            <!-- Acréscimos -->
            <button class="btn-anim" onclick="AnimationControls.triggerExtraTime()">
              <span class="anim-icon">⏱️</span>
              <span>Acréscimos (+3')</span>
            </button>

            <!-- Craque do Jogo -->
            <button class="btn-anim" onclick="AnimationControls.triggerMVP()">
              <span class="anim-icon">🌟</span>
              <span>Craque do Jogo</span>
            </button>
          </div>
        </div>
      </div>
    `;
  },

  /**
   * Alterna visibilidade com animação de entrada/saída no OBS
   */
  toggleOverlayVisibility() {
    AnimationControls.overlayVisible = !AnimationControls.overlayVisible;
    
    AnimationControls.sendAnimationEvent({
      action: AnimationControls.overlayVisible ? 'SHOW_OVERLAY' : 'HIDE_OVERLAY'
    });

    App.showToast(
      AnimationControls.overlayVisible ? 'Placar no ar (Animação de Entrada) 🎬' : 'Placar recolhido (Animação de Saída) 🙈',
      AnimationControls.overlayVisible ? 'success' : 'info'
    );
    App.renderCurrentRoute();
  },

  /**
   * Dispara vinheta gráfica em tela cheia (ex: GOL, PONTO)
   */
  triggerBanner(type, titleText) {
    const teamA = AppState.get('teamA');
    const teamB = AppState.get('teamB');

    // Prompt rápido ou disparo padrão
    AnimationControls.sendAnimationEvent({
      action: 'TRIGGER_BANNER',
      type: type,
      title: titleText,
      teamA: teamA,
      teamB: teamB,
      duration: 3000
    });

    App.showToast(`Vinheta "${titleText}" disparada no OBS! 💥`, 'success');
  },

  /**
   * Dispara alerta de cartão
   */
  triggerCard(cardType) {
    const teamA = AppState.get('teamA');
    const teamB = AppState.get('teamB');

    // Abre modal para escolher qual time
    App.showModal('🟨/🟥 Aplicar Cartão', `
      <p style="margin-bottom: var(--sp-4);">Selecione o time que recebeu o cartão:</p>
      <div class="flex gap-3">
        <button class="btn btn-primary w-full" onclick="AnimationControls.confirmCard('${cardType}', 'A')">
          ${teamA.name || 'Time A'}
        </button>
        <button class="btn btn-secondary w-full" onclick="AnimationControls.confirmCard('${cardType}', 'B')">
          ${teamB.name || 'Time B'}
        </button>
      </div>
    `);
  },

  confirmCard(cardType, teamLetter) {
    const team = teamLetter === 'A' ? AppState.get('teamA') : AppState.get('teamB');
    
    AnimationControls.sendAnimationEvent({
      action: 'TRIGGER_CARD',
      cardType: cardType,
      team: team,
      duration: 3500
    });

    App.closeModal();
    App.showToast(`Cartão ${cardType === 'YELLOW' ? 'Amarelo 🟨' : 'Vermelho 🟥'} para ${team.name}`, 'warning');
  },

  /**
   * Dispara rotação de patrocinadores
   */
  triggerSponsor() {
    const comp = AppState.get('competition') || {};
    const sponsors = comp.sponsors || ['ASTRO TV'];

    AnimationControls.sendAnimationEvent({
      action: 'TRIGGER_SPONSOR',
      sponsors: sponsors,
      duration: 4000
    });

    App.showToast('Rodada de patrocinadores exibida no OBS! 🏢', 'info');
  },

  triggerVAR() {
    AnimationControls.sendAnimationEvent({
      action: 'TRIGGER_VAR',
      title: '🚨 REVISÃO DE LANCE / VAR EM ANDAMENTO',
      duration: 5000
    });
    App.showToast('Alerta de VAR disparado no OBS! 🚨', 'warning');
  },

  triggerExtraTime() {
    const times = ['+1\'', '+2\'', '+3\'', '+5\''];
    const selected = prompt('Informe os minutos de acréscimo (+1, +2, +3, +5):', '+3\'');
    if (!selected) return;

    AnimationControls.sendAnimationEvent({
      action: 'TRIGGER_EXTRA_TIME',
      extraTime: selected
    });
    App.showToast(`Badge de acréscimo ${selected} ativado no OBS! ⏱️`, 'success');
  },

  triggerMVP() {
    const playerName = prompt('Nome do Craque / MVP da Partida:', 'João Silva (#10)');
    if (!playerName) return;

    AnimationControls.sendAnimationEvent({
      action: 'TRIGGER_MVP',
      player: playerName,
      duration: 6000
    });
    App.showToast(`Vinheta de Craque do Jogo (${playerName}) disparada no OBS! 🌟`, 'success');
  },

  /**
   * Envia evento de animação via BroadcastChannel + localStorage
   */
  sendAnimationEvent(payload) {
    const data = {
      ...payload,
      timestamp: Date.now()
    };

    localStorage.setItem('astrotv_anim_event', JSON.stringify(data));

    // Firebase Realtime Database Cloud Sync
    try {
      if (typeof FirebaseConfig !== 'undefined' && FirebaseConfig.db) {
        const roomId = FirebaseConfig.getRoomId();
        FirebaseConfig.db.ref(`rooms/${roomId}/anim`).set(data);
      }
    } catch (e) {}

    // HTTP POST para o servidor API + Nuvem KVDB
    try {
      fetch('/api/anim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }).catch(() => {});

      fetch('https://kvdb.io/Wf8X8ZgJ8jZ7Xp6J9q8Z2k/astrotv_anim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }).catch(() => {});
    } catch (e) {}

    try {
      if (!AnimationControls._channel) {
        AnimationControls._channel = new BroadcastChannel('astrotv_anim_channel');
      }
      AnimationControls._channel.postMessage(data);
    } catch (e) {
      console.warn('BroadcastChannel error:', e);
    }
  },

  _channel: null
};
