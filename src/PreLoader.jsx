import React, { useEffect, useState, useRef } from "react";
import { useProgress } from "@react-three/drei";
import gsap from "gsap";
import "./PreLoader.css";

export default function PreLoader({ onLoadingComplete }) {
  const { progress: threeProgress } = useProgress();
  const [hidden, setHidden] = useState(false);
  const progressBarRef = useRef(null);

  const [animatedProgress, setAnimatedProgress] = useState(0);
  const progressObj = useRef({ value: 0 });

  const animateToValue = (target, durationSetting) => {
    gsap.to(progressObj.current, {
      value: target,
      duration: durationSetting,
      ease: "power2.out",
      overwrite: "auto",
      onUpdate: () => {
        setAnimatedProgress(progressObj.current.value);
      },
    });
  };

  // Phase 1: Track initial DOM/Bundle readiness (0% to 50%)
  useEffect(() => {
    window.scrollTo(0, 0);

    if (document.readyState === "complete") {
      animateToValue(50, 1.2);
    } else {
      const baselineTween = gsap.to(progressObj.current, {
        value: 40,
        duration: 3,
        ease: "power1.out",
        onUpdate: () => setAnimatedProgress(progressObj.current.value),
      });

      const handleWindowLoad = () => {
        baselineTween.kill();
        animateToValue(50, 0.5);
      };

      window.addEventListener("load", handleWindowLoad);
      return () => window.removeEventListener("load", handleWindowLoad);
    }
  }, []);

  // Phase 2: Track 3D WebGL asset decoding (50% to 100%)
  useEffect(() => {
    if (threeProgress > 0) {
      const targetProgress = 50 + threeProgress / 2;
      animateToValue(targetProgress, 0.4);
    } else {
      const fallbackTimer = setTimeout(() => {
        animateToValue(100, 0.8);
      }, 2400);
      return () => clearTimeout(fallbackTimer);
    }
  }, [threeProgress]);

  // Update progress bar width
  useEffect(() => {
    if (progressBarRef.current) {
      gsap.to(progressBarRef.current, {
        width: `${animatedProgress}%`,
        duration: 0.2,
        ease: "power1.out",
      });
    }
  }, [animatedProgress]);

  // Outro transition when loading hits 100%
  useEffect(() => {
    if (Math.floor(animatedProgress) >= 100) {
      const timeout = setTimeout(() => {
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
      return () => clearTimeout(timeout);
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
