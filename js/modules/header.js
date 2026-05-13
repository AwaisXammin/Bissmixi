/* ==========================================================================
   Header module
   - Letter-by-letter logo reveal on load (premium feel)
   - Sticky background + compaction on scroll
   - Active link tracking via ScrollTrigger as sections come into view
   - Smooth scroll for in-page anchors
   ========================================================================== */

export function initHeader() {
  const header = document.querySelector(".site-header");
  if (!header) return;

  splitLogo();
  setupScrollState(header);
  setupSmoothScroll();
  whenGsapReady(() => {
    animateLogoIn();
    setupActiveLinkTracking();
  });
}

/* ----- Logo: split into characters for per-letter animation ----- */
function splitLogo() {
  const logoLetters = document.querySelector(".site-logo__letters");
  if (!logoLetters || logoLetters.dataset.split === "true") return;

  const text = logoLetters.textContent.trim();
  logoLetters.textContent = "";
  [...text].forEach((char) => {
    const span = document.createElement("span");
    span.className = "site-logo__char";
    span.textContent = char === " " ? " " : char;
    logoLetters.appendChild(span);
  });
  logoLetters.dataset.split = "true";
}

function animateLogoIn() {
  const chars = document.querySelectorAll(".site-logo__char");
  if (!chars.length) return;

  gsap.to(chars, {
    opacity: 1,
    y: 0,
    duration: 0.9,
    ease: "power3.out",
    stagger: { each: 0.05, from: "start" },
    delay: 0.2,
  });
}

/* ----- Sticky / scrolled state ----- */
function setupScrollState(header) {
  const threshold = 24;
  let ticking = false;

  const update = () => {
    if (window.scrollY > threshold) header.classList.add("is-scrolled");
    else header.classList.remove("is-scrolled");
    ticking = false;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    },
    { passive: true }
  );

  update();
}

/* ----- Smooth scroll for #anchors ----- */
function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const id = link.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

/* ----- Active link tracking via ScrollTrigger ----- */
function setupActiveLinkTracking() {
  const links = document.querySelectorAll(".nav-pill__link[href^='#']");
  if (!links.length || !window.ScrollTrigger) return;

  links.forEach((link) => {
    const id = link.getAttribute("href");
    const section = document.querySelector(id);
    if (!section) return;

    ScrollTrigger.create({
      trigger: section,
      start: "top center",
      end: "bottom center",
      onToggle: (self) => {
        if (self.isActive) {
          links.forEach((l) => l.classList.remove("is-active"));
          link.classList.add("is-active");
        }
      },
    });
  });
}

/* ----- helper: wait for GSAP ----- */
function whenGsapReady(cb) {
  if (window.gsap && window.ScrollTrigger) return cb();
  const t = setInterval(() => {
    if (window.gsap && window.ScrollTrigger) {
      clearInterval(t);
      cb();
    }
  }, 30);
}
