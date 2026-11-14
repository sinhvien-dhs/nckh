/* ==========================================================================
   PHYSICS DETECTIVE - Physics Engine (HTML5 Canvas 60 FPS)
   Numerical Simulation conforming to Grade 10 Physics (GDPT 2018)
   Includes Multi-Celestial Gravitational & Atmospheric Environments
   ========================================================================== */

const CELESTIAL_ENVIRONMENTS = {
  earth_air: {
    id: 'earth_air',
    name: 'Trái Đất (Khí quyển tiêu chuẩn)',
    icon: '🌍',
    g: 9.8,
    airDensity: 1.225,
    isVacuum: false,
    sky: null,
    ground: null,
    groundLine: null,
    label: '🌍 MÔI TRƯỜNG: TRÁI ĐẤT - KHÍ QUYỂN (g = 9.8 m/s², Fcản > 0)'
  },
  earth_vacuum: {
    id: 'earth_vacuum',
    name: 'Trái Đất (Chân không)',
    icon: '⚡',
    g: 9.8,
    airDensity: 0.0,
    isVacuum: true,
    sky: null,
    ground: null,
    groundLine: null,
    label: '⚡ MÔI TRƯỜNG: TRÁI ĐẤT - CHÂN KHÔNG (g = 9.8 m/s², Fcản = 0)'
  },
  mars: {
    id: 'mars',
    name: 'Sao Hỏa (Mars)',
    icon: '🪐',
    g: 3.72,
    airDensity: 0.02,
    isVacuum: false,
    sky: 'rgba(219, 90, 43, 0.16)',
    ground: '#9a3412',
    groundLine: '#ea580c',
    label: '🪐 MÔI TRƯỜNG: SAO HỎA (g = 3.72 m/s², Khí quyển CO₂ mỏng)'
  },
  moon: {
    id: 'moon',
    name: 'Mặt Trăng (Moon)',
    icon: '🌕',
    g: 1.62,
    airDensity: 0.0,
    isVacuum: true,
    sky: 'rgba(15, 23, 42, 0.35)',
    ground: '#475569',
    groundLine: '#94a3b8',
    label: '🌕 MÔI TRƯỜNG: MẶT TRĂNG (g = 1.62 m/s², Chân không tuyệt đối)'
  },
  venus: {
    id: 'venus',
    name: 'Sao Kim (Venus)',
    icon: '🌋',
    g: 8.87,
    airDensity: 65.0,
    isVacuum: false,
    sky: 'rgba(234, 179, 8, 0.25)',
    ground: '#854d0e',
    groundLine: '#eab308',
    label: '🌋 MÔI TRƯỜNG: SAO KIM (g = 8.87 m/s², Khí quyển CO₂ siêu đặc)'
  },
  jupiter: {
    id: 'jupiter',
    name: 'Sao Mộc (Jupiter)',
    icon: '⚡',
    g: 24.79,
    airDensity: 1.33,
    isVacuum: false,
    sky: 'rgba(180, 83, 9, 0.22)',
    ground: '#78350f',
    groundLine: '#d97706',
    label: '⚡ MÔI TRƯỜNG: SAO MỘC (g = 24.79 m/s², Siêu trọng lực hành tinh khí)'
  },
  pluto: {
    id: 'pluto',
    name: 'Sao Diêm Vương (Pluto)',
    icon: '❄️',
    g: 0.62,
    airDensity: 0.0,
    isVacuum: true,
    sky: 'rgba(30, 58, 138, 0.22)',
    ground: '#334155',
    groundLine: '#38bdf8',
    label: '❄️ MÔI TRƯỜNG: SAO DIÊM VƯƠNG (g = 0.62 m/s², Trọng lực yếu băng giá)'
  },
  sun: {
    id: 'sun',
    name: 'Mặt Trời (Sun)',
    icon: '☀️',
    g: 274.0,
    airDensity: 0.0,
    isVacuum: true,
    sky: 'rgba(234, 88, 12, 0.28)',
    ground: '#b45309',
    groundLine: '#f59e0b',
    label: '☀️ MÔI TRƯỜNG: MẶT TRỜI (g = 274 m/s², Siêu trọng lực cực đại)'
  }
};

