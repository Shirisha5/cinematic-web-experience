import React, { useMemo, useRef, useEffect } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

// Solar flame canvas gradient texture synthesis
function createFierySunTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d");

  const cx = 512;
  const cy = 512;
  const radius = 510;

  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.clip();

  // Multi-stop radial gradient: golden core -> rich fiery amber -> deep crimson rim
  const grad = ctx.createRadialGradient(cx - 30, cy - 50, 40, cx, cy, radius);
  grad.addColorStop(0.0, "#ffb82e");
  grad.addColorStop(0.25, "#f77f00");
  grad.addColorStop(0.6, "#d62828");
  grad.addColorStop(0.88, "#ba181b");
  grad.addColorStop(1.0, "#7a0e10");

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Turbulent solar flare streaks across surface
  ctx.globalAlpha = 0.22;
  for (let i = 0; i < 35; i++) {
    const y = Math.random() * canvas.height;
    const x = Math.random() * canvas.width;
    const w = 120 + Math.random() * 260;
    const h = 15 + Math.random() * 45;

    const streakGrad = ctx.createLinearGradient(x, y, x + w, y + h);
    streakGrad.addColorStop(0, "rgba(255, 200, 60, 0)");
    streakGrad.addColorStop(0.5, "rgba(255, 160, 30, 0.7)");
    streakGrad.addColorStop(1, "rgba(180, 30, 0, 0)");

    ctx.fillStyle = streakGrad;
    ctx.beginPath();
    ctx.ellipse(x, y, w / 2, h / 2, -Math.PI / 5, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// Architectural skyscraper facade grid texture synthesis
function createBuildingGridTexture(baseColor, frameColor, winColor) {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 2048;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const cols = 12;
  const rows = 32;
  const padX = 14;
  const padY = 16;
  const winW = (canvas.width - padX * (cols + 1)) / cols;
  const winH = (canvas.height - padY * (rows + 1)) / rows;

  for (let r = 0; r < rows; r++) {
    ctx.fillStyle = frameColor;
    ctx.fillRect(0, r * (winH + padY), canvas.width, padY);

    for (let c = 0; c < cols; c++) {
      const x = padX + c * (winW + padX);
      const y = padY + r * (winH + padY);

      const isLit = Math.random() > 0.45;
      ctx.fillStyle = isLit ? winColor : "#04070d";
      ctx.fillRect(x, y, winW, winH);

      ctx.strokeStyle = frameColor;
      ctx.lineWidth = 3;
      ctx.strokeRect(x + 2, y + 2, winW - 4, winH - 4);
    }
  }

  ctx.fillStyle = frameColor;
  for (let c = 0; c <= cols; c++) {
    const x = c * (winW + padX);
    ctx.fillRect(x, 0, padX, canvas.height);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.needsUpdate = true;
  return texture;
}

// Asynchronous 3D rain particle system with continuous height recycling
function FallingRain({ count = 1200 }) {
  const { rainGeo, speeds, lengths } = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 6);
    const spd = new Float32Array(count);
    const len = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 45;
      const y = Math.random() * 45 - 8;
      const z = (Math.random() - 0.5) * 26;

      const streakLength = 0.75 + Math.random() * 0.7;
      const slantX = 0.12;

      spd[i] = 28 + Math.random() * 18;
      len[i] = streakLength;

      positions[i * 6] = x;
      positions[i * 6 + 1] = y;
      positions[i * 6 + 2] = z;

      positions[i * 6 + 3] = x + slantX * streakLength;
      positions[i * 6 + 4] = y - streakLength;
      positions[i * 6 + 5] = z;
    }

    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return { rainGeo: geo, speeds: spd, lengths: len };
  }, [count]);

  const linesRef = useRef();

  useEffect(() => {
    return () => {
      rainGeo.dispose();
    };
  }, [rainGeo]);

  useFrame((_, delta) => {
    if (!linesRef.current) return;
    const dt = Math.min(delta, 0.05);
    const pos = linesRef.current.geometry.attributes.position;
    const array = pos.array;

    for (let i = 0; i < count; i++) {
      const fall = speeds[i] * dt;
      const slant = fall * 0.12;

      array[i * 6] += slant;
      array[i * 6 + 1] -= fall;

      array[i * 6 + 3] += slant;
      array[i * 6 + 4] -= fall;

      if (array[i * 6 + 1] < -8) {
        const resetX = (Math.random() - 0.5) * 45;
        const resetY = 35 + Math.random() * 8;
        const streakLength = lengths[i];

        array[i * 6] = resetX;
        array[i * 6 + 1] = resetY;
        array[i * 6 + 3] = resetX + 0.12 * streakLength;
        array[i * 6 + 4] = resetY - streakLength;
      }
    }
    pos.needsUpdate = true;
  });

  return (
    <lineSegments ref={linesRef} geometry={rainGeo}>
      <lineBasicMaterial
        color="#93c5fd"
        transparent
        opacity={0.4}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </lineSegments>
  );
}

