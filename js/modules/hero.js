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

/* ----- Pin hero + crossfade through 3 product images ----- */
function setupParallax() {
  if (!window.ScrollTrigger) return;

  const hero = document.querySelector(".hero");
  const products = document.querySelector(".hero__products");
  const p1 = document.querySelector(".hero__product--1");
  const p2 = document.querySelector(".hero__product--2");
  const p3 = document.querySelector(".hero__product--3");
  if (!hero || !products || !p1 || !p2 || !p3) return;

  // Master pinned timeline — pin engages only when the IMAGE center reaches
  // the viewport center (so user scrolls past the headline first, then the
  // page locks while images crossfade through 3 products).
  //   trigger: the products wrapper, start: center-center
  //   pin: the entire hero (keeps surrounding context fixed during crossfade)
  //   end: +200% of viewport (2 "scrolls" — one per image transition)
  //   scrub: 0.6 for silky crossfades
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: products,
      start: "center center",
      end: "+=200%",
      pin: hero,
      pinSpacing: true,
      scrub: 0.6,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
  });

  // Phase 1 → 2 (first half of scrub)
  tl.to(p1, { opacity: 0, scale: 0.94, duration: 1 }, 0)
    .fromTo(
      p2,
      { opacity: 0, scale: 1.05 },
      { opacity: 1, scale: 1, duration: 1 },
      0
    )
    // Phase 2 → 3 (second half of scrub)
    .to(p2, { opacity: 0, scale: 0.94, duration: 1 }, 1)
    .fromTo(
      p3,
      { opacity: 0, scale: 1.05 },
      { opacity: 1, scale: 1, duration: 1 },
      1
    );

  // Subtle ambient parallax that runs alongside the pin
  tl.to(".hero__watermark", { yPercent: -8, scale: 1.04, duration: 2 }, 0);
  tl.to(".hero__lavender", { yPercent: -18, duration: 2 }, 0);
  tl.to(".hero__blob",     { yPercent: 10,  duration: 2 }, 0);
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
