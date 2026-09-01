import React, { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useGLTF, useTexture, Instances, Instance } from "@react-three/drei";
import OGCityScene from "./OGCityScene";
import JumpingRooftopScene from "./JumpingRooftopScene";

gsap.registerPlugin(ScrollTrigger);

function useMobileDetection() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
}

function CinematicSun({ sunRef, isMobile }) {
  const coreMatRef = useRef();
  const glowMatRef = useRef();

  useEffect(() => {
    if (coreMatRef.current && glowMatRef.current) {
      coreMatRef.current.color.set("#ffb700").convertSRGBToLinear();
      glowMatRef.current.color
        .set("#ff8c00")
        .convertSRGBToLinear()
        .multiplyScalar(3.5);
    }
  }, []);

  return (
    <group
      ref={sunRef}
      position={isMobile ? [0, -1, -50] : [-1, -2, -50]}
      scale={isMobile ? 0.55 : 1}
    >
      <pointLight
        color="#ff9d00"
        intensity={isMobile ? 8 : 15}
        distance={40}
        decay={1.5}
      />
      <mesh>
        <sphereGeometry args={[4, 32, 32]} />
        <meshBasicMaterial ref={coreMatRef} toneMapped={false} />
      </mesh>
      <mesh scale={6.25}>
        <sphereGeometry args={[4, 32, 32]} />
        <meshBasicMaterial ref={glowMatRef} toneMapped={false} />
      </mesh>
    </group>
  );
}

function CinematicMoon({ moonRef, isMobile }) {
  const groundTexture = useTexture("/moon.jpg");
  return (
    <group
      ref={moonRef}
      position={isMobile ? [0, 200, -50] : [-1, 200, -50]}
      scale={isMobile ? 0.55 : 1}
    >
      <pointLight
        color="#5599cc"
        intensity={isMobile ? 500 : 1000}
        distance={100}
        decay={5}
      />
      <mesh>
        <sphereGeometry args={[4, 32, 32]} />
      </mesh>
      <mesh scale={6.25}>
        <sphereGeometry args={[4, 32, 32]} />
        <meshBasicMaterial
          map={groundTexture}
          color={[0.5, 2.5, 5]}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

function CarModel({ isMobile }) {
  const { scene } = useGLTF("/car.glb");
  return (
    <primitive
      object={scene}
      position={isMobile ? [0.8, -0.8, -3] : [3.25, -1, -6]}
      rotation={[0, -Math.PI / 1.8, 0]}
      scale={isMobile ? 0.0065 : 0.009}
    />
  );
}

function Person({ isMobile }) {
  const { scene } = useGLTF("/name.glb");

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        child.material = new THREE.MeshStandardMaterial({
          color: "#000000",
          roughness: 1,
          metalness: 0,
        });
      }
    });
  }, [scene]);

  return (
    <primitive
      object={scene}
      position={isMobile ? [-0.8, -1.3, -5.0] : [-2, -1.7, -6.0]}
      rotation={[0, 9, 0]}
      scale={isMobile ? 165 : 230}
    />
  );
}