window.CELESTIAL_ENVIRONMENTS = CELESTIAL_ENVIRONMENTS;
window.CASE1_ENVIRONMENTS = CELESTIAL_ENVIRONMENTS;

class PhysicsEngine {
  constructor() {
    this.currentCase = 'case1'; // case1 to case6
    this.isRunning = false;
    this.simSpeed = 1.0;
    this.simTime = 0.0;
    this.timeStep = 1 / 60;

    // Environmental Parameters
    this.environments = CELESTIAL_ENVIRONMENTS;
    this.currentEnv = 'earth_air';
    this.g = 9.8;
    this.isVacuum = false;
    this.airDensity = 1.225;

    // Sensors state
    this.sensors = {
      time: 0.0,
      v1: 0.0,
      v2: 0.0,
      a1: 0.0,
      a2: 0.0,
      f1: 0.0,
      f2: 0.0,
      eKineticTotal: 0.0,
      eLoss: 0.0
    };

    // Case specific objects
    this.state = {};
    this.history = []; // for kinematics chart
    this.initCaseState(this.currentCase);
  }

  initCaseState(caseId) {
    this.currentCase = caseId;
    this.simTime = 0.0;
    this.isRunning = false;
    this.history = [];

    // Áp dụng môi trường thiên thể cho Vụ án 1 và Vụ án 6
    if (caseId === 'case1' || caseId === 'case6') {
      const env = this.environments[this.currentEnv] || this.environments.earth_air;
      this.g = env.g;
      this.airDensity = env.airDensity;
      this.isVacuum = env.isVacuum;
    } else {
      this.g = 9.8;
      this.airDensity = 1.225;
      this.isVacuum = false;
    }

    switch (caseId) {
      case 'case1': // Freefall (Pisa Mystery)
        this.state = {
          m1: (this.case1CustomM1 !== undefined) ? this.case1CustomM1 : 5.0,        // Quả tạ chì (kg)
          m2: (this.case1CustomM2 !== undefined) ? this.case1CustomM2 : 0.5,        // Quả cầu gỗ nhẹ / lông vũ (kg)
          y1: 210,        // Chiều cao ban đầu (px) - đặt ở mức 210 để không bị che bởi thanh điều kiện
          y2: 210,
          v1: 0.0,
          v2: 0.0,
          t1: null,
          t2: null,
          heightMeters: 45.0,
          groundY: 40,
          cDrag1: 0.47,
          cDrag2: 1.2,
          area1: 0.03,
          area2: 0.08
        };
        break;

      case 'case2': // Newton III Collision (Truck vs Car)
        this.state = {
          m1: 5000,       // Xe tải (kg)
          m2: 1000,       // Xe con (kg)
          x1: 80,
          x2: 450,
          v1: 15.0,       // m/s
          v2: 0.0,
          colliding: false,
          collisionTime: 0.0,
          contactForce: 0.0,
          maxForce: 0.0
        };
        break;

      case 'case3': // Sợi dây quay tròn & Cắt dây quán tính (Tether rotation & cut string)
        this.state = {
          m: 0.5,         // Khối lượng quả cầu (kg)
          radius: 75,     // Bán kính sợi dây (px)
          speed: 15.0,    // Vận tốc dài (m/s)
          angle: 0.0,     // Góc quay hiện tại (rad)
          isStringCut: false, // Trạng thái cắt dây
          cutAngle: 0.0,  // Góc tại thời điểm cắt
          tangentVx: 0.0, // Vận tốc tiếp tuyến x
          tangentVy: 0.0, // Vận tốc tiếp tuyến y
          ballX: 0.0,     // Tọa độ tương đối so với tâm
          ballY: 0.0,
          trail: []       // Quỹ đạo bay sau khi cắt dây
        };
        break;

      case 'case4': // Incline Plane & Friction vs Slope Angle
        this.state = {
          m: 1200.0,      // Xe trượt (kg)
          slopeAngleDeg: 30, // Góc dốc (độ)
          mu: 0.35,       // Hệ số ma sát trượt
          dist: 0.0,      // Quãng đường trượt dọc dốc (px)
          groundDist: 0.0, // Quãng đường trượt trên đường ngang (px)
          v: 0.0,
          normalForce: 0.0,
          frictionForce: 0.0,
          accel: 0.0,
          onGround: false
        };
        break;

      case 'case5': // Inelastic Collision (Armored Car vs Barrier)
        this.state = {
          m1: 2000,
          m2: 2000,
          x1: 80,
          x2: 380,
          v1: 20.0,
          v2: 0.0,
          isAttached: false,
          vf: 0.0,
          energyBefore: 0.0,
          energyAfter: 0.0,
          heatGenerated: 0.0
        };
        break;

      case 'case6': // Air Resistance & Terminal Velocity (Parachute)
        this.state = {
          m: 80.0,        // Khối lượng người nhảy dù (kg)
          y: 280,         // Vị trí độ cao ban đầu
          v: 0.0,         // Vận tốc rơi (m/s)
          parachuteOpen: false, // Trạng thái bung dù
          area: 0.7,      // Diện tích cản cơ thể (m²)
          areaChute: 42.0,// Diện tích tán dù lớn (m²)
          cDrag: 0.9,     // Hệ số cản khí
          terminalV: 0.0, // Vận tốc tới hạn tính toán
          airResistForce: 0.0 // Lực cản không khí tức thời (N)
        };
        break;
    }

    this.updateSensors();
  }

