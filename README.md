# GridNode OS — HPC Microgrid Digital Twin

A real-time industrial monitoring and control dashboard for liquid-cooled GPU clusters integrated with a microgrid energy management system. Built as an interactive digital twin demo for hackathons and maker competitions.

## Overview

GridNode OS simulates a complete HPC data center site: GPU compute containers, liquid cooling infrastructure, electrical microgrid, and EV charging stations. All subsystems are linked through a shared physics engine — actions in one system ripple through to others in real time.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + TypeScript |
| Build | Vite 7 |
| 3D Rendering | Three.js via `@react-three/fiber` + `@react-three/drei` + `@react-three/postprocessing` |
| Charts | ECharts 6 (waveform oscilloscope) |
| Styling | Tailwind CSS 3 + inline industrial dark theme |
| UI Primitives | shadcn/ui (Radix) |
| Physics Engine | Custom ODE-based thermal/electrical simulation at 10 Hz |

## Pages

### SITE 3D — Facility Overview

Full-viewport isometric 3D scene of the HPC data center site. Renders 6 equipment groups on a concrete pad:

- **Compute Container** — GPU server racks (heat source)
- **Transformer Unit** — MV/LV power distribution with cooling fins
- **Cooling Tower** — Evaporative heat rejection with fan grilles
- **Charging Piles** ×4 — DC fast chargers for EVs
- **Power Cabinet** — Switchgear and distribution
- **Control Cabinet** — Instrumentation and SCADA interface

Supports three camera views (ISO / TOP / FRONT) with smooth animated transitions. Includes an equipment list panel, dimension annotations, and a live status bar.

### P&ID — Process & Instrumentation Diagram

Left panel (60%): SVG-based piping diagram of the liquid cooling loop showing pumps, heat exchangers, valves, sensors, and expansion tank. Click any valve to open a control panel and adjust flow. Click equipment to view detailed specs.

Right panel (40%): Real-time 3D fluid tunnel visualization with two intertwining particle streams (blue = cold supply, orange = hot return), bloom post-processing, and CRT scanline overlay.

### MICROGRID — Grid Control & Power Escape

Left panel (48%): Single-line electrical diagram showing transformer, busbar, breakers, and 4 load pods. Power flow dynamically visualized.

Right panel (52%): Three-channel real-time oscilloscope waveform display — grid load current (CH1), NVMe storage write speed (CH2), and PCIe 5.0 data throughput (CH3).

**Compute-Power Escape**: When grid frequency drops below threshold, the system executes an automatic load-shedding sequence. Low-priority GPU tasks are paused within 200ms, medium-priority within 400ms, and critical data is backed up within 1230ms — all visualized in real time on the waveform overlay.

### GPU CLUSTER — Liquid Cooling Management

42U rack cabinet SVG visualization with 5 compute nodes (8 GPUs each = 40 GPUs total). Each GPU shows real-time temperature, status color (blue=OK, yellow=HIGH, red=FAULT), and liquid cooling connections to supply/return manifolds. The bottom 6U houses CDU/pump/power equipment.

Left panel: Cooling system controls, PUE display, and escape triggers.
Right panel: Telemetry table with per-GPU temperature, power, utilization, and task priority.

## Physics Engine

A shared 10 Hz simulation loop drives all four pages from a single source of truth via React Context. The engine models:

- **GPU Thermal ODE**: `dT/dt = (P_IT - k_cool · flow · (T_gpu - T_supply)) / C_th` for each of 40 GPUs
- **Cooling Heat Balance**: Pump power ∝ flow³ (affinity law), chiller power = Q_removed / COP, heat pickup across the cold plate loop
- **Microgrid Swing Equation**: `df/dt = (P_gen - P_load) / (2H) · f_nominal`, DC bus voltage droop, reactive power tracking
- **EV Charging Poisson Process**: Time-varying arrival rate λ(hour) with day/night cycle (0.3–2.5 arrivals/hour/pile), 60–120 kW per session, 15–45 minute duration, 4-pile queue

