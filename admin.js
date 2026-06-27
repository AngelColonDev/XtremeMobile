/* ================================================================
   XTREME MOBILE INC. - ADMIN JAVASCRIPT (Complete Panel)
   ================================================================ */

// ── Shared Data Models ──────────────────────────────────────────
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

const DB = {
  get(key, def = []) { try { return JSON.parse(XMI_STORAGE.getItem(`xmi_${key}`) || JSON.stringify(def)); } catch { return def; } },
  set(key, val) { XMI_STORAGE.setItem(`xmi_${key}`, JSON.stringify(val)); },
  nextId(key) { const items = this.get(key); return (items.reduce((m, i) => Math.max(m, i.id || 0), 0) + 1); }
};

// Sample Data Initializers
function initSampleData() {
  if (!XMI_STORAGE.getItem('xmi_data_init')) {
    // Inventory
    DB.set('inventory', [
      { id: 1, name: 'Samsung Galaxy A15', category: 'Celulares', brand: 'Samsung', model: 'Galaxy A15', color: 'Negro', qty: 5, buyPrice: 89.99, sellPrice: 149.99, supplier: 'Claro PR', emoji: '📱', status: 'available', entryDate: '2026-05-01' },
      { id: 2, name: 'Cover iPhone 15 Pro', category: 'Covers', brand: 'Genérico', model: 'iPhone 15 Pro', color: 'Transparente', qty: 15, buyPrice: 3.50, sellPrice: 9.99, supplier: 'Miami Wholesale', emoji: '🛡️', status: 'available', entryDate: '2026-05-10' },
      { id: 3, name: 'Protector Pantalla', category: 'Protectores', brand: 'Glass Pro', model: 'Universal', color: 'Transparente', qty: 3, buyPrice: 1.50, sellPrice: 4.99, supplier: 'Miami Wholesale', emoji: '🪟', status: 'low', entryDate: '2026-05-10' },
      { id: 4, name: 'Cargador USB-C 25W', category: 'Cargadores', brand: 'Samsung', model: 'Universal', color: 'Negro', qty: 8, buyPrice: 8.00, sellPrice: 19.99, supplier: 'Claro PR', emoji: '🔌', status: 'available', entryDate: '2026-05-12' },
      { id: 5, name: 'Audífonos Bluetooth', category: 'Audífonos', brand: 'JBL', model: 'Tune 510BT', color: 'Azul', qty: 0, buyPrice: 20.00, sellPrice: 39.99, supplier: 'JBL Distribuidora', emoji: '🎧', status: 'out', entryDate: '2026-04-20' }
    ]);

    // Sales
    DB.set('sales', [
      { id: 1, product: 'Cargador USB-C 25W', qty: 2, price: 39.98, method: 'cash', date: '2026-05-28', employee: 'Empleado 1', customer: 'Cliente general', notes: '' },
      { id: 2, product: 'Cover iPhone 15 Pro', qty: 3, price: 29.97, method: 'ath', date: '2026-05-28', employee: 'Empleado 1', customer: 'María González', notes: '' },
      { id: 3, product: 'Protector Pantalla', qty: 1, price: 4.99, method: 'cash', date: '2026-05-27', employee: 'Gerente de Tienda', customer: 'Cliente general', notes: '' },
      { id: 4, product: 'Samsung Galaxy A15', qty: 1, price: 149.99, method: 'card', date: '2026-05-26', employee: 'Gerente de Tienda', customer: 'Carlos Rivera', notes: 'Incluye setup' },
      { id: 5, product: 'Audífonos Bluetooth', qty: 1, price: 39.99, method: 'ath', date: '2026-05-25', employee: 'Empleado 1', customer: 'Ana Rodríguez', notes: '' }
    ]);

    // Suppliers
    DB.set('suppliers', [
      { id: 1, name: 'Claro Puerto Rico', contact: 'Ventas Claro', phone: '787-793-7878', email: 'ventas@claro.pr', address: 'San Juan, PR', products: 'Celulares, Accesorios Claro', notes: '', regDate: '2026-01-01' },
      { id: 2, name: 'Miami Wholesale Electronics', contact: 'Juan Pérez', phone: '305-555-0100', email: 'orders@miamiwhol.com', address: 'Miami, FL', products: 'Covers, Protectores, Cables', notes: 'Pedido mínimo $200', regDate: '2026-01-15' },
      { id: 3, name: 'JBL Distribuidora PR', contact: 'Pedro Soto', phone: '787-555-0200', email: 'pedro@jblpr.com', address: 'Bayamón, PR', products: 'Audífonos, Bocinas', notes: '', regDate: '2026-02-01' }
    ]);

    // Employees / Users
    DB.set('employees', [
      { id: 1, name: 'Administrador Principal', position: 'Dueña / Administradora', phone: '787-205-2220', email: 'XMM90202@claropr.com', username: 'admin', role: 'superadmin', active: true, hireDate: '2024-01-01' },
      { id: 2, name: 'Gerente de Tienda', position: 'Gerente', phone: '787-555-0001', email: 'gerente@xmi.com', username: 'gerente', role: 'admin', active: true, hireDate: '2024-06-01' },
      { id: 3, name: 'Empleado 1', position: 'Vendedor', phone: '787-555-0002', email: 'emp1@xmi.com', username: 'empleado1', role: 'employee', active: true, hireDate: '2025-01-15' }
    ]);

    // Schedules
    DB.set('schedules', [
      { id: 1, empId: 3, empName: 'Empleado 1', date: '2026-05-26', dayLabel: 'Lunes', start: '09:00', end: '17:00', breakTime: '1 hora', notes: '' },
      { id: 2, empId: 3, empName: 'Empleado 1', date: '2026-05-27', dayLabel: 'Martes', start: '09:00', end: '17:00', breakTime: '1 hora', notes: '' },
      { id: 3, empId: 2, empName: 'Gerente de Tienda', date: '2026-05-26', dayLabel: 'Lunes', start: '08:00', end: '16:00', breakTime: '30 min', notes: 'Inventario' },
      { id: 4, empId: 2, empName: 'Gerente de Tienda', date: '2026-05-28', dayLabel: 'Miércoles', start: '08:00', end: '16:00', breakTime: '30 min', notes: '' }
    ]);

    // Offers
    DB.set('offers', [
      { id: 1, title: 'Teléfono Gratis Lifeline', description: 'Califica para recibir un smartphone completamente gratis.', price: 'GRATIS', expiry: '2026-12-31', emoji: '📱', tag: 'PROGRAMA FEDERAL', active: true, startDate: '2026-01-01' },
      { id: 2, title: 'Paquete Accesorios Plus', description: 'Cover + Protector + Cargador por solo $24.99.', price: '$24.99', expiry: '2026-06-30', emoji: '🛡️', tag: 'OFERTA ESPECIAL', active: true, startDate: '2026-05-01' },
      { id: 3, title: 'Audífonos Bluetooth', description: 'Audífonos inalámbricos de alta calidad.', price: '$29.99', expiry: '2026-06-15', emoji: '🎧', tag: 'NUEVO', active: true, startDate: '2026-05-15' }
    ]);

    // Config
    DB.set('config', {
      businessName: 'Xtreme Mobile Inc.',
      phone: '787-205-2220',
      whatsapp: '787-205-2220',
      email: 'XMM90202@claropr.com',
      address: 'Plaza San Cristóbal, Barranquitas, Puerto Rico',
      instagram: 'https://www.instagram.com/xtremem0bile',
      facebook: 'https://www.facebook.com/share/1HbDgezvSr/',
      about: 'En Xtreme Mobile Inc. trabajamos para ofrecer soluciones móviles confiables, accesibles y rápidas. Nuestro compromiso es ayudar a cada cliente a encontrar el producto o servicio que mejor se adapte a sus necesidades, brindando atención profesional y personalizada.'
    });

    XMI_STORAGE.setItem('xmi_data_init', '1');
  }

  // Ensure reviews and requests have samples
  if (!XMI_STORAGE.getItem('xmi_reviews')) {
    DB.set('reviews', [
      { id: 1, name: 'María González', rating: 5, comment: 'Excelente servicio, me ayudaron a conseguir mi teléfono gratis sin complicaciones.', date: '2026-05-15', status: 'approved' },
      { id: 2, name: 'Carlos Rivera', rating: 5, comment: 'Los mejores en accesorios para celulares en Barranquitas.', date: '2026-05-18', status: 'approved' },
      { id: 3, name: 'Ana Rodríguez', rating: 4, comment: 'Muy buena atención al cliente. Recomendado.', date: '2026-05-20', status: 'approved' },
      { id: 4, name: 'Pedro Maldonado', rating: 5, comment: 'Proceso de solicitud muy fácil. En espera de aprobación.', date: '2026-05-29', status: 'pending' }
    ]);
  }

  if (!XMI_STORAGE.getItem('xmi_requests')) {
    DB.set('requests', [
      { id: 'XMI-2026-0001', status: 'approved', date: '2026-05-20T10:30:00', applicant: { first: 'Luis', last: 'Soto', phone: '787-555-0101', dob: '1985-03-14', ssn_masked: '***-**-1234', serviceDate: '2026-05-20' }, notes: 'Solicitud procesada exitosamente.', internalNotes: ['2026-05-21: Documentos verificados', '2026-05-22: Aprobado por sistema Lifeline'] },
      { id: 'XMI-2026-0002', status: 'review', date: '2026-05-25T14:00:00', applicant: { first: 'Rosa', last: 'Vega', phone: '787-555-0102', dob: '1992-07-22', ssn_masked: '***-**-5678', serviceDate: '2026-05-25' }, notes: '', internalNotes: ['2026-05-26: En revisión con Claro'] },
      { id: 'XMI-2026-0003', status: 'docs_pending', date: '2026-05-28T09:15:00', applicant: { first: 'José', last: 'Ortiz', phone: '787-555-0103', dob: '1978-11-05', ssn_masked: '***-**-9012', serviceDate: '2026-05-28' }, notes: 'Falta foto de identificación vigente.', internalNotes: [] }
    ]);
  }
}

// ── Utility ──────────────────────────────────────────────────────
const $a = (sel, ctx = document) => ctx.querySelector(sel);
const $$a = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

function adminToast(msg, type = 'info') {
  const icons = { success: 'fa-check-circle', error: 'fa-exclamation-circle', info: 'fa-info-circle' };
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.innerHTML = `<i class="fas ${icons[type]}"></i><span>${msg}</span>`;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 4200);
}

function escHtml(str) {
  return String(str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function formatDate(str) {
  if (!str) return '-';
  try { return new Date(str.includes('T') ? str : str + 'T12:00:00').toLocaleDateString('es-PR', { year: 'numeric', month: 'short', day: 'numeric' }); } catch { return str; }
}

function formatCurrency(n) {
  return `$${parseFloat(n || 0).toFixed(2)}`;
}

function confirm2(title, msg, cb) {
  const div = document.createElement('div');
  div.className = 'confirm-overlay';
  div.innerHTML = `
    <div class="confirm-box">
      <div class="confirm-icon">⚠️</div>
      <h4>${title}</h4>
      <p>${msg}</p>
      <div class="confirm-btns">
        <button class="btn btn-secondary" id="conf-cancel">Cancelar</button>
        <button class="btn btn-danger" id="conf-ok">Confirmar</button>
      </div>
    </div>`;
  document.body.appendChild(div);
  $a('#conf-cancel', div).addEventListener('click', () => div.remove());
  $a('#conf-ok', div).addEventListener('click', () => { div.remove(); cb(); });
}

// ── Admin App ────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Require auth
  if (!document.getElementById('login-form')) {
    const session = AUTH.requireAuth();
    if (!session) return;
    initAdminApp(session);
  }
});

