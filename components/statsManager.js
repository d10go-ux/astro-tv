/* ============================================================
   ASTRO TV — Live Match Stats Component
   Gerenciador e exibidor de estatísticas comparativas ao vivo
   ============================================================ */

const StatsManager = {
  state: {
    futsal: {
      shotsA: 0, shotsB: 0,
      cornersA: 0, cornersB: 0,
      foulsA: 0, foulsB: 0,
      possessionA: 50, possessionB: 50
    },
    volei: {
      acesA: 0, acesB: 0,
      blocksA: 0, blocksB: 0,
      attackA: 0, attackB: 0,
      errorsA: 0, errorsB: 0
    },
    basquete: {
      threePtsA: 0, threePtsB: 0,
      reboundsA: 0, reboundsB: 0,
      assistsA: 0, assistsB: 0,
      foulsA: 0, foulsB: 0
    }
  },

  render() {
    const sport = AppState.get('sport') || 'futsal';
    const teamA = AppState.get('teamA');
    const teamB = AppState.get('teamB');

    return `
      <div class="panel" style="margin-bottom: var(--sp-4);">
        <div class="panel-header flex justify-between items-center">
          <h3>📊 Estatísticas ao Vivo (${sport.toUpperCase()})</h3>
          <button class="btn btn-secondary btn-sm" onclick="StatsManager.triggerOverlay()">
            📺 Exibir Estatísticas no OBS
          </button>
        </div>
        <div class="panel-body">
          ${sport === 'volei' ? StatsManager.renderVoleiStats(teamA, teamB) :
            sport === 'basquete' ? StatsManager.renderBasqueteStats(teamA, teamB) :
            StatsManager.renderFutsalStats(teamA, teamB)}
        </div>
      </div>
    `;
  },

  renderFutsalStats(teamA, teamB) {
    const st = StatsManager.state.futsal;
    return `
      <div class="form-group">
        <div class="flex justify-between text-muted" style="font-size:12px;margin-bottom:4px;">
          <span>${teamA.name || 'Time A'} (${st.shotsA})</span>
          <strong>🎯 Chutes a Gol</strong>
          <span>${teamB.name || 'Time B'} (${st.shotsB})</span>
        </div>
        <div class="flex gap-2">
          <button class="btn btn-ghost btn-sm" onclick="StatsManager.add('futsal', 'shotsA', 1)">+1 ${teamA.abbr || 'A'}</button>
          <button class="btn btn-ghost btn-sm" onclick="StatsManager.add('futsal', 'shotsB', 1)">+1 ${teamB.abbr || 'B'}</button>
        </div>
      </div>

      <div class="form-group" style="margin-top:10px;">
        <div class="flex justify-between text-muted" style="font-size:12px;margin-bottom:4px;">
          <span>${teamA.name || 'Time A'} (${st.cornersA})</span>
          <strong>🚩 Escanteios</strong>
          <span>${teamB.name || 'Time B'} (${st.cornersB})</span>
        </div>
        <div class="flex gap-2">
          <button class="btn btn-ghost btn-sm" onclick="StatsManager.add('futsal', 'cornersA', 1)">+1 ${teamA.abbr || 'A'}</button>
          <button class="btn btn-ghost btn-sm" onclick="StatsManager.add('futsal', 'cornersB', 1)">+1 ${teamB.abbr || 'B'}</button>
        </div>
      </div>
    `;
  },

  renderVoleiStats(teamA, teamB) {
    const st = StatsManager.state.volei;
    return `
      <div class="form-group">
        <div class="flex justify-between text-muted" style="font-size:12px;margin-bottom:4px;">
          <span>${teamA.name || 'Time A'} (${st.acesA})</span>
          <strong>⚡ Aces de Saque</strong>
          <span>${teamB.name || 'Time B'} (${st.acesB})</span>
        </div>
        <div class="flex gap-2">
          <button class="btn btn-ghost btn-sm" onclick="StatsManager.add('volei', 'acesA', 1)">+1 ${teamA.abbr || 'A'}</button>
          <button class="btn btn-ghost btn-sm" onclick="StatsManager.add('volei', 'acesB', 1)">+1 ${teamB.abbr || 'B'}</button>
        </div>
      </div>

      <div class="form-group" style="margin-top:10px;">
        <div class="flex justify-between text-muted" style="font-size:12px;margin-bottom:4px;">
          <span>${teamA.name || 'Time A'} (${st.blocksA})</span>
          <strong>🛡️ Bloqueios</strong>
          <span>${teamB.name || 'Time B'} (${st.blocksB})</span>
        </div>
        <div class="flex gap-2">
          <button class="btn btn-ghost btn-sm" onclick="StatsManager.add('volei', 'blocksA', 1)">+1 ${teamA.abbr || 'A'}</button>
          <button class="btn btn-ghost btn-sm" onclick="StatsManager.add('volei', 'blocksB', 1)">+1 ${teamB.abbr || 'B'}</button>
        </div>
      </div>
    `;
  },

  renderBasqueteStats(teamA, teamB) {
    const st = StatsManager.state.basquete;
    return `
      <div class="form-group">
        <div class="flex justify-between text-muted" style="font-size:12px;margin-bottom:4px;">
          <span>${teamA.name || 'Time A'} (${st.threePtsA})</span>
          <strong>🏀 Bolas de 3P</strong>
          <span>${teamB.name || 'Time B'} (${st.threePtsB})</span>
        </div>
        <div class="flex gap-2">
          <button class="btn btn-ghost btn-sm" onclick="StatsManager.add('basquete', 'threePtsA', 1)">+1 ${teamA.abbr || 'A'}</button>
          <button class="btn btn-ghost btn-sm" onclick="StatsManager.add('basquete', 'threePtsB', 1)">+1 ${teamB.abbr || 'B'}</button>
        </div>
      </div>
    `;
  },

  add(sport, key, amount) {
    if (StatsManager.state[sport] && StatsManager.state[sport][key] !== undefined) {
      StatsManager.state[sport][key] += amount;
      App.renderCurrentRoute();
      App.showToast('Estatística atualizada! 📊', 'info');
    }
  },

  triggerOverlay() {
    const sport = AppState.get('sport') || 'futsal';
    const st = StatsManager.state[sport];

    const payload = {
      action: 'TRIGGER_STATS',
      sport: sport,
      stats: st,
      teamA: AppState.get('teamA'),
      teamB: AppState.get('teamB'),
      duration: 6000
    };

    if (typeof AnimationControls !== 'undefined') {
      AnimationControls.sendAnimationEvent(payload);
    }

    App.showToast('Estatísticas comparativas exibidas no OBS! 📊', 'success');
  }
};
