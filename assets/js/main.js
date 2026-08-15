/* ==========================================================================
   main.js — comportamentos de conteúdo:
   revelação suave no scroll (IntersectionObserver) e acordeão do FAQ.
   ========================================================================== */

/* ---- Revelação no scroll ---------------------------------------------- */
function initReveal() {
  const items = document.querySelectorAll("[data-reveal]");
  if (!items.length) return;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        // Escalonamento suave entre irmãos com data-reveal-group
        const delay = el.dataset.revealDelay;
        if (delay) el.style.setProperty("--reveal-delay", `${delay}ms`);
        el.classList.add("is-visible");
        obs.unobserve(el);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );

  items.forEach((el) => observer.observe(el));
}

/* Aplica atraso incremental a grupos marcados com [data-reveal-stagger] */
function applyStagger() {
  document.querySelectorAll("[data-reveal-stagger]").forEach((group) => {
    const step = parseInt(group.dataset.revealStagger, 10) || 90;
    group.querySelectorAll(":scope > [data-reveal]").forEach((child, i) => {
      child.dataset.revealDelay = i * step;
    });
  });
}

/* ---- FAQ (acordeão acessível) ----------------------------------------- */
function initFaq() {
  const items = document.querySelectorAll(".faq__item");
  if (!items.length) return;

  items.forEach((item) => {
    const trigger = item.querySelector(".faq__trigger");
    const panel = item.querySelector(".faq__panel");
    if (!trigger || !panel) return;

    trigger.addEventListener("click", () => {
      const isOpen = item.classList.contains("is-open");
      // Fecha os demais (comportamento de acordeão)
      const group = item.closest(".faq");
      if (group) {
        group.querySelectorAll(".faq__item.is-open").forEach((other) => {
          if (other !== item) {
            other.classList.remove("is-open");
            other.querySelector(".faq__trigger")?.setAttribute("aria-expanded", "false");
          }
        });
      }
      item.classList.toggle("is-open", !isOpen);
      trigger.setAttribute("aria-expanded", String(!isOpen));
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  applyStagger();
  initReveal();
  initFaq();
});
