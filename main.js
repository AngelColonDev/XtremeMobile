/* ================================================================
   XTREME MOBILE INC. - MAIN JAVASCRIPT
   ================================================================ */

// ── Data Store (simulates backend) ─────────────────────────────
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

const XMI = {
  VERSION: '1.0.0',
  WHATSAPP: '17872052220',
  BUSINESS: 'Xtreme Mobile Inc.',
  SOCIAL: {
    instagram: 'https://www.instagram.com/xtremem0bile?igsh=MThnNWk4MnhkbW9ldw==',
    facebook: 'https://www.facebook.com/share/1HbDgezvSr/?mibextid=wwXIfr',
    whatsapp: 'https://wa.me/17872052220'
  },

  // Simulated requests storage
  getRequests() { return JSON.parse(XMI_STORAGE.getItem('xmi_requests') || '[]'); },
  saveRequests(r) { XMI_STORAGE.setItem('xmi_requests', JSON.stringify(r)); },
  getReviews() { return JSON.parse(XMI_STORAGE.getItem('xmi_reviews') || JSON.stringify(sampleReviews)); },
  saveReviews(r) { XMI_STORAGE.setItem('xmi_reviews', JSON.stringify(r)); },
  getOffers() { return JSON.parse(XMI_STORAGE.getItem('xmi_offers') || JSON.stringify(sampleOffers)); },
  getInventory() { return JSON.parse(XMI_STORAGE.getItem('xmi_inventory') || JSON.stringify(sampleInventory)); },

  generateRequestNumber() {
    const reqs = this.getRequests();
    const num = String(reqs.length + 1).padStart(4, '0');
    const year = new Date().getFullYear();
    return `XMI-${year}-${num}`;
  }
};

const sampleReviews = [
  { id: 1, name: 'María González', rating: 5, comment: 'Excelente servicio, me ayudaron a conseguir mi teléfono gratis sin complicaciones. El personal es muy atento y profesional.', date: '2026-05-15', status: 'approved' },
  { id: 2, name: 'Carlos Rivera', rating: 5, comment: 'Los mejores en accesorios para celulares en Barranquitas. Encontré el cover perfecto para mi iPhone a buen precio.', date: '2026-05-18', status: 'approved' },
  { id: 3, name: 'Ana Rodríguez', rating: 4, comment: 'Muy buena atención al cliente. Me explicaron todo el proceso de solicitud de teléfono gratis claramente. Recomendado.', date: '2026-05-20', status: 'approved' }
];

const sampleOffers = [
  { id: 1, title: 'Teléfono Gratis Lifeline', description: 'Califica para recibir un smartphone completamente gratis a través del programa Lifeline federal. ¡Verifica tu elegibilidad hoy!', price: 'GRATIS', expiry: '2026-12-31', emoji: '📱', tag: 'PROGRAMA FEDERAL', active: true },
  { id: 2, title: 'Paquete Accesorios Plus', description: 'Cover + Protector de pantalla + Cargador rápido por solo $24.99. Compatible con todos los modelos principales.', price: '$24.99', expiry: '2026-06-30', emoji: '🛡️', tag: 'OFERTA ESPECIAL', active: true },
  { id: 3, title: 'Audífonos Bluetooth', description: 'Audífonos inalámbricos de alta calidad con cancelación de ruido. Sonido premium para tus llamadas y música.', price: '$29.99', expiry: '2026-06-15', emoji: '🎧', tag: 'NUEVO', active: true }
];

const sampleInventory = [
  { id: 1, name: 'Samsung Galaxy A15', category: 'Celulares', brand: 'Samsung', qty: 5, price: 149.99, status: 'available', emoji: '📱' },
  { id: 2, name: 'Cover iPhone 15', category: 'Covers', brand: 'Genérico', qty: 20, price: 9.99, status: 'available', emoji: '🛡️' },
  { id: 3, name: 'Protector Pantalla Universal', category: 'Protectores', brand: 'Varios', qty: 3, price: 4.99, status: 'low', emoji: '🪟' }
];

