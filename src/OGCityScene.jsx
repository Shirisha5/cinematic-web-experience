import React, { useMemo, useRef, useEffect } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

// Procedural high-clarity architectural night window texture synthesis
function createSkyscraperTexture(colorVariant = "mixed") {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 2048;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#04060b";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const cols = 18;
  const rows = 48;
  const padX = 7;
  const padY = 8;
  const winW = (canvas.width - padX * (cols + 1)) / cols;
  const winH = (canvas.height - padY * (rows + 1)) / rows;

  const warmColors = ["#e6b567", "#cca052", "#d98d36", "#e8c58b"];
  const coolColors = ["#68a6cc", "#4f8eb3", "#82bad9"];
  const redAccents = ["#cc1d2c", "#b31422", "#e63946"];

  for (let r = 0; r < rows; r++) {
    if (r % 3 === 0) {
      ctx.fillStyle = "#020306";
      ctx.fillRect(0, r * (winH + padY), canvas.width, padY * 2.0);
    }

    const isDarkFloor = r % 12 === 0;

    for (let c = 0; c < cols; c++) {
      const x = padX + c * (winW + padX);
      const y = padY + r * (winH + padY);

      if (isDarkFloor) {
        ctx.fillStyle = "#030408";
        ctx.fillRect(x, y, winW, winH);
        continue;
      }

      const isLit = Math.random() > 0.62;

      if (isLit) {
        let col;
        const rand = Math.random();
        if (colorVariant === "red" && rand < 0.35) {
          col = redAccents[Math.floor(Math.random() * redAccents.length)];
        } else if (rand > 0.45) {
          col = warmColors[Math.floor(Math.random() * warmColors.length)];
        } else {
          col = coolColors[Math.floor(Math.random() * coolColors.length)];
        }

        ctx.fillStyle = col;
        ctx.fillRect(x, y, winW, winH);
      } else {
        ctx.fillStyle = Math.random() > 0.5 ? "#070b14" : "#03060c";
        ctx.fillRect(x, y, winW, winH);
      }
    }
  }

  // Structural vertical mullions
  ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
  for (let c = 0; c < cols; c += 2) {
    const x = padX + c * (winW + padX) - 2;
    ctx.fillRect(x, 0, 4, canvas.height);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.needsUpdate = true;
  return texture;
}

// Tactical Rifle silhouette pointing upward in diagonal sky gaps
function TacticalRifle({ position, rotation, scale = 1 }) {
  const darkMetal = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#050608",
        roughness: 0.25,
        metalness: 0.95,
      }),
    [],
  );

  const barrelMetal = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#0a0c10",
        roughness: 0.15,
        metalness: 0.98,
      }),
    [],
  );

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh material={barrelMetal} position={[0, 5.0, 0]}>
        <cylinderGeometry args={[0.08, 0.1, 10, 16]} />
      </mesh>

      <mesh material={darkMetal} position={[0, 10.3, 0]}>
        <cylinderGeometry args={[0.13, 0.11, 0.8, 16]} />
      </mesh>

      <group position={[0, 9.4, 0.16]}>
        <mesh material={darkMetal}>
          <boxGeometry args={[0.06, 0.5, 0.14]} />
        </mesh>
        <mesh material={darkMetal} position={[0, 0.22, 0]}>
          <torusGeometry args={[0.13, 0.03, 8, 16]} />
        </mesh>
      </group>

      <mesh material={darkMetal} position={[0, 3.5, 0]}>
        <cylinderGeometry args={[0.2, 0.22, 5.0, 16]} />
      </mesh>
      <mesh material={darkMetal} position={[0, 3.8, 0.24]}>
        <boxGeometry args={[0.14, 4.4, 0.12]} />
      </mesh>

      <mesh material={darkMetal} position={[0, 0.4, -0.08]}>
        <boxGeometry args={[0.3, 2.6, 0.7]} />
      </mesh>

      <mesh
        material={darkMetal}
        position={[0, -0.8, 0.45]}
        rotation={[0.38, 0, 0]}
      >
        <boxGeometry args={[0.22, 2.2, 0.6]} />
      </mesh>

      <mesh
        material={darkMetal}
        position={[0, -1.0, -0.48]}
        rotation={[-0.48, 0, 0]}
      >
        <boxGeometry args={[0.22, 1.4, 0.42]} />
      </mesh>

      <mesh material={darkMetal} position={[0, -2.8, -0.1]}>
        <boxGeometry args={[0.26, 2.8, 0.55]} />
      </mesh>
    </group>
  );
}