function FloatingAsteroids({ bulletsGroupRef, isMobile }) {
  const rockGeometry = useMemo(
    () => new THREE.DodecahedronGeometry(0.18, 0),
    [],
  );

  const layoutData = useMemo(
    () => [
      { x: -11.5, yStagger: 0.0, z: 4.2 },
      { x: -9.0, yStagger: 3.2, z: 2.2 },
      { x: -7.5, yStagger: 1.5, z: 4.2 },
      { x: -6.0, yStagger: 4.8, z: 2.2 },
      { x: -4.5, yStagger: 0.8, z: 4.2 },
      { x: -3.0, yStagger: 2.7, z: 2.2 },
      { x: -1.2, yStagger: 5.2, z: 4.2 },
      { x: 0.5, yStagger: 1.1, z: 2.2 },
      { x: 2.0, yStagger: 3.9, z: 4.2 },
      { x: 4.0, yStagger: 0.2, z: 2.2 },
      { x: 5.5, yStagger: 4.4, z: 4.2 },
      { x: 7.0, yStagger: 2.1, z: 2.2 },
      { x: 8.5, yStagger: 5.8, z: 4.2 },
      { x: 10.0, yStagger: 1.3, z: 2.2 },
      { x: 12.0, yStagger: 3.5, z: 4.2 },
    ],
    [],
  );

  const asteroidPool = useMemo(() => {
    return layoutData.map((config, index) => {
      const rotX = (index * 1.7) % Math.PI;
      const rotY = (index * 2.3) % Math.PI;
      const rotZ = (index * 0.9) % Math.PI;

      const isEven = index % 2 === 0;
      const customScale = isEven ? [1.5, 1.0, 1.3] : [0.9, 1.6, 1.0];
      const depthScaleMultiplier = config.z > 3 ? 1.6 : 0.9;

      const finalScale = [
        customScale[0] * depthScaleMultiplier * (isMobile ? 0.7 : 1),
        customScale[1] * depthScaleMultiplier * (isMobile ? 0.7 : 1),
        customScale[2] * depthScaleMultiplier * (isMobile ? 0.7 : 1),
      ];

      return {
        x: isMobile ? config.x * 0.45 : config.x,
        y: -14 - config.yStagger,
        z: config.z,
        rotX,
        rotY,
        rotZ,
        scale: finalScale,
      };
    });
  }, [layoutData, isMobile]);

  return (
    <group ref={bulletsGroupRef}>
      <Instances
        geometry={rockGeometry}
        limit={layoutData.length}
        range={layoutData.length}
        renderOrder={98}
      >
        <meshStandardMaterial
          color="#15171a"
          roughness={0.8}
          metalness={0.4}
          flatShading={true}
        />
        {asteroidPool.map((config, index) => (
          <Instance
            key={`rock-${index}`}
            position={[config.x, config.y, config.z]}
            rotation={[config.rotX, config.rotY, config.rotZ]}
            scale={config.scale}
          />
        ))}
      </Instances>
    </group>
  );
}

function ForegroundLandscape({ isMobile }) {
  const groundTexture = useTexture("/rockz.jpg");

  useMemo(() => {
    groundTexture.wrapS = THREE.RepeatWrapping;
    groundTexture.wrapT = THREE.RepeatWrapping;
    groundTexture.repeat.set(6, 3);
  }, [groundTexture]);

  const horizonGeometry = useMemo(() => {
    const segments = isMobile ? 80 : 180;
    const geo = new THREE.PlaneGeometry(60, 30, segments, segments);
    const pos = geo.attributes.position;

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const sweepingHorizonLine = Math.sin(x * 0.08) * 1.3;
      const softRollingRipples = Math.sin(x * 0.6) * Math.cos(y * 0.4) * 0.15;
      const finalHeight = sweepingHorizonLine + softRollingRipples;
      pos.setZ(i, finalHeight);
    }

    geo.computeVertexNormals();
    return geo;
  }, [isMobile]);

  return (
    <group position={[0, -2, 4]}>
      <mesh
        geometry={horizonGeometry}
        rotation={[-Math.PI / 2.2, 0, 0]}
        position={[0, -3.8, 8]}
        renderOrder={2}
      >
        <meshStandardMaterial
          map={groundTexture}
          color="#df7c18"
          roughness={0.95}
          metalness={0.0}
          flatShading={false}
        />
      </mesh>
      <CarModel isMobile={isMobile} />
      <Person isMobile={isMobile} />
    </group>
  );
}