const PR_TOWNS = ["Adjuntas","Aguada","Aguadilla","Aguas Buenas","Aibonito","Añasco","Arecibo","Arroyo","Barceloneta","Barranquitas","Bayamón","Cabo Rojo","Caguas","Camuy","Canóvanas","Carolina","Cataño","Cayey","Ceiba","Ciales","Cidra","Coamo","Comerío","Corozal","Culebra","Dorado","Fajardo","Florida","Guánica","Guayama","Guayanilla","Guaynabo","Gurabo","Hatillo","Hormigueros","Humacao","Isabela","Jayuya","Juana Díaz","Juncos","Lajas","Lares","Las Marías","Las Piedras","Loíza","Luquillo","Manatí","Maricao","Maunabo","Mayagüez","Moca","Morovis","Naguabo","Naranjito","Orocovis","Patillas","Peñuelas","Ponce","Quebradillas","Rincón","Río Grande","Sabana Grande","Salinas","San Germán","San Juan","San Lorenzo","San Sebastián","Santa Isabel","Toa Alta","Toa Baja","Trujillo Alto","Utuado","Vega Alta","Vega Baja","Vieques","Villalba","Yabucoa","Yauco"];

// ── Utility Functions ───────────────────────────────────────────
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

function toast(message, type = 'info') {
  const t = document.createElement('div');
  const icons = { success: 'fa-check-circle', error: 'fa-exclamation-circle', info: 'fa-info-circle', warning: 'fa-exclamation-triangle' };
  t.className = `toast ${type}`;
  t.innerHTML = `<i class="fas ${icons[type] || icons.info}"></i><span>${message}</span>`;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 4200);
}

function openWhatsApp(msg = '') {
  const text = encodeURIComponent(msg || '¡Hola! Me interesa obtener información sobre los productos y servicios de Xtreme Mobile Inc.');
  window.open(`https://wa.me/${XMI.WHATSAPP}?text=${text}`, '_blank');
}

function openModal(id) {
  const m = document.getElementById(id);
  if (m) { m.style.display = 'flex'; document.body.style.overflow = 'hidden'; }
}
function closeModal(id) {
  const m = document.getElementById(id);
  if (m) { m.style.display = 'none'; document.body.style.overflow = ''; }
}

// Build PR town dropdown
function buildTownSelect(sel) {
  sel.innerHTML = '<option value="">-- Seleccionar pueblo --</option>' +
    PR_TOWNS.map(t => `<option value="${t}">${t}</option>`).join('');
}

// ── Page Loader ─────────────────────────────────────────────────
window.addEventListener('load', () => {
  const loader = document.getElementById('page-loader');
  if (loader) {
    setTimeout(() => {
      loader.style.opacity = '0';
      setTimeout(() => loader.remove(), 500);
    }, 1400);
  }
});

// ── Navbar ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.getElementById('navbar');
  const toggle = document.getElementById('nav-toggle');
  const menu = document.getElementById('nav-menu');

  // Scroll effect
  window.addEventListener('scroll', () => {
    navbar?.classList.toggle('scrolled', window.scrollY > 40);
    // Active section tracking
    $$('.section[id]').forEach(sec => {
      const top = sec.offsetTop - 90;
      const bottom = top + sec.offsetHeight;
      if (window.scrollY >= top && window.scrollY < bottom) {
        $$('.nav-link').forEach(l => l.classList.remove('active'));
        const link = $$(`.nav-link[href="#${sec.id}"]`);
        if (link.length) link[0].classList.add('active');
      }
    });
  });

  // Mobile toggle
  toggle?.addEventListener('click', () => menu?.classList.toggle('open'));

  // Close menu on link click
  $$('.nav-link').forEach(l => l.addEventListener('click', () => menu?.classList.remove('open')));

  // WhatsApp buttons
  $$('[data-whatsapp]').forEach(btn => {
    btn.addEventListener('click', () => openWhatsApp(btn.dataset.whatsapp || ''));
  });

  // Scroll reveal
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
  }, { threshold: 0.1 });
  $$('.reveal').forEach(el => observer.observe(el));

  // Init modules
  initStats();
  initOffers();
  initReviews();
  initFreePhoneForm();
  initStatusCheck();
  buildTownDropdowns();
  initScrollCounters();
});

// ── Animated Counters ───────────────────────────────────────────
function initScrollCounters() {
  const counters = $$('[data-count]');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const el = e.target;
        const target = parseInt(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        let current = 0;
        const step = Math.ceil(target / 60);
        const timer = setInterval(() => {
          current = Math.min(current + step, target);
          el.textContent = current.toLocaleString() + suffix;
          if (current >= target) clearInterval(timer);
        }, 20);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => obs.observe(c));
}

