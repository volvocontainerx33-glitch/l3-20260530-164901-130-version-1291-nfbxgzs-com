(function () {
  window.bindMoviePlayer = function (source) {
    var video = document.getElementById("moviePlayer");
    var overlay = document.getElementById("playOverlay");
    var loaded = false;
    var hls = null;

    function loadSource() {
      if (loaded || !video) {
        return;
      }
      loaded = true;
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = source;
      } else if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(source);
        hls.attachMedia(video);
      } else {
        video.src = source;
      }
    }

    function playVideo() {
      loadSource();
      if (overlay) {
        overlay.classList.add("is-hidden");
      }
      if (video) {
        var promise = video.play();
        if (promise && promise.catch) {
          promise.catch(function () {});
        }
      }
    }

    if (overlay) {
      overlay.addEventListener("click", playVideo);
    }
    if (video) {
      video.addEventListener("click", function () {
        if (video.paused) {
          playVideo();
        }
      });
      video.addEventListener("play", function () {
        if (overlay) {
          overlay.classList.add("is-hidden");
        }
      });
      video.addEventListener("ended", function () {
        if (overlay) {
          overlay.classList.remove("is-hidden");
        }
      });
    }
    window.addEventListener("beforeunload", function () {
      if (hls) {
        hls.destroy();
      }
    });
  };
})();
