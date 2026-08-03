/* ============================================================
   ASTRO TV — Firebase Configuration & Initialization
   Autenticação de Operador e Banco de Dados Realtime Multi-Salas
   ============================================================ */

const FirebaseConfig = {
  // Configuração padrão do Firebase App (pode ser sobrescrita pelo usuário nas configurações)
  defaultConfig: {
    apiKey: "AIzaSyASTRO_TV_Demo_Key_2026_Project",
    authDomain: "astrotv-live.firebaseapp.com",
    databaseURL: "https://astrotv-live-default-rtdb.firebaseio.com",
    projectId: "astrotv-live",
    storageBucket: "astrotv-live.appspot.com",
    messagingSenderId: "1088219920",
    appId: "1:1088219920:web:astrotv2026demo"
  },

  app: null,
  auth: null,
  db: null,
  isInitialized: false,

  /**
   * Inicializa os serviços do Firebase (Auth & Database)
   */
  init() {
    if (FirebaseConfig.isInitialized) return;

    try {
      const savedConfig = JSON.parse(localStorage.getItem('astrotv_custom_firebase_config'));
      const cfg = savedConfig || FirebaseConfig.defaultConfig;

      if (typeof firebase !== 'undefined') {
        if (!firebase.apps.length) {
          FirebaseConfig.app = firebase.initializeApp(cfg);
        } else {
          FirebaseConfig.app = firebase.app();
        }

        FirebaseConfig.auth = firebase.auth();
        FirebaseConfig.db = firebase.database();
        FirebaseConfig.isInitialized = true;
        console.log('⚡ ASTRO TV Firebase initialized successfully!');
      }
    } catch (err) {
      console.warn('Firebase init warning:', err);
    }
  },

  /**
   * Retorna a chave da sala ativa (Stream Key)
   */
  getRoomId() {
    return localStorage.getItem('astrotv_active_room_id') || 'ASTRO-LIVE';
  },

  /**
   * Define a chave da sala ativa (Stream Key)
   */
  setRoomId(roomId) {
    const cleanId = (roomId || 'ASTRO-LIVE').toUpperCase().replace(/[^A-Z0-9_-]/g, '');
    localStorage.setItem('astrotv_active_room_id', cleanId);
    return cleanId;
  }
};

// Autostart Firebase on script load if SDK is ready
if (typeof firebase !== 'undefined') {
  FirebaseConfig.init();
}