// ── Town Dropdowns ──────────────────────────────────────────────
function buildTownDropdowns() {
  $$('select[data-towns]').forEach(sel => buildTownSelect(sel));
}

// ── Stats ───────────────────────────────────────────────────────
function initStats() {
  const reqs = XMI.getRequests();
  const approved = reqs.filter(r => r.status === 'approved').length;
  // These would update from real data
}

// ── Offers ──────────────────────────────────────────────────────
function initOffers() {
  const container = document.getElementById('offers-container');
  if (!container) return;
  const offers = XMI.getOffers().filter(o => o.active);
  if (!offers.length) {
    container.innerHTML = '<div class="no-reviews">No hay ofertas disponibles en este momento. ¡Vuelve pronto!</div>';
    return;
  }
  container.innerHTML = offers.map(o => `
    <div class="offer-card reveal">
      <div class="offer-img">
        <span style="font-size:64px">${o.emoji}</span>
        <div class="offer-badge-tag">${o.tag}</div>
      </div>
      <div class="offer-body">
        <h3 class="offer-title">${o.title}</h3>
        <p class="offer-desc">${o.description}</p>
        <div class="offer-price">${o.price}</div>
        <div class="offer-expiry"><i class="fas fa-calendar-alt" style="color:var(--gray);margin-right:5px"></i>Válido hasta: ${formatDate(o.expiry)}</div>
        <button class="btn btn-whatsapp btn-block" onclick="openWhatsApp('Hola, me interesa la oferta: ${o.title}')">
          <i class="fab fa-whatsapp"></i> Consultar por WhatsApp
        </button>
      </div>
    </div>
  `).join('');

  // Re-observe new elements
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.1 });
  $$('#offers-container .reveal').forEach(el => obs.observe(el));
}

function formatDate(str) {
  if (!str) return 'Sin fecha';
  const d = new Date(str + 'T12:00:00');
  return d.toLocaleDateString('es-PR', { year: 'numeric', month: 'long', day: 'numeric' });
}

// ── Reviews ─────────────────────────────────────────────────────
let selectedRating = 0;

function initReviews() {
  renderApprovedReviews();

  // Star buttons
  $$('.star-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedRating = parseInt(btn.dataset.star);
      $$('.star-btn').forEach(b => b.classList.toggle('active', parseInt(b.dataset.star) <= selectedRating));
    });
  });

  // Review form submit
  const form = document.getElementById('review-form');
  form?.addEventListener('submit', e => {
    e.preventDefault();
    const name = $('#review-name').value.trim();
    const comment = $('#review-comment').value.trim();
    if (!name || !comment || !selectedRating) {
      toast('Por favor completa todos los campos y selecciona una calificación.', 'error');
      return;
    }
    const reviews = XMI.getReviews();
    reviews.push({ id: Date.now(), name, rating: selectedRating, comment, date: new Date().toISOString().split('T')[0], status: 'pending' });
    XMI.saveReviews(reviews);
    form.reset();
    selectedRating = 0;
    $$('.star-btn').forEach(b => b.classList.remove('active'));
    toast('¡Gracias por tu reseña! Será publicada después de revisión.', 'success');
  });
}

function renderApprovedReviews() {
  const container = document.getElementById('reviews-list');
  if (!container) return;
  const reviews = XMI.getReviews().filter(r => r.status === 'approved');
  if (!reviews.length) {
    container.innerHTML = '<div class="no-reviews"><i class="fas fa-star" style="font-size:32px;color:var(--gray);display:block;margin-bottom:12px"></i>Sé el primero en dejar una reseña</div>';
    return;
  }
  container.innerHTML = reviews.map(r => `
    <div class="review-card">
      <div class="review-header">
        <div>
          <div class="reviewer-name">${escHtml(r.name)}</div>
          <div class="reviewer-date">${formatDate(r.date)}</div>
        </div>
        <span style="color:var(--warning);font-size:16px">⭐ ${r.rating}/5</span>
      </div>
      <div class="review-stars">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</div>
      <div class="review-text">${escHtml(r.comment)}</div>
    </div>
  `).join('');
}

