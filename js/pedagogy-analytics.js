/* ==========================================================================
   PHYSICS DETECTIVE - Pedagogy Analytics & Facione Radar Chart
   Standardized Sư phạm NCKH Evaluation (Facione 1990 & Ennis 2011)
   Includes SPSS 26.0 Statistical Validation Grid & Student Response Ledger
   ========================================================================== */

class PedagogyAnalytics {
  constructor() {
    this.canvas = document.getElementById('radarCanvas');
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;

    // Vẽ lại radar khi đổi nền sáng/tối trong lúc admin dashboard đang mở
    document.addEventListener('themechange', () => {
      const adminView = document.getElementById('adminDashboardView');
      const isAdminVisible = adminView && adminView.style.display !== 'none';
      if (isAdminVisible) {
        this.renderRadar();
      }
    });
  }

  palette() {
    const dark = document.documentElement.getAttribute('data-theme') === 'dark';
    return dark ? {
      ring: 'rgba(250, 250, 250, 0.18)',
      axis: 'rgba(185, 211, 227, 0.35)',
      label: '#B9D3E3',
      fill: 'rgba(185, 211, 227, 0.18)',
      stroke: '#B9D3E3',
      point: '#B7CDAF',
      pointStroke: '#121212'
    } : {
      ring: 'rgba(28, 25, 23, 0.15)',
      axis: 'rgba(31, 78, 90, 0.3)',
      label: '#1F4E5A',
      fill: 'rgba(31, 78, 90, 0.12)',
      stroke: '#1F4E5A',
      point: '#2D4A3E',
      pointStroke: '#FBFBF9'
    };
  }



  updateMetricsUI() {
    const f = window.investigationEngine.facione;
    const t1El = document.getElementById('metric_t1');
    const t2El = document.getElementById('metric_t2');
    const t3El = document.getElementById('metric_t3');
    const t4El = document.getElementById('metric_t4');

    if (t1El) t1El.innerText = `${f.t1}%`;
    if (t2El) t2El.innerText = `${f.t2}%`;
    if (t3El) t3El.innerText = `${f.t3}%`;
    if (t4El) t4El.innerText = `${f.t4}%`;
  }

  renderStudentLedger() {
    const container = document.getElementById('studentLedgerContainer');
    if (!container) return;

    const prof = window.investigationEngine.studentProfile;
    const answers = window.investigationEngine.studentAnswers || {};

    let totalAnswered = 0;
    let correctCount = 0;
    let rowsHtml = '';

    window.CASES_DATA.forEach((c, cIdx) => {
      const caseAns = answers[c.id];
      if (caseAns) {
        c.classifyItems.forEach(item => {
          const ans = caseAns[item.id];
          if (ans) {
            totalAnswered++;
            if (ans.isCorrect) correctCount++;

            const badgeColor = ans.chosen === 'fact' ? 'var(--green)' : (ans.chosen === 'opinion' ? 'var(--amber)' : 'var(--cyan)');
            const targetColor = ans.target === 'fact' ? 'var(--green)' : (ans.target === 'opinion' ? 'var(--amber)' : 'var(--cyan)');

            rowsHtml += `
              <tr>
                <td><strong>Vụ án ${cIdx + 1}</strong></td>
                <td style="font-size:0.8rem;">"${ans.text}"</td>
                <td><strong style="color:${badgeColor}">${ans.chosen.toUpperCase()}</strong></td>
                <td><span style="color:${targetColor}">${ans.target.toUpperCase()}</span></td>
                <td>${ans.isCorrect ? '<span style="color:var(--green)">✅ Chuẩn xác</span>' : '<span style="color:var(--amber)">💡 Ý kiến riêng</span>'}</td>
              </tr>
            `;
          }
        });
      }
    });

    const accuracyRate = totalAnswered > 0 ? ((correctCount / totalAnswered) * 100).toFixed(1) : '0';

    container.innerHTML = `
      <div style="background:var(--bg-alt); padding:14px; border-radius:8px; border:1px solid var(--border-color); margin-top:14px;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:10px;">
          <h4 style="color:var(--text-main); font-size:0.9rem; margin:0;">
            📋 NHẬT KÝ TƯ DUY PHẢN BIỆN CỦA HỌC SINH
          </h4>
          <div style="font-size:0.82rem; color:var(--text-muted);">
            Thí sinh: <strong style="color:var(--cyan)">${prof.name || 'Chưa nhập'}</strong> | 
            Lớp: <strong>${prof.className || '-'}</strong> | 
            Trường: <strong>${prof.schoolName || '-'}</strong>
          </div>
        </div>

        <div style="display:flex; gap:16px; margin-bottom:10px; font-size:0.82rem;">
          <span>Tổng phát biểu đã phân loại: <strong>${totalAnswered}</strong></span>
          <span>Phù hợp chuẩn nhận thức: <strong style="color:var(--green)">${correctCount} (${accuracyRate}%)</strong></span>
        </div>

        <div style="max-height:180px; overflow-y:auto;">
          <table class="spss-table" style="font-size:0.78rem;">
            <thead>
              <tr>
                <th>Vụ án</th>
                <th>Phát biểu từ hiện trường</th>
                <th>Lựa chọn học sinh</th>
                <th>Chuẩn nhận thức</th>
                <th>Đánh giá</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml || '<tr><td colspan="5" style="text-align:center; color:var(--text-muted);">Học sinh chưa thực hiện phân loại phát biểu nào. Hãy vào Vụ án 1 để bắt đầu!</td></tr>'}
            </tbody>
          </table>
        </div>

        <div style="display:flex; justify-content:flex-end; gap:8px; margin-top:10px;">
          <button class="btn" onclick="window.pedagogyAnalytics.exportDataJSON()" style="font-size:0.8rem; padding:4px 10px;">
            📥 Xuất File Dữ Liệu SPSS (JSON)
          </button>
        </div>
      </div>
    `;
  }

