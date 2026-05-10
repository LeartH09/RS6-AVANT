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

document.querySelectorAll("[data-collapsible]").forEach((container, index) => {
  const itemSelector = container.dataset.collapsibleItems;
  const items = itemSelector
    ? Array.from(container.querySelectorAll(itemSelector))
    : Array.from(container.children);
  const visibleCount = Number.parseInt(container.dataset.visibleCount || "6", 10);

  if (items.length <= visibleCount) return;

  if (!container.id) {
    container.id = `collapsible-${index + 1}`;
  }

  const label = container.dataset.showLabel || "items";
  const toggle = document.createElement("button");
  toggle.className = "show-toggle";
  toggle.type = "button";
  toggle.setAttribute("aria-controls", container.id);
  toggle.setAttribute("aria-expanded", "false");

  const setExpanded = (expanded, fromUser = false) => {
    items.forEach((item, itemIndex) => {
      const shouldHide = !expanded && itemIndex >= visibleCount;
      item.classList.toggle("collapsible-hidden", shouldHide);

      if (expanded && fromUser) {
        item.classList.add("is-visible");
      }
    });

    toggle.textContent = expanded ? `Show less ${label}` : `Show more ${label}`;
    toggle.setAttribute("aria-expanded", String(expanded));
    container.classList.toggle("is-expanded", expanded);
  };

  setExpanded(false);

  toggle.addEventListener("click", () => {
    const expanded = toggle.getAttribute("aria-expanded") === "true";
    setExpanded(!expanded, true);
  });

  container.insertAdjacentElement("afterend", toggle);
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
