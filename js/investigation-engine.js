/* ==========================================================================
   PHYSICS DETECTIVE - Investigation Engine
   Orchestrates 5 Critical Thinking Phases per Physics Case
   Integrates Mandatory Student Profile Registration & Response Ledger
   ========================================================================== */

class InvestigationEngine {
  constructor() {
    this.currentCaseIndex = 0;
    this.currentPhase = 1; // 1: Classify, 2: Fallacy, 3: POE, 4: Socratic Duel, 5: Verdict
    this.score = 0;
    this.solvedCases = new Set();
    this.dossier = []; // Collected evidence cards

    // Duel State
    this.sophosHp = 100;
    this.currentRound = 0;

    // Pedagogy Facione metrics (0 - 100)
    this.facione = {
      t1: 70, // Analysis & Statement Classification
      t2: 65, // Experimental Evidence Evaluation
      t3: 60, // Socratic Reasoning & Fallacy Refutation
      t4: 75  // Self-Regulation & POE Confidence Calibration
    };

    // Student Profile & Answer Ledger
    this.studentProfile = {
      name: '',
      className: '',
      schoolName: '',
      registeredAt: null
    };

    this.studentAnswers = {}; // { caseId: { itemId: { chosen, target, isCorrect, text, timestamp } } }

    this.container = document.getElementById('investigationContent');

    this.loadSavedProfile();
    this.loadSavedAnswers();
  }

  hasValidProfile() {
    const p = this.studentProfile;
    return !!(p && p.name && p.name.trim() && p.className && p.className.trim() && p.schoolName && p.schoolName.trim());
  }

  loadSavedProfile() {
    try {
      const saved = localStorage.getItem('physics_student_profile');
      if (saved) {
        this.studentProfile = JSON.parse(saved);
        this.syncStudentDisplay();
      }
    } catch (e) {}
  }

  loadSavedAnswers() {
    try {
      const saved = localStorage.getItem('physics_student_answers');
      if (saved) {
        this.studentAnswers = JSON.parse(saved);
      }
    } catch (e) {}
  }

  syncStudentDisplay() {
    const disp = document.getElementById('studentDisplay');
    if (disp) {
      if (this.hasValidProfile()) {
        disp.innerText = `${this.studentProfile.name} • ${this.studentProfile.className} (${this.studentProfile.schoolName})`;
        disp.style.color = 'var(--cyan)';
      } else {
        disp.innerText = 'Chưa đăng ký (Bắt buộc nhập)';
        disp.style.color = 'var(--crimson)';
      }
    }
  }

  openProfileModal() {
    const modal = document.getElementById('studentModal');
    if (modal) {
      const nameInp = document.getElementById('studentNameInput');
      const classInp = document.getElementById('studentClassInput');
      const schoolInp = document.getElementById('studentSchoolInput');
      const alertBox = document.getElementById('studentModalAlert');

      if (nameInp) nameInp.value = this.studentProfile.name || '';
      if (classInp) classInp.value = this.studentProfile.className || '';
      if (schoolInp) schoolInp.value = this.studentProfile.schoolName || '';
      if (alertBox) alertBox.style.display = 'none';

      modal.classList.add('active');
    }
  }

  closeProfileModal() {
    // Chỉ cho phép đóng nếu đã có thông tin hợp lệ
    if (!this.hasValidProfile()) {
      const alertBox = document.getElementById('studentModalAlert');
      if (alertBox) {
        alertBox.style.display = 'block';
        alertBox.innerText = '⚠️ Bạn phải nhập đầy đủ Họ tên, Lớp và Trường thì mới có thể bắt đầu chơi!';
      }
      return;
    }
    const modal = document.getElementById('studentModal');
    if (modal) modal.classList.remove('active');
  }

