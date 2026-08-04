/* ============================================================
   ASTRO TV — Compact Control Panel Module (#/control)
   Otimizado para Docks Encaixáveis do OBS Studio e Telas de Celular
   ============================================================ */

const CompactControl = {
  render() {
    const { teamA, teamB, sport } = AppState.getAll();
    const s = Scoreboard.state;
    const key = typeof FirebaseConfig !== 'undefined' ? FirebaseConfig.getRoomId() : 'ASTRO-LIVE';

    return `
      <div style="padding: 10px; background: #060613; min-height: 100vh; color: white; font-family: 'Inter', sans-serif;">
        <!-- Compact OBS Dock Header -->
        <div style="background: rgba(124, 92, 252, 0.15); padding: 8px 12px; border-radius: 10px; border: 1px solid var(--border-color); margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center;">
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-size:16px;">📡</span>
            <span style="font-family:'Orbitron',sans-serif; font-size:12px; font-weight:800; color:white;">ASTRO DOCK</span>
          </div>
          <span class="badge badge-secondary" style="font-size:10px; padding:2px 6px; font-family:var(--font-mono);">${key}</span>
        </div>

        <!-- Live Match Banner -->
        <div style="background: rgba(0,0,0,0.5); padding: 10px; border-radius: 12px; text-align: center; margin-bottom: 10px; border: 1px solid rgba(255,255,255,0.08);">
          <div style="font-size: 10px; color: var(--text-muted); font-weight: 700; text-transform: uppercase;">
            ${sport.toUpperCase()} • ${Scoreboard.formatPeriod(s.period)} • <span style="font-family:var(--font-mono);color:white;">${s.timer}</span>
          </div>

          <div style="display: flex; justify-content: space-around; align-items: center; margin-top: 6px;">
            <div>
              <div style="font-size: 13px; font-weight: 800; color: ${teamA.color};">${teamA.abbr || teamA.name || 'TIME A'}</div>
              <div style="font-size: 32px; font-weight: 900; font-family: var(--font-mono);" id="dock-score-a">${s.scoreA}</div>
            </div>
            <div style="font-size: 18px; color: var(--text-muted);">×</div>
            <div>
              <div style="font-size: 13px; font-weight: 800; color: ${teamB.color};">${teamB.abbr || teamB.name || 'TIME B'}</div>
              <div style="font-size: 32px; font-weight: 900; font-family: var(--font-mono);" id="dock-score-b">${s.scoreB}</div>
            </div>
          </div>
        </div>

        <!-- Score Control Buttons -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 10px;">
          <button onclick="CompactControl.addScore('A', 1)" style="background: ${teamA.color}; color: white; border: none; padding: 14px 6px; border-radius: 10px; font-weight: 800; font-size: 15px; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.4);">
            +1 ${teamA.abbr || 'A'}
          </button>
          <button onclick="CompactControl.addScore('B', 1)" style="background: ${teamB.color}; color: white; border: none; padding: 14px 6px; border-radius: 10px; font-weight: 800; font-size: 15px; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.4);">
            +1 ${teamB.abbr || 'B'}
          </button>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 10px;">
          <button class="btn btn-ghost btn-sm" onclick="CompactControl.addScore('A', -1)" style="font-size:11px;">−1 ${teamA.abbr || 'A'}</button>
          <button class="btn btn-ghost btn-sm" onclick="CompactControl.addScore('B', -1)" style="font-size:11px;">−1 ${teamB.abbr || 'B'}</button>
        </div>

        <!-- Timer & Period Control -->
        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 6px; margin-bottom: 10px;">
          <button class="btn ${s.timerRunning ? 'btn-danger' : 'btn-primary'} btn-sm" onclick="Scoreboard.toggleTimer(); App.renderCurrentRoute();" style="font-weight:700;">
            ${s.timerRunning ? '⏸ PAUSAR' : '▶ CRONÔMETRO'}
          </button>
          <button class="btn btn-secondary btn-sm" onclick="Scoreboard.nextPeriod()">
            ⏭️ PRÓX.
          </button>
        </div>

        <!-- Broadcast Trigger Buttons Grid -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px;">
          <button class="btn btn-secondary btn-sm" onclick="AnimationControls.triggerBanner('GOAL', '💥 GOL!')" style="font-size:11px;">
            ⚽ Gol
          </button>
          <button class="btn btn-secondary btn-sm" onclick="AnimationControls.triggerBanner('TIMEOUT', '⏱️ TEMPO')" style="font-size:11px;">
            ⏱️ Tempo
          </button>
          <button class="btn btn-secondary btn-sm" onclick="AnimationControls.triggerCard('YELLOW')" style="font-size:11px;">
            🟨 Cartão A
          </button>
          <button class="btn btn-secondary btn-sm" onclick="AnimationControls.triggerCard('RED')" style="font-size:11px;">
            🟥 Cartão V
          </button>
          <button class="btn btn-secondary btn-sm" onclick="Soundboard.playWhistle()" style="font-size:11px;">
            📯 Apito
          </button>
          <button class="btn btn-secondary btn-sm" onclick="AnimationControls.triggerVAR()" style="font-size:11px;">
            🚨 VAR
          </button>
          <button class="btn btn-secondary btn-sm" onclick="AnimationControls.triggerStinger()" style="grid-column: span 2; background: linear-gradient(135deg, var(--primary), var(--secondary)); color: black; font-weight: 800; font-size:12px;">
            ⚡ Transição Stinger Wipe
          </button>
        </div>
      </div>
    `;
  },

  addScore(team, amount) {
    Scoreboard.addScore(team, amount);
    App.renderCurrentRoute();
  }
};
