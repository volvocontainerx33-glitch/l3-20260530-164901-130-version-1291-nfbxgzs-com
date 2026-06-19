(function () {
  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  function normalize(value) {
    return (value || "").toString().toLowerCase().trim();
  }

  function bindHeader() {
    var toggle = document.querySelector("[data-mobile-toggle]");
    var nav = document.querySelector("[data-mobile-nav]");
    if (toggle && nav) {
      toggle.addEventListener("click", function () {
        nav.classList.toggle("is-open");
      });
    }
  }

  function bindHero() {
    var root = document.querySelector("[data-hero]");
    if (!root) {
      return;
    }
    var slides = Array.prototype.slice.call(root.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(root.querySelectorAll("[data-hero-dot]"));
    var prev = root.querySelector("[data-hero-prev]");
    var next = root.querySelector("[data-hero-next]");
    var index = 0;
    var timer;

    function show(nextIndex) {
      if (!slides.length) {
        return;
      }
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("is-active", i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === index);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5000);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
      }
    }

    if (prev) {
      prev.addEventListener("click", function () {
        show(index - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        show(index + 1);
        start();
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        show(Number(dot.getAttribute("data-hero-dot")) || 0);
        start();
      });
    });

    root.addEventListener("mouseenter", stop);
    root.addEventListener("mouseleave", start);
    show(0);
    start();
  }

  function bindSiteSearch() {
    document.querySelectorAll("[data-site-search]").forEach(function (form) {
      form.addEventListener("submit", function (event) {
        var input = form.querySelector("input[name='q']");
        if (!input || !input.value.trim()) {
          event.preventDefault();
          window.location.href = "./search.html";
        }
      });
    });
  }

  function bindFilters() {
    document.querySelectorAll("[data-filter-form]").forEach(function (form) {
      var input = form.querySelector("[data-filter-input]");
      var list = document.querySelector("[data-filter-list]");
      var count = document.querySelector("[data-filter-count]");
      if (!input || !list) {
        return;
      }
      var cards = Array.prototype.slice.call(list.querySelectorAll(".movie-card"));
      var params = new URLSearchParams(window.location.search);
      var initial = params.get("q") || "";
      if (initial) {
        input.value = initial;
      }

      function apply() {
        var query = normalize(input.value);
        var visible = 0;
        cards.forEach(function (card) {
          var haystack = normalize([
            card.getAttribute("data-title"),
            card.getAttribute("data-region"),
            card.getAttribute("data-year"),
            card.getAttribute("data-genre"),
            card.getAttribute("data-tags")
          ].join(" "));
          var matched = !query || haystack.indexOf(query) !== -1;
          card.classList.toggle("is-hidden", !matched);
          if (matched) {
            visible += 1;
          }
        });
        if (count) {
          count.textContent = visible + " 部影片";
        }
      }

      input.addEventListener("input", apply);
      form.addEventListener("reset", function () {
        window.setTimeout(apply, 0);
      });
      form.addEventListener("submit", function (event) {
        if (form.classList.contains("search-page-bar")) {
          return;
        }
        event.preventDefault();
        apply();
      });
      apply();
    });
  }

  window.initMoviePlayer = function (videoId, source) {
    ready(function () {
      var video = document.getElementById(videoId);
      if (!video || !source) {
        return;
      }
      var shell = video.closest(".player-shell");
      var layer = shell ? shell.querySelector(".play-layer") : null;
      var loaded = false;
      var hls = null;

      function load() {
        if (loaded) {
          return;
        }
        loaded = true;
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = source;
        } else if (window.Hls && window.Hls.isSupported()) {
          hls = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true
          });
          hls.loadSource(source);
          hls.attachMedia(video);
        } else {
          video.src = source;
        }
      }

      function showLayer(show) {
        if (layer) {
          layer.classList.toggle("is-hidden", !show);
        }
      }

      function start() {
        load();
        showLayer(false);
        var played = video.play();
        if (played && played.catch) {
          played.catch(function () {
            showLayer(true);
          });
        }
      }

      if (layer) {
        layer.addEventListener("click", start);
      }

      video.addEventListener("click", function () {
        if (video.paused) {
          start();
        } else {
          video.pause();
        }
      });

      video.addEventListener("play", function () {
        showLayer(false);
      });

      video.addEventListener("ended", function () {
        showLayer(true);
      });

      window.addEventListener("pagehide", function () {
        if (hls) {
          hls.destroy();
        }
      });
    });
  };

  ready(function () {
    bindHeader();
    bindHero();
    bindSiteSearch();
    bindFilters();
  });
})();
