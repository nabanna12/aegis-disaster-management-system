// ============================================================
//  AEGIS — UI Rendering Module
// ============================================================

// ── CLOCK ──────────────────────────────────────────────────
function updateClock() {
  const now = new Date();
  document.getElementById('mainClock').textContent =
    now.toTimeString().slice(0, 8) + ' UTC';
  document.getElementById('dashDate').textContent =
    now.toLocaleDateString('en-IN', { weekday:'long', year:'numeric', month:'long', day:'numeric' });
}
setInterval(updateClock, 1000);
updateClock();

// ── PAGE NAVIGATION ────────────────────────────────────────
function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('page-' + name).classList.add('active');
  document.querySelector(`[data-page="${name}"]`)?.classList.add('active');
  document.getElementById('breadcrumb').textContent = {
    dashboard: 'Command Center',
    incidents: 'Active Incidents',
    resources: 'Resources',
    map: 'Threat Map',
    teams: 'Response Teams',
    alerts: 'Alert System',
    reports: 'Reports & Analytics',
    inventory: 'Inventory Management'
  }[name] || name;
  // Render page content
  if (name === 'incidents')  renderIncidents();
  if (name === 'resources')  renderResources();
  if (name === 'teams')      renderTeams();
  if (name === 'alerts')     renderAlerts();
  if (name === 'reports')    renderReports();
  if (name === 'inventory')  renderInventory();
  if (name === 'map')        { setTimeout(() => drawMainMap(), 100); renderMapList(); }
}

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('collapsed');
}

// ── INCIDENTS ──────────────────────────────────────────────
let currentFilter = 'all';
let currentSearch = '';

function renderIncidents(filter, search) {
  if (filter !== undefined) currentFilter = filter;
  if (search !== undefined) currentSearch = search;
  const grid = document.getElementById('incidentsGrid');
  let items = DB.incidents;
  if (currentFilter !== 'all') items = items.filter(i => i.severity === currentFilter);
  if (currentSearch) items = items.filter(i =>
    i.title.toLowerCase().includes(currentSearch.toLowerCase()) ||
    i.location.toLowerCase().includes(currentSearch.toLowerCase())
  );
  grid.innerHTML = items.map(inc => `
    <div class="incident-card ${inc.severity}" data-id="${inc.id}">
      <div class="incident-top">
        <span class="incident-badge ${inc.severity}">${inc.severity.toUpperCase()}</span>
        <span class="incident-id">${inc.id}</span>
      </div>
      <div class="incident-title">${inc.title}</div>
      <div class="incident-meta">
        <div class="incident-meta-item">TYPE: <span>${inc.type}</span></div>
        <div class="incident-meta-item">STATUS: <span>${inc.status}</span></div>
        <div class="incident-meta-item">📍 <span>${inc.location}</span></div>
      </div>
      <div class="incident-desc">${inc.desc}</div>
      <div class="incident-progress">
        <div class="progress-label">
          <span>Response Progress</span><span>${inc.progress}%</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width:${inc.progress}%; background:${inc.color};"></div>
        </div>
      </div>
      <div class="incident-footer">
        <div class="incident-team">🔹 ${inc.team}</div>
        <div class="incident-actions">
          <button class="ic-btn" onclick="viewIncident('${inc.id}')">DETAILS</button>
          <button class="ic-btn" onclick="dispatchTeam('${inc.id}')">DISPATCH</button>
        </div>
      </div>
    </div>
  `).join('');
  document.getElementById('incidentBadge').textContent =
    DB.incidents.filter(i => i.status === 'Active').length;
}

function filterIncidents(f, btn) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderIncidents(f);
}

function searchIncidents(v) { renderIncidents(undefined, v); }

function viewIncident(id) {
  const inc = DB.incidents.find(i => i.id === id);
  if (!inc) return;
  openModal('viewIncident', inc);
}

function dispatchTeam(id) {
  const inc = DB.incidents.find(i => i.id === id);
  openModal('dispatch', inc);
}

