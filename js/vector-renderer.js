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
    let fontSize = options.fontSize || 10;
    const paddingX = options.paddingX || 6;
    const paddingY = options.paddingY || 3;
    const dark = document.documentElement.getAttribute('data-theme') === 'dark';
    const bg = options.bg || (dark ? 'rgba(15, 23, 42, 0.92)' : 'rgba(255, 255, 255, 0.96)');
    const border = options.border || (dark ? 'rgba(255, 255, 255, 0.35)' : 'rgba(0, 0, 0, 0.25)');
    const color = options.color || (dark ? '#f8fafc' : '#0f172a');
    
    ctx.save();
    ctx.font = `bold ${fontSize}px "Inter", monospace`;
    let textW = ctx.measureText(text).width;
    let boxW = textW + paddingX * 2;

    // Tự động thu nhỏ cỡ chữ nếu nhãn dài hơn bề rộng khung cho phép
    const maxAllowedW = options.maxWidth || (this.width - 16);
    if (boxW > maxAllowedW && maxAllowedW > 50) {
      fontSize = Math.max(8, Math.round(fontSize * (maxAllowedW / boxW)));
      ctx.font = `bold ${fontSize}px "Inter", monospace`;
      textW = ctx.measureText(text).width;
      boxW = textW + paddingX * 2;
    }

    const boxH = fontSize + paddingY * 2;
    
    let boxX = x;
    let boxY = y;
    if (options.align === 'center') {
      boxX = x - boxW / 2;
    } else if (options.align === 'right') {
      boxX = x - boxW;
    }

    // Tự động neo trong khung canvas để không bao giờ bị cắt mất hoặc đè viền ngoài
    if (!options.noClamp) {
      boxX = Math.max(4, Math.min(this.width - boxW - 4, boxX));
      boxY = Math.max(4, Math.min(this.height - boxH - 4, boxY));
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

  drawArrow(ctx, fromX, fromY, dx, dy, color, label, options = {}) {
    if (!this.showVectors) return;
    const len = Math.hypot(dx, dy);
    if (len < 4) return;

    const toX = fromX + dx;
    const toY = fromY + dy;
    const headLen = Math.min(10, Math.max(6, len * 0.3));
    const angle = Math.atan2(dy, dx);

    ctx.save();
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = options.lineWidth || 2.2;

    // Thân mũi tên
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();

    // Mũi nhọn tam giác
    ctx.beginPath();
    ctx.moveTo(toX, toY);
    ctx.lineTo(toX - headLen * Math.cos(angle - Math.PI / 6), toY - headLen * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(toX - headLen * Math.cos(angle + Math.PI / 6), toY - headLen * Math.sin(angle + Math.PI / 6));
    ctx.closePath();
    ctx.fill();

    // Định vị nhãn thông minh tránh đè lên hướng và thân vectơ
    if (label) {
      let badgeX = toX;
      let badgeY = toY;
      let align = options.align || 'left';

      if (options.offsetX !== undefined && options.offsetY !== undefined) {
        badgeX = toX + options.offsetX;
        badgeY = toY + options.offsetY;
      } else if (options.side === 'left') {
        badgeX = toX - 8;
        badgeY = toY - 8;
        align = 'right';
      } else if (options.side === 'right') {
        badgeX = toX + 8;
        badgeY = toY - 8;
        align = 'left';
      } else if (options.side === 'above' || options.side === 'top') {
        badgeX = toX;
        badgeY = toY - 18;
        align = 'center';
      } else if (options.side === 'below' || options.side === 'bottom') {
        badgeX = toX;
        badgeY = toY + 6;
        align = 'center';
      } else {
        // Tự động căn vị trí nhãn theo góc nghiêng của vectơ
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        if (Math.abs(cos) >= Math.abs(sin)) {
          // Vectơ chủ yếu theo phương ngang
          if (cos > 0) {
            badgeX = toX + 8;
            badgeY = toY - 8;
            align = 'left';
          } else {
            badgeX = toX - 8;
            badgeY = toY - 8;
            align = 'right';
          }
        } else {
          // Vectơ chủ yếu theo phương dọc
          if (sin > 0) {
            badgeX = toX + 8;
            badgeY = toY - 4;
            align = 'left';
          } else {
            badgeX = toX;
            badgeY = toY - 18;
            align = 'center';
          }
        }
      }

      this.drawHighContrastBadge(ctx, label, badgeX, badgeY, {
        fontSize: options.fontSize || 9.5,
        color: color,
        align: align,
        paddingX: 5,
        paddingY: 2.5
      });
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
      label: engine.isVacuum ? '⚡ CHÂN KHÔNG (Fcản = 0)' : '💨 KHÔNG KHÍ (Có Fcản)',
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

    // Tháp Pisa co giãn kích thước theo chiều rộng màn hình
    const towerW = Math.min(75, Math.round(this.width * 0.16));
    const towerH = Math.min(200, this.height - 80);
    ctx.fillStyle = this.p.towerFill;
    ctx.fillRect(20, groundY - towerH, towerW, towerH);
    ctx.strokeStyle = this.p.towerStroke;
    ctx.strokeRect(20, groundY - towerH, towerW, towerH);
    this.drawHighContrastBadge(ctx, 'PISA (45m)', 22, groundY - towerH - 20, { fontSize: 9 });

    // Huy hiệu môi trường góc trên bên trái
    this.drawHighContrastBadge(ctx, envInfo.label, 20 + towerW + 14, 14, { fontSize: 9.5, color: envInfo.isVacuum ? this.p.green : this.p.amber });

    const rho = engine.isVacuum ? 0.0 : engine.airDensity;
    const drag1 = 0.5 * rho * s.cDrag1 * s.area1 * s.v1 * s.v1;
    const drag2 = 0.5 * rho * s.cDrag2 * s.area2 * s.v2 * s.v2;

    // Tọa độ vật rơi co giãn đáp ứng tỉ lệ theo khung hình
    const dropStart = 20 + towerW + 20;
    const dropZoneW = this.width - dropStart - 20;
    const b1X = Math.round(dropStart + dropZoneW * 0.32);
    const b2X = Math.round(dropStart + dropZoneW * 0.74);

    const b1Y = groundY - s.y1;
    const b2Y = groundY - s.y2;

    // Body 1: Quả tạ chì 5kg (số kg đặt trực tiếp trong hình tròn)
    ctx.beginPath();
    ctx.arc(b1X, b1Y, 18, 0, Math.PI * 2);
    ctx.fillStyle = this.p.gray;
    ctx.fill();
    ctx.strokeStyle = this.p.teal;
    ctx.lineWidth = 2.5;
    ctx.stroke();
    ctx.save();
    ctx.font = 'bold 9.5px "Inter", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    ctx.shadowBlur = 3;
    ctx.fillText(`${s.m1}kg`, b1X, b1Y);
    ctx.restore();

    // Body 2: Lông vũ / Quả bóng nhẹ 0.5kg (số kg đặt trực tiếp trong hình tròn)
    ctx.beginPath();
    ctx.arc(b2X, b2Y, 16, 0, Math.PI * 2);
    ctx.fillStyle = this.p.amber;
    ctx.fill();
    ctx.strokeStyle = this.p.amberDeep;
    ctx.lineWidth = 2.5;
    ctx.stroke();
    ctx.save();
    ctx.font = 'bold 9px "Inter", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#0f172a';
    ctx.fillText(`${s.m2}kg`, b2X, b2Y);
    ctx.restore();

    // Tách riêng: Bên trái vật là Lực (P & Fcản), bên phải là Vận tốc (v), không bao giờ đè nhãn vật
    const maxP1Len = Math.max(14, Math.min(38, (this.height - 10) - (b1Y + 8)));
    this.drawArrow(ctx, b1X - 10, b1Y + 8, 0, maxP1Len, this.p.rose, `P1 = ${(s.m1 * engine.g).toFixed(0)}N`, { side: 'left' });
    if (drag1 > 0.05) {
      this.drawArrow(ctx, b1X - 10, b1Y - 8, 0, -Math.min(32, drag1 * 2), this.p.green, `Fc1 = ${drag1.toFixed(1)}N`, { side: 'left' });
    }
    if (s.y1 > s.groundY && s.v1 > 0.1) {
      this.drawArrow(ctx, b1X + 12, b1Y + 6, 0, Math.min(40, s.v1 * 1.8), this.p.teal, `v1 = ${s.v1.toFixed(1)}m/s`, { side: 'right' });
    }

    const maxP2Len = Math.max(14, Math.min(32, (this.height - 10) - (b2Y + 6)));
    this.drawArrow(ctx, b2X - 10, b2Y + 6, 0, maxP2Len, this.p.rose, `P2 = ${(s.m2 * engine.g).toFixed(1)}N`, { side: 'left' });
    if (drag2 > 0.05) {
      this.drawArrow(ctx, b2X - 10, b2Y - 6, 0, -Math.min(32, drag2 * 3.5), this.p.green, `Fc2 = ${drag2.toFixed(1)}N`, { side: 'left' });
    }
    if (s.y2 > s.groundY && s.v2 > 0.1) {
      this.drawArrow(ctx, b2X + 12, b2Y + 6, 0, Math.min(40, s.v2 * 1.8), this.p.teal, `v2 = ${s.v2.toFixed(1)}m/s`, { side: 'right' });
    }
  }

  // Helper: Vẽ xe tải chi tiết (Hỗ trợ nhãn 2 tầng tránh đè xe con)
  drawTruck(ctx, x, y, w, h, color, strokeColor, label, badgeElevated = false) {
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

    const badgeY = badgeElevated ? (y - 34) : (y - 18);
    this.drawHighContrastBadge(ctx, label, x + 4, badgeY, { color: strokeColor, fontSize: 9 });
    ctx.restore();
  }

  // Helper: Vẽ xe con chi tiết (Nhãn tầng dưới)
  drawCar(ctx, x, y, w, h, color, strokeColor, label, badgeElevated = false) {
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

    const badgeY = badgeElevated ? (y - 34) : (y - 18);
    this.drawHighContrastBadge(ctx, label, x + 2, badgeY, { color: strokeColor, fontSize: 9 });
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
    // Nhãn xe tải đặt ở tầng cao (y - 34)
    this.drawTruck(ctx, tX, tY, tW, tH, this.p.teal, this.p.tealDeep, `XE TẢI ${s.m1}kg`, true);

    const cW = 55, cH = 32;
    const cX = s.x2;
    const cY = groundY - cH;
    // Nhãn xe con đặt ở tầng thấp (y - 18) => Tuyệt đối không đè nhau khi va chạm sát nhau
    this.drawCar(ctx, cX, cY, cW, cH, this.p.rose, this.p.roseDeep, `XE CON ${s.m2}kg`, false);

    if (s.contactForce > 0) {
      const contactX = (tX + tW + cX) / 2;
      ctx.beginPath();
      ctx.arc(contactX, groundY - 24, 18, 0, Math.PI * 2);
      ctx.fillStyle = this.p.spark;
      ctx.fill();

      // Cặp lực trực đối Newton III: tách 2 tầng và nhãn đẩy hẳn ra ngoài
      const fLen = Math.min(52, s.contactForce / 750);
      this.drawArrow(ctx, contactX - 2, groundY - 32, -fLen, 0, this.p.green, `Fc→t = ${(s.contactForce / 1000).toFixed(1)}kN`, { side: 'left' });
      this.drawArrow(ctx, contactX + 2, groundY - 14, fLen, 0, this.p.rose, `Ft→c = ${(s.contactForce / 1000).toFixed(1)}kN`, { side: 'right' });

      this.drawHighContrastBadge(ctx, '⚖ ĐỊNH LUẬT III NEWTON: Cặp lực trực đối cùng độ lớn, ngược chiều!', 16, 14, {
        fontSize: 9.5,
        color: this.p.amber
      });
    } else {
      // Giới hạn chiều dài mũi tên v1 để không đâm xuyên vào xe con khi đến gần
      const maxV1Len = Math.max(8, Math.min(38, (cX - (tX + tW)) - 6));
      if (maxV1Len > 10) {
        this.drawArrow(ctx, tX + tW, tY + tH / 2 - 4, maxV1Len, 0, this.p.teal, `v1 = ${s.v1.toFixed(1)}m/s`, { side: 'right' });
      }
      this.drawArrow(ctx, cX + cW, cY + cH / 2 - 4, Math.min(36, Math.max(12, s.v2 * 3)), 0, this.p.teal, `v2 = ${s.v2.toFixed(1)}m/s`, { side: 'right' });
    }
  }

  // Case 3: Sợi dây quay tròn & Cắt dây quán tính (Tether rotation & cut string)
  renderCase3(ctx, engine) {
    const s = engine.state;
    const cx = this.width / 2;
    const cy = this.height / 2 + 10;
    const r = Math.min(s.radius || 75, Math.round(this.height * 0.28));

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
    // Nhãn TÂM O đặt phía trên đầu người, hoàn toàn không va vào quỹ đạo phía dưới
    this.drawHighContrastBadge(ctx, 'TÂM O (Người quay)', cx, cy - 32, { fontSize: 9, align: 'center' });
    ctx.restore();

    // Vị trí quả cầu
    const ballPxX = cx + s.ballX;
    const ballPxY = cy + s.ballY;
    const dxFromCenter = ballPxX - cx;
    const dyFromCenter = ballPxY - cy;
    const distCenter = Math.hypot(dxFromCenter, dyFromCenter) || 1;
    const rCos = dxFromCenter / distCenter;
    const rSin = dyFromCenter / distCenter;

    // Sợi dây nối (nếu chưa cắt)
    if (!s.isStringCut) {
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(ballPxX, ballPxY);
      ctx.strokeStyle = this.p.tether;
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Vectơ lực hướng tâm Fht từ quả cầu hướng vào tâm
      const tLen = Math.min(40, r * 0.55);
      const perpX = -rSin * 10;
      const perpY = rCos * 10;
      this.drawArrow(ctx, ballPxX, ballPxY, -rCos * tLen, -rSin * tLen, this.p.rose, 'Fht (Lực căng T)', {
        offsetX: -rCos * (tLen * 0.4) + perpX,
        offsetY: -rSin * (tLen * 0.4) + perpY - 6,
        align: perpX < 0 ? 'right' : 'left'
      });

      // Vectơ vận tốc tức thời v tiếp tuyến đường tròn
      const vLen = 38;
      const vx = -rSin * vLen;
      const vy = rCos * vLen;
      this.drawArrow(ctx, ballPxX, ballPxY, vx, vy, this.p.green, 'v (tiếp tuyến)', {
        offsetX: vx * 0.75,
        offsetY: vy * 0.75 - 6,
        align: vx < 0 ? 'right' : 'left'
      });
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
      this.drawArrow(ctx, ballPxX, ballPxY, s.tangentVx * 2.2, s.tangentVy * 2.2, this.p.green, 'v (quán tính tiếp tuyến)');

      this.drawHighContrastBadge(ctx, '✂ ĐÃ CẮT DÂY (T = 0): Vật bay theo tiếp tuyến (Định luật I Newton)!', 16, 14, {
        fontSize: 9.5,
        color: this.p.green
      });
    }

    // Quả cầu kim loại tròn (số kg đặt trực tiếp trong hình tròn)
    ctx.beginPath();
    ctx.arc(ballPxX, ballPxY, 16, 0, Math.PI * 2);
    ctx.fillStyle = this.p.rose;
    ctx.fill();
    ctx.strokeStyle = this.p.carOutline;
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.save();
    ctx.font = 'bold 9.5px "Inter", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    ctx.shadowBlur = 3;
    ctx.fillText(`${s.m}kg`, ballPxX, ballPxY);
    ctx.restore();
  }

  // Case 4: Xe trượt dốc nghiêng & Phân tích lực
  renderCase4(ctx, engine) {
    const s = engine.state;
    const rad = (s.slopeAngleDeg * Math.PI) / 180;
    const startX = 40;
    const groundY = this.height - 40;
    const rampLen = Math.min(380, Math.round(this.width * 0.58));

    const endX = startX + rampLen * Math.cos(rad);
    const endY = groundY - rampLen * Math.sin(rad);

    // 1. Mặt đường nằm ngang
    ctx.beginPath();
    ctx.moveTo(startX, groundY);
    ctx.lineTo(this.width, groundY);
    ctx.strokeStyle = this.p.ground;
    ctx.lineWidth = 3;
    ctx.stroke();

    // 2. Con dốc hình tam giác
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
    this.drawHighContrastBadge(ctx, `α = ${s.slopeAngleDeg}°`, startX + 26, groundY - 20, { fontSize: 9.5, color: this.p.amber });

    // 3. Vị trí & góc nghiêng của xe
    let carX, carY, carAngle;
    if (!s.onGround) {
      const d = s.dist;
      carX = startX + d * Math.cos(rad);
      carY = endY + d * Math.sin(rad);
      carAngle = rad;
    } else {
      carX = endX + (s.groundDist || 0);
      carY = groundY;
      carAngle = 0;
    }

    // Vẽ hình dáng xe trong hệ tọa độ xoay theo góc dốc
    ctx.save();
    ctx.translate(carX, carY);
    ctx.rotate(carAngle);

    // Thân xe (số kg đặt trực tiếp trong thân xe)
    ctx.fillStyle = this.p.teal;
    ctx.fillRect(-22, -26, 44, 24);
    ctx.strokeStyle = this.p.tealDeep;
    ctx.lineWidth = 2;
    ctx.strokeRect(-22, -26, 44, 24);
    ctx.save();
    ctx.font = 'bold 9px "Inter", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`${s.m}kg`, 0, -14);
    ctx.restore();

    // Bánh xe
    ctx.fillStyle = '#18181b';
    ctx.beginPath();
    ctx.arc(-14, 0, 5, 0, Math.PI * 2);
    ctx.arc(14, 0, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 4. Vẽ các vector lực hoàn toàn trong hệ toạ độ thế giới (world coordinates)
    // Giúp các nhãn đo phẳng ngang, không bị biến dạng xoay và không bị auto-clamp đè lên nhau
    const cosA = Math.cos(carAngle);
    const sinA = Math.sin(carAngle);

    // Trọng tâm G của xe
    const Gx = carX + 14 * sinA;
    const Gy = carY - 14 * cosA;

    // Nóc xe & Đuôi / Đầu xe
    const roofX = carX + 26 * sinA;
    const roofY = carY - 26 * cosA;
    const frontX = Gx + 22 * cosA;
    const frontY = Gy + 22 * sinA;
    const rearX = Gx - 22 * cosA;
    const rearY = Gy - 22 * sinA;

    // Vectơ 1: Áp lực pháp tuyến N (vuông góc mặt nghiêng hướng lên)
    const nLen = Math.min(45, Math.max(16, s.normalForce / 280));
    this.drawArrow(ctx, roofX, roofY, nLen * sinA, -nLen * cosA, this.p.green, `N = ${(s.normalForce).toFixed(0)}N`, { side: 'above' });

    // Vectơ 2: Trọng lực P (thẳng đứng hướng xuống)
    const pVal = s.m * engine.g;
    const maxPLen = Math.max(16, Math.min(45, (this.height - 10) - Gy));
    this.drawArrow(ctx, Gx, Gy, 0, maxPLen, this.p.purple, `P = ${(pVal).toFixed(0)}N`, { side: 'left' });

    // Vectơ 3: Thành phần Px kéo xe trượt xuống dọc dốc (hướng xuống theo chiều dốc)
    if (!s.onGround) {
      const fDown = s.m * engine.g * Math.sin(rad);
      const pxLen = Math.min(48, Math.max(18, fDown / 280));
      this.drawArrow(ctx, frontX, frontY, pxLen * cosA, pxLen * sinA, this.p.amber, `Px = ${(fDown).toFixed(0)}N`, { side: 'right' });
    }

    // Vectơ 4: Lực ma sát trượt Fms (hướng ngược chiều chuyển động dọc theo dốc / mặt đường)
    const fmsLen = Math.min(42, Math.max(16, s.frictionForce / 95));
    if ((!s.onGround || s.v > 0.05) && fmsLen > 4) {
      this.drawArrow(ctx, rearX, rearY, -fmsLen * cosA, -fmsLen * sinA, this.p.rose, `Fms = ${(s.frictionForce).toFixed(0)}N`, { side: 'left' });
    }

    // Thông tin động lực học gọn góc trên bên trái
    const statusText = !s.onGround 
      ? `Trượt dốc: a = ${s.accel.toFixed(2)} m/s² | v = ${s.v.toFixed(1)} m/s`
      : (s.v > 0.05 
          ? `Hãm phanh ma sát: a = ${s.accel.toFixed(2)} m/s² | v = ${s.v.toFixed(1)} m/s`
          : `✓ Xe đã dừng hẳn do lực ma sát cản trở!`);
    this.drawHighContrastBadge(ctx, statusText, 16, 14, {
      fontSize: 9.5,
      color: s.onGround && s.v <= 0.05 ? this.p.amber : this.p.green
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

    // Leader (Xe 1) nhãn đặt ở tầng cao (y - 34), Xe 2 nhãn tầng thấp (y - 18) => Không bao giờ đè nhau khi va chạm
    const badgeY = isLeader ? (y - 34) : (y - 18);
    this.drawHighContrastBadge(ctx, label, x + 2, badgeY, { color: strokeColor, fontSize: 9 });
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
    this.drawArmoredVehicle(ctx, s.x1, groundY - vH, vW, vH, this.p.teal, this.p.tealDeep, `BỌC THÉP 1 (${s.m1}kg)`, true);
    this.drawArmoredVehicle(ctx, s.x2, groundY - vH, vW, vH, this.p.green, this.p.greenDeep, `BỌC THÉP 2 (${s.m2}kg)`, false);

    if (s.isAttached) {
      const contactX = (s.x1 + vW + s.x2) / 2;
      ctx.beginPath();
      ctx.arc(contactX, groundY - 20, 16, 0, Math.PI * 2);
      ctx.fillStyle = this.p.spark;
      ctx.fill();

      // Vectơ vận tốc chung sau va chạm mềm vf
      if (s.vf > 0.05) {
        this.drawArrow(ctx, s.x2 + vW, groundY - vH / 2, Math.max(16, s.vf * 3), 0, this.p.green, `vf = ${s.vf.toFixed(1)}m/s`, { side: 'right' });
      }

      // Đặt thông báo va chạm mềm ở hàng trên cùng chính giữa để không đè lên xe
      this.drawHighContrastBadge(ctx, `💥 VA CHẠM MỀM: DÍNH CHẶT (vf = ${s.vf.toFixed(1)} m/s)`, this.width / 2, 14, {
        align: 'center',
        color: this.p.rose,
        fontSize: 9.5
      });
    } else {
      // Giới hạn chiều dài mũi tên v1 để không đâm xuyên vào xe 2 trước va chạm
      const maxV1Len = Math.max(8, Math.min(36, (s.x2 - (s.x1 + vW)) - 6));
      if (maxV1Len > 10) {
        this.drawArrow(ctx, s.x1 + vW, groundY - vH / 2, maxV1Len, 0, this.p.teal, `v1 = ${s.v1.toFixed(1)}m/s`, { side: 'right' });
      }
      this.drawHighContrastBadge(ctx, 'v2 = 0', s.x2 + vW + 6, groundY - vH / 2 - 8, { color: this.p.green, fontSize: 8.5 });
    }

    // Năng lượng đặt cố định góc trên bên trái, xếp tầng chuẩn mực
    this.drawHighContrastBadge(ctx, `⚡ ĐỘNG NĂNG: ${(s.energyBefore / 1000).toFixed(1)} kJ`, 16, 14, { color: this.p.teal, fontSize: 9.5 });
    this.drawHighContrastBadge(ctx, `🔥 NHIỆT NĂNG: ${(s.heatGenerated / 1000).toFixed(1)} kJ`, 16, 38, { color: s.isAttached ? this.p.rose : this.p.gray, fontSize: 9.5 });
  }

  // Case 6: Người nhảy dù & Vận tốc tới hạn trong các môi trường thiên thể
  renderCase6(ctx, engine) {
    const s = engine.state;
    const groundY = this.height - 40;
    // Dời nhẹ hành lang rơi sang phải để nhường trọn nửa trái cho thông số HUD
    const skydiverX = Math.round(this.width * 0.58);
    const skydiverY = groundY - s.y;

    const envKey = engine.currentEnv || 'earth_air';
    const envInfo = (engine.environments && engine.environments[envKey]) || {
      name: 'Trái Đất',
      label: '🌍 TRÁI ĐẤT (g = 9.8 m/s²)',
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

    // Khung nhãn thông số bên trái: giới hạn chiều rộng tối đa để không bao giờ cắt qua hành lang rơi
    const maxLeftW = Math.max(120, skydiverX - 70);
    this.drawHighContrastBadge(ctx, envInfo.label, 14, 14, { fontSize: 9.5, color: this.p.teal, maxWidth: maxLeftW });

    const pVal = s.m * engine.g;
    const isTerminal = Math.abs(s.airResistForce - pVal) < 15 && s.v > 2;

    if (isTerminal) {
      this.drawHighContrastBadge(ctx, `⚖️ CÂN BẰNG ĐỘNG (Fcản = P): v = ${s.v.toFixed(1)} m/s`, 14, 38, {
        fontSize: 9.5,
        color: this.p.green,
        maxWidth: maxLeftW
      });
      this.drawHighContrastBadge(ctx, `Định luật I Newton: Tổng lực = 0 => Rơi đều`, 14, 62, {
        fontSize: 8.5,
        color: this.p.amber,
        maxWidth: maxLeftW
      });
    } else {
      this.drawHighContrastBadge(ctx, `v = ${s.v.toFixed(1)} m/s | vtới hạn = ${isFinite(s.terminalV) ? s.terminalV.toFixed(1) + ' m/s' : '∞ (chân không)'}`, 14, 38, {
        fontSize: 9.5,
        color: this.p.teal,
        maxWidth: maxLeftW
      });
    }

    // Dù cứu sinh khi bung
    if (s.parachuteOpen) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(skydiverX, skydiverY - 60, 48, Math.PI, 0);
      ctx.fillStyle = this.p.rose;
      ctx.fill();
      ctx.strokeStyle = this.p.roseDeep;
      ctx.lineWidth = 2.5;
      ctx.stroke();

      ctx.strokeStyle = this.p.gray;
      ctx.lineWidth = 1.2;
      [-42, -21, 0, 21, 42].forEach(dx => {
        ctx.beginPath();
        ctx.moveTo(skydiverX + dx, skydiverY - 60);
        ctx.lineTo(skydiverX, skydiverY - 14);
        ctx.stroke();
      });
      this.drawHighContrastBadge(ctx, 'DÙ A=42m²', skydiverX + 32, skydiverY - 74, { color: this.p.rose, fontSize: 8.5, align: 'left' });
      ctx.restore();
    }

    // Người nhảy dù (Skydiver)
    ctx.save();
    ctx.fillStyle = this.p.amber;
    ctx.beginPath();
    ctx.arc(skydiverX, skydiverY - 18, 7, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = this.p.teal;
    ctx.fillRect(skydiverX - 6, skydiverY - 11, 12, 16);

    ctx.strokeStyle = this.p.tealDeep;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(skydiverX - 16, skydiverY - 8);
    ctx.lineTo(skydiverX - 6, skydiverY - 6);
    ctx.moveTo(skydiverX + 6, skydiverY - 6);
    ctx.lineTo(skydiverX + 16, skydiverY - 8);
    ctx.moveTo(skydiverX - 4, skydiverY + 5);
    ctx.lineTo(skydiverX - 10, skydiverY + 16);
    ctx.moveTo(skydiverX + 4, skydiverY + 5);
    ctx.lineTo(skydiverX + 10, skydiverY + 16);
    ctx.stroke();

    this.drawHighContrastBadge(ctx, `${s.m}kg`, skydiverX + 16, skydiverY - 10, { fontSize: 9, align: 'left' });
    ctx.restore();

    // 1. Vectơ Lực cản không khí Fcản hướng lên (ở bên trái)
    if (s.airResistForce > 0.5) {
      const topOriginY = s.parachuteOpen ? (skydiverY - 62) : (skydiverY - 22);
      const dragLen = Math.min(48, s.airResistForce / 20);
      this.drawArrow(ctx, skydiverX - 8, topOriginY, 0, -dragLen, this.p.green, `Fcản = ${s.airResistForce.toFixed(0)}N`, { side: 'left' });
    }

    // 2. Vectơ Trọng lực P hướng xuống (ở bên trái)
    const pLen = Math.min(48, pVal / 20);
    this.drawArrow(ctx, skydiverX - 8, skydiverY + 18, 0, pLen, this.p.rose, `P = ${pVal.toFixed(0)}N`, { side: 'left' });

    // 3. Vectơ Vận tốc rơi v hướng xuống (ở bên phải)
    if (s.v > 0.2) {
      const vLen = Math.min(45, s.v * 1.3);
      this.drawArrow(ctx, skydiverX + 20, skydiverY + 4, 0, vLen, this.p.teal, `v = ${s.v.toFixed(1)}m/s`, { side: 'right' });
    }
  }
}

window.VectorRenderer = VectorRenderer;
