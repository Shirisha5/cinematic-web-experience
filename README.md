# Cinematic 3D Journey — Guns N' Roses Experience

> An immersive, 4-act interactive WebGL narrative built with React 19, Three.js, React Three Fiber, and GSAP ScrollTrigger.

[![React](https://img.shields.io/badge/React-19.x-61dafb?style=flat-square&logo=react)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-0.184-black?style=flat-square&logo=three.js)](https://threejs.org/)
[![React Three Fiber](https://img.shields.io/badge/R3F-9.x-orange?style=flat-square)](https://docs.pmnd.rs/react-three-fiber)
[![GSAP](https://img.shields.io/badge/GSAP-3.15-88ce02?style=flat-square&logo=greensock)](https://greensock.com/)
[![Rsbuild](https://img.shields.io/badge/Rsbuild-2.x-07c160?style=flat-square)](https://rsbuild.rs/)
[![License: Non-Commercial](https://img.shields.io/badge/License-Non--Commercial-red.svg?style=flat-square)](LICENSE)

---

## 🎬 Overview

Inspired by the visual and musical aesthetic of _Guns N' Roses_, this creative front-end experience orchestrates real-time 3D environments, custom procedural textures, physics-based weather particles, and cinematic camera choreography driven entirely by scroll input.

### 🌐 Live Demo & Preview

- **Live Demo**: [https://cinematic-web-experience.vercel.app/]
## 🌌 Narrative Acts

| Act    | Scene             | Visual Theme & Key Mechanics                                                                                             |
| :----- | :---------------- | :----------------------------------------------------------------------------------------------------------------------- |
| **01** | **Golden Hour**   | Desert horizon, muscle car silhouette, character silhouette, and golden sun flare.                                       |
| **02** | **Blue Hour**     | Deep-space transition, floating asteroid field (`THREE.Instances`), and ascending blue moon.                             |
| **03** | **Crimson Dawn**  | 90° zenith worm's-eye camera tilt, 4 architectural skyscraper monoliths, tactical silhouettes, and blood-red sun.        |
| **04** | **Obsidian Rain** | Dramatic street-canyon rooftop perspective, multi-stop solar gradient disc, and continuous asynchronous 3D rain streaks. |

---

## 🛠️ Key Techniques & Technical Architecture

### 1. Multi-Act ScrollTrigger Orchestration

A continuous GSAP ScrollTrigger timeline coordinates smooth cross-fading of DOM typography, HDR rim lighting, sky background interpolation, and 3D camera transitions without frame drops or layout thrashing.

### 2. Zenith Worm's-Eye Camera Transformation

Smooth matrix and FOV interpolation tilts the camera from a horizontal landscape view straight up into a 90° upward-looking zenith perspective with continuous mouse-parallax damping.

### 3. Procedural Canvas Texture Generation

Architectural building facades, window mullion grids, and multi-stop solar flare gradients are procedurally generated onto offscreen 2D canvases and mapped to `THREE.CanvasTexture` instances with automatic GPU memory disposal on unmount.

### 4. Asynchronous 3D Particle Rain Physics

Falling rain is generated using `THREE.LineSegments` with individualized velocity arrays and continuous height recycling, creating steady, organic rainfall without burst waves or frame stutter.

### 5. Dual-Engine Hybrid Preloader

Tracks both initial HTML/JS DOM bundle readiness (`0% -> 50%`) and 3D WebGL asset decoding (`50% -> 100%`) via `@react-three/drei`'s `useProgress`, complete with fail-safe fallback triggers.

---

## 🎨 3D Asset Credits & Attribution

The 3D models used in this personal portfolio demonstration are licensed under [Creative Commons Attribution 4.0 International (CC-BY 4.0)](https://creativecommons.org/licenses/by/4.0/):

| Asset                            | Model Title                            | Creator / Author                                     | Source Link                                                                                                          | License                                                   |
| :------------------------------- | :------------------------------------- | :--------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------- |
| **Car Model** (`car.glb`)        | _Ford Mustang - 1970 - 3000 Tri Limit_ | [mmorton1](https://sketchfab.com/mmorton1)           | [Sketchfab Model](https://sketchfab.com/3d-models/ford-mustang-1970-3000-tri-limit-21bfb94d9bbc4acab5dfd9f70d5bfd26) | [CC-BY 4.0](https://creativecommons.org/licenses/by/4.0/) |
| **Character Model** (`name.glb`) | _Business Man Standing_                | [suasanakreasi](https://sketchfab.com/suasanakreasi) | [Sketchfab Model](https://sketchfab.com/3d-models/business-man-standing-d9ed9bb7baff4e03af19e439af1dd4d7)            | [CC-BY 4.0](https://creativecommons.org/licenses/by/4.0/) |

> _Note: These assets are included strictly for personal study, educational, and non-commercial demonstration purposes. All rights remain with the original 3D artists._

---

## 🚀 Local Development Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or higher recommended)
- `npm` or `pnpm` / `yarn`

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/guns-and-roses-cinematic.git

# 2. Navigate into the project folder
cd guns-and-roses-cinematic

# 3. Install dependencies
npm install

# 4. Start the local development server
npm run dev
```

The app will run locally at `http://localhost:3000`.

### Production Build

```bash
# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 📂 Project Structure

```
├── public/                  # Static models (GLB), textures, and icons
├── src/
│   ├── App.jsx              # Main React application layout & UI overlay
│   ├── App.css              # Typography, layout, and responsive styles
│   ├── Scene.jsx            # R3F Canvas, lighting, camera choreography, and ScrollTrigger
│   ├── OGCityScene.jsx      # Act 3: 4 Skyscraper monoliths & Zenith red sun
│   ├── JumpingRooftopScene.jsx # Act 4: Rooftop towers, solar gradient, & rain particles
│   ├── PreLoader.jsx        # Dual-engine progress tracker
│   ├── PreLoader.css        # Preloader aesthetic styles
│   └── index.jsx            # React root entry point
├── rsbuild.config.js        # Rsbuild configuration
└── package.json             # Dependencies & scripts
```

---

## 📄 License

This repository and its source code are provided for **Educational, Personal, and Non-Commercial Portfolio Demonstration Purposes Only**.

Third-party 3D models are copyrighted by their respective authors on Sketchfab and licensed under [CC-BY 4.0](https://creativecommons.org/licenses/by/4.0/). See [LICENSE](LICENSE) for full details.