// ── RESOURCES ──────────────────────────────────────────────
function renderResources() {
  const el = document.getElementById('resourcesContent');
  const cats = { personnel: 'PERSONNEL', vehicles: 'VEHICLES & TRANSPORT', equipment: 'EQUIPMENT', supplies: 'SUPPLIES & PROVISIONS' };
  el.innerHTML = Object.entries(cats).map(([key, label]) => `
    <div>
      <div class="resource-category-title">▸ ${label}</div>
      <div class="resources-row">
        ${DB.resources[key].map(r => {
          const pct = Math.round(r.available / r.total * 100);
          return `<div class="resource-card">
            <div class="resource-icon">${r.icon}</div>
            <div class="resource-name">${r.name}</div>
            <div class="resource-count">${r.available} <span style="font-size:0.8rem;color:var(--text-muted)">/ ${r.total}</span></div>
            <div class="resource-avail">${pct}% available</div>
            <div class="resource-bar"><div class="resource-bar-fill" style="width:${pct}%; background:${pct > 70 ? 'var(--success)' : pct > 40 ? 'var(--warning)' : 'var(--danger)'};"></div></div>
          </div>`;
        }).join('')}
      </div>
    </div>
  `).join('');
}

// ── TEAMS ──────────────────────────────────────────────────
function renderTeams() {
  const grid = document.getElementById('teamsGrid');
  grid.innerHTML = DB.teams.map(t => `
    <div class="team-card">
      <div class="team-card-header">
        <div class="team-id">${t.id}</div>
        <div class="team-status-pill ${t.status}">${t.status.toUpperCase()}</div>
      </div>
      <div class="team-card-body">
        <div class="team-name">${t.name}</div>
        <div class="team-stats">
          <div class="team-stat-item">
            <div class="team-stat-label">TYPE</div>
            <div class="team-stat-val">${t.type}</div>
          </div>
          <div class="team-stat-item">
            <div class="team-stat-label">LOCATION</div>
            <div class="team-stat-val">${t.location}</div>
          </div>
          <div class="team-stat-item">
            <div class="team-stat-label">MISSION</div>
            <div class="team-stat-val">${t.mission || 'None'}</div>
          </div>
          <div class="team-stat-item">
            <div class="team-stat-label">VEHICLES</div>
            <div class="team-stat-val">${t.vehicles}</div>
          </div>
          <div class="team-stat-item">
            <div class="team-stat-label">RATING</div>
            <div class="team-stat-val">${t.rating}%</div>
          </div>
          <div class="team-stat-item">
            <div class="team-stat-label">MEMBERS</div>
            <div class="team-stat-val">${t.members.length}</div>
          </div>
        </div>
        <div class="team-members">
          ${t.members.map(m => `<div class="team-member-avatar">${m}</div>`).join('')}
          ${t.members.length > 5 ? `<div class="team-member-avatar">+${t.members.length - 5}</div>` : ''}
        </div>
      </div>
    </div>
  `).join('');
}

// ── ALERTS ─────────────────────────────────────────────────
function renderAlerts() {
  const el = document.getElementById('alertsDashboard');
  const zones = { critical: 'CRITICAL ALERTS', high: 'HIGH PRIORITY', medium: 'MEDIUM PRIORITY', low: 'LOW PRIORITY' };
  el.innerHTML = Object.entries(zones).map(([sev, title]) => {
    const items = DB.alerts.filter(a => a.severity === sev);
    if (!items.length) return '';
    return `
      <div class="alert-zone">
        <div class="alert-zone-header">
          <div class="alert-zone-title ${sev}">${title}</div>
          <div class="alert-zone-count">${items.length} alert${items.length > 1 ? 's' : ''}</div>
        </div>
        <div class="alerts-full-list">
          ${items.map(a => `
            <div class="alert-full-item">
              <div class="alert-full-icon">${a.icon}</div>
              <div>
                <div class="alert-full-title">${a.title}</div>
                <div class="alert-full-desc">${a.desc}</div>
              </div>
              <div class="alert-full-meta">
                ${a.time}<br>
                Zone: ${a.zone}<br>
                Expires: ${a.expires}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }).join('');
}

