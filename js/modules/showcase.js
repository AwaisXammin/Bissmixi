/* ==========================================================================
   Showcase module — GSAP pinned horizontal scroll
   - Pins .showcase__viewport for the full height of .showcase
   - Translates .showcase__track horizontally as user scrolls vertically
   - Adds subtle parallax pan inside each image for cinematic depth
   ========================================================================== */

export function initShowcase() {
  const showcase = document.querySelector(".showcase");
  const viewport = document.querySelector(".showcase__viewport");
  const track = document.querySelector(".showcase__track");
  const panels = document.querySelectorAll(".showcase__panel");
  if (!showcase || !viewport || !track || panels.length === 0) return;

  // Skip horizontal effect on small viewports (CSS already falls back to vertical stack)
  if (window.matchMedia("(max-width: 768px)").matches) return;

  whenGsapReady(() => {
    gsap.registerPlugin(ScrollTrigger);

    const totalPanels = panels.length;
    const distance = (totalPanels - 1) * 100; // in vw units

    // --- Master horizontal scrub timeline ---
    gsap.to(track, {
      x: () => `-${distance}vw`,
      ease: "none",
      scrollTrigger: {
        trigger: showcase,
        start: "top top",
        end: () => `+=${showcase.offsetHeight - window.innerHeight}`,
        pin: viewport,
        pinSpacing: true,
        scrub: 1,            // 1s smoothing — premium feel, not snappy
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    // --- Per-panel parallax pan + scale (subtle cinematic depth) ---
    panels.forEach((panel, i) => {
      const img = panel.querySelector(".showcase__panel-img");
      if (!img) return;

      // Each panel's image pans slightly opposite the scroll direction
      gsap.fromTo(
        img,
        { scale: 1.06, opacity: 0.85 },
        {
          scale: 1.0,
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: showcase,
            start: () =>
              `top+=${(i / totalPanels) * showcase.offsetHeight - window.innerHeight} top`,
            end: () =>
              `top+=${((i + 1) / totalPanels) * showcase.offsetHeight} top`,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        }
      );
    });

    // Refresh on resize (vh / panel widths change)
    window.addEventListener("resize", () => ScrollTrigger.refresh());
  });
}

function whenGsapReady(cb) {
  if (window.gsap && window.ScrollTrigger) return cb();
  const t = setInterval(() => {
    if (window.gsap && window.ScrollTrigger) {
      clearInterval(t);
      cb();
    }
  }, 30);
}