function initAdminApp(session) {
  initSampleData();

  // Set user info in sidebar
  const sidebarUser = document.getElementById('sidebar-user-name');
  const sidebarRole = document.getElementById('sidebar-user-role');
  const topbarUser = document.getElementById('topbar-user');
  if (sidebarUser) sidebarUser.textContent = session.name;
  if (sidebarRole) sidebarRole.textContent = session.role === 'superadmin' ? 'Super Admin' : session.role === 'admin' ? 'Administrador' : 'Empleado';
  if (topbarUser) topbarUser.textContent = session.name;

  // Sidebar toggle
  const sidebar = document.getElementById('sidebar');
  const mainContent = document.getElementById('main-content');
  const toggleSidebar = () => {
    if (window.innerWidth <= 1024) {
      sidebar.classList.toggle('mobile-open');
    } else {
      sidebar.classList.toggle('collapsed');
      mainContent.classList.toggle('expanded');
    }
  };
  document.getElementById('sidebar-toggle')?.addEventListener('click', toggleSidebar);
  document.getElementById('mobile-menu-toggle')?.addEventListener('click', toggleSidebar);

  // Navigation
  $$a('.nav-item[data-page]').forEach(item => {
    item.addEventListener('click', () => {
      const page = item.dataset.page;
      navigateTo(page, item.dataset.title || page);
      if (window.innerWidth <= 1024) sidebar.classList.remove('mobile-open');
    });
  });

  // Logout
  document.getElementById('logout-btn')?.addEventListener('click', () => {
    confirm2('Cerrar Sesión', '¿Estás seguro que deseas cerrar sesión?', () => AUTH.logout());
  });

  // Load dashboard by default
  navigateTo('dashboard', 'Dashboard');
  updateBadges();
}

// ── Navigation ────────────────────────────────────────────────────
function navigateTo(page, title = '') {
  $$a('.nav-item').forEach(i => i.classList.remove('active'));
  const activeNav = $a(`.nav-item[data-page="${page}"]`);
  if (activeNav) activeNav.classList.add('active');

  const titleEl = document.getElementById('page-title');
  if (titleEl) titleEl.textContent = title;

  const content = document.getElementById('page-content');
  if (!content) return;

  const pages = { dashboard: renderDashboard, requests: renderRequests, inventory: renderInventory, sales: renderSales, stats: renderStats, suppliers: renderSuppliers, employees: renderEmployees, schedules: renderSchedules, offers: renderOffers, reviews: renderReviews, config: renderConfig, logs: renderLogs };

  if (pages[page]) {
    content.innerHTML = '';
    pages[page](content);
  }
}

function updateBadges() {
  const pendingReqs = DB.get('requests').filter(r => r.status === 'received' || r.status === 'review').length;
  const pendingReviews = DB.get('reviews').filter(r => r.status === 'pending').length;
  const lowInv = DB.get('inventory').filter(i => i.status === 'low' || i.status === 'out').length;

  const reqBadge = $a('[data-page="requests"] .nav-badge');
  const revBadge = $a('[data-page="reviews"] .nav-badge');
  const invBadge = $a('[data-page="inventory"] .nav-badge');

  if (reqBadge) reqBadge.textContent = pendingReqs || '';
  if (revBadge) revBadge.textContent = pendingReviews || '';
  if (invBadge) invBadge.textContent = lowInv || '';
}

// ── Dashboard ────────────────────────────────────────────────────
function renderDashboard(container) {
  const requests = DB.get('requests');
  const sales = DB.get('sales');
  const inventory = DB.get('inventory');
  const reviews = DB.get('reviews');
  const offers = DB.get('offers');
  const suppliers = DB.get('suppliers');

  const today = new Date().toISOString().split('T')[0];
  const todaySales = sales.filter(s => s.date === today);
  const todayRevenue = todaySales.reduce((sum, s) => sum + parseFloat(s.price || 0), 0);

  const weekStart = new Date(); weekStart.setDate(weekStart.getDate() - 7);
  const weekSales = sales.filter(s => new Date(s.date) >= weekStart);
  const weekRevenue = weekSales.reduce((sum, s) => sum + parseFloat(s.price || 0), 0);

  const monthSales = sales.filter(s => s.date.startsWith(today.slice(0, 7)));
  const monthRevenue = monthSales.reduce((sum, s) => sum + parseFloat(s.price || 0), 0);

  container.innerHTML = `
    <div class="stats-row">
      <div class="stat-card blue">
        <div class="stat-info"><div class="stat-num" data-count="${requests.length}">${requests.length}</div><div class="stat-label">Total Solicitudes</div></div>
        <div class="stat-icon-big blue"><i class="fas fa-file-alt"></i></div>
      </div>
      <div class="stat-card yellow">
        <div class="stat-info"><div class="stat-num" data-count="${requests.filter(r=>r.status==='received'||r.status==='review').length}">${requests.filter(r=>r.status==='received'||r.status==='review').length}</div><div class="stat-label">Solicitudes Pendientes</div></div>
        <div class="stat-icon-big yellow"><i class="fas fa-hourglass-half"></i></div>
      </div>
      <div class="stat-card green">
        <div class="stat-info"><div class="stat-num" data-count="${requests.filter(r=>r.status==='approved').length}">${requests.filter(r=>r.status==='approved').length}</div><div class="stat-label">Aprobadas</div></div>
        <div class="stat-icon-big green"><i class="fas fa-check-circle"></i></div>
      </div>
      <div class="stat-card red">
        <div class="stat-info"><div class="stat-num" data-count="${requests.filter(r=>r.status==='denied').length}">${requests.filter(r=>r.status==='denied').length}</div><div class="stat-label">Denegadas</div></div>
        <div class="stat-icon-big red"><i class="fas fa-times-circle"></i></div>
      </div>
    </div>
    <div class="stats-row">
      <div class="stat-card green">
        <div class="stat-info"><div class="stat-num">$${todayRevenue.toFixed(2)}</div><div class="stat-label">Ventas Hoy</div></div>
        <div class="stat-icon-big green"><i class="fas fa-cash-register"></i></div>
      </div>
      <div class="stat-card blue">
        <div class="stat-info"><div class="stat-num">$${weekRevenue.toFixed(2)}</div><div class="stat-label">Ventas Semana</div></div>
        <div class="stat-icon-big blue"><i class="fas fa-chart-line"></i></div>
      </div>
      <div class="stat-card purple">
        <div class="stat-info"><div class="stat-num">$${monthRevenue.toFixed(2)}</div><div class="stat-label">Ventas Mes</div></div>
        <div class="stat-icon-big purple"><i class="fas fa-chart-bar"></i></div>
      </div>
      <div class="stat-card yellow">
        <div class="stat-info"><div class="stat-num" data-count="${reviews.filter(r=>r.status==='pending').length}">${reviews.filter(r=>r.status==='pending').length}</div><div class="stat-label">Reseñas Pendientes</div></div>
        <div class="stat-icon-big yellow"><i class="fas fa-star"></i></div>
      </div>
    </div>
    <div class="stats-row">
      <div class="stat-card blue">
        <div class="stat-info"><div class="stat-num" data-count="${inventory.length}">${inventory.length}</div><div class="stat-label">Productos en Inventario</div></div>
        <div class="stat-icon-big blue"><i class="fas fa-boxes"></i></div>
      </div>
      <div class="stat-card red">
        <div class="stat-info"><div class="stat-num" data-count="${inventory.filter(i=>i.status==='low'||i.status==='out').length}">${inventory.filter(i=>i.status==='low'||i.status==='out').length}</div><div class="stat-label">Bajo Inventario</div></div>
        <div class="stat-icon-big red"><i class="fas fa-exclamation-triangle"></i></div>
      </div>
      <div class="stat-card green">
        <div class="stat-info"><div class="stat-num" data-count="${offers.filter(o=>o.active).length}">${offers.filter(o=>o.active).length}</div><div class="stat-label">Ofertas Activas</div></div>
        <div class="stat-icon-big green"><i class="fas fa-tags"></i></div>
      </div>
      <div class="stat-card blue">
        <div class="stat-info"><div class="stat-num" data-count="${suppliers.length}">${suppliers.length}</div><div class="stat-label">Proveedores</div></div>
        <div class="stat-icon-big blue"><i class="fas fa-truck"></i></div>
      </div>
    </div>

    <div class="charts-row">
      <div class="panel">
        <div class="panel-header"><div class="panel-title"><i class="fas fa-chart-bar"></i> Ventas de la Semana</div></div>
        <div class="panel-body"><div class="chart-wrap"><canvas id="chart-sales-week"></canvas></div></div>
      </div>
      <div class="panel">
        <div class="panel-header"><div class="panel-title"><i class="fas fa-chart-pie"></i> Solicitudes por Estado</div></div>
        <div class="panel-body"><div class="chart-wrap"><canvas id="chart-requests"></canvas></div></div>
      </div>
    </div>

    <div class="dashboard-split">
      <div class="panel">
        <div class="panel-header"><div class="panel-title"><i class="fas fa-history"></i> Actividad Reciente</div></div>
        <div class="panel-body">
          ${renderActivityLog()}
        </div>
      </div>
      <div class="panel">
        <div class="panel-header">
          <div class="panel-title"><i class="fas fa-exclamation-triangle" style="color:var(--warning)"></i> Alertas de Inventario</div>
        </div>
        <div class="panel-body">
          ${renderLowInventoryAlerts()}
        </div>
      </div>
    </div>
  `;

  // Init charts
  setTimeout(() => {
    initWeeklySalesChart(sales);
    initRequestsChart(requests);
  }, 100);
}

function renderActivityLog() {
  let logs = [];
  try {
    logs = JSON.parse(XMI_STORAGE.getItem('xmi_logs') || '[]');
    if (!Array.isArray(logs)) logs = [];
  } catch {
    XMI_STORAGE.removeItem('xmi_logs');
    logs = [];
  }
  logs = logs.slice(0, 8);
  if (!logs.length) return '<p style="color:var(--gray);font-size:13px">No hay actividad registrada.</p>';
  const colors = { login: 'green', logout: 'blue', create: 'blue', update: 'yellow', delete: 'red' };
  return `<div class="activity-list">` + logs.map(l => `
    <div class="activity-item">
      <div class="activity-dot ${colors[l.type] || 'blue'}"></div>
      <div class="activity-text"><strong>${escHtml(l.user)}</strong> — ${escHtml(l.description)}</div>
      <div class="activity-time">${new Date(l.timestamp).toLocaleTimeString('es-PR', { hour: '2-digit', minute: '2-digit' })}</div>
    </div>
  `).join('') + `</div>`;
}

function renderLowInventoryAlerts() {
  const low = DB.get('inventory').filter(i => i.status === 'low' || i.status === 'out');
  if (!low.length) return '<p style="color:var(--success);font-size:13px"><i class="fas fa-check"></i> Todo el inventario está en buen estado.</p>';
  return low.map(i => `
    <div style="display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid var(--border)">
      <span style="font-size:24px">${i.emoji}</span>
      <div style="flex:1"><div style="font-family:var(--font-ui);font-weight:700;color:var(--white);font-size:14px">${escHtml(i.name)}</div><div style="font-size:12px;color:var(--gray)">${i.category}</div></div>
      <span class="badge ${i.status === 'out' ? 'badge-red' : 'badge-yellow'}">${i.status === 'out' ? 'Agotado' : 'Bajo Stock'}</span>
      <span style="font-family:var(--font-ui);font-weight:700;color:var(--white);font-size:15px">${i.qty}</span>
    </div>
  `).join('');
}

