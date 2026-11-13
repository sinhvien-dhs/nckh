/* ==========================================================================
   PHYSICS DETECTIVE - Main Application Controller & Router
   Coordinates UI, Simulation 60 FPS Loop, Event Listeners, State & Auth Routing
   ========================================================================== */

// 1. PIN Quản trị viên bí mật (Mặc định: 10112026)
const ADMIN_PIN = "10112026";

// 2. Global Navigation & Modal Controls (Always available immediately)
window.openPedagogyGuide = function () {
  const modal = document.getElementById('pedagogyGuideModal');
  if (modal) modal.classList.add('active');
};

window.closePedagogyGuide = function () {
  const modal = document.getElementById('pedagogyGuideModal');
  if (modal) modal.classList.remove('active');
};

window.runTutorialBắtBẻ = function (isCorrect) {
  const hpEl = document.getElementById('tutorialSophosHp');
  const rewardBox = document.getElementById('tutorialRewardBox');
  const actionBox = document.getElementById('tutorialActionBox');
  const startBtn = document.getElementById('btnStartGameFromTutorial');

  if (isCorrect) {
    if (window.audioFX) {
      window.audioFX.playSuccess();
    }
    if (hpEl) {
      hpEl.innerText = 'HP: 0/100 (BỊ HẠ GỤC!)';
      hpEl.style.color = 'var(--green)';
    }
    if (actionBox) {
      const btns = actionBox.querySelectorAll('button');
      btns.forEach(b => {
        b.disabled = true;
        b.style.pointerEvents = 'none';
        b.style.opacity = '0.7';
      });
    }
    if (rewardBox) {
      rewardBox.style.display = 'block';
    }
    if (startBtn) {
      startBtn.innerText = '🚀 Vào Phá Án Vụ 1 Ngay ➜';
      startBtn.classList.add('btn-success');
    }
    if (window.showToast) {
      window.showToast('🎉 +50 Điểm Thử Nghiệm! Bạn đã nắm được cốt lõi trò chơi!');
    }
  } else {
    if (window.audioFX) window.audioFX.playAlert();
    if (window.showToast) {
      window.showToast('⚠️ Đó là ngụy biện cảm tính! Hãy bấm nút [BẮT BẺ NGAY] để xem phân tích!');
    }
  }
};

window.toggleGuideDetail = function () {
  const detail = document.getElementById('guideStepsDetail');
  const btn = document.getElementById('btnToggleGuideDetail');
  if (detail) {
    const isHidden = detail.style.display === 'none' || !detail.style.display;
    detail.style.display = isHidden ? 'block' : 'none';
    if (btn) btn.innerText = isHidden ? 'Ẩn 5 bước chi tiết ▲' : '📋 Xem 5 bước chi tiết ▼';
  }
};

// 4. Mobile Quick Jump & Smooth Scroll (Dossier <-> Sandbox)
window.toggleMobileView = function () {
  const sim = document.querySelector('.sim-container') || document.querySelectorAll('.panel')[1];
  const dossier = document.getElementById('investigationContent');
  const pill = document.getElementById('mobileJumpPill');
  if (!sim || !dossier) return;

  const simRect = sim.getBoundingClientRect();
  if (simRect.top < window.innerHeight * 0.5) {
    dossier.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (pill) pill.innerHTML = '🔬 Xem Mô Phỏng';
  } else {
    sim.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (pill) pill.innerHTML = '📋 Lên Bảng Phá Án';
  }
};

window.scrollToSimulation = function () {
  const sim = document.querySelector('.sim-container') || document.querySelectorAll('.panel')[1];
  if (sim) sim.scrollIntoView({ behavior: 'smooth', block: 'start' });
  const pill = document.getElementById('mobileJumpPill');
  if (pill) pill.innerHTML = '📋 Lên Bảng Phá Án';
};

window.scrollToInvestigation = function () {
  const dossier = document.getElementById('investigationContent');
  if (dossier) dossier.scrollIntoView({ behavior: 'smooth', block: 'start' });
  const pill = document.getElementById('mobileJumpPill');
  if (pill) pill.innerHTML = '🔬 Xem Mô Phỏng';
};

