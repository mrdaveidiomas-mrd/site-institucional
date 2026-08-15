/* ==========================================================================
   includes.js — carrega os parciais de cabeçalho e rodapé
   e ativa os comportamentos globais (menu, header no scroll, ano do rodapé).
   Usa caminhos absolutos (/partials/...) para funcionar em qualquer página,
   inclusive nas que ficam em subpastas (ex.: /cursos/).
   ========================================================================== */

async function injectPartial(targetId, url) {
  const mount = document.getElementById(targetId);
  if (!mount) return;
  try {
    const res = await fetch(url, { cache: "no-cache" });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    mount.innerHTML = await res.text();
  } catch (err) {
    console.error(`Não foi possível carregar o parcial "${url}":`, err);
  }
}

/* Botão flutuante de WhatsApp — presente em todas as páginas, menos no contato
   (para não competir com o formulário de aula experimental). */
async function injectWhatsApp() {
  if (document.body.dataset.page === "contato") return;
  try {
    const res = await fetch("/partials/whatsapp.html", { cache: "no-cache" });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    const template = document.createElement("template");
    template.innerHTML = (await res.text()).trim();
    const fab = template.content.querySelector(".wa-fab");
    if (fab) document.body.appendChild(fab);
  } catch (err) {
    console.error('Não foi possível carregar o botão de WhatsApp:', err);
  }
}

/* Marca o item de menu correspondente à página atual */
function setActiveNav() {
  const page = document.body.dataset.page; // definido em cada <body data-page="...">
  if (!page) return;
  document.querySelectorAll(`.nav__link[data-nav="${page}"]`).forEach((link) => {
    link.classList.add("is-active");
    link.setAttribute("aria-current", "page");
  });
}

/* Menu móvel (abrir/fechar) */
function initMobileMenu() {
  const toggle = document.getElementById("navToggle");
  const panel = document.getElementById("navPanel");
  if (!toggle || !panel) return;

  const close = () => {
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Abrir menu");
    panel.classList.remove("is-open");
    document.body.classList.remove("menu-open");
  };

  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") === "true";
    if (open) {
      close();
    } else {
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", "Fechar menu");
      panel.classList.add("is-open");
      document.body.classList.add("menu-open");
    }
  });

  // Fecha ao clicar num link ou ao apertar Esc
  panel.querySelectorAll("a").forEach((a) => a.addEventListener("click", close));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
  // Fecha se a janela for redimensionada para desktop
  window.matchMedia("(min-width: 901px)").addEventListener("change", (e) => {
    if (e.matches) close();
  });
}

/* Sombra do cabeçalho ao rolar a página */
function initHeaderScroll() {
  const header = document.getElementById("siteHeader");
  if (!header) return;
  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

/* Preenche o ano atual no rodapé */
function setYear() {
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  await Promise.all([
    injectPartial("site-header", "/partials/header.html"),
    injectPartial("site-footer", "/partials/footer.html"),
    injectWhatsApp(),
  ]);

  setActiveNav();
  initMobileMenu();
  initHeaderScroll();
  setYear();

  // Avisa os outros scripts que o cabeçalho/rodapé já estão no DOM
  document.dispatchEvent(new CustomEvent("partials:ready"));
});