// Left Tower (Deep Blue/Steel architectural skyscraper covering the left flank)
function LeftTower({ texture, isMobile }) {
  const steelMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#1e3a5f",
        roughness: 0.8,
        metalness: 0.1,
      }),
    [],
  );

  return (
    <group
      position={isMobile ? [-10.2, -8, 2] : [-12, -8, 2]}
      rotation={[0.05, 0.15, 0.04]}
    >
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[14, 38, 14]} />
        <meshStandardMaterial
          map={texture}
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>

      <mesh material={steelMat} position={[0, 19.2, 0]}>
        <boxGeometry args={[14.4, 1.2, 14.4]} />
      </mesh>

      <mesh material={steelMat} position={[6.0, 20.2, 0]}>
        <boxGeometry args={[0.4, 1.8, 14.2]} />
      </mesh>

      <mesh material={steelMat} position={[-2.5, 21.5, -2]}>
        <cylinderGeometry args={[2.0, 2.0, 4, 16]} />
      </mesh>
      <mesh material={steelMat} position={[1.5, 23.5, 2]}>
        <cylinderGeometry args={[0.08, 0.25, 7, 12]} />
      </mesh>
    </group>
  );
}

// Right Tower (Crimson Red architectural skyscraper covering the right flank)
function RightTower({ texture, isMobile }) {
  const redSteelMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#d91e18",
        roughness: 0.8,
        metalness: 0.1,
      }),
    [],
  );

  return (
    <group
      position={isMobile ? [10.2, -8, 2] : [12, -8, 2]}
      rotation={[0.05, -0.15, -0.04]}
    >
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[14, 38, 14]} />
        <meshStandardMaterial
          map={texture}
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>

      <mesh material={redSteelMat} position={[0, 19.2, 0]}>
        <boxGeometry args={[14.4, 1.2, 14.4]} />
      </mesh>

      <mesh material={redSteelMat} position={[-6.0, 20.2, 0]}>
        <boxGeometry args={[0.4, 1.8, 14.2]} />
      </mesh>

      <mesh material={redSteelMat} position={[2.5, 21.5, -2]}>
        <boxGeometry args={[4.5, 3.5, 5.0]} />
      </mesh>
      <mesh material={redSteelMat} position={[-1.5, 23.5, 2]}>
        <cylinderGeometry args={[0.08, 0.25, 7, 12]} />
      </mesh>
    </group>
  );
}

function FierySun({ texture, isMobile }) {
  return (
    <group position={[0, isMobile ? 24.0 : 21.0, -16]}>
      <mesh rotation={[0, 0, 0]} renderOrder={-1}>
        <circleGeometry args={[isMobile ? 12.0 : 15.0, 64]} />
        <meshBasicMaterial
          map={texture}
          toneMapped={true}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

export default function JumpingRooftopScene({ isMobile }) {
  const leftTexture = useMemo(
    () => createBuildingGridTexture("#0b192c", "#1e3a5f", "#38bdf8"),
    [],
  );
  const rightTexture = useMemo(
    () => createBuildingGridTexture("#1a0608", "#c92a2a", "#ff4d4f"),
    [],
  );
  const fieryTexture = useMemo(() => createFierySunTexture(), []);

  const groupRef = useRef();

  useEffect(() => {
    return () => {
      leftTexture.dispose();
      rightTexture.dispose();
      fieryTexture.dispose();
    };
  }, [leftTexture, rightTexture, fieryTexture]);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      const t = clock.getElapsedTime();
      groupRef.current.position.y = Math.sin(t * 0.8) * 0.05;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <FallingRain count={isMobile ? 600 : 1200} />

      <FierySun texture={fieryTexture} isMobile={isMobile} />

      <LeftTower texture={leftTexture} isMobile={isMobile} />
      <RightTower texture={rightTexture} isMobile={isMobile} />

      <ambientLight intensity={0.5} color="#475569" />
    </group>
  );
}
