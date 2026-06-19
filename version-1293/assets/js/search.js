(function () {
  function escapeHtml(value) {
    return String(value || '').replace(/[&<>"]/g, function (character) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;'
      }[character];
    });
  }

  function normalize(value) {
    return String(value || '').toLowerCase().trim();
  }

  function readParams() {
    var params = new URLSearchParams(window.location.search);
    return {
      q: params.get('q') || '',
      year: params.get('year') || '',
      region: params.get('region') || '',
      type: params.get('type') || ''
    };
  }

  function card(movie) {
    var tags = Array.isArray(movie.tags) ? movie.tags.slice(0, 3).join(' / ') : '';
    return [
      '<article class="movie-card" data-card>',
      '<a class="movie-link" href="' + escapeHtml(movie.url) + '">',
      '<div class="poster">',
      '<img src="' + escapeHtml(movie.cover) + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">',
      '<span class="poster-badge">' + escapeHtml(movie.year) + '</span>',
      '<span class="poster-play"><span class="play-circle">▶</span></span>',
      '</div>',
      '<div class="card-body">',
      '<h3 class="card-title">' + escapeHtml(movie.title) + '</h3>',
      '<div class="card-meta">' + escapeHtml(movie.region) + ' · ' + escapeHtml(movie.type) + ' · ' + escapeHtml(movie.genre) + '</div>',
      '<p class="card-desc">' + escapeHtml(movie.oneLine || tags) + '</p>',
      '</div>',
      '</a>',
      '</article>'
    ].join('');
  }

  function run() {
    var movies = window.SiteMovies || [];
    var form = document.querySelector('.search-panel');
    var grid = document.querySelector('[data-search-results]');
    var empty = document.querySelector('.empty-result');
    if (!form || !grid) {
      return;
    }
    var input = form.querySelector('[name="q"]');
    var yearSelect = form.querySelector('[name="year"]');
    var regionSelect = form.querySelector('[name="region"]');
    var typeSelect = form.querySelector('[name="type"]');
    var initial = readParams();
    if (input) {
      input.value = initial.q;
    }
    if (yearSelect) {
      yearSelect.value = initial.year;
    }
    if (regionSelect) {
      regionSelect.value = initial.region;
    }
    if (typeSelect) {
      typeSelect.value = initial.type;
    }

    function apply() {
      var query = normalize(input && input.value);
      var year = normalize(yearSelect && yearSelect.value);
      var region = normalize(regionSelect && regionSelect.value);
      var type = normalize(typeSelect && typeSelect.value);
      var matched = movies.filter(function (movie) {
        var hay = normalize(movie.title + ' ' + movie.region + ' ' + movie.type + ' ' + movie.genre + ' ' + (movie.tags || []).join(' ') + ' ' + movie.oneLine);
        if (query && hay.indexOf(query) === -1) {
          return false;
        }
        if (year && normalize(movie.year) !== year) {
          return false;
        }
        if (region && normalize(movie.region).indexOf(region) === -1) {
          return false;
        }
        if (type && normalize(movie.type).indexOf(type) === -1) {
          return false;
        }
        return true;
      });
      grid.innerHTML = matched.slice(0, 240).map(card).join('');
      if (empty) {
        empty.style.display = matched.length ? 'none' : '';
      }
      grid.querySelectorAll('img').forEach(function (img) {
        img.addEventListener('error', function () {
          img.classList.add('image-missing');
          img.removeAttribute('src');
        });
      });
    }

    [input, yearSelect, regionSelect, typeSelect].forEach(function (control) {
      if (control) {
        control.addEventListener('input', apply);
        control.addEventListener('change', apply);
      }
    });
    apply();
  }

  document.addEventListener('DOMContentLoaded', run);
})();
