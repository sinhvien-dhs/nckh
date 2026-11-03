/* ==========================================================================
   PHYSICS DETECTIVE - Pedagogy Analytics & Facione Radar Chart
   Standardized Sư phạm NCKH Evaluation (Facione 1990 & Ennis 2011)
   Includes SPSS 26.0 Statistical Validation Grid
   ========================================================================== */

class PedagogyAnalytics {
  constructor() {
    this.modal = document.getElementById('juryModal');
    this.canvas = document.getElementById('radarCanvas');
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;

    // Vẽ lại radar khi đổi nền sáng/tối trong lúc modal đang mở.
    document.addEventListener('themechange', () => {
      if (this.modal && this.modal.classList.contains('active')) this.renderRadar();
    });
  }

  // Bảng màu radar đồng bộ với giao diện sáng/tối.
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

  openModal() {
    if (!this.modal) this.modal = document.getElementById('juryModal');
    if (this.modal) {
      this.modal.classList.add('active');
      this.renderRadar();
      this.updateMetricsUI();
    }
  }

  closeModal() {
    if (!this.modal) this.modal = document.getElementById('juryModal');
    if (this.modal) {
      this.modal.classList.remove('active');
    }
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

    // Draw concentric web rings
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

    // Draw axes
    ctx.strokeStyle = p.axis;
    for (let i = 0; i < numAxes; i++) {
      const angle = (i * 2 * Math.PI) / numAxes - Math.PI / 2;
      const x = cx + radius * Math.cos(angle);
      const y = cy + radius * Math.sin(angle);
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(x, y);
      ctx.stroke();

      // Axis Labels
      ctx.font = '10px "Inter", sans-serif';
      ctx.fillStyle = p.label;
      const labelX = cx + (radius + 22) * Math.cos(angle);
      const labelY = cy + (radius + 15) * Math.sin(angle);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(labels[i], labelX, labelY);
    }

    // Draw filled radar polygon
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