  step() {
    if (!this.isRunning) return;

    const dt = this.timeStep * this.simSpeed;
    this.simTime += dt;

    switch (this.currentCase) {
      case 'case1':
        this.stepCase1(dt);
        break;
      case 'case2':
        this.stepCase2(dt);
        break;
      case 'case3':
        this.stepCase3(dt);
        break;
      case 'case4':
        this.stepCase4(dt);
        break;
      case 'case5':
        this.stepCase5(dt);
        break;
      case 'case6':
        this.stepCase6(dt);
        break;
    }

    this.updateSensors();
    this.recordHistory();
  }

  stepCase1(dt) {
    const s = this.state;
    const rho = this.isVacuum ? 0.0 : this.airDensity;

    // Body 1: Lead Ball
    if (s.y1 > s.groundY) {
      const fDrag1 = 0.5 * rho * s.cDrag1 * s.area1 * s.v1 * s.v1;
      const fNet1 = s.m1 * this.g - fDrag1;
      const a1 = fNet1 / s.m1;
      s.v1 += a1 * dt;
      s.y1 -= s.v1 * dt * 4.5; // pixel scaling
      if (s.y1 <= s.groundY) {
        s.y1 = s.groundY;
        s.t1 = this.simTime;
      }
    }

    // Body 2: Light Ball / Feather
    if (s.y2 > s.groundY) {
      const fDrag2 = 0.5 * rho * s.cDrag2 * s.area2 * s.v2 * s.v2;
      const fNet2 = s.m2 * this.g - fDrag2;
      const a2 = fNet2 / s.m2;
      s.v2 += a2 * dt;
      s.y2 -= s.v2 * dt * 4.5;
      if (s.y2 <= s.groundY) {
        s.y2 = s.groundY;
        s.t2 = this.simTime;
      }
    }

    if (s.y1 <= s.groundY && s.y2 <= s.groundY) {
      this.isRunning = false;
    }
  }

  stepCase2(dt) {
    const s = this.state;
    const collisionWidth = 80;

    if (!s.colliding) {
      s.x1 += s.v1 * dt * 10;
      if (s.x1 + collisionWidth >= s.x2) {
        s.colliding = true;
        s.collisionTime = 0.0;
      }
    } else {
      s.collisionTime += dt;
      const maxT = 0.15; // 150 ms contact
      if (s.collisionTime <= maxT) {
        const pulse = Math.sin((s.collisionTime / maxT) * Math.PI);
        s.contactForce = 45000 * pulse; // 45 kN peak
        if (s.contactForce > s.maxForce) s.maxForce = s.contactForce;
      } else {
        s.contactForce = 0;
        const vCommon = (s.m1 * 15.0) / (s.m1 + s.m2);
        s.v1 = vCommon * 0.8;
        s.v2 = vCommon * 1.6;
        s.x1 += s.v1 * dt * 8;
        s.x2 += s.v2 * dt * 8;
      }
    }

    if (s.x2 > 650) this.isRunning = false;
  }

