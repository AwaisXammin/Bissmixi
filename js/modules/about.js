/* ==========================================================================
   About module
   - Reveal heading on scroll
   - Saturn (Image 80) — slow rotation + scroll-linked Y motion
   ========================================================================== */

export function initAbout() {
  const about = document.querySelector(".about");
  if (!about) return;

  whenGsapReady(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Heading + eyebrow reveal
    const reveals = about.querySelectorAll(".about__eyebrow, .about__heading");
    gsap.from(reveals, {
      y: 40,
      opacity: 0,
      duration: 1,
      stagger: 0.12,
      ease: "power3.out",
      scrollTrigger: {
        trigger: about,
        start: "top 75%",
      },
    });

    // Saturn — scroll-linked rotation + drift
    const saturn = about.querySelector(".about__saturn");
    if (saturn) {
      gsap.to(saturn, {
        rotation: 90,
        yPercent: -30,
        ease: "none",
        scrollTrigger: {
          trigger: about,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.2,
        },
      });
    }
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
