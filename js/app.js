/* ==========================================================================
   PHYSICS DETECTIVE - Main Application Controller
   Coordinates UI, Simulation 60 FPS Loop, Event Listeners & State
   ========================================================================== */

// 1. Global Navigation & Modal Controls (Always available immediately)
window.openPedagogyGuide = function () {
  const modal = document.getElementById('pedagogyGuideModal');
  if (modal) modal.classList.add('active');
  const tabs = document.querySelectorAll('.tab-btn');
  tabs.forEach(t => {
    if (t.dataset.tab === 'guide') t.classList.add('active');
    else t.classList.remove('active');
  });
};

window.closePedagogyGuide = function () {
  const modal = document.getElementById('pedagogyGuideModal');
  if (modal) modal.classList.remove('active');
  const tabs = document.querySelectorAll('.tab-btn');
  tabs.forEach(t => {
    if (t.dataset.tab === 'campaign') t.classList.add('active');
    else t.classList.remove('active');
  });
};

document.addEventListener('DOMContentLoaded', () => {
  // Ensure PhysicsEngine instance exists
  if (!window.physicsEngine && window.PhysicsEngine) {
    window.physicsEngine = new window.PhysicsEngine();
  }

  // 2. Initialize Renderer
  const renderer = new VectorRenderer('physicsCanvas');
  window.vectorRenderer = renderer;

  window.addEventListener('resize', () => {
    renderer.resize();
  });
  renderer.resize();

  // 3. Initialize Case Selector Chips
  const caseBar = document.getElementById('caseSelectorBar');
  let suppressClick = false;

  if (caseBar) {
    caseBar.innerHTML = window.CASES_DATA.map((c, idx) => `
      <div class="case-chip ${idx === 0 ? 'active' : ''}" data-case-index="${idx}">
        <span>🔍 Vụ án ${idx + 1}: ${c.title.split(':')[1] || c.title}</span>
      </div>
    `).join('');

    // Delegated click on case chips (bấm là chuyển vụ án ngay lập tức)
    caseBar.addEventListener('click', (e) => {
      if (suppressClick) {
        suppressClick = false;
        return;
      }
      const chip = e.target.closest('.case-chip');
      if (!chip) return;

      // Bắt buộc nhập thông tin học sinh trước khi chọn vụ án
      if (window.investigationEngine && !window.investigationEngine.hasValidProfile()) {
        window.investigationEngine.openProfileModal();
        return;
      }

      const idx = parseInt(chip.dataset.caseIndex, 10);
      if (!isNaN(idx) && window.investigationEngine) {
        if (window.audioFX) window.audioFX.playClick();
        window.investigationEngine.loadCase(idx);
      }
    });

    // Kéo ngang bằng chuột để cuộn danh sách vụ án mượt mà
    let pointerDown = false;
    let isDragging = false;
    let startX = 0;
    let startScrollLeft = 0;
    const DRAG_THRESHOLD = 8;

    const syncScrollable = () => {
      caseBar.classList.toggle('is-scrollable', caseBar.scrollWidth > caseBar.clientWidth + 1);
    };

    caseBar.addEventListener('pointerdown', (e) => {
      if (e.button !== 0 || e.pointerType === 'touch') return;
      pointerDown = true;
      isDragging = false;
      suppressClick = false;
      startX = e.clientX;
      startScrollLeft = caseBar.scrollLeft;
    });

    caseBar.addEventListener('pointermove', (e) => {
      if (!pointerDown) return;
      const dx = e.clientX - startX;
      if (!isDragging && Math.abs(dx) > DRAG_THRESHOLD) {
        isDragging = true;
        suppressClick = true;
        caseBar.classList.add('dragging');
        try {
          caseBar.setPointerCapture(e.pointerId);
        } catch (err) {}
      }
      if (isDragging) {
        e.preventDefault();
        caseBar.scrollLeft = startScrollLeft - dx;
      }
    });

    const endDrag = (e) => {
      if (!pointerDown) return;
      pointerDown = false;
      if (isDragging) {
        isDragging = false;
        caseBar.classList.remove('dragging');
        try {
          if (e && e.pointerId && caseBar.hasPointerCapture && caseBar.hasPointerCapture(e.pointerId)) {
            caseBar.releasePointerCapture(e.pointerId);
          }
        } catch (err) {}
      }
    };

    caseBar.addEventListener('pointerup', endDrag);
    caseBar.addEventListener('pointercancel', endDrag);
    window.addEventListener('blur', endDrag);

    syncScrollable();
    window.addEventListener('resize', syncScrollable);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(syncScrollable).catch(() => {});
    }
  }

  // 4. Bind Simulation Control Buttons
  const btnRun = document.getElementById('btnRunSim');
  const btnPause = document.getElementById('btnPauseSim');
  const btnReset = document.getElementById('btnResetSim');
  const btnAction = document.getElementById('btnSpecialAction');
  const envSelect = document.getElementById('envSelect');
  const envSelectRow = document.getElementById('envSelectRow');

  function syncSpecialActionButton() {
    const c = window.investigationEngine ? window.investigationEngine.getCurrentCase() : null;
    if (!c) return;

    if (c.simModule === 'case1') {
      if (envSelectRow) envSelectRow.style.display = 'flex';
      if (envSelect) envSelect.value = window.physicsEngine.currentEnv;
      if (btnAction) btnAction.style.display = 'none';
    } else if (c.simModule === 'case3') {
      if (envSelectRow) envSelectRow.style.display = 'none';
      if (btnAction) {
        btnAction.style.display = 'inline-block';
        btnAction.innerText = '✂ Cắt Dây Quán Tính';
      }
    } else if (c.simModule === 'case6') {
      // Hỗ trợ môi trường thiên thể trong Vụ án 6
      if (envSelectRow) envSelectRow.style.display = 'flex';
      if (envSelect) envSelect.value = window.physicsEngine.currentEnv;
      if (btnAction) {
        btnAction.style.display = 'inline-block';
        btnAction.innerText = '🪂 Bung Dù Cứu Sinh';
      }
    } else {
      if (envSelectRow) envSelectRow.style.display = 'none';
      if (btnAction) {
        btnAction.style.display = 'none';
      }
    }
  }
  window.syncCaseControls = syncSpecialActionButton;

  // 5. Load First Case
  window.investigationEngine.loadCase(0);
  syncSpecialActionButton();

  if (envSelect) {
    envSelect.addEventListener('change', (e) => {
      const key = e.target.value;
      const env = window.physicsEngine.setEnvironment(key);
      if (window.audioFX) window.audioFX.playClick();
      showToast(`🌌 Môi trường: ${env.name} (g = ${env.g} m/s²)`);
      syncSpecialActionButton();
    });
  }

  // Nút Chạy mô phỏng: Kiểm tra thông tin học sinh & Tự động chạy lại nếu đã hoàn thành
  if (btnRun) {
    btnRun.addEventListener('click', () => {
      if (window.investigationEngine && !window.investigationEngine.hasValidProfile()) {
        window.investigationEngine.openProfileModal();
        return;
      }

      // Nếu mô phỏng đã chạy hết, tự động đặt lại để người dùng xem lại ngay
      if (window.physicsEngine.isFinished()) {
        const c = window.investigationEngine.getCurrentCase();
        window.physicsEngine.initCaseState(c.simModule);
      }

      window.physicsEngine.isRunning = true;
      if (window.audioFX) window.audioFX.playClick();
      showToast('⚡ Mô phỏng vật lý đang chạy ở 60 FPS...');
    });
  }

  if (btnPause) {
    btnPause.addEventListener('click', () => {
      window.physicsEngine.isRunning = false;
      if (window.audioFX) window.audioFX.playClick();
      showToast('⏸ Đã tạm dừng mô phỏng.');
    });
  }

  if (btnReset) {
    btnReset.addEventListener('click', () => {
      const c = window.investigationEngine.getCurrentCase();
      window.physicsEngine.initCaseState(c.simModule);
      window.physicsEngine.isRunning = false;
      if (window.audioFX) window.audioFX.playClick();
      syncSpecialActionButton();
      showToast('🔄 Đã đặt lại trạng thái ban đầu.');
    });
  }

  if (btnAction) {
    btnAction.addEventListener('click', () => {
      if (window.investigationEngine && !window.investigationEngine.hasValidProfile()) {
        window.investigationEngine.openProfileModal();
        return;
      }

      const c = window.investigationEngine.getCurrentCase();
      window.physicsEngine.isRunning = true; // Luôn đảm bảo đang chạy để thấy hiệu ứng

      if (c.simModule === 'case3') {
        window.physicsEngine.cutTractionString();
        if (window.audioFX) window.audioFX.playClick();
        showToast('✂ ĐÃ CẮT DÂY: Quả cầu bay theo tiếp tuyến quán tính (Định luật I Newton)!');
      } else if (c.simModule === 'case6') {
        window.physicsEngine.deployParachute();
        if (window.audioFX) window.audioFX.playClick();
        showToast('🪂 ĐÃ BUNG DÙ CỨU SINH! Lực cản không khí tăng vọt, hãm tốc độ rơi!');
      }
    });
  }

  // 6. Simulation Speed Selector
  const speedSelect = document.getElementById('speedSelect');
  if (speedSelect) {
    speedSelect.addEventListener('change', (e) => {
      window.physicsEngine.simSpeed = parseFloat(e.target.value);
    });
  }

  // 7. Light / Dark Theme Toggle
  const btnTheme = document.getElementById('btnToggleTheme');
  const themeIcon = document.getElementById('themeBtnIcon');
  const themeLabel = document.getElementById('themeBtnLabel');
  const metaTheme = document.querySelector('meta[name="theme-color"]');
  const THEME_KEY = 'physics-detective-theme';

  function applyTheme(theme) {
    const dark = theme === 'dark';
    const root = document.documentElement;
    root.classList.add('theme-switching');
    if (dark) root.setAttribute('data-theme', 'dark');
    else root.removeAttribute('data-theme');
    void root.offsetWidth;
    root.classList.remove('theme-switching');

    if (themeIcon) themeIcon.textContent = dark ? '🌙' : '☀️';
    if (themeLabel) themeLabel.textContent = dark ? 'Tối' : 'Sáng';
    if (metaTheme) metaTheme.setAttribute('content', dark ? '#121212' : '#FBFBF9');
    if (btnTheme) {
      btnTheme.setAttribute('aria-pressed', String(dark));
      btnTheme.setAttribute('aria-label', dark
        ? 'Chế độ nền tối. Bấm để chuyển sang nền sáng.'
        : 'Chế độ nền sáng. Bấm để chuyển sang nền tối.');
      btnTheme.title = dark ? 'Chuyển sang nền sáng' : 'Chuyển sang nền tối';
    }

    document.dispatchEvent(new CustomEvent('themechange', { detail: { theme: dark ? 'dark' : 'light' } }));
  }

  if (btnTheme) {
    let savedTheme = 'light';
    try {
      savedTheme = localStorage.getItem(THEME_KEY) === 'dark' ? 'dark' : 'light';
    } catch (e) {}

    applyTheme(savedTheme);

    btnTheme.addEventListener('click', () => {
      const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
      applyTheme(next);
    });
  }

  // 8. Navigation Tabs
  const navTabs = document.querySelectorAll('.tab-btn');
  navTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      if (target === 'campaign') {
        navTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const guideModal = document.getElementById('pedagogyGuideModal');
        if (guideModal) guideModal.classList.remove('active');
        const juryModal = document.getElementById('juryModal');
        if (juryModal) juryModal.classList.remove('active');
      } else if (target === 'analytics') {
        navTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        window.pedagogyAnalytics.openModal();
      } else if (target === 'guide') {
        navTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        window.openPedagogyGuide();
      }
    });
  });

  // Đóng modal khi bấm vào vùng nền mờ bên ngoài
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        if (overlay.id === 'studentModal') {
          if (window.investigationEngine && window.investigationEngine.hasValidProfile()) {
            overlay.classList.remove('active');
          }
        } else if (overlay.id === 'pedagogyGuideModal') {
          window.closePedagogyGuide();
        } else if (overlay.id === 'juryModal') {
          window.pedagogyAnalytics.closeModal();
        }
      }
    });
  });

  // Bắt buộc mở modal đăng ký học sinh ngay lập tức nếu chưa có thông tin
  setTimeout(() => {
    if (window.investigationEngine && !window.investigationEngine.hasValidProfile()) {
      window.investigationEngine.openProfileModal();
    }
  }, 200);

  // 9. 60 FPS Animation Loop
  function animLoop() {
    try {
      if (window.physicsEngine) {
        window.physicsEngine.step();
        renderer.render(window.physicsEngine);
        updateSensorDisplay();
      }
    } catch (err) {
      console.error('Simulation loop error:', err);
    }
    requestAnimationFrame(animLoop);
  }
  requestAnimationFrame(animLoop);

  // 10. Update Sensor Display Elements
  function updateSensorDisplay() {
    const s = window.physicsEngine.sensors;
    const tEl = document.getElementById('sensorTime');
    const vEl = document.getElementById('sensorV1');
    const fEl = document.getElementById('sensorF1');
    const aEl = document.getElementById('sensorA1');

    if (tEl) tEl.innerText = s.time.toFixed(2) + ' s';
    if (vEl) vEl.innerText = s.v1.toFixed(1) + ' m/s';
    if (fEl) fEl.innerText = (s.f1 > 1000 ? (s.f1 / 1000).toFixed(1) + ' kN' : s.f1.toFixed(0) + ' N');
    if (aEl) aEl.innerText = s.a1.toFixed(2) + ' m/s²';
  }

  // 11. Toast Notification Function
  window.showToast = function (msg) {
    let container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>⚡</span> <span>${msg}</span>`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3200);
  };
});
