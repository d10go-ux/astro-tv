/* ============================================================
   ASTRO TV — Broadcaster Cards Component
   Tarjetas de Narrador, Comentarista e Repórter (Estilo CazéTV)
   ============================================================ */

const BroadcasterCards = {
  state: {
    narratorName: 'Guilherme Costa',
    narratorHandle: '@guilherme_narrador',
    commentatorName: 'Prof. Carlos Santos',
    commentatorHandle: '@prof_carlos',
  },

  render() {
    const s = BroadcasterCards.state;

    return `
      <div class="panel" style="margin-bottom: var(--sp-4);">
        <div class="panel-header">
          <h3>🎤 Equipe de Transmissão</h3>
        </div>
        <div class="panel-body">
          <!-- Narrador -->
          <div class="form-group">
            <label class="form-label">🎙️ Narrador</label>
            <div class="form-row">
              <input type="text" class="form-input" value="${s.narratorName}" placeholder="Nome do Narrador"
                     onchange="BroadcasterCards.update('narratorName', this.value)">
              <input type="text" class="form-input" value="${s.narratorHandle}" placeholder="@arroba"
                     onchange="BroadcasterCards.update('narratorHandle', this.value)">
            </div>
            <button class="btn btn-secondary btn-sm w-full" style="margin-top:6px;"
                    onclick="BroadcasterCards.triggerCard('NARRATOR')">
              📺 Exibir Tarjeta do Narrador no OBS
            </button>
          </div>

          <!-- Comentarista -->
          <div class="form-group" style="margin-top: var(--sp-4);">
            <label class="form-label">💬 Comentarista</label>
            <div class="form-row">
              <input type="text" class="form-input" value="${s.commentatorName}" placeholder="Nome do Comentarista"
                     onchange="BroadcasterCards.update('commentatorName', this.value)">
              <input type="text" class="form-input" value="${s.commentatorHandle}" placeholder="@arroba"
                     onchange="BroadcasterCards.update('commentatorHandle', this.value)">
            </div>
            <button class="btn btn-secondary btn-sm w-full" style="margin-top:6px;"
                    onclick="BroadcasterCards.triggerCard('COMMENTATOR')">
              📺 Exibir Tarjeta do Comentarista no OBS
            </button>
          </div>
        </div>
      </div>
    `;
  },

  update(field, value) {
    BroadcasterCards.state[field] = value;
  },

  triggerCard(roleType) {
    const s = BroadcasterCards.state;
    const isNarrator = roleType === 'NARRATOR';

    const payload = {
      action: 'TRIGGER_BROADCASTER',
      role: isNarrator ? '🎙️ NARRAÇÃO' : '💬 COMENTÁRIOS',
      name: isNarrator ? s.narratorName : s.commentatorName,
      handle: isNarrator ? s.narratorHandle : s.commentatorHandle,
      duration: 5000
    };

    if (typeof AnimationControls !== 'undefined') {
      AnimationControls.sendAnimationEvent(payload);
    }

    App.showToast(`Tarjeta de ${isNarrator ? 'Narrador' : 'Comentarista'} disparada no OBS! 🎤`, 'success');
  }
};
