(function () {
  var menuButton = document.querySelector('.menu-toggle');
  var mobileNav = document.querySelector('.mobile-nav');

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      var open = mobileNav.classList.toggle('is-open');
      menuButton.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
  var current = 0;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }

    current = (index + slides.length) % slides.length;

    slides.forEach(function (slide, i) {
      slide.classList.toggle('is-active', i === current);
    });

    dots.forEach(function (dot, i) {
      dot.classList.toggle('is-active', i === current);
    });
  }

  dots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      var target = Number(dot.getAttribute('data-target') || 0);
      showSlide(target);
    });
  });

  if (slides.length > 1) {
    setInterval(function () {
      showSlide(current + 1);
    }, 5200);
  }

  var searchParams = new URLSearchParams(window.location.search);
  var initialQuery = searchParams.get('q') || '';
  var searchInputs = Array.prototype.slice.call(document.querySelectorAll('.card-filter'));
  var yearFilters = Array.prototype.slice.call(document.querySelectorAll('.year-filter'));
  var typeFilters = Array.prototype.slice.call(document.querySelectorAll('.type-filter'));
  var cards = Array.prototype.slice.call(document.querySelectorAll('.filter-grid .movie-card'));

  searchInputs.forEach(function (input) {
    if (initialQuery) {
      input.value = initialQuery;
    }
  });

  function normalize(value) {
    return String(value || '').trim().toLowerCase();
  }

  function applyFilters() {
    var keyword = normalize(searchInputs[0] ? searchInputs[0].value : '');
    var year = normalize(yearFilters[0] ? yearFilters[0].value : '');
    var type = normalize(typeFilters[0] ? typeFilters[0].value : '');

    cards.forEach(function (card) {
      var haystack = normalize([
        card.getAttribute('data-title'),
        card.getAttribute('data-year'),
        card.getAttribute('data-type'),
        card.getAttribute('data-region'),
        card.getAttribute('data-tags')
      ].join(' '));
      var cardYear = normalize(card.getAttribute('data-year'));
      var cardType = normalize(card.getAttribute('data-type'));
      var matchedKeyword = !keyword || haystack.indexOf(keyword) !== -1;
      var matchedYear = !year || cardYear === year;
      var matchedType = !type || cardType.indexOf(type) !== -1;
      card.classList.toggle('is-hidden', !(matchedKeyword && matchedYear && matchedType));
    });
  }

  searchInputs.concat(yearFilters).concat(typeFilters).forEach(function (control) {
    control.addEventListener('input', applyFilters);
    control.addEventListener('change', applyFilters);
  });

  if (cards.length) {
    applyFilters();
  }
}());
