/* ==========================================================================
   About 02 module
   - 02 line+number reveal
   - Step In headline reveal
   - Selection Process — heading reveal + image 60 scroll-parallax
   - Dark cards reveal stagger
   ========================================================================== */

export function initAbout02() {
  const section = document.querySelector(".about02");
  if (!section) return;

  whenGsapReady(() => {
    gsap.registerPlugin(ScrollTrigger);

    // 02 indicator
    const lineL = section.querySelector(".about02__line--left");
    const lineR = section.querySelector(".about02__line--right");
    const num = section.querySelector(".about02__num");

    if (lineL) {
      gsap.timeline({
        scrollTrigger: { trigger: section, start: "top 80%" },
        defaults: { ease: "power3.out" },
      })
        .to([lineL, lineR], { scaleX: 1, duration: 1.3, stagger: 0.05 })
        .to(num, { opacity: 1, duration: 0.6 }, "-=0.5");
    }

    // Step in reveal
    gsap.from(
      section.querySelectorAll(".about02__stepin-title, .about02__stepin-sub"),
      {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".about02__stepin",
          start: "top 80%",
        },
      }
    );

    // Process text + visual
    gsap.from(
      section.querySelectorAll(
        ".about02__process-heading, .about02__process-body"
      ),
      {
        x: -40,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".about02__process",
          start: "top 70%",
        },
      }
    );

    // image 60 scroll-linked motion
    const img60 = section.querySelector(".about02__process-img");
    if (img60) {
      gsap.to(img60, {
        yPercent: -10,
        rotation: 6,
        ease: "none",
        scrollTrigger: {
          trigger: ".about02__process",
          start: "top bottom",
          end: "bottom top",
          scrub: 1.2,
        },
      });
    }

    // Simplify reveal
    gsap.from(
      section.querySelectorAll(
        ".about02__simplify-title, .about02__simplify-sub"
      ),
      {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".about02__simplify",
          start: "top 80%",
        },
      }
    );

    // Cards reveal — clearProps after so the CSS hover transform can take over cleanly
    gsap.from(".about02__card", {
      y: 60,
      opacity: 0,
      duration: 1,
      stagger: 0.15,
      ease: "power3.out",
      clearProps: "transform,opacity",
      scrollTrigger: {
        trigger: ".about02__cards",
        start: "top 80%",
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
