(function () {
    var menuButton = document.querySelector('[data-menu-button]');
    var mobileNav = document.querySelector('[data-mobile-nav]');

    if (menuButton && mobileNav) {
        menuButton.addEventListener('click', function () {
            mobileNav.classList.toggle('open');
        });
    }

    document.querySelectorAll('[data-search-form]').forEach(function (form) {
        form.addEventListener('submit', function (event) {
            var localInput = form.querySelector('[data-local-search]');
            if (localInput) {
                event.preventDefault();
                applyLocalFilters(form.closest('[data-filter-panel]') || document);
            }
        });
    });

    function normalizeText(value) {
        return String(value || '').toLowerCase().replace(/\s+/g, '');
    }

    function applyLocalFilters(scope) {
        var panel = scope && scope.matches && scope.matches('[data-filter-panel]') ? scope : document.querySelector('[data-filter-panel]');
        if (!panel) {
            return;
        }

        var queryInput = panel.querySelector('[data-local-search]');
        var query = normalizeText(queryInput ? queryInput.value : '');
        var categoryButton = panel.querySelector('[data-filter-button].active');
        var typeButton = panel.querySelector('[data-filter-type].active');
        var selectedCategory = categoryButton ? categoryButton.getAttribute('data-filter-button') : '';
        var selectedType = typeButton ? typeButton.getAttribute('data-filter-type') : '';
        var cards = document.querySelectorAll('.searchable-card');
        var visible = 0;

        cards.forEach(function (card) {
            var haystack = normalizeText(card.getAttribute('data-search'));
            var category = card.getAttribute('data-category') || '';
            var type = card.getAttribute('data-type') || '';
            var matchedQuery = !query || haystack.indexOf(query) !== -1;
            var matchedCategory = !selectedCategory || category === selectedCategory || haystack.indexOf(normalizeText(selectedCategory)) !== -1;
            var matchedType = !selectedType || type.indexOf(selectedType) !== -1 || haystack.indexOf(normalizeText(selectedType)) !== -1;
            var matched = matchedQuery && matchedCategory && matchedType;
            card.hidden = !matched;
            if (matched) {
                visible += 1;
            }
        });

        var emptyState = document.querySelector('[data-empty-state]');
        if (emptyState) {
            emptyState.hidden = visible !== 0;
        }
    }

    document.querySelectorAll('[data-filter-button]').forEach(function (button) {
        button.addEventListener('click', function () {
            var group = button.parentElement;
            group.querySelectorAll('[data-filter-button]').forEach(function (item) {
                item.classList.remove('active');
            });
            button.classList.add('active');
            applyLocalFilters(button.closest('[data-filter-panel]'));
        });
    });

    document.querySelectorAll('[data-filter-type]').forEach(function (button) {
        button.addEventListener('click', function () {
            var group = button.parentElement;
            group.querySelectorAll('[data-filter-type]').forEach(function (item) {
                item.classList.remove('active');
            });
            button.classList.add('active');
            applyLocalFilters(button.closest('[data-filter-panel]'));
        });
    });

    document.querySelectorAll('[data-local-search]').forEach(function (input) {
        input.addEventListener('input', function () {
            applyLocalFilters(input.closest('[data-filter-panel]'));
        });
    });

    var params = new URLSearchParams(window.location.search);
    var query = params.get('q');
    if (query) {
        document.querySelectorAll('input[name="q"]').forEach(function (input) {
            input.value = query;
        });
        var local = document.querySelector('[data-local-search]');
        if (local) {
            applyLocalFilters(local.closest('[data-filter-panel]'));
        }
    }

    var hero = document.querySelector('[data-hero]');
    document.querySelectorAll('[data-play-button]').forEach(function (button) {
        button.addEventListener('click', function () {
            var target = document.getElementById(button.getAttribute('data-play-button'));
            if (target) {
                target.click();
            }
        });
    });

    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        var prev = hero.querySelector('[data-hero-prev]');
        var next = hero.querySelector('[data-hero-next]');
        var index = 0;
        var timer = null;

        function showSlide(nextIndex) {
            if (!slides.length) {
                return;
            }
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('active', slideIndex === index);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('active', dotIndex === index);
            });
        }

        function startTimer() {
            stopTimer();
            timer = window.setInterval(function () {
                showSlide(index + 1);
            }, 5600);
        }

        function stopTimer() {
            if (timer) {
                window.clearInterval(timer);
            }
        }

        dots.forEach(function (dot, dotIndex) {
            dot.addEventListener('click', function () {
                showSlide(dotIndex);
                startTimer();
            });
        });

        if (prev) {
            prev.addEventListener('click', function () {
                showSlide(index - 1);
                startTimer();
            });
        }

        if (next) {
            next.addEventListener('click', function () {
                showSlide(index + 1);
                startTimer();
            });
        }

        hero.addEventListener('mouseenter', stopTimer);
        hero.addEventListener('mouseleave', startTimer);
        showSlide(0);
        startTimer();
    }
})();

function setupPlayer(videoId, buttonId, streamUrl) {
    var video = document.getElementById(videoId);
    var button = document.getElementById(buttonId);
    var hls = null;
    var loaded = false;

    if (!video || !button || !streamUrl) {
        return;
    }

    function loadStream() {
        if (loaded) {
            return;
        }
        loaded = true;

        if (window.Hls && window.Hls.isSupported()) {
            hls = new window.Hls({
                enableWorker: true,
                lowLatencyMode: true,
                backBufferLength: 90
            });
            hls.loadSource(streamUrl);
            hls.attachMedia(video);
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = streamUrl;
        }
    }

    function startPlayback() {
        loadStream();
        button.classList.add('hidden');
        var promise = video.play();
        if (promise && typeof promise.catch === 'function') {
            promise.catch(function () {});
        }
    }

    button.addEventListener('click', startPlayback);
    video.addEventListener('click', function () {
        if (video.paused) {
            startPlayback();
        }
    });
    video.addEventListener('play', function () {
        button.classList.add('hidden');
    });
    video.addEventListener('pause', function () {
        if (!video.ended) {
            button.classList.remove('hidden');
        }
    });
    window.addEventListener('beforeunload', function () {
        if (hls) {
            hls.destroy();
        }
    });
}
