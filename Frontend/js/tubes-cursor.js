/*
  Tubes Cursor (WebGL, WebGPU)
  Original URL: https://codepen.io/soju22/pen/qEbdVjK

  Licence CC BY-NC-SA 4.0
  Attribution — You must give appropriate credit.
  Non Commercial — You may not use the material for commercial purposes.
*/

// Keep this effect opt-in-ish: run only on devices with a fine pointer and
// when the user hasn't requested reduced motion.
const reduceMotion =
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const finePointer =
  window.matchMedia &&
  window.matchMedia("(pointer: fine)").matches;

if (!reduceMotion && finePointer) {
  const canvas = document.getElementById("cursorCanvas");

  if (canvas) {
    // Uses upstream ThreeJS component via CDN (ESM).
    const { default: TubesCursor } = await import(
      "https://cdn.jsdelivr.net/npm/threejs-components@0.0.19/build/cursors/tubes1.min.js"
    );

    // Store a reference for debugging/tweaks in DevTools.
    window.__tubesCursor = TubesCursor(canvas, {
      tubes: {
        colors: ["#f967fb", "#53bc28", "#6958d5"],
        lights: {
          intensity: 160,
          colors: ["#83f36e", "#fe8a2e", "#ff008a", "#60aed5"]
        }
      }
    });
  }
}