// ── Requests Module ───────────────────────────────────────────────
function renderRequests(container) {
  const statusLabels = { received: 'Recibida', review: 'En Revisión', docs_pending: 'Docs. Pendientes', approved: 'Aprobada', denied: 'Denegada', ready: 'Lista para Recoger', completed: 'Completada' };
  const statusBadge = { received: 'badge-blue', review: 'badge-yellow', docs_pending: 'badge-yellow', approved: 'badge-green', denied: 'badge-red', ready: 'badge-purple', completed: 'badge-green' };

  container.innerHTML = `
    <div class="panel">
      <div class="panel-header">
        <div class="panel-title"><i class="fas fa-file-alt"></i> Solicitudes de Teléfono Gratis</div>
        <div class="toolbar">
          <div class="search-box"><i class="fas fa-search"></i><input class="fi fi-sm" id="req-search" placeholder="Buscar por nombre, número..."></div>
          <select class="fi fi-sm" id="req-filter-status" style="min-width:160px">
            <option value="">Todos los estados</option>
            ${Object.entries(statusLabels).map(([v,l])=>`<option value="${v}">${l}</option>`).join('')}
          </select>
          <input type="date" class="fi fi-sm" id="req-filter-date">
          <button class="btn btn-secondary btn-sm" onclick="exportRequests()"><i class="fas fa-download"></i> Exportar</button>
        </div>
      </div>
      <div class="table-wrap">
        <table id="req-table">
          <thead><tr>
            <th>N° Solicitud</th><th>Solicitante</th><th>Teléfono</th><th>SSN</th>
            <th>Fecha Solicitud</th><th>Estado</th><th>Acciones</th>
          </tr></thead>
          <tbody id="req-tbody"></tbody>
        </table>
      </div>
    </div>
  `;

  function renderTable() {
    const search = $a('#req-search')?.value.toLowerCase() || '';
    const filterStatus = $a('#req-filter-status')?.value || '';
    const filterDate = $a('#req-filter-date')?.value || '';
    let requests = DB.get('requests');

    if (search) requests = requests.filter(r => r.id.toLowerCase().includes(search) || (r.applicant.first + ' ' + r.applicant.last).toLowerCase().includes(search) || r.applicant.phone?.includes(search));
    if (filterStatus) requests = requests.filter(r => r.status === filterStatus);
    if (filterDate) requests = requests.filter(r => r.date.startsWith(filterDate));

    const tbody = $a('#req-tbody');
    if (!tbody) return;
    tbody.innerHTML = requests.length ? requests.map(r => `
      <tr>
        <td class="cell-bold cell-mono">${escHtml(r.id)}</td>
        <td>${escHtml(r.applicant.first + ' ' + r.applicant.last)}</td>
        <td>${escHtml(r.applicant.phone || '-')}</td>
        <td class="cell-masked">${escHtml(r.applicant.ssn_masked || '***-**-****')}</td>
        <td>${formatDate(r.date)}</td>
        <td><span class="badge ${statusBadge[r.status] || 'badge-gray'}">${statusLabels[r.status] || r.status}</span></td>
        <td>
          <div style="display:flex;gap:6px">
            <button class="btn btn-info btn-sm btn-icon" title="Ver detalles" onclick="viewRequest('${r.id}')"><i class="fas fa-eye"></i></button>
            <button class="btn btn-secondary btn-sm btn-icon" title="Cambiar estado" onclick="changeRequestStatus('${r.id}')"><i class="fas fa-edit"></i></button>
          </div>
        </td>
      </tr>
    `).join('') : `<tr><td colspan="7" style="text-align:center;padding:32px;color:var(--gray)">No se encontraron solicitudes</td></tr>`;
  }

  $a('#req-search')?.addEventListener('input', renderTable);
  $a('#req-filter-status')?.addEventListener('change', renderTable);
  $a('#req-filter-date')?.addEventListener('change', renderTable);
  renderTable();
}

window.viewRequest = function(id) {
  const requests = DB.get('requests');
  const req = requests.find(r => r.id === id);
  if (!req) return;

  const statusLabels = { received:'Recibida', review:'En Revisión', docs_pending:'Docs. Pendientes', approved:'Aprobada', denied:'Denegada', ready:'Lista para Recoger', completed:'Completada' };

  const div = document.createElement('div');
  div.className = 'modal-overlay';
  div.innerHTML = `
    <div class="modal-box wide">
      <div class="modal-hd">
        <h4>Solicitud: ${escHtml(id)}</h4>
        <button class="modal-close" onclick="this.closest('.modal-overlay').remove()"><i class="fas fa-times"></i></button>
      </div>
      <div class="modal-bd">
        <div class="request-modal-grid">
          <div>
            <h5 style="font-family:var(--font-ui);color:var(--white);margin-bottom:12px">Información del Solicitante</h5>
            ${infoRow('Nombre', req.applicant.first + ' ' + req.applicant.last)}
            ${infoRow('SSN', req.applicant.ssn_masked, true)}
            ${infoRow('Fecha de Nacimiento', formatDate(req.applicant.dob))}
            ${infoRow('Teléfono', req.applicant.phone)}
            ${infoRow('Fecha de Solicitud', formatDate(req.date))}
          </div>
          <div>
            <h5 style="font-family:var(--font-ui);color:var(--white);margin-bottom:12px">Estado de la Solicitud</h5>
            <div class="fg" style="margin-bottom:16px">
              <label>Estado actual</label>
              <select class="fi" id="modal-status">
                ${Object.entries(statusLabels).map(([v,l])=>`<option value="${v}" ${req.status===v?'selected':''}>${l}</option>`).join('')}
              </select>
            </div>
            <div class="fg" style="margin-bottom:16px">
              <label>Nota pública (visible al cliente)</label>
              <textarea class="fi" id="modal-note" rows="3">${escHtml(req.notes || '')}</textarea>
            </div>
            <div class="fg">
              <label>Nota interna</label>
              <textarea class="fi" id="modal-int-note" rows="2" placeholder="Nota interna..."></textarea>
            </div>
          </div>
        </div>
        ${req.internalNotes?.length ? `<div style="margin-top:16px"><h5 style="font-family:var(--font-ui);color:var(--white);margin-bottom:8px">Historial de notas</h5>${req.internalNotes.map(n=>`<div style="font-size:12px;color:var(--gray);padding:4px 0;border-bottom:1px solid var(--border)">${escHtml(n)}</div>`).join('')}</div>` : ''}
        <div style="display:flex;justify-content:flex-end;gap:10px;margin-top:20px">
          <button class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">Cerrar</button>
          <button class="btn btn-primary" onclick="saveRequestChanges('${id}', this)"><i class="fas fa-save"></i> Guardar cambios</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(div);
};

function infoRow(label, value, sensitive = false) {
  return `<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border)"><span style="font-size:12px;color:var(--gray);font-family:var(--font-ui);font-weight:600;text-transform:uppercase">${label}</span><span style="font-size:13px;color:${sensitive?'var(--warning)':'var(--white)'};font-family:${sensitive?'monospace':'inherit'}">${escHtml(value || '-')}</span></div>`;
}

window.saveRequestChanges = function(id, btn) {
  const requests = DB.get('requests');
  const idx = requests.findIndex(r => r.id === id);
  if (idx < 0) return;

  const modal = btn.closest('.modal-overlay');
  const newStatus = $a('#modal-status', modal)?.value;
  const newNote = $a('#modal-note', modal)?.value.trim();
  const intNote = $a('#modal-int-note', modal)?.value.trim();

  requests[idx].status = newStatus;
  requests[idx].notes = newNote;
  if (intNote) {
    if (!requests[idx].internalNotes) requests[idx].internalNotes = [];
    requests[idx].internalNotes.push(`${new Date().toISOString().split('T')[0]}: ${intNote}`);
  }
  DB.set('requests', requests);
  AUTH.logActivity('update', `Estado de solicitud ${id} cambiado a ${newStatus}`);
  modal.remove();
  adminToast('Solicitud actualizada exitosamente.', 'success');
  navigateTo('requests', 'Solicitudes');
  updateBadges();
};

window.changeRequestStatus = window.viewRequest;

window.exportRequests = function() {
  const requests = DB.get('requests');
  const headers = ['N° Solicitud', 'Nombre', 'Teléfono', 'SSN (enmascarado)', 'Fecha', 'Estado'];
  const rows = requests.map(r => [r.id, r.applicant.first+' '+r.applicant.last, r.applicant.phone||'', r.applicant.ssn_masked||'', r.date.split('T')[0], r.status]);
  downloadCSV([headers, ...rows], 'solicitudes_xmi.csv');
};

// ── Inventory Module ──────────────────────────────────────────────
function renderInventory(container) {
  container.innerHTML = `
    <div class="panel" style="margin-bottom:20px">
      <div class="panel-header">
        <div class="panel-title"><i class="fas fa-boxes"></i> Inventario</div>
        <div class="toolbar">
          <div class="search-box"><i class="fas fa-search"></i><input class="fi fi-sm" id="inv-search" placeholder="Buscar producto..."></div>
          <select class="fi fi-sm" id="inv-cat">
            <option value="">Todas las categorías</option>
            ${['Celulares','Covers','Protectores','Cargadores','Audífonos','Accesorios','Otros'].map(c=>`<option value="${c}">${c}</option>`).join('')}
          </select>
          <select class="fi fi-sm" id="inv-status">
            <option value="">Todos los estados</option>
            <option value="available">Disponible</option>
            <option value="low">Bajo Stock</option>
            <option value="out">Agotado</option>
          </select>
          <button class="btn btn-primary btn-sm" onclick="openProductModal()"><i class="fas fa-plus"></i> Agregar</button>
          <button class="btn btn-secondary btn-sm" onclick="exportInventory()"><i class="fas fa-download"></i> Exportar</button>
        </div>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Producto</th><th>Categoría</th><th>Marca</th><th>Color</th><th>Cantidad</th><th>Precio Compra</th><th>Precio Venta</th><th>Estado</th><th>Acciones</th></tr></thead>
          <tbody id="inv-tbody"></tbody>
        </table>
      </div>
    </div>
  `;
  renderInvTable();

  $a('#inv-search')?.addEventListener('input', renderInvTable);
  $a('#inv-cat')?.addEventListener('change', renderInvTable);
  $a('#inv-status')?.addEventListener('change', renderInvTable);
}

function renderInvTable() {
  const search = ($a('#inv-search')?.value||'').toLowerCase();
  const cat = $a('#inv-cat')?.value||'';
  const status = $a('#inv-status')?.value||'';
  let inv = DB.get('inventory');
  if (search) inv = inv.filter(i => i.name.toLowerCase().includes(search)||i.brand.toLowerCase().includes(search));
  if (cat) inv = inv.filter(i => i.category === cat);
  if (status) inv = inv.filter(i => i.status === status);

  const statusMap = { available: ['badge-green','Disponible'], low: ['badge-yellow','Bajo Stock'], out: ['badge-red','Agotado'] };
  const tbody = $a('#inv-tbody');
  if (!tbody) return;
  tbody.innerHTML = inv.length ? inv.map(i => `
    <tr>
      <td><div style="display:flex;align-items:center;gap:8px"><span style="font-size:24px">${i.emoji||'📦'}</span><span class="cell-bold">${escHtml(i.name)}</span></div></td>
      <td>${escHtml(i.category)}</td><td>${escHtml(i.brand)}</td><td>${escHtml(i.color||'-')}</td>
      <td class="cell-bold" style="${i.qty<=3?'color:var(--warning)':''}">${i.qty}</td>
      <td>${formatCurrency(i.buyPrice)}</td><td style="color:var(--success)">${formatCurrency(i.sellPrice)}</td>
      <td><span class="badge ${statusMap[i.status]?.[0]||'badge-gray'}">${statusMap[i.status]?.[1]||i.status}</span></td>
      <td><div style="display:flex;gap:6px">
        <button class="btn btn-info btn-sm btn-icon" onclick="openProductModal(${i.id})" title="Editar"><i class="fas fa-edit"></i></button>
        <button class="btn btn-danger btn-sm btn-icon" onclick="deleteProduct(${i.id})" title="Eliminar"><i class="fas fa-trash"></i></button>
      </div></td>
    </tr>
  `).join('') : `<tr><td colspan="9" style="text-align:center;padding:32px;color:var(--gray)">No se encontraron productos</td></tr>`;
}

