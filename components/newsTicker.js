/* ============================================================
   ASTRO TV — News Ticker Component
   Barra de Notícias e Resultados Rodapé em Movimento (CazéTV Style)
   ============================================================ */

const NewsTicker = {
  state: {
    active: false,
    text: 'PRÓXIMO JOGO: 3º ANO A × 3º ANO B ÀS 15:30 • RESULTADO ANTERIOR: 2º C 2 × 1 1º A • APOIO: BANCO ESCOLAR • ASTRO TV ESPORTES',
  },

  render() {
    const s = NewsTicker.state;

    return `
      <div class="panel" style="margin-bottom: var(--sp-4);">
        <div class="panel-header flex justify-between items-center">
          <h3>📜 Ticker de Notícias Rodapé</h3>
          <span class="badge ${s.active ? 'badge-secondary' : 'badge-primary'}">
            ${s.active ? '● Ativo no OBS' : '○ Inativo'}
          </span>
        </div>
        <div class="panel-body">
          <div class="form-group">
            <label class="form-label">Texto da Barra de Notícias em Movimento</label>
            <textarea class="form-input" rows="2" placeholder="Notícias e resultados da rodada"
                      onchange="NewsTicker.updateText(this.value)">${s.text}</textarea>
          </div>
          <button class="btn ${s.active ? 'btn-danger' : 'btn-primary'} btn-sm w-full" 
                  onclick="NewsTicker.toggleTicker()">
            ${s.active ? '🙈 Esconder Barra de Notícias' : '📜 Exibir Barra de Notícias no OBS'}
          </button>
        </div>
      </div>
    `;
  },

  updateText(val) {
    NewsTicker.state.text = val;
    if (NewsTicker.state.active) {
      NewsTicker.triggerSync();
    }
  },

  toggleTicker() {
    NewsTicker.state.active = !NewsTicker.state.active;
    NewsTicker.triggerSync();
    App.renderCurrentRoute();
  },

  triggerSync() {
    const s = NewsTicker.state;
    const payload = {
      action: 'TRIGGER_TICKER',
      active: s.active,
      text: s.text
    };

    if (typeof AnimationControls !== 'undefined') {
      AnimationControls.sendAnimationEvent(payload);
    }

    App.showToast(s.active ? 'Barra de notícias exibida no OBS! 📜' : 'Barra de notícias ocultada.', s.active ? 'success' : 'info');
  }
};
