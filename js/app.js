// ============================================================
//  AEGIS — Main Application Bootstrap
// ============================================================

// ── PARTICLE SYSTEM ─────────────────────────────────────────
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = (Math.random() - 0.5) * 0.3;
      this.r  = Math.random() * 1.5 + 0.5;
      this.alpha = Math.random() * 0.4 + 0.1;
      this.life = 0;
      this.maxLife = 200 + Math.random() * 300;
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      this.life++;
      if (this.life > this.maxLife || this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
      const fade = this.life < 30 ? this.life / 30 : this.life > this.maxLife - 30 ? (this.maxLife - this.life) / 30 : 1;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,194,255,${this.alpha * fade})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < 80; i++) particles.push(new Particle());

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0,194,255,${0.04 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function tick() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    requestAnimationFrame(tick);
  }
  tick();
})();

// ── BOOT SEQUENCE ───────────────────────────────────────────
(function boot() {
  const messages = [
    'Initializing core systems...',
    'Loading incident database...',
    'Connecting to field units...',
    'Calibrating threat sensors...',
    'Fetching weather data...',
    'Establishing secure channels...',
    'Running system diagnostics...',
    'All systems operational — Welcome, Commander.'
  ];
  const fill   = document.getElementById('bootFill');
  const status = document.getElementById('bootStatus');
  let step = 0;

  function nextStep() {
    if (step >= messages.length) {
      // Boot complete — reveal app
      setTimeout(() => {
        document.getElementById('bootScreen').classList.add('fade-out');
        setTimeout(() => {
          document.getElementById('bootScreen').style.display = 'none';
          document.getElementById('mainApp').style.display = 'flex';
          initApp();
        }, 800);
      }, 400);
      return;
    }
    status.textContent = messages[step];
    fill.style.width = `${(step / (messages.length - 1)) * 100}%`;
    step++;
    setTimeout(nextStep, step === messages.length ? 600 : 320 + Math.random() * 200);
  }
  setTimeout(nextStep, 600);
})();

// ── APP INIT ─────────────────────────────────────────────────
function initApp() {
  renderDashboardAlerts();
  renderDashboardTeams();
  renderWeather();
  animateCounters();
  drawGauges();
  drawMiniMap();
}
