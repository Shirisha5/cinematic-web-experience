import React, { useRef, useEffect, useState } from "react";
import Scene from "./Scene";
import PreLoader from "./PreLoader";
import gsap from "gsap";
import "./App.css";

export default function App() {
  const containerRef = useRef(null);
  const textSunRef = useRef(null);
  const textMoonRef = useRef(null);
  const subTextSunRef = useRef(null);
  const subTextMoonRef = useRef(null);
  const textCtaSunRef = useRef(null);
  const textCtaMoonRef = useRef(null);
  const scrollIndicatorRef = useRef(null);

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!isLoaded) {
      document.body.classList.add("scroll-locked");
    } else {
      document.body.classList.remove("scroll-locked");
    }

    return () => document.body.classList.remove("scroll-locked");
  }, [isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;

    const tl = gsap.timeline({
      defaults: { ease: "power3.out", duration: 1.2 },
    });

    tl.fromTo(
      ".navbar",
      { y: -40, opacity: 0 },
      { y: 0, opacity: 1, duration: 1 },
    )

      .fromTo(
        [".corner-tl", ".corner-tr"],
        { opacity: 0 },
        { opacity: 1, duration: 0.8 },
        "-=0.6",
      )

      .fromTo(
        ".hero-left",
        { x: -50, opacity: 0 },
        { x: 0, opacity: 1 },
        "-=0.7",
      )

      .fromTo(
        ".hero-footer",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1 },
        "-=0.9",
      )

      .fromTo(
        scrollIndicatorRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1 },
        "-=0.8",
      );
  }, [isLoaded]);

  return (
    <div ref={containerRef} className="app-container">
      <PreLoader onLoadingComplete={() => setIsLoaded(true)} />
      <div className="ui-overlay-layer">
        <nav className="navbar">
          <div className="nav-logo">
            <svg
              className="nav-icon"
              width="28"
              height="28"
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="22"
                cy="32"
                r="14"
                stroke="rgba(255,255,255,0.85)"
                strokeWidth="1.8"
              />
              <circle
                cx="42"
                cy="32"
                r="14"
                stroke="rgba(255,255,255,0.85)"
                strokeWidth="1.8"
              />
              <path
                d="M 32 18.5
       A 14 14 0 0 1 32 45.5
       A 14 14 0 0 1 32 18.5 Z"
                fill="rgba(255,255,255,0.12)"
              />
            </svg>
          </div>
          <div className="nav-right">
            <span className="nav-meta">©2026</span>
            <div className="nav-divider" />
            <span className="nav-cta">Get in touch</span>
          </div>
        </nav>

        <span className="corner-tl">Bangalore, IN</span>
        <span className="corner-tr">00 / 01</span>

        <div className="hero-left">
          <span className="eyebrow">
            Inspired by the music of Guns N' Roses
          </span>
          <div className="hero-text-stack">
            <div ref={textSunRef} className="hero-sun">
              <h1 className="title-display">
                <span>Golden</span>
                <span className="amber">Hour</span>
              </h1>
              <p className="subtitle-italic">
                A high-octane distortion of reality, forged under the intense
                glare of a dying star.
              </p>
            </div>
            <div ref={textMoonRef} className="hero-moon">
              <h1 className="title-display">
                <span>Blue</span>
                <span className="ice">Hour</span>
              </h1>
              <p className="subtitle-italic">
                A cold ambient sequence suspended in deep space, driven by dark
                matter and low frequencies.
              </p>
            </div>
          </div>
        </div>

        <div className="hero-footer">
          <div className="footer-left">
            <div ref={textCtaSunRef} className="cta-row sun-cta">
              <span className="cta-primary">
                Enter sound stage <span className="cta-arrow" />
              </span>
              <div className="cta-sep" />
              <span className="cta-secondary">2026 Reel</span>
            </div>

            <div ref={textCtaMoonRef} className="cta-row moon-cta">
              <span className="cta-primary ice-cta">
                Engage lunar orbit <span className="cta-arrow" />
              </span>
              <div className="cta-sep" />
              <span className="cta-secondary">2026 Reel</span>
            </div>
          </div>

          <div className="footer-right">
            <div ref={subTextSunRef} className="meta-row sun-meta">
              <span className="tag-right">COORD // 118.2437° W</span>
              <span className="tag-right">CAM LOG // ISO 400 . 35MM</span>
            </div>

            <div ref={subTextMoonRef} className="meta-row moon-meta">
              <span className="tag-right ice-text">COORD // 000.0000° E</span>
              <span className="tag-right ice-text">
                CAM LOG // ISO 1600 . 85MM
              </span>
            </div>
          </div>
        </div>

        <div ref={scrollIndicatorRef} className="scroll-wrap">
          <div className="mouse-frame">
            <div className="mouse-dot" />
          </div>
          <span className="scroll-label">Scroll</span>
        </div>
      </div>

      <Scene
        containerRef2={containerRef}
        textSunRef={textSunRef}
        textMoonRef={textMoonRef}
        scrollIndicatorRef={scrollIndicatorRef}
        subTextSunRef={subTextSunRef}
        subTextMoonRef={subTextMoonRef}
        textCtaSunRef={textCtaSunRef}
        textCtaMoonRef={textCtaMoonRef}
      />
    </div>
  );
}
