/* ============================================================
   ASTRO TV — Flyer Module
   Gerador de flyers de divulgação de jogos
   ============================================================ */

const Flyer = {
  state: {
    template: 'vibrant',
    format: 'square', // square, story
    headline: 'CAMPEONATO INTERESCOLAR',
  },

  render() {
    const { teamA, teamB, sport, match } = AppState.getAll();
    const s = Flyer.state;

    return `
      <div class="view-container">
        <div class="container">
          <a class="back-nav" href="#/setup?module=/flyer">← Voltar à Configuração</a>

          <div class="section-header">
            <h2>📣 Flyer de Divulgação</h2>
            <p>Crie artes para divulgar os jogos nas redes sociais</p>
          </div>

          <div class="editor-layout">
            <!-- Preview -->
            <div class="editor-preview">
              <div class="flex justify-center">
                <div id="flyer-preview" class="preview-frame ${s.format === 'story' ? 'preview-frame-story' : 'preview-frame-1080'}">
                  ${Flyer.renderTemplate(s.template)}
                </div>
              </div>
            </div>

            <!-- Sidebar Controls -->
            <div class="editor-sidebar">
              <!-- Template -->
              <div class="panel">
                <div class="panel-header"><h3>🎨 Template</h3></div>
                <div class="panel-body">
                  <div class="tabs" style="margin-bottom: var(--sp-4);">
                    <div class="tab ${s.template === 'vibrant' ? 'active' : ''}" 
                         onclick="Flyer.setTemplate('vibrant')">Vibrante</div>
                    <div class="tab ${s.template === 'elegant' ? 'active' : ''}" 
                         onclick="Flyer.setTemplate('elegant')">Elegante</div>
                    <div class="tab ${s.template === 'bold' ? 'active' : ''}" 
                         onclick="Flyer.setTemplate('bold')">Bold</div>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Formato</label>
                    <div class="radio-group">
                      <label class="radio-card">
                        <input type="radio" name="flyer-format" value="square" ${s.format === 'square' ? 'checked' : ''}
                               onchange="Flyer.setFormat('square')">
                        <div class="radio-card-content">
                          <span class="icon">⬜</span>
                          <span class="label">Feed (1:1)</span>
                        </div>
                      </label>
                      <label class="radio-card">
                        <input type="radio" name="flyer-format" value="story" ${s.format === 'story' ? 'checked' : ''}
                               onchange="Flyer.setFormat('story')">
                        <div class="radio-card-content">
                          <span class="icon">📱</span>
                          <span class="label">Stories (9:16)</span>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Content -->
              <div class="panel">
                <div class="panel-header"><h3>📝 Conteúdo</h3></div>
                <div class="panel-body">
                  <div class="form-group">
                    <label class="form-label">Título / Campeonato</label>
                    <input type="text" class="form-input" value="${match.tournament || s.headline}" 
                           onchange="Flyer.updateHeadline(this.value)">
                  </div>
                  <div class="form-group">
                    <label class="form-label">Subtítulo</label>
                    <input type="text" class="form-input" value="${match.phase || ''}" 
                           placeholder="Ex: Semifinal - Jogo 1"
                           onchange="Flyer.updateField('subtitle', this.value)">
                  </div>
                </div>
              </div>

              <!-- Export -->
              ${ExportPanel.render({
                showDownload: true,
                showOverlayUrl: false,
                elementId: 'flyer-preview',
                filename: 'astrotv-flyer'
              })}
            </div>
          </div>
        </div>
      </div>
    `;
  },

  renderTemplate(template) {
    const { teamA, teamB, sport, match } = AppState.getAll();
    const s = Flyer.state;
    const sportEmoji = sport === 'volei' ? '🏐' : sport === 'basquete' ? '🏀' : '⚽';
    const date = match.date ? new Date(match.date + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase() : 'EM BREVE';
    const time = match.time || '--:--';

    if (template === 'elegant') {
      return `
        <div style="width:100%;height:100%;background:linear-gradient(160deg, #0a0a1a 0%, #1a0a2e 50%, #0a1a2e 100%);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px;position:relative;overflow:hidden;">
          <div style="position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,${teamA.color},${teamB.color});"></div>
          <div style="position:absolute;inset:0;background:radial-gradient(circle at 50% 40%, rgba(124,92,252,0.08) 0%, transparent 60%);"></div>
          <span style="font-family:var(--font-mono);font-size:10px;color:rgba(255,255,255,0.4);letter-spacing:4px;text-transform:uppercase;margin-bottom:24px;position:relative;">${match.tournament || s.headline}</span>
          <div style="display:flex;align-items:center;gap:32px;position:relative;">
            <div style="text-align:center;">
              ${teamA.logo ? `<img src="${teamA.logo}" style="width:64px;height:64px;object-fit:contain;margin-bottom:12px;">` : `<div style="width:64px;height:64px;border-radius:16px;background:${teamA.color};display:flex;align-items:center;justify-content:center;font-size:24px;font-family:var(--font-mono);color:white;font-weight:900;margin-bottom:12px;">${teamA.abbr || '?'}</div>`}
              <div style="font-family:var(--font-display);font-weight:700;font-size:14px;color:white;max-width:100px;word-wrap:break-word;">${teamA.name || 'Time A'}</div>
            </div>
            <div style="font-family:var(--font-display);font-weight:900;font-size:20px;color:rgba(255,255,255,0.3);">VS</div>
            <div style="text-align:center;">
              ${teamB.logo ? `<img src="${teamB.logo}" style="width:64px;height:64px;object-fit:contain;margin-bottom:12px;">` : `<div style="width:64px;height:64px;border-radius:16px;background:${teamB.color};display:flex;align-items:center;justify-content:center;font-size:24px;font-family:var(--font-mono);color:white;font-weight:900;margin-bottom:12px;">${teamB.abbr || '?'}</div>`}
              <div style="font-family:var(--font-display);font-weight:700;font-size:14px;color:white;max-width:100px;word-wrap:break-word;">${teamB.name || 'Time B'}</div>
            </div>
          </div>
          <div style="margin-top:32px;text-align:center;position:relative;">
            <div style="display:flex;gap:24px;align-items:center;justify-content:center;margin-bottom:8px;">
              <span style="font-family:var(--font-mono);font-weight:700;font-size:13px;color:var(--secondary);letter-spacing:1px;">${date}</span>
              <span style="font-size:10px;color:rgba(255,255,255,0.2);">•</span>
              <span style="font-family:var(--font-mono);font-weight:700;font-size:13px;color:var(--secondary);letter-spacing:1px;">${time}</span>
            </div>
            <span style="font-size:11px;color:rgba(255,255,255,0.4);">📍 ${match.location || 'Local a definir'}</span>
          </div>
          ${match.phase ? `<span style="margin-top:16px;padding:4px 16px;border:1px solid rgba(255,255,255,0.1);border-radius:20px;font-size:10px;color:rgba(255,255,255,0.5);text-transform:uppercase;letter-spacing:2px;position:relative;">${match.phase}</span>` : ''}
          <div style="position:absolute;bottom:16px;font-family:var(--font-mono);font-size:8px;color:rgba(255,255,255,0.15);letter-spacing:3px;">ASTRO TV</div>
        </div>
      `;
    }

    if (template === 'bold') {
      return `
        <div style="width:100%;height:100%;background:#0a0a0a;display:flex;flex-direction:column;position:relative;overflow:hidden;">
          <div style="position:absolute;inset:0;background:linear-gradient(135deg, ${teamA.color}22, transparent 50%, ${teamB.color}22);"></div>
          <div style="flex:1;display:flex;align-items:center;justify-content:center;position:relative;padding:24px;">
            <div style="position:absolute;top:24px;left:0;right:0;text-align:center;">
              <span style="font-family:var(--font-display);font-weight:900;font-size:28px;color:white;text-transform:uppercase;letter-spacing:-1px;">${sportEmoji} ${match.tournament || s.headline}</span>
            </div>
            <div style="display:flex;align-items:center;gap:20px;">
              <div style="text-align:center;">
                <div style="width:80px;height:80px;border-radius:50%;background:${teamA.color};display:flex;align-items:center;justify-content:center;font-size:28px;font-family:var(--font-mono);color:white;font-weight:900;box-shadow:0 0 30px ${teamA.color}66;margin:0 auto 12px;">
                  ${teamA.logo ? `<img src="${teamA.logo}" style="width:56px;height:56px;object-fit:contain;">` : teamA.abbr || '?'}
                </div>
                <div style="font-family:var(--font-display);font-weight:800;font-size:16px;color:white;">${teamA.name || 'Time A'}</div>
              </div>
              <div style="font-family:var(--font-mono);font-weight:900;font-size:36px;background:linear-gradient(135deg,${teamA.color},${teamB.color});-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">X</div>
              <div style="text-align:center;">
                <div style="width:80px;height:80px;border-radius:50%;background:${teamB.color};display:flex;align-items:center;justify-content:center;font-size:28px;font-family:var(--font-mono);color:white;font-weight:900;box-shadow:0 0 30px ${teamB.color}66;margin:0 auto 12px;">
                  ${teamB.logo ? `<img src="${teamB.logo}" style="width:56px;height:56px;object-fit:contain;">` : teamB.abbr || '?'}
                </div>
                <div style="font-family:var(--font-display);font-weight:800;font-size:16px;color:white;">${teamB.name || 'Time B'}</div>
              </div>
            </div>
          </div>
          <div style="background:rgba(255,255,255,0.05);padding:16px 24px;display:flex;justify-content:space-around;align-items:center;border-top:1px solid rgba(255,255,255,0.08);position:relative;">
            <div style="text-align:center;"><div style="font-size:10px;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:1px;">Data</div><div style="font-family:var(--font-mono);font-weight:700;font-size:13px;color:white;">${date}</div></div>
            <div style="width:1px;height:24px;background:rgba(255,255,255,0.1);"></div>
            <div style="text-align:center;"><div style="font-size:10px;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:1px;">Horário</div><div style="font-family:var(--font-mono);font-weight:700;font-size:13px;color:white;">${time}</div></div>
            <div style="width:1px;height:24px;background:rgba(255,255,255,0.1);"></div>
            <div style="text-align:center;"><div style="font-size:10px;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:1px;">Local</div><div style="font-size:12px;color:white;font-weight:500;">${match.location || 'TBD'}</div></div>
          </div>
        </div>
      `;
    }

    // Default: Vibrant
    return `
      <div style="width:100%;height:100%;background:linear-gradient(135deg, ${teamA.color} 0%, #0a0a1a 50%, ${teamB.color} 100%);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px;position:relative;overflow:hidden;">
        <div style="position:absolute;inset:0;background:radial-gradient(circle at 30% 30%, rgba(255,255,255,0.05) 0%, transparent 50%),radial-gradient(circle at 70% 70%, rgba(255,255,255,0.05) 0%, transparent 50%);"></div>
        <div style="position:relative;text-align:center;margin-bottom:8px;">
          <span style="font-family:var(--font-mono);font-size:10px;color:rgba(255,255,255,0.5);letter-spacing:4px;text-transform:uppercase;">${match.phase || 'CLASSIFICATÓRIA'}</span>
        </div>
        <div style="font-family:var(--font-display);font-weight:900;font-size:22px;color:white;text-transform:uppercase;text-align:center;margin-bottom:24px;text-shadow:0 2px 10px rgba(0,0,0,0.5);position:relative;letter-spacing:1px;">
          ${match.tournament || s.headline}
        </div>
        <div style="display:flex;align-items:center;gap:28px;position:relative;">
          <div style="text-align:center;">
            <div style="width:72px;height:72px;border-radius:20px;background:rgba(255,255,255,0.1);backdrop-filter:blur(10px);display:flex;align-items:center;justify-content:center;margin:0 auto 10px;border:1px solid rgba(255,255,255,0.15);">
              ${teamA.logo ? `<img src="${teamA.logo}" style="width:48px;height:48px;object-fit:contain;">` : `<span style="font-family:var(--font-mono);font-weight:900;font-size:20px;color:white;">${teamA.abbr || '?'}</span>`}
            </div>
            <div style="font-family:var(--font-display);font-weight:700;font-size:13px;color:white;max-width:90px;word-wrap:break-word;">${teamA.name || 'Time A'}</div>
          </div>
          <div style="width:48px;height:48px;border-radius:50%;background:rgba(0,0,0,0.4);backdrop-filter:blur(10px);display:flex;align-items:center;justify-content:center;font-family:var(--font-display);font-weight:900;font-size:16px;color:white;border:1px solid rgba(255,255,255,0.1);">VS</div>
          <div style="text-align:center;">
            <div style="width:72px;height:72px;border-radius:20px;background:rgba(255,255,255,0.1);backdrop-filter:blur(10px);display:flex;align-items:center;justify-content:center;margin:0 auto 10px;border:1px solid rgba(255,255,255,0.15);">
              ${teamB.logo ? `<img src="${teamB.logo}" style="width:48px;height:48px;object-fit:contain;">` : `<span style="font-family:var(--font-mono);font-weight:900;font-size:20px;color:white;">${teamB.abbr || '?'}</span>`}
            </div>
            <div style="font-family:var(--font-display);font-weight:700;font-size:13px;color:white;max-width:90px;word-wrap:break-word;">${teamB.name || 'Time B'}</div>
          </div>
        </div>
        <div style="margin-top:28px;display:flex;gap:20px;align-items:center;position:relative;">
          <div style="display:flex;align-items:center;gap:6px;"><span style="font-size:14px;">📅</span><span style="font-size:12px;color:rgba(255,255,255,0.85);font-weight:600;">${date}</span></div>
          <div style="display:flex;align-items:center;gap:6px;"><span style="font-size:14px;">⏰</span><span style="font-size:12px;color:rgba(255,255,255,0.85);font-weight:600;">${time}</span></div>
        </div>
        <div style="margin-top:8px;font-size:11px;color:rgba(255,255,255,0.5);position:relative;">📍 ${match.location || 'Local a definir'}</div>
        <div style="position:absolute;bottom:14px;font-family:var(--font-mono);font-size:8px;color:rgba(255,255,255,0.2);letter-spacing:3px;">ASTRO TV ${sportEmoji}</div>
      </div>
    `;
  },

  setTemplate(t) {
    Flyer.state.template = t;
    Flyer.updatePreview();
    document.querySelectorAll('.editor-sidebar .tabs .tab').forEach(tab => tab.classList.remove('active'));
    event.target.classList.add('active');
  },

  setFormat(f) {
    Flyer.state.format = f;
    App.renderCurrentRoute();
  },

  updateHeadline(value) {
    Flyer.state.headline = value;
    const match = AppState.get('match');
    match.tournament = value;
    AppState.set('match', match);
    Flyer.updatePreview();
  },

  updateField(field, value) {
    const match = AppState.get('match');
    match[field === 'subtitle' ? 'phase' : field] = value;
    AppState.set('match', match);
    Flyer.updatePreview();
  },

  updatePreview() {
    const preview = document.getElementById('flyer-preview');
    if (preview) {
      preview.innerHTML = Flyer.renderTemplate(Flyer.state.template);
    }
  }
};
