function initMoviePlayer(videoId, streamUrl, buttonId) {
  var video = document.getElementById(videoId);
  var button = document.getElementById(buttonId);
  var prepared = false;
  var hls = null;

  function prepare() {
    if (!video || prepared) {
      return;
    }
    prepared = true;
    if (typeof Hls !== "undefined" && Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(streamUrl);
      hls.attachMedia(video);
      hls.on(Hls.Events.ERROR, function (eventName, data) {
        if (data && data.fatal && hls) {
          if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
            hls.startLoad();
          } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
            hls.recoverMediaError();
          } else {
            hls.destroy();
          }
        }
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = streamUrl;
    }
  }

  function play() {
    if (!video) {
      return;
    }
    prepare();
    var result = video.play();
    if (result && typeof result.then === "function") {
      result.then(function () {
        if (button) {
          button.classList.add("is-hidden");
        }
      }).catch(function () {
        if (button) {
          button.classList.remove("is-hidden");
        }
      });
    } else if (button) {
      button.classList.add("is-hidden");
    }
  }

  if (button) {
    button.addEventListener("click", play);
  }

  if (video) {
    video.addEventListener("click", function () {
      if (video.paused) {
        play();
      }
    });
    video.addEventListener("play", function () {
      if (button) {
        button.classList.add("is-hidden");
      }
    });
    video.addEventListener("pause", function () {
      if (button && video.currentTime === 0) {
        button.classList.remove("is-hidden");
      }
    });
  }

  prepare();
}
