/* ==========================================================================
   App Entry — Bissmixi
   Registers GSAP plugins, sets up global scroll-reveal,
   and dynamically loads per-section modules as they're added.
   ========================================================================== */

// Wait for GSAP CDN scripts to finish loading
function whenGsapReady(callback) {
  if (window.gsap && window.ScrollTrigger) {
    callback();
    return;
  }
  const interval = setInterval(() => {
    if (window.gsap && window.ScrollTrigger) {
      clearInterval(interval);
      callback();
    }
  }, 30);
}

whenGsapReady(() => {
  gsap.registerPlugin(ScrollTrigger);

  // Global scroll-reveal for any element with [data-reveal]
  document.querySelectorAll("[data-reveal]").forEach((el) => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
    });
  });
});

// ----- Section modules -----
import { initHeader } from "./modules/header.js";
import { initHero } from "./modules/hero.js";
import { initShowcase } from "./modules/showcase.js";
import { initAbout } from "./modules/about.js";
import { initAbout01 } from "./modules/about01.js";
import { initAbout02 } from "./modules/about02.js";
import { initDiscoveries } from "./modules/discoveries.js";
import { initContact } from "./modules/contact.js";
import { initDropdowns } from "./modules/dropdown.js";

initHeader();
initHero();
initShowcase();
initAbout();
initAbout01();
initAbout02();
initDiscoveries();
initContact();
initDropdowns();

// Footer year
const yearEl = document.getElementById("footer-year");
if (yearEl) yearEl.textContent = new Date().getFullYear();