window.openProductModal = function(id = null) {
  const product = id ? DB.get('inventory').find(p => p.id === id) : null;
  const div = document.createElement('div');
  div.className = 'modal-overlay';
  div.innerHTML = `
    <div class="modal-box">
      <div class="modal-hd"><h4>${product ? 'Editar Producto' : 'Nuevo Producto'}</h4><button class="modal-close" onclick="this.closest('.modal-overlay').remove()"><i class="fas fa-times"></i></button></div>
      <div class="modal-bd">
        <div class="form-row"><div class="fg"><label>Nombre del producto *</label><input class="fi" id="p-name" value="${escHtml(product?.name||'')}" placeholder="Nombre"></div>
        <div class="fg"><label>Categoría *</label><select class="fi" id="p-cat">
          ${['Celulares','Covers','Protectores','Cargadores','Audífonos','Accesorios','Otros'].map(c=>`<option value="${c}" ${product?.category===c?'selected':''}>${c}</option>`).join('')}
        </select></div></div>
        <div class="form-row"><div class="fg"><label>Marca</label><input class="fi" id="p-brand" value="${escHtml(product?.brand||'')}" placeholder="Samsung, Apple..."></div>
        <div class="fg"><label>Modelo compatible</label><input class="fi" id="p-model" value="${escHtml(product?.model||'')}" placeholder="iPhone 15, Universal..."></div></div>
        <div class="form-row"><div class="fg"><label>Color</label><input class="fi" id="p-color" value="${escHtml(product?.color||'')}" placeholder="Negro, Transparente..."></div>
        <div class="fg"><label>Emoji</label><input class="fi" id="p-emoji" value="${escHtml(product?.emoji||'📦')}" placeholder="📱"></div></div>
        <div class="form-row col3">
          <div class="fg"><label>Cantidad *</label><input class="fi" id="p-qty" type="number" min="0" value="${product?.qty||0}"></div>
          <div class="fg"><label>Precio Compra $</label><input class="fi" id="p-buy" type="number" step="0.01" value="${product?.buyPrice||0}"></div>
          <div class="fg"><label>Precio Venta $</label><input class="fi" id="p-sell" type="number" step="0.01" value="${product?.sellPrice||0}"></div>
        </div>
        <div class="form-row"><div class="fg"><label>Proveedor</label><input class="fi" id="p-supplier" value="${escHtml(product?.supplier||'')}" placeholder="Nombre del proveedor"></div>
        <div class="fg"><label>Estado</label><select class="fi" id="p-status">
          <option value="available" ${product?.status==='available'?'selected':''}>Disponible</option>
          <option value="low" ${product?.status==='low'?'selected':''}>Bajo Stock</option>
          <option value="out" ${product?.status==='out'?'selected':''}>Agotado</option>
        </select></div></div>
        <div style="display:flex;justify-content:flex-end;gap:10px;margin-top:20px">
          <button class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">Cancelar</button>
          <button class="btn btn-primary" onclick="saveProduct(${id||'null'}, this)"><i class="fas fa-save"></i> Guardar</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(div);
};

window.saveProduct = function(id, btn) {
  const modal = btn.closest('.modal-overlay');
  const get = sel => $a(sel, modal)?.value.trim();
  const name = get('#p-name'), qty = parseInt(get('#p-qty')||'0');
  if (!name) { adminToast('El nombre es requerido.', 'error'); return; }

  const inv = DB.get('inventory');
  const product = {
    name, category: get('#p-cat'), brand: get('#p-brand'), model: get('#p-model'),
    color: get('#p-color'), emoji: get('#p-emoji')||'📦', qty,
    buyPrice: parseFloat(get('#p-buy')||'0'), sellPrice: parseFloat(get('#p-sell')||'0'),
    supplier: get('#p-supplier'), status: get('#p-status'), entryDate: new Date().toISOString().split('T')[0]
  };

  if (id) {
    const idx = inv.findIndex(p => p.id === id);
    if (idx >= 0) { inv[idx] = { ...inv[idx], ...product }; }
    AUTH.logActivity('update', `Producto actualizado: ${name}`);
  } else {
    product.id = DB.nextId('inventory');
    inv.push(product);
    AUTH.logActivity('create', `Producto creado: ${name}`);
  }
  DB.set('inventory', inv);
  modal.remove();
  adminToast('Producto guardado exitosamente.', 'success');
  renderInvTable();
  updateBadges();
};

window.deleteProduct = function(id) {
  const inv = DB.get('inventory');
  const p = inv.find(i => i.id === id);
  confirm2('Eliminar Producto', `¿Eliminar "${p?.name}"? Esta acción no se puede deshacer.`, () => {
    DB.set('inventory', inv.filter(i => i.id !== id));
    AUTH.logActivity('delete', `Producto eliminado: ${p?.name}`);
    adminToast('Producto eliminado.', 'success');
    renderInvTable();
    updateBadges();
  });
};

window.exportInventory = function() {
  const inv = DB.get('inventory');
  const headers = ['Nombre','Categoría','Marca','Modelo','Color','Cantidad','Precio Compra','Precio Venta','Estado'];
  const rows = inv.map(i => [i.name, i.category, i.brand, i.model, i.color, i.qty, i.buyPrice, i.sellPrice, i.status]);
  downloadCSV([headers, ...rows], 'inventario_xmi.csv');
};

// ── Sales Module ──────────────────────────────────────────────────
function renderSales(container) {
  const sales = DB.get('sales');
  const total = sales.reduce((sum, s) => sum + parseFloat(s.price||0), 0);

  container.innerHTML = `
    <div class="stats-row sales-stats">
      <div class="stat-card green"><div class="stat-info"><div class="stat-num">${sales.length}</div><div class="stat-label">Total Ventas</div></div><div class="stat-icon-big green"><i class="fas fa-shopping-cart"></i></div></div>
      <div class="stat-card blue"><div class="stat-info"><div class="stat-num">$${total.toFixed(2)}</div><div class="stat-label">Ingresos Totales</div></div><div class="stat-icon-big blue"><i class="fas fa-dollar-sign"></i></div></div>
      <div class="stat-card yellow"><div class="stat-info"><div class="stat-num">$${(total/Math.max(sales.length,1)).toFixed(2)}</div><div class="stat-label">Promedio por Venta</div></div><div class="stat-icon-big yellow"><i class="fas fa-chart-line"></i></div></div>
    </div>
    <div class="panel">
      <div class="panel-header">
        <div class="panel-title"><i class="fas fa-cash-register"></i> Historial de Ventas</div>
        <div class="toolbar">
          <input type="date" class="fi fi-sm" id="sale-date">
          <select class="fi fi-sm" id="sale-method">
            <option value="">Todos los métodos</option>
            <option value="cash">Efectivo</option><option value="ath">ATH Móvil</option>
            <option value="card">Tarjeta</option><option value="other">Otro</option>
          </select>
          <button class="btn btn-primary btn-sm" onclick="openSaleModal()"><i class="fas fa-plus"></i> Registrar Venta</button>
          <button class="btn btn-secondary btn-sm" onclick="exportSales()"><i class="fas fa-download"></i> Exportar</button>
        </div>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Producto</th><th>Cantidad</th><th>Total</th><th>Método</th><th>Fecha</th><th>Empleado</th><th>Cliente</th><th>Acciones</th></tr></thead>
          <tbody id="sales-tbody"></tbody>
        </table>
      </div>
    </div>
  `;
  renderSalesTable();
  $a('#sale-date')?.addEventListener('change', renderSalesTable);
  $a('#sale-method')?.addEventListener('change', renderSalesTable);
}

function renderSalesTable() {
  const dateFilter = $a('#sale-date')?.value||'';
  const methodFilter = $a('#sale-method')?.value||'';
  const methods = { cash: '💵 Efectivo', ath: '📱 ATH Móvil', card: '💳 Tarjeta', other: 'Otro' };
  let sales = DB.get('sales');
  if (dateFilter) sales = sales.filter(s => s.date === dateFilter);
  if (methodFilter) sales = sales.filter(s => s.method === methodFilter);

  const tbody = $a('#sales-tbody');
  if (!tbody) return;
  tbody.innerHTML = sales.length ? [...sales].reverse().map(s => `
    <tr>
      <td class="cell-bold">${escHtml(s.product)}</td><td>${s.qty}</td>
      <td style="color:var(--success);font-weight:700">${formatCurrency(s.price)}</td>
      <td>${methods[s.method]||s.method}</td><td>${formatDate(s.date)}</td>
      <td>${escHtml(s.employee||'-')}</td><td>${escHtml(s.customer||'-')}</td>
      <td><button class="btn btn-danger btn-sm btn-icon" onclick="deleteSale(${s.id})" title="Eliminar"><i class="fas fa-trash"></i></button></td>
    </tr>
  `).join('') : `<tr><td colspan="8" style="text-align:center;padding:32px;color:var(--gray)">No se encontraron ventas</td></tr>`;
}

window.openSaleModal = function() {
  const session = AUTH.getSession();
  const inv = DB.get('inventory').filter(i => i.status !== 'out');
  const div = document.createElement('div');
  div.className = 'modal-overlay';
  div.innerHTML = `
    <div class="modal-box">
      <div class="modal-hd"><h4>Registrar Venta</h4><button class="modal-close" onclick="this.closest('.modal-overlay').remove()"><i class="fas fa-times"></i></button></div>
      <div class="modal-bd">
        <div class="form-row"><div class="fg"><label>Producto *</label><select class="fi" id="s-product">
          <option value="">-- Seleccionar producto --</option>
          ${inv.map(i=>`<option value="${escHtml(i.name)}" data-price="${i.sellPrice}">${escHtml(i.name)} - ${formatCurrency(i.sellPrice)}</option>`).join('')}
          <option value="otro">Otro (especificar)</option>
        </select></div>
        <div class="fg"><label>Cantidad *</label><input class="fi" id="s-qty" type="number" min="1" value="1"></div></div>
        <div class="form-row"><div class="fg"><label>Precio Total $ *</label><input class="fi" id="s-price" type="number" step="0.01" placeholder="0.00"></div>
        <div class="fg"><label>Método de Pago *</label><select class="fi" id="s-method">
          <option value="cash">Efectivo</option><option value="ath">ATH Móvil</option><option value="card">Tarjeta</option><option value="other">Otro</option>
        </select></div></div>
        <div class="form-row"><div class="fg"><label>Cliente (opcional)</label><input class="fi" id="s-customer" placeholder="Nombre del cliente"></div>
        <div class="fg"><label>Empleado</label><input class="fi" id="s-emp" value="${escHtml(session?.name||'')}"></div></div>
        <div class="form-row col1"><div class="fg"><label>Notas</label><input class="fi" id="s-notes" placeholder="Notas adicionales..."></div></div>
        <div style="display:flex;justify-content:flex-end;gap:10px;margin-top:20px">
          <button class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">Cancelar</button>
          <button class="btn btn-primary" onclick="saveSale(this)"><i class="fas fa-save"></i> Registrar</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(div);

  // Auto-fill price
  $a('#s-product', div)?.addEventListener('change', e => {
    const opt = e.target.selectedOptions[0];
    const qty = parseInt($a('#s-qty', div)?.value||'1');
    if (opt?.dataset?.price) $a('#s-price', div).value = (parseFloat(opt.dataset.price) * qty).toFixed(2);
  });
  $a('#s-qty', div)?.addEventListener('input', () => {
    const opt = $a('#s-product', div)?.selectedOptions[0];
    const qty = parseInt($a('#s-qty', div)?.value||'1');
    if (opt?.dataset?.price) $a('#s-price', div).value = (parseFloat(opt.dataset.price) * qty).toFixed(2);
  });
};

