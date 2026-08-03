/* ============================================================
   ASTRO TV — Operator Auth Module
   Sistema de Login, Registro e Proteção de Operador da Transmissão
   ============================================================ */

const OperatorAuth = {
  currentUser: null,

  init() {
    if (typeof FirebaseConfig !== 'undefined' && FirebaseConfig.auth) {
      FirebaseConfig.auth.onAuthStateChanged((user) => {
        OperatorAuth.currentUser = user;
        OperatorAuth.updateHeaderUI();
      });
    }
  },

  /**
   * Atualiza os botões e badges de login no topo da página
   */
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

  /**
   * Modal de Login do Operador
   */
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
          <a href="javascript:void(0)" onclick="OperatorAuth.loginAsDemo()" style="color:var(--text-muted);font-size:12px;">Entrar como Convidado Demo</a>
        </div>
      </form>
    `);
  },

  /**
   * Modal de Registro de Novo Operador
   */
  showRegisterModal() {
    App.showModal('📝 Registrar Novo Operador', `
      <p style="margin-bottom: var(--sp-4); color: var(--text-secondary); font-size: var(--fs-sm);">
        Crie sua conta para proteger suas transmissões esportivas.
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

    try {
      if (FirebaseConfig.auth) {
        await FirebaseConfig.auth.signInWithEmailAndPassword(email, password);
        App.closeModal();
        App.showToast('Login de operador realizado com sucesso! 🔐', 'success');
      } else {
        OperatorAuth.loginAsDemo();
      }
    } catch (err) {
      App.showToast('Erro no login: ' + (err.message || 'Credenciais inválidas'), 'error');
    }
  },

  async handleRegister(e) {
    e.preventDefault();
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;

    try {
      if (FirebaseConfig.auth) {
        await FirebaseConfig.auth.createUserWithEmailAndPassword(email, password);
        App.closeModal();
        App.showToast('Conta de operador criada com sucesso! 🎉', 'success');
      } else {
        OperatorAuth.loginAsDemo();
      }
    } catch (err) {
      App.showToast('Erro no registro: ' + (err.message || 'Verifique os dados'), 'error');
    }
  },

  loginAsDemo() {
    OperatorAuth.currentUser = { email: 'demo@astrotv.com', uid: 'demo_operator' };
    OperatorAuth.updateHeaderUI();
    App.closeModal();
    App.showToast('Acessando como Operador Demo! 🔐', 'info');
  },

  logout() {
    if (FirebaseConfig.auth) {
      FirebaseConfig.auth.signOut().catch(() => {});
    }
    OperatorAuth.currentUser = null;
    OperatorAuth.updateHeaderUI();
    App.showToast('Sessão encerrada.', 'info');
  },

  /**
   * Verifica se o usuário atual tem permissão de operador
   */
  isAuthenticated() {
    return !!OperatorAuth.currentUser;
  }
};