### Cross-Page Data Flow

```
GPU Power → Heat Load → Cooling System → Pump + Chiller Power
                                              ↓
EV Charging Load ──────────────────→ Microgrid Total Load
                                              ↓
                                    Grid Frequency Deviation
                                              ↓
                                    Load Shedding / Escape
```

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app runs entirely in the browser — no backend, no API keys required.

## Project Structure

```
src/
├── App.tsx                          # Root: page switcher + nav bar
├── AppPnID.tsx                      # P&ID page
├── main.tsx                         # Entry point
├── index.css                        # Global styles + CSS variables
├── engine/                          # Shared physics simulation
│   ├── types.ts                     # All type definitions
│   ├── physicsEngine.ts             # ODE models + master tick
│   └── SimulationContext.tsx         # React Context provider + hook
├── components/
│   ├── TopBar.tsx                    # System metrics bar
│   ├── Fluid3DViewport.tsx           # 3D fluid tunnel (P&ID right panel)
│   ├── PnIDDiagram.tsx              # SVG P&ID diagram
│   ├── DeviceDetailOverlay.tsx       # Equipment detail modal
│   ├── ValveControlPanel.tsx        # Valve control popup
│   └── ui/                          # shadcn/ui components
├── pages/
│   ├── SiteIsometric/               # SITE 3D page
│   │   ├── index.tsx                # Page layout
│   │   ├── Scene.tsx                # Three.js scene + camera
│   │   ├── Toolbar.tsx              # View mode switcher
│   │   ├── EquipmentPanel.tsx        # Right-side equipment list
│   │   ├── EquipmentDetail.tsx       # Device detail overlay
│   │   └── EquipmentModels/         # 6 equipment 3D models
│   ├── MicrogridControl/            # MICROGRID page
│   │   ├── index.tsx                # Page layout
│   │   ├── SingleLineDiagram.tsx     # Electrical single-line SVG
│   │   ├── WaveformPanel.tsx         # ECharts oscilloscope
│   │   └── ConfirmDialog.tsx         # Escape confirmation modal
│   └── GPUCluster/                  # GPU page
│       ├── index.tsx                # Page layout
│       ├── CabinetView.tsx           # 42U rack SVG + GPU slots
│       ├── LeftPanel.tsx             # Cooling controls panel
│       ├── TelemetryTable.tsx        # Per-GPU data table
│       └── GPUDetail.tsx             # GPU detail overlay
├── three/
│   ├── Scene.tsx                     # Fluid tunnel scene
│   └── FluidTunnel.tsx              # Particle system + tube geometry
├── hooks/
│   └── use-mobile.ts                # Responsive breakpoint hook
├── types/
│   └── pnid.ts                      # P&ID domain types
└── lib/
    └── utils.ts                      # cn() utility
```

## Design Language

- **Dark industrial theme**: `#0a0a0a` background, `#1a1a2e` borders
- **CRT/console aesthetic**: Consolas monospace throughout, scanline overlays, corner brackets
- **Status color coding**: Blue (`#00aaff`) = normal/info, Green (`#00ff66`) = healthy/running, Yellow (`#ffcc00`) = warning/high, Red (`#ff3333`) = alarm/fault
- **Glow effects**: Box-shadow halos on status indicators, bloom post-processing on 3D tunnels

## Competition Context

This project is designed for hackathons and the US-China Maker Competition. Key demo talking points:

1. **Digital Twin**: Real-time virtual representation of physical infrastructure with bidirectional data flow
2. **Multi-Domain Physics**: Thermal, electrical, and fluid systems modeled in a unified simulation
3. **Compute-Power Co-optimization**: Novel "power escape" mechanism that coordinates GPU workload shedding with grid frequency stabilization
4. **EV Integration**: Renewable-aware charging load management with time-of-day demand patterns
5. **Industrial UI/UX**: SCADA-inspired interface built with modern web technologies (WebGL, real-time charts)
