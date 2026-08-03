/* ============================================================
   ASTRO TV — Competition & Broadcast Branding Manager
   Gerenciador de competições, marcas d'água e patrocinadores
   ============================================================ */

const CompetitionManager = {
  // Presets padrão de competição
  presets: [
    {
      id: 'friendly',
      name: '🤝 Amistoso',
      tournament: 'AMISTOSO PREPARATÓRIO',
      badgeText: 'AO VIVO',
      themeColor: '#7c5cfc',
      sponsors: ['ASTRO TV', 'SPORTS BRAND']
    },
    {
      id: 'interescolar',
      name: '🏆 Copa Interescolar',
      tournament: 'COPA INTERESCOLAR 2026',
      badgeText: 'AO VIVO',
      themeColor: '#00e5d0',
      sponsors: ['BANCO ESCOLAR', 'ACADEMIA PEAK']
    },
    {
      id: 'liga_regional',
      name: '⚡ Liga Regional',
      tournament: 'LIGA REGIONAL ESPORTIVA',
      badgeText: 'TRANSMISSÃO',
      themeColor: '#ff6b9d',
      sponsors: ['POWER DRINK', 'ASTRO NET']
    },
    {
      id: 'final_championship',
      name: '👑 Grande Final',
      tournament: 'GRANDE FINAL DO CAMPEONATO',
      badgeText: 'AO VIVO',
      themeColor: '#ffa94d',
      sponsors: ['PATROCINADOR MASTER']
    }
  ],

  /**
   * Renderiza a seção de gestão da competição no painel
   */
  render() {
    const competition = AppState.get('competition') || CompetitionManager.presets[0];
    const sponsors = competition.sponsors || [];

    return `
      <div class="panel" style="margin-bottom: var(--sp-6)">
        <div class="panel-header">
          <h3>📡 Formato de Transmissão & Emissora</h3>
          <span class="live-badge"><span class="live-dot"></span> BROADCAST</span>
        </div>
        <div class="panel-body">
          <!-- Preset Fast Select -->
          <div class="form-group">
            <label class="form-label">Perfil de Competição</label>
            <div class="tabs" style="flex-wrap: wrap; gap: 6px;">
              ${CompetitionManager.presets.map(p => `
                <div class="tab ${competition.id === p.id ? 'active' : ''}" 
                     onclick="CompetitionManager.selectPreset('${p.id}')">
                  ${p.name}
                </div>
              `).join('')}
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Selo de Transmissão (Badge)</label>
              <input type="text" class="form-input" id="comp-badge-text" 
                     value="${competition.badgeText || 'AO VIVO'}" 
                     placeholder="Ex: AO VIVO / EXCLUSIVO"
                     onchange="CompetitionManager.updateField('badgeText', this.value)">
            </div>
            <div class="form-group">
              <label class="form-label">Nome da Competição / Torneio</label>
              <input type="text" class="form-input" id="comp-tournament" 
                     value="${competition.tournament || ''}" 
                     placeholder="Ex: Copa Interescolar 2026"
                     onchange="CompetitionManager.updateField('tournament', this.value)">
            </div>
          </div>

          <!-- Sponsor Bar Section -->
          <div class="form-group" style="margin-top: var(--sp-4);">
            <label class="form-label">Patrocinadores da Transmissão (Sponsors)</label>
            <div class="flex gap-2" style="margin-bottom: var(--sp-3);">
              <input type="text" class="form-input" id="sponsor-input" 
                     placeholder="Nome do Patrocinador (Ex: NIKE, COCA-COLA)" style="flex:1;">
              <button class="btn btn-secondary" onclick="CompetitionManager.addSponsor()">
                + Adicionar
              </button>
            </div>
            <div class="flex gap-2" style="flex-wrap: wrap;" id="sponsor-tags">
              ${sponsors.map((sp, idx) => `
                <span class="badge badge-primary" style="display:inline-flex;align-items:center;gap:6px;padding:6px 12px;font-size:12px;">
                  🏢 ${sp}
                  <span style="cursor:pointer;opacity:0.7;" onclick="CompetitionManager.removeSponsor(${idx})">✕</span>
                </span>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  },

  /**
   * Seleciona preset de competição
   */
  selectPreset(presetId) {
    const preset = CompetitionManager.presets.find(p => p.id === presetId);
    if (!preset) return;

    AppState.set('competition', { ...preset });
    
    // Atualizar no objeto match do estado principal também
    const match = AppState.get('match');
    match.tournament = preset.tournament;
    AppState.set('match', match);

    App.showToast(`Perfil alterado para: ${preset.name}`, 'info');
    App.renderCurrentRoute();
  },

  /**
   * Atualiza campo único da competição
   */
  updateField(field, value) {
    const comp = AppState.get('competition') || { ...CompetitionManager.presets[0] };
    comp[field] = value;
    AppState.set('competition', comp);

    if (field === 'tournament') {
      const match = AppState.get('match');
      match.tournament = value;
      AppState.set('match', match);
    }
  },

  /**
   * Adiciona patrocinador
   */
  addSponsor() {
    const input = document.getElementById('sponsor-input');
    if (!input || !input.value.trim()) return;

    const comp = AppState.get('competition') || { ...CompetitionManager.presets[0] };
    if (!comp.sponsors) comp.sponsors = [];

    comp.sponsors.push(input.value.trim());
    AppState.set('competition', comp);
    input.value = '';

    App.showToast('Patrocinador adicionado! 🏢', 'success');
    App.renderCurrentRoute();
  },

  /**
   * Remove patrocinador por índice
   */
  removeSponsor(index) {
    const comp = AppState.get('competition');
    if (!comp || !comp.sponsors) return;

    comp.sponsors.splice(index, 1);
    AppState.set('competition', comp);
    App.renderCurrentRoute();
  }
};