  saveProfile() {
    const nameInp = document.getElementById('studentNameInput');
    const classInp = document.getElementById('studentClassInput');
    const schoolInp = document.getElementById('studentSchoolInput');
    const alertBox = document.getElementById('studentModalAlert');

    const name = nameInp ? nameInp.value.trim() : '';
    const className = classInp ? classInp.value.trim() : '';
    const schoolName = schoolInp ? schoolInp.value.trim() : '';

    if (!name || !className || !schoolName) {
      if (alertBox) {
        alertBox.style.display = 'block';
        alertBox.innerText = '⚠️ Vui lòng nhập đầy đủ cả 3 thông tin: Họ tên, Lớp và Trường!';
      } else {
        alert('Vui lòng nhập đầy đủ cả Họ tên, Lớp và Trường để bắt đầu điều tra!');
      }
      return;
    }

    this.studentProfile = {
      name: name,
      className: className,
      schoolName: schoolName,
      registeredAt: new Date().toISOString()
    };

    try {
      localStorage.setItem('physics_student_profile', JSON.stringify(this.studentProfile));
    } catch (e) {}

    this.syncStudentDisplay();
    const modal = document.getElementById('studentModal');
    if (modal) modal.classList.remove('active');

    if (window.showToast) {
      window.showToast(`👤 Xin chào điều tra viên: ${name} (Lớp ${className})!`);
    }
    if (window.audioFX) window.audioFX.playSuccess();

    this.render();
  }

  loadCase(index) {
    if (index < 0 || index >= window.CASES_DATA.length) return;
    this.currentCaseIndex = index;
    this.currentPhase = 1;
    this.sophosHp = 100;
    this.currentRound = 0;

    const currentCase = this.getCurrentCase();
    if (window.physicsEngine) {
      window.physicsEngine.initCaseState(currentCase.simModule);
    }

    this.render();
    this.updateCaseSelectorUI();
    if (window.syncCaseControls) window.syncCaseControls();
  }

  selectCase(index) {
    if (!this.hasValidProfile()) {
      this.openProfileModal();
      return;
    }
    this.loadCase(index);
  }

  getCurrentCase() {
    return window.CASES_DATA[this.currentCaseIndex];
  }

  render() {
    if (!this.container) return;
    const currentCase = this.getCurrentCase();

    let html = '';

    // Bắt buộc nhập thông tin trước khi chơi
    if (!this.hasValidProfile()) {
      html += `
        <div class="narrative-card" style="border-left: 4px solid var(--crimson); background: rgba(239, 68, 68, 0.08); margin-bottom: 16px;">
          <h4 style="color:var(--crimson); margin-bottom:4px;">⚠️ YÊU CẦU ĐĂNG KÝ HỌC SINH TRƯỚC KHI CHƠI</h4>
          <p style="font-size:0.86rem; color:var(--text-main);">
            Để lưu trữ số liệu nghiên cứu khoa học sư phạm (SPSS 26.0 & Facione T1-T4), bạn bắt buộc phải nhập <strong>Họ tên, Lớp và Trường</strong> trước khi tiếp nhận vụ án và chạy mô phỏng.
          </p>
          <div style="margin-top:10px;">
            <button class="btn btn-primary" onclick="window.investigationEngine.openProfileModal()">
              ✍️ Nhập Thông Tin Học Sinh Ngay
            </button>
          </div>
        </div>
      `;
    }

    html += `
      <div class="case-header-box">
        <span class="hud-badge" style="margin-bottom:6px; display:inline-block;">${currentCase.badge} • ${currentCase.curriculum}</span>
        <h2>${currentCase.title}</h2>
        <div class="meta">
          <span>📖 ${currentCase.subtitle}</span>
          <span>⚡ Tiến độ pha: ${this.currentPhase}/5</span>
        </div>
      </div>

      <div class="step-indicator">
        <div class="step-dot ${this.currentPhase >= 1 ? 'active' : ''} ${this.currentPhase > 1 ? 'completed' : ''}"></div>
        <div class="step-dot ${this.currentPhase >= 2 ? 'active' : ''} ${this.currentPhase > 2 ? 'completed' : ''}"></div>
        <div class="step-dot ${this.currentPhase >= 3 ? 'active' : ''} ${this.currentPhase > 3 ? 'completed' : ''}"></div>
        <div class="step-dot ${this.currentPhase >= 4 ? 'active' : ''} ${this.currentPhase > 4 ? 'completed' : ''}"></div>
        <div class="step-dot ${this.currentPhase >= 5 ? 'active' : ''} ${this.currentPhase > 5 ? 'completed' : ''}"></div>
      </div>
    `;

    switch (this.currentPhase) {
      case 1:
        html += this.renderPhase1Classify(currentCase);
        break;
      case 2:
        html += this.renderPhase2Fallacy(currentCase);
        break;
      case 3:
        html += this.renderPhase3POE(currentCase);
        break;
      case 4:
        html += this.renderPhase4SocraticDuel(currentCase);
        break;
      case 5:
        html += this.renderPhase5Verdict(currentCase);
        break;
    }

    this.container.innerHTML = html;
  }

