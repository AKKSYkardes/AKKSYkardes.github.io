(() => {
  const root = document.documentElement;
  const savedLanguage = localStorage.getItem("site-language");
  const initialLanguage = savedLanguage === "en" ? "en" : "tr";

  function setLanguage(language) {
    root.dataset.lang = language;
    root.lang = language;
    localStorage.setItem("site-language", language);
    document.querySelectorAll("[data-lang-choice]").forEach((item) => {
      item.setAttribute("aria-current", item.dataset.langChoice === language ? "true" : "false");
    });
  }

  setLanguage(initialLanguage);

  document.querySelectorAll(".lang-button").forEach((button) => {
    button.addEventListener("click", () => setLanguage(root.dataset.lang === "tr" ? "en" : "tr"));
  });

  document.querySelectorAll("#year").forEach((item) => {
    item.textContent = new Date().getFullYear();
  });

  const revealItems = document.querySelectorAll(".reveal");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const saveData = navigator.connection && navigator.connection.saveData;

  if ("IntersectionObserver" in window && !reducedMotion && !saveData) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.06, rootMargin: "0px 0px -28px" });
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("visible"));
  }
})();

