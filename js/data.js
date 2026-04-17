// ============================================================
//  AEGIS — Data Store
//  All application data and state management
// ============================================================

const DB = {

  incidents: [
    { id: 'INC-0041', title: 'Coastal Flooding — Eastern District', type: 'Flood', severity: 'critical', status: 'Active', location: 'East Harbor, Zone 4', coordinates: { x: 0.72, y: 0.38 }, team: 'ALPHA-7', casualties: 0, evacuated: 342, progress: 35, time: '2h 14m ago', desc: 'Severe coastal flooding due to storm surge. Multiple residential blocks submerged. Evacuation orders in effect for zones 4A through 4D.', color: '#4fc3f7' },
    { id: 'INC-0040', title: 'Industrial Fire — Sector 9 Warehouse', type: 'Fire', severity: 'critical', status: 'Active', location: 'Industrial Park, Sector 9', coordinates: { x: 0.45, y: 0.55 }, team: 'BRAVO-2', casualties: 3, evacuated: 87, progress: 60, time: '4h 02m ago', desc: 'Large-scale industrial fire at chemical storage facility. Hazmat teams deployed. Exclusion zone established within 500m radius.', color: '#ff6b35' },
    { id: 'INC-0039', title: 'Landslide — Mountain Route N-7', type: 'Landslide', severity: 'high', status: 'Active', location: 'Northern Highway, KM 42', coordinates: { x: 0.3, y: 0.25 }, team: 'DELTA-4', casualties: 1, evacuated: 0, progress: 20, time: '6h 30m ago', desc: 'Major landslide blocking primary mountain route. Search & rescue operations underway. 3 vehicles reported missing.', color: '#795548' },
    { id: 'INC-0038', title: 'Earthquake Aftershocks — Southern Zone', type: 'Earthquake', severity: 'high', status: 'Monitoring', location: 'Southern Zone, Grid 12', coordinates: { x: 0.55, y: 0.75 }, team: 'ECHO-1', casualties: 7, evacuated: 512, progress: 75, time: '14h ago', desc: 'Magnitude 5.8 earthquake. Structural assessment of 47 buildings ongoing. Emergency shelters active.', color: '#ff7043' },
    { id: 'INC-0037', title: 'Gas Pipeline Rupture', type: 'Infrastructure', severity: 'medium', status: 'Contained', location: 'Western Grid, Pipeline B', coordinates: { x: 0.2, y: 0.5 }, team: 'FOXTROT-3', casualties: 0, evacuated: 200, progress: 88, time: '1d 2h ago', desc: 'Natural gas pipeline rupture. Area evacuated. Repair teams on site. Gas flow suspended pending structural check.', color: '#ab47bc' },
    { id: 'INC-0036', title: 'Tropical Storm — Coastal Warning', type: 'Storm', severity: 'medium', status: 'Monitoring', location: 'Coastal Region, All Zones', coordinates: { x: 0.85, y: 0.6 }, team: 'ALPHA-7', casualties: 0, evacuated: 841, progress: 45, time: '8h ago', desc: 'Tropical storm approaching. Category 2. Coastal evacuation advisory issued. Emergency shelters at 72% capacity.', color: '#ba68c8' },
    { id: 'INC-0035', title: 'Mass Casualty Event — Highway 14', type: 'Accident', severity: 'high', status: 'Resolved', location: 'Highway 14, KM 88', coordinates: { x: 0.6, y: 0.35 }, team: 'CHARLIE-5', casualties: 12, evacuated: 0, progress: 100, time: '2d ago', desc: 'Multi-vehicle collision. All casualties transported. Road cleared. Scene investigation complete.', color: '#ff7043' },
    { id: 'INC-0034', title: 'Wildfire — Northern Forest Reserve', type: 'Wildfire', severity: 'low', status: 'Contained', location: 'Forest Reserve, North', coordinates: { x: 0.15, y: 0.15 }, team: 'BRAVO-2', casualties: 0, evacuated: 120, progress: 95, time: '3d ago', desc: 'Wildfire contained after 72-hour operation. 300 hectares affected. Recovery and reforestation planning in progress.', color: '#ff6b35' }
  ],

  teams: [
    { id: 'ALPHA-7', name: 'Alpha Search & Rescue', type: 'Search & Rescue', status: 'deployed', members: ['AR','KS','PM','JD','RT'], location: 'East Harbor', mission: 'INC-0041', vehicles: 3, equipment: ['Boats', 'Drones', 'Med Kit'], rating: 98 },
    { id: 'BRAVO-2', name: 'Bravo Fire Response', type: 'Fire & Hazmat', status: 'deployed', members: ['BF','CL','DS','MK','AJ','PR'], location: 'Industrial Park', mission: 'INC-0040', vehicles: 5, equipment: ['Trucks', 'SCBA', 'Foam'], rating: 95 },
    { id: 'CHARLIE-5', name: 'Charlie Medical Unit', type: 'Medical', status: 'standby', members: ['CN','TS','OW','GL'], location: 'Central Base', mission: null, vehicles: 4, equipment: ['Ambulances', 'Trauma Kit'], rating: 92 },
    { id: 'DELTA-4', name: 'Delta Engineering', type: 'Structural', status: 'deployed', members: ['DA','FB','HM','IL'], location: 'Northern Highway', mission: 'INC-0039', vehicles: 2, equipment: ['Excavators', 'Survey Equipment'], rating: 89 },
    { id: 'ECHO-1', name: 'Echo Evacuation Unit', type: 'Evacuation', status: 'deployed', members: ['EA','BP','SK','NC','DL'], location: 'Southern Zone', mission: 'INC-0038', vehicles: 8, equipment: ['Buses', 'Megaphones', 'First Aid'], rating: 96 },
    { id: 'FOXTROT-3', name: 'Foxtrot Infrastructure', type: 'Infrastructure', status: 'transit', members: ['FO','GR','HR','JL','KN'], location: 'En route → Sector 9', mission: 'INC-0037', vehicles: 3, equipment: ['Pipeline Tools', 'Sensors'], rating: 87 }
  ],

  alerts: [
    { id: 'ALT-0051', severity: 'critical', title: 'TSUNAMI WARNING — Coastal Zone A', desc: 'Seismic activity detected. Potential tsunami threat within 90 minutes. Initiate immediate evacuation of all coastal zones A through F.', time: '08:42', icon: '🌊', zone: 'Coastal East', expires: '2h' },
    { id: 'ALT-0050', severity: 'critical', title: 'FIRE CONTAINMENT BREACH — Sector 9', desc: 'Fire has breached northern perimeter. Wind speed increase to 35 km/h. Expand exclusion zone to 800m. Additional tankers requested.', time: '09:15', icon: '🔥', zone: 'Sector 9', expires: '4h' },
    { id: 'ALT-0049', severity: 'high', title: 'FLASH FLOOD ALERT — River Basin 3', desc: 'River levels rising critically. Projected overflow in 3-4 hours. Activate emergency flood barriers. Alert downstream communities.', time: '07:30', icon: '💧', zone: 'River Basin 3', expires: '6h' },
    { id: 'ALT-0048', severity: 'high', title: 'AFTERSHOCK RISK ELEVATED', desc: 'Seismologists project 70% probability of M5.0+ aftershock within 24h. Maintain evacuation of damaged structures.', time: '06:00', icon: '⚡', zone: 'Southern Zone', expires: '24h' },
    { id: 'ALT-0047', severity: 'medium', title: 'STORM TRAJECTORY UPDATE', desc: 'Tropical storm path adjusted. Now tracking directly at Port District. Upgrade preparations from Category 2 to Category 3 protocols.', time: '05:45', icon: '🌀', zone: 'Coastal Region', expires: '12h' },
    { id: 'ALT-0046', severity: 'medium', title: 'SHELTER CAPACITY WARNING', desc: 'Emergency shelters at 72% capacity. Activate secondary shelter sites at community centers 4, 7, and 11.', time: '04:20', icon: '🏚', zone: 'All Zones', expires: '8h' },
    { id: 'ALT-0045', severity: 'low', title: 'ROAD CLOSURE UPDATE', desc: 'Highway 14 section KM 83-91 closed for accident investigation. Use alternate route via Route 22.', time: '03:10', icon: '🚧', zone: 'Highway 14', expires: '48h' }
  ],

  resources: {
    personnel: [
      { name: 'Emergency Responders', icon: '👨‍🚒', total: 245, available: 187 },
      { name: 'Medical Staff', icon: '🏥', total: 88, available: 72 },
      { name: 'Engineers', icon: '⚙️', total: 34, available: 28 },
      { name: 'Coordinators', icon: '📋', total: 18, available: 16 }
    ],
    vehicles: [
      { name: 'Fire Trucks', icon: '🚒', total: 24, available: 16 },
      { name: 'Ambulances', icon: '🚑', total: 38, available: 29 },
      { name: 'Rescue Boats', icon: '⛵', total: 12, available: 8 },
      { name: 'Helicopters', icon: '🚁', total: 6, available: 4 },
      { name: 'Buses', icon: '🚌', total: 22, available: 14 },
      { name: 'Heavy Machinery', icon: '🚜', total: 8, available: 5 }
    ],
    equipment: [
      { name: 'Drones (Aerial)', icon: '🚁', total: 18, available: 14 },
      { name: 'Communication Kits', icon: '📡', total: 45, available: 40 },
      { name: 'Rescue Gear Sets', icon: '🪝', total: 120, available: 93 },
      { name: 'Power Generators', icon: '⚡', total: 32, available: 25 }
    ],
    supplies: [
      { name: 'Food Packs (days)', icon: '🥫', total: 8500, available: 7200 },
      { name: 'Water (liters)', icon: '💧', total: 45000, available: 38000 },
      { name: 'Medical Kits', icon: '🩺', total: 420, available: 310 },
      { name: 'Shelter Tents', icon: '⛺', total: 680, available: 504 }
    ]
  },

  inventory: [
    { id: 'INV-001', name: 'Oxygen Tanks', category: 'Medical', quantity: 450, threshold: 100, location: 'Warehouse A', status: 'ok', lastRestocked: '2d ago' },
    { id: 'INV-002', name: 'N95 Respirators', category: 'Medical', quantity: 2800, threshold: 500, location: 'Warehouse A', status: 'ok', lastRestocked: '5d ago' },
    { id: 'INV-003', name: 'Defibrillators', category: 'Medical', quantity: 22, threshold: 10, location: 'Medical Bay', status: 'ok', lastRestocked: '1w ago' },
    { id: 'INV-004', name: 'Hydraulic Cutters', category: 'Rescue Equipment', quantity: 8, threshold: 5, location: 'Equipment Bay', status: 'low', lastRestocked: '2w ago' },
    { id: 'INV-005', name: 'Thermal Cameras', category: 'Equipment', quantity: 14, threshold: 8, location: 'Tech Storage', status: 'ok', lastRestocked: '1w ago' },
    { id: 'INV-006', name: 'Emergency Rations', category: 'Supplies', quantity: 7200, threshold: 2000, location: 'Supply Depot', status: 'ok', lastRestocked: '3d ago' },
    { id: 'INV-007', name: 'Hazmat Suits', category: 'Safety', quantity: 45, threshold: 20, location: 'Hazmat Storage', status: 'low', lastRestocked: '3w ago' },
    { id: 'INV-008', name: 'Portable Radios', category: 'Communication', quantity: 5, threshold: 15, location: 'Comm Center', status: 'critical', lastRestocked: '1m ago' },
    { id: 'INV-009', name: 'Water Purifiers', category: 'Supplies', quantity: 38, threshold: 10, location: 'Supply Depot', status: 'ok', lastRestocked: '1w ago' },
    { id: 'INV-010', name: 'Flood Barriers', category: 'Infrastructure', quantity: 120, threshold: 40, location: 'Yard B', status: 'ok', lastRestocked: '4d ago' },
    { id: 'INV-011', name: 'Rope Sets (50m)', category: 'Rescue Equipment', quantity: 28, threshold: 15, location: 'Equipment Bay', status: 'ok', lastRestocked: '2w ago' },
    { id: 'INV-012', name: 'Chainsaw Units', category: 'Equipment', quantity: 7, threshold: 8, location: 'Equipment Bay', status: 'critical', lastRestocked: '1m ago' }
  ],

  weather: [
    { location: 'East Harbor', icon: '🌊', temp: '28°C', condition: 'Storm Surge', risk: 'danger' },
    { location: 'City Center', icon: '⛈️', temp: '24°C', condition: 'Thunderstorm', risk: 'warning' },
    { location: 'Northern Hills', icon: '🌧️', temp: '19°C', condition: 'Heavy Rain', risk: 'warning' },
    { location: 'Industrial Zone', icon: '💨', temp: '31°C', condition: 'High Winds', risk: 'danger' }
  ],

  liveFeedMessages: [
    { type: 'critical', text: 'ALPHA-7 requesting additional boats at East Harbor coordinates 40.7N' },
    { type: 'warning', text: 'Fire perimeter expanded — wind direction shifted NNE at Sector 9' },
    { type: 'info', text: 'DELTA-4 confirmed safe access to northern highway KM 42' },
    { type: 'success', text: '142 civilians evacuated from Zone 4B successfully' },
    { type: 'warning', text: 'Storm approaching — downgraded to Category 2, still dangerous' },
    { type: 'info', text: 'Medical supply convoy en route from Central Depot to East Harbor' },
    { type: 'critical', text: 'Gas leak detected — additional exclusion zone established' },
    { type: 'success', text: 'Rescue team located 3 missing persons at landslide site' },
    { type: 'info', text: 'Seismic monitoring station 7 reported M2.1 aftershock at 09:37' },
    { type: 'warning', text: 'Shelter capacity at 72% — requesting additional facilities' },
    { type: 'success', text: 'Power restored to Southern Grid emergency services' },
    { type: 'info', text: 'Air reconnaissance completed for Northern Forest sector' }
  ]
};