  stepCase3(dt) {
    const s = this.state;
    if (!s.isStringCut) {
      // Quay tròn đều với tốc độ dài speed = 15 m/s
      const omega = s.speed / (s.radius / 10);
      s.angle += omega * dt;
      s.ballX = Math.cos(s.angle) * s.radius;
      s.ballY = Math.sin(s.angle) * s.radius;
    } else {
      // Quán tính Định luật I Newton: Bay thẳng đều theo tiếp tuyến!
      s.ballX += s.tangentVx * dt * 8;
      s.ballY += s.tangentVy * dt * 8;

      if (!s.trail) s.trail = [];
      if (s.trail.length < 50) {
        s.trail.push({ x: s.ballX, y: s.ballY });
      }
    }

    if (Math.abs(s.ballX) > 280 || Math.abs(s.ballY) > 280) {
      this.isRunning = false;
    }
  }

  cutTractionString() {
    const s = this.state;
    if (this.currentCase === 'case3' && !s.isStringCut) {
      s.isStringCut = true;
      s.cutAngle = s.angle;
      // Vận tốc tiếp tuyến: v_x = -v * sin(theta), v_y = v * cos(theta)
      s.tangentVx = -s.speed * Math.sin(s.angle);
      s.tangentVy = s.speed * Math.cos(s.angle);
      s.trail = [{ x: s.ballX, y: s.ballY }];
    }
  }

  stepCase4(dt) {
    const s = this.state;
    const rad = (s.slopeAngleDeg * Math.PI) / 180;
    const rampLen = 380; // Chiều dài cạnh huyền dốc nghiêng

    if (!s.onGround) {
      // Giai đoạn 1: Trượt trên mặt phẳng nghiêng
      const mg = s.m * this.g;
      s.normalForce = mg * Math.cos(rad);
      s.frictionForce = s.mu * s.normalForce;
      const fDown = mg * Math.sin(rad);

      const fNet = fDown - s.frictionForce;
      s.accel = fNet > 0 ? fNet / s.m : 0;

      if (s.accel > 0) {
        s.v += s.accel * dt;
        s.dist += s.v * dt * 7.0;
      }

      // Khi xe chạy hết chiều dài dốc -> chuyển sang mặt đường ngang
      if (s.dist >= rampLen) {
        s.dist = rampLen;
        s.onGround = true;
      }
    } else {
      // Giai đoạn 2: Trượt trên mặt đường ngang dưới chân dốc
      // Trọng lực cân bằng phản lực N = mg; lực ma sát trượt cản trở chuyển động: a = -μ·g
      const mg = s.m * this.g;
      s.normalForce = mg;
      s.frictionForce = s.mu * mg;
      s.accel = -s.mu * this.g;

      s.v += s.accel * dt;
      if (s.v > 0) {
        s.groundDist += s.v * dt * 7.0;
      } else {
        s.v = 0;
        s.accel = 0;
        this.isRunning = false; // Xe dừng hẳn tự nhiên do ma sát
      }
    }
  }

  stepCase5(dt) {
    const s = this.state;
    if (!s.isAttached) {
      s.x1 += s.v1 * dt * 12;
      s.energyBefore = 0.5 * s.m1 * s.v1 * s.v1;

      if (s.x1 + 60 >= s.x2) {
        s.isAttached = true;
        // Bảo toàn động lượng: m1*v1 = (m1+m2)*vf
        s.vf = (s.m1 * s.v1) / (s.m1 + s.m2);
        s.energyAfter = 0.5 * (s.m1 + s.m2) * s.vf * s.vf;
        s.heatGenerated = s.energyBefore - s.energyAfter;
      }
    } else {
      s.x1 += s.vf * dt * 12;
      s.x2 = s.x1 + 60;
    }

    if (s.x2 > 600) this.isRunning = false;
  }

  stepCase6(dt) {
    const s = this.state;
    const effectiveArea = s.parachuteOpen ? s.areaChute : s.area;
    const rho = this.airDensity;
    const fDrag = 0.5 * rho * s.cDrag * effectiveArea * s.v * s.v;
    s.airResistForce = fDrag;

    const mg = s.m * this.g;
    const fNet = mg - fDrag;
    const accel = fNet / s.m;

    s.v += accel * dt;
    if (s.v < 0) s.v = 0;

    s.y -= s.v * dt * 2.2;
    s.terminalV = rho > 0 ? Math.sqrt((2 * mg) / (rho * s.cDrag * effectiveArea)) : Infinity;

    if (s.y <= 30) {
      s.y = 30;
      this.isRunning = false;
    }
  }

