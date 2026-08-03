/* ============================================================
   ASTRO TV — Export Panel Component
   Painel de exportação de imagens e URLs para OBS
   ============================================================ */

const ExportPanel = {
  /**
   * Renderiza o painel de exportação
   * @param {Object} options - Configurações do painel
   * @returns {string} HTML do componente
   */
  render(options = {}) {
    const {
      showDownload = true,
      showOverlayUrl = false,
      overlayUrl = '',
      showResolution = true,
      elementId = '',
      filename = 'astrotv-export'
    } = options;

    return `
      <div class="export-panel">
        <h3 style="font-size: var(--fs-md); margin-bottom: var(--sp-4);">📤 Exportar</h3>
        <div class="export-options">
          ${showDownload ? `
            <div class="export-option" onclick="ExportPanel.downloadImage('${elementId}', '${filename}')">
              <div class="export-option-icon">🖼️</div>
              <div class="export-option-info">
                <h4>Download PNG</h4>
                <p>Salvar como imagem de alta qualidade</p>
              </div>
            </div>
          ` : ''}

          ${showOverlayUrl ? `
            <div class="export-option" onclick="ExportPanel.copyOverlayUrl('${overlayUrl}')">
              <div class="export-option-icon" style="background: rgba(var(--secondary-rgb), 0.1); color: var(--secondary);">🔗</div>
              <div class="export-option-info">
                <h4>URL para OBS</h4>
                <p>Copiar link do Browser Source</p>
              </div>
            </div>
          ` : ''}

          ${showResolution ? `
            <div style="margin-top: var(--sp-2);">
              <label class="form-label">Resolução</label>
              <select class="form-select" id="export-resolution" onchange="ExportPanel.setResolution(this.value)">
                <option value="2" selected>Alta (2x) — Recomendado</option>
                <option value="1">Normal (1x)</option>
                <option value="3">Ultra (3x)</option>
              </select>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  },

  /**
   * Faz download do elemento como imagem PNG
   */
  async downloadImage(elementId, filename = 'astrotv-export') {
    const element = document.getElementById(elementId);
    if (!element) {
      App.showToast('Elemento de preview não encontrado', 'error');
      return;
    }

    try {
      App.showToast('Gerando imagem...', 'info');

      const scale = parseInt(document.getElementById('export-resolution')?.value || '2');

      const canvas = await html2canvas(element, {
        scale: scale,
        backgroundColor: null,
        useCORS: true,
        allowTaint: true,
        logging: false,
      });

      const link = document.createElement('a');
      link.download = `${filename}-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

      App.showToast('Imagem exportada com sucesso! 🎉', 'success');
    } catch (error) {
      console.error('Export error:', error);
      App.showToast('Erro ao exportar imagem. Tente novamente.', 'error');
    }
  },

  /**
   * Copia URL do overlay para clipboard
   */
  async copyOverlayUrl(url) {
    try {
      // Construir URL completa
      const fullUrl = url.startsWith('http') ? url : `${window.location.origin}${window.location.pathname.replace('index.html', '')}${url}`;
      
      await navigator.clipboard.writeText(fullUrl);
      App.showToast('URL copiada! Cole como Browser Source no OBS 📋', 'success');
    } catch (error) {
      // Fallback
      const input = document.createElement('input');
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      App.showToast('URL copiada! 📋', 'success');
    }
  },

  _resolution: 2,

  setResolution(value) {
    ExportPanel._resolution = parseInt(value);
  }
};