// ── Free Phone Form ─────────────────────────────────────────────
let currentStep = 1;
let formData = {};
let uploadedDocs = { ssn: null, id: null };

function initFreePhoneForm() {
  // Open modal
  $$('[data-open-form]').forEach(btn => btn.addEventListener('click', () => {
    openModal('form-modal');
    gotoStep(1);
  }));

  // Close modal
  $$('[data-close-modal]').forEach(btn => btn.addEventListener('click', () => {
    if (confirm('¿Estás seguro que deseas cerrar el formulario? Los datos no guardados se perderán.')) {
      closeModal('form-modal');
      resetForm();
    }
  }));

  // Close on overlay click
  document.getElementById('form-modal')?.addEventListener('click', e => {
    if (e.target === e.currentTarget) {
      if (confirm('¿Cerrar el formulario?')) { closeModal('form-modal'); resetForm(); }
    }
  });

  // Dependent toggle
  const dependentQ = document.getElementById('has-dependent');
  dependentQ?.querySelectorAll('input[type=radio]').forEach(r => {
    r.addEventListener('change', () => {
      const show = r.value === 'yes';
      document.getElementById('dependent-fields').style.display = show ? 'block' : 'none';
    });
  });

  // Same address toggle
  const sameAddrQ = document.getElementById('same-address');
  sameAddrQ?.querySelectorAll('input[type=radio]').forEach(r => {
    r.addEventListener('change', () => {
      const show = r.value === 'no';
      document.getElementById('postal-fields').style.display = show ? 'block' : 'none';
    });
  });

  // File uploads
  initFileUpload('ssn-upload', 'ssn-previews', 'ssn');
  initFileUpload('id-upload', 'id-previews', 'id');

  // Step navigation buttons
  document.getElementById('step-next-1')?.addEventListener('click', () => validateAndNext(1));
  document.getElementById('step-next-2')?.addEventListener('click', () => validateAndNext(2));
  document.getElementById('step-next-3')?.addEventListener('click', () => validateAndNext(3));
  document.getElementById('step-next-4')?.addEventListener('click', () => validateAndNext(4));
  $$('[data-prev-step]').forEach(btn => btn.addEventListener('click', () => gotoStep(parseInt(btn.dataset.prevStep))));

  document.getElementById('submit-form')?.addEventListener('click', submitForm);
}

function gotoStep(step) {
  currentStep = step;
  $$('.form-section').forEach(s => s.classList.remove('active'));
  document.getElementById(`step-${step}`)?.classList.add('active');

  $$('.step-item').forEach((item, i) => {
    item.classList.remove('active', 'done');
    if (i + 1 < step) item.classList.add('done');
    if (i + 1 === step) item.classList.add('active');
  });

  if (step === 5) buildReview();
  document.getElementById('form-modal')?.querySelector('.modal-body')?.scrollTo(0, 0);
}

function validateAndNext(step) {
  // Basic validation per step
  const requiredFields = {
    1: ['applicant-ssn', 'applicant-dob', 'applicant-first', 'applicant-last', 'applicant-phone', 'service-date'],
    2: [], // Optional step
    3: [], // Toggle based
    4: [] // File upload – not strictly required for demo
  };
  const fields = requiredFields[step] || [];
  let valid = true;

  fields.forEach(id => {
    const el = document.getElementById(id);
    if (el && !el.value.trim()) {
      el.classList.add('error');
      valid = false;
      el.addEventListener('input', () => el.classList.remove('error'), { once: true });
    }
  });

  if (!valid) { toast('Por favor completa todos los campos requeridos.', 'error'); return; }
  gotoStep(step + 1);
}

function buildReview() {
  const fields = {
    'Nombre': [document.getElementById('applicant-first')?.value, document.getElementById('applicant-last')?.value].filter(Boolean).join(' '),
    'Fecha de Nacimiento': document.getElementById('applicant-dob')?.value || '-',
    'Teléfono': document.getElementById('applicant-phone')?.value || '-',
    'Fecha de Solicitud': document.getElementById('service-date')?.value || '-',
    'SSN (enmascarado)': maskSSN(document.getElementById('applicant-ssn')?.value || ''),
    'Dependiente': document.querySelector('[name="has-dependent"]:checked')?.value === 'yes' ? 'Sí' : 'No',
    'Dirección postal diferente': document.querySelector('[name="same-address"]:checked')?.value === 'no' ? 'Sí' : 'No',
    'Documentos subidos': `SSN: ${uploadedDocs.ssn ? '✅' : '❌'} | ID: ${uploadedDocs.id ? '✅' : '❌'}`
  };

  const container = document.getElementById('review-summary');
  if (container) {
    container.innerHTML = Object.entries(fields).map(([k, v]) => `
      <div class="review-item">
        <span class="review-label">${k}</span>
        <span class="review-value${k.includes('SSN') ? ' sensitive' : ''}">${v || '-'}</span>
      </div>
    `).join('');
  }
}

