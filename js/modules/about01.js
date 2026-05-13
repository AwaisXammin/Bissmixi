/* ==========================================================================
   About 01 module
   - Animated 01 line+number reveal on scroll
   - 3 curated cards with Ellipse 42 spotlight
   - Auto-rotates every 4s + click overrides
   ========================================================================== */

export function initAbout01() {
  const section = document.querySelector(".about01");
  if (!section) return;

  const cards = [...section.querySelectorAll(".about01__card")];
  const spotlight = section.querySelector(".about01__spotlight");
  if (!cards.length || !spotlight) return;

  let activeIndex = 1; // start with middle card
  let autoTimer = null;
  let paused = false;

  function setActive(i) {
    activeIndex = ((i % cards.length) + cards.length) % cards.length;
    cards.forEach((c, idx) => {
      c.classList.toggle("is-active", idx === activeIndex);
      // Reorder side classes for proper width
      c.classList.remove("about01__card--prev", "about01__card--next");
      if (idx === (activeIndex - 1 + cards.length) % cards.length)
        c.classList.add("about01__card--prev");
      else if (idx === (activeIndex + 1) % cards.length)
        c.classList.add("about01__card--next");
    });

    // Move spotlight to active card center
    if (window.gsap) {
      const rect = cards[activeIndex].getBoundingClientRect();
      const stageRect = section
        .querySelector(".about01__stage")
        .getBoundingClientRect();
      const cx = rect.left + rect.width / 2 - stageRect.left;
      gsap.to(spotlight, {
        left: cx,
        x: "-50%",
        duration: 1,
        ease: "power3.out",
      });
    }
  }

  // Click to switch
  cards.forEach((card, idx) =>
    card.addEventListener("click", () => {
      paused = true;
      setActive(idx);
      clearInterval(autoTimer);
      // Resume auto after 6s of inactivity
      setTimeout(() => {
        paused = false;
        startAuto();
      }, 6000);
    })
  );

  function startAuto() {
    if (autoTimer) clearInterval(autoTimer);
    autoTimer = setInterval(() => {
      if (!paused) setActive(activeIndex + 1);
    }, 4000);
  }

  // initial state
  setActive(1);
  startAuto();

  whenGsapReady(() => {
    gsap.registerPlugin(ScrollTrigger);

    // 01 line + number reveal
    const lineL = section.querySelector(".about01__line--left");
    const lineR = section.querySelector(".about01__line--right");
    const num = section.querySelector(".about01__num");

    const tl = gsap.timeline({
      scrollTrigger: { trigger: section, start: "top 75%" },
      defaults: { ease: "power3.out" },
    });

    tl.to([lineL, lineR], { scaleX: 1, duration: 1.3, stagger: 0.05 })
      .to(num, { opacity: 1, y: 0, duration: 0.6 }, "-=0.5")
      .from(
        section.querySelectorAll(".about01__heading, .about01__sub"),
        { y: 30, opacity: 0, duration: 0.9, stagger: 0.12 },
        "-=0.4"
      )
      .from(
        cards,
        { y: 60, opacity: 0, duration: 1, stagger: 0.1 },
        "-=0.5"
      );

    // Recalc spotlight position on resize
    window.addEventListener("resize", () => setActive(activeIndex));
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
