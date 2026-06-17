import { useProgress } from "@react-three/drei";
import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import "./PreLoader.css";

export default function PreLoader({ onLoadingComplete }) {
  const { progress: threeProgress } = useProgress();
  const [hidden, setHidden] = useState(false);
  const progressBarRef = useRef(null);

  const [animatedProgress, setAnimatedProgress] = useState(0);
  const progressObj = useRef({ value: 0 });

  // --- ENGINE 1: TRACKS HTML/JS BUNDLE DOM ENGINE (0% to 50%) ---
  useEffect(() => {
    window.scrollTo(0, 0);

    // If the window has already fired its load event before React mounts
    if (document.readyState === "complete") {
      animateToValue(50, 1.5);
    } else {
      // Crawl smoothly to 40% while waiting for the network bundle
      const baselineTween = gsap.to(progressObj.current, {
        value: 40,
        duration: 4,
        ease: "power1.out",
        onUpdate: () => setAnimatedProgress(progressObj.current.value),
      });

      // The exact second the server finishes delivering all scripts/styles:
      const handleWindowLoad = () => {
        baselineTween.kill();
        animateToValue(50, 0.6); // Punch straight to 50% smoothly
      };

      window.addEventListener("load", handleWindowLoad);
      return () => window.removeEventListener("load", handleWindowLoad);
    }
  }, []);

  // --- ENGINE 2: TRACKS 3D WEBGL ENGINE OVERLAY (50% to 100%) ---
  useEffect(() => {
    // Only engage when Three.js assets begin active processing
    if (threeProgress > 0) {
      // Map Three.js 0-100% scale safely onto our remaining 50-100% UI layout
      const targetProgress = 50 + threeProgress / 2;

      animateToValue(targetProgress, 0.4);
    }
  }, [threeProgress]);

  // Reusable tween processor to keep animations fluid
  const animateToValue = (target, durationSetting) => {
    gsap.to(progressObj.current, {
      value: target,
      duration: durationSetting,
      ease: "power2.out",
      overwrite: "auto", // Cleans up competing animations instantly
      onUpdate: () => {
        setAnimatedProgress(progressObj.current.value);
      },
    });
  };

  // --- EFFECT 3: DRIVE VISUAL PROGRESS BAR FILTERS ---
  useEffect(() => {
    if (progressBarRef.current) {
      gsap.to(progressBarRef.current, {
        width: `${animatedProgress}%`,
        duration: 0.2,
        ease: "power1.out",
      });
    }
  }, [animatedProgress]);

  // --- EFFECT 4: OUTRO ANIMATION OVERLAYS ---
  useEffect(() => {
    if (Math.floor(animatedProgress) >= 100) {
      const stableTimeout = setTimeout(() => {
        const tl = gsap.timeline({
          onComplete: () => {
            setHidden(true);
            if (onLoadingComplete) onLoadingComplete();
          },
        });

        tl.to(".preloader", {
          yPercent: -100,
          duration: 1.0,
          ease: "power3.inOut",
        });
      }, 300);
      return () => clearTimeout(stableTimeout);
    }
  }, [animatedProgress, onLoadingComplete]);

  if (hidden) return null;

  return (
    <div className="preloader">
      <div className="preloader-content-wrapper">
        <div className="counter-display">
          {Math.floor(animatedProgress).toString().padStart(1, "0")}
          <span className="percent-sign">%</span>
        </div>

        <div className="loader-track">
          <div
            ref={progressBarRef}
            className="loader-fill"
            style={{ width: "0%" }}
          />
        </div>

        <h2 className="cinematic-title">A Cinematic Web Experience</h2>
        <p className="cinematic-subtitle">
          Inspired by the music of Guns N' Roses
        </p>
      </div>
    </div>
  );
}
