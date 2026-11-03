/* ==========================================================================
   PHYSICS DETECTIVE - Physics Engine (HTML5 Canvas 60 FPS)
   Numerical Simulation conforming to Grade 10 Physics (GDPT 2018)
   ========================================================================== */

const CASE1_ENVIRONMENTS = {
  earth_air: {
    id: 'earth_air',
    name: 'Trái Đất (Không khí)',
    icon: '🌍',
    g: 9.8,
    airDensity: 1.225,
    isVacuum: false,
    sky: null,
    ground: null,
    groundLine: null,
    label: '🌍 MÔI TRƯỜNG: TRÁI ĐẤT - KHÔNG KHÍ (g = 9.8 m/s², F_cản > 0)'
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
    label: '⚡ MÔI TRƯỜNG: TRÁI ĐẤT - CHÂN KHÔNG (g = 9.8 m/s², F_cản = 0)'
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
    label: '❄️ MÔI TRƯỜNG: SAO DIÊM VƯƠNG (g = 0.62 m/s², Trọng lực yếu)'
  },
  sun: {
    id: 'sun',
    name: 'Mặt Trời (Sun)',
    icon: '☀️',
    g: 274.0,
    airDensity: 0.0,
    isVacuum: true,
    sky: 'rgba(234, 88, 12, 0.25)',
    ground: '#b45309',
    groundLine: '#f59e0b',
    label: '☀️ MÔI TRƯỜNG: MẶT TRỜI (g = 274 m/s², Siêu trọng lực cực đại)'
  }
};

window.CASE1_ENVIRONMENTS = CASE1_ENVIRONMENTS;