  // Phase 1: Classify statements (Single Answer per Student, Any choice allowed)
  renderPhase1Classify(c) {
    const caseAnswers = this.studentAnswers[c.id] || {};
    let allAnswered = true;

    const itemsHtml = c.classifyItems.map((item, idx) => {
      const saved = caseAnswers[item.id];
      const isAnswered = !!saved;
      if (!isAnswered) allAnswered = false;

      const chosen = saved ? saved.chosen : null;
      const isCorrect = saved ? saved.isCorrect : false;

      return `
        <div class="classify-item" id="item_${item.id}" data-answered="${isAnswered ? 'true' : 'false'}">
          <div class="classify-text"><strong>${idx + 1}.</strong> "${item.text}"</div>
          <div class="classify-options">
            <button class="btn-classify ${chosen === 'fact' ? 'selected-fact' : ''}" 
                    ${isAnswered ? 'disabled style="pointer-events:none; opacity:0.85;"' : ''} 
                    onclick="window.investigationEngine.handleClassify('${item.id}', 'fact')">
              SỰ THẬT (Fact)
            </button>
            <button class="btn-classify ${chosen === 'opinion' ? 'selected-opinion' : ''}" 
                    ${isAnswered ? 'disabled style="pointer-events:none; opacity:0.85;"' : ''} 
                    onclick="window.investigationEngine.handleClassify('${item.id}', 'opinion')">
              Ý KIẾN (Opinion)
            </button>
            <button class="btn-classify ${chosen === 'hypothesis' ? 'selected-hypothesis' : ''}" 
                    ${isAnswered ? 'disabled style="pointer-events:none; opacity:0.85;"' : ''} 
                    onclick="window.investigationEngine.handleClassify('${item.id}', 'hypothesis')">
              GIẢ THUYẾT (Hypothesis)
            </button>
          </div>
          <div class="classify-feedback" id="feedback_${item.id}" style="display:${isAnswered ? 'block' : 'none'}; font-size:0.82rem; margin-top:6px; line-height:1.4;">
            ${isAnswered ? (
              isCorrect ? `<span style="color:var(--green)">✓ LỰA CHỌN PHÙ HỢP CHUẨN KHOA HỌC: ${item.explanation}</span>`
                        : `<span style="color:var(--amber)">● Ý KIẾN GHI NHẬN (${chosen.toUpperCase()}): ${item.explanation}</span>`
            ) : ''}
          </div>
        </div>
      `;
    }).join('');

    return `
      <div class="narrative-card">
        <p><strong>🕵️ NHIỆM VỤ ĐIỀU TRA (PHA 1/5):</strong> Đọc kỹ các phát biểu từ hiện trường. Hãy phân loại từng phát biểu theo nhận thức của bạn: 
        <strong style="color:var(--green)">SỰ THẬT (Fact)</strong>, <strong style="color:var(--amber)">Ý KIẾN (Opinion)</strong> hoặc <strong style="color:var(--cyan)">GIẢ THUYẾT (Hypothesis)</strong>.</p>
        <p style="font-size:0.8rem; color:var(--text-muted); margin-top:4px;">
          <em>Lưu ý: Mỗi phát biểu chỉ được chọn một lần duy nhất để phục vụ thống kê nghiên cứu năng lực phản biện.</em>
        </p>
      </div>

      <div class="classify-list">
        ${itemsHtml}
      </div>

      <div style="margin-top: 18px; display:flex; justify-content:space-between; align-items:center;">
        <span style="font-size:0.82rem; color:var(--text-muted);">
          ${this.hasValidProfile() ? `Hồ sơ thí sinh: <strong>${this.studentProfile.name}</strong> (${this.studentProfile.className})` : '<strong style="color:var(--crimson)">Chưa đăng ký thông tin</strong>'}
        </span>
        <button class="btn btn-primary" id="btnNextPhase" onclick="window.investigationEngine.nextPhase()" ${allAnswered && this.hasValidProfile() ? '' : 'disabled'}>
          Tiếp tục sang Pha 2: Vạch trần Ngụy biện ➜
        </button>
      </div>
    `;
  }

