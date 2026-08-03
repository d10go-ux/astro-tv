/* ============================================================
   ASTRO TV — Lower Third Module
   Barra inferior de informações para overlay
   ============================================================ */

const LowerThird = {
  state: {
    template: 'modern',
    type: 'player',  // player, team, info
    playerName: '',
    playerNumber: '',
    playerPosition: '',
    infoTitle: '',
    infoSubtitle: '',
    visible: true,
  },

  render() {
    const { teamA, teamB, sport, match } = AppState.getAll();
    const s = LowerThird.state;

    return `
      <div class="view-container">
        <div class="container">
          <a class="back-nav" href="#/setup?module=/lowerthird">← Voltar à Configuração</a>

          <div class="section-header">
            <h2>📺 Lower Third</h2>
            <p>Barra de informações inferior para overlay no OBS</p>
          </div>

          <div class="editor-layout">
            <div class="editor-preview">
              <div class="preview-frame preview-frame-landscape" id="lowerthird-preview" 
                   style="background:#1a1a2e;display:flex;align-items:flex-end;justify-content:flex-start;">
                ${s.visible ? LowerThird.renderOverlay(s.template) : ''}
              </div>
            </div>

            <div class="editor-sidebar">
              <!-- Template -->
              <div class="panel">
                <div class="panel-header"><h3>🎨 Template</h3></div>
                <div class="panel-body">
                  <div class="tabs" style="margin-bottom:var(--sp-4);">
                    <div class="tab ${s.template === 'modern' ? 'active' : ''}" onclick="LowerThird.setTemplate('modern')">Moderno</div>
                    <div class="tab ${s.template === 'minimal' ? 'active' : ''}" onclick="LowerThird.setTemplate('minimal')">Minimal</div>
                    <div class="tab ${s.template === 'sport' ? 'active' : ''}" onclick="LowerThird.setTemplate('sport')">Esportivo</div>
                  </div>
                </div>
              </div>

              <!-- Type -->
              <div class="panel">
                <div class="panel-header"><h3>📋 Tipo de Info</h3></div>
                <div class="panel-body">
                  <div class="tabs" style="margin-bottom:var(--sp-4);">
                    <div class="tab ${s.type === 'player' ? 'active' : ''}" onclick="LowerThird.setType('player')">Jogador</div>
                    <div class="tab ${s.type === 'team' ? 'active' : ''}" onclick="LowerThird.setType('team')">Time</div>
                    <div class="tab ${s.type === 'info' ? 'active' : ''}" onclick="LowerThird.setType('info')">Livre</div>
                  </div>

                  ${s.type === 'player' ? `
                    <div class="form-group">
                      <label class="form-label">Nome do Jogador</label>
                      <input type="text" class="form-input" value="${s.playerName}" placeholder="Ex: João Silva"
                             onchange="LowerThird.update('playerName', this.value)">
                    </div>
                    <div class="form-row">
                      <div class="form-group">
                        <label class="form-label">Número</label>
                        <input type="text" class="form-input" value="${s.playerNumber}" placeholder="10"
                               style="font-family:var(--font-mono);font-weight:700;text-align:center;"
                               onchange="LowerThird.update('playerNumber', this.value)">
                      </div>
                      <div class="form-group">
                        <label class="form-label">Posição</label>
                        <input type="text" class="form-input" value="${s.playerPosition}" placeholder="Levantador"
                               onchange="LowerThird.update('playerPosition', this.value)">
                      </div>
                    </div>
                    <div class="form-group">
                      <label class="form-label">Time</label>
                      <select class="form-select" onchange="LowerThird.update('selectedTeam', this.value)">
                        <option value="A" selected>${teamA.name || 'Time A'}</option>
                        <option value="B">${teamB.name || 'Time B'}</option>
                      </select>
                    </div>
                  ` : s.type === 'team' ? `
                    <div class="form-group">
                      <label class="form-label">Time</label>
                      <select class="form-select" onchange="LowerThird.update('selectedTeam', this.value)">
                        <option value="A" selected>${teamA.name || 'Time A'}</option>
                        <option value="B">${teamB.name || 'Time B'}</option>
                      </select>
                    </div>
                  ` : `
                    <div class="form-group">
                      <label class="form-label">Título</label>
                      <input type="text" class="form-input" value="${s.infoTitle}" placeholder="Título"
                             onchange="LowerThird.update('infoTitle', this.value)">
                    </div>
                    <div class="form-group">
                      <label class="form-label">Subtítulo</label>
                      <input type="text" class="form-input" value="${s.infoSubtitle}" placeholder="Informação extra"
                             onchange="LowerThird.update('infoSubtitle', this.value)">
                    </div>
                  `}
                </div>
              </div>

              <!-- Visibility -->
              <div class="panel">
                <div class="panel-header"><h3>👁️ Controle</h3></div>
                <div class="panel-body">
                  <button class="btn ${s.visible ? 'btn-danger' : 'btn-primary'} w-full" 
                          onclick="LowerThird.toggleVisibility()">
                    ${s.visible ? '🙈 Esconder' : '👁️ Mostrar'}
                  </button>
                </div>
              </div>

              ${ExportPanel.render({
                showDownload: true,
                showOverlayUrl: true,
                overlayUrl: 'overlay/lowerthird.html',
                elementId: 'lowerthird-preview',
                filename: 'astrotv-lowerthird'
              })}
            </div>
          </div>
        </div>
      </div>
    `;
  },

  renderOverlay(template) {
    const { teamA, teamB } = AppState.getAll();
    const s = LowerThird.state;
    const team = (s.selectedTeam || 'A') === 'A' ? teamA : teamB;
    
    let title = '', subtitle = '';
    if (s.type === 'player') {
      title = s.playerName || 'Nome do Jogador';
      subtitle = [s.playerNumber ? `#${s.playerNumber}` : '', s.playerPosition || ''].filter(Boolean).join(' • ') || 'Informação';
    } else if (s.type === 'team') {
      title = team.name || 'Nome do Time';
      subtitle = AppState.get('match').tournament || 'Campeonato';
    } else {
      title = s.infoTitle || 'Título';
      subtitle = s.infoSubtitle || 'Informação';
    }

    if (template === 'minimal') {
      return `
        <div style="margin:0 0 40px 40px;display:flex;align-items:stretch;animation:slideInLeft 0.5s ease;">
          <div style="width:4px;background:${team.color};border-radius:2px;"></div>
          <div style="padding:8px 20px;background:rgba(0,0,0,0.7);backdrop-filter:blur(12px);">
            <div style="font-family:var(--font-display);font-weight:700;font-size:16px;color:white;">${title}</div>
            <div style="font-size:12px;color:rgba(255,255,255,0.6);">${subtitle}</div>
          </div>
        </div>
      `;
    }

    if (template === 'sport') {
      return `
        <div style="margin:0 0 40px 40px;display:flex;align-items:stretch;animation:slideInLeft 0.5s ease;overflow:hidden;border-radius:6px;">
          <div style="background:${team.color};padding:8px 14px;display:flex;align-items:center;justify-content:center;">
            ${s.type === 'player' && s.playerNumber ? `<span style="font-family:var(--font-mono);font-weight:900;font-size:22px;color:white;text-shadow:0 2px 4px rgba(0,0,0,0.3);">${s.playerNumber}</span>` : `<span style="font-family:var(--font-mono);font-weight:800;font-size:12px;color:white;letter-spacing:1px;">${team.abbr || '???'}</span>`}
          </div>
          <div style="padding:8px 20px;background:rgba(0,0,0,0.85);">
            <div style="font-family:var(--font-display);font-weight:700;font-size:16px;color:white;text-transform:uppercase;">${title}</div>
            <div style="font-size:11px;color:rgba(255,255,255,0.5);text-transform:uppercase;letter-spacing:1px;">${subtitle}</div>
          </div>
          <div style="width:4px;background:${team.color};"></div>
        </div>
      `;
    }

    // Modern (default)
    return `
      <div style="margin:0 0 40px 40px;display:flex;align-items:stretch;border-radius:8px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.5);animation:slideInLeft 0.5s ease;">
        <div style="width:6px;background:linear-gradient(180deg,${team.color},${team.color}88);"></div>
        <div style="padding:10px 24px;background:rgba(10,10,20,0.9);backdrop-filter:blur(16px);border:1px solid rgba(255,255,255,0.06);border-left:none;">
          <div style="font-family:var(--font-display);font-weight:700;font-size:17px;color:white;letter-spacing:0.5px;">${title}</div>
          <div style="font-size:12px;color:rgba(255,255,255,0.5);margin-top:2px;">${subtitle}</div>
        </div>
      </div>
    `;
  },

  setTemplate(t) {
    LowerThird.state.template = t;
    LowerThird.updatePreview();
    document.querySelectorAll('.editor-sidebar .panel:first-child .tab').forEach(tab => tab.classList.remove('active'));
    event.target.classList.add('active');
  },

  setType(t) {
    LowerThird.state.type = t;
    App.renderCurrentRoute();
  },

  update(field, value) {
    LowerThird.state[field] = value;
    LowerThird.updatePreview();
    LowerThird.syncOverlay();
  },

  toggleVisibility() {
    LowerThird.state.visible = !LowerThird.state.visible;
    LowerThird.updatePreview();
    LowerThird.syncOverlay();
    App.renderCurrentRoute();
  },

  updatePreview() {
    const preview = document.getElementById('lowerthird-preview');
    if (preview) {
      preview.innerHTML = LowerThird.state.visible ? LowerThird.renderOverlay(LowerThird.state.template) : '';
    }
  },

  syncOverlay() {
    const data = {
      ...LowerThird.state,
      teamA: AppState.get('teamA'),
      teamB: AppState.get('teamB'),
      timestamp: Date.now()
    };
    localStorage.setItem('astrotv_lowerthird_data', JSON.stringify(data));
    try {
      if (!LowerThird._channel) LowerThird._channel = new BroadcastChannel('astrotv_lowerthird');
      LowerThird._channel.postMessage(data);
    } catch (e) {}
  },
  _channel: null
};
