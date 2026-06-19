(function () {
  var toggle = document.querySelector('[data-nav-toggle]');
  var mobileNav = document.querySelector('[data-mobile-nav]');

  if (toggle && mobileNav) {
    toggle.addEventListener('click', function () {
      mobileNav.classList.toggle('is-open');
    });
  }

  var hero = document.querySelector('[data-hero]');

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('.hero-dot'));
    var active = 0;

    function show(index) {
      if (!slides.length) {
        return;
      }

      active = (index + slides.length) % slides.length;
      slides.forEach(function (slide, itemIndex) {
        slide.classList.toggle('is-active', itemIndex === active);
      });
      dots.forEach(function (dot, itemIndex) {
        dot.classList.toggle('is-active', itemIndex === active);
      });
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        show(index);
      });
    });

    show(0);

    if (slides.length > 1) {
      window.setInterval(function () {
        show(active + 1);
      }, 5200);
    }
  }

  Array.prototype.slice.call(document.querySelectorAll('[data-filter-root]')).forEach(function (root) {
    var input = root.querySelector('[data-filter-input]');
    var type = root.querySelector('[data-filter-type]');
    var year = root.querySelector('[data-filter-year]');
    var cards = Array.prototype.slice.call(root.querySelectorAll('[data-movie-card]'));
    var empty = root.querySelector('[data-empty-state]');

    function apply() {
      var keyword = input ? input.value.trim().toLowerCase() : '';
      var typeValue = type ? type.value : '';
      var yearValue = year ? year.value : '';
      var shown = 0;

      cards.forEach(function (card) {
        var text = (card.getAttribute('data-search') || '').toLowerCase();
        var cardType = card.getAttribute('data-type') || '';
        var cardYear = card.getAttribute('data-year') || '';
        var matchKeyword = !keyword || text.indexOf(keyword) !== -1;
        var matchType = !typeValue || cardType === typeValue;
        var matchYear = !yearValue || cardYear === yearValue;
        var visible = matchKeyword && matchType && matchYear;

        card.style.display = visible ? '' : 'none';
        if (visible) {
          shown += 1;
        }
      });

      if (empty) {
        empty.classList.toggle('is-visible', shown === 0);
      }
    }

    [input, type, year].forEach(function (element) {
      if (element) {
        element.addEventListener('input', apply);
        element.addEventListener('change', apply);
      }
    });

    apply();
  });
})();
