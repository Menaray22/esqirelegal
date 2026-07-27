/* ==========================================================================
   Esquires' Legal — shared site behavior
   No build step, no dependencies. Loaded on every page.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {
  initHeaderHeightVar();
  initHeaderScroll();
  initNavToggle();
  initRevealOnScroll();
  initImageFallbacks();
  initFooterYear();
  initPracticeAccordion();
  initSiteSettings();
});

/*
 * The mobile nav drawer and the Principal Counsel sticky sidebar both need
 * to sit just below the header, but the header's real height depends on
 * loaded fonts and viewport width — not a fixed number. This measures it
 * and exposes it as --header-h so the CSS never has to guess.
 */
function initHeaderHeightVar() {
  var header = document.querySelector(".site-header");
  if (!header) return;
  var setVar = function () {
    document.documentElement.style.setProperty("--header-h", header.offsetHeight + "px");
  };
  setVar();
  window.addEventListener("resize", setVar);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(setVar);
  }
}

/* Adds a shadow/border to the sticky header once the page has scrolled. */
function initHeaderScroll() {
  var header = document.querySelector(".site-header");
  if (!header) return;
  var onScroll = function () {
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

/* Mobile nav open/close. */
function initNavToggle() {
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("primary-nav");
  if (!toggle || !nav) return;
  toggle.addEventListener("click", function () {
    var isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
    document.body.style.overflow = isOpen ? "hidden" : "";
  });
  nav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    });
  });
}

/* Fades/lifts elements marked .reveal into place as they enter the viewport. */
function initRevealOnScroll() {
  var items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion || !("IntersectionObserver" in window)) {
    items.forEach(function (el) { el.classList.add("is-visible"); });
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
  );

  items.forEach(function (el, i) {
    el.style.transitionDelay = (i % 3) * 90 + "ms";
    observer.observe(el);
  });
}

/*
 * Image fallback system.
 *
 * Every real photo on the site is referenced by a stable key via
 * data-image-key, at a predictable path: images/<key>.<ext>. Until the
 * client's actual photography is uploaded (directly, or later through the
 * Decap CMS media library), the file simply won't exist yet — this handler
 * catches that 404 and swaps the broken <img> for a styled placeholder that
 * names the shot that belongs there, so the layout stays production-ready
 * with zero code changes once the real file lands at the same path.
 */
function initImageFallbacks() {
  var images = document.querySelectorAll("img[data-image-key]");
  images.forEach(function (img) {
    img.addEventListener(
      "error",
      function () {
        if (img.dataset.fallbackApplied) return;
        img.dataset.fallbackApplied = "true";

        if (img.dataset.imageKey === "logo") {
          var wordmark = document.createElement("span");
          wordmark.className = "brand__type";
          wordmark.innerHTML = "Esquires&rsquo; <em>legal</em>";
          img.replaceWith(wordmark);
          return;
        }

        var wrap = document.createElement("div");
        wrap.className = "img-slot img-slot--empty" + (img.className ? " " + img.className : "");

        var label = document.createElement("span");
        label.className = "img-slot__label";
        label.textContent = img.dataset.placeholderLabel || img.alt || "Image coming soon";
        wrap.appendChild(label);

        img.replaceWith(wrap);
      },
      { once: true }
    );
  });
}

function initFooterYear() {
  var el = document.getElementById("footer-year");
  if (el) el.textContent = String(new Date().getFullYear());
}

/*
 * Practice Areas accordion. Each item is a native disclosure pattern
 * (button + aria-expanded + a hidden panel) rather than a single
 * exclusive accordion, so more than one area can stay open at once —
 * useful when someone's comparing two practice areas side by side.
 *
 * Also supports deep links from other pages, e.g. a link to
 * practice-areas.html#practice-4 will open that item and scroll to it.
 */
function initPracticeAccordion() {
  var triggers = document.querySelectorAll(".practice-item__trigger button");
  if (!triggers.length) return;

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  triggers.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var isOpen = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!isOpen));
      var panel = document.getElementById(btn.getAttribute("aria-controls"));
      if (panel) panel.hidden = isOpen;
    });
  });

  function openFromHash() {
    var id = window.location.hash.replace("#", "");
    if (!id) return;
    var item = document.getElementById(id);
    if (!item) return;
    var btn = item.querySelector(".practice-item__trigger button");
    var panel = item.querySelector(".practice-item__panel");
    if (!btn || !panel) return;
    btn.setAttribute("aria-expanded", "true");
    panel.hidden = false;
    window.requestAnimationFrame(function () {
      item.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    });
  }

  openFromHash();
  window.addEventListener("hashchange", openFromHash);
}

/*
 * Site settings (phones, emails, business hours, social links) live in
 * content/settings.json — that's the one content file Decap CMS's "Site
 * Settings" entry actually edits. Everything else on the site is the
 * firm's supplied copy, authored directly in the HTML.
 *
 * Elements opt in with data-cms attributes:
 *   data-cms-text="hours.weekday"   -> replaces the element's text
 *   data-cms-tel="phones.0"         -> replaces text AND the tel: href
 *   data-cms-email="emails.0"       -> replaces text AND the mailto: href
 *   data-cms-href="social.linkedin" -> replaces just the href
 *
 * If the fetch fails (e.g. opened straight from the filesystem, no
 * server), the page silently keeps the values already in the HTML —
 * those are the same values settings.json ships with, just not live.
 */
function initSiteSettings() {
  var hasTargets = document.querySelector("[data-cms-text],[data-cms-tel],[data-cms-email],[data-cms-href]");
  if (!hasTargets) return;

  fetch("content/settings.json")
    .then(function (res) { return res.ok ? res.json() : null; })
    .then(function (data) {
      if (!data) return;

      var get = function (path) {
        return path.split(".").reduce(function (obj, key) {
          return obj && obj[key] !== undefined ? obj[key] : undefined;
        }, data);
      };

      document.querySelectorAll("[data-cms-text]").forEach(function (el) {
        var val = get(el.getAttribute("data-cms-text"));
        if (val !== undefined) el.textContent = val;
      });
      document.querySelectorAll("[data-cms-tel]").forEach(function (el) {
        var val = get(el.getAttribute("data-cms-tel"));
        if (val !== undefined) {
          el.textContent = val;
          el.setAttribute("href", "tel:" + val.replace(/[^\d+]/g, ""));
        }
      });
      document.querySelectorAll("[data-cms-email]").forEach(function (el) {
        var val = get(el.getAttribute("data-cms-email"));
        if (val !== undefined) {
          el.textContent = val;
          el.setAttribute("href", "mailto:" + val);
        }
      });
      document.querySelectorAll("[data-cms-href]").forEach(function (el) {
        var val = get(el.getAttribute("data-cms-href"));
        if (val !== undefined) el.setAttribute("href", val);
      });
    })
    .catch(function () {
      /* Fetch failed (e.g. file:// origin) — keep the static values already in the HTML. */
    });
}
