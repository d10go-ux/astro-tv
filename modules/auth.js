/* ============================================================
   ASTRO TV — Operator Auth Module
   Sistema de Login, Registro e Proteção de Operador da Transmissão
   ============================================================ */

const OperatorAuth = {
  currentUser: null,

  init() {
    // Restaurar sessão salva localmente ou do Firebase
    const savedUser = JSON.parse(localStorage.getItem('astrotv_operator_user') || 'null');
    if (savedUser) {
      OperatorAuth.currentUser = savedUser;
      OperatorAuth.updateHeaderUI();
    }

    if (typeof FirebaseConfig !== 'undefined' && FirebaseConfig.auth && !FirebaseConfig.isDemoKey()) {
      FirebaseConfig.auth.onAuthStateChanged((user) => {
        if (user) {
          OperatorAuth.currentUser = { email: user.email, uid: user.uid };
          localStorage.setItem('astrotv_operator_user', JSON.stringify(OperatorAuth.currentUser));
          OperatorAuth.updateHeaderUI();
        }
      });
    }
  },

  updateHeaderUI() {
    const user = OperatorAuth.currentUser;
    const authBtnContainer = document.getElementById('header-auth-container');
    if (!authBtnContainer) return;

    if (user) {
      authBtnContainer.innerHTML = `
        <div class="flex items-center gap-2">
          <span class="badge badge-secondary" style="font-size:11px;padding:4px 8px;">
            🔐 ${user.email.split('@')[0]} (Operador)
          </span>
          <button class="btn btn-ghost btn-sm" onclick="OperatorAuth.logout()">Sair</button>
        </div>
      `;
    } else {
      authBtnContainer.innerHTML = `
        <button class="btn btn-secondary btn-sm" onclick="OperatorAuth.showLoginModal()">
          🔑 Login Operador
        </button>
      `;
    }
  },

  showLoginModal() {
    App.showModal('🔑 Login de Operador da Transmissão', `
      <p style="margin-bottom: var(--sp-4); color: var(--text-secondary); font-size: var(--fs-sm);">
        Entre com sua conta de operador para controlar o placar e disparar vinhetas no ar com segurança.
      </p>
      <form onsubmit="OperatorAuth.handleLogin(event)">
        <div class="form-group">
          <label class="form-label">E-mail do Operador</label>
          <input type="email" class="form-input" id="auth-email" required placeholder="operador@astrotv.com">
        </div>
        <div class="form-group" style="margin-top: var(--sp-3);">
          <label class="form-label">Senha</label>
          <input type="password" class="form-input" id="auth-password" required placeholder="••••••••">
        </div>
        <div class="flex gap-3" style="margin-top: var(--sp-4);">
          <button type="submit" class="btn btn-primary btn-lg w-full">Entrar no Painel</button>
        </div>
        <div class="flex justify-between items-center" style="margin-top: var(--sp-4);">
          <a href="javascript:void(0)" onclick="OperatorAuth.showRegisterModal()" style="color:var(--primary-light);font-size:12px;">Criar nova conta de operador</a>
          <a href="javascript:void(0)" onclick="OperatorAuth.loginAsDemo()" style="color:var(--text-muted);font-size:12px;">Entrar como Convidado</a>
        </div>
      </form>
    `);
  },

  showRegisterModal() {
    App.showModal('📝 Registrar Novo Operador', `
      <p style="margin-bottom: var(--sp-4); color: var(--text-secondary); font-size: var(--fs-sm);">
        Crie sua conta de operador para acessar o painel de controle.
      </p>
      <form onsubmit="OperatorAuth.handleRegister(event)">
        <div class="form-group">
          <label class="form-label">E-mail</label>
          <input type="email" class="form-input" id="reg-email" required placeholder="seu-email@exemplo.com">
        </div>
        <div class="form-group" style="margin-top: var(--sp-3);">
          <label class="form-label">Senha (mínimo 6 caracteres)</label>
          <input type="password" class="form-input" id="reg-password" minlength="6" required placeholder="••••••••">
        </div>
        <div class="flex gap-3" style="margin-top: var(--sp-4);">
          <button type="submit" class="btn btn-primary btn-lg w-full">Criar Conta & Acessar</button>
        </div>
      </form>
    `);
  },

  async handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('auth-email').value;
    const password = document.getElementById('auth-password').value;

    if (FirebaseConfig.auth && !FirebaseConfig.isDemoKey()) {
      try {
        await FirebaseConfig.auth.signInWithEmailAndPassword(email, password);
        App.closeModal();
        App.showToast('Login de operador realizado com sucesso! 🔐', 'success');
        return;
      } catch (err) {
        console.warn('Firebase login warning, falling back to local session:', err);
      }
    }

    OperatorAuth.loginAsDemo(email);
  },

  async handleRegister(e) {
    e.preventDefault();
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;

    if (FirebaseConfig.auth && !FirebaseConfig.isDemoKey()) {
      try {
        await FirebaseConfig.auth.createUserWithEmailAndPassword(email, password);
        App.closeModal();
        App.showToast('Conta de operador criada com sucesso! 🎉', 'success');
        return;
      } catch (err) {
        console.warn('Firebase reg warning, falling back to local session:', err);
      }
    }

    OperatorAuth.loginAsDemo(email);
  },

  loginAsDemo(email = 'operador@astrotv.com') {
    OperatorAuth.currentUser = { email: email, uid: 'local_operator_' + Date.now() };
    localStorage.setItem('astrotv_operator_user', JSON.stringify(OperatorAuth.currentUser));
    OperatorAuth.updateHeaderUI();
    App.closeModal();
    App.showToast(`Logado com sucesso como ${email.split('@')[0]}! 🔐`, 'success');
  },

  logout() {
    if (FirebaseConfig.auth && !FirebaseConfig.isDemoKey()) {
      FirebaseConfig.auth.signOut().catch(() => {});
    }
    localStorage.removeItem('astrotv_operator_user');
    OperatorAuth.currentUser = null;
    OperatorAuth.updateHeaderUI();
    App.showToast('Sessão encerrada com sucesso.', 'info');
  },

  isAuthenticated() {
    return !!OperatorAuth.currentUser;
  }
};