// Tower 1 (East / Right Skyscraper Monolith)
function EastSkyscraper({ texture }) {
  return (
    <group position={[17.5, 0, 0]} rotation={[0, 0, 0.38]}>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[6.0, 48, 6.8]} />
        <meshStandardMaterial
          map={texture}
          roughness={0.45}
          metalness={0.7}
          emissive="#665038"
          emissiveMap={texture}
          emissiveIntensity={0.2}
        />
      </mesh>
      <mesh position={[0, 25, 0]}>
        <boxGeometry args={[4.2, 4, 4.8]} />
        <meshStandardMaterial
          map={texture}
          roughness={0.45}
          metalness={0.7}
          emissive="#665038"
          emissiveMap={texture}
          emissiveIntensity={0.22}
        />
      </mesh>
      <mesh position={[0, 28.5, 0]}>
        <cylinderGeometry args={[0.08, 0.25, 4.5, 12]} />
        <meshBasicMaterial color="#cc1122" />
      </mesh>
    </group>
  );
}

// Tower 2 (South / Bottom Skyscraper Monolith)
function SouthSkyscraper({ texture, redTexture }) {
  return (
    <group position={[0, 0, -17.5]} rotation={[0.38, 0, 0]}>
      <mesh position={[0, -2, 0]}>
        <boxGeometry args={[6.6, 46, 6.6]} />
        <meshStandardMaterial
          map={redTexture}
          roughness={0.45}
          metalness={0.7}
          emissive="#663333"
          emissiveMap={redTexture}
          emissiveIntensity={0.2}
        />
      </mesh>
      <mesh position={[0, 22, 0]}>
        <boxGeometry args={[4.6, 5, 4.6]} />
        <meshStandardMaterial
          map={texture}
          roughness={0.45}
          metalness={0.75}
          emissive="#665038"
          emissiveMap={texture}
          emissiveIntensity={0.22}
        />
      </mesh>
      <mesh position={[0, 26, 0]}>
        <boxGeometry args={[3.2, 3.5, 3.2]} />
        <meshStandardMaterial
          map={texture}
          roughness={0.4}
          metalness={0.8}
          emissive="#772228"
          emissiveMap={texture}
          emissiveIntensity={0.24}
        />
      </mesh>
      <mesh position={[0, 29, 0]}>
        <cylinderGeometry args={[0.08, 0.22, 4.5, 12]} />
        <meshStandardMaterial color="#64748b" metalness={0.95} roughness={0.2} />
      </mesh>
      <mesh position={[0, 31.5, 0]}>
        <sphereGeometry args={[0.18, 12, 12]} />
        <meshBasicMaterial color="#ff0022" toneMapped={false} />
      </mesh>
    </group>
  );
}

// Tower 3 (West / Left Skyscraper Monolith)
function WestSkyscraper({ texture }) {
  return (
    <group position={[-17.5, 0, 0]} rotation={[0, 0, -0.38]}>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[6.4, 48, 6.8]} />
        <meshStandardMaterial
          map={texture}
          roughness={0.45}
          metalness={0.7}
          emissive="#665038"
          emissiveMap={texture}
          emissiveIntensity={0.2}
        />
      </mesh>
      <mesh position={[2.2, -2, 0]}>
        <boxGeometry args={[2.8, 34, 5.8]} />
        <meshStandardMaterial
          map={texture}
          roughness={0.45}
          metalness={0.7}
          emissive="#665038"
          emissiveMap={texture}
          emissiveIntensity={0.18}
        />
      </mesh>
      <mesh position={[0, 25, 0]}>
        <boxGeometry args={[4.4, 3.8, 4.6]} />
        <meshStandardMaterial
          map={texture}
          roughness={0.4}
          metalness={0.8}
          emissive="#772228"
          emissiveMap={texture}
          emissiveIntensity={0.22}
        />
      </mesh>
      <mesh position={[0, 28.5, 0]}>
        <cylinderGeometry args={[0.08, 0.25, 4.5, 12]} />
        <meshBasicMaterial color="#cc1122" />
      </mesh>
    </group>
  );
}