// Cập nhật nhãn nút nhảy nổi khi cuộn trang trên mobile
window.addEventListener('scroll', () => {
  const pill = document.getElementById('mobileJumpPill');
  if (!pill || window.innerWidth > 768) return;
  const sim = document.querySelector('.sim-container');
  if (sim) {
    const rect = sim.getBoundingClientRect();
    if (rect.top <= window.innerHeight * 0.4) {
      pill.innerHTML = '📋 Lên Bảng Phá Án';
    } else {
      pill.innerHTML = '🔬 Xem Mô Phỏng';
    }
  }
}, { passive: true });

// 3. Global Toast Notification Function
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

// 4. Modal PIN Verification Logic for Admin Access
window.openAdminPinModal = function () {
  const modal = document.getElementById('adminPinModal');
  const input = document.getElementById('adminPinInput');
  const error = document.getElementById('adminPinError');
  if (error) error.style.display = 'none';
  if (input) {
    input.value = '';
    input.type = 'password';
  }
  if (modal) modal.classList.add('active');
  setTimeout(() => {
    if (input) input.focus();
  }, 120);
};

window.cancelAdminPin = function () {
  const modal = document.getElementById('adminPinModal');
  if (modal) modal.classList.remove('active');
  sessionStorage.removeItem('admin_unlocked');
  const cleanUrl = (window.location.origin && window.location.origin !== 'null')
    ? window.location.origin + window.location.pathname
    : window.location.href.split('?')[0];
  window.location.replace(cleanUrl);
};

window.togglePinVisibility = function () {
  const input = document.getElementById('adminPinInput');
  const btn = document.getElementById('btnTogglePinVisibility');
  if (!input) return;
  if (input.type === 'password') {
    input.type = 'text';
    if (btn) btn.innerText = '🙈';
  } else {
    input.type = 'password';
    if (btn) btn.innerText = '👁️';
  }
};

window.submitAdminPin = function () {
  const input = document.getElementById('adminPinInput');
  const error = document.getElementById('adminPinError');
  const modal = document.getElementById('adminPinModal');
  const val = input ? input.value.trim() : '';

  if (val === ADMIN_PIN) {
    if (error) error.style.display = 'none';
    if (modal) modal.classList.remove('active');
    sessionStorage.setItem('admin_unlocked', 'true');
    renderAdminDashboard();
    if (window.showToast) window.showToast('✅ Đã xác thực thành công mã PIN quản trị!');
  } else {
    if (error) {
      error.innerText = '❌ Mã PIN không chính xác! Vui lòng nhập đúng mã 10112026 hoặc bấm Quay lại giao diện học sinh.';
      error.style.display = 'block';
    }
    if (input) {
      input.value = '';
      input.focus();
    }
  }
};

// 5. Admin Dashboard & Student View Switching Helpers
window.switchToStudentView = function () {
  // Khi chuyển về học sinh, xóa session mở khóa để đảm bảo lần sau vào admin phải nhập lại mã PIN
  sessionStorage.removeItem('admin_unlocked');
  const cleanUrl = (window.location.origin && window.location.origin !== 'null')
    ? window.location.origin + window.location.pathname
    : window.location.href.split('?')[0];
  window.location.replace(cleanUrl);
};

window.logoutAdmin = function () {
  sessionStorage.removeItem('admin_unlocked');
  alert('Đã đăng xuất khỏi phiên làm việc Quản trị viên!');
  const cleanUrl = (window.location.origin && window.location.origin !== 'null')
    ? window.location.origin + window.location.pathname
    : window.location.href.split('?')[0];
  window.location.replace(cleanUrl);
};

window.refreshAdminDashboard = function () {
  if (window.investigationEngine) {
    window.investigationEngine.loadSavedProfile();
    window.investigationEngine.loadSavedAnswers();
  }
  renderAdminDashboard();
  if (window.showToast) window.showToast('🔄 Đã làm mới số liệu NCKH Sư Phạm!');
};

