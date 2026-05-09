const header = document.querySelector("[data-header]");
const navToggle = document.querySelector("[data-nav-toggle]");
const navMenu = document.querySelector("[data-nav-menu]");
const navLinks = Array.from(document.querySelectorAll(".nav-links a"));

const setScrolledHeader = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 16);
};

const closeMenu = () => {
  document.body.classList.remove("nav-open");
  navMenu?.classList.remove("is-open");
  navToggle?.setAttribute("aria-expanded", "false");
  navToggle?.setAttribute("aria-label", "Open navigation menu");
};

navToggle?.addEventListener("click", () => {
  const isOpen = navToggle.getAttribute("aria-expanded") === "true";
  document.body.classList.toggle("nav-open", !isOpen);
  navMenu?.classList.toggle("is-open", !isOpen);
  navToggle.setAttribute("aria-expanded", String(!isOpen));
  navToggle.setAttribute("aria-label", isOpen ? "Open navigation menu" : "Close navigation menu");
});

navLinks.forEach((link) => {
  link.addEventListener("click", closeMenu);
});

window.addEventListener("scroll", setScrolledHeader, { passive: true });
setScrolledHeader();

window.addEventListener("load", () => {
  const targetId = window.location.hash.slice(1);
  const target = targetId ? document.getElementById(targetId) : null;
  target?.scrollIntoView({ behavior: "auto", block: "start" });
});

const revealTargets = document.querySelectorAll(".reveal, .stat-card");
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

revealTargets.forEach((target, index) => {
  target.style.transitionDelay = `${Math.min(index % 8, 6) * 45}ms`;
  revealObserver.observe(target);
});

const sections = Array.from(document.querySelectorAll("main section[id]"));
const activeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const activeId = entry.target.id;
      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${activeId}`);
      });
    });
  },
  {
    rootMargin: "-35% 0px -55% 0px",
    threshold: 0.01,
  }
);

sections.forEach((section) => activeObserver.observe(section));

document.querySelectorAll(".faq-item button").forEach((button) => {
  button.addEventListener("click", () => {
    const item = button.closest(".faq-item");
    const panel = item?.querySelector(".faq-panel");
    const isOpen = item?.classList.contains("is-open");

    item?.classList.toggle("is-open", !isOpen);
    button.setAttribute("aria-expanded", String(!isOpen));

    if (!panel) return;
    panel.style.maxHeight = isOpen ? "0px" : `${panel.scrollHeight}px`;
  });
});

document.querySelectorAll("img").forEach((image) => {
  image.addEventListener("error", () => {
    const source = image.dataset.filename || image.getAttribute("src")?.split("/").pop() || "missing-image";
    const placeholder = document.createElement("div");
    placeholder.className = "image-placeholder";
    placeholder.textContent = `Add image: ${source}`;
    placeholder.setAttribute("role", "img");
    placeholder.setAttribute("aria-label", `Add image: ${source}`);
    image.replaceWith(placeholder);
  });
});

document.querySelectorAll("video[data-filename]").forEach((video) => {
  const filename = video.dataset.filename || "missing-video";
  const sources = Array.from(video.querySelectorAll("source"));
  let sourceErrors = 0;

  const showVideoPlaceholder = () => {
    if (video.dataset.placeholderShown === "true") return;

    video.dataset.placeholderShown = "true";
    const placeholder = document.createElement("div");
    placeholder.className = "video-placeholder";
    placeholder.textContent = `Add video: ${filename}`;
    placeholder.setAttribute("role", "img");
    placeholder.setAttribute("aria-label", `Add video: ${filename}`);
    video.replaceWith(placeholder);
  };

  video.addEventListener("error", showVideoPlaceholder);

  sources.forEach((source) => {
    source.addEventListener("error", () => {
      sourceErrors += 1;
      if (sourceErrors >= sources.length && video.readyState === 0) {
        showVideoPlaceholder();
      }
    });
  });

  window.setTimeout(() => {
    const noPlayableSource =
      video.networkState === HTMLMediaElement.NETWORK_NO_SOURCE ||
      video.error ||
      (!video.currentSrc && video.readyState === 0);

    if (noPlayableSource) {
      showVideoPlaceholder();
    }
  }, 1500);
});
