(function () {
  var video = document.getElementById('movie-video');
  var trigger = document.querySelector('.player-trigger');
  var hlsInstance = null;

  if (!video || !trigger) {
    return;
  }

  function startPlayback() {
    var url = trigger.getAttribute('data-url');

    if (!url) {
      return;
    }

    if (video.getAttribute('data-ready') !== 'true') {
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = url;
      } else if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hlsInstance.loadSource(url);
        hlsInstance.attachMedia(video);
      } else {
        video.src = url;
      }

      video.setAttribute('data-ready', 'true');
    }

    trigger.classList.add('is-hidden');
    var playPromise = video.play();

    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(function () {});
    }
  }

  trigger.addEventListener('click', startPlayback);
  video.addEventListener('click', function () {
    if (video.getAttribute('data-ready') !== 'true') {
      startPlayback();
    }
  });

  window.addEventListener('pagehide', function () {
    if (hlsInstance) {
      hlsInstance.destroy();
      hlsInstance = null;
    }
  });
}());
