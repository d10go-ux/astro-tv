/* ============================================================
   ASTRO TV — Custom Scoreboard Builder
   Criador de placares personalizados por imagem de fundo
   Com controle de opacidade e escudos/logos dos times
   ============================================================ */

const ScoreboardBuilder = {
  // Estado do modelo em edição
  currentTemplate: {
    id: null,
    name: 'Meu Placar Personalizado',
    bgImage: null,
    bgOpacity: 1.0, // Opacidade da imagem de fundo (0.0 a 1.0)
    elements: {
      teamA_logo: { x: 18, y: 15, size: 36, isLogo: true },
      teamA_name: { x: 28, y: 15, fontSize: 18, color: '#ffffff', fontFamily: 'Outfit', fontWeight: '700' },
      scoreA:     { x: 42, y: 15, fontSize: 26, color: '#ffffff', fontFamily: 'Orbitron', fontWeight: '900' },
      teamB_logo: { x: 82, y: 15, size: 36, isLogo: true },
      teamB_name: { x: 72, y: 15, fontSize: 18, color: '#ffffff', fontFamily: 'Outfit', fontWeight: '700' },
      scoreB:     { x: 58, y: 15, fontSize: 26, color: '#ffffff', fontFamily: 'Orbitron', fontWeight: '900' },
      period:     { x: 50, y: 10, fontSize: 11, color: '#00e5d0', fontFamily: 'Outfit', fontWeight: '600' },
      timer:      { x: 50, y: 22, fontSize: 16, color: '#ffffff', fontFamily: 'Orbitron', fontWeight: '700' },
    }
  },

  selectedElementKey: 'teamA_name',

  /**
   * Renderiza a view do Criador de Placares
   */
  render() {
    const t = ScoreboardBuilder.currentTemplate;
    const elKeys = [
      { key: 'teamA_logo', label: '🛡️ Logo Time A (Escudo)', isLogo: true },
      { key: 'teamA_name', label: '🔴 Time A (Nome/Sigla)', sample: 'AST' },
      { key: 'scoreA',     label: '🔢 Time A (Pontuação)', sample: '3' },
      { key: 'teamB_logo', label: '🛡️ Logo Time B (Escudo)', isLogo: true },
      { key: 'teamB_name', label: '🔵 Time B (Nome/Sigla)', sample: 'ENV' },
      { key: 'scoreB',     label: '🔢 Time B (Pontuação)', sample: '1' },
      { key: 'period',     label: '📌 Período (1º TEMPO / SET 1)', sample: '1º TEMPO' },
      { key: 'timer',      label: '⏱️ Cronômetro (12:45)', sample: '12:45' }
    ];

    const activeEl = t.elements[ScoreboardBuilder.selectedElementKey] || t.elements.teamA_name;
    const isLogo = activeEl.isLogo;

    return `
      <div class="view-container">
        <div class="container">
          <a class="back-nav" href="#/">← Voltar ao Dashboard</a>

          <div class="section-header flex justify-between items-center">
            <div>
              <h2>🎨 Criador de Placar por Imagem</h2>
              <p>Carregue a imagem do modelo (Copa 2026, Champions), ajuste a transparência e posicione escudos, nomes e placar</p>
            </div>
            <div class="flex gap-3">
              <button class="btn btn-secondary" onclick="ScoreboardBuilder.loadSavedModal()">
                📂 Meus Placares Salvando
              </button>
              <button class="btn btn-primary btn-lg" onclick="ScoreboardBuilder.saveTemplate()">
                💾 Salvar Template
              </button>
            </div>
          </div>

          <div class="builder-layout">
            <!-- Left: Interactive Canvas Preview -->
            <div>
              <div class="panel" style="margin-bottom: var(--sp-4);">
                <div class="panel-header flex justify-between items-center">
                  <h3>🖼️ Preview em Tempo Real</h3>
                  <button class="btn btn-ghost btn-sm" onclick="ScoreboardBuilder.triggerImageUpload()">
                    📷 Alterar Imagem de Fundo
                  </button>
                  <input type="file" id="builder-file-input" accept="image/*" style="display:none;"
                         onchange="ScoreboardBuilder.handleImageUpload(this)">
                </div>
                <div class="panel-body flex justify-center" style="background:#060613;">
                  <div class="builder-canvas-container" id="builder-canvas">
                    ${t.bgImage ? `
                      <img src="${t.bgImage}" class="builder-bg-image" 
                           style="opacity: ${t.bgOpacity !== undefined ? t.bgOpacity : 1};" alt="Modelo de Fundo">
                    ` : `
                      <div class="empty-state" onclick="ScoreboardBuilder.triggerImageUpload()" style="cursor:pointer;">
                        <div class="empty-state-icon">📷</div>
                        <h3>Clique aqui para carregar a Imagem do Placar</h3>
                        <p>Baixe uma imagem de modelo (Copa do Mundo, Champions, TV) e faça upload</p>
                      </div>
                    `}

                    <!-- Render Positioned Elements over image -->
                    ${elKeys.map(item => {
                      const cfg = t.elements[item.key];
                      const isSelected = ScoreboardBuilder.selectedElementKey === item.key;
                      
                      if (item.isLogo) {
                        return `
                          <div class="builder-layer-element ${isSelected ? 'selected-layer' : ''}"
                               style="left: ${cfg.x}%; top: ${cfg.y}%; width: ${cfg.size}px; height: ${cfg.size}px; display:flex; align-items:center; justify-content:center; background: rgba(255,255,255,0.15); border-radius: 6px;"
                               onclick="ScoreboardBuilder.selectElement('${item.key}')">
                            <span style="font-size: ${Math.max(12, cfg.size * 0.5)}px;">🛡️</span>
                          </div>
                        `;
                      }

                      return `
                        <div class="builder-layer-element ${isSelected ? 'selected-layer' : ''}"
                             style="left: ${cfg.x}%; top: ${cfg.y}%; font-size: ${cfg.fontSize}px; color: ${cfg.color}; font-family: '${cfg.fontFamily}', sans-serif; font-weight: ${cfg.fontWeight};"
                             onclick="ScoreboardBuilder.selectElement('${item.key}')">
                          ${item.sample}
                        </div>
                      `;
                    }).join('')}
                  </div>
                </div>
              </div>
            </div>

            <!-- Right: Inspector / Element Controls -->
            <div>
              <!-- Background Image & Transparency Settings -->
              <div class="panel" style="margin-bottom: var(--sp-4);">
                <div class="panel-header">
                  <h3>⚙️ Configuração da Imagem</h3>
                </div>
                <div class="panel-body">
                  <div class="form-group">
                    <label class="form-label">Nome do Modelo</label>
                    <input type="text" class="form-input" value="${t.name}"
                           onchange="ScoreboardBuilder.updateName(this.value)"
                           placeholder="Ex: Placar Copa do Mundo 2026">
                  </div>

                  <div class="form-group">
                    <div class="flex justify-between" style="font-size:12px;margin-bottom:4px;">
                      <span>Transparência / Opacidade da Imagem: <strong>${Math.round((t.bgOpacity !== undefined ? t.bgOpacity : 1) * 100)}%</strong></span>
                    </div>
                    <input type="range" min="0" max="1" step="0.05" value="${t.bgOpacity !== undefined ? t.bgOpacity : 1}"
                           style="width:100%;" oninput="ScoreboardBuilder.updateBgOpacity(parseFloat(this.value))">
                  </div>
                </div>
              </div>

              <!-- Element Selector Tabs -->
              <div class="panel" style="margin-bottom: var(--sp-4);">
                <div class="panel-header">
                  <h3>🎯 Elemento Selecionado</h3>
                </div>
                <div class="panel-body">
                  <div class="form-group">
                    <label class="form-label">Escolha o elemento para posicionar</label>
                    <select class="form-select" onchange="ScoreboardBuilder.selectElement(this.value)">
                      ${elKeys.map(k => `
                        <option value="${k.key}" ${ScoreboardBuilder.selectedElementKey === k.key ? 'selected' : ''}>
                          ${k.label}
                        </option>
                      `).join('')}
                    </select>
                  </div>

                  <!-- Controls for active element -->
                  <div class="layer-control-card active" style="margin-top: var(--sp-4);">
                    <h4 style="font-size: var(--fs-sm); margin-bottom: var(--sp-3);">
                      📍 Posição no Placar
                    </h4>
                    <div class="form-group">
                      <div class="flex justify-between" style="font-size:12px;margin-bottom:4px;">
                        <span>Posição Horizontal (X): <strong>${activeEl.x}%</strong></span>
                      </div>
                      <input type="range" min="0" max="100" step="1" value="${activeEl.x}"
                             style="width:100%;" oninput="ScoreboardBuilder.updateActiveElement('x', parseFloat(this.value))">
                    </div>

                    <div class="form-group">
                      <div class="flex justify-between" style="font-size:12px;margin-bottom:4px;">
                        <span>Posição Vertical (Y): <strong>${activeEl.y}%</strong></span>
                      </div>
                      <input type="range" min="0" max="100" step="1" value="${activeEl.y}"
                             style="width:100%;" oninput="ScoreboardBuilder.updateActiveElement('y', parseFloat(this.value))">
                    </div>

                    ${isLogo ? `
                      <h4 style="font-size: var(--fs-sm); margin-bottom: var(--sp-3); margin-top: var(--sp-4);">
                        🛡️ Tamanho do Escudo / Logo
                      </h4>
                      <div class="form-group">
                        <label class="form-label">Tamanho / Dimensão (px)</label>
                        <input type="number" class="form-input" min="16" max="120" value="${activeEl.size || 36}"
                               onchange="ScoreboardBuilder.updateActiveElement('size', parseInt(this.value))">
                      </div>
                    ` : `
                      <h4 style="font-size: var(--fs-sm); margin-bottom: var(--sp-3); margin-top: var(--sp-4);">
                        🔤 Tipografia & Estilo
                      </h4>
                      <div class="form-row">
                        <div class="form-group">
                          <label class="form-label">Tamanho (px)</label>
                          <input type="number" class="form-input" min="8" max="72" value="${activeEl.fontSize}"
                                 onchange="ScoreboardBuilder.updateActiveElement('fontSize', parseInt(this.value))">
                        </div>
                        <div class="form-group">
                          <label class="form-label">Fonte</label>
                          <select class="form-select" onchange="ScoreboardBuilder.updateActiveElement('fontFamily', this.value)">
                            <option value="Orbitron" ${activeEl.fontFamily === 'Orbitron' ? 'selected' : ''}>Orbitron (Placar)</option>
                            <option value="Outfit" ${activeEl.fontFamily === 'Outfit' ? 'selected' : ''}>Outfit (Moderna)</option>
                            <option value="Inter" ${activeEl.fontFamily === 'Inter' ? 'selected' : ''}>Inter (Limpa)</option>
                          </select>
                        </div>
                      </div>

                      ${ColorPicker.render('builder-color', 'Cor do Texto', activeEl.color, (c) => ScoreboardBuilder.updateActiveElement('color', c))}
                    `}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  selectElement(key) {
    ScoreboardBuilder.selectedElementKey = key;
    App.renderCurrentRoute();
  },

  updateName(name) {
    ScoreboardBuilder.currentTemplate.name = name;
  },

  updateBgOpacity(value) {
    ScoreboardBuilder.currentTemplate.bgOpacity = value;
    ScoreboardBuilder.updateCanvasPreview();
  },

  updateActiveElement(field, value) {
    const key = ScoreboardBuilder.selectedElementKey;
    if (ScoreboardBuilder.currentTemplate.elements[key]) {
      ScoreboardBuilder.currentTemplate.elements[key][field] = value;
      ScoreboardBuilder.updateCanvasPreview();
    }
  },

  triggerImageUpload() {
    const input = document.getElementById('builder-file-input');
    if (input) input.click();
  },

  handleImageUpload(input) {
    const file = input.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      ScoreboardBuilder.currentTemplate.bgImage = e.target.result;
      App.showToast('Imagem modelo de fundo carregada! 🖼️', 'success');
      App.renderCurrentRoute();
    };
    reader.readAsDataURL(file);
  },

  updateCanvasPreview() {
    const canvas = document.getElementById('builder-canvas');
    if (!canvas) return;

    const elKeys = [
      { key: 'teamA_logo', isLogo: true },
      { key: 'teamA_name', sample: 'AST' },
      { key: 'scoreA', sample: '3' },
      { key: 'teamB_logo', isLogo: true },
      { key: 'teamB_name', sample: 'ENV' },
      { key: 'scoreB', sample: '1' },
      { key: 'period', sample: '1º TEMPO' },
      { key: 'timer', sample: '12:45' }
    ];

    const t = ScoreboardBuilder.currentTemplate;
    const elementsHtml = elKeys.map(item => {
      const cfg = t.elements[item.key];
      const isSelected = ScoreboardBuilder.selectedElementKey === item.key;

      if (item.isLogo) {
        return `
          <div class="builder-layer-element ${isSelected ? 'selected-layer' : ''}"
               style="left: ${cfg.x}%; top: ${cfg.y}%; width: ${cfg.size}px; height: ${cfg.size}px; display:flex; align-items:center; justify-content:center; background: rgba(255,255,255,0.15); border-radius: 6px;"
               onclick="ScoreboardBuilder.selectElement('${item.key}')">
            <span style="font-size: ${Math.max(12, cfg.size * 0.5)}px;">🛡️</span>
          </div>
        `;
      }

      return `
        <div class="builder-layer-element ${isSelected ? 'selected-layer' : ''}"
             style="left: ${cfg.x}%; top: ${cfg.y}%; font-size: ${cfg.fontSize}px; color: ${cfg.color}; font-family: '${cfg.fontFamily}', sans-serif; font-weight: ${cfg.fontWeight};"
             onclick="ScoreboardBuilder.selectElement('${item.key}')">
          ${item.sample}
        </div>
      `;
    }).join('');

    const bgImgHtml = t.bgImage ? `
      <img src="${t.bgImage}" class="builder-bg-image" 
           style="opacity: ${t.bgOpacity !== undefined ? t.bgOpacity : 1};" alt="Modelo de Fundo">
    ` : '';

    canvas.innerHTML = bgImgHtml + elementsHtml;
  },

  /**
   * Salva o template atual no localStorage
   */
  saveTemplate() {
    const t = ScoreboardBuilder.currentTemplate;
    if (!t.name) t.name = 'Placar Personalizado';
    if (!t.id) t.id = 'custom_' + Date.now();

    const savedTemplates = JSON.parse(localStorage.getItem('astrotv_custom_templates') || '[]');
    const idx = savedTemplates.findIndex(x => x.id === t.id);

    if (idx >= 0) {
      savedTemplates[idx] = { ...t, savedAt: Date.now() };
    } else {
      savedTemplates.push({ ...t, savedAt: Date.now() });
    }

    localStorage.setItem('astrotv_custom_templates', JSON.stringify(savedTemplates));
    App.showToast(`Template "${t.name}" salvo com sucesso! 💾`, 'success');
  },

  /**
   * Abre modal com lista de placares salvos
   */
  loadSavedModal() {
    const saved = JSON.parse(localStorage.getItem('astrotv_custom_templates') || '[]');
    if (saved.length === 0) {
      App.showToast('Nenhum modelo personalizado salvo ainda.', 'info');
      return;
    }

    const html = saved.map((t, idx) => `
      <div class="export-option" style="justify-content:between;">
        <div class="flex items-center gap-3" onclick="ScoreboardBuilder.selectSaved(${idx})" style="flex:1;cursor:pointer;">
          <div class="export-option-icon">🖼️</div>
          <div class="export-option-info">
            <h4>${t.name}</h4>
            <p>Criado em ${new Date(t.savedAt || Date.now()).toLocaleDateString('pt-BR')}</p>
          </div>
        </div>
        <button class="btn btn-danger btn-sm" onclick="ScoreboardBuilder.deleteSaved(${idx})">
          🗑️ Excluir
        </button>
      </div>
    `).join('');

    App.showModal('📂 Meus Placares Criados', `
      <div class="export-options">${html}</div>
    `);
  },

  selectSaved(idx) {
    const saved = JSON.parse(localStorage.getItem('astrotv_custom_templates') || '[]');
    if (saved[idx]) {
      ScoreboardBuilder.currentTemplate = JSON.parse(JSON.stringify(saved[idx]));
      App.closeModal();
      App.showToast(`Template "${saved[idx].name}" carregado!`, 'success');
      App.renderCurrentRoute();
    }
  },

  deleteSaved(idx) {
    const saved = JSON.parse(localStorage.getItem('astrotv_custom_templates') || '[]');
    if (saved[idx]) {
      const name = saved[idx].name;
      saved.splice(idx, 1);
      localStorage.setItem('astrotv_custom_templates', JSON.stringify(saved));
      App.closeModal();
      App.showToast(`Template "${name}" excluído.`, 'info');
    }
  }
};