  deployParachute() {
    if (this.currentCase === 'case6') {
      this.state.parachuteOpen = true;
    }
  }

  isFinished() {
    const s = this.state;
    if (!s) return false;
    switch (this.currentCase) {
      case 'case1':
        return s.y1 <= s.groundY && s.y2 <= s.groundY;
      case 'case2':
        return s.x2 > 620;
      case 'case3':
        return s.isStringCut && (Math.abs(s.ballX) > 270 || Math.abs(s.ballY) > 270);
      case 'case4':
        return s.onGround && s.v <= 0.05;
      case 'case5':
        return s.x2 > 590;
      case 'case6':
        return s.y <= 30;
      default:
        return false;
    }
  }

  setEnvironment(envKey) {
    if (!this.environments[envKey]) envKey = 'earth_air';
    this.currentEnv = envKey;
    const env = this.environments[envKey];
    this.g = env.g;
    this.airDensity = env.airDensity;
    this.isVacuum = env.isVacuum;

    if (this.currentCase === 'case1') {
      this.simTime = 0.0;
      this.isRunning = false;
      if (this.state) {
        this.state.y1 = 210;
        this.state.y2 = 210;
        this.state.v1 = 0.0;
        this.state.v2 = 0.0;
        this.state.t1 = null;
        this.state.t2 = null;
      }
      this.updateSensors();
    } else if (this.currentCase === 'case6') {
      this.simTime = 0.0;
      this.isRunning = false;
      if (this.state) {
        this.state.y = 280;
        this.state.v = 0.0;
        this.state.parachuteOpen = false;
        this.state.airResistForce = 0.0;
      }
      this.updateSensors();
    }

    return env;
  }

  updateSensors() {
    this.sensors.time = this.simTime;

    switch (this.currentCase) {
      case 'case1':
        this.sensors.v1 = this.state.v1 || 0.0;
        this.sensors.v2 = this.state.v2 || 0.0;
        this.sensors.a1 = this.isVacuum ? this.g : Math.max(0, this.g - 0.2);
        this.sensors.f1 = this.state.m1 * this.g;
        break;

      case 'case2':
        this.sensors.v1 = this.state.v1 || 0.0;
        this.sensors.v2 = this.state.v2 || 0.0;
        this.sensors.f1 = this.state.contactForce || 0;
        this.sensors.f2 = this.state.contactForce || 0;
        this.sensors.a1 = this.state.contactForce > 0 ? this.state.contactForce / this.state.m1 : 0;
        break;

      case 'case3':
        this.sensors.v1 = this.state.speed || 0.0;
        const rMeters = (this.state.radius || 75) / 50;
        const fHt = this.state.isStringCut ? 0 : (this.state.m * this.state.speed * this.state.speed) / rMeters;
        this.sensors.f1 = fHt;
        this.sensors.a1 = this.state.isStringCut ? 0 : (this.state.speed * this.state.speed) / rMeters;
        break;

      case 'case4':
        this.sensors.v1 = this.state.v || 0.0;
        this.sensors.f1 = this.state.frictionForce || 0;
        this.sensors.a1 = this.state.accel || 0;
        break;

      case 'case5':
        this.sensors.v1 = this.state.v1 || 0.0;
        this.sensors.v2 = this.state.vf || 0.0;
        this.sensors.f1 = this.state.isAttached ? 40000 : 0;
        this.sensors.eLoss = this.state.heatGenerated || 0;
        break;

      case 'case6':
        this.sensors.v1 = this.state.v || 0.0;
        this.sensors.f1 = this.state.airResistForce || 0;
        const mg = this.state.m * this.g;
        const aVal = Math.max(0, (mg - this.state.airResistForce) / this.state.m);
        this.sensors.a1 = aVal;
        break;
    }
  }

  recordHistory() {
    if (this.history.length > 300) this.history.shift();
    this.history.push({
      time: this.simTime,
      v1: this.sensors.v1,
      f1: this.sensors.f1,
      a1: this.sensors.a1
    });
  }
}

window.PhysicsEngine = PhysicsEngine;
window.physicsEngine = new PhysicsEngine();
