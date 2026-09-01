import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";

export default defineConfig({
  plugins: [pluginReact()],

  html: {
    title: "Cinematic Web Experience",
    favicon: "./public/logo.svg",
    meta: {
      description:
        "An immersive 4-act interactive WebGL narrative and 3D visual journey inspired by Guns N' Roses, built with React 19, Three.js, and GSAP.",
      keywords:
        "Three.js, React Three Fiber, WebGL, 3D Web, GSAP, Creative Developer, Guns N Roses, Interactive Animation, Rsbuild",
      author: "Shirisha C",
      "theme-color": "#020205",
      "color-scheme": "dark",
      "og:title": "Cinematic Web Experience",
      "og:description":
        "An immersive 4-act interactive WebGL narrative built with React 19, Three.js, and GSAP.",
      "og:type": "website",
      "og:url": "https://cinematic-web-experience.vercel.app/",
      "twitter:card": "summary_large_image",
      "twitter:title": "Cinematic Web Experience",
      "twitter:description":
        "An immersive 4-act interactive WebGL narrative built with React 19, Three.js, and GSAP.",
    },
    bodyAttributes: {
      style:
        "margin: 0; background-color: #020205; font-family: 'DM Sans', sans-serif; overflow-x: hidden; color: #ffffff;",
    },
    tags: [
      {
        tag: "link",
        attrs: {
          rel: "preconnect",
          href: "https://fonts.googleapis.com",
        },
      },
      {
        tag: "link",
        attrs: {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossorigin: true,
        },
      },
      {
        tag: "link",
        attrs: {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Black+Ops+One&family=DM+Sans:ital,wght@0,300;0,400;1,300&family=K2D:wght@400;600&family=Space+Mono:wght@400;700&display=swap",
        },
      },
    ],
  },
});