function maskSSN(ssn) {
  if (!ssn) return '***-**-****';
  const clean = ssn.replace(/\D/g, '');
  return `***-**-${clean.slice(-4) || '****'}`;
}

function submitForm() {
  const confirmBox = document.getElementById('confirm-auth');
  if (!confirmBox?.checked) {
    toast('Debes confirmar la autorización antes de enviar.', 'error');
    return;
  }

  const num = XMI.generateRequestNumber();
  const request = {
    id: num,
    status: 'received',
    date: new Date().toISOString(),
    applicant: {
      first: document.getElementById('applicant-first')?.value || '',
      last: document.getElementById('applicant-last')?.value || '',
      phone: document.getElementById('applicant-phone')?.value || '',
      dob: document.getElementById('applicant-dob')?.value || '',
      ssn_masked: maskSSN(document.getElementById('applicant-ssn')?.value || ''),
      serviceDate: document.getElementById('service-date')?.value || ''
    },
    notes: '',
    internalNotes: []
  };

  const reqs = XMI.getRequests();
  reqs.push(request);
  XMI.saveRequests(reqs);

  // Show success
  document.getElementById('generated-number').textContent = num;
  gotoStep(6);
  toast('¡Solicitud enviada exitosamente!', 'success');
}

function resetForm() {
  document.getElementById('free-phone-form')?.reset();
  gotoStep(1);
  uploadedDocs = { ssn: null, id: null };
  formData = {};
  $$('.file-previews').forEach(c => c.innerHTML = '');
}

// ── File Upload ─────────────────────────────────────────────────
function initFileUpload(zoneId, previewId, type) {
  const zone = document.getElementById(zoneId);
  const preview = document.getElementById(previewId);
  const input = zone?.querySelector('input[type=file]');
  if (!zone || !preview || !input) return;

  zone.addEventListener('click', () => input.click());
  zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('dragover'); });
  zone.addEventListener('dragleave', () => zone.classList.remove('dragover'));
  zone.addEventListener('drop', e => {
    e.preventDefault(); zone.classList.remove('dragover');
    handleFiles(e.dataTransfer.files, preview, type);
  });
  input.addEventListener('change', () => handleFiles(input.files, preview, type));
}

function handleFiles(files, previewEl, type) {
  Array.from(files).forEach(file => {
    if (!['image/jpeg','image/png','application/pdf'].includes(file.type)) {
      toast('Formato no válido. Use JPG, PNG o PDF.', 'error'); return;
    }
    uploadedDocs[type] = file.name;
    const reader = new FileReader();
    reader.onload = e => {
      const div = document.createElement('div');
      div.className = 'file-preview';
      if (file.type === 'application/pdf') {
        div.innerHTML = `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:var(--dark3);font-size:28px">📄</div>`;
      } else {
        div.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
      }
      div.innerHTML += `<div class="file-preview-remove" onclick="this.parentNode.remove();uploadedDocs['${type}']=null;">✕</div>`;
      previewEl.appendChild(div);
    };
    reader.readAsDataURL(file);
  });
}