// Tower 4 (North / Top Skyscraper Monolith)
function NorthSkyscraper({ texture }) {
  return (
    <group position={[0, 0, 17.5]} rotation={[-0.38, 0, 0]}>
      <mesh position={[0, -2, 0]}>
        <boxGeometry args={[6.2, 46, 6.2]} />
        <meshStandardMaterial
          map={texture}
          roughness={0.45}
          metalness={0.7}
          emissive="#665038"
          emissiveMap={texture}
          emissiveIntensity={0.2}
        />
      </mesh>
      <mesh position={[0, 22, 0]}>
        <boxGeometry args={[4.4, 4.5, 4.2]} />
        <meshStandardMaterial
          map={texture}
          roughness={0.45}
          metalness={0.7}
          emissive="#665038"
          emissiveMap={texture}
          emissiveIntensity={0.22}
        />
      </mesh>
      <mesh position={[0, 26, 0]}>
        <cylinderGeometry args={[0.08, 0.3, 4.5, 12]} />
        <meshStandardMaterial color="#64748b" metalness={0.9} roughness={0.25} />
      </mesh>
      <mesh position={[0, 28.5, 0]}>
        <sphereGeometry args={[0.18, 12, 12]} />
        <meshBasicMaterial color="#ff0022" toneMapped={false} />
      </mesh>
    </group>
  );
}

// Single-Layer Blood-Red Sun in Zenith Sky background (y = 48)
function ZenithRedSun({ isMobile }) {
  return (
    <group position={[0, 48, 0]}>
      <mesh rotation={[Math.PI / 2, 0, 0]} renderOrder={-1}>
        <circleGeometry args={[isMobile ? 18.0 : 24.0, 64]} />
        <meshBasicMaterial
          color="#d6111e"
          toneMapped={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      <pointLight
        color="#ff1122"
        intensity={isMobile ? 120 : 200}
        distance={120}
        decay={1.2}
      />
    </group>
  );
}

export default function OGCityScene({ isMobile }) {
  const texture = useMemo(() => createSkyscraperTexture("mixed"), []);
  const redTexture = useMemo(() => createSkyscraperTexture("red"), []);
  const groupRef = useRef();

  // Clean texture disposal on unmount to prevent GPU memory leaks
  useEffect(() => {
    return () => {
      texture.dispose();
      redTexture.dispose();
    };
  }, [texture, redTexture]);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      const t = clock.getElapsedTime();
      groupRef.current.rotation.y = Math.sin(t * 0.15) * 0.025;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <ZenithRedSun isMobile={isMobile} />

      <EastSkyscraper texture={texture} />
      <SouthSkyscraper texture={texture} redTexture={redTexture} />
      <WestSkyscraper texture={texture} />
      <NorthSkyscraper texture={texture} />

      <TacticalRifle
        position={[9.5, -4.5, -9.0]}
        rotation={[0.38, 0.52, -0.35]}
        scale={1.25}
      />
      <TacticalRifle
        position={[-9.5, -4.5, -9.0]}
        rotation={[0.38, -0.52, 0.35]}
        scale={1.2}
      />
      <TacticalRifle
        position={[9.0, -3.8, 8.8]}
        rotation={[-0.38, 0.5, -0.28]}
        scale={1.15}
      />
      <TacticalRifle
        position={[-9.0, -3.8, 8.8]}
        rotation={[-0.38, -0.5, 0.28]}
        scale={1.15}
      />

      <ambientLight intensity={0.12} color="#152b52" />
      <directionalLight
        position={[0, 25, 0]}
        intensity={1.5}
        color="#ff2233"
      />
      <directionalLight
        position={[0, -10, 0]}
        intensity={0.4}
        color="#1d4ed8"
      />
    </group>
  );
}
