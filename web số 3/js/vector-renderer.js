/* ==========================================================================
   PHYSICS DETECTIVE - Vector Renderer (HTML5 Canvas 60 FPS)
   Dynamic Vector Overlay for Grade 10 Mechanics
   Includes High-Contrast Readable Badges & Multi-Celestial Renderings
   ========================================================================== */

class VectorRenderer {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.width = this.canvas ? this.canvas.width : 700;
    this.height = this.canvas ? this.canvas.height : 380;
    this.showVectors = true;
    this.p = this.palette();
  }

  palette() {
    const dark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (dark) {
      return {
        grid: 'rgba(250, 250, 250, 0.06)',
        towerFill: 'rgba(250, 250, 250, 0.08)',
        towerStroke: 'rgba(250, 250, 250, 0.35)',
        ground: '#27272A',
        groundLine: '#3F3F46',
        teal: '#38bdf8',
        tealDeep: '#0284c7',
        green: '#4ade80',
        greenDeep: '#16a34a',
        amber: '#fbbf24',
        amberDeep: '#d97706',
        rose: '#f87171',
        roseDeep: '#dc2626',
        purple: '#c084fc',
        gray: '#94a3b8',
        text: '#F8FAFC',
        onShape: '#0f172a',
        spark: 'rgba(251, 191, 36, 0.4)',
        track: 'rgba(56, 189, 248, 0.25)',
        tether: 'rgba(248, 250, 252, 0.45)',
        cloud: 'rgba(248, 250, 252, 0.1)',
        carOutline: '#f87171'
      };
    }
    return {
      grid: 'rgba(28, 25, 23, 0.05)',
      towerFill: 'rgba(28, 25, 23, 0.08)',
      towerStroke: 'rgba(28, 25, 23, 0.35)',
      ground: '#E2E8F0',
      groundLine: '#CBD5E1',
      teal: '#0284c7',
      tealDeep: '#0369a1',
      green: '#16a34a',
      greenDeep: '#15803d',
      amber: '#d97706',
      amberDeep: '#b45309',
      rose: '#dc2626',
      roseDeep: '#b91c1c',
      purple: '#9333ea',
      gray: '#64748b',
      text: '#0F172A',
      onShape: '#FFFFFF',
      spark: 'rgba(217, 119, 6, 0.4)',
      track: 'rgba(2, 132, 199, 0.2)',
      tether: 'rgba(15, 23, 42, 0.4)',
      cloud: 'rgba(15, 23, 42, 0.06)',
      carOutline: '#dc2626'
    };
  }

  resize() {
    if (!this.canvas) return;
    const rect = this.canvas.parentElement ? this.canvas.parentElement.getBoundingClientRect() : null;
    const w = (rect && rect.width > 50) ? rect.width : (this.canvas.clientWidth > 50 ? this.canvas.clientWidth : 700);
    const h = (rect && rect.height > 50) ? rect.height : (this.canvas.clientHeight > 50 ? this.canvas.clientHeight : 380);
    this.canvas.width = Math.round(w);
    this.canvas.height = Math.round(h);
    this.width = this.canvas.width;
    this.height = this.canvas.height;
  }

  drawHighContrastBadge(ctx, text, x, y, options = {}) {
    const fontSize = options.fontSize || 10.5;
    const paddingX = options.paddingX || 6;
    const paddingY = options.paddingY || 3;
    const dark = document.documentElement.getAttribute('data-theme') === 'dark';
    const bg = options.bg || (dark ? 'rgba(15, 23, 42, 0.88)' : 'rgba(255, 255, 255, 0.94)');
    const border = options.border || (dark ? 'rgba(255, 255, 255, 0.35)' : 'rgba(0, 0, 0, 0.3)');
    const color = options.color || (dark ? '#f8fafc' : '#0f172a');
    
    ctx.save();
    ctx.font = `bold ${fontSize}px "Inter", monospace`;
    const textW = ctx.measureText(text).width;
    const boxW = textW + paddingX * 2;
    const boxH = fontSize + paddingY * 2;
    
    let boxX = x;
    let boxY = y;
    if (options.align === 'center') {
      boxX = x - boxW / 2;
    } else if (options.align === 'right') {
      boxX = x - boxW;
    }

    ctx.fillStyle = bg;
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(boxX, boxY, boxW, boxH, 4);
    else ctx.rect(boxX, boxY, boxW, boxH);
    ctx.fill();
    ctx.strokeStyle = border;
    ctx.lineWidth = 1.2;
    ctx.stroke();

    ctx.fillStyle = color;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, boxX + paddingX, boxY + boxH / 2);
    ctx.restore();
  }

  render(engine) {
    if (!this.ctx) return;
    const ctx = this.ctx;
    this.p = this.palette();
    ctx.clearRect(0, 0, this.width, this.height);

    this.drawGrid(ctx);

    switch (engine.currentCase) {
      case 'case1':
        this.renderCase1(ctx, engine);
        break;
      case 'case2':
        this.renderCase2(ctx, engine);
        break;
      case 'case3':
        this.renderCase3(ctx, engine);
        break;
      case 'case4':
        this.renderCase4(ctx, engine);
        break;
      case 'case5':
        this.renderCase5(ctx, engine);
        break;
      case 'case6':
        this.renderCase6(ctx, engine);
        break;
    }
  }

  drawGrid(ctx) {
    ctx.strokeStyle = this.p.grid;
    ctx.lineWidth = 1;
    for (let x = 0; x < this.width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, this.height);
      ctx.stroke();
    }
    for (let y = 0; y < this.height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(this.width, y);
      ctx.stroke();
    }
  }

  drawArrow(ctx, fromX, fromY, dx, dy, color, label) {
    if (!this.showVectors) return;
    const len = Math.hypot(dx, dy);
    if (len < 4) return;

    const toX = fromX + dx;
    const toY = fromY + dy;
    const headLen = Math.min(10, len * 0.35);
    const angle = Math.atan2(dy, dx);

    ctx.save();
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 2.2;

    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(toX, toY);
    ctx.lineTo(toX - headLen * Math.cos(angle - Math.PI / 6), toY - headLen * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(toX - headLen * Math.cos(angle + Math.PI / 6), toY - headLen * Math.sin(angle + Math.PI / 6));
    ctx.closePath();
    ctx.fill();

    if (label) {
      this.drawHighContrastBadge(ctx, label, toX + 6, toY - 8, { fontSize: 9.5, color: color, paddingX: 4, paddingY: 2 });
    }
    ctx.restore();
  }

  // Case 1: Pisa Freefall & Celestial Environments
  renderCase1(ctx, engine) {
    const s = engine.state;
    const groundY = this.height - 40;
    const envKey = engine.currentEnv || 'earth_air';
    const envInfo = (engine.environments && engine.environments[envKey]) || {
      name: 'Trái Đất',
      label: engine.isVacuum ? '⚡ MÔI TRƯỜNG: CHÂN KHÔNG (F_cản = 0)' : '💨 MÔI TRƯỜNG: KHÔNG KHÍ (Có F_cản)',
      sky: null,
      ground: null,
      groundLine: null
    };

    if (envInfo.sky) {
      ctx.fillStyle = envInfo.sky;
      ctx.fillRect(0, 0, this.width, groundY);
    }

    ctx.fillStyle = envInfo.ground || this.p.ground;
    ctx.fillRect(0, groundY, this.width, 40);
    ctx.strokeStyle = envInfo.groundLine || this.p.teal;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, groundY);
    ctx.lineTo(this.width, groundY);
    ctx.stroke();

    // Tháp Pisa
    const towerH = 200;
    ctx.fillStyle = this.p.towerFill;
    ctx.fillRect(30, groundY - towerH, 80, towerH);
    ctx.strokeStyle = this.p.towerStroke;
    ctx.strokeRect(30, groundY - towerH, 80, towerH);
    this.drawHighContrastBadge(ctx, 'THÁP PISA (h=45m)', 32, groundY - towerH - 22, { fontSize: 9.5 });

    // Huy hiệu môi trường gọn gàng góc trên bên trái
    this.drawHighContrastBadge(ctx, envInfo.label, 130, 12, { fontSize: 10, color: envInfo.isVacuum ? this.p.green : this.p.amber });

    const rho = engine.isVacuum ? 0.0 : engine.airDensity;
    const drag1 = 0.5 * rho * s.cDrag1 * s.area1 * s.v1 * s.v1;
    const drag2 = 0.5 * rho * s.cDrag2 * s.area2 * s.v2 * s.v2;

    // Body 1: Quả tạ chì 5kg
    const b1X = 220;
    const b1Y = groundY - s.y1;
    ctx.beginPath();
    ctx.arc(b1X, b1Y, 17, 0, Math.PI * 2);
    ctx.fillStyle = this.p.gray;
    ctx.fill();
    ctx.strokeStyle = this.p.teal;
    ctx.lineWidth = 2.5;
    ctx.stroke();
    this.drawHighContrastBadge(ctx, `${s.m1}kg (Quả Chì)`, b1X + 22, b1Y - 10, { color: this.p.teal });

    // Body 2: Lông vũ / Quả bóng nhẹ 0.5kg
    const b2X = 380;
    const b2Y = groundY - s.y2;
    ctx.beginPath();
    ctx.arc(b2X, b2Y, 14, 0, Math.PI * 2);
    ctx.fillStyle = this.p.amber;
    ctx.fill();
    ctx.strokeStyle = this.p.amberDeep;
    ctx.lineWidth = 2.5;
    ctx.stroke();
    this.drawHighContrastBadge(ctx, `${s.m2}kg (Vật Nhẹ)`, b2X + 18, b2Y - 10, { color: this.p.amber });

    // Vectơ vận tốc
    if (s.y1 > s.groundY) {
      this.drawArrow(ctx, b1X, b1Y, 0, Math.min(45, s.v1 * 2), this.p.teal, `v1=${s.v1.toFixed(1)}m/s`);
    }
    if (s.y2 > s.groundY) {
      this.drawArrow(ctx, b2X, b2Y, 0, Math.min(45, s.v2 * 2), this.p.teal, `v2=${s.v2.toFixed(1)}m/s`);
    }

    // Vectơ trọng lực P và Lực cản F_cản
    this.drawArrow(ctx, b1X, b1Y, 0, 42, this.p.rose, `P1=${(s.m1 * engine.g).toFixed(0)}N`);
    this.drawArrow(ctx, b2X, b2Y, 0, 28, this.p.rose, `P2=${(s.m2 * engine.g).toFixed(1)}N`);

    if (drag1 > 0.05) this.drawArrow(ctx, b1X, b1Y, 0, -Math.min(30, drag1 * 2), this.p.green, `F_cản1=${drag1.toFixed(1)}N`);
    if (drag2 > 0.05) this.drawArrow(ctx, b2X, b2Y, 0, -Math.min(30, drag2 * 4), this.p.green, `F_cản2=${drag2.toFixed(1)}N`);
  }

  // Helper: Vẽ xe tải chi tiết
  drawTruck(ctx, x, y, w, h, color, strokeColor, label) {
    const wheelR = 8;
    const chassisY = y + h - wheelR;
    const cabW = 32;
    const cargoW = w - cabW - 4;

    ctx.save();
    ctx.fillStyle = color;
    ctx.fillRect(x, y + 4, cargoW, h - wheelR - 4);
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y + 4, cargoW, h - wheelR - 4);

    const cabX = x + cargoW + 4;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(cabX, chassisY);
    ctx.lineTo(cabX, y + 16);
    ctx.lineTo(cabX + 8, y + 8);
    ctx.lineTo(cabX + cabW - 8, y + 8);
    ctx.lineTo(cabX + cabW, y + 24);
    ctx.lineTo(cabX + cabW, chassisY);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(cabX + 12, y + 12, 14, 12);

    [x + 12, x + cargoW - 12, cabX + cabW - 10].forEach(wx => {
      ctx.fillStyle = '#18181b';
      ctx.beginPath();
      ctx.arc(wx, chassisY, wheelR, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#71717a';
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    this.drawHighContrastBadge(ctx, label, x + 6, y - 18, { color: strokeColor });
    ctx.restore();
  }

  // Helper: Vẽ xe con chi tiết
  drawCar(ctx, x, y, w, h, color, strokeColor, label) {
    const wheelR = 6;
    const chassisY = y + h - wheelR;

    ctx.save();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x, chassisY);
    ctx.lineTo(x, y + 14);
    ctx.lineTo(x + 10, y + 6);
    ctx.lineTo(x + w - 16, y + 6);
    ctx.lineTo(x + w, y + 14);
    ctx.lineTo(x + w, chassisY);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(x + 14, y + 8, w - 28, 8);

    [x + 12, x + w - 12].forEach(wx => {
      ctx.fillStyle = '#18181b';
      ctx.beginPath();
      ctx.arc(wx, chassisY, wheelR, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#71717a';
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    this.drawHighContrastBadge(ctx, label, x + 2, y - 18, { color: strokeColor });
    ctx.restore();
  }

  // Case 2: Va Chạm Newton III
  renderCase2(ctx, engine) {
    const s = engine.state;
    const groundY = this.height - 50;

    ctx.fillStyle = this.p.ground;
    ctx.fillRect(0, groundY, this.width, 50);
    ctx.strokeStyle = this.p.groundLine;
    ctx.strokeRect(0, groundY, this.width, 50);

    ctx.strokeStyle = this.p.amber;
    ctx.lineWidth = 2;
    ctx.setLineDash([16, 12]);
    ctx.beginPath();
    ctx.moveTo(0, groundY + 25);
    ctx.lineTo(this.width, groundY + 25);
    ctx.stroke();
    ctx.setLineDash([]);

    const tW = 95, tH = 48;
    const tX = s.x1;
    const tY = groundY - tH;
    this.drawTruck(ctx, tX, tY, tW, tH, this.p.teal, this.p.tealDeep, `XE TẢI ${s.m1}kg`);

    const cW = 55, cH = 32;
    const cX = s.x2;
    const cY = groundY - cH;
    this.drawCar(ctx, cX, cY, cW, cH, this.p.rose, this.p.roseDeep, `XE CON ${s.m2}kg`);

    if (s.contactForce > 0) {
      const contactX = (tX + tW + cX) / 2;
      ctx.beginPath();
      ctx.arc(contactX, groundY - 22, 18, 0, Math.PI * 2);
      ctx.fillStyle = this.p.spark;
      ctx.fill();

      this.drawArrow(ctx, contactX, groundY - 32, -s.contactForce / 800, 0, this.p.green, `F_con->tải=${(s.contactForce / 1000).toFixed(1)}kN`);
      this.drawArrow(ctx, contactX, groundY - 18, s.contactForce / 800, 0, this.p.rose, `F_tải->con=${(s.contactForce / 1000).toFixed(1)}kN`);
    } else {
      this.drawArrow(ctx, tX + tW / 2, tY - 8, s.v1 * 3, 0, this.p.teal, `v1=${s.v1.toFixed(1)}m/s`);
      this.drawArrow(ctx, cX + cW / 2, cY - 8, s.v2 * 3, 0, this.p.teal, `v2=${s.v2.toFixed(1)}m/s`);
    }
  }

  // Case 3: Sợi dây quay tròn & Cắt dây quán tính (Tether rotation & cut string)
  renderCase3(ctx, engine) {
    const s = engine.state;
    const cx = this.width / 2;
    const cy = this.height / 2 + 10;
    const r = s.radius || 75;

    // Đường tròn quỹ đạo ban đầu
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = this.p.track;
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.stroke();
    ctx.setLineDash([]);

    // Vẽ Người ở tâm đang cầm đầu sợi dây
    ctx.save();
    // Đầu người
    ctx.fillStyle = this.p.teal;
    ctx.beginPath();
    ctx.arc(cx, cy - 14, 8, 0, Math.PI * 2);
    ctx.fill();
    // Thân người
    ctx.strokeStyle = this.p.tealDeep;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(cx, cy - 6);
    ctx.lineTo(cx, cy + 12);
    // Chân
    ctx.lineTo(cx - 8, cy + 24);
    ctx.moveTo(cx, cy + 12);
    ctx.lineTo(cx + 8, cy + 24);
    ctx.stroke();
    // Tay cầm dây
    ctx.beginPath();
    ctx.arc(cx, cy, 4, 0, Math.PI * 2);
    ctx.fillStyle = this.p.amber;
    ctx.fill();
    this.drawHighContrastBadge(ctx, 'NGƯỜI QUAY (TÂM O)', cx - 55, cy + 28, { fontSize: 9.5 });
    ctx.restore();

    // Vị trí quả cầu
    const ballPxX = cx + s.ballX;
    const ballPxY = cy + s.ballY;

    // Sợi dây nối (nếu chưa cắt)
    if (!s.isStringCut) {
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(ballPxX, ballPxY);
      ctx.strokeStyle = this.p.tether;
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Vectơ lực căng dây T (Lực hướng tâm) hướng vào tâm
      const dx = cx - ballPxX;
      const dy = cy - ballPxY;
      const dist = Math.hypot(dx, dy) || 1;
      this.drawArrow(ctx, ballPxX, ballPxY, (dx / dist) * 38, (dy / dist) * 38, this.p.rose, 'T (Lực hướng tâm)');

      // Vectơ vận tốc tức thời v tiếp tuyến đường tròn
      const vx = -Math.sin(s.angle) * 38;
      const vy = Math.cos(s.angle) * 38;
      this.drawArrow(ctx, ballPxX, ballPxY, vx, vy, this.p.green, 'v (tiếp tuyến)');
    } else {
      // Dây đã cắt: vẽ sợi dây đứt buông lỏng ở tâm
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(s.cutAngle) * 20, cy + Math.sin(s.cutAngle) * 20);
      ctx.strokeStyle = this.p.gray;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Đường vết quỹ đạo tiếp tuyến
      if (s.trail && s.trail.length > 1) {
        ctx.strokeStyle = this.p.green;
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        s.trail.forEach((pt, i) => {
          if (i === 0) ctx.moveTo(cx + pt.x, cy + pt.y);
          else ctx.lineTo(cx + pt.x, cy + pt.y);
        });
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Vectơ vận tốc quán tính theo tiếp tuyến
      this.drawArrow(ctx, ballPxX, ballPxY, s.tangentVx * 2.2, s.tangentVy * 2.2, this.p.green, 'v_quán tính (tiếp tuyến!)');

      this.drawHighContrastBadge(ctx, '✂ ĐÃ CẮT DÂY (T = 0): Vật bay theo tiếp tuyến quán tính (Định luật I Newton)!', 40, 20, {
        fontSize: 10.5,
        color: this.p.green
      });
    }

    // Quả cầu kim loại tròn
    ctx.beginPath();
    ctx.arc(ballPxX, ballPxY, 13, 0, Math.PI * 2);
    ctx.fillStyle = this.p.rose;
    ctx.fill();
    ctx.strokeStyle = this.p.carOutline;
    ctx.lineWidth = 2.5;
    ctx.stroke();
    this.drawHighContrastBadge(ctx, `Quả Cầu ${s.m}kg`, ballPxX + 16, ballPxY - 8, { fontSize: 9.5 });
  }

  // Case 4: Xe trượt dốc nghiêng & Phân tích lực
  renderCase4(ctx, engine) {
    const s = engine.state;
    const rad = (s.slopeAngleDeg * Math.PI) / 180;
    const startX = 60;
    const groundY = this.height - 40;
    const rampLen = 420;

    const endX = startX + rampLen * Math.cos(rad);
    const endY = groundY - rampLen * Math.sin(rad);

    // Con dốc hình tam giác
    ctx.beginPath();
    ctx.moveTo(startX, groundY);
    ctx.lineTo(endX, groundY);
    ctx.lineTo(startX, endY);
    ctx.closePath();
    ctx.fillStyle = this.p.ground;
    ctx.fill();
    ctx.strokeStyle = this.p.teal;
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Góc nghiêng dốc alpha
    this.drawHighContrastBadge(ctx, `Góc dốc α = ${s.slopeAngleDeg}°`, startX + 40, groundY - 26, { fontSize: 10, color: this.p.amber });

    // Vị trí xe trên dốc
    const d = s.dist;
    const carX = startX + d * Math.cos(rad);
    const carY = endY + d * Math.sin(rad);

    ctx.save();
    ctx.translate(carX, carY);
    ctx.rotate(rad);

    // Thân xe trên dốc
    ctx.fillStyle = this.p.teal;
    ctx.fillRect(-22, -26, 44, 24);
    ctx.strokeStyle = this.p.tealDeep;
    ctx.lineWidth = 2;
    ctx.strokeRect(-22, -26, 44, 24);

    // Bánh xe
    ctx.fillStyle = '#18181b';
    ctx.beginPath();
    ctx.arc(-14, 0, 5, 0, Math.PI * 2);
    ctx.arc(14, 0, 5, 0, Math.PI * 2);
    ctx.fill();

    // Vectơ Áp lực pháp tuyến N hướng vuông góc mặt dốc lên trên
    this.drawArrow(ctx, 0, -12, 0, -Math.min(50, s.normalForce / 250), this.p.green, `N = mg·cosα (${(s.normalForce).toFixed(0)}N)`);

    // Vectơ Lực ma sát trượt F_ms ngược hướng trượt
    this.drawArrow(ctx, 0, -2, -Math.min(45, s.frictionForce / 70), 0, this.p.rose, `F_ms = μ·N (${(s.frictionForce).toFixed(0)}N)`);

    // Vectơ P_x kéo xe trượt xuống dọc dốc
    const fDown = s.m * engine.g * Math.sin(rad);
    this.drawArrow(ctx, 0, -2, Math.min(50, fDown / 250), 0, this.p.amber, `P_x = mg·sinα`);
    ctx.restore();

    // Vectơ Trọng lực P thẳng đứng xuống
    const pVal = s.m * engine.g;
    this.drawArrow(ctx, carX, carY, 0, Math.min(55, pVal / 250), this.p.purple, `P = mg (${(pVal).toFixed(0)}N)`);

    // Thông tin động lực học
    this.drawHighContrastBadge(ctx, `a = g(sinα - μ·cosα) = ${s.accel.toFixed(2)} m/s² | v = ${s.v.toFixed(1)} m/s`, 40, 20, {
      fontSize: 10.5,
      color: this.p.green
    });
  }

  // Helper: Vẽ xe bọc thép quân sự
  drawArmoredVehicle(ctx, x, y, w, h, color, strokeColor, label, isLeader = true) {
    const wheelR = 7;
    const chassisY = y + h - wheelR;

    ctx.save();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x + 4, chassisY);
    ctx.lineTo(x, y + 16);
    ctx.lineTo(x + 8, y + 10);
    ctx.lineTo(x + 18, y + 8);
    ctx.lineTo(x + 20, y + 2);
    ctx.lineTo(x + 36, y + 2);
    ctx.lineTo(x + 38, y + 8);
    ctx.lineTo(x + w - 12, y + 10);
    ctx.lineTo(x + w, y + 18);
    ctx.lineTo(x + w - 4, chassisY);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x + 34, y + 5);
    ctx.lineTo(x + (isLeader ? 50 : 44), y + 5);
    ctx.stroke();

    [x + 12, x + 28, x + w - 14].forEach(wx => {
      ctx.fillStyle = '#18181b';
      ctx.beginPath();
      ctx.arc(wx, chassisY, wheelR, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#71717a';
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    this.drawHighContrastBadge(ctx, label, x, y - 18, { color: strokeColor });
    ctx.restore();
  }

  // Case 5: Va chạm xe bọc thép & Hao hụt cơ năng
  renderCase5(ctx, engine) {
    const s = engine.state;
    const groundY = this.height - 50;

    ctx.fillStyle = this.p.ground;
    ctx.fillRect(0, groundY, this.width, 50);

    ctx.strokeStyle = this.p.amber;
    ctx.lineWidth = 2;
    ctx.setLineDash([16, 12]);
    ctx.beginPath();
    ctx.moveTo(0, groundY + 25);
    ctx.lineTo(this.width, groundY + 25);
    ctx.stroke();
    ctx.setLineDash([]);

    const vW = 65, vH = 38;
    this.drawArmoredVehicle(ctx, s.x1, groundY - vH, vW, vH, this.p.teal, this.p.tealDeep, 'BỌC THÉP 1', true);
    this.drawArmoredVehicle(ctx, s.x2, groundY - vH, vW, vH, this.p.green, this.p.greenDeep, 'BỌC THÉP 2', false);

    if (s.isAttached) {
      const contactX = (s.x1 + vW + s.x2) / 2;
      ctx.beginPath();
      ctx.arc(contactX, groundY - 20, 16, 0, Math.PI * 2);
      ctx.fillStyle = this.p.spark;
      ctx.fill();

      this.drawHighContrastBadge(ctx, `💥 VA CHẠM MỀM: DÍNH CHẶT (Vận tốc chung vf = ${s.vf.toFixed(1)} m/s)`, 180, groundY - 60, {
        color: this.p.rose
      });
    } else {
      this.drawArrow(ctx, s.x1 + vW / 2, groundY - vH - 8, s.v1 * 3, 0, this.p.teal, `v1=${s.v1.toFixed(1)}m/s`);
    }

    this.drawHighContrastBadge(ctx, `⚡ ĐỘNG NĂNG BAN ĐẦU: ${(s.energyBefore / 1000).toFixed(1)} kJ`, 30, 20, { color: this.p.teal });
    this.drawHighContrastBadge(ctx, `🔥 NHIỆT NĂNG TỎA RA: ${(s.heatGenerated / 1000).toFixed(1)} kJ`, 30, 46, { color: s.isAttached ? this.p.rose : this.p.gray });
  }

  // Case 6: Người nhảy dù & Vận tốc tới hạn trong các môi trường thiên thể
  renderCase6(ctx, engine) {
    const s = engine.state;
    const groundY = this.height - 40;
    const skydiverX = this.width / 2;
    const skydiverY = groundY - s.y;

    const envKey = engine.currentEnv || 'earth_air';
    const envInfo = (engine.environments && engine.environments[envKey]) || {
      name: 'Trái Đất',
      label: '🌍 MÔI TRƯỜNG: TRÁI ĐẤT - KHÍ QUYỂN (g = 9.8 m/s²)',
      sky: null,
      ground: null,
      groundLine: null
    };

    if (envInfo.sky) {
      ctx.fillStyle = envInfo.sky;
      ctx.fillRect(0, 0, this.width, groundY);
    }

    ctx.fillStyle = envInfo.ground || this.p.ground;
    ctx.fillRect(0, groundY, this.width, 40);
    ctx.strokeStyle = envInfo.groundLine || this.p.teal;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, groundY);
    ctx.lineTo(this.width, groundY);
    ctx.stroke();

    // Mây bồng bềnh
    ctx.fillStyle = this.p.cloud;
    ctx.beginPath();
    ctx.arc(skydiverX - 120, 60, 36, 0, Math.PI * 2);
    ctx.arc(skydiverX - 80, 50, 48, 0, Math.PI * 2);
    ctx.arc(skydiverX - 40, 60, 36, 0, Math.PI * 2);
    ctx.arc(skydiverX + 100, 70, 44, 0, Math.PI * 2);
    ctx.fill();

    // Huy hiệu môi trường thiên thể
    this.drawHighContrastBadge(ctx, envInfo.label, 20, 15, { fontSize: 10, color: this.p.teal });

    // Dù cứu sinh khi bung
    if (s.parachuteOpen) {
      // Vòm dù lớn
      ctx.save();
      ctx.beginPath();
      ctx.arc(skydiverX, skydiverY - 60, 52, Math.PI, 0);
      ctx.fillStyle = this.p.rose;
      ctx.fill();
      ctx.strokeStyle = this.p.roseDeep;
      ctx.lineWidth = 3;
      ctx.stroke();

      // Dây dù nối xuống đai người
      ctx.strokeStyle = this.p.gray;
      ctx.lineWidth = 1.5;
      [-48, -24, 0, 24, 48].forEach(dx => {
        ctx.beginPath();
        ctx.moveTo(skydiverX + dx, skydiverY - 60);
        ctx.lineTo(skydiverX, skydiverY - 14);
        ctx.stroke();
      });
      this.drawHighContrastBadge(ctx, 'TÁN DÙ A=42m²', skydiverX - 45, skydiverY - 82, { color: this.p.rose });
      ctx.restore();
    }

    // Hình người nhảy dù (Skydiver)
    ctx.save();
    // Mũ bảo hộ & đầu
    ctx.fillStyle = this.p.amber;
    ctx.beginPath();
    ctx.arc(skydiverX, skydiverY - 18, 7, 0, Math.PI * 2);
    ctx.fill();
    // Thân áo bay
    ctx.fillStyle = this.p.teal;
    ctx.fillRect(skydiverX - 6, skydiverY - 11, 12, 16);
    // Tay dang rộng đón gió
    ctx.strokeStyle = this.p.tealDeep;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(skydiverX - 16, skydiverY - 8);
    ctx.lineTo(skydiverX - 6, skydiverY - 6);
    ctx.moveTo(skydiverX + 6, skydiverY - 6);
    ctx.lineTo(skydiverX + 16, skydiverY - 8);
    // Chân bay
    ctx.moveTo(skydiverX - 4, skydiverY + 5);
    ctx.lineTo(skydiverX - 10, skydiverY + 16);
    ctx.moveTo(skydiverX + 4, skydiverY + 5);
    ctx.lineTo(skydiverX + 10, skydiverY + 16);
    ctx.stroke();

    this.drawHighContrastBadge(ctx, `NGƯỜI NHẢY DÙ ${s.m}kg`, skydiverX + 22, skydiverY - 12, { fontSize: 9.5 });
    ctx.restore();

    // Vectơ lực
    const pVal = s.m * engine.g;
    this.drawArrow(ctx, skydiverX, skydiverY, 0, Math.min(55, pVal / 18), this.p.rose, `P=${pVal.toFixed(0)}N`);

    if (s.airResistForce > 1) {
      this.drawArrow(ctx, skydiverX, skydiverY, 0, -Math.min(55, s.airResistForce / 18), this.p.green, `F_cản=${s.airResistForce.toFixed(0)}N`);
    }

    // Hiển thị trạng thái Vận tốc & Cân bằng động giải thích theo Định luật I Newton
    const isTerminal = Math.abs(s.airResistForce - pVal) < 15 && s.v > 2;
    if (isTerminal) {
      this.drawHighContrastBadge(ctx, `⚖️ CÂN BẰNG ĐỘNG (F_cản = P => a = 0): RƠI ĐỀU VỚI VẬN TỐC TỚI HẠN v = ${s.v.toFixed(1)} m/s!`, 20, 42, {
        fontSize: 10.5,
        color: this.p.green
      });
      this.drawHighContrastBadge(ctx, `Định luật I Newton: Tổng lực bằng 0 thì vật tiếp tục chuyển động thẳng đều chứ KHÔNG hề dừng lại lơ lửng!`, 20, 68, {
        fontSize: 9.5,
        color: this.p.amber
      });
    } else {
      this.drawHighContrastBadge(ctx, `VẬN TỐC: ${s.v.toFixed(1)} m/s | VẬN TỐC TỚI HẠN: ${isFinite(s.terminalV) ? s.terminalV.toFixed(1) + ' m/s' : 'Vô hạn (chân không)'}`, 20, 42, {
        fontSize: 10.5,
        color: this.p.teal
      });
    }
  }
}

window.VectorRenderer = VectorRenderer;