window.resetStudentData = function () {
  if (confirm('Bạn có chắc chắn muốn xóa toàn bộ kết quả bài làm của thí sinh hiện tại để kiểm tra lượt mới không?')) {
    try {
      localStorage.removeItem('physics_student_answers');
      localStorage.removeItem('physics_student_profile');
      localStorage.removeItem('physics_solved_cases');
    } catch (e) {}

    if (window.investigationEngine) {
      window.investigationEngine.resetAllProgress();
      window.investigationEngine.studentProfile = { name: '', className: '', schoolName: '', registeredAt: null };
      window.investigationEngine.syncStudentDisplay();
    }
    renderAdminDashboard();
    alert('Đã xóa dữ liệu thành công!');
  }
};

// 6. Light / Dark Theme Management
const THEME_KEY = 'physics-detective-theme';

function applyTheme(theme) {
  const dark = theme === 'dark';
  const root = document.documentElement;
  root.classList.add('theme-switching');
  if (dark) root.setAttribute('data-theme', 'dark');
  else root.removeAttribute('data-theme');
  void root.offsetWidth;
  root.classList.remove('theme-switching');

  const metaTheme = document.querySelector('meta[name="theme-color"]');
  if (metaTheme) metaTheme.setAttribute('content', dark ? '#121212' : '#FBFBF9');

  // Update Student view theme button
  const themeIcon = document.getElementById('themeBtnIcon');
  const themeLabel = document.getElementById('themeBtnLabel');
  const btnTheme = document.getElementById('btnToggleTheme');
  if (themeIcon) themeIcon.textContent = dark ? '🌙' : '☀️';
  if (themeLabel) themeLabel.textContent = dark ? 'Tối' : 'Sáng';
  if (btnTheme) {
    btnTheme.setAttribute('aria-pressed', String(dark));
    btnTheme.setAttribute('aria-label', dark ? 'Chế độ nền tối. Bấm để chuyển sang nền sáng.' : 'Chế độ nền sáng. Bấm để chuyển sang nền tối.');
    btnTheme.title = dark ? 'Chuyển sang nền sáng' : 'Chuyển sang nền tối';
  }

  // Update Admin view theme button
  const themeIconAdmin = document.getElementById('themeBtnIconAdmin');
  const themeLabelAdmin = document.getElementById('themeBtnLabelAdmin');
  const btnThemeAdmin = document.getElementById('btnToggleThemeAdmin');
  if (themeIconAdmin) themeIconAdmin.textContent = dark ? '🌙' : '☀️';
  if (themeLabelAdmin) themeLabelAdmin.textContent = dark ? 'Tối' : 'Sáng';
  if (btnThemeAdmin) {
    btnThemeAdmin.setAttribute('aria-pressed', String(dark));
    btnThemeAdmin.title = dark ? 'Chuyển sang nền sáng' : 'Chuyển sang nền tối';
  }

  document.dispatchEvent(new CustomEvent('themechange', { detail: { theme: dark ? 'dark' : 'light' } }));
}

function initTheme() {
  let savedTheme = 'light';
  try {
    savedTheme = localStorage.getItem(THEME_KEY) === 'dark' ? 'dark' : 'light';
  } catch (e) {}
  applyTheme(savedTheme);

  const toggleHandler = () => {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
    applyTheme(next);
  };

  const btnTheme = document.getElementById('btnToggleTheme');
  if (btnTheme) btnTheme.addEventListener('click', toggleHandler);

  const btnThemeAdmin = document.getElementById('btnToggleThemeAdmin');
  if (btnThemeAdmin) btnThemeAdmin.addEventListener('click', toggleHandler);
}

// 7. Student Game Engine Initialization (Runs once)
let isGameInitialized = false;

