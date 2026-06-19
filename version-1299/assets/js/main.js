(function () {
  var toggle = document.querySelector('.menu-toggle');
  var panel = document.querySelector('.mobile-panel');
  if (toggle && panel) {
    toggle.addEventListener('click', function () {
      panel.classList.toggle('open');
    });
  }

  var carousel = document.querySelector('[data-carousel]');
  if (carousel) {
    var slides = Array.prototype.slice.call(carousel.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(carousel.querySelectorAll('.hero-dot'));
    var index = 0;
    var show = function (next) {
      index = next;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('active', i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === index);
      });
    };
    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(Number(dot.getAttribute('data-target')) || 0);
      });
    });
    setInterval(function () {
      show((index + 1) % slides.length);
    }, 5200);
  }

  document.querySelectorAll('[data-filter-scope]').forEach(function (scope) {
    var wrap = scope.parentElement;
    var input = scope.querySelector('.filter-input');
    var year = scope.querySelector('.filter-year');
    var region = scope.querySelector('.filter-region');
    var items = Array.prototype.slice.call(wrap.querySelectorAll('.filter-item'));
    var apply = function () {
      var q = (input && input.value || '').trim().toLowerCase();
      var y = year && year.value || '';
      var r = region && region.value || '';
      items.forEach(function (item) {
        var haystack = [
          item.getAttribute('data-title'),
          item.getAttribute('data-year'),
          item.getAttribute('data-region'),
          item.getAttribute('data-type'),
          item.getAttribute('data-genre')
        ].join(' ').toLowerCase();
        var ok = true;
        if (q && haystack.indexOf(q) === -1) ok = false;
        if (y && item.getAttribute('data-year') !== y) ok = false;
        if (r && item.getAttribute('data-region') !== r) ok = false;
        item.classList.toggle('hidden-by-filter', !ok);
      });
    };
    [input, year, region].forEach(function (el) {
      if (el) el.addEventListener('input', apply);
      if (el) el.addEventListener('change', apply);
    });
  });

  document.querySelectorAll('.player-shell').forEach(function (shell) {
    var video = shell.querySelector('video');
    var button = shell.querySelector('.play-overlay');
    var src = shell.getAttribute('data-video-src');
    var hlsInstance = null;
    var loaded = false;

    var load = function () {
      if (loaded || !video || !src) return;
      loaded = true;
      if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        });
        hlsInstance.loadSource(src);
        hlsInstance.attachMedia(video);
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = src;
      } else {
        video.src = src;
      }
    };

    var play = function () {
      load();
      var promise = video.play();
      if (promise && promise.catch) {
        promise.catch(function () {});
      }
    };

    if (button) {
      button.addEventListener('click', function (event) {
        event.preventDefault();
        play();
      });
    }

    video.addEventListener('click', function () {
      if (video.paused) {
        play();
      }
    });

    video.addEventListener('play', function () {
      shell.classList.add('playing');
    });

    video.addEventListener('pause', function () {
      if (!video.ended) {
        shell.classList.remove('playing');
      }
    });

    video.addEventListener('ended', function () {
      shell.classList.remove('playing');
    });
  });
})();
