/* ============================================================
   ASTRO TV — Team Setup Component
   Configuração de times e detalhes da partida
   ============================================================ */

const TeamSetup = {
  /**
   * Renderiza o formulário completo de configuração da partida
   * @param {Object} state - Estado atual do app
   * @returns {string} HTML do componente
   */
  render(state) {
    const { teamA, teamB, sport, match } = state;

    return `
      <div class="view-container">
        <div class="container">
          <a class="back-nav" href="#/">
            ← Voltar ao Dashboard
          </a>

          <div class="section-header">
            <h2>⚙️ Configurar Partida</h2>
            <p>Configure os times, modalidade e detalhes do jogo</p>
          </div>

          <!-- Seletor de Modalidade -->
          <div class="panel" style="margin-bottom: var(--sp-6)">
            <div class="panel-header">
              <h3>🏅 Modalidade</h3>
            </div>
            <div class="panel-body">
              <div class="sport-selector">
                <label class="sport-option">
                  <input type="radio" name="sport" value="volei" ${sport === 'volei' ? 'checked' : ''} 
                         onchange="TeamSetup.changeSport(this.value)">
                  <div class="sport-option-content">
                    <span class="sport-icon">🏐</span>
                    <span class="sport-name">Vôlei</span>
                  </div>
                </label>
                <label class="sport-option">
                  <input type="radio" name="sport" value="basquete" ${sport === 'basquete' ? 'checked' : ''} 
                         onchange="TeamSetup.changeSport(this.value)">
                  <div class="sport-option-content">
                    <span class="sport-icon">🏀</span>
                    <span class="sport-name">Basquete</span>
                  </div>
                </label>
                <label class="sport-option">
                  <input type="radio" name="sport" value="futsal" ${sport === 'futsal' ? 'checked' : ''} 
                         onchange="TeamSetup.changeSport(this.value)">
                  <div class="sport-option-content">
                    <span class="sport-icon">⚽</span>
                    <span class="sport-name">Futsal</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <!-- Configuração dos Times -->
          <div class="panel" style="margin-bottom: var(--sp-6)">
            <div class="panel-header">
              <h3>🏆 Times</h3>
            </div>
            <div class="panel-body">
              <div class="team-setup">
                <!-- Time A -->
                <div class="team-column">
                  <div class="team-header">
                    <div class="team-indicator" style="background: ${teamA.color}"></div>
                    <h4>Time A (Casa)</h4>
                  </div>

                  <div class="form-group" style="background: rgba(var(--primary-rgb), 0.08); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
                    <label class="form-label" style="color: var(--primary-light);">📂 Selecionar dos Cadastrados</label>
                    <select class="form-select" onchange="TeamSetup.loadSavedToSlot('A', this.value)">
                      <option value="">-- Escolher time cadastrado --</option>
                      ${TeamSetup.getSavedOptions(teamA.name)}
                    </select>
                  </div>

                  <div class="form-group">
                    <label class="form-label">Nome do Time</label>
                    <input type="text" class="form-input" id="team-a-name" 
                           value="${teamA.name}" placeholder="Ex: 3º Ano A / Colégio ASTRO"
                           onchange="TeamSetup.updateTeam('A', 'name', this.value)">
                  </div>

                  <div class="form-group">
                    <label class="form-label">Sigla (3 letras)</label>
                    <input type="text" class="form-input" id="team-a-abbr" 
                           value="${teamA.abbr}" placeholder="AST" maxlength="3"
                           style="text-transform: uppercase; font-family: var(--font-mono); font-weight: 700;"
                           onchange="TeamSetup.updateTeam('A', 'abbr', this.value.toUpperCase())">
                  </div>

                  ${ColorPicker.render('team-a-color', 'Cor Principal', teamA.color, 
                    (c) => TeamSetup.updateTeam('A', 'color', c))}

                  ${ColorPicker.render('team-a-color2', 'Cor Secundária', teamA.color2, 
                    (c) => TeamSetup.updateTeam('A', 'color2', c))}

                  <div class="form-group">
                    <label class="form-label">Logo do Time (opcional)</label>
                    <div class="logo-upload" id="logo-upload-a" onclick="TeamSetup.triggerLogoUpload('A')">
                      ${teamA.logo 
                        ? `<img src="${teamA.logo}" alt="Logo Time A">` 
                        : `<span class="upload-icon">📷</span><span>Clique para enviar</span>`
                      }
                    </div>
                    <input type="file" id="logo-file-a" accept="image/*" style="display:none" 
                           onchange="TeamSetup.handleLogoUpload('A', this)">
                  </div>
                </div>

                <!-- VS Divider -->
                <div class="vs-divider">
                  <div class="vs-badge">VS</div>
                </div>

                <!-- Time B -->
                <div class="team-column">
                  <div class="team-header">
                    <div class="team-indicator" style="background: ${teamB.color}"></div>
                    <h4>Time B (Visitante)</h4>
                  </div>

                  <div class="form-group" style="background: rgba(var(--secondary-rgb), 0.08); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
                    <label class="form-label" style="color: var(--secondary-light);">📂 Selecionar dos Cadastrados</label>
                    <select class="form-select" onchange="TeamSetup.loadSavedToSlot('B', this.value)">
                      <option value="">-- Escolher time cadastrado --</option>
                      ${TeamSetup.getSavedOptions(teamB.name)}
                    </select>
                  </div>

                  <div class="form-group">
                    <label class="form-label">Nome do Time</label>
                    <input type="text" class="form-input" id="team-b-name" 
                           value="${teamB.name}" placeholder="Ex: 3º Ano B / Escola Nova"
                           onchange="TeamSetup.updateTeam('B', 'name', this.value)">
                  </div>

                  <div class="form-group">
                    <label class="form-label">Sigla (3 letras)</label>
                    <input type="text" class="form-input" id="team-b-abbr" 
                           value="${teamB.abbr}" placeholder="ENV" maxlength="3"
                           style="text-transform: uppercase; font-family: var(--font-mono); font-weight: 700;"
                           onchange="TeamSetup.updateTeam('B', 'abbr', this.value.toUpperCase())">
                  </div>

                  ${ColorPicker.render('team-b-color', 'Cor Principal', teamB.color, 
                    (c) => TeamSetup.updateTeam('B', 'color', c))}

                  ${ColorPicker.render('team-b-color2', 'Cor Secundária', teamB.color2, 
                    (c) => TeamSetup.updateTeam('B', 'color2', c))}

                  <div class="form-group">
                    <label class="form-label">Logo do Time (opcional)</label>
                    <div class="logo-upload" id="logo-upload-b" onclick="TeamSetup.triggerLogoUpload('B')">
                      ${teamB.logo 
                        ? `<img src="${teamB.logo}" alt="Logo Time B">` 
                        : `<span class="upload-icon">📷</span><span>Clique para enviar</span>`
                      }
                    </div>
                    <input type="file" id="logo-file-b" accept="image/*" style="display:none" 
                           onchange="TeamSetup.handleLogoUpload('B', this)">
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Detalhes da Partida -->
          <div class="panel" style="margin-bottom: var(--sp-6)">
            <div class="panel-header">
              <h3>📋 Detalhes da Partida</h3>
            </div>
            <div class="panel-body">
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Nome do Campeonato</label>
                  <input type="text" class="form-input" id="match-tournament" 
                         value="${match.tournament}" placeholder="Ex: Copa Interescolar 2026"
                         onchange="TeamSetup.updateMatch('tournament', this.value)">
                </div>
                <div class="form-group">
                  <label class="form-label">Fase / Rodada</label>
                  <input type="text" class="form-input" id="match-phase" 
                         value="${match.phase}" placeholder="Ex: Final / Semifinal / Grupo A"
                         onchange="TeamSetup.updateMatch('phase', this.value)">
                </div>
              </div>
              <div class="form-row form-row-3">
                <div class="form-group">
                  <label class="form-label">Data</label>
                  <input type="date" class="form-input" id="match-date" 
                         value="${match.date}"
                         onchange="TeamSetup.updateMatch('date', this.value)">
                </div>
                <div class="form-group">
                  <label class="form-label">Horário</label>
                  <input type="time" class="form-input" id="match-time" 
                         value="${match.time}"
                         onchange="TeamSetup.updateMatch('time', this.value)">
                </div>
                <div class="form-group">
                  <label class="form-label">Local</label>
                  <input type="text" class="form-input" id="match-location" 
                         value="${match.location}" placeholder="Ex: Ginásio Poliesportivo"
                         onchange="TeamSetup.updateMatch('location', this.value)">
                </div>
              </div>
            </div>
          </div>

          <!-- Ações -->
          <div class="flex justify-between items-center" style="margin-bottom: var(--sp-12)">
            <button class="btn btn-secondary" onclick="TeamSetup.saveTeams()">
              💾 Salvar Times
            </button>
            <div class="flex gap-3">
              <button class="btn btn-ghost" onclick="TeamSetup.loadSavedTeams()">
                📂 Carregar Salvos
              </button>
              <button class="btn btn-primary btn-lg" id="btn-continue" onclick="TeamSetup.continue()">
                Continuar →
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  /**
   * Muda a modalidade esportiva
   */
  changeSport(sport) {
    AppState.set('sport', sport);
    App.showToast(`Modalidade alterada para ${TeamSetup.getSportName(sport)}`, 'info');
  },

  /**
   * Retorna nome formatado da modalidade
   */
  getSportName(sport) {
    const names = { volei: '🏐 Vôlei', basquete: '🏀 Basquete', futsal: '⚽ Futsal' };
    return names[sport] || sport;
  },

  /**
   * Atualiza dados de um time
   */
  updateTeam(team, field, value) {
    const key = team === 'A' ? 'teamA' : 'teamB';
    const current = AppState.get(key);
    current[field] = value;
    AppState.set(key, current);
    if (typeof Scoreboard !== 'undefined') Scoreboard.syncOverlay();
  },

  /**
   * Atualiza dados da partida
   */
  updateMatch(field, value) {
    const match = AppState.get('match');
    match[field] = value;
    AppState.set('match', match);
  },

  /**
   * Abre o seletor de arquivo para logo
   */
  triggerLogoUpload(team) {
    const input = document.getElementById(`logo-file-${team.toLowerCase()}`);
    if (input) input.click();
  },

  /**
   * Lida com upload de logo
   */
  handleLogoUpload(team, input) {
    const file = input.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      TeamSetup.updateTeam(team, 'logo', dataUrl);
      
      const preview = document.getElementById(`logo-upload-${team.toLowerCase()}`);
      if (preview) {
        preview.innerHTML = `<img src="${dataUrl}" alt="Logo Time ${team}">`;
      }
      
      App.showToast(`Logo do Time ${team} atualizado!`, 'success');
    };
    reader.readAsDataURL(file);
  },

  /**
   * Salva times no localStorage
   */
  saveTeams() {
    const saved = JSON.parse(localStorage.getItem('astrotv_saved_teams') || '[]');
    const teamA = AppState.get('teamA');
    const teamB = AppState.get('teamB');
    
    // Salvar cada time individualmente
    const saveTeam = (team) => {
      const exists = saved.findIndex(t => t.name === team.name);
      if (exists >= 0) {
        saved[exists] = { ...team, savedAt: Date.now() };
      } else {
        saved.push({ ...team, savedAt: Date.now() });
      }
    };

    if (teamA.name) saveTeam(teamA);
    if (teamB.name) saveTeam(teamB);

    localStorage.setItem('astrotv_saved_teams', JSON.stringify(saved));
    App.showToast('Times salvos com sucesso! 💾', 'success');
  },

  /**
   * Carrega times salvos
   */
  loadSavedTeams() {
    const saved = JSON.parse(localStorage.getItem('astrotv_saved_teams') || '[]');
    
    if (saved.length === 0) {
      App.showToast('Nenhum time salvo encontrado', 'warning');
      return;
    }

    // Mostrar modal com times salvos
    const teamsHtml = saved.map((team, i) => `
      <div class="export-option" onclick="TeamSetup.selectSavedTeam(${i}, '${team.name}')">
        <div class="export-option-icon" style="background: ${team.color}20; color: ${team.color}">
          ${team.abbr || '???'}
        </div>
        <div class="export-option-info">
          <h4>${team.name}</h4>
          <p>Cor: ${team.color} • Sigla: ${team.abbr || '---'}</p>
        </div>
      </div>
    `).join('');

    App.showModal('📂 Times Salvos', `
      <p style="margin-bottom: var(--sp-4); color: var(--text-secondary); font-size: var(--fs-sm);">
        Selecione um time para carregar como Time A ou Time B
      </p>
      <div class="export-options">${teamsHtml}</div>
    `);
  },

  /**
   * Seleciona time salvo
   */
  selectSavedTeam(index) {
    const saved = JSON.parse(localStorage.getItem('astrotv_saved_teams') || '[]');
    const team = saved[index];
    if (!team) return;

    // Verificar qual time está vazio ou perguntar
    const teamA = AppState.get('teamA');
    const teamB = AppState.get('teamB');

    if (!teamA.name) {
      AppState.set('teamA', { ...team });
      App.showToast(`${team.name} carregado como Time A`, 'success');
    } else if (!teamB.name) {
      AppState.set('teamB', { ...team });
      App.showToast(`${team.name} carregado como Time B`, 'success');
    } else {
      AppState.set('teamA', { ...team });
      App.showToast(`${team.name} carregado como Time A (substituído)`, 'info');
    }

    App.closeModal();
    App.renderCurrentRoute();
  },

  /**
   * Continua para o módulo selecionado
   */
  continue() {
    const teamA = AppState.get('teamA');
    const teamB = AppState.get('teamB');

    if (!teamA.name || !teamB.name) {
      App.showToast('Preencha o nome dos dois times para continuar', 'warning');
      return;
    }

    // Navegar para o módulo pendente
    const pendingModule = AppState.get('pendingModule') || '/scoreboard';
    window.location.hash = pendingModule;
  },

  /**
   * Retorna opções dos times salvos para a tag <select>
   */
  getSavedOptions(currentName) {
    const saved = JSON.parse(localStorage.getItem('astrotv_saved_teams') || '[]');
    return saved.map(t => `
      <option value="${t.name}" ${t.name === currentName ? 'selected' : ''}>
        ${t.name} (${t.abbr || '---'})
      </option>
    `).join('');
  },

  /**
   * Carrega time salvo direto no slot A ou B pelo nome
   */
  loadSavedToSlot(slot, teamName) {
    if (!teamName) return;
    const saved = JSON.parse(localStorage.getItem('astrotv_saved_teams') || '[]');
    const team = saved.find(t => t.name === teamName);
    if (!team) return;

    const key = slot === 'A' ? 'teamA' : 'teamB';
    AppState.set(key, { ...team });
    if (typeof Scoreboard !== 'undefined') Scoreboard.syncOverlay();
    App.showToast(`${team.name} carregado para Time ${slot}! 🏆`, 'success');
    App.renderCurrentRoute();
  }
};