function initStudentGameOnce() {
  if (isGameInitialized) return;
  isGameInitialized = true;

  // Ensure PhysicsEngine instance exists
  if (!window.physicsEngine && window.PhysicsEngine) {
    window.physicsEngine = new window.PhysicsEngine();
  }

  // Initialize Canvas Renderer
  const renderer = new VectorRenderer('physicsCanvas');
  window.vectorRenderer = renderer;

  window.addEventListener('resize', () => {
    if (renderer) renderer.resize();
  });
  renderer.resize();

  // Initialize Case Selector Chips
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

  // Bind Simulation Control Buttons
  const btnRun = document.getElementById('btnRunSim');
  const btnReset = document.getElementById('btnResetSim');
  const btnAction = document.getElementById('btnSpecialAction');
  const envSelect = document.getElementById('envSelect');
  const envSelectRow = document.getElementById('envSelectRow');
  const case1MassRow = document.getElementById('case1MassRow');
  const inputM1 = document.getElementById('inputM1');
  const inputM2 = document.getElementById('inputM2');
  const labelM1 = document.getElementById('labelM1');
  const labelM2 = document.getElementById('labelM2');

  function updateRunButtonState() {
    if (!btnRun) return;
    if (window.physicsEngine && window.physicsEngine.isRunning) {
      btnRun.innerHTML = '⏸ Tạm Dừng';
      btnRun.className = 'btn btn-amber';
    } else {
      const isFin = window.physicsEngine && window.physicsEngine.isFinished();
      const hasStarted = window.physicsEngine && window.physicsEngine.simTime > 0.01;
      if (hasStarted && !isFin) {
        btnRun.innerHTML = '▶ Tiếp Tục';
        btnRun.className = 'btn btn-success';
      } else {
        btnRun.innerHTML = '▶ Chạy Mô Phỏng';
        btnRun.className = 'btn btn-success';
      }
    }
  }
  window.updateRunButtonState = updateRunButtonState;

  function syncSpecialActionButton() {
    updateRunButtonState();
    const c = window.investigationEngine ? window.investigationEngine.getCurrentCase() : null;
    if (!c) return;

    if (c.simModule === 'case1') {
      if (envSelectRow) envSelectRow.style.display = 'flex';
      if (envSelect) envSelect.value = window.physicsEngine.currentEnv;
      if (case1MassRow) case1MassRow.style.display = 'flex';
      if (btnAction) btnAction.style.display = 'none';

      const curM1 = (window.physicsEngine.state && window.physicsEngine.state.m1) || 5.0;
      const curM2 = (window.physicsEngine.state && window.physicsEngine.state.m2) || 0.5;
      if (inputM1) inputM1.value = curM1;
      if (labelM1) labelM1.innerText = `${curM1.toFixed(1)} kg`;
      if (inputM2) inputM2.value = curM2;
      if (labelM2) labelM2.innerText = `${curM2.toFixed(1)} kg`;
    } else if (c.simModule === 'case3') {
      if (envSelectRow) envSelectRow.style.display = 'none';
      if (case1MassRow) case1MassRow.style.display = 'none';
      if (btnAction) {
        btnAction.style.display = 'inline-block';
        btnAction.innerText = '✂ Cắt Dây Quán Tính';
      }
    } else if (c.simModule === 'case6') {
      if (envSelectRow) envSelectRow.style.display = 'flex';
      if (envSelect) envSelect.value = window.physicsEngine.currentEnv;
      if (case1MassRow) case1MassRow.style.display = 'none';
      if (btnAction) {
        btnAction.style.display = 'inline-block';
        btnAction.innerText = '🪂 Bung Dù Cứu Sinh';
      }
    } else {
      if (envSelectRow) envSelectRow.style.display = 'none';
      if (case1MassRow) case1MassRow.style.display = 'none';
      if (btnAction) btnAction.style.display = 'none';
    }
  }
  window.syncCaseControls = syncSpecialActionButton;

  // Tùy chỉnh khối lượng vật rơi trong Vụ án 1
  if (inputM1) {
    inputM1.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      if (labelM1) labelM1.innerText = `${val.toFixed(1)} kg`;
      if (window.physicsEngine) {
        window.physicsEngine.case1CustomM1 = val;
        if (window.physicsEngine.state && window.physicsEngine.currentCase === 'case1') {
          window.physicsEngine.state.m1 = val;
          if (!window.physicsEngine.isRunning && window.vectorRenderer) {
            window.vectorRenderer.render(window.physicsEngine);
          }
        }
      }
    });
  }

  if (inputM2) {
    inputM2.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      if (labelM2) labelM2.innerText = `${val.toFixed(1)} kg`;
      if (window.physicsEngine) {
        window.physicsEngine.case1CustomM2 = val;
        if (window.physicsEngine.state && window.physicsEngine.currentCase === 'case1') {
          window.physicsEngine.state.m2 = val;
          if (!window.physicsEngine.isRunning && window.vectorRenderer) {
            window.vectorRenderer.render(window.physicsEngine);
          }
        }
      }
    });
  }

  // Load First Case
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

  // Nút Chạy / Tạm Dừng / Tiếp Tục mô phỏng (tích hợp 3 trong 1)
  if (btnRun) {
    btnRun.addEventListener('click', () => {
      if (window.investigationEngine && !window.investigationEngine.hasValidProfile()) {
        window.investigationEngine.openProfileModal();
        return;
      }

      if (window.physicsEngine.isRunning) {
        // Đang chạy -> Bấm để tạm dừng
        window.physicsEngine.isRunning = false;
        updateRunButtonState();
        if (window.audioFX) window.audioFX.playClick();
        showToast('⏸ Đã tạm dừng mô phỏng.');
      } else {
        // Đang dừng / chưa chạy / đã xong -> Bấm để chạy hoặc tiếp tục
        if (window.physicsEngine.isFinished()) {
          const c = window.investigationEngine.getCurrentCase();
          window.physicsEngine.initCaseState(c.simModule);
        }

        window.physicsEngine.isRunning = true;
        updateRunButtonState();
        if (window.audioFX) window.audioFX.playClick();
        showToast('⚡ Mô phỏng vật lý đang chạy ở 60 FPS...');
      }
    });
  }

  if (btnReset) {
    btnReset.addEventListener('click', () => {
      const c = window.investigationEngine.getCurrentCase();
      window.physicsEngine.initCaseState(c.simModule);
      window.physicsEngine.isRunning = false;
      updateRunButtonState();
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
      window.physicsEngine.isRunning = true;

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

  // Simulation Speed Selector
  const speedSelect = document.getElementById('speedSelect');
  if (speedSelect) {
    speedSelect.addEventListener('change', (e) => {
      window.physicsEngine.simSpeed = parseFloat(e.target.value);
    });
  }

  // Modal Overlay click to close
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        if (overlay.id === 'studentModal') {
          if (window.investigationEngine && window.investigationEngine.hasValidProfile()) {
            overlay.classList.remove('active');
          }
        } else if (overlay.id === 'pedagogyGuideModal') {
          window.closePedagogyGuide();
        } else if (overlay.id === 'adminPinModal') {
          window.cancelAdminPin();
        } else if (overlay.id === 'completionModal') {
          if (window.investigationEngine) window.investigationEngine.closeCompletionModal();
        }
      }
    });
  });

  // 60 FPS Animation Loop
  function animLoop() {
    try {
      const studentView = document.getElementById('studentGameView');
      const isVisible = studentView && studentView.style.display !== 'none';
      if (isVisible && window.physicsEngine) {
        window.physicsEngine.step();
        renderer.render(window.physicsEngine);
        updateSensorDisplay();
        updateRunButtonState();
      }
    } catch (err) {
      console.error('Simulation loop error:', err);
    }
    requestAnimationFrame(animLoop);
  }
  requestAnimationFrame(animLoop);

  // Sensor Display Updater
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
}

