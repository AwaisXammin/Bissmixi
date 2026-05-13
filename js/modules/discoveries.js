/* ==========================================================================
   Discoveries module
   - Ellipse 42 spotlight orbits behind 4 cards
   - Each card gets "is-lit" when the spotlight is closest
   - Scroll-triggered subtle rise of cards on entry
   ========================================================================== */

export function initDiscoveries() {
  const section = document.querySelector(".discoveries");
  if (!section) return;

  const portal = section.querySelector(".discoveries__portal");
  const spotlight = section.querySelector(".discoveries__spotlight");
  const cards = [...section.querySelectorAll(".discoveries__card")];
  if (!portal || !spotlight || !cards.length) return;

  whenGsapReady(() => {
    gsap.registerPlugin(ScrollTrigger);

    // ---- Cards reveal on scroll ----
    gsap.from(cards, {
      y: 80,
      opacity: 0,
      duration: 1.2,
      stagger: 0.15,
      ease: "power3.out",
      scrollTrigger: { trigger: portal, start: "top 80%" },
    });

    // Text column reveal
    gsap.from(
      section.querySelectorAll(
        ".discoveries__eyebrow, .discoveries__heading, .discoveries__sub, .discoveries__cta"
      ),
      {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: { trigger: section, start: "top 70%" },
      }
    );

    // ---- Spotlight orbit ----
    // Calculate position of each card center relative to portal
    function getCardCenter(card) {
      const r = card.getBoundingClientRect();
      const p = portal.getBoundingClientRect();
      return {
        x: r.left + r.width / 2 - p.left,
        y: r.top + r.height / 2 - p.top,
      };
    }

    function moveSpotlightTo(index) {
      const c = getCardCenter(cards[index]);
      gsap.to(spotlight, {
        left: c.x,
        top: c.y,
        x: "-50%",
        y: "-50%",
        duration: 1.6,
        ease: "power2.inOut",
        onUpdate: () => updateLitState(index),
      });
    }

    function updateLitState(index) {
      cards.forEach((c, i) => c.classList.toggle("is-lit", i === index));
    }

    // Start orbit
    let current = 0;
    moveSpotlightTo(current);
    setInterval(() => {
      current = (current + 1) % cards.length;
      moveSpotlightTo(current);
    }, 2800);

    // Recalculate on resize
    window.addEventListener("resize", () => moveSpotlightTo(current));
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
