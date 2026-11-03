/* ==========================================================================
   PHYSICS DETECTIVE - Investigation Engine
   Orchestrates 5 Critical Thinking Phases per Physics Case
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

    this.container = document.getElementById('investigationContent');
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
    this.loadCase(index);
  }

  getCurrentCase() {
    return window.CASES_DATA[this.currentCaseIndex];
  }

  render() {
    if (!this.container) return;
    const currentCase = this.getCurrentCase();

    let html = `
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

  // Phase 1: Classify statements
  renderPhase1Classify(c) {
    return `
      <div class="narrative-card">
        <p><strong>🕵️ NHIỆM VỤ ĐIỀU TRA (PHA 1/5):</strong> Đọc kỹ các phát biểu từ hiện trường và hồ sơ tranh chấp khoa học. Hãy phân loại từng phát biểu vào đúng bản chất nhận thức: 
        <strong style="color:var(--green)">SỰ THẬT (Fact)</strong>, <strong style="color:var(--amber)">Ý KIẾN (Opinion)</strong> hoặc <strong style="color:var(--cyan)">GIẢ THUYẾT (Hypothesis)</strong>.</p>
      </div>

      <div class="classify-list">
        ${c.classifyItems.map((item, idx) => `
          <div class="classify-item" id="item_${item.id}">
            <div class="classify-text"><strong>${idx + 1}.</strong> "${item.text}"</div>
            <div class="classify-options">
              <button class="btn-classify" onclick="window.investigationEngine.handleClassify('${item.id}', 'fact')">SỰ THẬT (Fact)</button>
              <button class="btn-classify" onclick="window.investigationEngine.handleClassify('${item.id}', 'opinion')">Ý KIẾN (Opinion)</button>
              <button class="btn-classify" onclick="window.investigationEngine.handleClassify('${item.id}', 'hypothesis')">GIẢ THUYẾT (Hypothesis)</button>
            </div>
            <div class="classify-feedback" id="feedback_${item.id}" style="display:none; font-size:0.8rem; margin-top:4px;"></div>
          </div>
        `).join('')}
      </div>

      <div style="margin-top: 18px; display:flex; justify-content:flex-end;">
        <button class="btn btn-primary" id="btnNextPhase" onclick="window.investigationEngine.nextPhase()" disabled>
          Tiếp tục sang Pha 2: Vạch trần Ngụy biện ➜
        </button>
      </div>
    `;
  }

  handleClassify(itemId, chosenType) {
    const currentCase = this.getCurrentCase();
    const item = currentCase.classifyItems.find(x => x.id === itemId);
    if (!item) return;

    const row = document.getElementById(`item_${itemId}`);
    const feedback = document.getElementById(`feedback_${itemId}`);
    const buttons = row.querySelectorAll('.btn-classify');

    buttons.forEach(b => {
      b.classList.remove('selected-fact', 'selected-opinion', 'selected-hypothesis');
    });

    const isCorrect = item.type === chosenType;
    if (isCorrect) {
      if (chosenType === 'fact') event.target.classList.add('selected-fact');
      if (chosenType === 'opinion') event.target.classList.add('selected-opinion');
      if (chosenType === 'hypothesis') event.target.classList.add('selected-hypothesis');

      feedback.style.display = 'block';
      feedback.style.color = 'var(--green)';
      feedback.innerHTML = `✓ CHÍNH XÁC: ${item.explanation}`;
      window.audioFX.playSuccess();
      this.score += 20;
      this.facione.t1 = Math.min(100, this.facione.t1 + 4);
    } else {
      feedback.style.display = 'block';
      feedback.style.color = 'var(--crimson)';
      feedback.innerHTML = `✗ CHƯA ĐÚNG: ${item.explanation}`;
      window.audioFX.playDamage();
      this.facione.t1 = Math.max(30, this.facione.t1 - 2);
    }

    row.dataset.answered = 'true';
    this.updateScoreDisplay();

    // Check if all items answered correctly
    const allAnswered = currentCase.classifyItems.every(x => {
      const el = document.getElementById(`item_${x.id}`);
      return el && el.dataset.answered === 'true';
    });

    if (allAnswered) {
      document.getElementById('btnNextPhase').disabled = false;
    }
  }

  // Phase 2: Fallacy Hunting
  renderPhase2Fallacy(c) {
    if (window.audioFX) {
      window.audioFX.speak(`Cảnh báo: Đây là phát biểu ngụy biện của Dr. Sophos: ${c.sophosStatement}`, 'sophos');
    }

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
          <p>🔬 <strong>HƯỚNG DẪN QUAN SÁT THỰC NGHIỆM (OBSERVE):</strong> Nhìn sang <strong>Phòng Thí Nghiệm Động Lực Học</strong> bên phải màn hình. Bấm nút <strong>"CHẠY MÔ PHỎNG"</strong>, thử thay đổi các tham số (hút chân không, khối lượng, góc dốc, cắt dây) và quan sát các vector lực, số liệu cảm biến!</p>
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
    const buttons = document.querySelectorAll('.choice-btn');
    buttons.forEach(b => b.classList.remove('selected', 'correct', 'fallacy'));

    const selectedBtn = document.getElementById(`poe_opt_${optId}`);
    if (selectedBtn) {
      selectedBtn.classList.add('selected');
      if (isCorrect) {
        selectedBtn.classList.add('correct');
        window.audioFX.playSuccess();
        this.score += 30;
        this.facione.t2 = Math.min(100, this.facione.t2 + 5);
      } else {
        selectedBtn.classList.add('fallacy');
        window.audioFX.playDamage();
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

    if (window.audioFX) {
      window.audioFX.speak(round.sophosAttack, 'sophos');
    }

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
    const fb = document.getElementById('duelFeedback');
    fb.style.display = 'block';

    if (isCorrect) {
      this.sophosHp = Math.max(0, this.sophosHp - damage);
      fb.className = 'dossier-card';
      fb.style.borderLeftColor = 'var(--green)';
      fb.innerHTML = `<strong style="color:var(--green)">✓ BẰNG CHỨNG HỮU HIỆU:</strong> ${feedbackText}`;
      window.audioFX.playDamage(); // Sophos damaged
      this.score += 40;
      this.facione.t3 = Math.min(100, this.facione.t3 + 8);
    } else {
      fb.className = 'dossier-card';
      fb.style.borderLeftColor = 'var(--crimson)';
      fb.innerHTML = `<strong style="color:var(--crimson)">✗ BỊ DR. SOPHOS BẮT BÀI:</strong> ${feedbackText}`;
      window.audioFX.playAlert();
      this.facione.t3 = Math.max(30, this.facione.t3 - 4);
    }

    this.updateScoreDisplay();

    // Check if HP reaches 0
    if (this.sophosHp <= 0) {
      window.audioFX.playPurified();
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
