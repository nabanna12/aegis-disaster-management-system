// ============================================================
//  AEGIS — Map Module
//  Canvas-based threat map rendering
// ============================================================

let mapScale = 1;
let mapOffsetX = 0, mapOffsetY = 0;
let mapAnimFrame;

// ── MINI MAP (Dashboard) ────────────────────────────────────
function drawMiniMap() {
  const canvas = document.getElementById('miniMapCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;

  ctx.clearRect(0, 0, W, H);

  // Background
  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, '#040d1a');
  grad.addColorStop(1, '#061524');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // Grid
  ctx.strokeStyle = 'rgba(0,194,255,0.06)';
  ctx.lineWidth = 1;
  for (let x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
  for (let y = 0; y < H; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

  // Coastline (decorative wavy line)
  ctx.beginPath();
  ctx.moveTo(W * 0.6, 0);
  for (let i = 0; i <= 20; i++) {
    const t = i / 20;
    const wave = Math.sin(t * Math.PI * 3) * 18;
    ctx.lineTo(W * 0.6 + wave + t * 30, H * t);
  }
  ctx.strokeStyle = 'rgba(0,194,255,0.12)';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Zones (ellipse regions)
  const zones = [
    { x: 0.72, y: 0.38, rx: 60, ry: 40, c: 'rgba(79,195,247,0.12)', bc: 'rgba(79,195,247,0.3)' },
    { x: 0.45, y: 0.55, rx: 50, ry: 35, c: 'rgba(255,107,53,0.12)', bc: 'rgba(255,107,53,0.3)' },
    { x: 0.85, y: 0.6,  rx: 55, ry: 45, c: 'rgba(186,104,200,0.1)', bc: 'rgba(186,104,200,0.25)' }
  ];
  zones.forEach(z => {
    ctx.beginPath();
    ctx.ellipse(z.x * W, z.y * H, z.rx, z.ry, 0, 0, Math.PI * 2);
    ctx.fillStyle = z.c;
    ctx.fill();
    ctx.strokeStyle = z.bc;
    ctx.lineWidth = 1;
    ctx.stroke();
  });

  // Incident markers
  const now = Date.now();
  DB.incidents.forEach(inc => {
    const x = inc.coordinates.x * W;
    const y = inc.coordinates.y * H;
    const pulse = Math.sin(now / 600) * 0.5 + 0.5;

    // Pulse ring
    if (inc.severity === 'critical' || inc.severity === 'high') {
      ctx.beginPath();
      ctx.arc(x, y, 12 + pulse * 10, 0, Math.PI * 2);
      ctx.strokeStyle = inc.color + '55';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    // Dot
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, Math.PI * 2);
    ctx.fillStyle = inc.color;
    ctx.shadowColor = inc.color;
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.shadowBlur = 0;

    // Label
    ctx.fillStyle = 'rgba(224,240,255,0.8)';
    ctx.font = '8px "Share Tech Mono"';
    ctx.fillText(inc.id, x + 9, y + 3);
  });

  // Team markers
  DB.teams.filter(t => t.status === 'deployed').forEach((t, i) => {
    const x = 40 + (i % 3) * 60;
    const y = 30 + Math.floor(i / 3) * 60;
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fillStyle = 'var(--accent)';
    ctx.fillStyle = '#00c2ff';
    ctx.shadowColor = '#00c2ff';
    ctx.shadowBlur = 8;
    ctx.fill();
    ctx.shadowBlur = 0;
  });

  requestAnimationFrame(drawMiniMap);
}

// ── MAIN MAP ────────────────────────────────────────────────
const mapData = {
  regions: [
    { name: 'Coastal East',   points: [[0.55,0.15],[0.85,0.1],[1.0,0.2],[1.0,0.7],[0.85,0.8],[0.6,0.6],[0.55,0.15]], fill: 'rgba(0,100,180,0.15)', stroke: 'rgba(0,150,220,0.3)' },
    { name: 'City Center',    points: [[0.3,0.3],[0.55,0.3],[0.55,0.6],[0.3,0.6],[0.3,0.3]], fill: 'rgba(60,90,130,0.2)', stroke: 'rgba(100,150,200,0.3)' },
    { name: 'Northern Hills', points: [[0.0,0.0],[0.5,0.0],[0.5,0.3],[0.3,0.3],[0.2,0.15],[0.0,0.2]], fill: 'rgba(30,80,40,0.2)', stroke: 'rgba(60,140,80,0.3)' },
    { name: 'Southern Zone',  points: [[0.0,0.6],[0.6,0.6],[0.6,0.9],[0.5,1.0],[0.0,1.0]], fill: 'rgba(80,60,30,0.15)', stroke: 'rgba(140,110,60,0.3)' },
    { name: 'Industrial Park',points: [[0.0,0.2],[0.3,0.2],[0.3,0.6],[0.0,0.6]], fill: 'rgba(70,60,70,0.2)', stroke: 'rgba(120,100,120,0.3)' }
  ],
  shelters: [
    { x: 0.25, y: 0.45, name: 'Shelter A-1', capacity: 500, occupied: 362 },
    { x: 0.50, y: 0.70, name: 'Shelter B-2', capacity: 800, occupied: 528 },
    { x: 0.78, y: 0.30, name: 'Shelter C-3', capacity: 300, occupied: 210 }
  ]
};

function drawMainMap() {
  const canvas = document.getElementById('mainMapCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const now = Date.now();

  ctx.clearRect(0, 0, W, H);
  ctx.save();
  ctx.translate(mapOffsetX, mapOffsetY);
  ctx.scale(mapScale, mapScale);

  // Background
  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, '#030c1a');
  grad.addColorStop(1, '#040f20');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // Grid
  ctx.strokeStyle = 'rgba(0,194,255,0.05)';
  ctx.lineWidth = 1;
  for (let x = 0; x < W; x += 50) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
  for (let y = 0; y < H; y += 50) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

  // Draw regions
  mapData.regions.forEach(region => {
    ctx.beginPath();
    region.points.forEach(([rx, ry], i) => {
      i === 0 ? ctx.moveTo(rx * W, ry * H) : ctx.lineTo(rx * W, ry * H);
    });
    ctx.closePath();
    ctx.fillStyle = region.fill;
    ctx.fill();
    ctx.strokeStyle = region.stroke;
    ctx.lineWidth = 1.5;
    ctx.stroke();
    // Region label
    const cx = region.points.reduce((s, p) => s + p[0], 0) / region.points.length;
    const cy = region.points.reduce((s, p) => s + p[1], 0) / region.points.length;
    ctx.fillStyle = 'rgba(150,190,220,0.4)';
    ctx.font = '10px "Share Tech Mono"';
    ctx.fillText(region.name.toUpperCase(), cx * W - 30, cy * H);
  });

  // Shelter markers
  mapData.shelters.forEach(s => {
    const sx = s.x * W, sy = s.y * H;
    const pct = s.occupied / s.capacity;
    ctx.beginPath();
    ctx.arc(sx, sy, 7, 0, Math.PI * 2);
    ctx.fillStyle = pct > 0.8 ? '#ff3860' : '#00f5a0';
    ctx.shadowColor = pct > 0.8 ? '#ff3860' : '#00f5a0';
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.font = '9px "Share Tech Mono"';
    ctx.fillStyle = 'rgba(224,240,255,0.7)';
    ctx.fillText(`${s.name} (${s.occupied}/${s.capacity})`, sx + 10, sy + 3);
  });

  // Incident markers with pulsing rings
  DB.incidents.forEach(inc => {
    const ix = inc.coordinates.x * W;
    const iy = inc.coordinates.y * H;
    const pulse = Math.sin(now / 700) * 0.5 + 0.5;

    if (inc.status === 'Active') {
      [1, 2, 3].forEach(ring => {
        const radius = 14 + ring * 10 + pulse * 8;
        ctx.beginPath();
        ctx.arc(ix, iy, radius, 0, Math.PI * 2);
        ctx.strokeStyle = inc.color + Math.floor((1 - ring * 0.25 + pulse * 0.1) * 80).toString(16).padStart(2,'0');
        ctx.lineWidth = 1;
        ctx.stroke();
      });
    }

    // Icon BG
    ctx.beginPath();
    ctx.arc(ix, iy, 12, 0, Math.PI * 2);
    ctx.fillStyle = inc.color + '40';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(ix, iy, 8, 0, Math.PI * 2);
    ctx.fillStyle = inc.color;
    ctx.shadowColor = inc.color;
    ctx.shadowBlur = 15;
    ctx.fill();
    ctx.shadowBlur = 0;

    // Label box
    const label = `${inc.id}`;
    ctx.font = 'bold 9px "Share Tech Mono"';
    const tw = ctx.measureText(label).width;
    ctx.fillStyle = 'rgba(3,11,20,0.85)';
    ctx.beginPath();
    ctx.roundRect(ix + 14, iy - 9, tw + 12, 16, 3);
    ctx.fill();
    ctx.strokeStyle = inc.color + '80';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = inc.color;
    ctx.fillText(label, ix + 20, iy + 3);
  });

  // Team markers
  DB.teams.filter(t => t.status === 'deployed' || t.status === 'transit').forEach((team, i) => {
    const tx = (0.15 + i * 0.14) * W;
    const ty = (0.5 + Math.sin(i) * 0.25) * H;
    // Triangle marker
    ctx.beginPath();
    ctx.moveTo(tx, ty - 12);
    ctx.lineTo(tx + 10, ty + 6);
    ctx.lineTo(tx - 10, ty + 6);
    ctx.closePath();
    ctx.fillStyle = team.status === 'transit' ? '#f7b731' : '#00c2ff';
    ctx.shadowColor = team.status === 'transit' ? '#f7b731' : '#00c2ff';
    ctx.shadowBlur = 12;
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.font = '9px "Share Tech Mono"';
    ctx.fillStyle = 'rgba(224,240,255,0.8)';
    ctx.fillText(team.id, tx - 18, ty + 20);
  });

  ctx.restore();

  // Border glow
  ctx.strokeStyle = 'rgba(0,194,255,0.15)';
  ctx.lineWidth = 2;
  ctx.strokeRect(1, 1, W - 2, H - 2);

  if (document.getElementById('page-map')?.classList.contains('active')) {
    cancelAnimationFrame(mapAnimFrame);
    mapAnimFrame = requestAnimationFrame(drawMainMap);
  }
}

function mapZoom(factor) {
  mapScale = Math.max(0.5, Math.min(3, mapScale * factor));
}

function resetMap() {
  mapScale = 1; mapOffsetX = 0; mapOffsetY = 0;
}