function ScrollAnimationController({
  containerRef2,
  textSunRef,
  textMoonRef,
  textCityRef,
  textLeapRef,
  scrollIndicatorRef,
  subTextSunRef,
  subTextMoonRef,
  subTextCityRef,
  subTextLeapRef,
  textCtaSunRef,
  textCtaMoonRef,
  textCtaCityRef,
  textCtaLeapRef,
  cornerCounterRef,
  isMobile,
}) {
  const { camera, scene } = useThree();
  const sunRef = useRef(null);
  const moonRef = useRef(null);
  const bulletsGroupRef = useRef(null);
  const desertGroupRef = useRef(null);
  const cityGroupRef = useRef(null);
  const leapGroupRef = useRef(null);
  const backRimLightRef = useRef(null);

  const cameraState = useRef({
    posX: 0,
    posY: 0,
    posZ: isMobile ? 12 : 10,
    targetX: 0,
    targetY: 0,
    targetZ: 0,
    fov: isMobile ? 55 : 50,
  });

  const mouseOffset = useRef({ x: 0, y: 0 });
  const scrollProgress = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      mouseOffset.current.x = x;
      mouseOffset.current.y = y;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef2.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.4,
          onUpdate: (self) => {
            scrollProgress.current = self.progress;

            // Scroll indicator only visible on first hero section (Act 1)
            if (scrollIndicatorRef && scrollIndicatorRef.current) {
              if (self.progress > 0.08) {
                scrollIndicatorRef.current.style.opacity = "0";
                scrollIndicatorRef.current.style.visibility = "hidden";
                scrollIndicatorRef.current.style.pointerEvents = "none";
              } else {
                const fade = Math.max(0, 1 - self.progress / 0.08);
                scrollIndicatorRef.current.style.opacity = `${fade}`;
                scrollIndicatorRef.current.style.visibility =
                  fade > 0.01 ? "visible" : "hidden";
              }
            }

            if (cornerCounterRef && cornerCounterRef.current) {
              if (self.progress < 0.25) {
                cornerCounterRef.current.textContent = "01 / 04";
              } else if (self.progress < 0.52) {
                cornerCounterRef.current.textContent = "02 / 04";
              } else if (self.progress < 0.78) {
                cornerCounterRef.current.textContent = "03 / 04";
              } else {
                cornerCounterRef.current.textContent = "04 / 04";
              }
            }
          },
        },
      });

      // Phase 1: Sun to Moon Transition (Golden Hour -> Blue Hour)
      tl.to(sunRef.current.position, { y: -200, ease: "power1.inOut" }, 0);
      tl.to(
        moonRef.current.position,
        { y: isMobile ? 0 : -2, ease: "power1.inOut" },
        0,
      );
      tl.to(
        bulletsGroupRef.current.position,
        {
          y: isMobile ? 14 : 16,
          x: isMobile ? 1.5 : 5,
          z: -3,
          ease: "power1.inOut",
        },
        0,
      );
      if (backRimLightRef.current) {
        tl.to(
          backRimLightRef.current.color,
          {
            r: 0.42,
            g: 0.94,
            b: 1.0,
            ease: "power1.inOut",
          },
          0,
        );
      }
      tl.to(
        scene.background,
        { r: 0.01, g: 0.02, b: 0.06, ease: "power1.inOut" },
        0,
      );

      if (textSunRef.current) {
        tl.to(
          textSunRef.current,
          { opacity: 0, y: -40, scale: 0.9, ease: "power1.inOut" },
          0,
        );
      }
      if (textMoonRef.current) {
        tl.to(
          textMoonRef.current,
          { opacity: 1, y: 0, scale: 1, ease: "power1.inOut" },
          0,
        );
      }
      if (textCtaSunRef.current) {
        tl.to(
          textCtaSunRef.current,
          { opacity: 0, y: -40, scale: 0.9, ease: "power1.inOut" },
          0,
        );
      }
      if (textCtaMoonRef.current) {
        tl.to(
          textCtaMoonRef.current,
          { opacity: 1, y: 0, scale: 1, ease: "power1.inOut" },
          0,
        );
      }
      if (subTextSunRef.current) {
        tl.to(
          subTextSunRef.current,
          { opacity: 0, y: -40, scale: 0.9, ease: "power1.inOut" },
          0,
        );
      }
      if (subTextMoonRef.current) {
        tl.to(
          subTextMoonRef.current,
          { opacity: 1, y: 0, scale: 1, ease: "power1.inOut" },
          0,
        );
      }

      // Phase 2: Moon to Crimson Dawn (Worm's-Eye Zenith Transformation)
      tl.to(moonRef.current.position, { y: 200, ease: "power1.out" }, 1.0);
      tl.to(
        bulletsGroupRef.current.position,
        { y: -30, ease: "power1.out" },
        1.0,
      );
      tl.to(
        desertGroupRef.current.position,
        { y: -60, ease: "power1.out" },
        1.0,
      );
      tl.to(cityGroupRef.current.position, { y: 0, ease: "power1.out" }, 1.0);

      tl.to(
        cameraState.current,
        {
          posX: 0,
          posY: -6.5,
          posZ: 0.01,
          targetX: 0,
          targetY: 35,
          targetZ: 0,
          fov: isMobile ? 75 : 68,
          ease: "power1.out",
        },
        1.0,
      );

      if (backRimLightRef.current) {
        tl.to(
          backRimLightRef.current.color,
          {
            r: 1.0,
            g: 0.05,
            b: 0.1,
            ease: "power1.out",
          },
          1.0,
        );
      }
      tl.to(
        scene.background,
        { r: 0.08, g: 0.18, b: 0.36, ease: "power1.out" },
        1.0,
      );

      if (textMoonRef.current) {
        tl.to(
          textMoonRef.current,
          { opacity: 0, y: -40, scale: 0.9, ease: "power1.out" },
          1.0,
        );
      }
      if (textCityRef && textCityRef.current) {
        tl.to(
          textCityRef.current,
          { opacity: 1, y: 0, scale: 1, ease: "power1.out" },
          1.0,
        );
      }
      if (textCtaMoonRef.current) {
        tl.to(
          textCtaMoonRef.current,
          { opacity: 0, y: -40, scale: 0.9, ease: "power1.out" },
          1.0,
        );
      }
      if (textCtaCityRef && textCtaCityRef.current) {
        tl.to(
          textCtaCityRef.current,
          { opacity: 1, y: 0, scale: 1, ease: "power1.out" },
          1.0,
        );
      }
      if (subTextMoonRef.current) {
        tl.to(
          subTextMoonRef.current,
          { opacity: 0, y: -40, scale: 0.9, ease: "power1.out" },
          1.0,
        );
      }
      if (subTextCityRef && subTextCityRef.current) {
        tl.to(
          subTextCityRef.current,
          { opacity: 1, y: 0, scale: 1, ease: "power1.out" },
          1.0,
        );
      }

      // Phase 3: Crimson Dawn to Obsidian Rain (Rooftop Leap & Weather Particle System)
      tl.to(cityGroupRef.current.position, { y: -80, ease: "power1.out" }, 2.0);
      tl.to(leapGroupRef.current.position, { y: 0, ease: "power1.out" }, 2.0);

      tl.to(
        cameraState.current,
        {
          posX: 0,
          posY: 1.0,
          posZ: isMobile ? 18 : 16,
          targetX: 0,
          targetY: 12.0,
          targetZ: 0,
          fov: isMobile ? 65 : 58,
          ease: "power1.out",
        },
        2.0,
      );

      if (backRimLightRef.current) {
        tl.to(
          backRimLightRef.current,
          {
            intensity: 0.0,
            ease: "power1.out",
          },
          2.0,
        );
      }
      tl.to(
        scene.background,
        { r: 0.06, g: 0.12, b: 0.24, ease: "power1.out" },
        2.0,
      );

      if (textCityRef && textCityRef.current) {
        tl.to(
          textCityRef.current,
          { opacity: 0, y: -40, scale: 0.9, ease: "power1.out" },
          2.0,
        );
      }
      if (textLeapRef && textLeapRef.current) {
        tl.to(
          textLeapRef.current,
          { opacity: 1, y: 0, scale: 1, ease: "power1.out" },
          2.0,
        );
      }
      if (textCtaCityRef && textCtaCityRef.current) {
        tl.to(
          textCtaCityRef.current,
          { opacity: 0, y: -30, ease: "power1.out" },
          2.0,
        );
      }
      if (textCtaLeapRef && textCtaLeapRef.current) {
        tl.to(
          textCtaLeapRef.current,
          { opacity: 1, y: 0, ease: "power1.out" },
          2.0,
        );
      }
      if (subTextCityRef && subTextCityRef.current) {
        tl.to(
          subTextCityRef.current,
          { opacity: 0, y: -30, ease: "power1.out" },
          2.0,
        );
      }
      if (subTextLeapRef && subTextLeapRef.current) {
        tl.to(
          subTextLeapRef.current,
          { opacity: 1, y: 0, ease: "power1.out" },
          2.0,
        );
      }

      if (scrollIndicatorRef.current) {
        tl.to(
          scrollIndicatorRef.current,
          { autoAlpha: 0, y: 20, pointerEvents: "none", ease: "power2.out", duration: 0.2 },
          0,
        );
      }
    },
    { scope: containerRef2, dependencies: [isMobile] },
  );

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Scene Visibility Gating across all 4 acts for draw-call efficiency
    if (desertGroupRef.current) {
      desertGroupRef.current.visible = scrollProgress.current < 0.38;
    }
    if (cityGroupRef.current) {
      cityGroupRef.current.visible =
        scrollProgress.current >= 0.28 && scrollProgress.current <= 0.75;
    }
    if (leapGroupRef.current) {
      leapGroupRef.current.visible = scrollProgress.current > 0.65;
    }

    if (scrollProgress.current > 0.68) {
      // Act 4: Rooftop Parallax
      const blend = (scrollProgress.current - 0.68) / 0.32;
      const pX = (mouseOffset.current.x * 0.9 + Math.sin(t * 0.5) * 0.15) * blend;
      const pY = (mouseOffset.current.y * 0.5 + Math.cos(t * 0.4) * 0.1) * blend;

      camera.position.x = THREE.MathUtils.lerp(
        camera.position.x,
        cameraState.current.posX + pX,
        0.22,
      );
      camera.position.y = THREE.MathUtils.lerp(
        camera.position.y,
        cameraState.current.posY + pY,
        0.22,
      );
      camera.position.z = THREE.MathUtils.lerp(
        camera.position.z,
        cameraState.current.posZ,
        0.22,
      );
    } else if (scrollProgress.current > 0.30) {
      // Act 3: Zenith Sky Parallax
      const blend = Math.min((scrollProgress.current - 0.30) / 0.35, 1);
      const pX = (mouseOffset.current.x * 0.8 + Math.sin(t * 0.4) * 0.2) * blend;
      const pZ = (mouseOffset.current.y * 0.8 + Math.cos(t * 0.3) * 0.2) * blend;

      camera.position.x = THREE.MathUtils.lerp(
        camera.position.x,
        cameraState.current.posX + pX,
        0.22,
      );
      camera.position.y = THREE.MathUtils.lerp(
        camera.position.y,
        cameraState.current.posY,
        0.22,
      );
      camera.position.z = THREE.MathUtils.lerp(
        camera.position.z,
        cameraState.current.posZ + pZ,
        0.22,
      );
    } else {
      // Act 1 & 2: Desert Horizon Parallax
      camera.position.x = THREE.MathUtils.lerp(
        camera.position.x,
        cameraState.current.posX,
        0.22,
      );
      camera.position.y = THREE.MathUtils.lerp(
        camera.position.y,
        cameraState.current.posY,
        0.22,
      );
      camera.position.z = THREE.MathUtils.lerp(
        camera.position.z,
        cameraState.current.posZ,
        0.22,
      );
    }

    camera.lookAt(
      cameraState.current.targetX,
      cameraState.current.targetY,
      cameraState.current.targetZ,
    );

    if (Math.abs(camera.fov - cameraState.current.fov) > 0.1) {
      camera.fov = THREE.MathUtils.lerp(
        camera.fov,
        cameraState.current.fov,
        0.22,
      );
      camera.updateProjectionMatrix();
    }
  });

  return (
    <>
      {/* Acts 1 & 2: Desert & Deep Space Horizon */}
      <group ref={desertGroupRef} position={[0, 0, 0]}>
        <CinematicSun sunRef={sunRef} isMobile={isMobile} />
        <CinematicMoon moonRef={moonRef} isMobile={isMobile} />
        <ForegroundLandscape isMobile={isMobile} />
        <FloatingAsteroids
          bulletsGroupRef={bulletsGroupRef}
          isMobile={isMobile}
        />
      </group>

      {/* Act 3: 4-Skyscrapers Zenith World */}
      <group ref={cityGroupRef} position={[0, -80, 0]} visible={false}>
        <OGCityScene isMobile={isMobile} />
      </group>

      {/* Act 4: Obsidian Rain Rooftop World */}
      <group ref={leapGroupRef} position={[0, -100, 0]} visible={false}>
        <JumpingRooftopScene isMobile={isMobile} />
      </group>

      <directionalLight
        ref={backRimLightRef}
        position={[0, 0, -15]}
        intensity={isMobile ? 4.0 : 8.0}
        color="#ff6a00"
      />
    </>
  );
}