window.saveSale = function(btn) {
  const modal = btn.closest('.modal-overlay');
  const get = sel => $a(sel, modal)?.value.trim();
  const product = get('#s-product'), price = parseFloat(get('#s-price')||'0');
  if (!product || !price) { adminToast('Completa los campos requeridos.', 'error'); return; }

  const sales = DB.get('sales');
  sales.push({ id: DB.nextId('sales'), product, qty: parseInt(get('#s-qty')||'1'), price, method: get('#s-method'), date: new Date().toISOString().split('T')[0], employee: get('#s-emp'), customer: get('#s-customer'), notes: get('#s-notes') });
  DB.set('sales', sales);
  AUTH.logActivity('create', `Venta registrada: ${product} - $${price.toFixed(2)}`);
  modal.remove();
  adminToast('Venta registrada exitosamente.', 'success');
  renderSalesTable();
};

window.deleteSale = function(id) {
  confirm2('Eliminar Venta', '¿Eliminar este registro de venta?', () => {
    DB.set('sales', DB.get('sales').filter(s => s.id !== id));
    adminToast('Venta eliminada.', 'success');
    renderSalesTable();
  });
};

window.exportSales = function() {
  const sales = DB.get('sales');
  const headers = ['Producto','Cantidad','Precio','Método','Fecha','Empleado','Cliente','Notas'];
  const rows = sales.map(s => [s.product, s.qty, s.price, s.method, s.date, s.employee, s.customer, s.notes]);
  downloadCSV([headers, ...rows], 'ventas_xmi.csv');
};

// ── Statistics Module ─────────────────────────────────────────────
function renderStats(container) {
  container.innerHTML = `
    <div class="charts-row">
      <div class="panel"><div class="panel-header"><div class="panel-title"><i class="fas fa-chart-bar"></i> Ventas por Mes</div></div><div class="panel-body"><div class="chart-wrap"><canvas id="stat-monthly"></canvas></div></div></div>
      <div class="panel"><div class="panel-header"><div class="panel-title"><i class="fas fa-chart-pie"></i> Ventas por Categoría</div></div><div class="panel-body"><div class="chart-wrap"><canvas id="stat-category"></canvas></div></div></div>
    </div>
    <div class="charts-row">
      <div class="panel"><div class="panel-header"><div class="panel-title"><i class="fas fa-chart-line"></i> Solicitudes por Estado</div></div><div class="panel-body"><div class="chart-wrap"><canvas id="stat-requests"></canvas></div></div></div>
      <div class="panel"><div class="panel-header"><div class="panel-title"><i class="fas fa-star"></i> Reseñas por Calificación</div></div><div class="panel-body"><div class="chart-wrap"><canvas id="stat-reviews"></canvas></div></div></div>
    </div>
  `;
  setTimeout(() => {
    initMonthlyChart();
    initCategoryChart();
    initRequestsStatusChart();
    initReviewsChart();
  }, 100);
}

// ── Reviews Module ────────────────────────────────────────────────
function renderReviews(container) {
  container.innerHTML = `
    <div class="panel">
      <div class="panel-header"><div class="panel-title"><i class="fas fa-star"></i> Administración de Reseñas</div>
        <div class="toolbar">
          <select class="fi fi-sm" id="rev-filter">
            <option value="">Todas</option><option value="pending">Pendientes</option><option value="approved">Aprobadas</option><option value="rejected">Rechazadas</option>
          </select>
        </div>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Nombre</th><th>Calificación</th><th>Comentario</th><th>Fecha</th><th>Estado</th><th>Acciones</th></tr></thead>
          <tbody id="rev-tbody"></tbody>
        </table>
      </div>
    </div>
  `;
  renderReviewsTable();
  $a('#rev-filter')?.addEventListener('change', renderReviewsTable);
}

function renderReviewsTable() {
  const filter = $a('#rev-filter')?.value||'';
  const stMap = { pending: ['badge-yellow','Pendiente'], approved: ['badge-green','Aprobada'], rejected: ['badge-red','Rechazada'] };
  let reviews = DB.get('reviews');
  if (filter) reviews = reviews.filter(r => r.status === filter);
  const tbody = $a('#rev-tbody');
  if (!tbody) return;
  tbody.innerHTML = reviews.length ? reviews.map(r => `
    <tr>
      <td class="cell-bold">${escHtml(r.name)}</td>
      <td style="color:var(--warning)">${'★'.repeat(r.rating)}${'☆'.repeat(5-r.rating)} ${r.rating}/5</td>
      <td style="max-width:300px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${escHtml(r.comment)}</td>
      <td>${formatDate(r.date)}</td>
      <td><span class="badge ${stMap[r.status]?.[0]||'badge-gray'}">${stMap[r.status]?.[1]||r.status}</span></td>
      <td><div style="display:flex;gap:6px">
        ${r.status !== 'approved' ? `<button class="btn btn-success btn-sm btn-icon" onclick="approveReview(${r.id})" title="Aprobar"><i class="fas fa-check"></i></button>` : ''}
        ${r.status !== 'rejected' ? `<button class="btn btn-danger btn-sm btn-icon" onclick="rejectReview(${r.id})" title="Rechazar"><i class="fas fa-ban"></i></button>` : ''}
        <button class="btn btn-danger btn-sm btn-icon" onclick="deleteReview(${r.id})" title="Eliminar"><i class="fas fa-trash"></i></button>
      </div></td>
    </tr>
  `).join('') : `<tr><td colspan="6" style="text-align:center;padding:32px;color:var(--gray)">No hay reseñas</td></tr>`;
}

window.approveReview = function(id) {
  const reviews = DB.get('reviews');
  const idx = reviews.findIndex(r => r.id === id);
  if (idx>=0) { reviews[idx].status = 'approved'; DB.set('reviews', reviews); adminToast('Reseña aprobada.', 'success'); renderReviewsTable(); updateBadges(); AUTH.logActivity('update', `Reseña aprobada: ID ${id}`); }
};
window.rejectReview = function(id) {
  const reviews = DB.get('reviews');
  const idx = reviews.findIndex(r => r.id === id);
  if (idx>=0) { reviews[idx].status = 'rejected'; DB.set('reviews', reviews); adminToast('Reseña rechazada.', 'success'); renderReviewsTable(); updateBadges(); }
};
window.deleteReview = function(id) {
  confirm2('Eliminar Reseña', '¿Eliminar esta reseña permanentemente?', () => {
    DB.set('reviews', DB.get('reviews').filter(r => r.id !== id));
    adminToast('Reseña eliminada.', 'success'); renderReviewsTable(); updateBadges();
  });
};

// ── Offers Module ─────────────────────────────────────────────────
function renderOffers(container) {
  container.innerHTML = `
    <div class="panel">
      <div class="panel-header"><div class="panel-title"><i class="fas fa-tags"></i> Ofertas</div>
        <button class="btn btn-primary btn-sm" onclick="openOfferModal()"><i class="fas fa-plus"></i> Nueva Oferta</button>
      </div>
      <div class="panel-body">
        <div id="offers-admin-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px"></div>
      </div>
    </div>
  `;
  renderOffersAdmin();
}

function renderOffersAdmin() {
  const grid = $a('#offers-admin-grid');
  if (!grid) return;
  const offers = DB.get('offers');
  grid.innerHTML = offers.length ? offers.map(o => `
    <div style="background:var(--card2);border:1px solid var(--border);border-radius:var(--radius-lg);padding:20px">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px">
        <span style="font-size:36px">${o.emoji}</span>
        <span class="badge ${o.active?'badge-green':'badge-gray'}">${o.active?'Activa':'Inactiva'}</span>
      </div>
      <div style="font-family:var(--font-ui);font-weight:700;font-size:17px;color:var(--white);margin-bottom:6px">${escHtml(o.title)}</div>
      <div style="font-size:13px;color:var(--gray);margin-bottom:8px">${escHtml(o.description)}</div>
      <div style="font-family:var(--font-display);font-size:24px;color:var(--red-light);margin-bottom:4px">${escHtml(o.price)}</div>
      <div style="font-size:11px;color:var(--gray);margin-bottom:14px">Expira: ${formatDate(o.expiry)}</div>
      <div style="display:flex;gap:8px">
        <button class="btn btn-info btn-sm" onclick="openOfferModal(${o.id})"><i class="fas fa-edit"></i> Editar</button>
        <button class="btn ${o.active?'btn-secondary':'btn-success'} btn-sm" onclick="toggleOffer(${o.id})">${o.active?'Desactivar':'Activar'}</button>
        <button class="btn btn-danger btn-sm btn-icon" onclick="deleteOffer(${o.id})"><i class="fas fa-trash"></i></button>
      </div>
    </div>
  `).join('') : '<p style="color:var(--gray)">No hay ofertas configuradas.</p>';
}

