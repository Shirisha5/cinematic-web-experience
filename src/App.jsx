import React, { useRef, useEffect, useState } from "react";
import Scene from "./Scene";
import PreLoader from "./PreLoader";
import gsap from "gsap";
import "./App.css";

export default function App() {
  const containerRef = useRef(null);

  const textSunRef = useRef(null);
  const textMoonRef = useRef(null);
  const textCityRef = useRef(null);
  const textLeapRef = useRef(null);

  const subTextSunRef = useRef(null);
  const subTextMoonRef = useRef(null);
  const subTextCityRef = useRef(null);
  const subTextLeapRef = useRef(null);

  const textCtaSunRef = useRef(null);
  const textCtaMoonRef = useRef(null);
  const textCtaCityRef = useRef(null);
  const textCtaLeapRef = useRef(null);

  const cornerCounterRef = useRef(null);
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

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const tl = gsap.timeline({
      defaults: {
        ease: prefersReducedMotion ? "none" : "power3.out",
        duration: prefersReducedMotion ? 0.01 : 1.2,
      },
    });

    tl.fromTo(
      ".navbar",
      { y: prefersReducedMotion ? 0 : -40, opacity: 0 },
      { y: 0, opacity: 1, duration: prefersReducedMotion ? 0.01 : 1 },
    )
      .fromTo(
        [".corner-tl", ".corner-tr"],
        { opacity: 0 },
        { opacity: 1, duration: prefersReducedMotion ? 0.01 : 0.8 },
        "-=0.6",
      )
      .fromTo(
        ".hero-left",
        { x: prefersReducedMotion ? 0 : -50, opacity: 0 },
        { x: 0, opacity: 1 },
        "-=0.7",
      )
      .fromTo(
        ".hero-footer",
        { y: prefersReducedMotion ? 0 : 30, opacity: 0 },
        { y: 0, opacity: 1 },
        "-=0.9",
      )
      .fromTo(
        scrollIndicatorRef.current,
        { y: prefersReducedMotion ? 0 : 20, opacity: 0 },
        { y: 0, opacity: 1 },
        "-=0.8",
      );

    return () => tl.kill();
  }, [isLoaded]);

  return (
    <div ref={containerRef} className="app-container">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <PreLoader onLoadingComplete={() => setIsLoaded(true)} />

      <h1 className="sr-only">
        Guns N' Roses Experience — Cinematic 3D Journey
      </h1>

      <main id="main-content" className="ui-overlay-layer">
        <header className="navbar" role="banner">
          <div className="nav-logo" role="img" aria-label="Project Logo">
            <svg
              className="nav-icon"
              width="28"
              height="28"
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
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
                d="M 32 18.5 A 14 14 0 0 1 32 45.5 A 14 14 0 0 1 32 18.5 Z"
                fill="rgba(255,255,255,0.12)"
              />
            </svg>
          </div>
          <div className="nav-right">
            <span className="nav-meta">©2026</span>
            <div className="nav-divider" aria-hidden="true" />
            <span
              className="nav-cta"
              role="button"
              tabIndex={0}
              aria-label="Get in touch with creator"
            >
              Get in touch
            </span>
          </div>
        </header>

        <span className="corner-tl" aria-label="Location Bangalore, India">
          Bangalore, IN
        </span>
        <span
          ref={cornerCounterRef}
          className="corner-tr"
          aria-live="polite"
          aria-atomic="true"
        >
          01 / 04
        </span>

        <section className="hero-left" aria-label="Narrative Acts">
          <span className="eyebrow">
            Inspired by the music of Guns N' Roses
          </span>
          <div className="hero-text-stack">
            {/* Act 1: Golden Hour */}
            <article ref={textSunRef} className="hero-sun" aria-label="Act 1">
              <h2 className="title-display">
                <span>Golden</span>
                <span className="amber">Hour</span>
              </h2>
              <p className="subtitle-italic">
                A high-octane distortion of reality, forged under the intense
                glare of a dying star.
              </p>
            </article>

            {/* Act 2: Blue Hour */}
            <article ref={textMoonRef} className="hero-moon" aria-label="Act 2">
              <h2 className="title-display">
                <span>Blue</span>
                <span className="ice">Hour</span>
              </h2>
              <p className="subtitle-italic">
                A cold ambient sequence suspended in deep space, driven by dark
                matter and low frequencies.
              </p>
            </article>

            {/* Act 3: Crimson Dawn */}
            <article ref={textCityRef} className="hero-city" aria-label="Act 3">
              <h2 className="title-display">
                <span>Crimson</span>
                <span className="crimson">Dawn</span>
              </h2>
              <p className="subtitle-italic">
                A high-altitude monolith sequence surrounded by towering
                skyscrapers beneath the blood-red sun.
              </p>
            </article>

            {/* Act 4: Obsidian Rain */}
            <article ref={textLeapRef} className="hero-leap" aria-label="Act 4">
              <h2 className="title-display">
                <span>Obsidian</span>
                <span className="amber-fire">Rain</span>
              </h2>
              <p className="subtitle-italic">
                A stormy rooftop leap into the void suspended between two titans
                under relentless torrential rain.
              </p>
            </article>
          </div>
        </section>

        <footer className="hero-footer" role="contentinfo">
          <div className="footer-left">
            <div
              ref={textCtaSunRef}
              className="cta-row sun-cta"
              role="button"
              tabIndex={0}
              aria-label="Enter sound stage"
            >
              <span className="cta-primary">
                Enter sound stage <span className="cta-arrow" aria-hidden="true" />
              </span>
              <div className="cta-sep" aria-hidden="true" />
              <span className="cta-secondary">2026 Reel</span>
            </div>

            <div
              ref={textCtaMoonRef}
              className="cta-row moon-cta"
              role="button"
              tabIndex={0}
              aria-label="Engage lunar orbit"
            >
              <span className="cta-primary ice-cta">
                Engage lunar orbit <span className="cta-arrow" aria-hidden="true" />
              </span>
              <div className="cta-sep" aria-hidden="true" />
              <span className="cta-secondary">2026 Reel</span>
            </div>

            <div
              ref={textCtaCityRef}
              className="cta-row city-cta"
              role="button"
              tabIndex={0}
              aria-label="Witness red zenith"
            >
              <span className="cta-primary crimson-cta">
                Witness red zenith <span className="cta-arrow" aria-hidden="true" />
              </span>
              <div className="cta-sep" aria-hidden="true" />
              <span className="cta-secondary">2026 Reel</span>
            </div>

            <div
              ref={textCtaLeapRef}
              className="cta-row leap-cta"
              role="button"
              tabIndex={0}
              aria-label="Take the leap"
            >
              <span className="cta-primary fire-cta">
                Take the leap <span className="cta-arrow" aria-hidden="true" />
              </span>
              <div className="cta-sep" aria-hidden="true" />
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

            <div ref={subTextCityRef} className="meta-row city-meta">
              <span className="tag-right crimson-text">
                COORD // 139.6917° E
              </span>
              <span className="tag-right crimson-text">
                CAM LOG // ISO 3200 . 24MM
              </span>
            </div>

            <div ref={subTextLeapRef} className="meta-row leap-meta">
              <span className="tag-right fire-text">COORD // 35.6762° N</span>
              <span className="tag-right fire-text">
                CAM LOG // ISO 6400 . 50MM
              </span>
            </div>
          </div>
        </footer>

        <div
          ref={scrollIndicatorRef}
          className="scroll-wrap"
          aria-hidden="true"
        >
          <div className="mouse-frame">
            <div className="mouse-dot" />
          </div>
          <span className="scroll-label">Scroll</span>
        </div>
      </main>

      <Scene
        containerRef2={containerRef}
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
      />
    </div>
  );
}