  exportDataJSON() {
    const exportData = {
      studentProfile: window.investigationEngine.studentProfile,
      facioneMetrics: window.investigationEngine.facione,
      score: window.investigationEngine.score,
      answers: window.investigationEngine.studentAnswers,
      exportedAt: new Date().toISOString()
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', dataStr);
    dlAnchor.setAttribute('download', `physics_critical_thinking_${(exportData.studentProfile.name || 'student').replace(/\s+/g, '_')}.json`);
    dlAnchor.click();
    dlAnchor.remove();
  }

  renderRadar() {
    if (!this.canvas) this.canvas = document.getElementById('radarCanvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    const ctx = this.ctx;

    const width = this.canvas.width;
    const height = this.canvas.height;
    const cx = width / 2;
    const cy = height / 2;
    const radius = 95;

    ctx.clearRect(0, 0, width, height);
    const p = this.palette();

    const labels = [
      'T1: Phân tích phát biểu',
      'T2: Đánh giá bằng chứng',
      'T3: Bác bỏ ngụy biện',
      'T4: Tự điều chỉnh nhận thức'
    ];

    const f = window.investigationEngine.facione;
    const values = [f.t1 / 100, f.t2 / 100, f.t3 / 100, f.t4 / 100];
    const numAxes = 4;

    // Concentric web rings
    ctx.strokeStyle = p.ring;
    ctx.lineWidth = 1;
    for (let r = 0.25; r <= 1.0; r += 0.25) {
      ctx.beginPath();
      for (let i = 0; i < numAxes; i++) {
        const angle = (i * 2 * Math.PI) / numAxes - Math.PI / 2;
        const x = cx + radius * r * Math.cos(angle);
        const y = cy + radius * r * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
    }

    // Axes & labels
    ctx.strokeStyle = p.axis;
    for (let i = 0; i < numAxes; i++) {
      const angle = (i * 2 * Math.PI) / numAxes - Math.PI / 2;
      const x = cx + radius * Math.cos(angle);
      const y = cy + radius * Math.sin(angle);
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(x, y);
      ctx.stroke();

      ctx.font = '10px "Inter", sans-serif';
      ctx.fillStyle = p.label;
      const labelX = cx + (radius + 22) * Math.cos(angle);
      const labelY = cy + (radius + 15) * Math.sin(angle);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(labels[i], labelX, labelY);
    }

    // Radar polygon
    ctx.beginPath();
    for (let i = 0; i < numAxes; i++) {
      const angle = (i * 2 * Math.PI) / numAxes - Math.PI / 2;
      const rVal = radius * values[i];
      const x = cx + rVal * Math.cos(angle);
      const y = cy + rVal * Math.sin(angle);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fillStyle = p.fill;
    ctx.fill();
    ctx.strokeStyle = p.stroke;
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Data points
    for (let i = 0; i < numAxes; i++) {
      const angle = (i * 2 * Math.PI) / numAxes - Math.PI / 2;
      const rVal = radius * values[i];
      const x = cx + rVal * Math.cos(angle);
      const y = cy + rVal * Math.sin(angle);

      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = p.point;
      ctx.fill();
      ctx.strokeStyle = p.pointStroke;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
  }

  printReport() {
    window.print();
  }
}

window.pedagogyAnalytics = new PedagogyAnalytics();
