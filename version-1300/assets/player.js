(function () {
    function attachPlayer(box) {
        var video = box.querySelector('video');
        var overlay = box.querySelector('.play-overlay');
        var section = box.closest('.detail-main') || document;
        var button = section.querySelector('.play-action');
        var stream = box.getAttribute('data-stream');
        var loaded = false;
        var hls = null;

        if (!video || !stream) {
            return;
        }

        function loadStream() {
            if (loaded) {
                return;
            }

            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = stream;
            } else if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(stream);
                hls.attachMedia(video);
            } else {
                video.src = stream;
            }

            loaded = true;
        }

        function play() {
            loadStream();
            video.controls = true;
            box.classList.add('is-playing');
            var promise = video.play();

            if (promise && promise.catch) {
                promise.catch(function () {
                    box.classList.remove('is-playing');
                    if (overlay) {
                        overlay.hidden = false;
                    }
                });
            }
        }

        if (overlay) {
            overlay.addEventListener('click', play);
        }

        if (button) {
            button.addEventListener('click', play);
        }

        video.addEventListener('click', function () {
            if (!loaded || video.paused) {
                play();
            }
        });

        video.addEventListener('ended', function () {
            box.classList.remove('is-playing');
        });
    }

    document.querySelectorAll('.player-box[data-stream]').forEach(attachPlayer);
})();
