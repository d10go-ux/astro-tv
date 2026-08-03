/* ============================================================
   ASTRO TV — Color Picker Component
   Seletor de cores customizado com paleta pré-definida
   ============================================================ */

const ColorPicker = {
  // Paleta de cores esportivas
  presets: [
    '#e74c3c', '#c0392b', '#e67e22', '#f39c12', '#f1c40f',
    '#2ecc71', '#27ae60', '#1abc9c', '#16a085', '#3498db',
    '#2980b9', '#2c3e50', '#8e44ad', '#9b59b6', '#e84393',
    '#d63031', '#fd79a8', '#00cec9', '#6c5ce7', '#0984e3',
    '#ffffff', '#dfe6e9', '#636e72', '#2d3436', '#000000',
  ],

  /**
   * Renderiza o componente de seleção de cor
   * @param {string} id - ID único do componente
   * @param {string} label - Rótulo do campo
   * @param {string} currentColor - Cor atual (hex)
   * @param {Function} onChange - Callback de mudança
   * @returns {string} HTML do componente
   */
  render(id, label, currentColor = '#7c5cfc', onChange = null) {
    // Registrar callback
    if (onChange) {
      ColorPicker._callbacks[id] = onChange;
    }

    return `
      <div class="form-group" id="color-picker-${id}">
        <label class="form-label">${label}</label>
        <div class="color-picker-wrapper">
          <div class="color-swatch" style="background: ${currentColor}" id="swatch-${id}">
            <input type="color" value="${currentColor}" 
                   id="color-input-${id}" 
                   onchange="ColorPicker.handleChange('${id}', this.value)">
          </div>
          <input type="text" class="form-input" value="${currentColor}" 
                 id="color-hex-${id}" 
                 maxlength="7" 
                 placeholder="#000000"
                 style="max-width: 120px; font-family: var(--font-mono); font-size: var(--fs-sm);"
                 onchange="ColorPicker.handleHexInput('${id}', this.value)">
        </div>
        <div class="color-presets" style="margin-top: var(--sp-3)">
          ${ColorPicker.presets.map(color => `
            <div class="color-preset ${color === currentColor ? 'active' : ''}" 
                 style="background: ${color}" 
                 onclick="ColorPicker.selectPreset('${id}', '${color}')"
                 title="${color}">
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  // Armazena callbacks por ID
  _callbacks: {},

  /**
   * Lida com mudança no input color nativo
   */
  handleChange(id, value) {
    ColorPicker._updateUI(id, value);
    if (ColorPicker._callbacks[id]) {
      ColorPicker._callbacks[id](value);
    }
  },

  /**
   * Lida com input de hex manual
   */
  handleHexInput(id, value) {
    if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
      ColorPicker._updateUI(id, value);
      if (ColorPicker._callbacks[id]) {
        ColorPicker._callbacks[id](value);
      }
    }
  },

  /**
   * Seleciona um preset de cor
   */
  selectPreset(id, color) {
    ColorPicker._updateUI(id, color);
    if (ColorPicker._callbacks[id]) {
      ColorPicker._callbacks[id](color);
    }
  },

  /**
   * Atualiza a UI do componente
   */
  _updateUI(id, color) {
    const swatch = document.getElementById(`swatch-${id}`);
    const colorInput = document.getElementById(`color-input-${id}`);
    const hexInput = document.getElementById(`color-hex-${id}`);
    const container = document.getElementById(`color-picker-${id}`);

    if (swatch) swatch.style.background = color;
    if (colorInput) colorInput.value = color;
    if (hexInput) hexInput.value = color;

    // Atualizar preset ativo
    if (container) {
      container.querySelectorAll('.color-preset').forEach(preset => {
        preset.classList.toggle('active', preset.style.background === color || 
          ColorPicker._rgbToHex(preset.style.background) === color.toLowerCase());
      });
    }
  },

  /**
   * Converte rgb(r,g,b) para hex
   */
  _rgbToHex(rgb) {
    if (rgb.startsWith('#')) return rgb.toLowerCase();
    const match = rgb.match(/(\d+)/g);
    if (!match || match.length < 3) return rgb;
    return '#' + match.slice(0, 3).map(x => {
      const hex = parseInt(x).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  }
};
