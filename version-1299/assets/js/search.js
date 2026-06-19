(function () {
  var input = document.getElementById('searchInput');
  var status = document.getElementById('searchStatus');
  var results = document.getElementById('searchResults');
  if (!input || !status || !results || !window.MOVIE_SEARCH_DATA) return;

  var params = new URLSearchParams(window.location.search);
  var initial = params.get('q') || '';
  input.value = initial;

  var escapeHtml = function (value) {
    return String(value || '').replace(/[&<>"']/g, function (ch) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      }[ch];
    });
  };

  var renderCard = function (movie) {
    var tags = movie.tags.slice(0, 4).map(function (tag) {
      return '<span>' + escapeHtml(tag) + '</span>';
    }).join('');
    return [
      '<article class="movie-card">',
      '<a class="card-cover" href="' + escapeHtml(movie.url) + '">',
      '<img src="' + escapeHtml(movie.cover) + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">',
      '<span class="score">' + escapeHtml(movie.rating) + '</span>',
      '</a>',
      '<div class="card-body">',
      '<div class="card-meta"><span>' + movie.year + '</span><span>' + escapeHtml(movie.region) + '</span><span>' + escapeHtml(movie.type) + '</span></div>',
      '<h3><a href="' + escapeHtml(movie.url) + '">' + escapeHtml(movie.title) + '</a></h3>',
      '<p>' + escapeHtml(movie.oneLine) + '</p>',
      '<div class="tag-row">' + tags + '</div>',
      '</div>',
      '</article>'
    ].join('');
  };

  var run = function () {
    var q = input.value.trim().toLowerCase();
    var matches = window.MOVIE_SEARCH_DATA.filter(function (movie) {
      if (!q) return true;
      return movie.searchText.indexOf(q) !== -1;
    }).slice(0, 120);
    status.textContent = q ? '找到 ' + matches.length + ' 条相关影片' : '显示热门影片';
    results.innerHTML = matches.map(renderCard).join('');
  };

  input.addEventListener('input', run);
  run();
})();