// ── Status Check ────────────────────────────────────────────────
function initStatusCheck() {
  const form = document.getElementById('status-check-form');
  form?.addEventListener('submit', e => {
    e.preventDefault();
    const num = document.getElementById('check-num')?.value.trim().toUpperCase();
    const verify = document.getElementById('check-verify')?.value.trim();
    if (!num || !verify) { toast('Ingresa el número de solicitud y el campo de verificación.', 'error'); return; }

    const reqs = XMI.getRequests();
    const req = reqs.find(r => r.id === num && (r.applicant.phone === verify || r.applicant.dob === verify));
    const resultDiv = document.getElementById('status-result');

    if (!req) {
      resultDiv.innerHTML = `
        <div class="status-result show" style="background:rgba(218,0,33,0.06);border:1px solid var(--border-red);border-radius:var(--radius);">
          <div class="status-badge status-denied"><i class="fas fa-times-circle"></i> No encontrada</div>
          <p style="color:var(--gray-light);font-size:14px">No encontramos una solicitud con esos datos. Verifica el número y el campo de verificación.</p>
        </div>
      `;
      resultDiv.classList.add('show');
      return;
    }

    const statusMap = {
      received: { cls: 'status-received', icon: 'fa-inbox', label: 'Recibida', msg: 'Tu solicitud fue recibida y está en cola para ser evaluada por nuestro equipo.' },
      review: { cls: 'status-review', icon: 'fa-search', label: 'En Revisión', msg: 'Tu solicitud está siendo evaluada activamente. Te contactaremos pronto.' },
      docs_pending: { cls: 'status-docs', icon: 'fa-file-alt', label: 'Documentos Pendientes', msg: 'Necesitamos documentos adicionales. Visítanos o llámanos al 787-205-2220.' },
      approved: { cls: 'status-approved', icon: 'fa-check-circle', label: '¡Aprobada!', msg: '¡Felicidades! Tu solicitud fue aprobada. Contáctanos para coordinar los próximos pasos.' },
      denied: { cls: 'status-denied', icon: 'fa-times-circle', label: 'Denegada', msg: 'Lamentablemente tu solicitud fue denegada. Puedes visitarnos para más información.' },
      ready: { cls: 'status-ready', icon: 'fa-map-marker-alt', label: 'Lista para Recoger', msg: '¡Tu solicitud está lista! Visítanos en Plaza San Cristóbal, Barranquitas.' },
      completed: { cls: 'status-completed', icon: 'fa-flag-checkered', label: 'Completada', msg: 'Esta solicitud ha sido completada exitosamente. ¡Gracias por confiar en Xtreme Mobile!' }
    };

    const s = statusMap[req.status] || statusMap.received;
    resultDiv.innerHTML = `
      <div class="status-result show" style="background:rgba(255,255,255,0.02);border:1px solid var(--border);border-radius:var(--radius);padding:24px;">
        <div class="status-badge ${s.cls}"><i class="fas ${s.icon}"></i> ${s.label}</div>
        <p style="color:var(--gray-light);line-height:1.7;margin-bottom:12px">${s.msg}</p>
        <p style="font-size:12px;color:var(--gray)">Solicitud: <strong style="color:var(--white)">${req.id}</strong> | Fecha: ${new Date(req.date).toLocaleDateString('es-PR')}</p>
        ${req.notes ? `<div style="margin-top:12px;padding:12px;background:rgba(255,255,255,0.03);border-radius:8px;font-size:13px;color:var(--gray-light)">${escHtml(req.notes)}</div>` : ''}
      </div>
    `;
    resultDiv.classList.add('show');
  });
}

// ── Security Helpers ─────────────────────────────────────────────
function escHtml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ── Smooth scroll ───────────────────────────────────────────────
document.addEventListener('click', e => {
  const link = e.target.closest('a[href^="#"]');
  if (!link) return;
  e.preventDefault();
  const target = document.querySelector(link.getAttribute('href'));
  if (target) {
    const offset = 80;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  }
});

// ── SSN Input Formatter ─────────────────────────────────────────
document.addEventListener('input', e => {
  if (e.target.dataset.ssn !== undefined) {
    let v = e.target.value.replace(/\D/g, '').slice(0, 9);
    if (v.length > 5) v = `${v.slice(0,3)}-${v.slice(3,5)}-${v.slice(5)}`;
    else if (v.length > 3) v = `${v.slice(0,3)}-${v.slice(3)}`;
    e.target.value = v;
  }
  if (e.target.dataset.phone !== undefined) {
    let v = e.target.value.replace(/\D/g, '').slice(0, 10);
    if (v.length > 6) v = `(${v.slice(0,3)}) ${v.slice(3,6)}-${v.slice(6)}`;
    else if (v.length > 3) v = `(${v.slice(0,3)}) ${v.slice(3)}`;
    e.target.value = v;
  }
});