  handleClassify(itemId, chosenType) {
    if (!this.hasValidProfile()) {
      this.openProfileModal();
      return;
    }

    const currentCase = this.getCurrentCase();
    const item = currentCase.classifyItems.find(x => x.id === itemId);
    if (!item) return;

    if (!this.studentAnswers[currentCase.id]) {
      this.studentAnswers[currentCase.id] = {};
    }

    // Mỗi câu hỏi chỉ được trả lời 1 lần duy nhất!
    if (this.studentAnswers[currentCase.id][itemId]) {
      return;
    }

    const isCorrect = item.type === chosenType;

    // Ghi nhận đáp án vào hồ sơ học sinh
    this.studentAnswers[currentCase.id][itemId] = {
      chosen: chosenType,
      target: item.type,
      isCorrect: isCorrect,
      text: item.text,
      timestamp: new Date().toISOString()
    };

    try {
      localStorage.setItem('physics_student_answers', JSON.stringify(this.studentAnswers));
    } catch (e) {}

    const row = document.getElementById(`item_${itemId}`);
    const feedback = document.getElementById(`feedback_${itemId}`);
    if (row) {
      const buttons = row.querySelectorAll('.btn-classify');
      buttons.forEach(b => {
        b.disabled = true;
        b.style.pointerEvents = 'none';
        b.style.opacity = '0.85';
      });

      if (chosenType === 'fact') {
        const btn = row.querySelector('.btn-classify:nth-child(1)');
        if (btn) btn.classList.add('selected-fact');
      } else if (chosenType === 'opinion') {
        const btn = row.querySelector('.btn-classify:nth-child(2)');
        if (btn) btn.classList.add('selected-opinion');
      } else if (chosenType === 'hypothesis') {
        const btn = row.querySelector('.btn-classify:nth-child(3)');
        if (btn) btn.classList.add('selected-hypothesis');
      }

      if (feedback) {
        feedback.style.display = 'block';
        if (isCorrect) {
          feedback.innerHTML = `<span style="color:var(--green)">✓ LỰA CHỌN PHÙ HỢP CHUẨN KHOA HỌC: ${item.explanation}</span>`;
          if (window.audioFX) window.audioFX.playSuccess();
          this.score += 20;
          this.facione.t1 = Math.min(100, this.facione.t1 + 5);
        } else {
          feedback.innerHTML = `<span style="color:var(--amber)">● Ý KIẾN GHI NHẬN (${chosenType.toUpperCase()}): ${item.explanation}</span>`;
          if (window.audioFX) window.audioFX.playAlert();
          this.facione.t1 = Math.max(30, this.facione.t1 - 1);
        }
      }
      row.dataset.answered = 'true';
    }

    this.updateScoreDisplay();

    // Kiểm tra đã hoàn thành toàn bộ phát biểu của vụ án chưa
    const allAnswered = currentCase.classifyItems.every(x => {
      return this.studentAnswers[currentCase.id] && this.studentAnswers[currentCase.id][x.id];
    });

    const nextBtn = document.getElementById('btnNextPhase');
    if (allAnswered && nextBtn) {
      nextBtn.disabled = false;
    }
  }