class PhysicsEngine {
  constructor() {
    this.currentCase = 'case1'; // case1 to case6
    this.isRunning = false;
    this.simSpeed = 1.0;
    this.simTime = 0.0;
    this.timeStep = 1 / 60;

    // Environmental Parameters
    this.environments = CASE1_ENVIRONMENTS;
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

    if (caseId !== 'case1') {
      this.g = 9.8;
      this.airDensity = 1.225;
      this.isVacuum = false;
    }

    switch (caseId) {
      case 'case1': // Freefall (Pisa Mystery)
        const env = this.environments[this.currentEnv] || this.environments.earth_air;
        this.g = env.g;
        this.airDensity = env.airDensity;
        this.isVacuum = env.isVacuum;
        this.state = {
          m1: 5.0,        // Lead ball (kg)
          m2: 0.5,        // Feather / light ball (kg)
          y1: 300,        // start height in px
          y2: 300,
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
          m1: 5000,       // Truck (kg)
          m2: 1000,       // Car (kg)
          x1: 100,
          x2: 450,
          v1: 15.0,       // m/s
          v2: 0.0,
          colliding: false,
          collisionTime: 0.0,
          contactForce: 0.0,
          maxForce: 0.0
        };
        break;

      case 'case3': // Curved Road & Centripetal vs Centrifugal
        this.state = {
          m: 1200,        // Car mass
          radius: 60,     // m
          speed: 15.0,    // m/s
          angle: 0.0,     // rad
          isStringCut: false, // simulates loss of traction / cutting tether
          tangentVx: 0,
          tangentVy: 0,
          carX: 0,
          carY: 0
        };
        break;

      case 'case4': // Incline Plane & Friction vs Slope Angle
        this.state = {
          m: 10.0,        // kg
          slopeAngleDeg: 30, // degrees
          mu: 0.35,       // friction coefficient
          dist: 0.0,      // distance along slope
          v: 0.0,
          normalForce: 0.0,
          frictionForce: 0.0,
          accel: 0.0
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
          m: 80.0,        // Skydiver (kg)
          y: 350,
          v: 0.0,
          parachuteOpen: false,
          area: 0.7,      // body area
          areaChute: 40.0,// parachute area
          cDrag: 0.9,
          terminalV: 0.0,
          airResistForce: 0.0
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

    // Body 1
    const fDrag1 = 0.5 * rho * s.cDrag1 * s.area1 * s.v1 * s.v1;
    const fNet1 = s.m1 * this.g - fDrag1;
    const a1 = Math.max(0, fNet1 / s.m1);

    // Body 2
    const fDrag2 = 0.5 * rho * s.cDrag2 * s.area2 * s.v2 * s.v2;
    const fNet2 = s.m2 * this.g - fDrag2;
    const a2 = Math.max(0, fNet2 / s.m2);

    if (s.y1 > s.groundY) {
      s.v1 += a1 * dt;
      s.y1 -= s.v1 * dt * 5.0; // scale
      if (s.y1 <= s.groundY) {
        s.y1 = s.groundY;
        if (s.t1 === null) s.t1 = this.simTime;
      }
    }

    if (s.y2 > s.groundY) {
      s.v2 += a2 * dt;
      s.y2 -= s.v2 * dt * 5.0;
      if (s.y2 <= s.groundY) {
        s.y2 = s.groundY;
        if (s.t2 === null) s.t2 = this.simTime;
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
      // Spring-damper contact pulse modeling impact force
      const maxT = 0.15; // 150 ms contact
      if (s.collisionTime <= maxT) {
        const pulse = Math.sin((s.collisionTime / maxT) * Math.PI);
        s.contactForce = 45000 * pulse; // 45 kN peak
        if (s.contactForce > s.maxForce) s.maxForce = s.contactForce;
      } else {
        s.contactForce = 0;
        // Post collision velocities (inelastic-like)
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
      const omega = s.speed / s.radius;
      s.angle += omega * dt;
      s.carX = Math.cos(s.angle) * s.radius;
      s.carY = Math.sin(s.angle) * s.radius;
    } else {
      // Tangent inertial motion (Newton I)
      s.carX += s.tangentVx * dt * 10;
      s.carY += s.tangentVy * dt * 10;
    }

    if (Math.abs(s.carX) > 250 || Math.abs(s.carY) > 250) {
      this.isRunning = false;
    }
  }

  cutTractionString() {
    const s = this.state;
    if (this.currentCase === 'case3' && !s.isStringCut) {
      s.isStringCut = true;
      // Velocity vector is tangent to the circle: v_x = -v * sin(theta), v_y = v * cos(theta)
      s.tangentVx = -s.speed * Math.sin(s.angle);
      s.tangentVy = s.speed * Math.cos(s.angle);
    }
  }

  stepCase4(dt) {
    const s = this.state;
    const rad = (s.slopeAngleDeg * Math.PI) / 180;
    const mg = s.m * this.g;

    s.normalForce = mg * Math.cos(rad);
    s.frictionForce = s.mu * s.normalForce;
    const fDown = mg * Math.sin(rad);

    const fNet = fDown - s.frictionForce;
    s.accel = fNet > 0 ? fNet / s.m : 0;

    if (s.accel > 0) {
      s.v += s.accel * dt;
      s.dist += s.v * dt * 8.0;
    }

    if (s.dist > 350) this.isRunning = false;
  }

  stepCase5(dt) {
    const s = this.state;
    if (!s.isAttached) {
      s.x1 += s.v1 * dt * 12;
      s.energyBefore = 0.5 * s.m1 * s.v1 * s.v1;

      if (s.x1 + 60 >= s.x2) {
        s.isAttached = true;
        // Conservation of momentum: m1*v1 = (m1+m2)*vf
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
    const fDrag = 0.5 * this.airDensity * s.cDrag * effectiveArea * s.v * s.v;
    s.airResistForce = fDrag;

    const mg = s.m * this.g;
    const fNet = mg - fDrag;
    const accel = fNet / s.m;

    s.v += accel * dt;
    if (s.v < 0) s.v = 0;

    s.y -= s.v * dt * 3.0;
    s.terminalV = Math.sqrt((2 * mg) / (this.airDensity * s.cDrag * effectiveArea));

    if (s.y <= 40) {
      s.y = 40;
      this.isRunning = false;
    }
  }

  deployParachute() {
    if (this.currentCase === 'case6') {
      this.state.parachuteOpen = true;
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
        this.state.y1 = 300;
        this.state.y2 = 300;
        this.state.v1 = 0.0;
        this.state.v2 = 0.0;
        this.state.t1 = null;
        this.state.t2 = null;
      }
      this.updateSensors();
    }
    return env;
  }

  toggleVacuum() {
    if (this.currentEnv === 'earth_vacuum') {
      this.setEnvironment('earth_air');
    } else {
      this.setEnvironment('earth_vacuum');
    }
    return this.isVacuum;
  }

  updateSensors() {
    const s = this.state;
    this.sensors.time = this.simTime;

    switch (this.currentCase) {
      case 'case1':
        this.sensors.v1 = s.v1;
        this.sensors.v2 = s.v2;
        const curRho = this.isVacuum ? 0.0 : this.airDensity;
        const curDrag1 = 0.5 * curRho * s.cDrag1 * s.area1 * s.v1 * s.v1;
        const curDrag2 = 0.5 * curRho * s.cDrag2 * s.area2 * s.v2 * s.v2;
        this.sensors.a1 = (s.y1 <= s.groundY) ? 0.0 : Math.max(0, (s.m1 * this.g - curDrag1) / s.m1);
        this.sensors.a2 = (s.y2 <= s.groundY) ? 0.0 : Math.max(0, (s.m2 * this.g - curDrag2) / s.m2);
        this.sensors.f1 = s.m1 * this.g;
        this.sensors.f2 = s.m2 * this.g;
        break;

      case 'case2':
        this.sensors.v1 = s.v1;
        this.sensors.v2 = s.v2;
        this.sensors.f1 = s.contactForce;
        this.sensors.f2 = s.contactForce; // Action = -Reaction!
        this.sensors.a1 = s.contactForce / s.m1;
        this.sensors.a2 = s.contactForce / s.m2;
        break;

      case 'case3':
        const omega = s.speed / s.radius;
        const aCentripetal = (s.speed * s.speed) / s.radius;
        this.sensors.v1 = s.speed;
        this.sensors.a1 = aCentripetal;
        this.sensors.f1 = s.isStringCut ? 0.0 : s.m * aCentripetal;
        this.sensors.f2 = 0.0; // Proves centrifugal is virtual
        break;

      case 'case4':
        this.sensors.v1 = s.v;
        this.sensors.a1 = s.accel;
        this.sensors.f1 = s.normalForce;
        this.sensors.f2 = s.frictionForce;
        break;

      case 'case5':
        this.sensors.v1 = s.isAttached ? s.vf : s.v1;
        this.sensors.eKineticTotal = s.isAttached ? s.energyAfter : s.energyBefore;
        this.sensors.eLoss = s.heatGenerated;
        this.sensors.f1 = s.m1 * 9.8;
        break;

      case 'case6':
        this.sensors.v1 = s.v;
        this.sensors.f1 = s.airResistForce;
        this.sensors.f2 = s.m * this.g;
        this.sensors.a1 = (s.m * this.g - s.airResistForce) / s.m;
        break;
    }
  }

  recordHistory() {
    if (this.history.length > 200) this.history.shift();
    this.history.push({
      t: this.simTime,
      v: this.sensors.v1,
      f: this.sensors.f1,
      a: this.sensors.a1
    });
  }
}

window.physicsEngine = new PhysicsEngine();
