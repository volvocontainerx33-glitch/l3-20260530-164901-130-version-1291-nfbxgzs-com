(function () {
  function $(selector, scope) {
    return (scope || document).querySelector(selector);
  }

  function $all(selector, scope) {
    return Array.prototype.slice.call((scope || document).querySelectorAll(selector));
  }

  function normalize(value) {
    return String(value || '').toLowerCase().trim();
  }

  function setupImages() {
    $all('img').forEach(function (img) {
      img.addEventListener('error', function () {
        img.classList.add('image-missing');
        img.removeAttribute('src');
      });
    });
  }

  function setupMobileMenu() {
    var button = $('.mobile-toggle');
    var menu = $('.mobile-menu');
    if (!button || !menu) {
      return;
    }
    button.addEventListener('click', function () {
      menu.classList.toggle('open');
      button.setAttribute('aria-expanded', menu.classList.contains('open') ? 'true' : 'false');
    });
  }

  function setupHero() {
    var hero = $('.hero');
    if (!hero) {
      return;
    }
    var slides = $all('.hero-slide', hero);
    var dots = $all('.hero-dot', hero);
    var prev = $('.hero-arrow.prev', hero);
    var next = $('.hero-arrow.next', hero);
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      if (!slides.length) {
        return;
      }
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === index);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener('click', function () {
        show(dotIndex);
        start();
      });
    });

    if (prev) {
      prev.addEventListener('click', function () {
        show(index - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(index + 1);
        start();
      });
    }

    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', start);
    show(0);
    start();
  }

  function setupHeaderSearch() {
    $all('form[data-search-form]').forEach(function (form) {
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        var input = $('input[name="q"]', form);
        var query = input ? input.value.trim() : '';
        var prefix = form.getAttribute('data-root') || './';
        var url = prefix + 'search.html';
        if (query) {
          url += '?q=' + encodeURIComponent(query);
        }
        window.location.href = url;
      });
    });
  }

  function setupPageFilter() {
    var filter = $('.page-filter');
    var grid = $('[data-card-grid]');
    if (!filter || !grid) {
      return;
    }
    var textInput = $('[data-filter-text]', filter);
    var yearSelect = $('[data-filter-year]', filter);
    var regionSelect = $('[data-filter-region]', filter);
    var typeSelect = $('[data-filter-type]', filter);
    var cards = $all('[data-card]', grid);

    function apply() {
      var text = normalize(textInput && textInput.value);
      var year = normalize(yearSelect && yearSelect.value);
      var region = normalize(regionSelect && regionSelect.value);
      var type = normalize(typeSelect && typeSelect.value);
      var visible = 0;
      cards.forEach(function (card) {
        var hay = normalize(card.getAttribute('data-title') + ' ' + card.getAttribute('data-tags') + ' ' + card.getAttribute('data-genre'));
        var ok = true;
        if (text && hay.indexOf(text) === -1) {
          ok = false;
        }
        if (year && normalize(card.getAttribute('data-year')) !== year) {
          ok = false;
        }
        if (region && normalize(card.getAttribute('data-region')).indexOf(region) === -1) {
          ok = false;
        }
        if (type && normalize(card.getAttribute('data-type')).indexOf(type) === -1) {
          ok = false;
        }
        card.style.display = ok ? '' : 'none';
        if (ok) {
          visible += 1;
        }
      });
      var empty = $('.empty-result');
      if (empty) {
        empty.style.display = visible ? 'none' : '';
      }
    }

    [textInput, yearSelect, regionSelect, typeSelect].forEach(function (control) {
      if (control) {
        control.addEventListener('input', apply);
        control.addEventListener('change', apply);
      }
    });
    apply();
  }

  document.addEventListener('DOMContentLoaded', function () {
    setupImages();
    setupMobileMenu();
    setupHero();
    setupHeaderSearch();
    setupPageFilter();
  });
})();
