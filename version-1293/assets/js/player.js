(function () {
  function startPlayer(box) {
    var video = box.querySelector('video');
    var button = box.querySelector('.play-overlay');
    var state = box.querySelector('.player-state');
    if (!video) {
      return;
    }
    var url = video.getAttribute('data-play-url') || '';
    var started = false;
    var hlsObject = null;

    function setState(text) {
      if (state) {
        state.textContent = text;
      }
    }

    function play() {
      if (!url) {
        setState('视频暂时无法播放，请稍后重试');
        return;
      }
      if (!started) {
        started = true;
        if (/\.m3u8(\?|$)/i.test(url)) {
          if (window.Hls && window.Hls.isSupported()) {
            hlsObject = new window.Hls({
              enableWorker: true,
              lowLatencyMode: true
            });
            hlsObject.loadSource(url);
            hlsObject.attachMedia(video);
            hlsObject.on(window.Hls.Events.MANIFEST_PARSED, function () {
              video.play().catch(function () {});
            });
            hlsObject.on(window.Hls.Events.ERROR, function () {
              setState('播放连接繁忙，请稍后重试');
            });
          } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = url;
          } else {
            setState('视频暂时无法播放，请稍后重试');
            return;
          }
        } else {
          video.src = url;
        }
      }
      if (button) {
        button.classList.add('hidden');
      }
      setState('正在播放');
      video.play().catch(function () {
        setState('点击视频继续播放');
      });
    }

    if (button) {
      button.addEventListener('click', play);
    }
    box.addEventListener('click', function (event) {
      if (event.target === video && video.paused) {
        play();
      }
    });
    video.addEventListener('play', function () {
      if (button) {
        button.classList.add('hidden');
      }
      setState('正在播放');
    });
    video.addEventListener('pause', function () {
      setState('已暂停');
    });
    video.addEventListener('ended', function () {
      setState('播放结束');
    });
    window.addEventListener('beforeunload', function () {
      if (hlsObject) {
        hlsObject.destroy();
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    Array.prototype.slice.call(document.querySelectorAll('.player-card')).forEach(startPlayer);
  });
})();
