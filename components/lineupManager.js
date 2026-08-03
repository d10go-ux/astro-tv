/* ============================================================
   ASTRO TV — Lineup Manager Component
   Cadastro e exibição de escalação oficial dos atletas titulares
   ============================================================ */

const LineupManager = {
  state: {
    rosterAText: '#10 Silva, #7 Santos, #1 Costa (G), #5 Lima, #8 Oliveira',
    rosterBText: '#9 Souza, #11 Alves, #12 Pereira (G), #4 Ferreira, #6 Rocha'
  },

  render() {
    const s = LineupManager.state;
    const teamA = AppState.get('teamA');
    const teamB = AppState.get('teamB');

    return `
      <div class="panel" style="margin-bottom: var(--sp-4);">
        <div class="panel-header flex justify-between items-center">
          <h3>👕 Escalação dos Times (Line-up)</h3>
        </div>
        <div class="panel-body">
          <div class="form-group">
            <label class="form-label" style="color: ${teamA.color}">Titulares ${teamA.name || 'Time A'}</label>
            <input type="text" class="form-input" value="${s.rosterAText}" placeholder="Ex: #10 Silva, #7 Santos..."
                   onchange="LineupManager.update('rosterAText', this.value)">
          </div>

          <div class="form-group" style="margin-top: var(--sp-3);">
            <label class="form-label" style="color: ${teamB.color}">Titulares ${teamB.name || 'Time B'}</label>
            <input type="text" class="form-input" value="${s.rosterBText}" placeholder="Ex: #9 Souza, #11 Alves..."
                   onchange="LineupManager.update('rosterBText', this.value)">
          </div>

          <button class="btn btn-primary btn-sm w-full" style="margin-top: var(--sp-3);"
                  onclick="LineupManager.triggerLineup()">
            👕 Exibir Escalação Oficial no OBS
          </button>
        </div>
      </div>
    `;
  },

  update(field, value) {
    LineupManager.state[field] = value;
  },

  triggerLineup() {
    const s = LineupManager.state;
    const rosterA = s.rosterAText.split(',').map(x => x.trim()).filter(Boolean);
    const rosterB = s.rosterBText.split(',').map(x => x.trim()).filter(Boolean);

    const payload = {
      action: 'TRIGGER_LINEUP',
      teamA: AppState.get('teamA'),
      teamB: AppState.get('teamB'),
      rosterA: rosterA,
      rosterB: rosterB,
      duration: 8000
    };

    if (typeof AnimationControls !== 'undefined') {
      AnimationControls.sendAnimationEvent(payload);
    }

    App.showToast('Escalação Oficial dos times exibida no OBS! 👕', 'success');
  }
};