// 8. View Rendering Functions
function renderStudentGameView() {
  const studentView = document.getElementById('studentGameView');
  const adminView = document.getElementById('adminDashboardView');
  const pinModal = document.getElementById('adminPinModal');

  if (pinModal) pinModal.classList.remove('active');
  if (studentView) studentView.style.display = 'block';
  if (adminView) adminView.style.display = 'none';

  // Nút truy cập khu vực Giáo viên ở góc trên bên phải
  const adminBtn = document.getElementById('btnNavAdmin');
  if (adminBtn) {
    adminBtn.innerHTML = '🔐 Giáo Viên';
    adminBtn.className = 'btn';
    adminBtn.title = 'Khu vực dành cho Giáo viên / Quản trị viên (Cần mã PIN 10112026)';
  }

  // Khởi tạo bàn cờ mô phỏng & điều tra
  initStudentGameOnce();

  // Bắt buộc mở modal đăng ký học sinh nếu chưa có thông tin
  setTimeout(() => {
    if (window.investigationEngine && !window.investigationEngine.hasValidProfile()) {
      window.investigationEngine.openProfileModal();
    }
  }, 200);
}

function renderAdminDashboard() {
  const studentView = document.getElementById('studentGameView');
  const adminView = document.getElementById('adminDashboardView');
  const pinModal = document.getElementById('adminPinModal');

  if (pinModal) pinModal.classList.remove('active');
  if (studentView) studentView.style.display = 'none';
  if (adminView) adminView.style.display = 'block';

  // Cập nhật số liệu Thẻ Tóm Tắt (Summary Cards)
  const prof = window.investigationEngine ? window.investigationEngine.studentProfile : null;
  const score = window.investigationEngine ? window.investigationEngine.score : 0;
  const solvedCount = window.investigationEngine ? window.investigationEngine.solvedCases.size : 0;

  const adminStudentEl = document.getElementById('adminStudentName');
  const adminClassEl = document.getElementById('adminStudentClass');
  const adminSchoolEl = document.getElementById('adminStudentSchool');
  const adminScoreEl = document.getElementById('adminStudentScore');
  const adminCasesEl = document.getElementById('adminCasesSolved');

  if (adminStudentEl) adminStudentEl.innerText = (prof && prof.name) ? prof.name : 'Chưa có thông tin học sinh';
  if (adminClassEl) adminClassEl.innerText = (prof && prof.className) ? prof.className : '-';
  if (adminSchoolEl) adminSchoolEl.innerText = (prof && prof.schoolName) ? prof.schoolName : '-';
  if (adminScoreEl) adminScoreEl.innerText = `${score} điểm`;
  if (adminCasesEl) adminCasesEl.innerText = `${solvedCount} / 6 vụ án`;

  // Render các thành phần sư phạm NCKH vào trang Quản Trị
  if (window.pedagogyAnalytics) {
    window.pedagogyAnalytics.renderRadar();
    window.pedagogyAnalytics.updateMetricsUI();
    window.pedagogyAnalytics.renderStudentLedger();
  }
}

// 9. Core Application Router (Tách riêng Dashboard của User và Admin với mã PIN bắt buộc)
document.addEventListener('DOMContentLoaded', () => {
  initTheme();

  // Bắt phím Enter ở ô nhập mã PIN
  const pinInput = document.getElementById('adminPinInput');
  if (pinInput) {
    pinInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        window.submitAdminPin();
      }
    });
  }

  const urlParams = new URLSearchParams(window.location.search);
  const isAdminRequested = urlParams.get('mode') === 'admin';

  if (isAdminRequested) {
    // Ẩn cả 2 view trong khi đang chờ xác thực mã PIN
    const studentView = document.getElementById('studentGameView');
    const adminView = document.getElementById('adminDashboardView');
    if (studentView) studentView.style.display = 'none';
    if (adminView) adminView.style.display = 'none';

    // Bắt buộc yêu cầu nhập mã PIN 10112026 qua Modal bảo mật
    window.openAdminPinModal();
  } else {
    // Nếu không có ?mode=admin, luôn luôn mở giao diện học sinh bình thường
    renderStudentGameView();
  }
});