window.openOfferModal = function(id = null) {
  const offer = id ? DB.get('offers').find(o => o.id === id) : null;
  const div = document.createElement('div');
  div.className = 'modal-overlay';
  div.innerHTML = `
    <div class="modal-box">
      <div class="modal-hd"><h4>${offer?'Editar Oferta':'Nueva Oferta'}</h4><button class="modal-close" onclick="this.closest('.modal-overlay').remove()"><i class="fas fa-times"></i></button></div>
      <div class="modal-bd">
        <div class="form-row col1"><div class="fg"><label>Título *</label><input class="fi" id="of-title" value="${escHtml(offer?.title||'')}"></div></div>
        <div class="form-row col1"><div class="fg"><label>Descripción</label><textarea class="fi" id="of-desc" rows="2">${escHtml(offer?.description||'')}</textarea></div></div>
        <div class="form-row"><div class="fg"><label>Precio / Texto</label><input class="fi" id="of-price" value="${escHtml(offer?.price||'')}" placeholder="$19.99 o GRATIS"></div>
        <div class="fg"><label>Emoji</label><input class="fi" id="of-emoji" value="${escHtml(offer?.emoji||'🏷️')}"></div></div>
        <div class="form-row"><div class="fg"><label>Etiqueta</label><input class="fi" id="of-tag" value="${escHtml(offer?.tag||'OFERTA')}"></div>
        <div class="fg"><label>Estado</label><select class="fi" id="of-active">
          <option value="1" ${offer?.active!==false?'selected':''}>Activa</option><option value="0" ${offer?.active===false?'selected':''}>Inactiva</option>
        </select></div></div>
        <div class="form-row"><div class="fg"><label>Fecha inicio</label><input class="fi" id="of-start" type="date" value="${offer?.startDate||''}"></div>
        <div class="fg"><label>Fecha expiración</label><input class="fi" id="of-expiry" type="date" value="${offer?.expiry||''}"></div></div>
        <div style="display:flex;justify-content:flex-end;gap:10px;margin-top:20px">
          <button class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">Cancelar</button>
          <button class="btn btn-primary" onclick="saveOffer(${id||'null'},this)"><i class="fas fa-save"></i> Guardar</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(div);
};

window.saveOffer = function(id, btn) {
  const modal = btn.closest('.modal-overlay');
  const get = sel => $a(sel, modal)?.value.trim();
  const title = get('#of-title');
  if (!title) { adminToast('El título es requerido.', 'error'); return; }
  const offers = DB.get('offers');
  const offer = { title, description: get('#of-desc'), price: get('#of-price'), emoji: get('#of-emoji')||'🏷️', tag: get('#of-tag'), active: get('#of-active') === '1', startDate: get('#of-start'), expiry: get('#of-expiry') };
  if (id) {
    const idx = offers.findIndex(o => o.id === id);
    if (idx>=0) offers[idx] = { ...offers[idx], ...offer };
  } else { offer.id = DB.nextId('offers'); offers.push(offer); }
  DB.set('offers', offers);
  modal.remove();
  adminToast('Oferta guardada.', 'success');
  renderOffersAdmin();
};

window.toggleOffer = function(id) {
  const offers = DB.get('offers');
  const idx = offers.findIndex(o => o.id === id);
  if (idx>=0) { offers[idx].active = !offers[idx].active; DB.set('offers', offers); renderOffersAdmin(); }
};

window.deleteOffer = function(id) {
  confirm2('Eliminar Oferta', '¿Eliminar esta oferta?', () => {
    DB.set('offers', DB.get('offers').filter(o => o.id !== id));
    adminToast('Oferta eliminada.', 'success'); renderOffersAdmin();
  });
};

// ── Suppliers Module ──────────────────────────────────────────────
function renderSuppliers(container) {
  container.innerHTML = `
    <div class="panel">
      <div class="panel-header"><div class="panel-title"><i class="fas fa-truck"></i> Proveedores</div>
        <button class="btn btn-primary btn-sm" onclick="openSupplierModal()"><i class="fas fa-plus"></i> Agregar Proveedor</button>
      </div>
      <div class="table-wrap">
        <table><thead><tr><th>Nombre</th><th>Contacto</th><th>Teléfono</th><th>Email</th><th>Productos</th><th>Acciones</th></tr></thead>
        <tbody id="sup-tbody"></tbody></table>
      </div>
    </div>
  `;
  renderSuppliersTable();
}

function renderSuppliersTable() {
  const tbody = $a('#sup-tbody');
  if (!tbody) return;
  const suppliers = DB.get('suppliers');
  tbody.innerHTML = suppliers.length ? suppliers.map(s => `
    <tr>
      <td class="cell-bold">${escHtml(s.name)}</td><td>${escHtml(s.contact||'-')}</td>
      <td>${escHtml(s.phone||'-')}</td><td>${escHtml(s.email||'-')}</td>
      <td style="max-width:200px;overflow:hidden;text-overflow:ellipsis">${escHtml(s.products||'-')}</td>
      <td><div style="display:flex;gap:6px">
        <button class="btn btn-info btn-sm btn-icon" onclick="openSupplierModal(${s.id})" title="Editar"><i class="fas fa-edit"></i></button>
        <button class="btn btn-danger btn-sm btn-icon" onclick="deleteSupplier(${s.id})" title="Eliminar"><i class="fas fa-trash"></i></button>
      </div></td>
    </tr>
  `).join('') : `<tr><td colspan="6" style="text-align:center;padding:32px;color:var(--gray)">No hay proveedores registrados</td></tr>`;
}

window.openSupplierModal = function(id = null) {
  const sup = id ? DB.get('suppliers').find(s => s.id === id) : null;
  const div = document.createElement('div');
  div.className = 'modal-overlay';
  div.innerHTML = `
    <div class="modal-box">
      <div class="modal-hd"><h4>${sup?'Editar Proveedor':'Nuevo Proveedor'}</h4><button class="modal-close" onclick="this.closest('.modal-overlay').remove()"><i class="fas fa-times"></i></button></div>
      <div class="modal-bd">
        <div class="form-row col1"><div class="fg"><label>Nombre del Proveedor *</label><input class="fi" id="sp-name" value="${escHtml(sup?.name||'')}"></div></div>
        <div class="form-row"><div class="fg"><label>Contacto</label><input class="fi" id="sp-contact" value="${escHtml(sup?.contact||'')}"></div>
        <div class="fg"><label>Teléfono</label><input class="fi" id="sp-phone" value="${escHtml(sup?.phone||'')}"></div></div>
        <div class="form-row"><div class="fg"><label>Email</label><input class="fi" id="sp-email" value="${escHtml(sup?.email||'')}"></div>
        <div class="fg"><label>Dirección</label><input class="fi" id="sp-addr" value="${escHtml(sup?.address||'')}"></div></div>
        <div class="form-row col1"><div class="fg"><label>Productos que suple</label><input class="fi" id="sp-products" value="${escHtml(sup?.products||'')}"></div></div>
        <div class="form-row col1"><div class="fg"><label>Notas</label><textarea class="fi" id="sp-notes" rows="2">${escHtml(sup?.notes||'')}</textarea></div></div>
        <div style="display:flex;justify-content:flex-end;gap:10px;margin-top:20px">
          <button class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">Cancelar</button>
          <button class="btn btn-primary" onclick="saveSupplier(${id||'null'},this)"><i class="fas fa-save"></i> Guardar</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(div);
};

window.saveSupplier = function(id, btn) {
  const modal = btn.closest('.modal-overlay');
  const get = sel => $a(sel, modal)?.value.trim();
  const name = get('#sp-name');
  if (!name) { adminToast('El nombre es requerido.', 'error'); return; }
  const sups = DB.get('suppliers');
  const sup = { name, contact: get('#sp-contact'), phone: get('#sp-phone'), email: get('#sp-email'), address: get('#sp-addr'), products: get('#sp-products'), notes: get('#sp-notes'), regDate: new Date().toISOString().split('T')[0] };
  if (id) { const i = sups.findIndex(s => s.id === id); if (i>=0) sups[i] = {...sups[i],...sup}; } else { sup.id = DB.nextId('suppliers'); sups.push(sup); }
  DB.set('suppliers', sups);
  modal.remove(); adminToast('Proveedor guardado.', 'success'); renderSuppliersTable();
};

window.deleteSupplier = function(id) {
  confirm2('Eliminar Proveedor', '¿Eliminar este proveedor?', () => {
    DB.set('suppliers', DB.get('suppliers').filter(s => s.id !== id));
    adminToast('Proveedor eliminado.', 'success'); renderSuppliersTable();
  });
};

// ── Employees Module ──────────────────────────────────────────────
function renderEmployees(container) {
  container.innerHTML = `
    <div class="panel">
      <div class="panel-header"><div class="panel-title"><i class="fas fa-users"></i> Empleados y Usuarios</div>
        <button class="btn btn-primary btn-sm" onclick="openEmpModal()"><i class="fas fa-plus"></i> Agregar Empleado</button>
      </div>
      <div class="table-wrap">
        <table><thead><tr><th>Nombre</th><th>Puesto</th><th>Usuario</th><th>Rol</th><th>Teléfono</th><th>Estado</th><th>Acciones</th></tr></thead>
        <tbody id="emp-tbody"></tbody></table>
      </div>
    </div>
  `;
  renderEmpTable();
}

function renderEmpTable() {
  const tbody = $a('#emp-tbody');
  if (!tbody) return;
  const emps = DB.get('employees');
  const roleMap = { superadmin: ['badge-red','Super Admin'], admin: ['badge-blue','Admin'], employee: ['badge-green','Empleado'], readonly: ['badge-gray','Solo Lectura'] };
  tbody.innerHTML = emps.length ? emps.map(e => `
    <tr>
      <td class="cell-bold">${escHtml(e.name)}</td><td>${escHtml(e.position||'-')}</td>
      <td class="cell-mono">${escHtml(e.username||'-')}</td>
      <td><span class="badge ${roleMap[e.role]?.[0]||'badge-gray'}">${roleMap[e.role]?.[1]||e.role}</span></td>
      <td>${escHtml(e.phone||'-')}</td>
      <td><span class="badge ${e.active?'badge-green':'badge-gray'}">${e.active?'Activo':'Inactivo'}</span></td>
      <td><div style="display:flex;gap:6px">
        <button class="btn btn-info btn-sm btn-icon" onclick="openEmpModal(${e.id})" title="Editar"><i class="fas fa-edit"></i></button>
        <button class="btn ${e.active?'btn-secondary':'btn-success'} btn-sm btn-icon" onclick="toggleEmployee(${e.id})" title="${e.active?'Desactivar':'Activar'}"><i class="fas fa-${e.active?'user-slash':'user-check'}"></i></button>
        ${e.id !== 1 ? `<button class="btn btn-danger btn-sm btn-icon" onclick="deleteEmployee(${e.id})" title="Eliminar"><i class="fas fa-trash"></i></button>` : ''}
      </div></td>
    </tr>
  `).join('') : `<tr><td colspan="7" style="text-align:center;padding:32px;color:var(--gray)">No hay empleados</td></tr>`;
}

