(function () {
  var menuButton = document.querySelector("[data-menu-button]");
  var mobileMenu = document.querySelector("[data-mobile-menu]");
  if (menuButton && mobileMenu) {
    menuButton.addEventListener("click", function () {
      mobileMenu.classList.toggle("open");
    });
  }

  var slider = document.querySelector("[data-hero-slider]");
  if (slider) {
    var slides = Array.prototype.slice.call(slider.querySelectorAll("[data-slide]"));
    var dots = Array.prototype.slice.call(slider.querySelectorAll("[data-slide-dot]"));
    var prev = slider.querySelector("[data-prev-slide]");
    var next = slider.querySelector("[data-next-slide]");
    var index = 0;
    var timer = null;

    function showSlide(nextIndex) {
      if (!slides.length) {
        return;
      }
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("active", i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("active", i === index);
      });
    }

    function restart() {
      if (timer) {
        window.clearInterval(timer);
      }
      timer = window.setInterval(function () {
        showSlide(index + 1);
      }, 5200);
    }

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        showSlide(Number(dot.getAttribute("data-slide-dot")) || 0);
        restart();
      });
    });

    if (prev) {
      prev.addEventListener("click", function () {
        showSlide(index - 1);
        restart();
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        showSlide(index + 1);
        restart();
      });
    }

    showSlide(0);
    restart();
  }

  function normalize(value) {
    return String(value || "").toLowerCase().trim();
  }

  var filterInputs = Array.prototype.slice.call(document.querySelectorAll("[data-filter-input]"));
  var filterList = document.querySelector("[data-filter-list]");
  if (filterList && filterInputs.length) {
    var cards = Array.prototype.slice.call(filterList.querySelectorAll(".movie-card"));
    var params = new URLSearchParams(window.location.search);
    var query = params.get("q") || "";

    function applyFilter(value) {
      var key = normalize(value);
      cards.forEach(function (card) {
        var haystack = normalize([
          card.getAttribute("data-title"),
          card.getAttribute("data-year"),
          card.getAttribute("data-region"),
          card.getAttribute("data-genre"),
          card.getAttribute("data-tags")
        ].join(" "));
        card.setAttribute("data-hidden", key && haystack.indexOf(key) === -1 ? "true" : "false");
      });
    }

    filterInputs.forEach(function (input) {
      if (query) {
        input.value = query;
      }
      input.addEventListener("input", function () {
        applyFilter(input.value);
      });
    });

    Array.prototype.slice.call(document.querySelectorAll("[data-filter-chip]")).forEach(function (chip) {
      chip.addEventListener("click", function () {
        var value = chip.getAttribute("data-filter-chip") || "";
        filterInputs.forEach(function (input) {
          input.value = value;
        });
        applyFilter(value);
      });
    });

    applyFilter(query);
  }
})();
