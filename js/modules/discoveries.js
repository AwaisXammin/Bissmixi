/* ==========================================================================
   Discoveries module
   - Ellipse 42 fast orbital motion behind cards (oval orbit path)
   - Card "lit" state cycles based on closest spotlight position
   - Scroll-triggered reveal of cards and text
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

    // ---- Cards reveal ----
    gsap.from(cards, {
      y: 80,
      opacity: 0,
      duration: 1.2,
      stagger: 0.12,
      ease: "power3.out",
      scrollTrigger: { trigger: portal, start: "top 80%" },
    });

    // Text reveal
    gsap.from(
      section.querySelectorAll(
        ".discoveries__eyebrow, .discoveries__heading, .discoveries__sub, .discoveries__cta"
      ),
      {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: { trigger: section, start: "top 70%" },
      }
    );

    // ---- Card lit-state cycling ----
    // Portal shape itself spins via CSS; we just cycle which card is "lit"
    // every short interval to simulate the orbiting beam passing over each one.
    let activeIndex = 0;
    function setLit(i) {
      cards.forEach((c, idx) => c.classList.toggle("is-lit", idx === i));
    }
    setLit(0);
    let timer = setInterval(() => {
      activeIndex = (activeIndex + 1) % cards.length;
      setLit(activeIndex);
    }, 1400);

    // Pause cycling when out of view
    ScrollTrigger.create({
      trigger: section,
      start: "top 100%",
      end: "bottom 0%",
      onLeave: () => clearInterval(timer),
      onLeaveBack: () => clearInterval(timer),
      onEnter: () => {
        clearInterval(timer);
        timer = setInterval(() => {
          activeIndex = (activeIndex + 1) % cards.length;
          setLit(activeIndex);
        }, 1400);
      },
      onEnterBack: () => {
        clearInterval(timer);
        timer = setInterval(() => {
          activeIndex = (activeIndex + 1) % cards.length;
          setLit(activeIndex);
        }, 1400);
      },
    });
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
