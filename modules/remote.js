/* ============================================================
   ASTRO TV — Mobile Remote Control Module (#/remote)
   Interface responsiva para celular com botões gigantes de toque rápido
   ============================================================ */

const MobileRemote = {
  render() {
    const { teamA, teamB, sport } = AppState.getAll();
    const s = Scoreboard.state;
    const room = typeof FirebaseConfig !== 'undefined' ? FirebaseConfig.getRoomId() : 'ASTRO-LIVE';

    return `
      <div class="view-container" style="padding-bottom: 80px;">
        <div class="container" style="max-width: 600px;">
          <!-- Top Header Info -->
          <div style="background: rgba(124, 92, 252, 0.12); padding: 14px; border-radius: 12px; border: 1px solid var(--border-color); margin-bottom: var(--sp-4);" class="flex justify-between items-center">
            <div>
              <div style="font-size:11px;color:var(--text-muted);text-transform:uppercase;font-weight:700;">📱 Controle Remoto</div>
              <h3 style="font-size:18px;margin:0;">SALA: <span style="color:var(--secondary);font-family:var(--font-mono);">${room}</span></h3>
            </div>
            <button class="btn btn-secondary btn-sm" onclick="MobileRemote.promptRoomChange()">
              🔑 Mudar Sala
            </button>
          </div>

          <!-- Main Teams & Score Display Header -->
          <div style="background: rgba(0,0,0,0.4); padding: 16px; border-radius: 16px; margin-bottom: var(--sp-4); text-align: center; border: 1px solid var(--border-color);">
            <div style="font-size: 12px; color: var(--text-muted); font-weight: 700; text-transform: uppercase; margin-bottom: 6px;">
              ${sport.toUpperCase()} • ${Scoreboard.formatPeriod(s.period)} • <span id="remote-timer-display" style="font-family:var(--font-mono);font-size:14px;color:white;">${s.timer}</span>
            </div>
            
            <div style="display:flex; justify-content:space-around; align-items:center; margin-top: 8px;">
              <div style="flex:1;">
                <div style="font-size: 16px; font-weight: 800; color: ${teamA.color};">${teamA.abbr || teamA.name || 'TIME A'}</div>
                <div style="font-size: 42px; font-weight: 900; font-family: var(--font-mono); color: white;" id="remote-score-a">${s.scoreA}</div>
              </div>
              <div style="font-size: 24px; color: var(--text-muted); font-weight: 300;">×</div>
              <div style="flex:1;">
                <div style="font-size: 16px; font-weight: 800; color: ${teamB.color};">${teamB.abbr || teamB.name || 'TIME B'}</div>
                <div style="font-size: 42px; font-weight: 900; font-family: var(--font-mono); color: white;" id="remote-score-b">${s.scoreB}</div>
              </div>
            </div>
          </div>

          <!-- HUGE TOUCH BUTTONS FOR MOBILE -->

          <!-- Score Controls Grid -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: var(--sp-4);">
            <!-- Team A Score Button -->
            <button onclick="MobileRemote.addScore('A', 1)" 
                    style="background: linear-gradient(135deg, ${teamA.color}, ${teamA.color2 || teamA.color}); color: white; padding: 22px 10px; border-radius: 16px; border: none; font-size: 20px; font-weight: 800; cursor: pointer; box-shadow: 0 6px 20px rgba(0,0,0,0.4); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px;">
              <span>+1 PONTO</span>
              <span style="font-size: 13px; opacity: 0.8; font-weight: 600;">${teamA.abbr || 'TIME A'}</span>
            </button>

            <!-- Team B Score Button -->
            <button onclick="MobileRemote.addScore('B', 1)" 
                    style="background: linear-gradient(135deg, ${teamB.color}, ${teamB.color2 || teamB.color}); color: white; padding: 22px 10px; border-radius: 16px; border: none; font-size: 20px; font-weight: 800; cursor: pointer; box-shadow: 0 6px 20px rgba(0,0,0,0.4); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px;">
              <span>+1 PONTO</span>
              <span style="font-size: 13px; opacity: 0.8; font-weight: 600;">${teamB.abbr || 'TIME B'}</span>
            </button>
          </div>

          <!-- Minus Score Sub-grid -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: var(--sp-4);">
            <button class="btn btn-ghost btn-sm" onclick="MobileRemote.addScore('A', -1)">− 1 Ponto ${teamA.abbr || 'A'}</button>
            <button class="btn btn-ghost btn-sm" onclick="MobileRemote.addScore('B', -1)">− 1 Ponto ${teamB.abbr || 'B'}</button>
          </div>

          <!-- Timer Controls -->
          <div style="background: var(--bg-card); padding: 14px; border-radius: 14px; border: 1px solid var(--border-color); margin-bottom: var(--sp-4);">
            <div style="font-size: 12px; font-weight: 700; color: var(--text-muted); margin-bottom: 8px; text-transform: uppercase;">⏱️ Cronômetro & Período</div>
            <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 10px;">
              <button class="btn ${s.timerRunning ? 'btn-danger' : 'btn-primary'} btn-lg" onclick="Scoreboard.toggleTimer(); App.renderCurrentRoute();">
                ${s.timerRunning ? '⏸ PAUSAR CRONÔMETRO' : '▶ INICIAR CRONÔMETRO'}
              </button>
              <button class="btn btn-secondary btn-lg" onclick="Scoreboard.nextPeriod()">
                ⏭️ PRÓX. ${Scoreboard.getPeriodLabel()}
              </button>
            </div>
          </div>

          <!-- Broadcast Trigger Buttons -->
          <div style="background: var(--bg-card); padding: 14px; border-radius: 14px; border: 1px solid var(--border-color); margin-bottom: var(--sp-4);">
            <div style="font-size: 12px; font-weight: 700; color: var(--text-muted); margin-bottom: 8px; text-transform: uppercase;">🎬 Disparar no OBS ao Vivo</div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
              <button class="btn btn-secondary" onclick="AnimationControls.triggerBanner('GOAL', '💥 GOL!')">
                ⚽ Vinheta de Gol
              </button>
              <button class="btn btn-secondary" onclick="AnimationControls.triggerBanner('TIMEOUT', '⏱️ TEMPO TÉCNICO')">
                ⏱️ Pedido de Tempo
              </button>
              <button class="btn btn-secondary" onclick="AnimationControls.triggerCard('YELLOW')">
                🟨 Cartão Amarelo
              </button>
              <button class="btn btn-secondary" onclick="AnimationControls.triggerCard('RED')">
                🟥 Cartão Vermelho
              </button>
              <button class="btn btn-secondary" onclick="Soundboard.playWhistle()">
                📯 Apito de Juiz
              </button>
              <button class="btn btn-secondary" onclick="AnimationControls.triggerVAR()">
                🚨 Alerta de VAR
              </button>
              <button class="btn btn-secondary" onclick="AnimationControls.triggerStinger()" style="grid-column: span 2; background: linear-gradient(135deg, var(--primary), var(--secondary)); color: black; font-weight: 800;">
                ⚡ Transição Stinger Wipe
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  addScore(team, amount) {
    Scoreboard.addScore(team, amount);
    App.renderCurrentRoute();
  },

  promptRoomChange() {
    const current = FirebaseConfig.getRoomId();
    const newRoom = prompt('Digite o Código da Sala (ex: ASTRO-LIVE, JOGOS-2026):', current);
    if (newRoom && newRoom.trim()) {
      FirebaseConfig.setRoomId(newRoom);
      App.showToast(`Sala alterada para "${newRoom.toUpperCase()}"! 🔑`, 'success');
      App.renderCurrentRoute();
    }
  }
};
