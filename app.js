/* ============================================================
   ASTRO TV — Main Application
   SPA Router, State Management, Dashboard & Core Logic
   ============================================================ */

/* ──────────────── State Management ──────────────── */
const AppState = {
  _state: {
    sport: 'futsal',
    teamA: {
      name: '',
      abbr: '',
      color: '#e74c3c',
      color2: '#c0392b',
      logo: null,
    },
    teamB: {
      name: '',
      abbr: '',
      color: '#3498db',
      color2: '#2980b9',
      logo: null,
    },
    match: {
      tournament: '',
      phase: '',
      date: '',
      time: '',
      location: '',
    },
    competition: {
      id: 'friendly',
      name: '🤝 Amistoso',
      tournament: 'AMISTOSO PREPARATÓRIO',
      badgeText: 'AO VIVO',
      themeColor: '#7c5cfc',
      sponsors: ['ASTRO TV']
    },
    pendingModule: null,
  },

  _listeners: {},

  /**
   * Get a state value
   */
  get(key) {
    return this._state[key];
  },

  /**
   * Get all state
   */
  getAll() {
    return { ...this._state };
  },

  /**
   * Set a state value
   */
  set(key, value) {
    this._state[key] = value;
    this.persist();
    this._emit(key, value);
  },

  /**
   * Listen for state changes
   */
  on(key, callback) {
    if (!this._listeners[key]) this._listeners[key] = [];
    this._listeners[key].push(callback);
  },

  _emit(key, value) {
    (this._listeners[key] || []).forEach(cb => cb(value));
  },

  /**
   * Persist state to localStorage
   */
  persist() {
    try {
      const toSave = { ...this._state };
      // Don't persist logos (too large for localStorage)
      toSave.teamA = { ...toSave.teamA };
      toSave.teamB = { ...toSave.teamB };
      localStorage.setItem('astrotv_state', JSON.stringify(toSave));
    } catch (e) {
      console.warn('State persist error:', e);
    }
  },

  /**
   * Restore state from localStorage
   */
  restore() {
    try {
      const saved = localStorage.getItem('astrotv_state');
      if (saved) {
        const parsed = JSON.parse(saved);
        this._state = { ...this._state, ...parsed };
      }
    } catch (e) {
      console.warn('State restore error:', e);
    }
  }
};

