/* ==========================================================================
   Custom Cursor — premium dot + ring follower
   - Dot tracks the mouse 1:1 (instant)
   - Ring lags behind via lerp for the "elastic" feel
   - Ring grows on hover over interactive elements (a, button, input, etc.)
   - Auto-disabled on touch/coarse-pointer devices and prefers-reduced-motion
   ========================================================================== */

export function initCursor() {
  // Only on devices with a fine pointer (mouse). Bail otherwise.
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const ring = document.querySelector(".cursor-ring");
  const dot = document.querySelector(".cursor-dot");
  if (!ring || !dot) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;
  const ease = 0.18; // ring lerp factor — higher = snappier follow

  // Mouse position → dot follows immediately, ring lerps in rAF
  window.addEventListener(
    "mousemove",
    (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
    },
    { passive: true }
  );

  // Smooth ring follow via rAF
  function tick() {
    ringX += (mouseX - ringX) * ease;
    ringY += (mouseY - ringY) * ease;
    ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  // Hover-state on interactive elements — delegated to document so it
  // catches elements added later (drawer nav links, dropdowns, etc.)
  const interactiveSelector =
    'a, button, input, textarea, select, label, [role="button"], [data-cursor-hover]';

  document.addEventListener(
    "mouseover",
    (e) => {
      if (e.target.closest(interactiveSelector)) {
        ring.classList.add("is-hover");
        dot.classList.add("is-hover");
      }
    },
    { passive: true }
  );

  document.addEventListener(
    "mouseout",
    (e) => {
      if (e.target.closest(interactiveSelector)) {
        ring.classList.remove("is-hover");
        dot.classList.remove("is-hover");
      }
    },
    { passive: true }
  );

  // Press state — quick scale-down on mousedown
  document.addEventListener("mousedown", () => {
    ring.classList.add("is-press");
  });
  document.addEventListener("mouseup", () => {
    ring.classList.remove("is-press");
  });

  // Hide when cursor leaves the window
  document.addEventListener("mouseleave", () => {
    ring.classList.add("is-out");
    dot.classList.add("is-out");
  });
  document.addEventListener("mouseenter", () => {
    ring.classList.remove("is-out");
    dot.classList.remove("is-out");
  });
}
