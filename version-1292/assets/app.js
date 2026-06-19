(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function setupNavigation() {
    var toggle = document.querySelector("[data-nav-toggle]");
    var panel = document.querySelector("[data-mobile-panel]");
    if (!toggle || !panel) {
      return;
    }
    toggle.addEventListener("click", function () {
      panel.classList.toggle("is-open");
    });
  }

  function setupHero() {
    var hero = document.querySelector("[data-hero]");
    if (!hero) {
      return;
    }
    var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
    var prev = hero.querySelector("[data-hero-prev]");
    var next = hero.querySelector("[data-hero-next]");
    var index = 0;

    function show(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, position) {
        slide.classList.toggle("is-active", position === index);
      });
      dots.forEach(function (dot, position) {
        dot.classList.toggle("is-active", position === index);
      });
    }

    if (prev) {
      prev.addEventListener("click", function () {
        show(index - 1);
      });
    }
    if (next) {
      next.addEventListener("click", function () {
        show(index + 1);
      });
    }
    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        show(Number(dot.getAttribute("data-hero-dot")) || 0);
      });
    });
    window.setInterval(function () {
      show(index + 1);
    }, 5200);
  }

  function normalize(value) {
    return String(value || "").toLowerCase().trim();
  }

  function setupFilters() {
    var form = document.querySelector("[data-filter-form]");
    var list = document.querySelector("[data-filter-list]");
    if (!form || !list) {
      return;
    }
    var queryInput = form.querySelector("[data-filter-query]");
    var regionSelect = form.querySelector("[data-filter-region]");
    var typeSelect = form.querySelector("[data-filter-type]");
    var emptyState = document.querySelector("[data-empty-state]");
    var cards = Array.prototype.slice.call(list.querySelectorAll(".movie-card"));
    var params = new URLSearchParams(window.location.search);
    var initialQuery = params.get("q");
    if (initialQuery && queryInput) {
      queryInput.value = initialQuery;
    }

    function cardText(card) {
      return normalize([
        card.getAttribute("data-title"),
        card.getAttribute("data-region"),
        card.getAttribute("data-type"),
        card.getAttribute("data-genre"),
        card.getAttribute("data-year"),
        card.textContent
      ].join(" "));
    }

    function applyFilter() {
      var query = normalize(queryInput ? queryInput.value : "");
      var region = normalize(regionSelect ? regionSelect.value : "");
      var type = normalize(typeSelect ? typeSelect.value : "");
      var visible = 0;
      cards.forEach(function (card) {
        var text = cardText(card);
        var matchQuery = !query || text.indexOf(query) !== -1;
        var matchRegion = !region || normalize(card.getAttribute("data-region")).indexOf(region) !== -1;
        var matchType = !type || normalize(card.getAttribute("data-type")).indexOf(type) !== -1;
        var show = matchQuery && matchRegion && matchType;
        card.hidden = !show;
        if (show) {
          visible += 1;
        }
      });
      if (emptyState) {
        emptyState.hidden = visible !== 0;
      }
    }

    form.addEventListener("input", applyFilter);
    form.addEventListener("change", applyFilter);
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      applyFilter();
    });
    applyFilter();
  }

  ready(function () {
    setupNavigation();
    setupHero();
    setupFilters();
  });
})();