export default function Scene({
  containerRef2,
  textSunRef,
  textMoonRef,
  textCityRef,
  textLeapRef,
  scrollIndicatorRef,
  subTextSunRef,
  subTextMoonRef,
  subTextCityRef,
  subTextLeapRef,
  textCtaSunRef,
  textCtaMoonRef,
  textCtaCityRef,
  textCtaLeapRef,
  cornerCounterRef,
}) {
  const containerRef = useRef(null);
  const isMobile = useMobileDetection();

  return (
    <div
      ref={containerRef}
      style={{
        height: "320vh",
        backgroundColor: "#020205",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          pointerEvents: "none",
        }}
      >
        <Canvas
          style={{ pointerEvents: "auto" }}
          gl={{
            hdr: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            logarithmicDepthBuffer: true,
            antialias: !isMobile,
          }}
          camera={{
            position: [0, 0, isMobile ? 12 : 10],
            fov: isMobile ? 55 : 50,
          }}
        >
          <color attach="background" args={["#100402"]} />
          <ambientLight intensity={0.01} />
          <directionalLight position={[-5, 8, 2]} intensity={0.1} />

          <ScrollAnimationController
            containerRef={containerRef}
            containerRef2={containerRef2}
            textSunRef={textSunRef}
            textMoonRef={textMoonRef}
            textCityRef={textCityRef}
            textLeapRef={textLeapRef}
            scrollIndicatorRef={scrollIndicatorRef}
            subTextSunRef={subTextSunRef}
            subTextMoonRef={subTextMoonRef}
            subTextCityRef={subTextCityRef}
            subTextLeapRef={subTextLeapRef}
            textCtaSunRef={textCtaSunRef}
            textCtaMoonRef={textCtaMoonRef}
            textCtaCityRef={textCtaCityRef}
            textCtaLeapRef={textCtaLeapRef}
            cornerCounterRef={cornerCounterRef}
            isMobile={isMobile}
          />

          <EffectComposer>
            <Bloom
              mipmapBlur={!isMobile}
              luminanceThreshold={0.5}
              luminanceSmoothing={0.3}
              intensity={isMobile ? 1 : 1.2}
              radius={0.4}
            />
          </EffectComposer>
        </Canvas>
      </div>
    </div>
  );
}
