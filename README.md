# AEGIS — Advanced Emergency & Global Incident System

> A real-time disaster management dashboard for incident tracking, resource monitoring, and emergency response coordination.

![Tech Stack](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![Tech Stack](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![Tech Stack](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![Status](https://img.shields.io/badge/Status-Operational-brightgreen)

---

## About the Project

AEGIS (Advanced Emergency & Global Incident System) is a fully client-side, browser-based command dashboard designed to simulate real-time disaster response operations. Built with vanilla HTML5, CSS3, and JavaScript — no frameworks, no dependencies — it demonstrates advanced DOM manipulation, Canvas API rendering, dynamic data handling, and a modular multi-page architecture.

The dashboard provides emergency personnel with a centralised interface to monitor active incidents, track deployed response teams, manage resources and inventory, and broadcast alerts — all within a high-fidelity, military-styled UI.

---

## Live Demo

🔗 **[View Live →](https://nabanna12.github.io/aegis-disaster-management-system)**

---

## Features

### Command Center (Dashboard)
- Animated boot sequence with system initialisation progress bar
- Live KPI strip displaying: critical incidents, monitored warning zones, deployed response units, evacuated civilians, and resource availability percentage
- Real-time live incident feed with auto-updating entries
- Mini threat map rendered via HTML5 Canvas
- Circular resource gauges (Canvas API) for Personnel, Vehicles, Medical, and Supplies
- Team deployment status overview
- Environmental conditions widget

### Active Incidents
- Filterable incident grid by severity: Critical, High, Medium, Low
- Real-time search across all incidents
- Modal-based form to log new incidents

### Threat Map
- Full-screen interactive Canvas map with zoom controls and reset
- Colour-coded incident markers: Wildfire, Flood, Earthquake, Storm, Response Team, Shelter
- Sidebar panel showing all active incident markers with details

### Response Teams
- Grid view of all deployed response teams with status indicators
- Add new teams via modal form

### Alert System
- Categorised alert dashboard with severity levels
- Broadcast alert functionality for system-wide notifications

### Reports & Analytics
- Analytics dashboard with exportable report functionality

### Inventory Management
- Full inventory table with add-item modal

### UI / UX
- Animated particle canvas background with scan-line effect
- Persistent real-time clock and threat level indicator in the top bar
- Toast notification system for user feedback
- Fully responsive layout with collapsible sidebar
- Custom typography: Orbitron, Rajdhani, Share Tech Mono (Google Fonts)

---

## Tech Stack

| Technology | Usage |
|---|---|
| HTML5 | Semantic structure, Canvas elements, modal system |
| CSS3 | Custom properties, grid/flexbox layouts, animations, responsive design |
| JavaScript (ES6+) | DOM manipulation, Canvas API, event handling, modular file architecture |
| Canvas API | Threat map rendering, circular gauge charts, particle animation |
| Google Fonts | Orbitron, Rajdhani, Share Tech Mono |

> No external JS libraries or frameworks were used. All rendering, data handling, and UI logic is written in pure JavaScript.

---

## Project Structure

```
aegis-disaster-management-system/
│
├── index.html          # Main app shell — all pages and modals
├── css/
│   └── main.css        # Full styling: layout, components, animations, responsive
├── js/
│   ├── data.js         # Centralised mock data (incidents, teams, resources, alerts)
│   ├── ui.js           # UI rendering functions — feeds, gauges, team cards, alerts
│   ├── map.js          # Canvas map engine — drawing, markers, zoom, interaction
│   └── app.js          # App initialisation, navigation, modal controller, boot sequence
└── .gitignore
```

---

## Getting Started

No build tools or installations required.

### Run locally

```bash
# Clone the repository
git clone https://github.com/nabanna12/aegis-disaster-management-system.git

# Navigate into the project folder
cd aegis-disaster-management-system

# Open in browser
open index.html
```

Or simply open `index.html` directly in any modern browser (Chrome, Firefox, Edge).

---

## Pages Overview

| Page | Description |
|---|---|
| Command Center | Main dashboard — KPIs, live feed, map, gauges, teams, weather |
| Active Incidents | Filterable and searchable incident management grid |
| Resources | Resource category view with availability status |
| Threat Map | Interactive Canvas-rendered map with incident and team markers |
| Response Teams | Team cards with deployment status and member details |
| Alert System | Alert feed with broadcast functionality |
| Reports & Analytics | Summary analytics with export option |
| Inventory | Supply and equipment inventory with CRUD operations |

---

## Key Technical Highlights

- **Canvas API** — custom-built circular gauge charts and a fully interactive threat map with zoom/pan, colour-coded markers, and a real-time legend, all drawn without any charting library
- **Modular JS architecture** — logic is cleanly split across `data.js`, `ui.js`, `map.js`, and `app.js` — no spaghetti code, no global state leakage
- **Dynamic DOM rendering** — all pages, modals, cards, and feeds are rendered from JavaScript data arrays, making the UI fully data-driven
- **Animated boot sequence** — simulates a real system initialisation with a progress bar and status messages before the app mounts
- **Zero dependencies** — no React, no jQuery, no Chart.js — a demonstration of what vanilla JS can do

---

## Screenshots

> *(Add screenshots here after enabling GitHub Pages or capturing the live dashboard)*

---

## Roadmap / Future Improvements

- [ ] Connect to a live backend (Node.js + Express + MongoDB) for real data persistence
- [ ] Add user authentication and role-based access (Commander / Field Officer / Viewer)
- [ ] Integrate a real map API (Leaflet.js or Mapbox) to replace the Canvas map
- [ ] WebSocket support for true real-time incident broadcasting
- [ ] Mobile-optimised view for field personnel

---

## Author

**Nabanna Choudhury**
- GitHub: [@nabanna12](https://github.com/nabanna12)
- LinkedIn: [linkedin.com/in/nabanna-choudhury](https://www.linkedin.com/in/nabanna-choudhury)

---

## License

This project is open source and available under the [MIT License](LICENSE).
