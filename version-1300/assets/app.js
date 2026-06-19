(function () {
    var menuButton = document.querySelector('[data-menu-button]');
    var mobilePanel = document.querySelector('[data-mobile-panel]');

    if (menuButton && mobilePanel) {
        menuButton.addEventListener('click', function () {
            mobilePanel.classList.toggle('is-open');
        });
    }

    document.querySelectorAll('[data-hero-carousel]').forEach(function (carousel) {
        var slides = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-dot]'));
        var index = 0;
        var timer = null;

        function show(nextIndex) {
            if (!slides.length) {
                return;
            }
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle('is-active', i === index);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle('is-active', i === index);
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

        dots.forEach(function (dot, i) {
            dot.addEventListener('click', function () {
                show(i);
                start();
            });
        });

        carousel.addEventListener('mouseenter', stop);
        carousel.addEventListener('mouseleave', start);
        show(0);
        start();
    });

    document.querySelectorAll('[data-filter-panel]').forEach(function (panel) {
        var input = panel.querySelector('[data-filter-input]');
        var year = panel.querySelector('[data-filter-year]');
        var region = panel.querySelector('[data-filter-region]');
        var type = panel.querySelector('[data-filter-type]');
        var category = panel.querySelector('[data-filter-category]');
        var list = document.querySelector('[data-filter-list]');
        var empty = document.querySelector('[data-empty-state]');

        if (!list) {
            return;
        }

        var cards = Array.prototype.slice.call(list.querySelectorAll('.movie-card'));
        var params = new URLSearchParams(window.location.search);
        var query = params.get('q') || '';

        if (input && query) {
            input.value = query;
        }

        function valueOf(control) {
            return control ? control.value.trim().toLowerCase() : '';
        }

        function searchable(card) {
            return [
                card.getAttribute('data-title'),
                card.getAttribute('data-region'),
                card.getAttribute('data-type'),
                card.getAttribute('data-year'),
                card.getAttribute('data-genre'),
                card.getAttribute('data-tags'),
                card.getAttribute('data-category'),
                card.textContent
            ].join(' ').toLowerCase();
        }

        function apply() {
            var q = valueOf(input);
            var y = valueOf(year);
            var r = valueOf(region);
            var t = valueOf(type);
            var c = valueOf(category);
            var visible = 0;

            cards.forEach(function (card) {
                var content = searchable(card);
                var match = true;

                if (q && content.indexOf(q) === -1) {
                    match = false;
                }
                if (y && String(card.getAttribute('data-year')).toLowerCase().indexOf(y) === -1) {
                    match = false;
                }
                if (r && String(card.getAttribute('data-region')).toLowerCase().indexOf(r) === -1) {
                    match = false;
                }
                if (t && String(card.getAttribute('data-type')).toLowerCase().indexOf(t) === -1) {
                    match = false;
                }
                if (c && String(card.getAttribute('data-category')).toLowerCase().indexOf(c) === -1) {
                    match = false;
                }

                card.hidden = !match;
                if (match) {
                    visible += 1;
                }
            });

            if (empty) {
                empty.hidden = visible !== 0;
            }
        }

        [input, year, region, type, category].forEach(function (control) {
            if (control) {
                control.addEventListener('input', apply);
                control.addEventListener('change', apply);
            }
        });

        apply();
    });
})();
