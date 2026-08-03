/* ============================================================
   ASTRO TV — Social Wall Component
   Comentários e mensagens da torcida exibidos na tela (CazéTV Style)
   ============================================================ */

const SocialWall = {
  state: {
    username: '@marcos_3a',
    message: 'VAMOS 3º ANO A!! HOJE É DIA DE VITÓRIA! 🔥 #AstroTV',
  },

  render() {
    const s = SocialWall.state;

    return `
      <div class="panel" style="margin-bottom: var(--sp-4);">
        <div class="panel-header">
          <h3>💬 Social Wall (Comentários na Tela)</h3>
        </div>
        <div class="panel-body">
          <div class="form-group">
            <label class="form-label">Usuário / Arroba</label>
            <input type="text" class="form-input" value="${s.username}" placeholder="Ex: @torcida_3a"
                   onchange="SocialWall.update('username', this.value)">
          </div>
          <div class="form-group">
            <label class="form-label">Mensagem do Espectador</label>
            <textarea class="form-input" rows="2" placeholder="Digite a mensagem da torcida"
                      onchange="SocialWall.update('message', this.value)">${s.message}</textarea>
          </div>
          <button class="btn btn-primary btn-sm w-full" onclick="SocialWall.triggerComment()">
            💬 Exibir Comentário na Transmissão
          </button>
        </div>
      </div>
    `;
  },

  update(field, value) {
    SocialWall.state[field] = value;
  },

  triggerComment() {
    const s = SocialWall.state;
    if (!s.message.trim()) {
      App.showToast('Digite uma mensagem para exibir na tela', 'warning');
      return;
    }

    const payload = {
      action: 'TRIGGER_SOCIAL',
      username: s.username || '@espectador',
      message: s.message,
      duration: 6000
    };

    if (typeof AnimationControls !== 'undefined') {
      AnimationControls.sendAnimationEvent(payload);
    }

    App.showToast('Comentário da torcida exibido no OBS! 💬', 'success');
  }
};
