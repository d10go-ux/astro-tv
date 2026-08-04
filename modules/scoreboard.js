/* ============================================================
   ASTRO TV — Scoreboard Module
   Placar ao Vivo com suporte a Vôlei, Basquete e Futsal
   3 Templates: Classic, Modern, Neon
   ============================================================ */

const Scoreboard = {
  // Estado interno do placar
  state: {
    scoreA: 0,
    scoreB: 0,
    setsA: 0,
    setsB: 0,
    period: 1,
    timer: '00:00',
    timerRunning: false,
    timerSeconds: 0,
    timerInterval: null,
    foulsA: 0,
    foulsB: 0,
    timeoutsA: 0,
    timeoutsB: 0,
    template: 'modern',
    setScoresA: [0, 0, 0, 0, 0],
    setScoresB: [0, 0, 0, 0, 0],
  },

  /**
   * Renderiza a view completa do Scoreboard
   */
  render() {
    const { teamA, teamB, sport } = AppState.getAll();
    const s = Scoreboard.state;

    // Disparar sincronização com o OBS na abertura do painel
    setTimeout(() => Scoreboard.syncOverlay(), 50);

    return `
      <div class="view-container">
        <div class="container">
          <a class="back-nav" href="#/setup?module=/scoreboard">
            ← Voltar à Configuração
          </a>

          <div class="section-header">
            <h2>🏆 Placar ao Vivo</h2>
            <p>${TeamSetup.getSportName(sport)} — ${teamA.name || 'Time A'} vs ${teamB.name || 'Time B'}</p>
          </div>

          <div class="scoreboard-editor">
            <!-- Preview Area -->
            <div class="scoreboard-preview-area" id="scoreboard-preview-area">
              ${Scoreboard.renderOverlay(s.template)}
            </div>

            <!-- Controls Sidebar -->
            <div class="scoreboard-controls">
              <!-- Sidebar Main Navigation Tabs -->
              <div class="tabs" style="margin-bottom: var(--sp-3);">
                <div class="tab ${(s.activeSidebarTab || 'anim') === 'anim' ? 'active' : ''}" 
                     onclick="Scoreboard.setSidebarTab('anim')">🎬 Animações</div>
                <div class="tab ${s.activeSidebarTab === 'score' ? 'active' : ''}" 
                     onclick="Scoreboard.setSidebarTab('score')">🏆 Placar</div>
                <div class="tab ${s.activeSidebarTab === 'style' ? 'active' : ''}" 
                     onclick="Scoreboard.setSidebarTab('style')">🎨 Estilo & OBS</div>
              </div>

              <!-- TAB 1: ANIMATIONS & BROADCAST -->
              <div class="${(s.activeSidebarTab || 'anim') === 'anim' ? '' : 'hidden'}">
                ${typeof StreamLinksCard !== 'undefined' ? StreamLinksCard.render() : ''}
                ${typeof RoomManager !== 'undefined' ? RoomManager.render() : ''}
                ${typeof AnimationControls !== 'undefined' ? AnimationControls.render() : ''}
                ${typeof Soundboard !== 'undefined' ? Soundboard.render() : ''}
                ${typeof BroadcasterCards !== 'undefined' ? BroadcasterCards.render() : ''}
                ${typeof SocialWall !== 'undefined' ? SocialWall.render() : ''}
                ${typeof QRCodeWidget !== 'undefined' ? QRCodeWidget.render() : ''}
                ${typeof StatsManager !== 'undefined' ? StatsManager.render() : ''}
                ${typeof NewsTicker !== 'undefined' ? NewsTicker.render() : ''}
                ${typeof LineupManager !== 'undefined' ? LineupManager.render() : ''}
                ${typeof CompetitionManager !== 'undefined' ? CompetitionManager.render() : ''}
              </div>

              <!-- TAB 2: SCORE CONTROLS -->
              <div class="${s.activeSidebarTab === 'score' ? '' : 'hidden'}">
                <!-- Score Controls - Team A -->
                <div class="panel" style="margin-bottom: var(--sp-4);">
                  <div class="panel-header">
                    <h3 style="display:flex;align-items:center;gap:var(--sp-2);">
                      <span style="width:12px;height:12px;border-radius:50%;background:${teamA.color}"></span>
                      ${teamA.name || 'Time A'}
                    </h3>
                  </div>
                  <div class="panel-body">
                    <div class="form-label" style="margin-bottom: var(--sp-3);">Pontuação</div>
                    <div class="score-controls">
                      <button class="score-btn minus" onclick="Scoreboard.addScore('A', -1)">−</button>
                      <span class="score-display" id="display-score-a">${s.scoreA}</span>
                      <button class="score-btn plus" onclick="Scoreboard.addScore('A', 1)">+</button>
                    </div>
                    ${Scoreboard.renderExtraControls('A')}
                  </div>
                </div>

                <!-- Score Controls - Team B -->
                <div class="panel" style="margin-bottom: var(--sp-4);">
                  <div class="panel-header">
                    <h3 style="display:flex;align-items:center;gap:var(--sp-2);">
                      <span style="width:12px;height:12px;border-radius:50%;background:${teamB.color}"></span>
                      ${teamB.name || 'Time B'}
                    </h3>
                  </div>
                  <div class="panel-body">
                    <div class="form-label" style="margin-bottom: var(--sp-3);">Pontuação</div>
                    <div class="score-controls">
                      <button class="score-btn minus" onclick="Scoreboard.addScore('B', -1)">−</button>
                      <span class="score-display" id="display-score-b">${s.scoreB}</span>
                      <button class="score-btn plus" onclick="Scoreboard.addScore('B', 1)">+</button>
                    </div>
                    ${Scoreboard.renderExtraControls('B')}
                  </div>
                </div>

                <!-- Period / Timer Controls -->
                <div class="panel" style="margin-bottom: var(--sp-4);">
                  <div class="panel-header">
                    <h3>⏱️ ${Scoreboard.getPeriodLabel()}</h3>
                  </div>
                  <div class="panel-body">
                    ${Scoreboard.renderPeriodControls()}
                  </div>
                </div>

                <!-- Actions -->
                <div class="panel" style="margin-bottom: var(--sp-4);">
                  <div class="panel-header">
                    <h3>⚡ Ações</h3>
                  </div>
                  <div class="panel-body">
                    <div class="flex flex-col gap-3">
                      <button class="btn btn-danger w-full" onclick="Scoreboard.resetScore()">
                        🔄 Resetar Placar
                      </button>
                      <button class="btn btn-secondary w-full" onclick="Scoreboard.nextPeriod()">
                        ⏭️ Próximo ${Scoreboard.getPeriodLabel()}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- TAB 3: STYLE & EXPORT -->
              <div class="${s.activeSidebarTab === 'style' ? '' : 'hidden'}">
                <!-- Template Selector -->
                <div class="panel" style="margin-bottom: var(--sp-4);">
                  <div class="panel-header">
                    <h3>🎨 Estilos Padrão</h3>
                  </div>
                  <div class="panel-body">
                    <div class="tabs" style="margin-bottom: var(--sp-4);">
                      <div class="tab ${s.template === 'classic' ? 'active' : ''}" 
                           onclick="Scoreboard.setTemplate('classic')">Clássico</div>
                      <div class="tab ${s.template === 'modern' ? 'active' : ''}" 
                           onclick="Scoreboard.setTemplate('modern')">Moderno</div>
                      <div class="tab ${s.template === 'neon' ? 'active' : ''}" 
                           onclick="Scoreboard.setTemplate('neon')">Neon</div>
                    </div>

                    <div class="form-group" style="margin-top: var(--sp-4);">
                      <label class="form-label">🖼️ Placares Personalizados por Imagem</label>
                      ${Scoreboard.renderCustomTemplateOptions()}
                    </div>
                  </div>
                </div>

                <!-- Export -->
                ${ExportPanel.render({
                  showDownload: true,
                  showOverlayUrl: true,
                  overlayUrl: 'overlay/scoreboard.html',
                  elementId: 'scoreboard-overlay-container',
                  filename: 'astrotv-placar'
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  /**
   * Renderiza controles extras por modalidade
   */
  renderExtraControls(team) {
    const sport = AppState.get('sport');
    const s = Scoreboard.state;
    const teamKey = team === 'A' ? 'A' : 'B';

    if (sport === 'volei') {
      return `
        <div style="margin-top: var(--sp-4);">
          <div class="form-label" style="margin-bottom: var(--sp-2);">Sets Ganhos</div>
          <div class="score-controls">
            <button class="score-btn minus sm" onclick="Scoreboard.addSets('${teamKey}', -1)" 
                    style="width:36px;height:36px;font-size:var(--fs-base);">−</button>
            <span class="score-display" style="font-size:var(--fs-xl);min-width:40px;" 
                  id="display-sets-${teamKey.toLowerCase()}">${team === 'A' ? s.setsA : s.setsB}</span>
            <button class="score-btn plus sm" onclick="Scoreboard.addSets('${teamKey}', 1)"
                    style="width:36px;height:36px;font-size:var(--fs-base);">+</button>
          </div>
        </div>
      `;
    }

    if (sport === 'basquete') {
      return `
        <div style="margin-top: var(--sp-4);">
          <div class="form-label" style="margin-bottom: var(--sp-2);">Faltas</div>
          <div class="score-controls">
            <button class="score-btn minus sm" onclick="Scoreboard.addFouls('${teamKey}', -1)"
                    style="width:36px;height:36px;font-size:var(--fs-base);">−</button>
            <span class="score-display" style="font-size:var(--fs-xl);min-width:40px;" 
                  id="display-fouls-${teamKey.toLowerCase()}">${team === 'A' ? s.foulsA : s.foulsB}</span>
            <button class="score-btn plus sm" onclick="Scoreboard.addFouls('${teamKey}', 1)"
                    style="width:36px;height:36px;font-size:var(--fs-base);">+</button>
          </div>
        </div>
      `;
    }

    if (sport === 'futsal') {
      return `
        <div style="margin-top: var(--sp-4);">
          <div class="form-label" style="margin-bottom: var(--sp-2);">Faltas Acumuladas</div>
          <div class="score-controls">
            <button class="score-btn minus sm" onclick="Scoreboard.addFouls('${teamKey}', -1)"
                    style="width:36px;height:36px;font-size:var(--fs-base);">−</button>
            <span class="score-display" style="font-size:var(--fs-xl);min-width:40px;" 
                  id="display-fouls-${teamKey.toLowerCase()}">${team === 'A' ? s.foulsA : s.foulsB}</span>
            <button class="score-btn plus sm" onclick="Scoreboard.addFouls('${teamKey}', 1)"
                    style="width:36px;height:36px;font-size:var(--fs-base);">+</button>
          </div>
        </div>
      `;
    }

    return '';
  },

  /**
   * Renderiza controles de período/set
   */
  renderPeriodControls() {
    const sport = AppState.get('sport');
    const s = Scoreboard.state;

    let periodOptions = '';
    if (sport === 'volei') {
      for (let i = 1; i <= 5; i++) {
        periodOptions += `<option value="${i}" ${s.period === i ? 'selected' : ''}>Set ${i}</option>`;
      }
    } else if (sport === 'basquete') {
      for (let i = 1; i <= 4; i++) {
        periodOptions += `<option value="${i}" ${s.period === i ? 'selected' : ''}>Q${i}</option>`;
      }
      periodOptions += `<option value="5" ${s.period === 5 ? 'selected' : ''}>Prorrogação</option>`;
    } else {
      periodOptions += `<option value="1" ${s.period === 1 ? 'selected' : ''}>1º Tempo</option>`;
      periodOptions += `<option value="2" ${s.period === 2 ? 'selected' : ''}>2º Tempo</option>`;
      periodOptions += `<option value="3" ${s.period === 3 ? 'selected' : ''}>Prorrogação</option>`;
    }

    return `
      <div class="form-group">
        <label class="form-label">Período Atual</label>
        <select class="form-select" onchange="Scoreboard.setPeriod(parseInt(this.value))">
          ${periodOptions}
        </select>
      </div>
      ${sport !== 'volei' ? `
        <div class="form-group">
          <label class="form-label">Cronômetro</label>
          <div class="flex items-center gap-3">
            <input type="text" class="form-input" id="timer-input" value="${s.timer}" 
                   style="font-family: var(--font-mono); font-weight: 700; text-align: center; max-width: 120px;"
                   onchange="Scoreboard.setTimer(this.value)">
            <button class="btn ${s.timerRunning ? 'btn-danger' : 'btn-secondary'}" 
                    onclick="Scoreboard.toggleTimer()" id="btn-timer">
              ${s.timerRunning ? '⏸ Pausar' : '▶ Iniciar'}
            </button>
          </div>
        </div>
      ` : ''}
    `;
  },

  /**
   * Label do período por modalidade
   */
  getPeriodLabel() {
    const sport = AppState.get('sport');
    if (sport === 'volei') return 'Set';
    if (sport === 'basquete') return 'Quarto';
    return 'Tempo';
  },

  /**
   * Renderiza o overlay do placar (para preview e OBS)
   */
  renderOverlay(template = 'modern') {
    const { teamA, teamB, sport } = AppState.getAll();
    const s = Scoreboard.state;

    const periodText = Scoreboard.formatPeriod(s.period);

    if (typeof template === 'object' && template.bgImage) {
      return Scoreboard.renderCustomOverlay(teamA, teamB, s, periodText, template);
    } else if (template === 'classic') {
      return Scoreboard.renderClassicOverlay(teamA, teamB, s, periodText, sport);
    } else if (template === 'neon') {
      return Scoreboard.renderNeonOverlay(teamA, teamB, s, periodText, sport);
    }
    return Scoreboard.renderModernOverlay(teamA, teamB, s, periodText, sport);
  },

  renderCustomOverlay(teamA, teamB, s, periodText, customT) {
    const el = customT.elements || {};
    const opacity = customT.bgOpacity !== undefined ? customT.bgOpacity : 1;

    return `
      <div id="scoreboard-overlay-container" style="position:relative;width:100%;max-width:700px;aspect-ratio:16/9;overflow:hidden;border-radius:12px;box-shadow:0 8px 32px rgba(0,0,0,0.6);margin:0 auto;">
        ${customT.bgImage ? `<img src="${customT.bgImage}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:contain;opacity:${opacity};">` : ''}

        <!-- Team A Logo -->
        ${el.teamA_logo ? `
          <div style="position:absolute;left:${el.teamA_logo.x}%;top:${el.teamA_logo.y}%;transform:translate(-50%,-50%);width:${el.teamA_logo.size || 36}px;height:${el.teamA_logo.size || 36}px;display:flex;align-items:center;justify-content:center;">
            ${teamA.logo ? `<img src="${teamA.logo}" style="width:100%;height:100%;object-fit:contain;">` : `<span style="font-size:20px;">🛡️</span>`}
          </div>
        ` : ''}

        <!-- Team A Name -->
        ${el.teamA_name ? `
          <div style="position:absolute;left:${el.teamA_name.x}%;top:${el.teamA_name.y}%;transform:translate(-50%,-50%);font-size:${el.teamA_name.fontSize}px;color:${el.teamA_name.color};font-family:'${el.teamA_name.fontFamily || 'Outfit'}',sans-serif;font-weight:${el.teamA_name.fontWeight || '700'};">
            ${teamA.abbr || teamA.name || 'AAA'}
          </div>
        ` : ''}

        <!-- Team A Score -->
        ${el.scoreA ? `
          <div style="position:absolute;left:${el.scoreA.x}%;top:${el.scoreA.y}%;transform:translate(-50%,-50%);font-size:${el.scoreA.fontSize}px;color:${el.scoreA.color};font-family:'${el.scoreA.fontFamily || 'Orbitron'}',sans-serif;font-weight:${el.scoreA.fontWeight || '900'};" id="overlay-score-a">
            ${s.scoreA}
          </div>
        ` : ''}

        <!-- Team B Logo -->
        ${el.teamB_logo ? `
          <div style="position:absolute;left:${el.teamB_logo.x}%;top:${el.teamB_logo.y}%;transform:translate(-50%,-50%);width:${el.teamB_logo.size || 36}px;height:${el.teamB_logo.size || 36}px;display:flex;align-items:center;justify-content:center;">
            ${teamB.logo ? `<img src="${teamB.logo}" style="width:100%;height:100%;object-fit:contain;">` : `<span style="font-size:20px;">🛡️</span>`}
          </div>
        ` : ''}

        <!-- Team B Name -->
        ${el.teamB_name ? `
          <div style="position:absolute;left:${el.teamB_name.x}%;top:${el.teamB_name.y}%;transform:translate(-50%,-50%);font-size:${el.teamB_name.fontSize}px;color:${el.teamB_name.color};font-family:'${el.teamB_name.fontFamily || 'Outfit'}',sans-serif;font-weight:${el.teamB_name.fontWeight || '700'};">
            ${teamB.abbr || teamB.name || 'BBB'}
          </div>
        ` : ''}

        <!-- Team B Score -->
        ${el.scoreB ? `
          <div style="position:absolute;left:${el.scoreB.x}%;top:${el.scoreB.y}%;transform:translate(-50%,-50%);font-size:${el.scoreB.fontSize}px;color:${el.scoreB.color};font-family:'${el.scoreB.fontFamily || 'Orbitron'}',sans-serif;font-weight:${el.scoreB.fontWeight || '900'};" id="overlay-score-b">
            ${s.scoreB}
          </div>
        ` : ''}

        <!-- Period -->
        ${el.period ? `
          <div style="position:absolute;left:${el.period.x}%;top:${el.period.y}%;transform:translate(-50%,-50%);font-size:${el.period.fontSize}px;color:${el.period.color};font-family:'${el.period.fontFamily || 'Outfit'}',sans-serif;font-weight:${el.period.fontWeight || '600'};">
            ${periodText}
          </div>
        ` : ''}

        <!-- Timer -->
        ${el.timer ? `
          <div style="position:absolute;left:${el.timer.x}%;top:${el.timer.y}%;transform:translate(-50%,-50%);font-size:${el.timer.fontSize}px;color:${el.timer.color};font-family:'${el.timer.fontFamily || 'Orbitron'}',sans-serif;font-weight:${el.timer.fontWeight || '700'};" id="overlay-timer">
            ${s.timer}
          </div>
        ` : ''}
      </div>
    `;
  },

  /**
   * Template Moderno (padrão)
   */
  renderModernOverlay(teamA, teamB, s, periodText, sport) {
    return `
      <div class="scoreboard-overlay" id="scoreboard-overlay-container" style="width:100%;max-width:720px;">
        <div class="scoreboard-bar" style="background: transparent;">
          <!-- Team A -->
          <div class="scoreboard-team" style="background: ${teamA.color}; border-radius: 12px 0 0 12px; flex:1;">
            ${teamA.logo ? `<img src="${teamA.logo}" style="width:32px;height:32px;object-fit:contain;border-radius:4px;">` : ''}
            <span class="scoreboard-team-name">${teamA.abbr || 'AAA'}</span>
          </div>
          <div class="scoreboard-score" id="overlay-score-a" 
               style="background: ${Scoreboard.darkenColor(teamA.color, 30)};">
            ${s.scoreA}
          </div>

          <!-- Center -->
          <div class="scoreboard-center">
            <span class="scoreboard-period">${periodText}</span>
            ${sport !== 'volei' ? `<span class="scoreboard-timer" id="overlay-timer">${s.timer}</span>` : ''}
            ${sport === 'volei' ? `
              <div class="scoreboard-sets" style="gap:4px;">
                ${Scoreboard.renderSetDots(s.setsA, s.setsB)}
              </div>
            ` : ''}
          </div>

          <!-- Score B -->
          <div class="scoreboard-score" id="overlay-score-b" 
               style="background: ${Scoreboard.darkenColor(teamB.color, 30)};">
            ${s.scoreB}
          </div>
          <!-- Team B -->
          <div class="scoreboard-team" style="background: ${teamB.color}; border-radius: 0 12px 12px 0; flex:1; justify-content: flex-end;">
            <span class="scoreboard-team-name" style="text-align:right;">${teamB.abbr || 'BBB'}</span>
            ${teamB.logo ? `<img src="${teamB.logo}" style="width:32px;height:32px;object-fit:contain;border-radius:4px;">` : ''}
          </div>
        </div>
        ${(sport === 'basquete' || sport === 'futsal') && (s.foulsA > 0 || s.foulsB > 0) ? `
          <div style="display:flex;justify-content:space-between;padding:4px 16px;font-size:11px;color:rgba(255,255,255,0.6);font-family:var(--font-body);">
            <span>Faltas: ${s.foulsA}</span>
            <span>Faltas: ${s.foulsB}</span>
          </div>
        ` : ''}
      </div>
    `;
  },

  /**
   * Template Clássico (estilo TV)
   */
  renderClassicOverlay(teamA, teamB, s, periodText, sport) {
    return `
      <div class="scoreboard-overlay" id="scoreboard-overlay-container" style="width:100%;max-width:700px;">
        <div style="display:flex;flex-direction:column;gap:2px;">
          <!-- Team A Row -->
          <div style="display:flex;align-items:stretch;overflow:hidden;border-radius:4px 4px 0 0;">
            <div style="background:${teamA.color};padding:8px 16px;min-width:200px;display:flex;align-items:center;gap:10px;">
              ${teamA.logo ? `<img src="${teamA.logo}" style="width:28px;height:28px;object-fit:contain;">` : ''}
              <span style="color:white;font-family:var(--font-display);font-weight:700;font-size:15px;text-shadow:0 1px 3px rgba(0,0,0,0.4);">${teamA.name || 'Time A'}</span>
            </div>
            <div style="background:rgba(0,0,0,0.85);padding:8px 20px;min-width:60px;display:flex;align-items:center;justify-content:center;">
              <span style="font-family:var(--font-mono);font-weight:900;font-size:22px;color:white;" id="overlay-score-a">${s.scoreA}</span>
            </div>
            ${sport === 'volei' ? `
              <div style="background:rgba(0,0,0,0.7);padding:8px 12px;display:flex;align-items:center;gap:6px;">
                ${[...Array(5)].map((_, i) => `<div style="width:10px;height:10px;border-radius:50%;background:${i < s.setsA ? '#00e5d0' : 'rgba(255,255,255,0.15)'};"></div>`).join('')}
              </div>
            ` : ''}
          </div>
          <!-- Team B Row -->
          <div style="display:flex;align-items:stretch;overflow:hidden;border-radius:0 0 4px 4px;">
            <div style="background:${teamB.color};padding:8px 16px;min-width:200px;display:flex;align-items:center;gap:10px;">
              ${teamB.logo ? `<img src="${teamB.logo}" style="width:28px;height:28px;object-fit:contain;">` : ''}
              <span style="color:white;font-family:var(--font-display);font-weight:700;font-size:15px;text-shadow:0 1px 3px rgba(0,0,0,0.4);">${teamB.name || 'Time B'}</span>
            </div>
            <div style="background:rgba(0,0,0,0.85);padding:8px 20px;min-width:60px;display:flex;align-items:center;justify-content:center;">
              <span style="font-family:var(--font-mono);font-weight:900;font-size:22px;color:white;" id="overlay-score-b">${s.scoreB}</span>
            </div>
            ${sport === 'volei' ? `
              <div style="background:rgba(0,0,0,0.7);padding:8px 12px;display:flex;align-items:center;gap:6px;">
                ${[...Array(5)].map((_, i) => `<div style="width:10px;height:10px;border-radius:50%;background:${i < s.setsB ? '#00e5d0' : 'rgba(255,255,255,0.15)'};"></div>`).join('')}
              </div>
            ` : ''}
          </div>
        </div>
        <!-- Period bar -->
        <div style="background:rgba(0,0,0,0.9);padding:4px 16px;display:flex;justify-content:space-between;align-items:center;border-radius:0 0 4px 4px;">
          <span style="font-size:11px;color:rgba(255,255,255,0.5);font-family:var(--font-body);font-weight:600;text-transform:uppercase;letter-spacing:1px;">${periodText}</span>
          ${sport !== 'volei' ? `<span style="font-family:var(--font-mono);font-weight:700;font-size:14px;color:white;" id="overlay-timer">${s.timer}</span>` : ''}
          ${(sport === 'basquete' || sport === 'futsal') ? `<span style="font-size:11px;color:rgba(255,255,255,0.4);font-family:var(--font-body);">F: ${s.foulsA} - ${s.foulsB}</span>` : ''}
        </div>
      </div>
    `;
  },

  /**
   * Template Neon (gaming/esports)
   */
  renderNeonOverlay(teamA, teamB, s, periodText, sport) {
    return `
      <div class="scoreboard-overlay" id="scoreboard-overlay-container" style="width:100%;max-width:750px;">
        <div style="display:flex;align-items:stretch;position:relative;">
          <!-- Team A -->
          <div style="flex:1;background:linear-gradient(135deg, ${teamA.color}dd, ${teamA.color}88);padding:12px 20px;display:flex;align-items:center;gap:12px;clip-path:polygon(0 0, calc(100% - 15px) 0, 100% 100%, 0 100%);border:1px solid ${teamA.color};border-right:none;">
            ${teamA.logo ? `<img src="${teamA.logo}" style="width:36px;height:36px;object-fit:contain;filter:drop-shadow(0 0 8px rgba(255,255,255,0.3));">` : ''}
            <span style="color:white;font-family:var(--font-display);font-weight:800;font-size:16px;text-shadow:0 0 20px rgba(255,255,255,0.3);letter-spacing:1px;">${teamA.abbr || 'AAA'}</span>
          </div>

          <!-- Scores -->
          <div style="display:flex;align-items:center;background:rgba(0,0,0,0.9);border-top:1px solid rgba(124,92,252,0.3);border-bottom:1px solid rgba(124,92,252,0.3);z-index:2;">
            <div style="padding:10px 20px;min-width:60px;text-align:center;">
              <span style="font-family:var(--font-mono);font-weight:900;font-size:28px;color:${teamA.color};text-shadow:0 0 15px ${teamA.color}88;" id="overlay-score-a">${s.scoreA}</span>
            </div>
            <div style="display:flex;flex-direction:column;align-items:center;padding:6px 12px;border-left:1px solid rgba(255,255,255,0.1);border-right:1px solid rgba(255,255,255,0.1);">
              <span style="font-size:9px;color:rgba(255,255,255,0.4);font-weight:600;text-transform:uppercase;letter-spacing:2px;">${periodText}</span>
              ${sport !== 'volei' ? `<span style="font-family:var(--font-mono);font-weight:700;font-size:16px;color:#00e5d0;text-shadow:0 0 10px rgba(0,229,208,0.4);" id="overlay-timer">${s.timer}</span>` : ''}
              ${sport === 'volei' ? `
                <div style="display:flex;gap:4px;margin-top:4px;">
                  <span style="font-family:var(--font-mono);font-size:12px;color:${teamA.color};text-shadow:0 0 8px ${teamA.color};">${s.setsA}</span>
                  <span style="font-size:12px;color:rgba(255,255,255,0.3);">-</span>
                  <span style="font-family:var(--font-mono);font-size:12px;color:${teamB.color};text-shadow:0 0 8px ${teamB.color};">${s.setsB}</span>
                </div>
              ` : ''}
            </div>
            <div style="padding:10px 20px;min-width:60px;text-align:center;">
              <span style="font-family:var(--font-mono);font-weight:900;font-size:28px;color:${teamB.color};text-shadow:0 0 15px ${teamB.color}88;" id="overlay-score-b">${s.scoreB}</span>
            </div>
          </div>

          <!-- Team B -->
          <div style="flex:1;background:linear-gradient(135deg, ${teamB.color}88, ${teamB.color}dd);padding:12px 20px;display:flex;align-items:center;gap:12px;justify-content:flex-end;clip-path:polygon(15px 0, 100% 0, 100% 100%, 0 100%);border:1px solid ${teamB.color};border-left:none;">
            <span style="color:white;font-family:var(--font-display);font-weight:800;font-size:16px;text-shadow:0 0 20px rgba(255,255,255,0.3);letter-spacing:1px;">${teamB.abbr || 'BBB'}</span>
            ${teamB.logo ? `<img src="${teamB.logo}" style="width:36px;height:36px;object-fit:contain;filter:drop-shadow(0 0 8px rgba(255,255,255,0.3));">` : ''}
          </div>
        </div>
      </div>
    `;
  },

  /**
   * Renderiza pontos dos sets (vôlei)
   */
  renderSetDots(setsA, setsB) {
    let html = '';
    // Sets do time A
    for (let i = 0; i < 3; i++) {
      html += `<div style="width:8px;height:8px;border-radius:50%;background:${i < setsA ? '#00e5d0' : 'rgba(255,255,255,0.2)'}; ${i < setsA ? 'box-shadow:0 0 6px rgba(0,229,208,0.5);' : ''}"></div>`;
    }
    html += `<span style="font-size:10px;color:rgba(255,255,255,0.3);margin:0 4px;">|</span>`;
    for (let i = 0; i < 3; i++) {
      html += `<div style="width:8px;height:8px;border-radius:50%;background:${i < setsB ? '#ff6b9d' : 'rgba(255,255,255,0.2)'}; ${i < setsB ? 'box-shadow:0 0 6px rgba(255,107,157,0.5);' : ''}"></div>`;
    }
    return html;
  },

  /**
   * Formata texto do período
   */
  formatPeriod(period) {
    const sport = AppState.get('sport');
    if (sport === 'volei') return `SET ${period}`;
    if (sport === 'basquete') return period <= 4 ? `Q${period}` : 'PRORR.';
    return period <= 2 ? `${period}º TEMPO` : 'PRORR.';
  },

  /**
   * Escurece uma cor hex
   */
  darkenColor(hex, amount) {
    hex = hex.replace('#', '');
    const r = Math.max(0, parseInt(hex.substr(0, 2), 16) - amount);
    const g = Math.max(0, parseInt(hex.substr(2, 2), 16) - amount);
    const b = Math.max(0, parseInt(hex.substr(4, 2), 16) - amount);
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  },

  setSidebarTab(tabName) {
    Scoreboard.state.activeSidebarTab = tabName;
    App.renderCurrentRoute();
  },

  renderCustomTemplateOptions() {
    const saved = JSON.parse(localStorage.getItem('astrotv_custom_templates') || '[]');
    if (saved.length === 0) {
      return `<p style="font-size:12px;color:var(--text-muted);">Nenhum modelo personalizado salvo. Crie um no <a href="#/builder" style="color:var(--primary-light);">Criador de Placar</a>.</p>`;
    }

    const currentT = Scoreboard.state.template;
    return `
      <div style="display:flex;flex-direction:column;gap:6px;margin-top:6px;">
        ${saved.map(t => {
          const isSelected = typeof currentT === 'object' && currentT.id === t.id;
          return `
            <button class="btn ${isSelected ? 'btn-primary' : 'btn-secondary'} btn-sm w-full" style="justify-content:start;"
                    onclick="Scoreboard.selectCustomTemplate('${t.id}')">
              🖼️ ${t.name}
            </button>
          `;
        }).join('')}
      </div>
    `;
  },

  selectCustomTemplate(id) {
    const saved = JSON.parse(localStorage.getItem('astrotv_custom_templates') || '[]');
    const found = saved.find(t => t.id === id);
    if (found) {
      Scoreboard.state.template = found;
      Scoreboard.updatePreview();
      Scoreboard.syncOverlay();
      App.showToast(`Placar personalizado "${found.name}" ativado! 🖼️`, 'success');
      App.renderCurrentRoute();
    }
  },

  // ─────────────── Score Actions ───────────────

  addScore(team, amount) {
    const key = team === 'A' ? 'scoreA' : 'scoreB';
    Scoreboard.state[key] = Math.max(0, Scoreboard.state[key] + amount);
    Scoreboard.updatePreview();
    Scoreboard.syncOverlay();

    // Animação de flash
    if (amount > 0) {
      const el = document.getElementById(`overlay-score-${team.toLowerCase()}`);
      if (el) {
        el.classList.add('animate-score-flash');
        setTimeout(() => el.classList.remove('animate-score-flash'), 400);
      }
    }

    // Update display
    const display = document.getElementById(`display-score-${team.toLowerCase()}`);
    if (display) display.textContent = Scoreboard.state[key];
  },

  addSets(team, amount) {
    const key = team === 'A' ? 'setsA' : 'setsB';
    Scoreboard.state[key] = Math.max(0, Math.min(5, Scoreboard.state[key] + amount));
    Scoreboard.updatePreview();
    Scoreboard.syncOverlay();

    const display = document.getElementById(`display-sets-${team.toLowerCase()}`);
    if (display) display.textContent = Scoreboard.state[key];
  },

  addFouls(team, amount) {
    const key = team === 'A' ? 'foulsA' : 'foulsB';
    Scoreboard.state[key] = Math.max(0, Scoreboard.state[key] + amount);
    Scoreboard.updatePreview();
    Scoreboard.syncOverlay();

    const display = document.getElementById(`display-fouls-${team.toLowerCase()}`);
    if (display) display.textContent = Scoreboard.state[key];
  },

  setPeriod(period) {
    Scoreboard.state.period = period;
    Scoreboard.updatePreview();
    Scoreboard.syncOverlay();
  },

  nextPeriod() {
    const sport = AppState.get('sport');
    const max = sport === 'volei' ? 5 : sport === 'basquete' ? 5 : 3;
    if (Scoreboard.state.period < max) {
      Scoreboard.state.period++;

      // No vôlei, resetar pontos ao mudar de set
      if (sport === 'volei') {
        Scoreboard.state.scoreA = 0;
        Scoreboard.state.scoreB = 0;
      }

      Scoreboard.updatePreview();
      Scoreboard.syncOverlay();
      App.renderCurrentRoute();
      App.showToast(`${Scoreboard.formatPeriod(Scoreboard.state.period)}`, 'info');
    }
  },

  setTemplate(template) {
    Scoreboard.state.template = template;
    Scoreboard.updatePreview();

    // Update tabs
    document.querySelectorAll('.scoreboard-controls .tab').forEach(tab => {
      tab.classList.remove('active');
    });
    event.target.classList.add('active');
  },

  resetScore() {
    Scoreboard.state.scoreA = 0;
    Scoreboard.state.scoreB = 0;
    Scoreboard.state.foulsA = 0;
    Scoreboard.state.foulsB = 0;
    Scoreboard.stopTimer();
    Scoreboard.state.timerSeconds = 0;
    Scoreboard.state.timer = '00:00';
    Scoreboard.updatePreview();
    Scoreboard.syncOverlay();
    App.renderCurrentRoute();
    App.showToast('Placar resetado! 🔄', 'info');
  },

  // ─────────────── Timer ───────────────

  setTimer(value) {
    Scoreboard.state.timer = value;
    const parts = value.split(':');
    if (parts.length === 2) {
      Scoreboard.state.timerSeconds = parseInt(parts[0]) * 60 + parseInt(parts[1]);
    }
    Scoreboard.syncOverlay();
  },

  toggleTimer() {
    if (Scoreboard.state.timerRunning) {
      Scoreboard.stopTimer();
    } else {
      Scoreboard.startTimer();
    }
  },

  startTimer() {
    Scoreboard.state.timerRunning = true;
    Scoreboard.state.timerInterval = setInterval(() => {
      Scoreboard.state.timerSeconds++;
      const min = Math.floor(Scoreboard.state.timerSeconds / 60).toString().padStart(2, '0');
      const sec = (Scoreboard.state.timerSeconds % 60).toString().padStart(2, '0');
      Scoreboard.state.timer = `${min}:${sec}`;

      const timerEl = document.getElementById('overlay-timer');
      if (timerEl) timerEl.textContent = Scoreboard.state.timer;

      const inputEl = document.getElementById('timer-input');
      if (inputEl) inputEl.value = Scoreboard.state.timer;

      Scoreboard.syncOverlay();
    }, 1000);

    const btn = document.getElementById('btn-timer');
    if (btn) {
      btn.textContent = '⏸ Pausar';
      btn.classList.remove('btn-secondary');
      btn.classList.add('btn-danger');
    }
  },

  stopTimer() {
    Scoreboard.state.timerRunning = false;
    if (Scoreboard.state.timerInterval) {
      clearInterval(Scoreboard.state.timerInterval);
      Scoreboard.state.timerInterval = null;
    }

    const btn = document.getElementById('btn-timer');
    if (btn) {
      btn.textContent = '▶ Iniciar';
      btn.classList.remove('btn-danger');
      btn.classList.add('btn-secondary');
    }
  },

  // ─────────────── Sync & Update ───────────────

  updatePreview() {
    const previewArea = document.getElementById('scoreboard-preview-area');
    if (previewArea) {
      previewArea.innerHTML = Scoreboard.renderOverlay(Scoreboard.state.template);
    }
  },

  /**
   * Sincroniza dados do placar via BroadcastChannel e localStorage
   */
  syncOverlay() {
    const data = {
      ...Scoreboard.state,
      teamA: AppState.get('teamA'),
      teamB: AppState.get('teamB'),
      sport: AppState.get('sport'),
      match: AppState.get('match'),
      competition: AppState.get('competition'),
      timestamp: Date.now()
    };

    // Salvar no localStorage para o overlay ler
    localStorage.setItem('astrotv_scoreboard_data', JSON.stringify(data));

    // Firebase Realtime Database Cloud Sync (Mundo Inteiro em 0ms)
    try {
      if (typeof FirebaseConfig !== 'undefined' && FirebaseConfig.db) {
        const roomId = FirebaseConfig.getRoomId();
        FirebaseConfig.db.ref(`rooms/${roomId}/scoreboard`).set(data);
      }
    } catch (e) {}

    // HTTP POST para o servidor API + Nuvem KVDB (garante sync no OBS Studio instantaneamente no Vercel e Local)
    try {
      fetch('/api/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }).catch(() => {});

      fetch('https://kvdb.io/Wf8X8ZgJ8jZ7Xp6J9q8Z2k/astrotv_state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }).catch(() => {});
    } catch (e) {}

    // BroadcastChannel para sync em tempo real entre abas
    try {
      if (!Scoreboard._channel) {
        Scoreboard._channel = new BroadcastChannel('astrotv_scoreboard');
      }
      Scoreboard._channel.postMessage(data);
    } catch (e) {
      // BroadcastChannel fallback
    }
  },

  _channel: null,

  /**
   * Cleanup quando sai da view
   */
  cleanup() {
    Scoreboard.stopTimer();
  }
};
