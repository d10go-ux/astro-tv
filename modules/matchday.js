/* ============================================================
   ASTRO TV — Matchday Module
   Arte "DIA DE JOGO" para redes sociais
   ============================================================ */

const Matchday = {
  state: {
    template: 'fire',
    format: 'square',
  },

  render() {
    const { teamA, teamB, sport, match } = AppState.getAll();
    const s = Matchday.state;

    return `
      <div class="view-container">
        <div class="container">
          <a class="back-nav" href="#/setup?module=/matchday">← Voltar à Configuração</a>

          <div class="section-header">
            <h2>📅 Dia de Jogo</h2>
            <p>Arte de impacto para anunciar que é dia de jogo!</p>
          </div>

          <div class="editor-layout">
            <div class="editor-preview">
              <div class="flex justify-center">
                <div id="matchday-preview" class="preview-frame ${s.format === 'story' ? 'preview-frame-story' : 'preview-frame-1080'}">
                  ${Matchday.renderTemplate(s.template)}
                </div>
              </div>
            </div>

            <div class="editor-sidebar">
              <div class="panel">
                <div class="panel-header"><h3>🎨 Template</h3></div>
                <div class="panel-body">
                  <div class="tabs" style="margin-bottom: var(--sp-4);">
                    <div class="tab ${s.template === 'fire' ? 'active' : ''}" 
                         onclick="Matchday.setTemplate('fire')">🔥 Fire</div>
                    <div class="tab ${s.template === 'clean' ? 'active' : ''}" 
                         onclick="Matchday.setTemplate('clean')">✨ Clean</div>
                    <div class="tab ${s.template === 'energy' ? 'active' : ''}" 
                         onclick="Matchday.setTemplate('energy')">⚡ Energy</div>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Formato</label>
                    <div class="radio-group">
                      <label class="radio-card">
                        <input type="radio" name="matchday-format" value="square" ${s.format === 'square' ? 'checked' : ''}
                               onchange="Matchday.setFormat('square')">
                        <div class="radio-card-content">
                          <span class="icon">⬜</span>
                          <span class="label">Feed</span>
                        </div>
                      </label>
                      <label class="radio-card">
                        <input type="radio" name="matchday-format" value="story" ${s.format === 'story' ? 'checked' : ''}
                               onchange="Matchday.setFormat('story')">
                        <div class="radio-card-content">
                          <span class="icon">📱</span>
                          <span class="label">Stories</span>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              ${ExportPanel.render({
                showDownload: true,
                showOverlayUrl: false,
                elementId: 'matchday-preview',
                filename: 'astrotv-matchday'
              })}
            </div>
          </div>
        </div>
      </div>
    `;
  },

  renderTemplate(template) {
    const { teamA, teamB, sport, match } = AppState.getAll();
    const sportEmoji = sport === 'volei' ? '🏐' : sport === 'basquete' ? '🏀' : '⚽';
    const time = match.time || '--:--';
    const location = match.location || 'Local a definir';

    if (template === 'clean') {
      return `
        <div style="width:100%;height:100%;background:linear-gradient(180deg, #111 0%, #0a0a0a 100%);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px;position:relative;overflow:hidden;">
          <div style="position:absolute;top:0;left:0;right:0;height:4px;background:linear-gradient(90deg,${teamA.color},transparent 30%,transparent 70%,${teamB.color});"></div>
          <span style="font-family:var(--font-display);font-weight:300;font-size:12px;color:rgba(255,255,255,0.3);letter-spacing:8px;text-transform:uppercase;margin-bottom:8px;position:relative;">É HOJE</span>
          <span style="font-family:var(--font-display);font-weight:900;font-size:40px;color:white;text-transform:uppercase;letter-spacing:2px;margin-bottom:32px;position:relative;line-height:1.1;">DIA DE<br>JOGO ${sportEmoji}</span>
          <div style="display:flex;align-items:center;gap:40px;position:relative;">
            <div style="text-align:center;">
              <div style="width:80px;height:80px;border-radius:50%;border:2px solid ${teamA.color};display:flex;align-items:center;justify-content:center;margin:0 auto 12px;">
                ${teamA.logo ? `<img src="${teamA.logo}" style="width:52px;height:52px;object-fit:contain;">` : `<span style="font-family:var(--font-mono);font-weight:900;font-size:22px;color:${teamA.color};">${teamA.abbr || '?'}</span>`}
              </div>
              <span style="font-family:var(--font-display);font-weight:600;font-size:13px;color:white;">${teamA.name || 'Time A'}</span>
            </div>
            <span style="font-family:var(--font-mono);font-weight:900;font-size:14px;color:rgba(255,255,255,0.2);letter-spacing:2px;">VS</span>
            <div style="text-align:center;">
              <div style="width:80px;height:80px;border-radius:50%;border:2px solid ${teamB.color};display:flex;align-items:center;justify-content:center;margin:0 auto 12px;">
                ${teamB.logo ? `<img src="${teamB.logo}" style="width:52px;height:52px;object-fit:contain;">` : `<span style="font-family:var(--font-mono);font-weight:900;font-size:22px;color:${teamB.color};">${teamB.abbr || '?'}</span>`}
              </div>
              <span style="font-family:var(--font-display);font-weight:600;font-size:13px;color:white;">${teamB.name || 'Time B'}</span>
            </div>
          </div>
          <div style="margin-top:32px;display:flex;gap:16px;align-items:center;position:relative;">
            <span style="font-family:var(--font-mono);font-weight:700;font-size:16px;color:white;">⏰ ${time}</span>
            <span style="color:rgba(255,255,255,0.2);">|</span>
            <span style="font-size:12px;color:rgba(255,255,255,0.5);">📍 ${location}</span>
          </div>
          <div style="position:absolute;bottom:16px;font-family:var(--font-mono);font-size:8px;color:rgba(255,255,255,0.1);letter-spacing:3px;">ASTRO TV</div>
        </div>
      `;
    }

    if (template === 'energy') {
      return `
        <div style="width:100%;height:100%;background:linear-gradient(135deg, #0a001a, #1a002e, #00001a);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px;position:relative;overflow:hidden;">
          <div style="position:absolute;inset:0;background:conic-gradient(from 45deg, ${teamA.color}15, transparent 25%, ${teamB.color}15 50%, transparent 75%, ${teamA.color}15);"></div>
          <div style="position:absolute;top:50%;left:50%;width:300px;height:300px;transform:translate(-50%,-50%);border-radius:50%;background:radial-gradient(circle, rgba(124,92,252,0.1), transparent 60%);"></div>
          <div style="font-family:var(--font-mono);font-weight:900;font-size:10px;letter-spacing:6px;color:var(--secondary);margin-bottom:12px;position:relative;">⚡ MATCHDAY ⚡</div>
          <div style="font-family:var(--font-display);font-weight:900;font-size:36px;color:white;text-transform:uppercase;text-align:center;margin-bottom:28px;position:relative;line-height:1.1;text-shadow:0 0 40px rgba(124,92,252,0.3);">DIA DE<br>JOGO</div>
          <div style="display:flex;align-items:center;gap:24px;position:relative;margin-bottom:24px;">
            <div style="text-align:center;">
              <div style="width:70px;height:70px;border-radius:16px;background:${teamA.color}33;border:2px solid ${teamA.color}66;display:flex;align-items:center;justify-content:center;margin:0 auto 10px;box-shadow:0 0 20px ${teamA.color}33;">
                ${teamA.logo ? `<img src="${teamA.logo}" style="width:44px;height:44px;object-fit:contain;">` : `<span style="font-family:var(--font-mono);font-weight:900;font-size:18px;color:white;">${teamA.abbr || '?'}</span>`}
              </div>
              <span style="font-family:var(--font-display);font-weight:700;font-size:12px;color:white;">${teamA.name || 'Time A'}</span>
            </div>
            <div style="font-family:var(--font-mono);font-weight:900;font-size:28px;background:var(--gradient-primary);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">×</div>
            <div style="text-align:center;">
              <div style="width:70px;height:70px;border-radius:16px;background:${teamB.color}33;border:2px solid ${teamB.color}66;display:flex;align-items:center;justify-content:center;margin:0 auto 10px;box-shadow:0 0 20px ${teamB.color}33;">
                ${teamB.logo ? `<img src="${teamB.logo}" style="width:44px;height:44px;object-fit:contain;">` : `<span style="font-family:var(--font-mono);font-weight:900;font-size:18px;color:white;">${teamB.abbr || '?'}</span>`}
              </div>
              <span style="font-family:var(--font-display);font-weight:700;font-size:12px;color:white;">${teamB.name || 'Time B'}</span>
            </div>
          </div>
          <div style="padding:10px 24px;background:rgba(0,0,0,0.5);border-radius:40px;border:1px solid rgba(124,92,252,0.2);position:relative;">
            <span style="font-family:var(--font-mono);font-weight:700;font-size:14px;color:white;">${time}</span>
            <span style="margin:0 8px;color:rgba(255,255,255,0.2);">•</span>
            <span style="font-size:12px;color:rgba(255,255,255,0.6);">${location}</span>
          </div>
          <div style="position:absolute;bottom:14px;font-family:var(--font-mono);font-size:8px;color:rgba(255,255,255,0.15);letter-spacing:3px;">${sportEmoji} ASTRO TV</div>
        </div>
      `;
    }

    // Fire (default)
    return `
      <div style="width:100%;height:100%;background:linear-gradient(145deg, ${teamA.color} 0%, #0a0a0a 40%, #0a0a0a 60%, ${teamB.color} 100%);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px;position:relative;overflow:hidden;">
        <div style="position:absolute;inset:0;background:radial-gradient(circle at 20% 20%, ${teamA.color}33, transparent 40%), radial-gradient(circle at 80% 80%, ${teamB.color}33, transparent 40%);"></div>
        <div style="font-family:var(--font-display);font-weight:900;font-size:14px;letter-spacing:6px;color:rgba(255,255,255,0.4);text-transform:uppercase;margin-bottom:8px;position:relative;">🔥 É HOJE 🔥</div>
        <div style="font-family:var(--font-display);font-weight:900;font-size:48px;color:white;text-transform:uppercase;text-align:center;margin-bottom:6px;position:relative;line-height:1;text-shadow:0 4px 30px rgba(0,0,0,0.6);">DIA DE<br>JOGO</div>
        <div style="font-size:28px;margin-bottom:24px;position:relative;">${sportEmoji}</div>
        <div style="display:flex;align-items:center;gap:32px;position:relative;margin-bottom:20px;">
          <div style="text-align:center;">
            <div style="width:76px;height:76px;border-radius:50%;background:${teamA.color};display:flex;align-items:center;justify-content:center;margin:0 auto 10px;box-shadow:0 0 30px ${teamA.color}88, inset 0 0 20px rgba(0,0,0,0.2);">
              ${teamA.logo ? `<img src="${teamA.logo}" style="width:48px;height:48px;object-fit:contain;">` : `<span style="font-family:var(--font-mono);font-weight:900;font-size:22px;color:white;">${teamA.abbr || '?'}</span>`}
            </div>
            <span style="font-family:var(--font-display);font-weight:800;font-size:14px;color:white;text-shadow:0 2px 8px rgba(0,0,0,0.5);">${teamA.name || 'Time A'}</span>
          </div>
          <div style="font-family:var(--font-display);font-weight:900;font-size:22px;color:rgba(255,255,255,0.5);">VS</div>
          <div style="text-align:center;">
            <div style="width:76px;height:76px;border-radius:50%;background:${teamB.color};display:flex;align-items:center;justify-content:center;margin:0 auto 10px;box-shadow:0 0 30px ${teamB.color}88, inset 0 0 20px rgba(0,0,0,0.2);">
              ${teamB.logo ? `<img src="${teamB.logo}" style="width:48px;height:48px;object-fit:contain;">` : `<span style="font-family:var(--font-mono);font-weight:900;font-size:22px;color:white;">${teamB.abbr || '?'}</span>`}
            </div>
            <span style="font-family:var(--font-display);font-weight:800;font-size:14px;color:white;text-shadow:0 2px 8px rgba(0,0,0,0.5);">${teamB.name || 'Time B'}</span>
          </div>
        </div>
        <div style="background:rgba(0,0,0,0.5);backdrop-filter:blur(10px);padding:12px 28px;border-radius:40px;border:1px solid rgba(255,255,255,0.08);position:relative;">
          <span style="font-family:var(--font-mono);font-weight:700;font-size:18px;color:white;">${time}</span>
          <span style="margin:0 12px;color:rgba(255,255,255,0.2);">|</span>
          <span style="font-size:12px;color:rgba(255,255,255,0.6);">📍 ${location}</span>
        </div>
        ${match.tournament ? `<div style="margin-top:12px;font-size:10px;color:rgba(255,255,255,0.3);text-transform:uppercase;letter-spacing:2px;position:relative;">${match.tournament}</div>` : ''}
        <div style="position:absolute;bottom:14px;font-family:var(--font-mono);font-size:8px;color:rgba(255,255,255,0.15);letter-spacing:3px;">ASTRO TV</div>
      </div>
    `;
  },

  setTemplate(t) {
    Matchday.state.template = t;
    Matchday.updatePreview();
    document.querySelectorAll('.editor-sidebar .tabs .tab').forEach(tab => tab.classList.remove('active'));
    event.target.classList.add('active');
  },

  setFormat(f) {
    Matchday.state.format = f;
    App.renderCurrentRoute();
  },

  updatePreview() {
    const preview = document.getElementById('matchday-preview');
    if (preview) {
      preview.innerHTML = Matchday.renderTemplate(Matchday.state.template);
    }
  }
};
