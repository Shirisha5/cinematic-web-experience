import { useProgress } from "@react-three/drei";
import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import "./PreLoader.css";

export default function PreLoader({ onLoadingComplete }) {
  const { progress } = useProgress();
  const [hidden, setHidden] = useState(false);
  const progressBarRef = useRef(null);

  const [animatedProgress, setAnimatedProgress] = useState(0);
  const progressObj = useRef({ value: 0 });

  useEffect(() => {
    window.scrollTo(0, 0);
    gsap.to(progressObj.current, {
      value: progress,
      duration: 1.8,
      ease: "power1.out",
      onUpdate: () => {
        setAnimatedProgress(progressObj.current.value);
      },
    });
  }, [progress]);

  useEffect(() => {
    if (progressBarRef.current) {
      gsap.to(progressBarRef.current, {
        width: `${animatedProgress}%`,
        duration: 0.3,
        ease: "power2.out",
      });
    }
  }, [animatedProgress]);

  useEffect(() => {
    if (Math.floor(animatedProgress) >= 100) {
      const stableTimeout = setTimeout(() => {
        const tl = gsap.timeline({
          onComplete: () => {
            setHidden(true);
            if (onLoadingComplete) onLoadingComplete();
          },
        });

        tl.to(
          ".preloader",
          {
            yPercent: -100,
            duration: 1.0,
            ease: "power3.inOut",
          },
          "-=0.2",
        );
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