window.openEmpModal = function(id = null) {
  const emp = id ? DB.get('employees').find(e => e.id === id) : null;
  const div = document.createElement('div');
  div.className = 'modal-overlay';
  div.innerHTML = `
    <div class="modal-box">
      <div class="modal-hd"><h4>${emp?'Editar Empleado':'Nuevo Empleado'}</h4><button class="modal-close" onclick="this.closest('.modal-overlay').remove()"><i class="fas fa-times"></i></button></div>
      <div class="modal-bd">
        <div class="form-row"><div class="fg"><label>Nombre Completo *</label><input class="fi" id="em-name" value="${escHtml(emp?.name||'')}"></div>
        <div class="fg"><label>Puesto</label><input class="fi" id="em-pos" value="${escHtml(emp?.position||'')}"></div></div>
        <div class="form-row"><div class="fg"><label>Teléfono</label><input class="fi" id="em-phone" value="${escHtml(emp?.phone||'')}"></div>
        <div class="fg"><label>Email</label><input class="fi" id="em-email" value="${escHtml(emp?.email||'')}"></div></div>
        <div class="form-row"><div class="fg"><label>Usuario</label><input class="fi" id="em-user" value="${escHtml(emp?.username||'')}"></div>
        <div class="fg"><label>${emp?'Nueva Contraseña (dejar vacío para no cambiar)':'Contraseña *'}</label><input class="fi" id="em-pass" type="password" placeholder="Contraseña segura"></div></div>
        <div class="form-row"><div class="fg"><label>Rol</label><select class="fi" id="em-role">
          <option value="employee" ${emp?.role==='employee'?'selected':''}>Empleado</option>
          <option value="admin" ${emp?.role==='admin'?'selected':''}>Administrador</option>
          <option value="readonly" ${emp?.role==='readonly'?'selected':''}>Solo Lectura</option>
          <option value="superadmin" ${emp?.role==='superadmin'?'selected':''}>Super Admin</option>
        </select></div>
        <div class="fg"><label>Estado</label><select class="fi" id="em-active">
          <option value="1" ${emp?.active!==false?'selected':''}>Activo</option><option value="0" ${emp?.active===false?'selected':''}>Inactivo</option>
        </select></div></div>
        <div style="display:flex;justify-content:flex-end;gap:10px;margin-top:20px">
          <button class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">Cancelar</button>
          <button class="btn btn-primary" onclick="saveEmployee(${id||'null'},this)"><i class="fas fa-save"></i> Guardar</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(div);
};

window.saveEmployee = function(id, btn) {
  const modal = btn.closest('.modal-overlay');
  const get = sel => $a(sel, modal)?.value.trim();
  const name = get('#em-name');
  if (!name) { adminToast('El nombre es requerido.', 'error'); return; }
  const emps = DB.get('employees');
  const users = AUTH.getUsers();
  const emp = { name, position: get('#em-pos'), phone: get('#em-phone'), email: get('#em-email'), username: get('#em-user'), role: get('#em-role'), active: get('#em-active') === '1' };
  const pass = get('#em-pass');

  if (id) {
    const i = emps.findIndex(e => e.id === id);
    if (i>=0) emps[i] = {...emps[i],...emp};
    // Update user password if changed
    if (pass) { const ui = users.findIndex(u => u.username === emp.username); if (ui>=0) { users[ui].password = pass; AUTH.saveUsers(users); } }
  } else {
    if (!pass) { adminToast('La contraseña es requerida para nuevos empleados.', 'error'); return; }
    emp.id = DB.nextId('employees');
    emps.push(emp);
    users.push({ id: emp.id, username: emp.username, password: pass, name: emp.name, role: emp.role, active: true, email: emp.email });
    AUTH.saveUsers(users);
  }
  DB.set('employees', emps);
  modal.remove(); adminToast('Empleado guardado.', 'success'); renderEmpTable();
};

window.toggleEmployee = function(id) {
  const emps = DB.get('employees');
  const i = emps.findIndex(e => e.id === id);
  if (i>=0) { emps[i].active = !emps[i].active; DB.set('employees', emps); renderEmpTable(); adminToast(`Empleado ${emps[i].active?'activado':'desactivado'}.`, 'success'); }
};

window.deleteEmployee = function(id) {
  confirm2('Eliminar Empleado', '¿Eliminar este empleado? Se perderán todos sus datos.', () => {
    const emps = DB.get('employees').filter(e => e.id !== id);
    DB.set('employees', emps);
    adminToast('Empleado eliminado.', 'success'); renderEmpTable();
  });
};

// ── Schedules Module ──────────────────────────────────────────────
function renderSchedules(container) {
  const emps = DB.get('employees').filter(e => e.role !== 'superadmin');
  container.innerHTML = `
    <div class="panel" style="margin-bottom:20px">
      <div class="panel-header">
        <div class="panel-title"><i class="fas fa-calendar-alt"></i> Horarios de Empleados</div>
        <div class="toolbar">
          <button class="btn btn-primary btn-sm" onclick="openScheduleModal()"><i class="fas fa-plus"></i> Agregar Turno</button>
          <button class="btn btn-secondary btn-sm" onclick="exportSchedulePDF()"><i class="fas fa-file-pdf"></i> Exportar PDF</button>
        </div>
      </div>
      <div class="panel-body">
        <div class="cal-nav">
          <button class="btn btn-secondary btn-sm" id="cal-prev"><i class="fas fa-chevron-left"></i></button>
          <h3 id="cal-month-label"></h3>
          <button class="btn btn-secondary btn-sm" id="cal-next"><i class="fas fa-chevron-right"></i></button>
        </div>
        <div class="cal-grid" id="cal-grid"></div>
      </div>
    </div>
    <div class="panel">
      <div class="panel-header"><div class="panel-title"><i class="fas fa-list"></i> Turnos Programados</div>
        <select class="fi fi-sm" id="sched-emp-filter">
          <option value="">Todos los empleados</option>
          ${emps.map(e=>`<option value="${e.id}">${escHtml(e.name)}</option>`).join('')}
        </select>
      </div>
      <div class="table-wrap">
        <table><thead><tr><th>Empleado</th><th>Día</th><th>Fecha</th><th>Entrada</th><th>Salida</th><th>Descanso</th><th>Notas</th><th>Acciones</th></tr></thead>
        <tbody id="sched-tbody"></tbody></table>
      </div>
    </div>
  `;

  let calDate = new Date();
  renderCalendar(calDate);
  renderSchedTable();

  $a('#cal-prev')?.addEventListener('click', () => { calDate.setMonth(calDate.getMonth()-1); renderCalendar(calDate); });
  $a('#cal-next')?.addEventListener('click', () => { calDate.setMonth(calDate.getMonth()+1); renderCalendar(calDate); });
  $a('#sched-emp-filter')?.addEventListener('change', renderSchedTable);
}

function renderCalendar(d) {
  const label = $a('#cal-month-label');
  if (label) label.textContent = d.toLocaleDateString('es-PR', { month: 'long', year: 'numeric' }).replace(/^\w/, c => c.toUpperCase());

  const grid = $a('#cal-grid');
  if (!grid) return;

  const days = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];
  const year = d.getFullYear(), month = d.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month+1, 0).getDate();
  const today = new Date().toISOString().split('T')[0];
  const schedules = DB.get('schedules');

  let html = days.map(day => `<div class="cal-day-head">${day}</div>`).join('');

  for (let i = 0; i < firstDay; i++) html += `<div class="cal-cell other-month"></div>`;

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
    const dayScheds = schedules.filter(s => s.date === dateStr);
    html += `
      <div class="cal-cell ${dateStr === today ? 'today' : ''}">
        <div class="cal-date">${day}</div>
        ${dayScheds.map(s => `<div class="cal-event shift" title="${escHtml(s.empName)}: ${s.start}-${s.end}">${escHtml(s.empName.split(' ')[0])} ${s.start}</div>`).join('')}
      </div>
    `;
  }
  grid.innerHTML = html;
}

function renderSchedTable() {
  const empFilter = $a('#sched-emp-filter')?.value||'';
  let scheds = DB.get('schedules');
  if (empFilter) scheds = scheds.filter(s => s.empId == empFilter);
  const tbody = $a('#sched-tbody');
  if (!tbody) return;
  tbody.innerHTML = scheds.length ? [...scheds].sort((a,b) => a.date < b.date ? 1 : -1).map(s => `
    <tr>
      <td class="cell-bold">${escHtml(s.empName)}</td><td>${escHtml(s.dayLabel||'-')}</td>
      <td>${formatDate(s.date)}</td><td>${s.start}</td><td>${s.end}</td>
      <td>${escHtml(s.breakTime||'-')}</td><td>${escHtml(s.notes||'-')}</td>
      <td><button class="btn btn-danger btn-sm btn-icon" onclick="deleteSched(${s.id})"><i class="fas fa-trash"></i></button></td>
    </tr>
  `).join('') : `<tr><td colspan="8" style="text-align:center;padding:32px;color:var(--gray)">No hay turnos programados</td></tr>`;
}

window.openScheduleModal = function() {
  const emps = DB.get('employees').filter(e => e.role !== 'superadmin');
  const div = document.createElement('div');
  div.className = 'modal-overlay';
  div.innerHTML = `
    <div class="modal-box">
      <div class="modal-hd"><h4>Agregar Turno</h4><button class="modal-close" onclick="this.closest('.modal-overlay').remove()"><i class="fas fa-times"></i></button></div>
      <div class="modal-bd">
        <div class="form-row col1"><div class="fg"><label>Empleado *</label><select class="fi" id="sc-emp">
          <option value="">-- Seleccionar --</option>
          ${emps.map(e=>`<option value="${e.id}" data-name="${escHtml(e.name)}">${escHtml(e.name)}</option>`).join('')}
        </select></div></div>
        <div class="form-row"><div class="fg"><label>Fecha *</label><input class="fi" id="sc-date" type="date" value="${new Date().toISOString().split('T')[0]}"></div>
        <div class="fg"><label>Día</label><input class="fi" id="sc-day" placeholder="Lunes, Martes..." readonly></div></div>
        <div class="form-row"><div class="fg"><label>Hora Entrada *</label><input class="fi" id="sc-start" type="time" value="09:00"></div>
        <div class="fg"><label>Hora Salida *</label><input class="fi" id="sc-end" type="time" value="17:00"></div></div>
        <div class="form-row"><div class="fg"><label>Tiempo de Descanso</label><input class="fi" id="sc-break" placeholder="1 hora, 30 min..." value="1 hora"></div>
        <div class="fg"><label>Notas</label><input class="fi" id="sc-notes" placeholder="Notas opcionales..."></div></div>
        <div style="display:flex;justify-content:flex-end;gap:10px;margin-top:20px">
          <button class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">Cancelar</button>
          <button class="btn btn-primary" onclick="saveSched(this)"><i class="fas fa-save"></i> Guardar Turno</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(div);
  $a('#sc-date', div)?.addEventListener('change', e => {
    const days = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
    const d = new Date(e.target.value + 'T12:00:00');
    $a('#sc-day', div).value = days[d.getDay()];
  });
  // Trigger for today
  const today = new Date();
  const days = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
  $a('#sc-day', div).value = days[today.getDay()];
};

window.saveSched = function(btn) {
  const modal = btn.closest('.modal-overlay');
  const get = sel => $a(sel, modal)?.value.trim();
  const empId = get('#sc-emp'), date = get('#sc-date'), start = get('#sc-start'), end = get('#sc-end');
  if (!empId || !date || !start || !end) { adminToast('Completa todos los campos requeridos.', 'error'); return; }
  const empOpt = $a(`#sc-emp option[value="${empId}"]`, modal);
  const scheds = DB.get('schedules');
  scheds.push({ id: DB.nextId('schedules'), empId: parseInt(empId), empName: empOpt?.dataset.name||'', date, dayLabel: get('#sc-day'), start, end, breakTime: get('#sc-break'), notes: get('#sc-notes') });
  DB.set('schedules', scheds);
  modal.remove(); adminToast('Turno guardado.', 'success');
  renderSchedTable();
  // Refresh calendar
  const label = $a('#cal-month-label');
  if (label) renderCalendar(new Date());
};

window.deleteSched = function(id) {
  confirm2('Eliminar Turno', '¿Eliminar este turno?', () => {
    DB.set('schedules', DB.get('schedules').filter(s => s.id !== id));
    adminToast('Turno eliminado.', 'success'); renderSchedTable();
  });
};

window.exportSchedulePDF = function() {
  const scheds = DB.get('schedules');
  const content = `
    <html><head><title>Horario - Xtreme Mobile Inc.</title>
    <style>
      body { font-family: Arial, sans-serif; padding: 32px; color: #333; }
      h1 { color: #DA0021; text-align: center; margin-bottom: 4px; }
      .subtitle { text-align: center; color: #666; margin-bottom: 24px; font-size: 14px; }
      table { width: 100%; border-collapse: collapse; }
      th { background: #DA0021; color: white; padding: 10px 12px; text-align: left; font-size: 13px; }
      td { padding: 9px 12px; border-bottom: 1px solid #eee; font-size: 13px; }
      tr:nth-child(even) td { background: #f9f9f9; }
      .footer { margin-top: 40px; display: flex; justify-content: space-between; font-size: 12px; color: #999; }
      .sig { margin-top: 48px; border-top: 1px solid #333; width: 200px; text-align: center; padding-top: 8px; font-size: 12px; }
    </style></head>
    <body>
      <h1>Xtreme Mobile Inc.</h1>
      <div class="subtitle">Plaza San Cristóbal, Barranquitas, PR | 787-205-2220</div>
      <h2 style="text-align:center;color:#555;font-size:16px;margin-bottom:20px">HORARIO DE EMPLEADOS — ${new Date().toLocaleDateString('es-PR',{month:'long',year:'numeric'}).toUpperCase()}</h2>
      <table>
        <tr><th>Empleado</th><th>Día</th><th>Fecha</th><th>Hora Entrada</th><th>Hora Salida</th><th>Descanso</th><th>Notas</th></tr>
        ${scheds.sort((a,b)=>a.date>b.date?1:-1).map(s => `<tr><td><strong>${escHtml(s.empName)}</strong></td><td>${escHtml(s.dayLabel||'-')}</td><td>${new Date(s.date+'T12:00:00').toLocaleDateString('es-PR')}</td><td>${s.start}</td><td>${s.end}</td><td>${escHtml(s.breakTime||'-')}</td><td>${escHtml(s.notes||'-')}</td></tr>`).join('')}
      </table>
      <div style="margin-top:40px;display:flex;justify-content:flex-end">
        <div class="sig">Aprobado por: ________________<br>Administración</div>
      </div>
      <div class="footer"><span>Generado: ${new Date().toLocaleDateString('es-PR')}</span><span>Xtreme Mobile Inc. - Uso interno</span></div>
    </body></html>
  `;
  const w = window.open('', '_blank');
  w.document.write(content);
  w.document.close();
  setTimeout(() => w.print(), 500);
};

