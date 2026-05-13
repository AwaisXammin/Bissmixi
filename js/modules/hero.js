/* ==========================================================================
   Hero module
   - Headline word-by-word reveal (mask-clip stagger)
   - Subhead + button fade-in
   - Scroll parallax on lavender, watermark, gradient blob
   - Smooth scroll on circle button
   ========================================================================== */

export function initHero() {
  const hero = document.querySelector(".hero");
  if (!hero) return;

  setupScrollButton();
  whenGsapReady(() => {
    animateIntro();
    setupParallax();
  });
}

/* ----- Intro animation timeline ----- */
function animateIntro() {
  const headlineWords = document.querySelectorAll(".hero__headline-word");
  const subhead = document.querySelector(".hero__subhead");
  const btn = document.querySelector(".hero__scroll-btn");

  const tl = gsap.timeline({ delay: 0.6, defaults: { ease: "power3.out" } });

  tl.from(headlineWords, {
    yPercent: 110,
    opacity: 0,
    duration: 1.1,
    stagger: 0.08,
  })
    .from(
      subhead,
      { y: 20, opacity: 0, duration: 0.9 },
      "-=0.6"
    )
    .from(
      btn,
      { scale: 0.85, opacity: 0, duration: 0.8, ease: "back.out(1.5)" },
      "-=0.5"
    );
}

/* ----- Scroll-triggered parallax ----- */
function setupParallax() {
  if (!window.ScrollTrigger) return;

  // Lavender: drifts up slower than scroll
  gsap.to(".hero__lavender", {
    yPercent: -25,
    ease: "none",
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: true,
    },
  });

  // Watermark: subtle horizontal drift + scale on scroll
  gsap.to(".hero__watermark", {
    yPercent: -10,
    scale: 1.05,
    ease: "none",
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: true,
    },
  });

  // Gradient blob: opposite-direction parallax
  gsap.to(".hero__blob", {
    yPercent: 15,
    ease: "none",
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: true,
    },
  });

  // Hero content slight fade on scroll out
  gsap.to(".hero__content", {
    opacity: 0,
    y: -40,
    ease: "none",
    scrollTrigger: {
      trigger: ".hero",
      start: "30% top",
      end: "bottom top",
      scrub: true,
    },
  });
}

/* ----- Circle button → scroll to next section ----- */
function setupScrollButton() {
  const btn = document.querySelector(".hero__scroll-btn");
  if (!btn) return;
  btn.addEventListener("click", () => {
    const hero = document.querySelector(".hero");
    const next = hero?.nextElementSibling;
    if (next) next.scrollIntoView({ behavior: "smooth", block: "start" });
    else
      window.scrollTo({
        top: window.innerHeight,
        behavior: "smooth",
      });
  });
}

/* ----- helper ----- */
function whenGsapReady(cb) {
  if (window.gsap && window.ScrollTrigger) return cb();
  const t = setInterval(() => {
    if (window.gsap && window.ScrollTrigger) {
      clearInterval(t);
      cb();
    }
  }, 30);
}