  // Phase 2: Fallacy Hunting
  renderPhase2Fallacy(c) {
    return `
      <div class="fallacy-banner">
        ⚠️ CẢNH BÁO: ĐÂY LÀ PHÁT BIỂU NGỤY BIỆN CẦN PHẢN BIỆN BẰNG THỰC NGHIỆM!
      </div>

      <div class="narrative-card sophos">
        <h4 style="color:var(--crimson); margin-bottom:6px;">🦹 DR. SOPHOS (CHUYÊN GIA NGỤY BIỆN):</h4>
        <p>"${c.sophosStatement}"</p>
      </div>

      <div class="narrative-card socrates">
        <h4 style="color:var(--purple); margin-bottom:6px;">🦉 CỐ VẤN SOCRATES GỢI Ý:</h4>
        <p>Quan sát kỹ: Tiến sĩ Sophos đã dùng bẫy ngụy biện nào để đánh tráo khái niệm hoặc dùng uy quyền áp đặt?</p>
      </div>

      <div class="dossier-card">
        <h4 style="color:var(--cyan); margin-bottom:4px;">🔍 BÓC TÁCH BẪY TƯ DUY:</h4>
        <p style="color:var(--text-main); font-size:0.86rem;"><strong>Loại ngụy biện:</strong> ${c.fallacyType}</p>
        <p style="color:var(--text-muted); font-size:0.82rem; margin-top:4px;"><strong>Bản chất sai lầm:</strong> ${c.fallacyExplanation}</p>
      </div>

      <div style="margin-top: 18px; display:flex; justify-content:space-between;">
        <button class="btn" onclick="window.investigationEngine.prevPhase()">⬅ Quay lại Pha 1</button>
        <button class="btn btn-primary" onclick="window.investigationEngine.nextPhase()">
          Tiến vào Pha 3: Thao trường Thực nghiệm POE ➜
        </button>
      </div>
    `;
  }

  // Phase 3: POE (Predict - Observe - Explain)
  renderPhase3POE(c) {
    return `
      <div class="poe-container">
        <h3 style="color:var(--cyan); margin-bottom:8px;">🎯 PHA 3: QUY TRÌNH SƯ PHẠM POE (DỰ ĐOÁN - QUAN SÁT - GIẢI THÍCH)</h3>
        <p style="font-size:0.88rem; margin-bottom:12px;"><strong>Câu hỏi giả thuyết:</strong> ${c.poeQuestion}</p>

        <div class="choice-list">
          ${c.poeOptions.map((opt, i) => `
            <div class="choice-btn" id="poe_opt_${opt.id}" onclick="window.investigationEngine.handlePoeChoice('${opt.id}', ${!!opt.correct})">
              <span><strong>${String.fromCharCode(65 + i)}.</strong></span>
              <span>${opt.text}</span>
            </div>
          `).join('')}
        </div>

        <div class="confidence-slider-box">
          <label>
            <span>ĐỘ TIN CẬY NHẬN THỨC CỦA BẠN (Cognitive Confidence Score):</span>
            <span id="confidenceVal" style="color:var(--cyan)">80%</span>
          </label>
          <input type="range" class="slider-input" min="10" max="100" value="80" 
                 oninput="document.getElementById('confidenceVal').innerText = this.value + '%'; window.investigationEngine.facione.t4 = parseInt(this.value);">
          <small style="color:var(--text-dim); display:block; margin-top:4px;">Kéo thanh trượt để tự đánh giá mức độ chắc chắn của bạn trước khi quan sát thí nghiệm.</small>
        </div>

        <div class="narrative-card" style="border-left: 4px solid var(--green);">
          <p>🔬 <strong>HƯỚNG DẪN QUAN SÁT THỰC NGHIỆM (OBSERVE):</strong> Nhìn sang <strong>Phòng Thí Nghiệm Động Lực Học</strong> bên phải màn hình. Bấm nút <strong>"CHẠY MÔ PHỎNG"</strong>, thử thay đổi các tham số (môi trường hành tinh, khối lượng, cắt dây, bung dù) và quan sát các vector lực, số liệu cảm biến!</p>
        </div>

        <div style="margin-top: 18px; display:flex; justify-content:space-between;">
          <button class="btn" onclick="window.investigationEngine.prevPhase()">⬅ Pha 2</button>
          <button class="btn btn-primary" id="btnNextToDuel" onclick="window.investigationEngine.nextPhase()" disabled>
            Vào Pha 4: Đấu trí Socratic với Dr. Sophos ➜
          </button>
        </div>
      </div>
    `;
  }

  handlePoeChoice(optId, isCorrect) {
    if (!this.hasValidProfile()) {
      this.openProfileModal();
      return;
    }

    const buttons = document.querySelectorAll('.choice-btn');
    buttons.forEach(b => b.classList.remove('selected', 'correct', 'fallacy'));

    const selectedBtn = document.getElementById(`poe_opt_${optId}`);
    if (selectedBtn) {
      selectedBtn.classList.add('selected');
      if (isCorrect) {
        selectedBtn.classList.add('correct');
        if (window.audioFX) window.audioFX.playSuccess();
        this.score += 30;
        this.facione.t2 = Math.min(100, this.facione.t2 + 5);
      } else {
        selectedBtn.classList.add('fallacy');
        if (window.audioFX) window.audioFX.playDamage();
        this.facione.t2 = Math.max(30, this.facione.t2 - 2);
      }
    }

    this.updateScoreDisplay();
    document.getElementById('btnNextToDuel').disabled = false;
  }

