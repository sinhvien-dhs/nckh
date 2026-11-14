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
    this.loadSolvedCases();

    window.addEventListener('resize', () => {
      if (this.currentPhase === 3) this.alignConfidenceTicks();
    });
  }

  loadSolvedCases() {
    try {
      const saved = localStorage.getItem('physics_solved_cases');
      if (saved) {
        this.solvedCases = new Set(JSON.parse(saved));
        this.updateCaseSelectorUI();
      }
    } catch (e) {}
  }

  saveSolvedCases() {
    try {
      localStorage.setItem('physics_solved_cases', JSON.stringify([...this.solvedCases]));
    } catch (e) {}
  }

  resetAllProgress() {
    this.studentAnswers = {};
    this.solvedCases.clear();
    this.score = 0;
    this.currentCaseIndex = 0;
    this.currentPhase = 1;
    this.sophosHp = 100;
    this.currentRound = 0;
    this.facione = { t1: 70, t2: 65, t3: 60, t4: 75 };
    try {
      localStorage.removeItem('physics_student_answers');
      localStorage.removeItem('physics_solved_cases');
    } catch (e) {}
    this.updateScoreDisplay();
    this.updateCaseSelectorUI();
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
        this.recalculateScore();
      }
    } catch (e) {}
  }

  recalculateScore() {
    let total = 0;
    if (window.CASES_DATA) {
      window.CASES_DATA.forEach(c => {
        const cAns = this.studentAnswers[c.id];
        if (cAns) {
          // Pha 1: Mỗi phát biểu đúng 20đ
          if (c.classifyItems) {
            c.classifyItems.forEach(item => {
              if (cAns[item.id] && cAns[item.id].isCorrect) {
                total += 20;
              }
            });
          }
          // Pha 3: POE dự đoán đúng 30đ
          if (cAns.poeAnswer && cAns.poeAnswer.isCorrect) {
            total += 30;
          }
          // Pha 4: Mỗi vòng đối chất đúng 40đ
          if (cAns.duelRounds) {
            Object.values(cAns.duelRounds).forEach(r => {
              if (r.isCorrect) {
                total += 40;
              }
            });
          }
        }
      });
    }
    this.score = total;
    this.updateScoreDisplay();
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

  openProfileModal(isForNew = false) {
    const modal = document.getElementById('studentModal');
    if (modal) {
      const nameInp = document.getElementById('studentNameInput');
      const classInp = document.getElementById('studentClassInput');
      const schoolInp = document.getElementById('studentSchoolInput');
      const alertBox = document.getElementById('studentModalAlert');

      if (isForNew) {
        if (nameInp) nameInp.value = '';
        if (classInp) classInp.value = this.studentProfile.className || '';
        if (schoolInp) schoolInp.value = this.studentProfile.schoolName || '';
      } else {
        if (nameInp) nameInp.value = this.studentProfile.name || '';
        if (classInp) classInp.value = this.studentProfile.className || '';
        if (schoolInp) schoolInp.value = this.studentProfile.schoolName || '';
      }
      if (alertBox) alertBox.style.display = 'none';

      modal.classList.add('active');
      if (nameInp) setTimeout(() => nameInp.focus(), 150);
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

  saveProfile(forceReset = false) {
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

    const oldName = (this.studentProfile && this.studentProfile.name) ? this.studentProfile.name.trim() : '';
    const isNewStudent = oldName && oldName.toLowerCase() !== name.toLowerCase();

    // Nếu đổi tên học sinh mới hoặc bấm nút làm mới: xóa toàn bộ bài làm cũ để bắt đầu từ đầu
    if (forceReset || isNewStudent) {
      this.resetAllProgress();
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
      if (forceReset || isNewStudent) {
        window.showToast(`👤 Chào mừng thí sinh mới: ${name}! Toàn bộ bài làm đã được làm mới từ đầu.`);
      } else {
        window.showToast(`👤 Xin chào điều tra viên: ${name} (Lớp ${className})!`);
      }
    }
    if (window.audioFX) window.audioFX.playSuccess();

    this.render();

    // Ngay sau khi nhập tên thành công: Hiển thị popup hướng dẫn sư phạm tóm gọn
    if (window.openPedagogyGuide) {
      setTimeout(() => {
        window.openPedagogyGuide();
      }, 250);
    }
  }

  // Grand Completion Modal & Post-Game Actions
  openCompletionModal() {
    const modal = document.getElementById('completionModal');
    if (modal) {
      this.renderCompletionModal();
      modal.classList.add('active');
      if (window.audioFX) window.audioFX.playSuccess();
    }
  }

  closeCompletionModal() {
    const modal = document.getElementById('completionModal');
    if (modal) modal.classList.remove('active');
  }

  renderCompletionModal() {
    const modalBody = document.getElementById('completionModalBody');
    if (!modalBody) return;

    let rankBadge = 'Tập sự';
    let rankColor = 'var(--text-muted)';
    if (this.score >= 700) {
      rankBadge = '🎖️ Bậc Thầy Tư Duy Phản Biện (Xuất Sắc)';
      rankColor = 'var(--green)';
    } else if (this.score >= 450) {
      rankBadge = '🕵️ Điều Tra Viên Socratic (Khá Giỏi)';
      rankColor = 'var(--cyan)';
    } else {
      rankBadge = '🔍 Thám Tử Logic Tiềm Năng (Đang Phát Triển)';
      rankColor = 'var(--amber)';
    }

    modalBody.innerHTML = `
      <!-- Banner Chúc mừng & Lời khen của Giáo viên -->
      <div style="background:rgba(34,197,94,0.1); border:2px solid var(--green); border-radius:10px; padding:18px; text-align:center;">
        <div style="font-size:2.4rem; margin-bottom:6px;">🏆 🎓 🌟</div>
        <h2 style="color:var(--green); font-size:1.35rem; margin:0 0 8px 0; font-weight:800;">
          EM ĐÃ LÀM RẤT TỐT! XUẤT SẮC HOÀN THÀNH CHUYÊN ÁN!
        </h2>
        <p style="font-size:0.92rem; color:var(--text-main); margin:0; line-height:1.6;">
          Chúc mừng học sinh <strong>${this.studentProfile.name || 'Em'}</strong> (Lớp <strong>${this.studentProfile.className || '-'}</strong>, Trường <strong>${this.studentProfile.schoolName || '-'}</strong>) đã phá đảo thành công toàn bộ 6 chuyên đề Vật lý Động lực học. Em đã dùng tư duy phản biện sắc bén và chân lý thực nghiệm 60 FPS để đánh bại mọi lập luận ngụy biện của Dr. Sophos!
        </p>
      </div>

      <!-- Thẻ thành tích chi tiết -->
      <div style="background:var(--bg-alt); border:1px solid var(--border-color); border-radius:8px; padding:16px;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:12px; border-bottom:1px dashed var(--border-color); padding-bottom:10px;">
          <div>
            <span style="font-size:0.8rem; text-transform:uppercase; color:var(--text-muted); font-weight:700;">Tổng điểm phản biện</span>
            <div style="font-size:1.8rem; font-weight:800; color:var(--green);">${this.score} <span style="font-size:1rem; color:var(--text-muted); font-weight:400;">/ 900 điểm</span></div>
          </div>
          <div style="text-align:right;">
            <span style="font-size:0.8rem; text-transform:uppercase; color:var(--text-muted); font-weight:700;">Danh hiệu khoa học</span>
            <div style="margin-top:4px;"><span class="hud-badge" style="background:rgba(45,74,62,0.25); color:${rankColor}; border:1px solid ${rankColor}; font-size:0.9rem; padding:4px 12px;">${rankBadge}</span></div>
          </div>
        </div>

        <div style="font-weight:700; font-size:0.85rem; color:var(--text-muted); margin-bottom:8px;">📊 NĂNG LỰC PHẢN BIỆN THEO 4 THÀNH TỐ FACIONE (GDPT 2018):</div>
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(140px, 1fr)); gap:10px;">
          <div style="background:var(--bg-card); padding:10px; border-radius:6px; border:1px solid var(--border-color); text-align:center;">
            <div style="color:var(--cyan); font-weight:700; font-size:1.2rem;">${this.facione.t1}%</div>
            <div style="font-size:0.75rem; color:var(--text-muted); margin-top:2px;">T1: Phân tích phát biểu</div>
          </div>
          <div style="background:var(--bg-card); padding:10px; border-radius:6px; border:1px solid var(--border-color); text-align:center;">
            <div style="color:var(--green); font-weight:700; font-size:1.2rem;">${this.facione.t2}%</div>
            <div style="font-size:0.75rem; color:var(--text-muted); margin-top:2px;">T2: Đánh giá thực nghiệm</div>
          </div>
          <div style="background:var(--bg-card); padding:10px; border-radius:6px; border:1px solid var(--border-color); text-align:center;">
            <div style="color:var(--crimson); font-weight:700; font-size:1.2rem;">${this.facione.t3}%</div>
            <div style="font-size:0.75rem; color:var(--text-muted); margin-top:2px;">T3: Bác bỏ ngụy biện</div>
          </div>
          <div style="background:var(--bg-card); padding:10px; border-radius:6px; border:1px solid var(--border-color); text-align:center;">
            <div style="color:var(--amber); font-weight:700; font-size:1.2rem;">${this.facione.t4}%</div>
            <div style="font-size:0.75rem; color:var(--text-muted); margin-top:2px;">T4: Tự điều chỉnh</div>
          </div>
        </div>
      </div>

      <!-- Khung điều hướng: Người chơi làm gì tiếp theo? -->
      <div style="background:rgba(56,189,248,0.06); border:1px solid var(--cyan); border-radius:8px; padding:16px;">
        <div style="font-weight:700; font-size:0.92rem; color:var(--cyan); margin-bottom:8px;">
          🚀 BẠN MUỐN LÀM GÌ TIẾP THEO?
        </div>
        <p style="font-size:0.84rem; color:var(--text-main); margin:0 0 12px 0;">
          Dưới đây là các lựa chọn để phục vụ việc nộp bài cho giáo viên, ôn tập hoặc chuyển lượt chơi:
        </p>
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(210px, 1fr)); gap:10px;">
          <button class="btn btn-primary" onclick="window.pedagogyAnalytics.exportDataJSON()" style="padding:10px; font-weight:600; justify-content:center;">
            📥 1. Tải Dữ Liệu Nộp Thầy Cô
          </button>
          <button class="btn" onclick="window.print()" style="padding:10px; font-weight:600; justify-content:center;">
            🖨️ 2. In / Lưu Báo Cáo (PDF)
          </button>
          <button class="btn" onclick="window.investigationEngine.retryCurrentPlayer()" style="padding:10px; font-weight:600; justify-content:center; color:var(--green); border-color:var(--green);">
            🔄 3. Chơi Lại Cải Thiện Điểm
          </button>
          <button class="btn" onclick="window.investigationEngine.switchNewStudent()" style="padding:10px; font-weight:600; justify-content:center; color:var(--amber); border-color:var(--amber);">
            👥 4. Đổi Thí Sinh (Lượt Mới)
          </button>
        </div>
      </div>

      <div style="display:flex; justify-content:flex-end;">
        <button class="btn" onclick="window.investigationEngine.closeCompletionModal()" style="padding:8px 18px;">
          🔍 Đóng & Xem Lại 6 Vụ Án
        </button>
      </div>
    `;
  }

  retryCurrentPlayer() {
    const name = this.studentProfile.name || 'Em';
    if (confirm(`Bạn có chắc muốn chơi lại từ đầu để cải thiện điểm số và rèn luyện tư duy phản biện không?\n(Thông tin thí sinh "${name}" vẫn được giữ nguyên)`)) {
      this.resetAllProgress();
      this.closeCompletionModal();
      this.loadCase(0);
      if (window.showToast) {
        window.showToast(`🔄 Bắt đầu lượt thi mới! Chúc ${name} đạt điểm tối đa 900/900!`);
      }
    }
  }

  switchNewStudent() {
    this.closeCompletionModal();
    this.openProfileModal(true);
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
          <span>Chủ đề: ${currentCase.subtitle}</span>
          <span>• Tiến độ: Bước ${this.currentPhase}/5</span>
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
    if (this.currentPhase === 3) {
      requestAnimationFrame(() => this.alignConfidenceTicks());
    }
  }

  // Phase 1: Classify statements (Single Answer per Student, Any choice allowed)
  renderPhase1Classify(c) {
    const caseAnswers = this.studentAnswers[c.id] || {};
    let allAnswered = true;
    const typeNames = { fact: 'Sự Thật (Fact)', opinion: 'Ý Kiến (Opinion)', hypothesis: 'Giả Thuyết (Hypothesis)' };

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
              isCorrect ? `<div style="background:rgba(45,74,62,0.1); border-left:3px solid var(--green); padding:8px 12px; border-radius:4px;"><strong style="color:var(--green)">✅ PHÂN LOẠI CHÍNH XÁC:</strong> <span style="color:var(--text-main); margin-left:4px;">${item.explanation}</span></div>`
                        : `<div style="background:rgba(153,27,27,0.08); border-left:3px solid var(--crimson); padding:8px 12px; border-radius:4px;"><strong style="color:var(--crimson)">⚠️ SẬP BẪY NHẬN THỨC:</strong> <span style="color:var(--text-main); margin-left:4px;">Bạn đã chọn nhầm thành <em>${typeNames[chosen] || chosen}</em>. Thực tế đây là <strong>${typeNames[item.type]}</strong> vì: ${item.explanation}</span></div>`
            ) : ''}
          </div>
        </div>
      `;
    }).join('');

    return `
      <div class="narrative-card">
        <p><strong>NHIỆM VỤ ĐIỀU TRA:</strong> Đọc kỹ các phát biểu từ hiện trường. Hãy phân loại từng phát biểu theo nhận thức của bạn: 
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
          Tiếp tục ➜
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
    const typeNames = { fact: 'Sự Thật (Fact)', opinion: 'Ý Kiến (Opinion)', hypothesis: 'Giả Thuyết (Hypothesis)' };

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
          feedback.innerHTML = `
            <div style="background:rgba(45,74,62,0.1); border-left:3px solid var(--green); padding:8px 12px; border-radius:4px;">
              <strong style="color:var(--green)">✅ PHÂN LOẠI CHÍNH XÁC:</strong>
              <span style="color:var(--text-main); margin-left:4px;">${item.explanation}</span>
            </div>
          `;
          if (window.audioFX) window.audioFX.playSuccess();
          this.facione.t1 = Math.min(100, this.facione.t1 + 5);
        } else {
          feedback.innerHTML = `
            <div style="background:rgba(153,27,27,0.08); border-left:3px solid var(--crimson); padding:8px 12px; border-radius:4px;">
              <strong style="color:var(--crimson)">⚠️ SẬP BẪY NHẬN THỨC:</strong>
              <span style="color:var(--text-main); margin-left:4px;">Bạn đã chọn nhầm thành <em>${typeNames[chosenType]}</em>. Thực tế đây là <strong>${typeNames[item.type]}</strong> vì: ${item.explanation}</span>
            </div>
          `;
          if (window.audioFX) window.audioFX.playAlert();
          this.facione.t1 = Math.max(30, this.facione.t1 - 1);
        }
      }
      row.dataset.answered = 'true';
    }

    this.recalculateScore();

    // Kiểm tra đã hoàn thành toàn bộ phát biểu của vụ án chưa
    const allAnswered = currentCase.classifyItems.every(x => {
      return this.studentAnswers[currentCase.id] && this.studentAnswers[currentCase.id][x.id];
    });

    const nextBtn = document.getElementById('btnNextPhase');
    if (allAnswered && nextBtn) {
      nextBtn.disabled = false;
    }
  }

  // Phase 2: Fallacy Hunting with Interactive Highlighter (Bút Dạ Quang)
  renderPhase2Fallacy(c) {
    const caseAns = this.studentAnswers[c.id] || {};
    const highlightedIdx = caseAns.highlightedSegment !== undefined ? caseAns.highlightedSegment : null;
    const isUnmasked = !!caseAns.fallacyUnmasked;
    const segments = c.sophosSegments || [
      { id: 's1', text: c.sophosStatement, isFallacy: true, hint: c.fallacyExplanation }
    ];

    const segmentsHtml = segments.map((seg, idx) => {
      const isSelected = highlightedIdx === idx;
      let cls = 'highlighter-segment';
      if (isSelected || (isUnmasked && seg.isFallacy)) {
        cls += seg.isFallacy ? ' highlighted-fallacy' : ' highlighted-neutral';
      }
      return `
        <span class="${cls}" 
              id="seg_${c.id}_${idx}" 
              onclick="window.investigationEngine.handleHighlightSegment('${c.id}', ${idx})"
              title="Chạm để bôi dạ quang câu này">
          "${seg.text}"
        </span>
      `;
    }).join(' ');

    const selectedSeg = highlightedIdx !== null ? segments[highlightedIdx] : null;

    return `
      <div class="fallacy-banner">
        🚨 BƯỚC 2: BÓC TRẦN BẪY NGỤY BIỆN BẰNG BÚT DẠ QUANG TƯ DUY
      </div>

      <div class="highlighter-toolbar">
        <div class="highlighter-tool-badge">
          <span style="font-size:1.1rem;">🖍️</span>
          <strong>BÚT DẠ QUANG PHẢN BIỆN</strong>
        </div>
        <div class="highlighter-instruction">
          Chạm trực tiếp vào câu chứa <strong>bẫy ngụy biện</strong> của Dr. Sophos bên dưới để bôi vàng bóc tách luận điểm!
        </div>
      </div>

      <div class="narrative-card sophos">
        <h4 style="color:var(--crimson); margin-bottom:8px; display:flex; align-items:center; gap:6px;">
          <span>🦹‍♂️</span> TIẾN SĨ SOPHOS (LẬP LUẬN NGỤY BIỆN):
        </h4>
        <div class="highlighter-text-container" id="sophosStatementContainer">
          ${segmentsHtml}
        </div>
      </div>

      <div id="highlighterFeedback" style="margin-top:12px;">
        ${isUnmasked ? `
          <div class="dossier-card feedback-correct" style="border-left:4px solid var(--amber);">
            <h4 style="color:var(--amber); margin-bottom:6px; display:flex; align-items:center; gap:6px;">
              <span>🎯</span> ĐÃ KHOANH TRÚNG BẪY NGỤY BIỆN!
            </h4>
            <p style="color:var(--text-main); font-size:0.88rem;"><strong>Loại ngụy biện:</strong> ${c.fallacyType}</p>
            <p style="color:var(--text-muted); font-size:0.84rem; margin-top:4px; line-height:1.5;"><strong>Bản chất sai lầm:</strong> ${c.fallacyExplanation}</p>
            <div style="margin-top:6px; font-size:0.8rem; color:var(--green); font-weight:600;">
              ✨ Đã kích hoạt năng lực Facione T1/T2 (Bóc tách luận điểm khoa học)!
            </div>
          </div>
        ` : (selectedSeg && !selectedSeg.isFallacy ? `
          <div class="dossier-card" style="border-left:3px solid var(--cyan); background:rgba(31,78,90,0.08); padding:10px 14px;">
            <strong style="color:var(--cyan)">🔍 Dữ kiện thông thường:</strong>
            <span style="font-size:0.85rem; margin-left:4px; color:var(--text-main);">${selectedSeg.hint}</span>
            <p style="font-size:0.8rem; color:var(--text-muted); margin-top:4px;"><em>Gợi ý: Hãy chạm vào câu chứa kết luận võ đoán hoặc đánh tráo bản chất để bẻ gãy!</em></p>
          </div>
        ` : `
          <div class="narrative-card socrates" style="margin-bottom:0;">
            <h4 style="color:var(--purple); margin-bottom:4px; display:flex; align-items:center; gap:6px;">
              <span>🦉</span> CỐ VẤN SOCRATES:
            </h4>
            <p style="font-size:0.85rem;">Dùng ngón tay chạm vào câu văn ở trên mà bạn nghi ngờ là bẫy nhận thức sai lầm!</p>
          </div>
        `)}
      </div>

      <div style="margin-top: 18px; display:flex; justify-content:space-between;">
        <button class="btn" onclick="window.investigationEngine.prevPhase()">⬅ Quay lại</button>
        <button class="btn btn-primary" onclick="window.investigationEngine.nextPhase()">
          Tiếp tục ➜
        </button>
      </div>
    `;
  }

  handleHighlightSegment(caseId, segmentIdx) {
    const c = this.getCurrentCase();
    if (!c || c.id !== caseId) return;
    const segments = c.sophosSegments || [];
    const seg = segments[segmentIdx];
    if (!seg) return;

    if (!this.studentAnswers[caseId]) {
      this.studentAnswers[caseId] = {};
    }

    this.studentAnswers[caseId].highlightedSegment = segmentIdx;

    if (seg.isFallacy) {
      if (!this.studentAnswers[caseId].fallacyUnmasked) {
        this.studentAnswers[caseId].fallacyUnmasked = true;
        this.facione.t1 = Math.min(100, this.facione.t1 + 6);
        this.facione.t2 = Math.min(100, this.facione.t2 + 6);
        if (window.audioFX) window.audioFX.playSuccess();
        if (window.showToast) window.showToast('🎯 Đã dùng Bút Dạ Quang bóc trần bẫy ngụy biện!');
      } else {
        if (window.audioFX) window.audioFX.playClick();
      }
    } else {
      if (window.audioFX) window.audioFX.playAlert();
    }

    try {
      localStorage.setItem('physics_student_answers', JSON.stringify(this.studentAnswers));
    } catch (e) {}

    this.render();
  }

  // Phase 3: POE (Predict - Observe - Explain)
  getConfidenceInfo(val) {
    const num = parseInt(val, 10) || 80;
    if (num <= 20) {
      return { pct: 20, vibe: 'Phỏng đoán mơ hồ', short: 'Đoán bừa', color: 'var(--crimson)' };
    }
    if (num <= 40) {
      return { pct: 40, vibe: 'Chưa đủ cơ sở', short: 'Hơi nghi ngờ', color: 'var(--amber)' };
    }
    if (num <= 60) {
      return { pct: 60, vibe: 'Bán tín bán nghi', short: 'Phân vân 50/50', color: 'var(--cyan)' };
    }
    if (num <= 80) {
      return { pct: 80, vibe: 'Có cơ sở vững', short: 'Khá chắc chắn', color: 'var(--green)' };
    }
    return { pct: 100, vibe: 'Khẳng định tuyệt đối', short: 'Chắc chắn', color: 'var(--purple)' };
  }

  alignConfidenceTicks() {
    const slider = document.getElementById('confidenceSlider');
    const track = document.getElementById('confidenceTicksTrack');
    if (!slider || !track) return;
    const w = slider.offsetWidth;
    if (!w) return;
    const thumbW = 20;
    const items = track.querySelectorAll('.conf-tick-item');
    items.forEach(item => {
      const val = parseInt(item.dataset.val, 10);
      const p = (val - 20) / 80;
      const centerPx = (thumbW / 2) + p * (w - thumbW);
      item.style.position = 'absolute';
      item.style.left = `${centerPx.toFixed(1)}px`;
      item.style.transform = 'translateX(-50%)';
    });
    const currentVal = parseInt(slider.value, 10) || 80;
    const fillPct = ((currentVal - 20) / 80) * 100;
    const info = this.getConfidenceInfo(currentVal);
    slider.style.setProperty('--fill-pct', `${fillPct}%`);
    slider.style.setProperty('--conf-color', info.color);
  }

  updateConfidence(val) {
    const info = this.getConfidenceInfo(val);
    this.facione.t4 = info.pct;

    const slider = document.getElementById('confidenceSlider');
    if (slider) {
      if (parseInt(slider.value, 10) !== info.pct) {
        slider.value = info.pct;
      }
      const fillPct = ((info.pct - 20) / 80) * 100;
      slider.style.setProperty('--fill-pct', `${fillPct}%`);
      slider.style.setProperty('--conf-color', info.color);
    }

    const valEl = document.getElementById('confidenceVal');
    if (valEl) {
      valEl.innerHTML = `${info.pct}% — <strong>${info.vibe}</strong> <span style="font-size:0.85em; opacity:0.85;">(${info.short})</span>`;
      valEl.style.color = info.color;
    }

    const ticks = document.querySelectorAll('.conf-tick-item');
    ticks.forEach(t => {
      const tVal = parseInt(t.dataset.val, 10);
      const tInfo = this.getConfidenceInfo(tVal);
      const mark = t.querySelector('.conf-tick-mark');
      if (tVal === info.pct) {
        t.classList.add('active');
        t.style.fontWeight = '700';
        t.style.color = tInfo.color;
        if (mark) {
          mark.style.background = tInfo.color;
          mark.style.boxShadow = `0 0 6px ${tInfo.color}`;
        }
      } else {
        t.classList.remove('active');
        t.style.fontWeight = '400';
        t.style.color = 'var(--text-muted)';
        if (mark) {
          mark.style.background = 'var(--border-strong)';
          mark.style.boxShadow = 'none';
        }
      }
    });

    const currentCase = this.getCurrentCase();
    if (currentCase && this.studentAnswers[currentCase.id] && this.studentAnswers[currentCase.id].poeAnswer) {
      this.studentAnswers[currentCase.id].poeAnswer.confidence = info.pct;
      this.studentAnswers[currentCase.id].poeAnswer.confidenceLabel = `${info.vibe} (${info.short})`;
      try {
        localStorage.setItem('physics_student_answers', JSON.stringify(this.studentAnswers));
      } catch (e) {}
    }

    this.alignConfidenceTicks();
    if (window.audioFX) window.audioFX.playClick();
  }

  renderPhase3POE(c) {
    const caseAns = this.studentAnswers[c.id] || {};
    const savedPoe = caseAns.poeAnswer;
    const isAnswered = !!savedPoe;
    const savedConf = (savedPoe && savedPoe.confidence) ? savedPoe.confidence : this.facione.t4;
    const currentConf = this.getConfidenceInfo(savedConf || 80);

    return `
      <div class="poe-container">
        <h3 style="color:var(--cyan); margin-bottom:8px;">⚡ DỰ ĐOÁN & QUAN SÁT THỰC NGHIỆM (POE)</h3>
        <p style="font-size:0.88rem; margin-bottom:12px;"><strong>Câu hỏi giả thuyết:</strong> ${c.poeQuestion}</p>

        <div class="choice-list">
          ${c.poeOptions.map((opt, i) => {
            let extraClass = '';
            let style = '';
            if (isAnswered) {
              style = 'pointer-events:none; opacity:0.85;';
              if (savedPoe.optId === opt.id) {
                extraClass = 'selected ' + (savedPoe.isCorrect ? 'correct' : 'fallacy');
              }
            }
            return `
              <div class="choice-btn ${extraClass}" id="poe_opt_${opt.id}" style="${style}" onclick="window.investigationEngine.handlePoeChoice('${opt.id}', ${!!opt.correct})">
                <span><strong>${String.fromCharCode(65 + i)}.</strong></span>
                <span>${opt.text}</span>
              </div>
            `;
          }).join('')}
        </div>

        <div id="poeFeedback" style="display:${isAnswered ? 'block' : 'none'}; margin:14px 0;">
          ${isAnswered ? `
            <div class="dossier-card ${savedPoe.isCorrect ? 'feedback-correct' : 'feedback-fallacy'}">
              <div style="display:flex; align-items:flex-start; gap:8px;">
                <span style="font-size:1.1rem; line-height:1;">${savedPoe.isCorrect ? '✅' : '⚠️'}</span>
                <div>
                  <strong style="color:${savedPoe.isCorrect ? 'var(--green)' : 'var(--crimson)'}">
                    ${savedPoe.isCorrect ? 'DỰ ĐOÁN CHÍNH XÁC:' : 'SẬP BẪY NGỘ NHẬN KHOA HỌC:'}
                  </strong>
                  <p style="margin-top:4px; font-size:0.86rem; color:var(--text-main); line-height:1.5;">${savedPoe.explanation}</p>
                </div>
              </div>
            </div>
          ` : ''}
        </div>

        <div class="confidence-slider-box">
          <label style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:6px; margin-bottom:10px;">
            <span style="color:var(--text-main);">ĐỘ TIN CẬY NHẬN THỨC CỦA BẠN (Cognitive Confidence Score):</span>
            <span id="confidenceVal" style="color:${currentConf.color}; font-weight:700;">
              ${currentConf.pct}% — <strong>${currentConf.vibe}</strong> <span style="font-size:0.85em; opacity:0.85;">(${currentConf.short})</span>
            </span>
          </label>
          <div class="confidence-track-wrap">
            <input type="range" class="slider-input" id="confidenceSlider" min="20" max="100" step="20" value="${currentConf.pct}" 
                   style="--fill-pct: ${((currentConf.pct - 20) / 80) * 100}%; --conf-color: ${currentConf.color};"
                   ${isAnswered ? 'disabled style="opacity:0.85; --fill-pct: ' + (((currentConf.pct - 20) / 80) * 100) + '%; --conf-color: ' + currentConf.color + ';"' : ''}
                   oninput="window.investigationEngine.updateConfidence(this.value)">
            <div class="confidence-ticks-track" id="confidenceTicksTrack">
              ${[20, 40, 60, 80, 100].map(val => {
                const itemInfo = this.getConfidenceInfo(val);
                const isActive = currentConf.pct === val;
                const styleColor = isActive ? itemInfo.color : 'var(--text-muted)';
                const styleWeight = isActive ? '700' : '400';
                const markBg = isActive ? itemInfo.color : 'var(--border-strong)';
                const markShadow = isActive ? `box-shadow:0 0 6px ${itemInfo.color};` : '';
                const p = (val - 20) / 80;
                const initialLeft = `calc(${p * 100}% + ${(10 - 20 * p).toFixed(1)}px)`;
                return `
                  <div class="conf-tick-item ${isActive ? 'active' : ''}" data-val="${val}" 
                       ${!isAnswered ? `onclick="window.investigationEngine.updateConfidence(${val})"` : ''} 
                       style="left:${initialLeft}; cursor:${isAnswered ? 'default' : 'pointer'}; font-weight:${styleWeight}; color:${styleColor};">
                    <div class="conf-tick-mark" style="background:${markBg}; ${markShadow}"></div>
                    <strong>${val}%</strong>
                    <small style="color:var(--text-dim); font-size:0.7rem;">${itemInfo.short}</small>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
          <small style="color:var(--text-dim); display:block; margin-top:6px;">Kéo thanh trượt hoặc chạm vào từng mức để tự đánh giá mức độ chắc chắn của bạn trước khi quan sát thí nghiệm.</small>
        </div>

        <div class="narrative-card" style="border-left: 4px solid var(--green);">
          <p><strong>HƯỚNG DẪN QUAN SÁT THỰC NGHIỆM (OBSERVE):</strong> Bấm nút <strong>"Chạy Mô Phỏng"</strong>, thử thay đổi các tham số (môi trường hành tinh, khối lượng, cắt dây, bung dù) và quan sát các vector lực, số liệu cảm biến!</p>
          <button class="btn btn-primary mobile-only-btn" onclick="window.scrollToSimulation()" style="margin-top:10px; width:100%; justify-content:center; padding:10px; font-weight:600;">
            🔬 Xuống Xem Mô Phỏng Thực Nghiệm 60 FPS ⬇
          </button>
        </div>

        <div style="margin-top: 18px; display:flex; justify-content:space-between;">
          <button class="btn" onclick="window.investigationEngine.prevPhase()">⬅ Quay lại</button>
          <button class="btn btn-primary" id="btnNextToDuel" onclick="window.investigationEngine.nextPhase()" ${isAnswered ? '' : 'disabled'}>
            Tiếp tục ➜
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

    const currentCase = this.getCurrentCase();
    if (!this.studentAnswers[currentCase.id]) {
      this.studentAnswers[currentCase.id] = {};
    }

    // BẢO VỆ CHỐNG ĐÚP ĐIỂM: Nếu câu POE đã được trả lời, không cho phép bấm lại!
    if (this.studentAnswers[currentCase.id].poeAnswer) {
      return;
    }

    const opt = currentCase.poeOptions.find(o => o.id === optId);
    const confInfo = this.getConfidenceInfo(this.facione.t4);
    this.studentAnswers[currentCase.id].poeAnswer = {
      optId: optId,
      isCorrect: isCorrect,
      confidence: confInfo.pct,
      confidenceLabel: `${confInfo.vibe} (${confInfo.short})`,
      explanation: opt ? opt.explanation : '',
      timestamp: new Date().toISOString()
    };

    try {
      localStorage.setItem('physics_student_answers', JSON.stringify(this.studentAnswers));
    } catch (e) {}

    const buttons = document.querySelectorAll('.choice-btn');
    buttons.forEach(b => {
      b.style.pointerEvents = 'none';
      b.style.opacity = '0.85';
    });

    const selectedBtn = document.getElementById(`poe_opt_${optId}`);
    if (selectedBtn) {
      selectedBtn.classList.add('selected');
      if (isCorrect) {
        selectedBtn.classList.add('correct');
        if (window.audioFX) window.audioFX.playSuccess();
        this.facione.t2 = Math.min(100, this.facione.t2 + 5);
      } else {
        selectedBtn.classList.add('fallacy');
        if (window.audioFX) window.audioFX.playDamage();
        this.facione.t2 = Math.max(30, this.facione.t2 - 2);
      }
    }

    // Hiển thị ngay lập tức giải thích nguyên nhân dự đoán sai / đúng
    const fb = document.getElementById('poeFeedback');
    if (fb && opt) {
      fb.style.display = 'block';
      if (isCorrect) {
        fb.className = 'dossier-card feedback-correct';
        fb.innerHTML = `
          <div style="display:flex; align-items:flex-start; gap:8px;">
            <span style="font-size:1.1rem; line-height:1;">✅</span>
            <div>
              <strong style="color:var(--green)">DỰ ĐOÁN CHÍNH XÁC:</strong>
              <p style="margin-top:4px; font-size:0.86rem; color:var(--text-main); line-height:1.5;">${opt.explanation || 'Dự đoán của bạn hoàn toàn phù hợp với nguyên lý vật lý!'}</p>
            </div>
          </div>
        `;
      } else {
        fb.className = 'dossier-card feedback-fallacy';
        fb.innerHTML = `
          <div style="display:flex; align-items:flex-start; gap:8px;">
            <span style="font-size:1.1rem; line-height:1;">⚠️</span>
            <div>
              <strong style="color:var(--crimson)">SẬP BẪY NGỘ NHẬN KHOA HỌC:</strong>
              <p style="margin-top:4px; font-size:0.86rem; color:var(--text-main); line-height:1.5;">${opt.explanation || 'Dự đoán chưa chính xác! Hãy quan sát mô phỏng bên phải để đối chiếu bản chất vật lý.'}</p>
            </div>
          </div>
        `;
      }
    }

    this.recalculateScore();
    const btnNext = document.getElementById('btnNextToDuel');
    if (btnNext) btnNext.disabled = false;
  }

  // Phase 4: Socratic AI Duel
  renderPhase4SocraticDuel(c) {
    const duel = c.socraticDuel;
    const round = duel.rounds[this.currentRound] || duel.rounds[duel.rounds.length - 1];
    const caseAns = this.studentAnswers[c.id] || {};
    const duelRounds = caseAns.duelRounds || {};
    const savedRound = duelRounds[this.currentRound];
    const isAnswered = !!savedRound;

    return `
      <div class="ai-duel-header">
        <div>
          <strong style="color:var(--crimson)">🩸 DR. SOPHOS HP:</strong>
          <span style="font-family:var(--font-mono); color:var(--text-main);">${this.sophosHp}%</span>
        </div>
        <div class="hp-track">
          <div class="hp-fill" style="width: ${this.sophosHp}%;"></div>
        </div>
        <div>
          <span class="hud-badge">⚔️ VÒNG ĐỐI CHẤT: ${this.currentRound + 1}/${duel.rounds.length}</span>
        </div>
      </div>

      <div class="narrative-card sophos">
        <h4 style="color:var(--crimson); margin-bottom:4px;">🦹‍♂️ TIẾN SĨ SOPHOS (LẬP LUẬN NGỤY BIỆN):</h4>
        <p>"${round.sophosAttack}"</p>
      </div>

      <div class="socratic-box">
        <h4 style="color:var(--purple); margin-bottom:6px;">🦉 3 TẦNG GỢI Ý SOCRATIC:</h4>
        <p><span class="tier-badge">Cấp 1 (Quan sát)</span> ${round.socratesHint.t1}</p>
        <p style="margin-top:4px;"><span class="tier-badge">Cấp 2 (Cô lập biến)</span> ${round.socratesHint.t2}</p>
        <p style="margin-top:4px;"><span class="tier-badge">Cấp 3 (Định luật)</span> ${round.socratesHint.t3}</p>
      </div>

      <div class="choice-list">
        <p style="font-size:0.82rem; font-weight:700; color:var(--cyan); margin-bottom:4px;">⚖️ CHỌN LẬP LUẬN BẰNG CHỨNG ĐỂ PHẢN BÁC:</p>
        ${round.responses.map((resp, i) => {
          let extraClass = '';
          let style = '';
          if (isAnswered) {
            style = 'pointer-events:none; opacity:0.85;';
            if (savedRound.optionIdx === i) {
              extraClass = 'selected ' + (savedRound.isCorrect ? 'correct' : 'fallacy');
            }
          }
          return `
            <div class="choice-btn ${extraClass}" style="${style}" onclick="window.investigationEngine.handleDuelResponse(${resp.damage}, ${resp.correct}, '${resp.feedback.replace(/'/g, "\\'")}', ${i})">
              <span><strong>${String.fromCharCode(65 + i)}.</strong></span>
              <span>${resp.text}</span>
            </div>
          `;
        }).join('')}
      </div>

      <div id="duelFeedback" style="display:${isAnswered ? 'block' : 'none'}; margin:12px 0;">
        ${isAnswered ? `
          <div class="dossier-card ${savedRound.isCorrect ? 'feedback-correct' : 'feedback-fallacy'}">
            <strong style="color:${savedRound.isCorrect ? 'var(--green)' : 'var(--crimson)'}">
              ${savedRound.isCorrect ? '✅ BẰNG CHỨNG HỮU HIỆU:' : '⚠️ LẬP LUẬN BỊ BÁC BỎ:'}
            </strong> ${savedRound.feedbackText}
          </div>
          ${this.sophosHp <= 0 ? `
            <div class="purified-badge" style="margin-top:12px;">
              🏆 DR. SOPHOS ĐÃ BỊ THANH TẨY HOÀN TOÀN. CHÂN LÝ VẬT LÝ ĐÃ ĐƯỢC XÁC LẬP.
            </div>
          ` : ''}
        ` : ''}
      </div>

      <div style="margin-top: 18px; display:flex; justify-content:space-between;">
        <button class="btn" onclick="window.investigationEngine.prevPhase()">⬅ Quay lại</button>
        <button class="btn btn-primary" id="btnNextDuelStep" onclick="window.investigationEngine.advanceDuel()" style="display:${isAnswered ? 'inline-flex' : 'none'};">
          ${(this.sophosHp <= 0 || this.currentRound >= duel.rounds.length - 1) ? 'Xem Kết Luận Vụ Án ➜' : 'Tiếp tục ➜'}
        </button>
      </div>
    `;
  }

  handleDuelResponse(damage, isCorrect, feedbackText, optionIdx) {
    if (!this.hasValidProfile()) {
      this.openProfileModal();
      return;
    }

    const currentCase = this.getCurrentCase();
    if (!this.studentAnswers[currentCase.id]) {
      this.studentAnswers[currentCase.id] = {};
    }
    if (!this.studentAnswers[currentCase.id].duelRounds) {
      this.studentAnswers[currentCase.id].duelRounds = {};
    }

    // BẢO VỆ CHỐNG ĐÚP ĐIỂM: Nếu vòng đấu này đã chọn đáp án, không cho chọn thêm lần nữa!
    if (this.studentAnswers[currentCase.id].duelRounds[this.currentRound]) {
      return;
    }

    this.studentAnswers[currentCase.id].duelRounds[this.currentRound] = {
      optionIdx: optionIdx,
      damage: damage,
      isCorrect: isCorrect,
      feedbackText: feedbackText,
      timestamp: new Date().toISOString()
    };
    try {
      localStorage.setItem('physics_student_answers', JSON.stringify(this.studentAnswers));
    } catch (e) {}

    const fb = document.getElementById('duelFeedback');
    if (fb) {
      fb.style.display = 'block';

      if (isCorrect) {
        this.sophosHp = Math.max(0, this.sophosHp - damage);
        fb.className = 'dossier-card feedback-correct';
        fb.innerHTML = `<strong style="color:var(--green)">✅ BẰNG CHỨNG HỮU HIỆU:</strong> ${feedbackText}`;
        if (window.audioFX) window.audioFX.playSuccess();
        this.facione.t3 = Math.min(100, this.facione.t3 + 8);
      } else {
        fb.className = 'dossier-card feedback-fallacy';
        fb.innerHTML = `<strong style="color:var(--crimson)">⚠️ LẬP LUẬN BỊ BÁC BỎ:</strong> ${feedbackText}`;
        if (window.audioFX) window.audioFX.playAlert();
        this.facione.t3 = Math.max(30, this.facione.t3 - 4);
      }

      // Khóa tất cả các nút phản biện của vòng này
      const choiceButtons = document.querySelectorAll('.choice-btn');
      choiceButtons.forEach((btn, idx) => {
        btn.style.pointerEvents = 'none';
        btn.style.opacity = '0.85';
        if (idx === optionIdx) {
          btn.classList.add('selected', isCorrect ? 'correct' : 'fallacy');
        }
      });

      const nextBtn = document.getElementById('btnNextDuelStep');
      const duel = currentCase.socraticDuel;
      const isDuelDone = this.sophosHp <= 0 || this.currentRound >= duel.rounds.length - 1;

      if (this.sophosHp <= 0) {
        if (window.audioFX) window.audioFX.playPurified();
        fb.innerHTML += `
          <div class="purified-badge" style="margin-top:12px;">
            🏆 DR. SOPHOS ĐÃ BỊ THANH TẨY HOÀN TOÀN. CHÂN LÝ VẬT LÝ ĐÃ ĐƯỢC XÁC LẬP.
          </div>
        `;
      }

      if (nextBtn) {
        nextBtn.innerText = isDuelDone ? 'Xem Kết Luận Vụ Án ➜' : 'Tiếp tục ➜';
        nextBtn.style.display = 'inline-flex';
      }
    }

    this.recalculateScore();
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
    this.saveSolvedCases();
    this.updateCaseSelectorUI();

    // Kiểm tra xem đã hoàn thành toàn bộ các vụ án chưa
    const isAllCasesSolved = this.solvedCases.size >= window.CASES_DATA.length;
    let allCasesReviewHtml = '';

    // Khi học sinh giải xong toàn bộ 6 vụ án: Tự động mở popup vinh danh sau 700ms
    if (isAllCasesSolved) {
      setTimeout(() => {
        this.openCompletionModal();
      }, 700);

      let rankBadge = 'Tập sự';
      let rankClass = 'var(--text-muted)';
      if (this.score >= 700) {
        rankBadge = '🎖️ Bậc Thầy Tư Duy Phản Biện (Xuất Sắc)';
        rankClass = 'var(--green)';
      } else if (this.score >= 450) {
        rankBadge = '🕵️ Điều Tra Viên Socratic (Khá Giỏi)';
        rankClass = 'var(--cyan)';
      } else {
        rankBadge = '🔍 Thám Tử Logic Tiềm Năng (Đang Phát Triển)';
        rankClass = 'var(--amber)';
      }

      const t1Feedback = this.facione.t1 >= 80 
        ? 'Xuất sắc: Em phân biệt rất chuẩn xác giữa dữ liệu đo lường thực nghiệm (Sự thật) và các định kiến hay giả thuyết khoa học.'
        : 'Tốt: Cần lưu ý các từ ngữ mang tính cảm tính để tránh nhầm lẫn nhận thức giữa ý kiến chủ quan và dữ liệu thực nghiệm.';

      const t2Feedback = this.facione.t2 >= 80
        ? 'Rất tốt: Em nắm vững phương pháp kiểm chứng POE, biết đối chiếu số liệu cảm biến động lực học để kiểm chứng các giả thuyết.'
        : 'Khá: Cần rèn luyện thêm kỹ năng quan sát các vectơ lực và gia tốc để đưa ra dự đoán thực nghiệm chính xác hơn.';

      const t3Feedback = this.facione.t3 >= 80
        ? 'Sắc bén: Lập luận logic chặt chẽ, sử dụng thành thạo các định luật Newton để đập tan các luận điểm ngụy biện của Dr. Sophos.'
        : 'Đang tiến bộ: Nên bám sát nguyên lý tác dụng - phản lực và định luật quán tính khi tham gia tranh biện khoa học.';

      const t4Feedback = this.facione.t4 >= 80
        ? 'Tuyệt vời: Tinh thần khoa học cởi mở, tự tin hợp lý và sẵn sàng thay đổi ngộ nhận nhận thức khi có chứng cứ thực nghiệm.'
        : 'Cần rèn luyện thêm: Hãy điều chỉnh độ tự tin khoa học sao cho phù hợp với mức độ bằng chứng đã thu thập được.';

      const overallAdvice = this.score >= 700
        ? `Chúc mừng em đã hoàn thành xuất sắc toàn bộ 6/6 chuyên đề điều tra động lực học! Em đã chứng minh được phẩm chất của một người học có tư duy phản biện khoa học vững vàng: biết hoài nghi khoa học trước các phát biểu áp đặt, biết tìm kiếm bằng chứng thực nghiệm và dũng cảm bảo vệ chân lý. Hãy tiếp tục phát huy tinh thần này!`
        : `Chúc mừng em đã hoàn thành toàn bộ 6/6 chuyên đề điều tra! Em đã vượt qua nhiều bẫy ngụy biện kinh điển trong lịch sử khoa học. Hãy tiếp tục nuôi dưỡng thói quen đặt câu hỏi phản biện, kiểm chứng giả thuyết bằng thực nghiệm trong môn Vật lý và cuộc sống!`;

      allCasesReviewHtml = `
        <div style="background:var(--bg-card); border:2px solid var(--green); border-radius:10px; padding:20px; margin-top:20px;">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:14px; border-bottom:1px solid var(--border-color); padding-bottom:10px;">
            <div>
              <h3 style="color:var(--green); font-size:1.1rem; margin:0;">
                🎓 BẢN ĐÁNH GIÁ TỔNG KẾT NĂNG LỰC TƯ DUY PHẢN BIỆN (NCKH SƯ PHẠM)
              </h3>
              <p style="font-size:0.85rem; color:var(--text-muted); margin-top:4px;">
                Thí sinh: <strong style="color:var(--cyan)">${this.studentProfile.name || 'Học sinh'}</strong> • Lớp: <strong>${this.studentProfile.className || '-'}</strong> • Trường: <strong>${this.studentProfile.schoolName || '-'}</strong>
              </p>
            </div>
            <div style="text-align:right;">
              <div style="font-size:1.35rem; font-weight:700; color:var(--green);">${this.score} / 900 điểm</div>
              <span class="hud-badge" style="background:rgba(45,74,62,0.2); color:${rankClass}; border:1px solid ${rankClass};">${rankBadge}</span>
            </div>
          </div>

          <div style="margin-bottom:16px;">
            <h4 style="color:var(--text-main); font-size:0.9rem; margin-bottom:8px;">👨‍🏫 NHẬN XÉT CHI TIẾT THEO 4 THÀNH TỐ FACIONE (1990):</h4>
            <div style="display:grid; grid-template-columns:1fr; gap:10px; font-size:0.84rem;">
              <div style="background:var(--bg-alt); padding:10px 14px; border-radius:6px; border-left:3px solid var(--cyan);">
                <strong style="color:var(--cyan)">T1 - Phân tích phát biểu (Analysis): ${this.facione.t1}%</strong>
                <p style="margin-top:4px; color:var(--text-main);">${t1Feedback}</p>
              </div>
              <div style="background:var(--bg-alt); padding:10px 14px; border-radius:6px; border-left:3px solid var(--green);">
                <strong style="color:var(--green)">T2 - Đánh giá bằng chứng thực nghiệm (Evaluation): ${this.facione.t2}%</strong>
                <p style="margin-top:4px; color:var(--text-main);">${t2Feedback}</p>
              </div>
              <div style="background:var(--bg-alt); padding:10px 14px; border-radius:6px; border-left:3px solid var(--crimson);">
                <strong style="color:var(--crimson)">T3 - Bác bỏ ngụy biện Socratic (Inference): ${this.facione.t3}%</strong>
                <p style="margin-top:4px; color:var(--text-main);">${t3Feedback}</p>
              </div>
              <div style="background:var(--bg-alt); padding:10px 14px; border-radius:6px; border-left:3px solid var(--amber);">
                <strong style="color:var(--amber)">T4 - Tự điều chỉnh nhận thức (Self-Regulation): ${this.facione.t4}%</strong>
                <p style="margin-top:4px; color:var(--text-main);">${t4Feedback}</p>
              </div>
            </div>
          </div>

          <div style="background:rgba(45,74,62,0.08); padding:14px; border-radius:8px; border:1px solid rgba(45,74,62,0.3);">
            <h4 style="color:var(--green); font-size:0.88rem; margin-bottom:6px;">🌟 LỜI PHÊ & ĐỊNH HƯỚNG CỦA GIÁO VIÊN:</h4>
            <p style="font-size:0.86rem; line-height:1.6; color:var(--text-main);">${overallAdvice}</p>
          </div>
        </div>
      `;
    }

    return `
      <div class="purified-badge">
        <h3 style="color:var(--green); margin-bottom:8px;">🏆 ${verdict.title}</h3>
        <p style="font-size:0.92rem; line-height:1.6; color:var(--text-main);">${verdict.summary}</p>
      </div>

      <div class="dossier-card">
        <h4 style="color:var(--cyan); margin-bottom:6px;">📋 HỒ SƠ BẰNG CHỨNG ĐÃ THU THẬP:</h4>
        <ul style="padding-left:18px; line-height:1.6; font-size:0.84rem; color:var(--text-main);">
          <li>Bản chất vật lý cốt lõi: <strong>${c.subtitle}</strong>.</li>
          <li>Đã vạch trần bẫy ngụy biện: <strong>${c.fallacyType}</strong>.</li>
          <li>Đã đối chứng thực nghiệm ảo HTML5 Canvas 60 FPS thành công.</li>
          <li>Chỉ số năng lực Phản biện Facione T1 - T4 được cập nhật vào Báo cáo NCKH.</li>
        </ul>
      </div>

      <div class="case-review-box" style="background:var(--bg-alt); padding:16px; border-radius:8px; border-left:4px solid var(--green); margin-top:14px;">
        <div style="display:flex; align-items:center; gap:8px; margin-bottom:6px;">
          <span style="font-size:1.25rem;">👨‍🏫</span>
          <strong style="color:var(--green); font-size:0.95rem;">LỜI KHEN & NHẬN XÉT CỦA GIÁO VIÊN:</strong>
        </div>
        <p style="font-size:0.88rem; margin:0; line-height:1.6; color:var(--text-main);">
          🎉 <strong>Em đã làm rất tốt!</strong> Học sinh <strong>${this.studentProfile.name || 'Em'}</strong> (Lớp ${this.studentProfile.className || '-'}) đã phá án thành công <strong>Vụ án ${this.currentCaseIndex + 1}: ${c.title.split(':')[1] || c.title}</strong>! Em đã đối chiếu bằng chứng thực nghiệm 60 FPS, nhận diện đúng bẫy ngụy biện và bảo vệ thành công định luật khoa học chân chính trước lập luận của Dr. Sophos.
        </p>
      </div>

      ${allCasesReviewHtml}

      <div style="margin-top: 24px; display:flex; justify-content:space-between; flex-wrap:wrap; gap:10px;">
        <button class="btn" onclick="window.investigationEngine.prevPhase()">⬅ Quay lại</button>
        <div style="display:flex; gap:10px;">
          ${isAllCasesSolved ? `
            <button class="btn btn-primary" onclick="window.investigationEngine.openCompletionModal()" style="font-weight:700; background:var(--green); border-color:var(--green); box-shadow:0 0 12px rgba(34,197,94,0.35);">
              🏆 Xem Báo Cáo Vinh Danh & Bước Tiếp Theo ➜
            </button>
          ` : `
            <button class="btn btn-primary" onclick="window.investigationEngine.loadNextCase()">
              Tiếp tục sang Vụ án tiếp theo ➜
            </button>
          `}
        </div>
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
      if (this.score < 250) rankEl.innerText = 'Tập sự';
      else if (this.score < 450) rankEl.innerText = 'Thám tử Logic';
      else if (this.score < 700) rankEl.innerText = 'Điều tra viên Socratic';
      else rankEl.innerText = 'Bậc Thầy Phản Biện';
    }
  }

  updateCaseSelectorUI() {
    const chips = document.querySelectorAll('.case-chip');
    chips.forEach((chip, i) => {
      const isActive = i === this.currentCaseIndex;
      chip.classList.toggle('active', isActive);
      const caseId = window.CASES_DATA[i].id;
      chip.classList.toggle('solved', this.solvedCases.has(caseId));
      if (isActive) {
        try {
          chip.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
        } catch (e) {}
      }
    });
    if (window.syncCaseScrollCircles) window.syncCaseScrollCircles();
  }
}

window.investigationEngine = new InvestigationEngine();
