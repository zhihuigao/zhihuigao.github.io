/*
 * Site behaviour for zhihuigao.github.io
 *
 * Replaces the per-entry inline onclick handlers that used to be pasted into
 * every publication in the Markdown. Each entry now only needs:
 *
 *   <button class="bib-toggle" data-bib="bibtex-key">BibTeX</button>
 *   <div class="bib" id="bibtex-key"><pre>...</pre></div>
 *
 * Vanilla JS with delegated events, so it works regardless of script order
 * and keeps working for entries added later.
 */
(function () {
  "use strict";

  function setup() {
    var toggles = document.querySelectorAll(".bib-toggle");

    Array.prototype.forEach.call(toggles, function (btn) {
      btn.setAttribute("aria-expanded", "false");
      if (btn.getAttribute("data-bib")) {
        btn.setAttribute("aria-controls", btn.getAttribute("data-bib"));
      }
    });

    // A "copy" affordance on each BibTeX block.
    if (navigator.clipboard) {
      Array.prototype.forEach.call(document.querySelectorAll(".bib"), addCopyButton);
    }
  }

  function addCopyButton(panel) {
    var pre = panel.querySelector("pre");
    if (!pre || panel.querySelector(".bib-copy")) return;

    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "bib-copy";
    btn.textContent = "Copy";
    btn.addEventListener("click", function () {
      navigator.clipboard.writeText(pre.textContent.trim()).then(function () {
        btn.textContent = "Copied";
        setTimeout(function () {
          btn.textContent = "Copy";
        }, 1500);
      });
    });

    panel.appendChild(btn);
  }

  document.addEventListener("click", function (event) {
    var btn = event.target.closest && event.target.closest(".bib-toggle");
    if (!btn) return;

    event.preventDefault();

    var panel = document.getElementById(btn.getAttribute("data-bib"));
    if (!panel) return;

    var isOpen = panel.classList.toggle("is-open");
    btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setup);
  } else {
    setup();
  }
})();
