/* ==========================================================================
   PHYSICS DETECTIVE - Main Application Controller
   Coordinates UI, Simulation 60 FPS Loop, Event Listeners & State
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Renderer
  const renderer = new VectorRenderer('physicsCanvas');
  window.vectorRenderer = renderer;

  // Window resize handler
  window.addEventListener('resize', () => {
    renderer.resize();
  });
  renderer.resize();

  // 2. Initialize Case Selector Chips
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

  // 3. Bind Simulation Control Buttons
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
      // Loại bỏ nút bật không khí / hút chân không ở vụ án 1
      if (btnAction) btnAction.style.display = 'none';
    } else if (c.simModule === 'case3') {
      if (envSelectRow) envSelectRow.style.display = 'none';
      if (btnAction) {
        btnAction.style.display = 'inline-block';
        btnAction.innerText = '✂ Cắt Dây / Mất Bám';
      }
    } else if (c.simModule === 'case6') {
      if (envSelectRow) envSelectRow.style.display = 'none';
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

  // 4. Load First Case (sau khi đã gán window.syncCaseControls)
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

  if (btnRun) {
    btnRun.addEventListener('click', () => {
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
      if (window.audioFX) window.audioFX.playClick();
      syncSpecialActionButton();
      showToast('🔄 Đã đặt lại trạng thái ban đầu.');
    });
  }

  if (btnAction) {
    btnAction.addEventListener('click', () => {
      if (window.audioFX) window.audioFX.playClick();
      const c = window.investigationEngine.getCurrentCase();
      if (c.simModule === 'case3') {
        window.physicsEngine.cutTractionString();
        showToast('✂ ĐÃ CẮT DÂY / MẤT BÁM ĐƯỜNG: Xe bay theo tiếp tuyến quán tính!');
      } else if (c.simModule === 'case6') {
        window.physicsEngine.deployParachute();
        showToast('🪂 ĐÃ BUNG DÙ CỨU SINH! Lực cản tăng mạnh, hãm tốc an toàn!');
      }
    });
  }

  // 5. Simulation Speed Selector
  const speedSelect = document.getElementById('speedSelect');
  if (speedSelect) {
    speedSelect.addEventListener('change', (e) => {
      window.physicsEngine.simSpeed = parseFloat(e.target.value);
    });
  }

  // 6. Sound & Speech Toggle
  const btnAudio = document.getElementById('btnToggleAudio');
  const audioIcon = document.getElementById('audioBtnIcon');
  const audioLabel = document.getElementById('audioBtnLabel');
  const AUDIO_PREF_KEY = 'physics-detective-audio-enabled';

  function syncAudioButton() {
    const on = window.audioFX.soundEnabled;
    if (audioIcon) audioIcon.textContent = on ? '🎙️' : '🔇';
    if (audioLabel) audioLabel.textContent = on ? 'Giọng Adam: BẬT' : 'Giọng đọc: TẮT';
    if (btnAudio) {
      btnAudio.setAttribute('aria-pressed', String(on));
      btnAudio.title = on ? 'Tắt giọng đọc Adam TikTok' : 'Bật giọng đọc Adam TikTok';
    }
  }

  if (btnAudio) {
    // Khôi phục lựa chọn đã lưu để nút không tự bật lại sau khi tải trang
    try {
      const saved = localStorage.getItem(AUDIO_PREF_KEY);
      if (saved !== null) {
        const on = saved === '1';
        window.audioFX.soundEnabled = on;
        window.audioFX.speechEnabled = on;
      }
    } catch (e) { /* localStorage có thể bị trình duyệt chặn */ }

    if (!('speechSynthesis' in window)) {
      btnAudio.disabled = true;
      btnAudio.title = 'Trình duyệt không hỗ trợ thuyết minh giọng nói';
      if (audioLabel) audioLabel.textContent = 'Giọng đọc: Không hỗ trợ';
    } else {
      syncAudioButton();

      btnAudio.addEventListener('click', () => {
        const on = !window.audioFX.soundEnabled;
        window.audioFX.soundEnabled = on;
        window.audioFX.speechEnabled = on;

        if (!on) window.audioFX.stopSpeech();

        try { localStorage.setItem(AUDIO_PREF_KEY, on ? '1' : '0'); } catch (e) {}

        syncAudioButton();

        if (on) {
          window.audioFX.speak('Đã kích hoạt giọng đọc Adam TikTok.', 'socrates');
          showToast('🎙️ Đã kích hoạt giọng đọc Adam (TikTok Style).');
        } else {
          showToast('Đã tắt âm thanh và giọng đọc.');
        }
      });
    }
  }

  // 6b. Light / Dark Theme Toggle
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
    // Ép trình duyệt tính lại màu ngay, không trung gian qua transition.
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
    } catch (e) { /* localStorage có thể bị chặn */ }

    applyTheme(savedTheme);

    btnTheme.addEventListener('click', () => {
      const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
      applyTheme(next);
    });
  }

  // 7. Navigation Tabs
  const navTabs = document.querySelectorAll('.tab-btn');
  navTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      navTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const target = tab.dataset.tab;
      if (target === 'analytics') {
        window.pedagogyAnalytics.openModal();
      } else if (target === 'guide') {
        alert("📖 HƯỚNG DẪN TRÒ CHƠI PHÁT TRIỂN NĂNG LỰC TƯ DUY PHẢN BIỆN:\n\n1. Tiếp nhận vụ án & phân loại phát biểu (Fact/Opinion/Hypothesis).\n2. Vạch trần bẫy ngụy biện của Dr. Sophos.\n3. Tiến hành thực nghiệm POE (Dự đoán, đặt độ tự tin 10%-100%, quan sát mô phỏng 60 FPS).\n4. Dùng bằng chứng số liệu đối chất Socratic đánh sập ngụy biện.\n5. Xem báo cáo hồ sơ năng lực tư duy phản biện Facione T1 - T4!");
      }
    });
  } );

  // 8. 60 FPS Animation Loop
  function animLoop() {
    window.physicsEngine.step();
    renderer.render(window.physicsEngine);
    updateSensorDisplay();
    requestAnimationFrame(animLoop);
  }
  requestAnimationFrame(animLoop);

  // 9. Update Sensor Display Elements
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

  // 10. Toast Notification Function
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
