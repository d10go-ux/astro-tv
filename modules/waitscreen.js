/* ============================================================
   ASTRO TV — Wait Screen Module
   Telas de espera, intervalo e fim de jogo
   ============================================================ */

const WaitScreen = {
  state: {
    template: 'gradient',
    type: 'soon',  // soon, interval, end
    customText: '',
    countdownTarget: '',
  },

  render() {
    const { teamA, teamB, sport, match } = AppState.getAll();
    const s = WaitScreen.state;

    return `
      <div class="view-container">
        <div class="container">
          <a class="back-nav" href="#/setup?module=/waitscreen">← Voltar à Configuração</a>

          <div class="section-header">
            <h2>⏳ Tela de Espera</h2>
            <p>Telas auxiliares para transmissão: pré-jogo, intervalo e fim de jogo</p>
          </div>

          <div class="editor-layout">
            <div class="editor-preview">
              <div class="flex justify-center">
                <div id="waitscreen-preview" class="preview-frame preview-frame-landscape">
                  ${WaitScreen.renderTemplate(s.template)}
                </div>
              </div>
            </div>

            <div class="editor-sidebar">
              <div class="panel">
                <div class="panel-header"><h3>📺 Tipo de Tela</h3></div>
                <div class="panel-body">
                  <div class="tabs" style="margin-bottom:var(--sp-4);">
                    <div class="tab ${s.type === 'soon' ? 'active' : ''}" onclick="WaitScreen.setType('soon')">Em Breve</div>
                    <div class="tab ${s.type === 'interval' ? 'active' : ''}" onclick="WaitScreen.setType('interval')">Intervalo</div>
                    <div class="tab ${s.type === 'end' ? 'active' : ''}" onclick="WaitScreen.setType('end')">Fim de Jogo</div>
                  </div>
                </div>
              </div>

              <div class="panel">
                <div class="panel-header"><h3>🎨 Estilo</h3></div>
                <div class="panel-body">
                  <div class="tabs">
                    <div class="tab ${s.template === 'gradient' ? 'active' : ''}" onclick="WaitScreen.setTemplate('gradient')">Gradiente</div>
                    <div class="tab ${s.template === 'minimal' ? 'active' : ''}" onclick="WaitScreen.setTemplate('minimal')">Minimal</div>
                    <div class="tab ${s.template === 'cosmic' ? 'active' : ''}" onclick="WaitScreen.setTemplate('cosmic')">Cósmico</div>
                  </div>
                </div>
              </div>

              <div class="panel">
                <div class="panel-header"><h3>📝 Texto Customizado</h3></div>
                <div class="panel-body">
                  <div class="form-group">
                    <label class="form-label">Texto extra (opcional)</label>
                    <input type="text" class="form-input" value="${s.customText}" 
                           placeholder="Ex: Transmissão volta em 5 minutos"
                           onchange="WaitScreen.update('customText', this.value)">
                  </div>
                </div>
              </div>

              ${ExportPanel.render({
                showDownload: true,
                showOverlayUrl: true,
                overlayUrl: 'overlay/waitscreen.html',
                elementId: 'waitscreen-preview',
                filename: 'astrotv-waitscreen'
              })}
            </div>
          </div>
        </div>
      </div>
    `;
  },

  renderTemplate(template) {
    const { teamA, teamB, sport, match } = AppState.getAll();
    const s = WaitScreen.state;
    const sportEmoji = sport === 'volei' ? '🏐' : sport === 'basquete' ? '🏀' : '⚽';

    let title = '', subtitle = '';
    if (s.type === 'soon') {
      title = 'EM BREVE';
      subtitle = `${teamA.name || 'Time A'} × ${teamB.name || 'Time B'}`;
    } else if (s.type === 'interval') {
      title = 'INTERVALO';
      subtitle = s.customText || 'Voltamos em instantes';
    } else {
      title = 'FIM DE JOGO';
      subtitle = `${teamA.name || 'Time A'} × ${teamB.name || 'Time B'}`;
    }

    if (template === 'minimal') {
      return `
        <div style="width:100%;height:100%;background:#0a0a0a;display:flex;flex-direction:column;align-items:center;justify-content:center;position:relative;overflow:hidden;">
          <div style="position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,${teamA.color},transparent 40%,transparent 60%,${teamB.color});"></div>
          <div style="font-family:var(--font-display);font-weight:300;font-size:10px;color:rgba(255,255,255,0.3);letter-spacing:8px;text-transform:uppercase;margin-bottom:8px;">${match.tournament || 'ASTRO TV'}</div>
          <div style="font-family:var(--font-display);font-weight:900;font-size:42px;color:white;text-transform:uppercase;letter-spacing:4px;margin-bottom:12px;">${title}</div>
          <div style="font-size:14px;color:rgba(255,255,255,0.4);">${subtitle}</div>
          ${s.type === 'interval' || s.type === 'soon' ? `<div style="margin-top:20px;display:flex;gap:8px;">${[0,1,2].map(i => `<div style="width:8px;height:8px;border-radius:50%;background:var(--primary);opacity:${0.3 + i * 0.3};animation:pulse 1.5s ease-in-out ${i * 0.3}s infinite;"></div>`).join('')}</div>` : ''}
          <div style="position:absolute;bottom:20px;font-family:var(--font-mono);font-size:9px;color:rgba(255,255,255,0.1);letter-spacing:4px;">ASTRO TV ${sportEmoji}</div>
        </div>
      `;
    }

    if (template === 'cosmic') {
      return `
        <div style="width:100%;height:100%;background:linear-gradient(135deg, #0a001a, #0d0d2b, #001a1a);display:flex;flex-direction:column;align-items:center;justify-content:center;position:relative;overflow:hidden;">
          <div style="position:absolute;inset:0;background:radial-gradient(circle at 30% 40%, rgba(124,92,252,0.12), transparent 50%), radial-gradient(circle at 70% 60%, rgba(0,229,208,0.08), transparent 50%);"></div>
          <div style="position:absolute;inset:0;background:url('data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><circle cx="20" cy="30" r="1" fill="white" opacity="0.15"/><circle cx="80" cy="10" r="0.5" fill="white" opacity="0.2"/><circle cx="150" cy="50" r="1" fill="white" opacity="0.1"/><circle cx="40" cy="90" r="0.5" fill="white" opacity="0.2"/><circle cx="120" cy="70" r="1" fill="white" opacity="0.15"/><circle cx="180" cy="120" r="0.5" fill="white" opacity="0.1"/><circle cx="60" cy="150" r="1" fill="white" opacity="0.2"/><circle cx="160" cy="170" r="0.5" fill="white" opacity="0.15"/><circle cx="100" cy="130" r="1" fill="white" opacity="0.1"/></svg>')}');opacity:0.5;"></div>
          <div style="font-family:var(--font-mono);font-weight:700;font-size:10px;color:var(--secondary);letter-spacing:6px;margin-bottom:12px;position:relative;">📡 ${match.tournament || 'ASTRO TV'}</div>
          <div style="font-family:var(--font-display);font-weight:900;font-size:48px;background:var(--gradient-primary);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;text-transform:uppercase;letter-spacing:3px;margin-bottom:16px;position:relative;text-shadow:none;">${title}</div>
          <div style="font-family:var(--font-display);font-size:16px;color:rgba(255,255,255,0.5);position:relative;">${subtitle}</div>
          ${s.type === 'end' ? `
            <div style="margin-top:20px;display:flex;align-items:center;gap:20px;position:relative;">
              <div style="text-align:center;"><div style="font-family:var(--font-mono);font-weight:900;font-size:28px;color:${teamA.color};text-shadow:0 0 20px ${teamA.color}66;">0</div><div style="font-size:10px;color:rgba(255,255,255,0.4);">${teamA.abbr || 'A'}</div></div>
              <div style="font-size:12px;color:rgba(255,255,255,0.2);">×</div>
              <div style="text-align:center;"><div style="font-family:var(--font-mono);font-weight:900;font-size:28px;color:${teamB.color};text-shadow:0 0 20px ${teamB.color}66;">0</div><div style="font-size:10px;color:rgba(255,255,255,0.4);">${teamB.abbr || 'B'}</div></div>
            </div>
          ` : ''}
          ${s.customText ? `<div style="margin-top:16px;font-size:12px;color:rgba(255,255,255,0.35);position:relative;">${s.customText}</div>` : ''}
          <div style="position:absolute;bottom:20px;font-family:var(--font-mono);font-size:9px;color:rgba(255,255,255,0.1);letter-spacing:4px;">ASTRO TV</div>
        </div>
      `;
    }

    // Gradient (default)
    return `
      <div style="width:100%;height:100%;background:linear-gradient(135deg, ${teamA.color}cc 0%, #0a0a1a 40%, #0a0a1a 60%, ${teamB.color}cc 100%);display:flex;flex-direction:column;align-items:center;justify-content:center;position:relative;overflow:hidden;">
        <div style="position:absolute;inset:0;background:radial-gradient(circle at center, rgba(0,0,0,0.3), transparent 70%);"></div>
        <div style="font-family:var(--font-display);font-weight:400;font-size:11px;color:rgba(255,255,255,0.4);letter-spacing:6px;text-transform:uppercase;margin-bottom:12px;position:relative;">${sportEmoji} ${match.tournament || 'CAMPEONATO'}</div>
        <div style="font-family:var(--font-display);font-weight:900;font-size:52px;color:white;text-transform:uppercase;letter-spacing:4px;text-shadow:0 4px 30px rgba(0,0,0,0.5);margin-bottom:12px;position:relative;">${title}</div>
        <div style="font-family:var(--font-display);font-size:16px;color:rgba(255,255,255,0.6);margin-bottom:8px;position:relative;">${subtitle}</div>
        ${s.type === 'soon' && match.time ? `<div style="font-family:var(--font-mono);font-weight:700;font-size:20px;color:white;margin-top:12px;position:relative;">⏰ ${match.time}</div>` : ''}
        ${s.type === 'end' ? `
          <div style="margin-top:16px;display:flex;align-items:center;gap:24px;position:relative;">
            <div style="text-align:center;">
              <div style="font-family:var(--font-mono);font-weight:900;font-size:36px;color:white;">0</div>
              <div style="font-size:11px;color:rgba(255,255,255,0.5);margin-top:4px;">${teamA.name || 'A'}</div>
            </div>
            <div style="font-size:18px;color:rgba(255,255,255,0.3);">×</div>
            <div style="text-align:center;">
              <div style="font-family:var(--font-mono);font-weight:900;font-size:36px;color:white;">0</div>
              <div style="font-size:11px;color:rgba(255,255,255,0.5);margin-top:4px;">${teamB.name || 'B'}</div>
            </div>
          </div>
        ` : ''}
        ${s.customText ? `<div style="margin-top:12px;font-size:13px;color:rgba(255,255,255,0.4);position:relative;">${s.customText}</div>` : ''}
        ${s.type !== 'end' ? `<div style="margin-top:20px;display:flex;gap:8px;position:relative;">${[0,1,2].map(i => `<div style="width:6px;height:6px;border-radius:50%;background:white;opacity:${0.2 + i * 0.2};animation:pulse 1.5s ease-in-out ${i * 0.3}s infinite;"></div>`).join('')}</div>` : ''}
        <div style="position:absolute;bottom:20px;font-family:var(--font-mono);font-size:9px;color:rgba(255,255,255,0.15);letter-spacing:4px;">ASTRO TV</div>
      </div>
    `;
  },

  setType(t) {
    WaitScreen.state.type = t;
    App.renderCurrentRoute();
  },

  setTemplate(t) {
    WaitScreen.state.template = t;
    WaitScreen.updatePreview();
    document.querySelectorAll('.editor-sidebar .panel:nth-child(2) .tab').forEach(tab => tab.classList.remove('active'));
    event.target.classList.add('active');
  },

  update(field, value) {
    WaitScreen.state[field] = value;
    WaitScreen.updatePreview();
    WaitScreen.syncOverlay();
  },

  updatePreview() {
    const preview = document.getElementById('waitscreen-preview');
    if (preview) {
      preview.innerHTML = WaitScreen.renderTemplate(WaitScreen.state.template);
    }
  },

  syncOverlay() {
    const data = {
      ...WaitScreen.state,
      teamA: AppState.get('teamA'),
      teamB: AppState.get('teamB'),
      sport: AppState.get('sport'),
      match: AppState.get('match'),
      timestamp: Date.now()
    };
    localStorage.setItem('astrotv_waitscreen_data', JSON.stringify(data));
    try {
      if (!WaitScreen._channel) WaitScreen._channel = new BroadcastChannel('astrotv_waitscreen');
      WaitScreen._channel.postMessage(data);
    } catch (e) {}
  },
  _channel: null
};
