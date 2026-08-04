/* ============================================================
   ASTRO TV — Firebase Configuration & Cloud Sync Manager
   Sincronização em Nuvem de Times, Placares e Credenciais Customizadas
   ============================================================ */

const FirebaseConfig = {
  defaultConfig: {
    apiKey: "AIzaSyCN5ejr-wnBvno_Z8M1M4wffmpZizmvQzo",
    authDomain: "astrotv-live.firebaseapp.com",
    databaseURL: "https://astrotv-live-default-rtdb.firebaseio.com",
    projectId: "astrotv-live",
    storageBucket: "astrotv-live.firebasestorage.app",
    messagingSenderId: "700807485894",
    appId: "1:700807485894:web:50564d83e8306c7766bac7"
  },

  app: null,
  auth: null,
  db: null,
  isInitialized: false,

  isDemoKey() {
    return false;
  },

  getConfig() {
    const saved = localStorage.getItem('astrotv_custom_firebase_config');
    return saved ? JSON.parse(saved) : FirebaseConfig.defaultConfig;
  },

  init() {
    try {
      const cfg = FirebaseConfig.getConfig();

      if (typeof firebase !== 'undefined') {
        if (!firebase.apps.length) {
          FirebaseConfig.app = firebase.initializeApp(cfg);
        } else {
          FirebaseConfig.app = firebase.app();
        }

        FirebaseConfig.auth = firebase.auth();
        FirebaseConfig.db = firebase.database();
        if (typeof firebase.firestore === 'function') {
          FirebaseConfig.firestore = firebase.firestore();
        }
        FirebaseConfig.isInitialized = true;
        console.log('⚡ ASTRO TV Firebase & Firestore initialized!');
      }
    } catch (err) {
      console.warn('Firebase init warning:', err);
    }
  },

  firestore: null,

  /**
   * Salva um time na coleção do Firestore ('teams')
   */
  async saveTeamToFirestore(teamData) {
    try {
      if (FirebaseConfig.firestore) {
        await FirebaseConfig.firestore.collection('teams').doc(teamData.name || 'time').set({
          ...teamData,
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        console.log('🔥 Time salvo no Firestore:', teamData.name);
      }
    } catch (err) {
      console.warn('Firestore save error:', err);
    }
  },

  /**
   * Salva uma partida na coleção do Firestore ('matches')
   */
  async saveMatchToFirestore(matchData) {
    try {
      if (FirebaseConfig.firestore) {
        const roomId = FirebaseConfig.getRoomId();
        await FirebaseConfig.firestore.collection('matches').doc(roomId).set({
          ...matchData,
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        console.log('🔥 Partida salva no Firestore:', roomId);
      }
    } catch (err) {
      console.warn('Firestore match save error:', err);
    }
  },

  getRoomId() {
    return localStorage.getItem('astrotv_active_room_id') || 'ASTRO-LIVE';
  },

  setRoomId(roomId) {
    const cleanId = (roomId || 'ASTRO-LIVE').toUpperCase().replace(/[^A-Z0-9_-]/g, '');
    localStorage.setItem('astrotv_active_room_id', cleanId);
    return cleanId;
  },

  /**
   * Modal de Configuração das Credenciais do Firebase
   */
  showSettingsModal() {
    const cfg = FirebaseConfig.getConfig();

    App.showModal('🔥 Configurar Banco de Dados Firebase', `
      <p style="margin-bottom: var(--sp-4); color: var(--text-secondary); font-size: var(--fs-sm);">
        Insira os dados do seu projeto do Firebase Console para sincronizar placares e times em nuvem de qualquer lugar do mundo.
      </p>
      <form onsubmit="FirebaseConfig.handleSaveSettings(event)">
        <div class="form-group">
          <label class="form-label">Database URL (Realtime Database)</label>
          <input type="url" class="form-input" id="fb-database-url" required value="${cfg.databaseURL}" placeholder="https://seu-projeto-default-rtdb.firebaseio.com">
        </div>
        <div class="form-group" style="margin-top: var(--sp-3);">
          <label class="form-label">API Key</label>
          <input type="text" class="form-input" id="fb-api-key" required value="${cfg.apiKey}" placeholder="AIzaSy...">
        </div>
        <div class="form-group" style="margin-top: var(--sp-3);">
          <label class="form-label">Project ID</label>
          <input type="text" class="form-input" id="fb-project-id" required value="${cfg.projectId}" placeholder="meu-projeto-123">
        </div>
        <div class="flex gap-3" style="margin-top: var(--sp-4);">
          <button type="submit" class="btn btn-primary btn-lg w-full">💾 Salvar & Conectar Nuvem</button>
        </div>
        <div style="margin-top: var(--sp-3); text-align: center;">
          <button type="button" class="btn btn-ghost btn-sm" onclick="FirebaseConfig.resetToDefault()">🔄 Restaurar Padrão do ASTRO TV</button>
        </div>
      </form>
    `);
  },

  handleSaveSettings(e) {
    e.preventDefault();
    const dbUrl = document.getElementById('fb-database-url').value.trim();
    const apiKey = document.getElementById('fb-api-key').value.trim();
    const projectId = document.getElementById('fb-project-id').value.trim();

    const customConfig = {
      apiKey: apiKey,
      authDomain: `${projectId}.firebaseapp.com`,
      databaseURL: dbUrl,
      projectId: projectId,
      storageBucket: `${projectId}.appspot.com`
    };

    localStorage.setItem('astrotv_custom_firebase_config', JSON.stringify(customConfig));
    App.closeModal();
    App.showToast('Credenciais do Firebase salvas! Reiniciando conexão... 🔥', 'success');

    setTimeout(() => {
      window.location.reload();
    }, 1000);
  },

  resetToDefault() {
    localStorage.removeItem('astrotv_custom_firebase_config');
    App.closeModal();
    App.showToast('Restaurado para a nuvem padrão do ASTRO TV! 🔥', 'info');
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  },

  /**
   * Salva lista de times salvos na Nuvem Firebase
   */
  saveTeamsToCloud(teams) {
    try {
      if (FirebaseConfig.db) {
        FirebaseConfig.db.ref('global/saved_teams').set(teams);
      }
    } catch (e) {
      console.warn('Firebase cloud teams save error:', e);
    }
  },

  /**
   * Baixa lista de times salvos da Nuvem Firebase
   */
  loadTeamsFromCloud(callback) {
    try {
      if (FirebaseConfig.db) {
        FirebaseConfig.db.ref('global/saved_teams').once('value').then((snapshot) => {
          const val = snapshot.val();
          if (val && Array.isArray(val) && callback) {
            callback(val);
          }
        });
      }
    } catch (e) {
      console.warn('Firebase cloud teams load error:', e);
    }
  }
};

if (typeof firebase !== 'undefined') {
  FirebaseConfig.init();
}
