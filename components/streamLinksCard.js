/* ============================================================
   ASTRO TV — Stream Links Card (Uno Overlays Architecture)
   Sistema de Duas URLs: Output (Grafismo OBS) e Control (Dock OBS / Celular)
   ============================================================ */

const StreamLinksCard = {
  render() {
    const key = typeof FirebaseConfig !== 'undefined' ? FirebaseConfig.getRoomId() : 'ASTRO-LIVE';
    const baseUrl = window.location.origin;
    const outputUrl = `${baseUrl}/overlay/scoreboard.html?key=${key}`;
    const controlUrl = `${baseUrl}/#/control?key=${key}`;

    return `
      <div class="panel" style="margin-bottom: var(--sp-4); border: 1px solid rgba(124, 92, 252, 0.4); background: linear-gradient(135deg, rgba(124, 92, 252, 0.08) 0%, rgba(6, 6, 19, 0.95) 100%);">
        <div class="panel-header flex justify-between items-center">
          <h3>📡 Links da Transmissão (Estilo Uno Overlays)</h3>
          <span class="badge badge-secondary" style="font-family:var(--font-mono);font-weight:700;">CHAVE: ${key}</span>
        </div>
        <div class="panel-body">
          <p style="font-size:12px;color:var(--text-muted);margin-bottom:12px;">
            Conecte o grafismo e controle a transmissão direto de dentro do OBS Studio (via Docks) ou pelo Celular.
          </p>

          <!-- URL 1: OUTPUT GRAPHIC FOR OBS -->
          <div class="form-group" style="margin-bottom: 12px;">
            <label class="form-label" style="font-size:12px;color:var(--secondary);font-weight:700;">
              🖼️ 1. URL do Grafismo (Para adicionar como Fonte de Navegador no OBS)
            </label>
            <div class="form-row">
              <input type="text" class="form-input" readonly value="${outputUrl}" id="output-url-input" style="font-size:12px;font-family:var(--font-mono);">
              <button class="btn btn-secondary btn-sm" onclick="StreamLinksCard.copyUrl('output-url-input', 'URL do Grafismo')">
                📋 Copiar URL
              </button>
            </div>
          </div>

          <!-- URL 2: CONTROL PANEL FOR OBS DOCK & MOBILE -->
          <div class="form-group" style="margin-bottom: 12px;">
            <label class="form-label" style="font-size:12px;color:var(--primary-light);font-weight:700;">
              🎛️ 2. URL de Controle (Para Docks Encaixáveis do OBS ou Celular)
            </label>
            <div class="form-row">
              <input type="text" class="form-input" readonly value="${controlUrl}" id="control-url-input" style="font-size:12px;font-family:var(--font-mono);">
              <button class="btn btn-primary btn-sm" onclick="StreamLinksCard.copyUrl('control-url-input', 'URL de Controle')">
                📋 Copiar URL
              </button>
            </div>
          </div>

          <!-- OBS DOCK INSTRUCTIONS -->
          <div style="background: rgba(255,255,255,0.04); padding: 10px 14px; border-radius: 8px; border: 1px solid var(--border-color); margin-top: 12px;">
            <div style="font-size: 11px; font-weight: 700; color: white; margin-bottom: 4px;">💡 Como Encaixar este Painel de Controle DENTRO do OBS Studio:</div>
            <ol style="font-size: 11px; color: var(--text-muted); margin-left: 16px; line-height: 1.5;">
              <li>No OBS Studio, vá no menu do topo: <b>Docks > Docks de Navegador Personalizados...</b></li>
              <li>Nome do Dock: <b>ASTRO TV</b> | URL: cole a <b>URL de Controle (Nº 2)</b> acima.</li>
              <li>Clique em <b>Aplicar</b>: a janela do ASTRO TV vai abrir e você pode encaixá-la ao lado das Cenas do OBS!</li>
            </ol>
          </div>
        </div>
      </div>
    `;
  },

  copyUrl(inputId, name) {
    const input = document.getElementById(inputId);
    if (!input) return;

    navigator.clipboard.writeText(input.value).then(() => {
      App.showToast(`${name} copiada com sucesso! 📋`, 'success');
    }).catch(() => {
      input.select();
      document.execCommand('copy');
      App.showToast(`${name} copiada! 📋`, 'success');
    });
  }
};