// ── Configuration Module ──────────────────────────────────────────
function renderConfig(container) {
  const config = DB.get('config', {});
  container.innerHTML = `
    <div class="panel">
      <div class="panel-header"><div class="panel-title"><i class="fas fa-cog"></i> Configuración General</div></div>
      <div class="modal-bd" style="max-width:700px">
        <div class="form-row"><div class="fg"><label>Nombre del Negocio</label><input class="fi" id="cfg-name" value="${escHtml(config.businessName||'')}"></div>
        <div class="fg"><label>Teléfono</label><input class="fi" id="cfg-phone" value="${escHtml(config.phone||'')}"></div></div>
        <div class="form-row"><div class="fg"><label>WhatsApp</label><input class="fi" id="cfg-wa" value="${escHtml(config.whatsapp||'')}"></div>
        <div class="fg"><label>Correo</label><input class="fi" id="cfg-email" value="${escHtml(config.email||'')}"></div></div>
        <div class="form-row col1"><div class="fg"><label>Dirección</label><input class="fi" id="cfg-addr" value="${escHtml(config.address||'')}"></div></div>
        <div class="form-row"><div class="fg"><label>Instagram URL</label><input class="fi" id="cfg-ig" value="${escHtml(config.instagram||'')}"></div>
        <div class="fg"><label>Facebook URL</label><input class="fi" id="cfg-fb" value="${escHtml(config.facebook||'')}"></div></div>
        <div class="form-row col1"><div class="fg"><label>Texto "Sobre Nosotros"</label><textarea class="fi" id="cfg-about" rows="4">${escHtml(config.about||'')}</textarea></div></div>
        <div style="margin-top:20px">
          <button class="btn btn-primary" onclick="saveConfig()"><i class="fas fa-save"></i> Guardar Configuración</button>
        </div>
        <hr class="divider">
        <h4 style="font-family:var(--font-ui);color:var(--white);margin-bottom:16px">Cambiar Contraseña</h4>
        <div class="form-row col1"><div class="fg"><label>Contraseña Actual</label><input class="fi" id="pw-current" type="password"></div></div>
        <div class="form-row"><div class="fg"><label>Nueva Contraseña</label><input class="fi" id="pw-new" type="password"></div>
        <div class="fg"><label>Confirmar Nueva Contraseña</label><input class="fi" id="pw-confirm" type="password"></div></div>
        <div style="margin-top:16px"><button class="btn btn-secondary" onclick="changePassword()"><i class="fas fa-lock"></i> Cambiar Contraseña</button></div>
      </div>
    </div>
  `;
}

window.saveConfig = function() {
  const get = id => document.getElementById(id)?.value.trim();
  const config = { businessName: get('cfg-name'), phone: get('cfg-phone'), whatsapp: get('cfg-wa'), email: get('cfg-email'), address: get('cfg-addr'), instagram: get('cfg-ig'), facebook: get('cfg-fb'), about: get('cfg-about') };
  DB.set('config', config);
  AUTH.logActivity('update', 'Configuración general actualizada');
  adminToast('Configuración guardada exitosamente.', 'success');
};

window.changePassword = function() {
  const current = document.getElementById('pw-current')?.value;
  const newPw = document.getElementById('pw-new')?.value;
  const confirm = document.getElementById('pw-confirm')?.value;
  const session = AUTH.getSession();
  const users = AUTH.getUsers();
  const user = users.find(u => u.username === session.username && u.password === current);
  if (!user) { adminToast('Contraseña actual incorrecta.', 'error'); return; }
  if (newPw !== confirm) { adminToast('Las contraseñas nuevas no coinciden.', 'error'); return; }
  if (newPw.length < 8) { adminToast('La contraseña debe tener al menos 8 caracteres.', 'error'); return; }
  const idx = users.findIndex(u => u.id === user.id);
  users[idx].password = newPw;
  AUTH.saveUsers(users);
  adminToast('Contraseña cambiada exitosamente.', 'success');
  ['pw-current','pw-new','pw-confirm'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
};

// ── Logs Module ───────────────────────────────────────────────────
function renderLogs(container) {
  let logs = [];
  try {
    logs = JSON.parse(XMI_STORAGE.getItem('xmi_logs') || '[]');
    if (!Array.isArray(logs)) logs = [];
  } catch {
    XMI_STORAGE.removeItem('xmi_logs');
    logs = [];
  }
  container.innerHTML = `
    <div class="panel">
      <div class="panel-header"><div class="panel-title"><i class="fas fa-history"></i> Registro de Actividad</div></div>
      <div class="table-wrap">
        <table><thead><tr><th>Fecha/Hora</th><th>Usuario</th><th>Tipo</th><th>Descripción</th></tr></thead>
        <tbody>
          ${logs.length ? logs.map(l => `
            <tr>
              <td style="font-size:12px;white-space:nowrap">${new Date(l.timestamp).toLocaleString('es-PR')}</td>
              <td class="cell-bold">${escHtml(l.user)}</td>
              <td><span class="badge ${l.type==='login'?'badge-green':l.type==='delete'?'badge-red':l.type==='update'?'badge-yellow':'badge-blue'}">${l.type}</span></td>
              <td>${escHtml(l.description)}</td>
            </tr>
          `).join('') : `<tr><td colspan="4" style="text-align:center;padding:32px;color:var(--gray)">No hay actividad registrada</td></tr>`}
        </tbody></table>
      </div>
    </div>
  `;
}

// ── CSV Export Utility ────────────────────────────────────────────
function downloadCSV(rows, filename) {
  const csv = rows.map(r => r.map(c => `"${String(c||'').replace(/"/g,'""')}"`).join(',')).join('\n');
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}

// ── Charts ────────────────────────────────────────────────────────
function initWeeklySalesChart(sales) {
  const canvas = document.getElementById('chart-sales-week');
  if (!canvas || !window.Chart) return;
  const days = [], totals = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate()-i);
    const dateStr = d.toISOString().split('T')[0];
    const dayLabel = d.toLocaleDateString('es-PR',{weekday:'short'});
    const total = sales.filter(s=>s.date===dateStr).reduce((sum,s)=>sum+parseFloat(s.price||0),0);
    days.push(dayLabel); totals.push(total.toFixed(2));
  }
  new Chart(canvas, { type:'bar', data: { labels:days, datasets:[{ label:'Ventas ($)', data:totals, backgroundColor:'rgba(218,0,33,0.6)', borderColor:'rgba(218,0,33,1)', borderWidth:1, borderRadius:6 }] }, options: { responsive:true, maintainAspectRatio:false, plugins:{ legend:{ display:false } }, scales:{ y:{ beginAtZero:true, grid:{ color:'rgba(255,255,255,0.05)' }, ticks:{ color:'#7878A0' } }, x:{ grid:{ display:false }, ticks:{ color:'#7878A0' } } } } });
}

function initRequestsChart(requests) {
  const canvas = document.getElementById('chart-requests');
  if (!canvas || !window.Chart) return;
  const statCounts = { received:0, review:0, docs_pending:0, approved:0, denied:0, completed:0 };
  requests.forEach(r => { if (statCounts[r.status]!==undefined) statCounts[r.status]++; });
  const labels = ['Recibida','En Revisión','Docs. Pend.','Aprobada','Denegada','Completada'];
  const data = [statCounts.received, statCounts.review, statCounts.docs_pending, statCounts.approved, statCounts.denied, statCounts.completed];

  new Chart(canvas, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: ['#2196F3', '#FFB300', '#FF7043', '#00C851', '#FF1A3A', '#9C27B0'],
        borderColor: '#1E1E2C',
        borderWidth: 3
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { color: '#E0E0F0', padding: 16 }
        }
      }
    }
  });
}

function initMonthlyChart() {
  const canvas = document.getElementById('stat-monthly');
  if (!canvas || !window.Chart) return;

  const sales = DB.get('sales');
  const labels = [];
  const totals = [];

  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    labels.push(d.toLocaleDateString('es-PR', { month: 'short' }));
    totals.push(
      sales
        .filter(s => String(s.date || '').startsWith(key))
        .reduce((sum, s) => sum + parseFloat(s.price || 0), 0)
        .toFixed(2)
    );
  }

  new Chart(canvas, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Ventas ($)',
        data: totals,
        backgroundColor: 'rgba(218,0,33,0.6)',
        borderColor: 'rgba(218,0,33,1)',
        borderWidth: 1,
        borderRadius: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: 'rgba(255,255,255,0.05)' },
          ticks: { color: '#7878A0' }
        },
        x: {
          grid: { display: false },
          ticks: { color: '#7878A0' }
        }
      }
    }
  });
}

function initCategoryChart() {
  const canvas = document.getElementById('stat-category');
  if (!canvas || !window.Chart) return;

  const sales = DB.get('sales');
  const inventory = DB.get('inventory');
  const categoryTotals = {};

  sales.forEach(sale => {
    const product = inventory.find(item => item.name === sale.product);
    const category = product?.category || 'Otros';
    categoryTotals[category] = (categoryTotals[category] || 0) + parseFloat(sale.price || 0);
  });

  new Chart(canvas, {
    type: 'pie',
    data: {
      labels: Object.keys(categoryTotals),
      datasets: [{
        data: Object.values(categoryTotals),
        backgroundColor: ['#DA0021', '#2196F3', '#00C851', '#FFB300', '#9C27B0', '#FF7043'],
        borderColor: '#1E1E2C',
        borderWidth: 3
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { color: '#E0E0F0', padding: 16 }
        }
      }
    }
  });
}

function initRequestsStatusChart() {
  const canvas = document.getElementById('stat-requests');
  if (!canvas || !window.Chart) return;

  const requests = DB.get('requests');
  const counts = { received:0, review:0, docs_pending:0, approved:0, denied:0, completed:0 };
  requests.forEach(r => { if (counts[r.status] !== undefined) counts[r.status]++; });

  new Chart(canvas, {
    type: 'bar',
    data: {
      labels: ['Recibida', 'En Revision', 'Docs. Pend.', 'Aprobada', 'Denegada', 'Completada'],
      datasets: [{
        label: 'Solicitudes',
        data: [counts.received, counts.review, counts.docs_pending, counts.approved, counts.denied, counts.completed],
        backgroundColor: ['#2196F3', '#FFB300', '#FF7043', '#00C851', '#FF1A3A', '#9C27B0'],
        borderRadius: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: 'rgba(255,255,255,0.05)' },
          ticks: { color: '#7878A0', stepSize: 1 }
        },
        x: {
          grid: { display: false },
          ticks: { color: '#7878A0' }
        }
      }
    }
  });
}

function initReviewsChart() {
  const canvas = document.getElementById('stat-reviews');
  if (!canvas || !window.Chart) return;

  const reviews = DB.get('reviews');
  const counts = [1, 2, 3, 4, 5].map(rating => reviews.filter(r => r.rating === rating).length);

  new Chart(canvas, {
    type: 'line',
    data: {
      labels: ['1 Star', '2 Star', '3 Star', '4 Star', '5 Star'],
      datasets: [{
        label: 'Resenas',
        data: counts,
        fill: true,
        tension: 0.35,
        backgroundColor: 'rgba(255,179,0,0.12)',
        borderColor: '#FFB300',
        pointBackgroundColor: '#FFB300',
        pointBorderColor: '#FFB300',
        pointRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: 'rgba(255,255,255,0.05)' },
          ticks: { color: '#7878A0', stepSize: 1 }
        },
        x: {
          grid: { display: false },
          ticks: { color: '#7878A0' }
        }
      }
    }
  });
}
