/* ==========================================================================
   Contact module
   - Mailto links for email + 3 topics (with auto-set subject)
   - Watermark scroll animation — horizontal pan + scale on scroll
   - Card + visual reveal
   ========================================================================== */

const SUBJECTS = {
  Inquiries: "General questions about the Platform & Curation.",
  Collaborations: "Editorial partnerships, content & creators.",
  Brands: "See our for Brands page to request the Media Package.",
};

export function initContact() {
  const section = document.querySelector(".contact");
  if (!section) return;

  // Wire mailto on topic rows
  section.querySelectorAll(".contact__topic").forEach((row) => {
    const labelEl = row.querySelector(".contact__topic-label");
    if (!labelEl) return;
    const key = labelEl.textContent.trim();
    const subject = SUBJECTS[key];
    if (!subject) return;
    const href = `mailto:hello@bissmixi.com?subject=${encodeURIComponent(subject)}`;
    row.setAttribute("role", "link");
    row.setAttribute("tabindex", "0");
    row.style.cursor = "pointer";
    row.addEventListener("click", () => (window.location.href = href));
    row.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        window.location.href = href;
      }
    });
  });

  whenGsapReady(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Watermark — horizontal pan + slight scale as user scrolls through section
    const watermark = section.querySelector(".contact__watermark");
    if (watermark) {
      gsap.fromTo(
        watermark,
        { xPercent: -45, scale: 0.96 },
        {
          xPercent: -55,
          scale: 1.04,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        }
      );
    }

    // Card reveal on scroll
    gsap.from(".contact__card", {
      y: 60,
      opacity: 0,
      duration: 1.1,
      ease: "power3.out",
      scrollTrigger: { trigger: section, start: "top 70%" },
    });

    // Topic rows stagger
    gsap.from(".contact__topic", {
      x: -30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.12,
      ease: "power3.out",
      scrollTrigger: { trigger: ".contact__topics", start: "top 80%" },
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
