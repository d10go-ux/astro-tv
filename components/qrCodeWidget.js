/* ============================================================
   ASTRO TV — QR Code Widget Component
   QR Code para Doações PIX, Redes Sociais e Votações na tela
   ============================================================ */

const QRCodeWidget = {
  state: {
    active: false,
    text: 'DOAÇÕES PIX / FORMATURA\nEscaneie para apoiar!',
    qrUrl: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="white"/><path d="M10 10h30v30H10zM60 10h30v30H60zM10 60h30v30H10z" fill="black"/><path d="M20 20h10v10H20zM70 20h10v10H70zM20 70h10v10H20z" fill="white"/><circle cx="75" cy="75" r="12" fill="%237c5cfc"/></svg>'
  },

  render() {
    const s = QRCodeWidget.state;

    return `
      <div class="panel" style="margin-bottom: var(--sp-4);">
        <div class="panel-header flex justify-between items-center">
          <h3>📱 QR Code na Tela</h3>
          <span class="badge ${s.active ? 'badge-secondary' : 'badge-primary'}">
            ${s.active ? '● Ativo no OBS' : '○ Inativo'}
          </span>
        </div>
        <div class="panel-body">
          <div class="form-group">
            <label class="form-label">Texto Chamada do QR Code</label>
            <input type="text" class="form-input" value="${s.text}" placeholder="Ex: PIX Formatura / Apoie a Transmissão"
                   onchange="QRCodeWidget.updateText(this.value)">
          </div>
          <button class="btn ${s.active ? 'btn-danger' : 'btn-primary'} btn-sm w-full" 
                  onclick="QRCodeWidget.toggleWidget()">
            ${s.active ? '🙈 Esconder QR Code' : '📱 Exibir QR Code no OBS'}
          </button>
        </div>
      </div>
    `;
  },

  updateText(val) {
    QRCodeWidget.state.text = val;
    if (QRCodeWidget.state.active) {
      QRCodeWidget.triggerSync();
    }
  },

  toggleWidget() {
    QRCodeWidget.state.active = !QRCodeWidget.state.active;
    QRCodeWidget.triggerSync();
    App.renderCurrentRoute();
  },

  triggerSync() {
    const s = QRCodeWidget.state;
    const payload = {
      action: 'TRIGGER_QRCODE',
      active: s.active,
      text: s.text,
      qrUrl: s.qrUrl
    };

    if (typeof AnimationControls !== 'undefined') {
      AnimationControls.sendAnimationEvent(payload);
    }

    App.showToast(s.active ? 'QR Code exibido no OBS! 📱' : 'QR Code ocultado.', s.active ? 'success' : 'info');
  }
};
