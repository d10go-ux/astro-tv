/* ============================================================
   ASTRO TV — Room Manager Component
   Gerenciador de Código de Sala / Stream Key para transmissões seguras
   ============================================================ */

const RoomManager = {
  render() {
    const activeRoom = typeof FirebaseConfig !== 'undefined' ? FirebaseConfig.getRoomId() : 'ASTRO-LIVE';

    return `
      <div class="panel" style="margin-bottom: var(--sp-4);">
        <div class="panel-header flex justify-between items-center">
          <h3>🔑 Código da Sala / Stream Key</h3>
          <span class="badge badge-secondary">${activeRoom}</span>
        </div>
        <div class="panel-body">
          <p style="font-size:12px;color:var(--text-muted);margin-bottom:8px;">
            Utilize o mesmo Código de Sala no OBS Studio para sincronizar a transmissão ao vivo no mundo inteiro.
          </p>
          <div class="form-group">
            <label class="form-label">Código de Sala Ativo</label>
            <div class="form-row">
              <input type="text" class="form-input" id="room-id-input" value="${activeRoom}" 
                     style="text-transform:uppercase;font-family:var(--font-mono);font-weight:700;"
                     placeholder="Ex: JOGOS-ESCOLA-2026">
              <button class="btn btn-secondary btn-sm" onclick="RoomManager.changeRoom()">
                Trocar Sala
              </button>
            </div>
          </div>
          <div class="flex justify-between items-center" style="margin-top:8px;">
            <button class="btn btn-ghost btn-sm" onclick="RoomManager.copyObsUrl()">
              📋 Copiar URL do OBS com esta Sala
            </button>
            <button class="btn btn-ghost btn-sm" onclick="RoomManager.generateRandomRoom()">
              🎲 Gerar Sala Aleatória
            </button>
          </div>
        </div>
      </div>
    `;
  },

  changeRoom() {
    const input = document.getElementById('room-id-input');
    if (!input || !input.value.trim()) return;

    const newRoom = FirebaseConfig.setRoomId(input.value);
    App.showToast(`Conectado à sala "${newRoom}"! 🔑`, 'success');
    App.renderCurrentRoute();
  },

  generateRandomRoom() {
    const code = 'ASTRO-' + Math.floor(1000 + Math.random() * 9000);
    FirebaseConfig.setRoomId(code);
    App.showToast(`Nova sala "${code}" gerada! 🔑`, 'success');
    App.renderCurrentRoute();
  },

  copyObsUrl() {
    const room = FirebaseConfig.getRoomId();
    const obsUrl = `${window.location.origin}/overlay/scoreboard.html?room=${room}`;

    navigator.clipboard.writeText(obsUrl).then(() => {
      App.showToast(`URL do OBS copiada com a sala ${room}! 📋`, 'success');
    }).catch(() => {
      App.showToast('Erro ao copiar URL', 'error');
    });
  }
};