/* ──────────────── App / Router ──────────────── */
const App = {
  /**
   * Initialize the app
   */
  init() {
    // Restore state
    AppState.restore();

    // Auto-sync initial scoreboard overlay data
    if (typeof Scoreboard !== 'undefined' && Scoreboard.syncOverlay) {
      Scoreboard.syncOverlay();
    }

    // Setup router
    window.addEventListener('hashchange', () => App.handleRoute());
    
    // Setup mobile menu
    const menuBtn = document.getElementById('mobile-menu-btn');
    if (menuBtn) {
      menuBtn.addEventListener('click', () => {
        document.getElementById('main-nav').classList.toggle('open');
      });
    }

    // Logo click -> dashboard
    const logo = document.getElementById('logo-home');
    if (logo) {
      logo.addEventListener('click', () => {
        window.location.hash = '#/';
      });
    }

    // Init Auth UI
    if (typeof OperatorAuth !== 'undefined') OperatorAuth.init();

    // Initial route
    App.handleRoute();
  },

  /**
   * Handle route changes
   */
  handleRoute() {
    const hash = window.location.hash.slice(1) || '/';
    const [path, queryString] = hash.split('?');
    const params = new URLSearchParams(queryString || '');

    // Close mobile menu
    document.getElementById('main-nav')?.classList.remove('open');

    // Update active nav
    document.querySelectorAll('.nav-link').forEach(link => {
      const route = link.dataset.route;
      link.classList.toggle('active', route === path);
    });

    // Cleanup previous module
    if (typeof Scoreboard !== 'undefined') Scoreboard.cleanup?.();

    // Route to view
    const container = document.getElementById('app-container');
    
    switch (path) {
      case '/':
        container.innerHTML = App.renderDashboard();
        break;

      case '/setup':
        const module = params.get('module') || '/scoreboard';
        AppState.set('pendingModule', module);
        container.innerHTML = TeamSetup.render(AppState.getAll());
        break;

      case '/scoreboard':
        if (!App.hasTeams()) {
          window.location.hash = '#/setup?module=/scoreboard';
          return;
        }
        container.innerHTML = Scoreboard.render();
        break;

      case '/flyer':
        if (!App.hasTeams()) {
          window.location.hash = '#/setup?module=/flyer';
          return;
        }
        container.innerHTML = Flyer.render();
        break;

      case '/matchday':
        if (!App.hasTeams()) {
          window.location.hash = '#/setup?module=/matchday';
          return;
        }
        container.innerHTML = Matchday.render();
        break;

      case '/lowerthird':
        if (!App.hasTeams()) {
          window.location.hash = '#/setup?module=/lowerthird';
          return;
        }
        container.innerHTML = LowerThird.render();
        break;

      case '/waitscreen':
        if (!App.hasTeams()) {
          window.location.hash = '#/setup?module=/waitscreen';
          return;
        }
        container.innerHTML = WaitScreen.render();
        break;

      case '/builder':
        container.innerHTML = typeof ScoreboardBuilder !== 'undefined' ? ScoreboardBuilder.render() : '';
        break;

      default:
        container.innerHTML = App.renderDashboard();
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  /**
   * Check if teams are configured
   */
  hasTeams() {
    const teamA = AppState.get('teamA');
    const teamB = AppState.get('teamB');
    return teamA.name && teamB.name;
  },

  /**
   * Re-render current route
   */
  renderCurrentRoute() {
    App.handleRoute();
  },

  /**
   * Render Dashboard
   */
  renderDashboard() {
    const teamA = AppState.get('teamA');
    const teamB = AppState.get('teamB');
    const hasConfig = teamA.name && teamB.name;

    return `
      <!-- Hero -->
      <section class="hero">
        <div class="container">
          <div class="hero-badge">
            <span class="dot"></span>
            ESTÚDIO GRÁFICO ESPORTIVO
          </div>
          <h1>
            <span class="text-gradient">ASTRO TV</span>
          </h1>
          <p>Crie mídias gráficas profissionais para transmissões esportivas ao vivo. 
             Placares, flyers, overlays para OBS Studio e muito mais.</p>
          <div class="hero-actions">
            <a href="#/setup?module=/scoreboard" class="btn btn-primary btn-lg">
              🚀 Criar Nova Partida
            </a>
            ${hasConfig ? `
              <a href="#/scoreboard" class="btn btn-secondary btn-lg">
                🏆 Continuar (${teamA.abbr || teamA.name} vs ${teamB.abbr || teamB.name})
              </a>
            ` : ''}
          </div>
        </div>
      </section>

      <!-- Active Match Info -->
      ${hasConfig ? `
        <section class="section" style="padding-top:0;">
          <div class="container">
            <div class="glass-card" style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:var(--sp-4);">
              <div class="flex items-center gap-4">
                <div style="display:flex;align-items:center;gap:var(--sp-3);">
                  <div style="width:36px;height:36px;border-radius:var(--radius-md);background:${teamA.color};display:flex;align-items:center;justify-content:center;">
                    ${teamA.logo ? `<img src="${teamA.logo}" style="width:24px;height:24px;object-fit:contain;">` : `<span style="font-family:var(--font-mono);font-weight:800;font-size:10px;color:white;">${teamA.abbr || '?'}</span>`}
                  </div>
                  <span style="font-weight:600;">${teamA.name}</span>
                </div>
                <span class="text-muted" style="font-weight:700;">VS</span>
                <div style="display:flex;align-items:center;gap:var(--sp-3);">
                  <div style="width:36px;height:36px;border-radius:var(--radius-md);background:${teamB.color};display:flex;align-items:center;justify-content:center;">
                    ${teamB.logo ? `<img src="${teamB.logo}" style="width:24px;height:24px;object-fit:contain;">` : `<span style="font-family:var(--font-mono);font-weight:800;font-size:10px;color:white;">${teamB.abbr || '?'}</span>`}
                  </div>
                  <span style="font-weight:600;">${teamB.name}</span>
                </div>
              </div>
              <div class="flex gap-2">
                <span class="badge badge-secondary">${TeamSetup.getSportName(AppState.get('sport'))}</span>
                <a href="#/setup?module=/scoreboard" class="btn btn-ghost btn-sm">✏️ Editar</a>
              </div>
            </div>
          </div>
        </section>
      ` : ''}

      <!-- Modules Grid -->
      <section class="section" style="padding-top: ${hasConfig ? '0' : 'var(--sp-4)'};">
        <div class="container">
          <div class="section-header">
            <h2>📦 Módulos</h2>
            <p>Escolha o tipo de mídia que deseja criar</p>
          </div>

          <div class="modules-grid">
            <!-- Placar ao Vivo -->
            <div class="module-card animate-fade-in-up stagger-1" onclick="location.hash='#/${hasConfig ? 'scoreboard' : 'setup?module=/scoreboard'}'">
              <div class="module-card-icon purple">🏆</div>
              <div class="module-card-badge">OVERLAY</div>
              <h3>Placar ao Vivo</h3>
              <p>Scoreboard em tempo real para OBS Studio. 3 estilos de template com controle de pontuação, sets, faltas e cronômetro.</p>
              <div class="module-card-arrow">→</div>
            </div>

            <!-- Flyer -->
            <div class="module-card animate-fade-in-up stagger-2" onclick="location.hash='#/${hasConfig ? 'flyer' : 'setup?module=/flyer'}'">
              <div class="module-card-icon cyan">📣</div>
              <div class="module-card-badge">IMAGEM</div>
              <h3>Flyer de Divulgação</h3>
              <p>Artes de divulgação para redes sociais. Formatos feed (1:1) e stories (9:16) com dados da partida.</p>
              <div class="module-card-arrow">→</div>
            </div>

            <!-- Dia de Jogo -->
            <div class="module-card animate-fade-in-up stagger-3" onclick="location.hash='#/${hasConfig ? 'matchday' : 'setup?module=/matchday'}'">
              <div class="module-card-icon pink">📅</div>
              <div class="module-card-badge">IMAGEM</div>
              <h3>Dia de Jogo</h3>
              <p>Arte de impacto "É HOJE!" para anunciar jogos. Visual dinâmico com dados dos times.</p>
              <div class="module-card-arrow">→</div>
            </div>

            <!-- Lower Third -->
            <div class="module-card animate-fade-in-up stagger-4" onclick="location.hash='#/${hasConfig ? 'lowerthird' : 'setup?module=/lowerthird'}'">
              <div class="module-card-icon orange">📺</div>
              <div class="module-card-badge">OVERLAY</div>
              <h3>Lower Third</h3>
              <p>Barra inferior de informação para overlay. Exiba jogador, time ou info livre durante a transmissão.</p>
              <div class="module-card-arrow">→</div>
            </div>

            <!-- Tela de Espera -->
            <div class="module-card animate-fade-in-up stagger-5" onclick="location.hash='#/${hasConfig ? 'waitscreen' : 'setup?module=/waitscreen'}'">
              <div class="module-card-icon purple">⏳</div>
              <div class="module-card-badge">OVERLAY</div>
              <h3>Tela de Espera</h3>
              <p>Telas de "Em Breve", "Intervalo" e "Fim de Jogo" para usar durante a transmissão.</p>
              <div class="module-card-arrow">→</div>
            </div>

            <!-- Criador de Placar por Imagem -->
            <div class="module-card animate-fade-in-up" onclick="location.hash='#/builder'">
              <div class="module-card-icon cyan">🎨</div>
              <div class="module-card-badge">STUDIO</div>
              <h3>Criador de Placar</h3>
              <p>Crie seu próprio placar usando qualquer imagem de modelo (Copa do Mundo, Champions League, etc.).</p>
              <div class="module-card-arrow">→</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="app-footer">
        <div class="container">
          <p>
            <span class="footer-logo">ASTRO TV</span>
            <br>
            <span style="margin-top:var(--sp-2);display:inline-block;">
              Estúdio gráfico esportivo para transmissões ao vivo
            </span>
          </p>
        </div>
      </footer>
    `;
  },

  /* ──────────────── Toast System ──────────────── */

  /**
   * Show a toast notification
   * @param {string} message - Message text
   * @param {string} type - 'success' | 'error' | 'warning' | 'info'
   * @param {number} duration - Duration in ms
   */
  showToast(message, type = 'info', duration = 3500) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    };

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <span class="toast-icon">${icons[type] || 'ℹ️'}</span>
      <span class="toast-message">${message}</span>
      <span class="toast-close" onclick="this.parentElement.remove()">✕</span>
    `;

    container.appendChild(toast);

    // Auto remove
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  },

  /* ──────────────── Modal System ──────────────── */

  /**
   * Show a modal dialog
   * @param {string} title - Modal title
   * @param {string} content - HTML content
   */
  showModal(title, content) {
    // Remove existing modal
    App.closeModal();

    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop active';
    backdrop.id = 'app-modal-backdrop';
    backdrop.innerHTML = `
      <div class="modal">
        <div class="modal-header">
          <h3>${title}</h3>
          <button class="btn btn-icon btn-ghost" onclick="App.closeModal()">✕</button>
        </div>
        <div class="modal-body">
          ${content}
        </div>
      </div>
    `;

    // Close on backdrop click
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) App.closeModal();
    });

    document.body.appendChild(backdrop);
  },

  /**
   * Close the active modal
   */
  closeModal() {
    const modal = document.getElementById('app-modal-backdrop');
    if (modal) {
      modal.classList.remove('active');
      setTimeout(() => modal.remove(), 300);
    }
  },

  /**
   * Exporta todo o estado do app e dados salvos em um arquivo JSON
   */
  exportBackup() {
    const backupData = {
      appState: AppState.getAll(),
      savedTeams: JSON.parse(localStorage.getItem('astrotv_saved_teams') || '[]'),
      customTemplates: JSON.parse(localStorage.getItem('astrotv_custom_templates') || '[]'),
      exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `astrotv_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    App.showToast('Backup do ASTRO TV baixado com sucesso! 💾', 'success');
  },

  /**
   * Importa um arquivo JSON de backup
   */
  importBackup(input) {
    const file = input.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (data.appState) {
          AppState.state = { ...AppState.state, ...data.appState };
          AppState.save();
        }
        if (data.savedTeams) {
          localStorage.setItem('astrotv_saved_teams', JSON.stringify(data.savedTeams));
        }
        if (data.customTemplates) {
          localStorage.setItem('astrotv_custom_templates', JSON.stringify(data.customTemplates));
        }
        App.showToast('Backup do ASTRO TV restaurado com sucesso! 🎉', 'success');
        setTimeout(() => window.location.reload(), 1000);
      } catch (err) {
        App.showToast('Erro ao importar arquivo de backup', 'error');
      }
    };
    reader.readAsText(file);
  },

  /**
   * Reset all cached data and restore clean state
   */
  resetAllData() {
    if (confirm('Deseja limpar todo o cache e dados salvos do ASTRO TV?')) {
      localStorage.clear();
      App.showToast('Dados limpos com sucesso!', 'info');
      setTimeout(() => {
        window.location.hash = '#/';
        window.location.reload();
      }, 500);
    }
  }
};

/* ──────────────── Initialize ──────────────── */
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
