/* ================================================================
   XTREME MOBILE INC. - AUTH JAVASCRIPT
   ================================================================ */

var XMI_STORAGE = window.XMI_STORAGE || (() => {
  function readWindowNameStore() {
    try {
      const raw = window.name || '';
      if (!raw.startsWith('XMI_STORE=')) return {};
      const parsed = JSON.parse(raw.slice('XMI_STORE='.length));
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch {
      return {};
    }
  }

  function writeWindowNameStore(store) {
    window.name = `XMI_STORE=${JSON.stringify(store)}`;
  }

  function canUseLocalStorage() {
    try {
      const key = '__xmi_storage_test__';
      window.localStorage.setItem(key, '1');
      window.localStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  }

  const useLocalStorage = canUseLocalStorage();

  return window.XMI_STORAGE = {
    getItem(key) {
      if (useLocalStorage) return window.localStorage.getItem(key);
      const store = readWindowNameStore();
      return key in store ? store[key] : null;
    },
    setItem(key, value) {
      if (useLocalStorage) window.localStorage.setItem(key, value);
      else {
        const store = readWindowNameStore();
        store[key] = String(value);
        writeWindowNameStore(store);
      }
    },
    removeItem(key) {
      if (useLocalStorage) window.localStorage.removeItem(key);
      else {
        const store = readWindowNameStore();
        delete store[key];
        writeWindowNameStore(store);
      }
    }
  };
})();

const AUTH = {
  STORAGE_KEY: 'xmi_auth',
  SESSION_KEY: 'xmi_session',

  // Default users (in production use backend auth)
  USERS: [
    { id: 1, username: 'admin', password: 'XMI2026@Admin', name: 'Administrador Principal', role: 'superadmin', active: true, email: 'XMM90202@claropr.com' },
    { id: 2, username: 'gerente', password: 'Gerente2026!', name: 'Gerente de Tienda', role: 'admin', active: true, email: 'gerente@xmi.com' },
    { id: 3, username: 'empleado1', password: 'Emp2026!', name: 'Empleado 1', role: 'employee', active: true, email: 'emp1@xmi.com' }
  ],

  readJSON(key, fallback) {
    try {
      const raw = XMI_STORAGE.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      try { XMI_STORAGE.removeItem(key); } catch {}
      return fallback;
    }
  },

  writeJSON(key, value) {
    XMI_STORAGE.setItem(key, JSON.stringify(value));
  },

  getUsers() {
    const users = this.readJSON('xmi_users', this.USERS);
    return Array.isArray(users) ? users : [...this.USERS];
  },
  saveUsers(users) { this.writeJSON('xmi_users', users); },

  login(username, password) {
    const users = this.getUsers();
    if (!Array.isArray(users)) return { success: false, message: 'No se pudo validar la base de usuarios.' };
    const user = users.find(u => u.username === username && u.password === password && u.active);
    if (!user) return { success: false, message: 'Usuario o contraseña incorrectos.' };
    const session = { ...user, loginTime: Date.now(), expires: Date.now() + 8 * 60 * 60 * 1000 };
    delete session.password;
    this.writeJSON(this.SESSION_KEY, session);
    this.logActivity('login', `Inicio de sesión: ${username}`);
    return { success: true, user: session };
  },

  logout() {
    const session = this.getSession();
    if (session) this.logActivity('logout', `Cierre de sesión: ${session.username}`);
    try { XMI_STORAGE.removeItem(this.SESSION_KEY); } catch {}
    window.location.href = 'login.html';
  },

  getSession() {
    const session = this.readJSON(this.SESSION_KEY, null);
    if (!session || typeof session !== 'object') return null;
    if (Date.now() > session.expires) {
      try { XMI_STORAGE.removeItem(this.SESSION_KEY); } catch {}
      return null;
    }
    return session;
  },

  requireAuth() {
    const session = this.getSession();
    if (!session) { window.location.href = 'login.html'; return null; }
    return session;
  },

  hasPermission(action) {
    const session = this.getSession();
    if (!session) return false;
    const perms = {
      superadmin: ['all'],
      admin: ['requests', 'inventory', 'sales', 'reviews', 'offers', 'employees_view'],
      employee: ['sales', 'inventory_view'],
      readonly: ['view']
    };
    const userPerms = perms[session.role] || [];
    return userPerms.includes('all') || userPerms.includes(action);
  },

  logActivity(type, description) {
    let logs = this.readJSON('xmi_logs', []);
    if (!Array.isArray(logs)) logs = [];
    const session = this.getSession();
    logs.unshift({
      id: Date.now(), type, description,
      user: session?.name || 'Sistema',
      timestamp: new Date().toISOString()
    });
    // Keep last 500 logs
    if (logs.length > 500) logs.pop();
    this.writeJSON('xmi_logs', logs);
  }
};

// ── Login Page Logic ────────────────────────────────────────────
if (document.getElementById('login-form')) {
  const session = AUTH.getSession();
  if (session) window.location.href = 'admin.html';

  const form = document.getElementById('login-form');
  const userInput = document.getElementById('login-user');
  const passInput = document.getElementById('login-pass');
  const passToggle = document.getElementById('pass-toggle');
  const loginBtn = document.getElementById('login-btn');
  const errorMsg = document.getElementById('login-error');

  passToggle?.addEventListener('click', () => {
    const show = passInput.type === 'password';
    passInput.type = show ? 'text' : 'password';
    passToggle.className = `fas fi-pass-toggle ${show ? 'fa-eye-slash' : 'fa-eye'}`;
  });

  form?.addEventListener('submit', async e => {
    e.preventDefault();
    const username = userInput.value.trim();
    const password = passInput.value;

    if (!username || !password) {
      showError('Por favor ingresa usuario y contraseña.');
      return;
    }

    loginBtn.disabled = true;
    loginBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Verificando...';

    try {
      await new Promise(r => setTimeout(r, 800));

      const result = AUTH.login(username, password);
      if (result.success) {
        loginBtn.innerHTML = '<i class="fas fa-check"></i> Acceso concedido';
        loginBtn.style.background = 'linear-gradient(135deg, #00C851, #00A044)';
        setTimeout(() => window.location.href = 'admin.html', 800);
      } else {
        resetLoginButton();
        showError(result.message);
      }
    } catch (error) {
      console.error('Login error:', error);
      resetLoginButton();
      showError('Ocurrió un error al iniciar sesión. Intenta nuevamente.');
    }
  });

  function showError(msg) {
    if (errorMsg) {
      errorMsg.textContent = msg;
      errorMsg.style.display = 'block';
      setTimeout(() => errorMsg.style.display = 'none', 4000);
    }
  }

  function resetLoginButton() {
    loginBtn.disabled = false;
    loginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Iniciar sesión';
    loginBtn.style.background = '';
  }

  // Forgot password
  document.getElementById('forgot-pw')?.addEventListener('click', () => {
    alert('Para recuperar tu contraseña, contacta al administrador principal.\n\nCorreo: XMM90202@claropr.com\nTeléfono: 787-205-2220');
  });
}
