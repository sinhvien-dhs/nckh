/* ==========================================================================
   PHYSICS DETECTIVE - Vector Renderer (HTML5 Canvas 60 FPS)
   Dynamic Vector Overlay for Grade 10 Mechanics
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

  // Bảng màu canvas đồng bộ với giao diện sáng/tối.
  palette() {
    const dark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (dark) {
      return {
        grid: 'rgba(250, 250, 250, 0.08)',
        towerFill: 'rgba(250, 250, 250, 0.06)',
        towerStroke: 'rgba(250, 250, 250, 0.25)',
        ground: '#27272A',
        groundLine: '#3F3F46',
        teal: '#B9D3E3',
        tealDeep: '#8FB4C9',
        green: '#B7CDAF',
        greenDeep: '#93AE8A',
        amber: '#EFD79B',
        amberDeep: '#C9AE68',
        rose: '#F2B8B8',
        roseDeep: '#C98F8F',
        purple: '#D3C6E8',
        gray: '#A1A1AA',
        text: '#FAFAFA',
        onShape: '#1C1917',
        spark: 'rgba(239, 215, 155, 0.28)',
        track: 'rgba(185, 211, 227, 0.30)',
        tether: 'rgba(250, 250, 250, 0.30)',
        cloud: 'rgba(250, 250, 250, 0.08)',
        carOutline: '#C98F8F'
      };
    }
    return {
      grid: 'rgba(28, 25, 23, 0.06)',
      towerFill: 'rgba(28, 25, 23, 0.06)',
      towerStroke: 'rgba(28, 25, 23, 0.25)',
      ground: '#E7E5E4',
      groundLine: '#D6D3D1',
      teal: '#1F4E5A',
      tealDeep: '#163B44',
      green: '#2D4A3E',
      greenDeep: '#243D33',
      amber: '#A16207',
      amberDeep: '#854D0E',
      rose: '#991B1B',
      roseDeep: '#7F1D1D',
      purple: '#6D3B4E',
      gray: '#57534E',
      text: '#1C1917',
      onShape: '#FFFFFF',
      spark: 'rgba(161, 98, 7, 0.35)',
      track: 'rgba(31, 78, 90, 0.35)',
      tether: 'rgba(28, 25, 23, 0.35)',
      cloud: 'rgba(28, 25, 23, 0.08)',
      carOutline: '#FBFBF9'
    };
  }

  resize() {
    if (!this.canvas) return;
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
  }

  render(engine) {
    if (!this.ctx) return;
    const ctx = this.ctx;
    this.p = this.palette();
    ctx.clearRect(0, 0, this.width, this.height);

    // Draw grid background
    this.drawGrid(ctx);

    // Render active case
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
    const headLen = 9;
    const angle = Math.atan2(dy, dx);

    ctx.save();
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 2.5;

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
      ctx.font = '11px "JetBrains Mono", monospace';
      ctx.fillStyle = color;
      ctx.fillText(label, toX + 6, toY - 4);
    }
    ctx.restore();
  }

  // Case 1: Freefall & Multi-Environment Celestial Physics
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

    // Environmental sky tint
    if (envInfo.sky) {
      ctx.fillStyle = envInfo.sky;
      ctx.fillRect(0, 0, this.width, groundY);
    }

    // Draw Ground with celestial coloring
    ctx.fillStyle = envInfo.ground || this.p.ground;
    ctx.fillRect(0, groundY, this.width, 40);
    ctx.strokeStyle = envInfo.groundLine || this.p.teal;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, groundY);
    ctx.lineTo(this.width, groundY);
    ctx.stroke();

    // Tower silhouette
    ctx.fillStyle = this.p.towerFill;
    ctx.fillRect(40, groundY - 280, 80, 280);
    ctx.strokeStyle = this.p.towerStroke;
    ctx.strokeRect(40, groundY - 280, 80, 280);

    // Tower label
    ctx.fillStyle = this.p.text;
    ctx.font = '10px "Inter", sans-serif';
    ctx.fillText('THÁP PISA (h=45m)', 42, groundY - 286);

    // Environmental Vacuum & Celestial indicator
    ctx.font = 'bold 12px "Inter", sans-serif';
    ctx.fillStyle = envInfo.isVacuum ? this.p.green : this.p.amber;
    ctx.fillText(envInfo.label, 140, 28);

    // Dynamic drag force calculation
    const rho = engine.isVacuum ? 0.0 : engine.airDensity;
    const drag1 = 0.5 * rho * s.cDrag1 * s.area1 * s.v1 * s.v1;
    const drag2 = 0.5 * rho * s.cDrag2 * s.area2 * s.v2 * s.v2;

    // Body 1 (Lead Ball - 5kg)
    const b1X = 220;
    const b1Y = groundY - s.y1;
    ctx.beginPath();
    ctx.arc(b1X, b1Y, 18, 0, Math.PI * 2);
    ctx.fillStyle = this.p.gray;
    ctx.fill();
    ctx.strokeStyle = this.p.teal;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = this.p.onShape;
    ctx.font = 'bold 10px monospace';
    ctx.fillText(`${s.m1}kg`, b1X - 13, b1Y + 3);

    // Body 2 (Light Object / Feather - 0.5kg)
    const b2X = 360;
    const b2Y = groundY - s.y2;
    ctx.beginPath();
    ctx.arc(b2X, b2Y, 12, 0, Math.PI * 2);
    ctx.fillStyle = this.p.amber;
    ctx.fill();
    ctx.strokeStyle = this.p.amberDeep;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = this.p.onShape;
    ctx.fillText(`${s.m2}kg`, b2X - 13, b2Y + 3);

    // Velocity Vectors
    if (s.y1 > s.groundY) {
      this.drawArrow(ctx, b1X, b1Y, 0, Math.min(50, s.v1 * 2), this.p.teal, `v1=${s.v1.toFixed(1)}m/s`);
    }
    if (s.y2 > s.groundY) {
      this.drawArrow(ctx, b2X, b2Y, 0, Math.min(50, s.v2 * 2), this.p.teal, `v2=${s.v2.toFixed(1)}m/s`);
    }

    // Gravity force vectors (scaled appropriately)
    const p1Val = s.m1 * engine.g;
    const p2Val = s.m2 * engine.g;
    const p1ArrowLen = Math.min(55, Math.max(14, p1Val * 0.5));
    const p2ArrowLen = Math.min(45, Math.max(10, p2Val * 0.5));
    this.drawArrow(ctx, b1X, b1Y, 0, p1ArrowLen, this.p.rose, `P1=${p1Val.toFixed(0)}N`);
    this.drawArrow(ctx, b2X, b2Y, 0, p2ArrowLen, this.p.rose, `P2=${p2Val.toFixed(0)}N`);

    // Drag force vectors pointing upwards
    if (drag1 > 0.1 && s.y1 > s.groundY) {
      this.drawArrow(ctx, b1X, b1Y, 0, -Math.min(40, Math.max(12, drag1 * 2)), this.p.amber, `Fc1=${drag1.toFixed(1)}N`);
    }
    if (drag2 > 0.1 && s.y2 > s.groundY) {
      this.drawArrow(ctx, b2X, b2Y, 0, -Math.min(40, Math.max(12, drag2 * 4)), this.p.amber, `Fc2=${drag2.toFixed(1)}N`);
    }

    // Photogates
    ctx.strokeStyle = this.p.green;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(180, groundY - 10);
    ctx.lineTo(440, groundY - 10);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = this.p.green;
    ctx.font = '10px "Inter", sans-serif';
    ctx.fillText('CỔNG QUANG ĐIỆN ĐO THỜI GIAN RƠI', 190, groundY - 15);

    // Timers display when landed
    if (s.t1 !== null) {
      ctx.fillStyle = this.p.teal;
      ctx.font = 'bold 11px monospace';
      ctx.fillText(`⏱ t1 = ${s.t1.toFixed(2)}s`, b1X - 25, groundY + 22);
    }
    if (s.t2 !== null) {
      ctx.fillStyle = this.p.amber;
      ctx.font = 'bold 11px monospace';
      ctx.fillText(`⏱ t2 = ${s.t2.toFixed(2)}s`, b2X - 25, groundY + 22);
    }

    if (s.t1 !== null && s.t2 !== null) {
      const diff = Math.abs(s.t1 - s.t2);
      ctx.font = 'bold 11px "Inter", sans-serif';
      if (diff < 0.05) {
        ctx.fillStyle = this.p.green;
        ctx.fillText(`🎯 CHẠM ĐẤT CÙNG LÚC! (Δt ≈ 0.00s)`, 450, groundY - 15);
      } else {
        ctx.fillStyle = this.p.rose;
        ctx.fillText(`⚠️ LỆCH NHAU: Δt = ${diff.toFixed(2)}s`, 450, groundY - 15);
      }
    }
  }

  // Helper: Vẽ xe tải (Truck) chi tiết
  drawTruck(ctx, x, y, w, h, color, strokeColor, label) {
    const wheelR = 8;
    const chassisY = y + h - wheelR;
    const cabW = 32;
    const cargoW = w - cabW - 4;

    ctx.save();
    // 1. Thùng xe tải chở hàng (Cargo container)
    ctx.fillStyle = color;
    ctx.fillRect(x, y + 4, cargoW, h - wheelR - 4);
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y + 4, cargoW, h - wheelR - 4);

    // Gân chịu lực thùng xe
    ctx.strokeStyle = 'rgba(255,255,255,0.22)';
    ctx.lineWidth = 1;
    for (let rx = x + 16; rx < x + cargoW - 8; rx += 16) {
      ctx.beginPath();
      ctx.moveTo(rx, y + 7);
      ctx.lineTo(rx, chassisY - 3);
      ctx.stroke();
    }

    // 2. Cabin đầu xe tải
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

    // Kính chắn gió cabin
    ctx.fillStyle = '#bae6fd';
    ctx.beginPath();
    ctx.moveTo(cabX + 10, y + 12);
    ctx.lineTo(cabX + cabW - 9, y + 12);
    ctx.lineTo(cabX + cabW - 2, y + 23);
    ctx.lineTo(cabX + 10, y + 23);
    ctx.closePath();
    ctx.fill();

    // Đèn pha trước xe tải
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(cabX + cabW - 4, y + 28, 4, 6);

    // 3. Bánh xe tải (3 bánh xe lớn chịu tải)
    [x + 16, x + 36, cabX + cabW - 12].forEach(wx => {
      ctx.fillStyle = '#18181b';
      ctx.beginPath();
      ctx.arc(wx, chassisY, wheelR, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#71717a';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = '#cbd5e1';
      ctx.beginPath();
      ctx.arc(wx, chassisY, 3, 0, Math.PI * 2);
      ctx.fill();
    });

    // Nhãn khối lượng
    ctx.fillStyle = this.p.onShape;
    ctx.font = 'bold 10px monospace';
    ctx.fillText(label, x + 8, y + 26);
    ctx.restore();
  }

  // Helper: Vẽ xe con (Passenger Car) khí động học
  drawCar(ctx, x, y, w, h, color, strokeColor, label) {
    const wheelR = 6;
    const chassisY = y + h - wheelR;

    ctx.save();
    // 1. Khung xe con khí động học
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x + 4, chassisY);
    ctx.lineTo(x, y + 18);
    ctx.lineTo(x + 10, y + 15);
    ctx.lineTo(x + 20, y + 4);
    ctx.lineTo(x + w - 22, y + 4);
    ctx.lineTo(x + w - 10, y + 15);
    ctx.lineTo(x + w, y + 18);
    ctx.lineTo(x + w - 2, chassisY);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 2;
    ctx.stroke();

    // 2. Kính xe (Windows)
    ctx.fillStyle = '#bae6fd';
    ctx.beginPath();
    ctx.moveTo(x + 22, y + 7);
    ctx.lineTo(x + w - 23, y + 7);
    ctx.lineTo(x + w - 14, y + 14);
    ctx.lineTo(x + 14, y + 14);
    ctx.closePath();
    ctx.fill();

    // Cột ngăn kính
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x + (w / 2), y + 7);
    ctx.lineTo(x + (w / 2), y + 14);
    ctx.stroke();

    // Đèn pha trước
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(x + w - 4, y + 19, 4, 4);
    // Đèn hậu đỏ
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(x, y + 19, 3, 4);

    // 3. Bánh xe con (2 bánh xe)
    [x + 15, x + w - 15].forEach(wx => {
      ctx.fillStyle = '#18181b';
      ctx.beginPath();
      ctx.arc(wx, chassisY, wheelR, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#71717a';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.fillStyle = '#cbd5e1';
      ctx.beginPath();
      ctx.arc(wx, chassisY, 2.5, 0, Math.PI * 2);
      ctx.fill();
    });

    // Nhãn khối lượng
    ctx.fillStyle = this.p.onShape;
    ctx.font = 'bold 9px monospace';
    ctx.fillText(label, x + 6, y + 25);
    ctx.restore();
  }

  // Case 2: Newton III Collision (Xe Tải va chạm Xe Con)
  renderCase2(ctx, engine) {
    const s = engine.state;
    const groundY = this.height - 60;

    // Road (Lòng đường)
    ctx.fillStyle = this.p.ground;
    ctx.fillRect(0, groundY, this.width, 60);
    ctx.strokeStyle = this.p.groundLine;
    ctx.strokeRect(0, groundY, this.width, 60);

    // Vạch kẻ đường đứt đoạn màu vàng
    ctx.strokeStyle = this.p.amber;
    ctx.lineWidth = 2;
    ctx.setLineDash([16, 12]);
    ctx.beginPath();
    ctx.moveTo(0, groundY + 30);
    ctx.lineTo(this.width, groundY + 30);
    ctx.stroke();
    ctx.setLineDash([]);

    // Xe tải (m1 = 5000kg)
    const tW = 100, tH = 50;
    const tX = s.x1;
    const tY = groundY - tH;
    this.drawTruck(ctx, tX, tY, tW, tH, this.p.teal, this.p.tealDeep, `XE TẢI ${s.m1}kg`);

    // Xe con (m2 = 1000kg)
    const cW = 60, cH = 35;
    const cX = s.x2;
    const cY = groundY - cH;
    this.drawCar(ctx, cX, cY, cW, cH, this.p.rose, this.p.roseDeep, `XE CON ${s.m2}kg`);

    // Force Sensors & Impact Spark (Điểm va chạm)
    if (s.contactForce > 0) {
      const contactX = (tX + tW + cX) / 2;
      ctx.beginPath();
      ctx.arc(contactX, groundY - 25, 20, 0, Math.PI * 2);
      ctx.fillStyle = this.p.spark;
      ctx.fill();

      // Action & Reaction Vectors (Định luật III Newton: F12 = -F21)
      this.drawArrow(ctx, contactX, groundY - 30, -s.contactForce / 800, 0, this.p.green, `F_xe con -> xe tải = ${(s.contactForce / 1000).toFixed(1)}kN`);
      this.drawArrow(ctx, contactX, groundY - 20, s.contactForce / 800, 0, this.p.rose, `F_xe tải -> xe con = ${(s.contactForce / 1000).toFixed(1)}kN`);
    } else {
      this.drawArrow(ctx, tX + tW / 2, tY - 10, s.v1 * 4, 0, this.p.teal, `v1=${s.v1.toFixed(1)}m/s`);
      this.drawArrow(ctx, cX + cW / 2, cY - 10, s.v2 * 4, 0, this.p.teal, `v2=${s.v2.toFixed(1)}m/s`);
    }
  }

  // Case 3: Curved Road & Centripetal
  renderCase3(ctx, engine) {
    const s = engine.state;
    const cx = this.width / 2;
    const cy = this.height / 2;

    // Track circle
    ctx.beginPath();
    ctx.arc(cx, cy, s.radius * 2, 0, Math.PI * 2);
    ctx.strokeStyle = this.p.track;
    ctx.lineWidth = 14;
    ctx.stroke();

    // Center pivot
    ctx.beginPath();
    ctx.arc(cx, cy, 6, 0, Math.PI * 2);
    ctx.fillStyle = this.p.teal;
    ctx.fill();

    // Car position
    const carPxX = cx + s.carX * 2;
    const carPxY = cy + s.carY * 2;

    // Tether line (if not cut)
    if (!s.isStringCut) {
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(carPxX, carPxY);
      ctx.strokeStyle = this.p.tether;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Centripetal force towards center
      const dxToCenter = cx - carPxX;
      const dyToCenter = cy - carPxY;
      const dist = Math.hypot(dxToCenter, dyToCenter);
      this.drawArrow(ctx, carPxX, carPxY, (dxToCenter / dist) * 45, (dyToCenter / dist) * 45, this.p.rose, 'F_hướng tâm');
    }

    // Car body
    ctx.beginPath();
    ctx.arc(carPxX, carPxY, 12, 0, Math.PI * 2);
    ctx.fillStyle = this.p.rose;
    ctx.fill();
    ctx.strokeStyle = this.p.carOutline;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Tangent Velocity Vector
    if (!s.isStringCut) {
      const vx = -Math.sin(s.angle) * 40;
      const vy = Math.cos(s.angle) * 40;
      this.drawArrow(ctx, carPxX, carPxY, vx, vy, this.p.green, 'v (tiếp tuyến)');
    } else {
      this.drawArrow(ctx, carPxX, carPxY, s.tangentVx * 2, s.tangentVy * 2, this.p.green, 'v_quán tính (tiếp tuyến!)');
    }
  }

  // Case 4: Incline Plane & Friction
  renderCase4(ctx, engine) {
    const s = engine.state;
    const rad = (s.slopeAngleDeg * Math.PI) / 180;
    const startX = 60;
    const groundY = this.height - 40;
    const rampLen = 420;

    const endX = startX + rampLen * Math.cos(rad);
    const endY = groundY - rampLen * Math.sin(rad);

    // Ramp
    ctx.beginPath();
    ctx.moveTo(startX, groundY);
    ctx.lineTo(endX, groundY);
    ctx.lineTo(startX, endY);
    ctx.closePath();
    ctx.fillStyle = this.p.ground;
    ctx.fill();
    ctx.strokeStyle = this.p.teal;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Block on ramp
    const d = s.dist;
    const blockX = startX + d * Math.cos(rad);
    const blockY = endY + d * Math.sin(rad);

    ctx.save();
    ctx.translate(blockX, blockY);
    ctx.rotate(rad);
    ctx.fillStyle = this.p.amber;
    ctx.fillRect(-20, -35, 40, 35);
    ctx.strokeStyle = this.p.amberDeep;
    ctx.lineWidth = 2;
    ctx.strokeRect(-20, -35, 40, 35);

    // Vectors: Normal force, friction, gravity
    this.drawArrow(ctx, 0, -17, 0, -s.normalForce / 2, this.p.green, `N=${s.normalForce.toFixed(0)}N`);
    this.drawArrow(ctx, 0, -5, -s.frictionForce * 1.5, 0, this.p.rose, `F_ms=${s.frictionForce.toFixed(1)}N`);
    ctx.restore();

    this.drawArrow(ctx, blockX, blockY, 0, (s.m * 9.8) / 2, this.p.purple, `P=${(s.m * 9.8).toFixed(0)}N`);
  }

  // Helper: Vẽ xe bọc thép (Armored Vehicle) quân sự chuyên dụng
  drawArmoredVehicle(ctx, x, y, w, h, color, strokeColor, label, isLeader = true) {
    const wheelR = 7;
    const chassisY = y + h - wheelR;

    ctx.save();
    // 1. Thân xe giáp vát nghiêng chống đạn (Sloped armor hull)
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x + 4, chassisY);
    ctx.lineTo(x, y + 18);
    ctx.lineTo(x + 8, y + 10);
    ctx.lineTo(x + 18, y + 8);
    // Tháp chỉ huy / ụ súng trên nóc xe bọc thép
    ctx.lineTo(x + 20, y + 2);
    ctx.lineTo(x + 36, y + 2);
    ctx.lineTo(x + 38, y + 8);
    ctx.lineTo(x + w - 12, y + 10);
    ctx.lineTo(x + w, y + 20); // Mũi vát nghiêng giảm chấn
    ctx.lineTo(x + w - 4, chassisY);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Nòng pháo / súng máy hoặc anten bọc thép
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x + 34, y + 5);
    ctx.lineTo(x + (isLeader ? 50 : 44), y + 5);
    ctx.stroke();

    // Khe kính quan sát chống đạn màu xanh dương
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(x + w - 16, y + 13, 8, 3);

    // Mối nối giáp thép tấm & đinh tán
    ctx.strokeStyle = 'rgba(0,0,0,0.25)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x + 14, y + 11);
    ctx.lineTo(x + 14, chassisY - 2);
    ctx.moveTo(x + 38, y + 10);
    ctx.lineTo(x + 38, chassisY - 2);
    ctx.stroke();

    // 2. Bánh xe bọc thép dã chiến (3 bánh lớn viền thép)
    [x + 12, x + 28, x + w - 14].forEach(wx => {
      ctx.fillStyle = '#18181b';
      ctx.beginPath();
      ctx.arc(wx, chassisY, wheelR, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#52525b';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = '#71717a';
      ctx.beginPath();
      ctx.arc(wx, chassisY, 2.5, 0, Math.PI * 2);
      ctx.fill();
    });

    // Nhãn khối lượng
    ctx.fillStyle = this.p.onShape;
    ctx.font = 'bold 9px monospace';
    ctx.fillText(label, x + 5, y + 24);
    ctx.restore();
  }

  // Case 5: Inelastic Collision (Va Chạm Xe Bọc Thép)
  renderCase5(ctx, engine) {
    const s = engine.state;
    const groundY = this.height - 60;

    // Track / Đường thử nghiệm quân sự
    ctx.fillStyle = this.p.ground;
    ctx.fillRect(0, groundY, this.width, 60);

    // Vạch kẻ bãi thử nghiệm
    ctx.strokeStyle = this.p.amber;
    ctx.lineWidth = 2;
    ctx.setLineDash([16, 12]);
    ctx.beginPath();
    ctx.moveTo(0, groundY + 30);
    ctx.lineTo(this.width, groundY + 30);
    ctx.stroke();
    ctx.setLineDash([]);

    // Xe bọc thép 1 (Đang lao tới với vận tốc v1 = 20m/s)
    const vW = 60, vH = 40;
    this.drawArmoredVehicle(ctx, s.x1, groundY - vH, vW, vH, this.p.teal, this.p.tealDeep, 'BỌC THÉP 1', true);

    // Xe bọc thép 2 (Bia thử nghiệm đứng yên)
    this.drawArmoredVehicle(ctx, s.x2, groundY - vH, vW, vH, this.p.green, this.p.greenDeep, 'BỌC THÉP 2', false);

    // Điểm va chạm móp méo / tia lửa biến dạng
    if (s.isAttached) {
      const contactX = (s.x1 + vW + s.x2) / 2;
      ctx.beginPath();
      ctx.arc(contactX, groundY - 20, 16, 0, Math.PI * 2);
      ctx.fillStyle = this.p.spark;
      ctx.fill();

      // Cảnh báo va chạm mềm dính chặt
      ctx.font = 'bold 11px "Inter", sans-serif';
      ctx.fillStyle = this.p.rose;
      ctx.fillText(`💥 VA CHẠM MỀM: DÍNH CHẶT (Vận tốc chung vf = ${s.vf.toFixed(1)}m/s)`, 180, groundY - 50);
    } else {
      this.drawArrow(ctx, s.x1 + vW / 2, groundY - vH - 10, s.v1 * 3, 0, this.p.teal, `v1=${s.v1.toFixed(1)}m/s`);
    }

    // Energy HUD Banner
    ctx.font = 'bold 12px "Inter", sans-serif';
    ctx.fillStyle = this.p.teal;
    ctx.fillText(`⚡ ĐỘNG NĂNG BAN ĐẦU: ${(s.energyBefore / 1000).toFixed(1)} kJ`, 40, 30);
    ctx.fillStyle = s.isAttached ? this.p.rose : this.p.gray;
    ctx.fillText(`🔥 NHIỆT NĂNG TỎA RA (HAO HỤT DẺO): ${(s.heatGenerated / 1000).toFixed(1)} kJ`, 40, 52);
  }

  // Case 6: Terminal Velocity & Parachute
  renderCase6(ctx, engine) {
    const s = engine.state;
    const skydiverX = this.width / 2;
    const skydiverY = this.height - s.y;

    // Cloud / Sky
    ctx.fillStyle = this.p.cloud;
    ctx.beginPath();
    ctx.arc(skydiverX - 80, 50, 40, 0, Math.PI * 2);
    ctx.arc(skydiverX + 80, 50, 50, 0, Math.PI * 2);
    ctx.fill();

    // Parachute canopy
    if (s.parachuteOpen) {
      ctx.beginPath();
      ctx.arc(skydiverX, skydiverY - 45, 45, Math.PI, 0);
      ctx.fillStyle = this.p.rose;
      ctx.fill();
      ctx.strokeStyle = this.p.roseDeep;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Lines
      ctx.beginPath();
      ctx.moveTo(skydiverX - 45, skydiverY - 45);
      ctx.lineTo(skydiverX, skydiverY);
      ctx.moveTo(skydiverX + 45, skydiverY - 45);
      ctx.lineTo(skydiverX, skydiverY);
      ctx.strokeStyle = this.p.gray;
      ctx.stroke();
    }

    // Diver body
    ctx.beginPath();
    ctx.arc(skydiverX, skydiverY, 14, 0, Math.PI * 2);
    ctx.fillStyle = this.p.teal;
    ctx.fill();

    // Vectors: Gravity down, Drag force up
    this.drawArrow(ctx, skydiverX, skydiverY, 0, 50, this.p.rose, `P=${(s.m * 9.8).toFixed(0)}N`);
    this.drawArrow(ctx, skydiverX, skydiverY, 0, -s.airResistForce / 15, this.p.green, `F_cản=${s.airResistForce.toFixed(0)}N`);

    // HUD
    ctx.font = '12px "Inter", sans-serif';
    ctx.fillStyle = this.p.text;
    ctx.fillText(`VẬN TỐC HIỆN TẠI: ${s.v.toFixed(1)} m/s`, 40, 30);
    ctx.fillStyle = this.p.green;
    ctx.fillText(`VẬN TỐC TỚI HẠN: ${s.terminalV.toFixed(1)} m/s`, 40, 50);
  }
}

window.VectorRenderer = VectorRenderer;