  // Phase 4: Socratic AI Duel
  renderPhase4SocraticDuel(c) {
    const duel = c.socraticDuel;
    const round = duel.rounds[this.currentRound] || duel.rounds[duel.rounds.length - 1];

    return `
      <div class="ai-duel-header">
        <div>
          <strong style="color:var(--crimson)">🦹 DR. SOPHOS HP:</strong>
          <span style="font-family:var(--font-mono); color:var(--text-main);">${this.sophosHp}%</span>
        </div>
        <div class="hp-track">
          <div class="hp-fill" style="width: ${this.sophosHp}%;"></div>
        </div>
        <div>
          <span class="hud-badge">VÒNG ĐỐI CHẤT: ${this.currentRound + 1}/${duel.rounds.length}</span>
        </div>
      </div>

      <div class="narrative-card sophos">
        <h4 style="color:var(--crimson); margin-bottom:4px;">🦹 ĐÒN TẤN CÔNG NGỤY BIỆN CỦA DR. SOPHOS:</h4>
        <p>"${round.sophosAttack}"</p>
      </div>

      <div class="socratic-box">
        <h4 style="color:var(--purple); margin-bottom:6px;">🦉 3 CẤP ĐỘ GỢI Ý SOCRATIC:</h4>
        <p><span class="tier-badge">Cấp 1 (Quan sát)</span> ${round.socratesHint.t1}</p>
        <p style="margin-top:4px;"><span class="tier-badge">Cấp 2 (Cô lập biến)</span> ${round.socratesHint.t2}</p>
        <p style="margin-top:4px;"><span class="tier-badge">Cấp 3 (Định luật)</span> ${round.socratesHint.t3}</p>
      </div>

      <div class="choice-list">
        <p style="font-size:0.82rem; font-weight:700; color:var(--cyan); margin-bottom:4px;">CHỌN LẬP LUẬN BẰNG CHỨNG ĐỂ PHẢN BÁC:</p>
        ${round.responses.map(resp => `
          <div class="choice-btn" onclick="window.investigationEngine.handleDuelResponse(${resp.damage}, ${resp.correct}, '${resp.feedback.replace(/'/g, "\\'")}')">
            <span>⚔️</span>
            <span>${resp.text}</span>
          </div>
        `).join('')}
      </div>

      <div id="duelFeedback" style="display:none; margin:12px 0;"></div>

      <div style="margin-top: 18px; display:flex; justify-content:space-between;">
        <button class="btn" onclick="window.investigationEngine.prevPhase()">⬅ Pha 3</button>
        <button class="btn btn-primary" id="btnNextDuelStep" onclick="window.investigationEngine.advanceDuel()" style="display:none;">
          Tiếp tục ➜
        </button>
      </div>
    `;
  }

  handleDuelResponse(damage, isCorrect, feedbackText) {
    if (!this.hasValidProfile()) {
      this.openProfileModal();
      return;
    }

    const fb = document.getElementById('duelFeedback');
    fb.style.display = 'block';

    if (isCorrect) {
      this.sophosHp = Math.max(0, this.sophosHp - damage);
      fb.className = 'dossier-card';
      fb.style.borderLeftColor = 'var(--green)';
      fb.innerHTML = `<strong style="color:var(--green)">✓ BẰNG CHỨNG HỮU HIỆU:</strong> ${feedbackText}`;
      if (window.audioFX) window.audioFX.playDamage();
      this.score += 40;
      this.facione.t3 = Math.min(100, this.facione.t3 + 8);
    } else {
      fb.className = 'dossier-card';
      fb.style.borderLeftColor = 'var(--crimson)';
      fb.innerHTML = `<strong style="color:var(--crimson)">✗ BỊ DR. SOPHOS BẮT BÀI:</strong> ${feedbackText}`;
      if (window.audioFX) window.audioFX.playAlert();
      this.facione.t3 = Math.max(30, this.facione.t3 - 4);
    }

    this.updateScoreDisplay();

    if (this.sophosHp <= 0) {
      if (window.audioFX) window.audioFX.playPurified();
      fb.innerHTML += `
        <div class="purified-badge" style="margin-top:12px;">
          ✓ DR. SOPHOS ĐÃ BỊ THANH TẨY HOÀN TOÀN. CHÂN LÝ VẬT LÝ ĐÃ ĐƯỢC XÁC LẬP.
        </div>
      `;
      document.getElementById('btnNextDuelStep').innerText = 'Tiến vào Pha 5: Tuyên án & Kết luận ➜';
      document.getElementById('btnNextDuelStep').style.display = 'inline-flex';
    } else {
      document.getElementById('btnNextDuelStep').style.display = 'inline-flex';
    }
  }

  advanceDuel() {
    const c = this.getCurrentCase();
    if (this.sophosHp <= 0 || this.currentRound >= c.socraticDuel.rounds.length - 1) {
      this.nextPhase();
    } else {
      this.currentRound++;
      this.render();
    }
  }

  // Phase 5: Verdict & Multiple Endings
  renderPhase5Verdict(c) {
    const verdict = c.verdicts[0];
    this.solvedCases.add(c.id);

    return `
      <div class="purified-badge">
        <h3 style="color:var(--green); margin-bottom:8px;">⚖️ ${verdict.title}</h3>
        <p style="font-size:0.92rem; line-height:1.6; color:var(--text-main);">${verdict.summary}</p>
      </div>

      <div class="dossier-card">
        <h4 style="color:var(--cyan); margin-bottom:6px;">📋 THU THẬP VÀO HỒ SƠ CHỨNG CỨ:</h4>
        <ul style="padding-left:18px; line-height:1.6; font-size:0.84rem; color:var(--text-main);">
          <li>Bản chất vật lý cốt lõi: <strong>${c.subtitle}</strong>.</li>
          <li>Đã vạch trần bẫy ngụy biện: <strong>${c.fallacyType}</strong>.</li>
          <li>Đã đối chứng thực nghiệm ảo HTML5 Canvas 60 FPS thành công.</li>
          <li>Chỉ số năng lực Phản biện Facione T1 - T4 được cập nhật vào Báo cáo NCKH.</li>
        </ul>
      </div>

      <div style="margin-top: 24px; display:flex; justify-content:space-between; flex-wrap:wrap; gap:10px;">
        <button class="btn btn-purple" onclick="window.pedagogyAnalytics.openModal()">
          📊 Xem Báo Cáo NCKH Sư Phạm & Radar Facione
        </button>
        <button class="btn btn-primary" onclick="window.investigationEngine.loadNextCase()">
          Tiến vào Vụ án tiếp theo ➜
        </button>
      </div>
    `;
  }

  nextPhase() {
    if (!this.hasValidProfile()) {
      this.openProfileModal();
      return;
    }
    if (this.currentPhase < 5) {
      this.currentPhase++;
      this.render();
    }
  }

  prevPhase() {
    if (this.currentPhase > 1) {
      this.currentPhase--;
      this.render();
    }
  }

  loadNextCase() {
    if (!this.hasValidProfile()) {
      this.openProfileModal();
      return;
    }
    const nextIdx = (this.currentCaseIndex + 1) % window.CASES_DATA.length;
    this.loadCase(nextIdx);
  }

  updateScoreDisplay() {
    const el = document.getElementById('scoreDisplay');
    if (el) el.innerText = this.score;

    const rankEl = document.getElementById('rankDisplay');
    if (rankEl) {
      if (this.score < 100) rankEl.innerText = 'Tập sự';
      else if (this.score < 250) rankEl.innerText = 'Thám tử Logic';
      else if (this.score < 450) rankEl.innerText = 'Điều tra viên Socratic';
      else rankEl.innerText = 'Bậc Thầy Phản Biện';
    }
  }

  updateCaseSelectorUI() {
    const chips = document.querySelectorAll('.case-chip');
    chips.forEach((chip, i) => {
      chip.classList.toggle('active', i === this.currentCaseIndex);
      const caseId = window.CASES_DATA[i].id;
      chip.classList.toggle('solved', this.solvedCases.has(caseId));
    });
  }
}

window.investigationEngine = new InvestigationEngine();
