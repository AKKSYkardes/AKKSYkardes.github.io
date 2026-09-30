(() => {
  "use strict";
  const root = document.documentElement;
  const supported = ["tr", "en-US", "en-GB"];
  const page = location.pathname.split("/").pop() || "index.html";
  const titles = {
    "index.html": ["Kuzey Mete Kardeş — Projeler ve Notlar", "Kuzey Mete Kardeş — Projects and Notes"],
    "jarvis.html": ["JARVIS — Mimari ve Geliştirme Planı", "JARVIS — Architecture and Development Plan"],
    "iron-man.html": ["Iron Man Kaskı + Kolu — Proje Planı", "Iron Man Helmet + Arm — Project Plan"]
  };
  const descriptions = {
    "index.html": ["Kuzey Mete Kardeş — yapay zekâ, yazılım geliştirme, 3D tasarım ve robotikle ilgilenen öğrenci geliştirici.", "Kuzey Mete Kardeş — a student developer interested in AI, software development, 3D design and robotics."],
    "jarvis.html": ["JARVIS kişisel yapay zekâ ajanının amacı, mimarisi, hafıza modeli ve geliştirme planı.", "The purpose, architecture, memory model and development plan of the JARVIS personal AI agent."],
    "iron-man.html": ["Iron Man kaskı ve kolu: 3D baskı, mekanik, elektronik ve yazılım proje planı.", "Iron Man helmet and arm: a project plan combining 3D printing, mechanics, electronics and software."]
  };
  let saved = "tr";
  try { saved = localStorage.getItem("site-language") || "tr"; } catch (_) { /* Storage is optional. */ }
  if (saved === "en") saved = "en-US";
  const requested = new URLSearchParams(location.search).get("lang");
  const initial = supported.includes(requested) ? requested : supported.includes(saved) ? saved : "tr";

  function setLanguage(locale) {
    if (!supported.includes(locale)) return;
    root.dataset.lang = locale;
    root.lang = locale;
    const english = locale !== "tr";
    try { localStorage.setItem("site-language", locale); } catch (_) { /* Continue without persistence. */ }
    document.querySelectorAll("[data-locale]").forEach(button => {
      button.setAttribute("aria-pressed", String(button.dataset.locale === locale));
    });
    document.querySelectorAll("[data-us]").forEach(item => {
      item.textContent = locale === "en-GB" ? item.dataset.uk : item.dataset.us;
    });
    document.querySelectorAll(".language-picker").forEach(item => {
      item.setAttribute("aria-label", english ? "Language selection" : "Dil seçimi");
    });
    document.querySelectorAll("nav").forEach(item => item.setAttribute("aria-label", english ? "Main navigation" : "Ana menü"));
    document.querySelector(".statement")?.setAttribute("aria-label", english ? "About" : "Hakkımda");
    document.querySelector(".architecture")?.setAttribute("aria-label", english ? "JARVIS system flow" : "JARVIS sistem akışı");
    document.title = (titles[page] || titles["index.html"])[english ? 1 : 0];
    document.querySelector('meta[name="description"]').content = (descriptions[page] || descriptions["index.html"])[english ? 1 : 0];
    // Keep the choice across pages even when browser storage is unavailable.
    document.querySelectorAll('a[href]').forEach(link => {
      const url = new URL(link.getAttribute("href"), location.href);
      if (url.origin === location.origin && url.pathname !== location.pathname && /\.html$/.test(url.pathname)) {
        url.searchParams.set("lang", locale);
        link.href = url.pathname + url.search + url.hash;
      }
    });
  }
  setLanguage(initial);
  document.querySelectorAll("[data-locale]").forEach(button => {
    button.addEventListener("click", () => {
      setLanguage(button.dataset.locale);
      const url = new URL(location.href);
      url.searchParams.set("lang", button.dataset.locale);
      history.replaceState(null, "", url);
    });
  });
  document.querySelectorAll("#year").forEach(item => { item.textContent = new Date().getFullYear(); });
})();