// ── REPORTS ────────────────────────────────────────────────
function renderReports() {
  const grid = document.getElementById('reportsGrid');
  const reports = [
    { type: 'INCIDENT SUMMARY', title: 'Weekly Incident Overview', vals: [{ l: 'Total', v: '8' }, { l: 'Critical', v: '2' }, { l: 'Resolved', v: '4' }], bars: [60, 80, 45, 90, 70, 55, 85] },
    { type: 'RESPONSE TIME', title: 'Mean Response Time Analysis', vals: [{ l: 'Avg (min)', v: '8.4' }, { l: 'Best', v: '4.1m' }, { l: 'Target', v: '10m' }], bars: [40, 60, 50, 70, 45, 80, 55] },
    { type: 'EVACUATION', title: 'Civilian Evacuation Report', vals: [{ l: 'Evacuated', v: '1,482' }, { l: 'Sheltered', v: '890' }, { l: 'Capacity', v: '72%' }], bars: [20, 45, 65, 80, 90, 95, 72] },
    { type: 'RESOURCES', title: 'Resource Utilization Report', vals: [{ l: 'Deployed', v: '63%' }, { l: 'Available', v: '37%' }, { l: 'Requested', v: '14' }], bars: [50, 55, 60, 70, 65, 80, 63] },
    { type: 'TEAMS', title: 'Team Performance Metrics', vals: [{ l: 'Teams Active', v: '6' }, { l: 'Avg Rating', v: '92.8%' }, { l: 'Missions', v: '5' }], bars: [90, 85, 95, 88, 92, 96, 89] },
    { type: 'ALERTS', title: 'Alert Response Effectiveness', vals: [{ l: 'Issued', v: '7' }, { l: 'Actioned', v: '6' }, { l: 'Avg Response', v: '3.2m' }], bars: [75, 80, 70, 90, 85, 88, 92] }
  ];
  grid.innerHTML = reports.map(r => `
    <div class="report-card panel">
      <div class="report-type">${r.type}</div>
      <div class="report-title">${r.title}</div>
      <div class="report-chart">
        <canvas class="report-bar-chart" data-bars='${JSON.stringify(r.bars)}' style="width:100%;height:80px;display:block;"></canvas>
      </div>
      <div class="report-stats">
        ${r.vals.map(v => `<div><div class="report-stat-label">${v.l}</div><div class="report-stat-val">${v.v}</div></div>`).join('')}
      </div>
    </div>
  `).join('');
  // Draw mini bar charts
  setTimeout(() => {
    document.querySelectorAll('.report-bar-chart').forEach(canvas => {
      const bars = JSON.parse(canvas.dataset.bars);
      canvas.width = canvas.offsetWidth || 300;
      canvas.height = 80;
      const ctx = canvas.getContext('2d');
      const bw = (canvas.width - bars.length * 4) / bars.length;
      bars.forEach((v, i) => {
        const h = (v / 100) * 64;
        const x = i * (bw + 4);
        const y = 80 - h - 8;
        const g = ctx.createLinearGradient(0, y, 0, y + h);
        g.addColorStop(0, 'rgba(0,194,255,0.8)');
        g.addColorStop(1, 'rgba(0,194,255,0.2)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.roundRect(x, y, bw, h, 3);
        ctx.fill();
      });
    });
  }, 50);
}

function exportReport() {
  showToast('Report exported successfully', 'success');
}

// ── INVENTORY ──────────────────────────────────────────────
function renderInventory() {
  const el = document.getElementById('inventoryContainer');
  el.innerHTML = `
    <div class="inventory-table-wrap">
      <table class="inventory-table">
        <thead>
          <tr>
            <th>ITEM ID</th><th>NAME</th><th>CATEGORY</th>
            <th>QUANTITY</th><th>THRESHOLD</th><th>LOCATION</th>
            <th>STATUS</th><th>LAST RESTOCKED</th><th>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          ${DB.inventory.map(item => `
            <tr>
              <td style="font-family:var(--font-mono);color:var(--accent)">${item.id}</td>
              <td style="color:var(--text-primary);font-weight:600">${item.name}</td>
              <td>${item.category}</td>
              <td style="font-family:var(--font-display);color:var(--text-primary)">${item.quantity.toLocaleString()}</td>
              <td style="font-family:var(--font-mono);color:var(--text-muted)">${item.threshold.toLocaleString()}</td>
              <td>${item.location}</td>
              <td><span class="inv-status ${item.status}">${item.status.toUpperCase()}</span></td>
              <td style="font-family:var(--font-mono);color:var(--text-muted)">${item.lastRestocked}</td>
              <td>
                <button class="ic-btn" onclick="restockItem('${item.id}')">RESTOCK</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function restockItem(id) {
  const item = DB.inventory.find(i => i.id === id);
  if (!item) return;
  item.status = 'ok';
  item.lastRestocked = 'just now';
  renderInventory();
  showToast(`${item.name} restocked successfully`, 'success');
}

// ── MAP LIST ───────────────────────────────────────────────
function renderMapList() {
  const el = document.getElementById('mapIncidentsList');
  el.innerHTML = DB.incidents.map(inc => `
    <div class="map-inc-item" onclick="highlightMapIncident('${inc.id}')">
      <div class="map-inc-name" style="color:${inc.color}">${inc.title}</div>
      <div class="map-inc-loc">📍 ${inc.location}</div>
    </div>
  `).join('');
}

function highlightMapIncident(id) {
  showToast('Incident highlighted on map', 'info');
}

// ── DASHBOARD WIDGETS ──────────────────────────────────────
function renderDashboardAlerts() {
  const el = document.getElementById('dashAlerts');
  el.innerHTML = DB.alerts.slice(0, 5).map(a => `
    <div class="alert-item">
      <span class="alert-sev ${a.severity}">${a.severity.toUpperCase()}</span>
      <div class="alert-content">
        <div class="alert-title">${a.title}</div>
        <div class="alert-time">${a.time} · ${a.zone}</div>
      </div>
    </div>
  `).join('');
}

function renderDashboardTeams() {
  const el = document.getElementById('dashTeams');
  el.innerHTML = DB.teams.map(t => `
    <div class="team-status-item">
      <span class="team-status-code">${t.id}</span>
      <span class="team-status-name">${t.name}</span>
      <span class="team-status-tag ${t.status}">${t.status.toUpperCase()}</span>
    </div>
  `).join('');
}

function renderWeather() {
  const el = document.getElementById('weatherGrid');
  el.innerHTML = DB.weather.map(w => `
    <div class="weather-card">
      <div class="weather-loc">${w.location}</div>
      <div class="weather-icon">${w.icon}</div>
      <div class="weather-temp">${w.temp}</div>
      <div class="weather-cond" style="color:${w.risk==='danger'?'var(--danger)':'var(--warning)'}">${w.condition}</div>
    </div>
  `).join('');
}

// ── LIVE FEED ──────────────────────────────────────────────
let feedIndex = 0;
function addFeedItem() {
  const feed = document.getElementById('liveFeed');
  if (!feed) return;
  const msg = DB.liveFeedMessages[feedIndex % DB.liveFeedMessages.length];
  feedIndex++;
  const now = new Date().toTimeString().slice(0, 8);
  const item = document.createElement('div');
  item.className = `feed-item ${msg.type}`;
  item.innerHTML = `<div class="feed-time">${now}</div><div class="feed-text">${msg.text}</div>`;
  feed.insertBefore(item, feed.firstChild);
  if (feed.children.length > 20) feed.removeChild(feed.lastChild);
}
// Add initial messages
for (let i = 0; i < 6; i++) addFeedItem();
setInterval(addFeedItem, 4500);

// ── COUNTER ANIMATION ──────────────────────────────────────
function animateCounters() {
  document.querySelectorAll('.counter').forEach(el => {
    const target = parseInt(el.dataset.target);
    const duration = 1500;
    const start = performance.now();
    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target).toLocaleString();
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });
}

// ── GAUGE CANVASES ─────────────────────────────────────────
function drawGauges() {
  document.querySelectorAll('.gauge-canvas').forEach(canvas => {
    const value = parseInt(canvas.dataset.value);
    const color = canvas.dataset.color;
    canvas.width = 100; canvas.height = 100;
    const ctx = canvas.getContext('2d');
    const cx = 50, cy = 55, r = 36;
    const startAngle = Math.PI * 0.75;
    const endAngle   = Math.PI * 2.25;
    const valueAngle = startAngle + (value / 100) * (endAngle - startAngle);
    // Track
    ctx.beginPath();
    ctx.arc(cx, cy, r, startAngle, endAngle);
    ctx.strokeStyle = 'rgba(255,255,255,0.07)';
    ctx.lineWidth = 8; ctx.lineCap = 'round';
    ctx.stroke();
    // Fill
    ctx.beginPath();
    ctx.arc(cx, cy, r, startAngle, valueAngle);
    ctx.strokeStyle = color;
    ctx.lineWidth = 8;
    ctx.shadowColor = color;
    ctx.shadowBlur = 12;
    ctx.stroke();
    ctx.shadowBlur = 0;
    // Tick mark (center dot)
    ctx.beginPath();
    ctx.arc(cx, cy, 4, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  });
}

// ── MODALS ─────────────────────────────────────────────────
function openModal(type, data) {
  const overlay = document.getElementById('modalOverlay');
  const title   = document.getElementById('modalTitle');
  const body    = document.getElementById('modalBody');
  overlay.classList.add('active');

  const modals = {
    newIncident: {
      title: '+ NEW INCIDENT REPORT',
      html: `
        <div class="form-group"><label class="form-label">INCIDENT TITLE</label><input class="form-control" placeholder="Brief descriptive title"/></div>
        <div class="form-row">
          <div class="form-group"><label class="form-label">INCIDENT TYPE</label>
            <select class="form-control"><option>Flood</option><option>Fire</option><option>Earthquake</option><option>Storm</option><option>Landslide</option><option>Infrastructure</option><option>Accident</option><option>Wildfire</option></select></div>
          <div class="form-group"><label class="form-label">SEVERITY</label>
            <select class="form-control"><option>critical</option><option>high</option><option>medium</option><option>low</option></select></div>
        </div>
        <div class="form-group"><label class="form-label">LOCATION</label><input class="form-control" placeholder="Zone / Coordinates"/></div>
        <div class="form-group"><label class="form-label">DESCRIPTION</label><textarea class="form-control" rows="3" placeholder="Detailed situation report..."></textarea></div>
        <div class="form-row">
          <div class="form-group"><label class="form-label">ASSIGN TEAM</label>
            <select class="form-control">${DB.teams.map(t => `<option>${t.id} — ${t.name}</option>`).join('')}</select></div>
          <div class="form-group"><label class="form-label">PRIORITY</label><select class="form-control"><option>Immediate</option><option>High</option><option>Normal</option></select></div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline" onclick="closeModal()">CANCEL</button>
          <button class="btn btn-primary" onclick="submitIncident()">CREATE INCIDENT</button>
        </div>`
    },
    viewIncident: {
      title: data ? `${data.id} — INCIDENT DETAILS` : 'INCIDENT DETAILS',
      html: data ? `
        <div style="display:grid;gap:1rem;">
          <div style="padding:0.75rem;border-radius:8px;background:rgba(255,255,255,0.02);border:1px solid var(--border)">
            <div style="font-family:var(--font-mono);font-size:0.6rem;color:var(--text-muted);margin-bottom:0.25rem">INCIDENT TITLE</div>
            <div style="font-size:1rem;font-weight:700;color:var(--text-primary)">${data.title}</div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem">
            ${[['Type',data.type],['Severity',data.severity.toUpperCase()],['Status',data.status],['Location',data.location],['Team Assigned',data.team],['Evacuated',data.evacuated],['Casualties',data.casualties],['Reported',data.time]].map(([l,v])=>`
              <div style="padding:0.6rem;border-radius:6px;background:rgba(255,255,255,0.02);border:1px solid var(--border)">
                <div style="font-family:var(--font-mono);font-size:0.6rem;color:var(--text-muted)">${l}</div>
                <div style="font-size:0.85rem;color:var(--text-primary);font-weight:600;margin-top:0.2rem">${v}</div>
              </div>`).join('')}
          </div>
          <div style="padding:0.75rem;border-radius:8px;background:rgba(255,255,255,0.02);border:1px solid var(--border)">
            <div style="font-family:var(--font-mono);font-size:0.6rem;color:var(--text-muted);margin-bottom:0.5rem">SITUATION REPORT</div>
            <div style="font-size:0.83rem;color:var(--text-secondary);line-height:1.6">${data.desc}</div>
          </div>
          <div style="padding:0.75rem;border-radius:8px;background:rgba(255,255,255,0.02);border:1px solid var(--border)">
            <div style="font-family:var(--font-mono);font-size:0.6rem;color:var(--text-muted);margin-bottom:0.5rem">RESPONSE PROGRESS</div>
            <div style="height:6px;background:rgba(255,255,255,0.08);border-radius:3px;overflow:hidden">
              <div style="height:100%;width:${data.progress}%;background:${data.color};border-radius:3px;"></div>
            </div>
            <div style="font-family:var(--font-mono);font-size:0.65rem;color:var(--text-muted);margin-top:0.4rem">${data.progress}% Complete</div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline" onclick="closeModal()">CLOSE</button>
          <button class="btn btn-primary" onclick="showToast('Update sent to field team', 'success'); closeModal()">UPDATE STATUS</button>
        </div>` : ''
    },
    dispatch: {
      title: 'DISPATCH TEAM',
      html: `
        <div class="form-group"><label class="form-label">INCIDENT</label>
          <input class="form-control" value="${data ? data.id + ' — ' + data.title : ''}" readonly/></div>
        <div class="form-group"><label class="form-label">SELECT TEAM</label>
          <select class="form-control">${DB.teams.filter(t=>t.status==='standby').map(t=>`<option>${t.id} — ${t.name}</option>`).join('')}</select></div>
        <div class="form-group"><label class="form-label">PRIORITY LEVEL</label>
          <select class="form-control"><option>Immediate</option><option>High</option><option>Normal</option></select></div>
        <div class="form-group"><label class="form-label">SPECIAL INSTRUCTIONS</label>
          <textarea class="form-control" rows="3" placeholder="Additional instructions for the team..."></textarea></div>
        <div class="modal-footer">
          <button class="btn btn-outline" onclick="closeModal()">CANCEL</button>
          <button class="btn btn-primary" onclick="showToast('Team dispatched successfully!', 'success'); closeModal()">DISPATCH NOW</button>
        </div>`
    },
    broadcastAlert: {
      title: '📡 BROADCAST EMERGENCY ALERT',
      html: `
        <div style="padding:0.75rem;border-radius:8px;background:rgba(255,56,96,0.08);border:1px solid rgba(255,56,96,0.3);margin-bottom:1rem;">
          <div style="font-family:var(--font-mono);font-size:0.7rem;color:var(--danger)">⚠ This alert will be broadcast to all active response teams and public notification systems.</div>
        </div>
        <div class="form-group"><label class="form-label">ALERT TITLE</label><input class="form-control" placeholder="Short, clear alert headline"/></div>
        <div class="form-row">
          <div class="form-group"><label class="form-label">SEVERITY</label>
            <select class="form-control"><option>critical</option><option>high</option><option>medium</option><option>low</option></select></div>
          <div class="form-group"><label class="form-label">ZONE</label>
            <select class="form-control"><option>All Zones</option><option>Coastal East</option><option>City Center</option><option>Northern Region</option><option>Industrial Park</option><option>Southern Zone</option></select></div>
        </div>
        <div class="form-group"><label class="form-label">MESSAGE</label><textarea class="form-control" rows="4" placeholder="Full alert message to broadcast..."></textarea></div>
        <div class="form-group"><label class="form-label">EXPIRES IN</label>
          <select class="form-control"><option>1 hour</option><option>2 hours</option><option>6 hours</option><option>12 hours</option><option>24 hours</option><option>48 hours</option></select></div>
        <div class="modal-footer">
          <button class="btn btn-outline" onclick="closeModal()">CANCEL</button>
          <button class="btn btn-danger" onclick="broadcastAlertSubmit()">📡 BROADCAST ALERT</button>
        </div>`
    },
    addTeam: {
      title: '+ ADD RESPONSE TEAM',
      html: `
        <div class="form-group"><label class="form-label">TEAM ID</label><input class="form-control" placeholder="e.g. GOLF-8"/></div>
        <div class="form-group"><label class="form-label">TEAM NAME</label><input class="form-control" placeholder="Full team name"/></div>
        <div class="form-row">
          <div class="form-group"><label class="form-label">TYPE</label>
            <select class="form-control"><option>Search & Rescue</option><option>Fire & Hazmat</option><option>Medical</option><option>Structural</option><option>Evacuation</option><option>Infrastructure</option></select></div>
          <div class="form-group"><label class="form-label">INITIAL STATUS</label>
            <select class="form-control"><option>standby</option><option>deployed</option></select></div>
        </div>
        <div class="form-group"><label class="form-label">LOCATION / BASE</label><input class="form-control" placeholder="Base of operations"/></div>
        <div class="form-group"><label class="form-label">NUMBER OF VEHICLES</label><input type="number" class="form-control" value="2"/></div>
        <div class="modal-footer">
          <button class="btn btn-outline" onclick="closeModal()">CANCEL</button>
          <button class="btn btn-primary" onclick="showToast('Team added successfully', 'success'); closeModal(); renderTeams();">ADD TEAM</button>
        </div>`
    },
    addInventory: {
      title: '+ ADD INVENTORY ITEM',
      html: `
        <div class="form-group"><label class="form-label">ITEM NAME</label><input class="form-control" placeholder="Item name"/></div>
        <div class="form-row">
          <div class="form-group"><label class="form-label">CATEGORY</label>
            <select class="form-control"><option>Medical</option><option>Rescue Equipment</option><option>Equipment</option><option>Supplies</option><option>Safety</option><option>Communication</option><option>Infrastructure</option></select></div>
          <div class="form-group"><label class="form-label">QUANTITY</label><input type="number" class="form-control" value="0"/></div>
        </div>
        <div class="form-row">
          <div class="form-group"><label class="form-label">ALERT THRESHOLD</label><input type="number" class="form-control" value="10"/></div>
          <div class="form-group"><label class="form-label">STORAGE LOCATION</label><input class="form-control" placeholder="Warehouse / Bay"/></div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline" onclick="closeModal()">CANCEL</button>
          <button class="btn btn-primary" onclick="showToast('Item added to inventory', 'success'); closeModal(); renderInventory();">ADD ITEM</button>
        </div>`
    }
  };

  const m = modals[type];
  if (!m) return;
  title.textContent = m.title;
  body.innerHTML = m.html;
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('active');
}

function submitIncident() {
  closeModal();
  showToast('New incident created and assigned', 'success');
}

function broadcastAlertSubmit() {
  closeModal();
  showToast('🔴 Emergency alert broadcast to all units', 'error');
}

// ── TOAST ──────────────────────────────────────────────────
function showToast(msg, type = 'info') {
  const container = document.getElementById('toastContainer');
  const icons = { success: '✅', error: '🔴', warning: '⚠️', info: 'ℹ️' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span class="toast-icon">${icons[type]}</span><span class="toast-text">${msg}</span>`;
  container.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateX(30px)'; toast.style.transition = '0.3s'; setTimeout(() => toast.remove(), 300); }, 3500);
}
