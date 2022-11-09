(async function keobong2000 () {
    const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(((navigator.userAgent || navigator.vendor || window.opera)).toLowerCase());

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    const lifeCycle = (()=>{
        const requestAnimationFrame = 
            window.__requestAnimationFrame
            ||
            window.requestAnimationFrame
            ||
            window.webkitRequestAnimationFrame
            ||
            window.mozRequestAnimationFrame
            ||
            window.oRequestAnimationFrame
            ||
            window.msRequestAnimationFrame;
        if (requestAnimationFrame) {
            return function (callback) {
                const callbackWrapper = function () {
                    callback(...arguments)
                    requestAnimationFrame(callbackWrapper);
                };
                requestAnimationFrame(callbackWrapper);
            };
        } else {
            return function (callback) {
                setInterval(callback, 1000 / 60);
            };
        }
    })();

    var koef = isMobile ? 0.8 : 1;

    var width = canvas.width=window.innerWidth*koef;
    var height = canvas.height=window.innerHeight*koef;
    
    document.body.appendChild(canvas);
    window.addEventListener("resize", e=>(width=canvas.width=window.innerWidth*koef,height=canvas.height=window.innerHeight*koef,!1));
    window.dispatchEvent(new Event("resize"));

    lifeCycle(function main () {
        context.clearRect(0, 0, canvas.width, canvas.height);
        // context.font = "100px arial"
        // context.fillStyle = "#772222";
        // context.fillText("💗♡🤍♥︎❤︎💓", 100, 100);

        bubleHeart && bubleHeart(canvas, context);
        window.neonHeart && window.neonHeart(canvas, context);
    });

    var bubleHeart = (bubleHearts => {
        const player = document.querySelector('.player');
        const songPanel = player.querySelector('.song-panel');

        return function (canvas, context) {
            let rect = songPanel.getClientRects()[0];
            const maxHeart = canvas.width; //Math.floor(canvas.width / 10);
            if (bubleHearts.length < maxHeart && songPanel.classList.contains("playing") && Math.random() > 0.93) {
                bubleHearts.push({
                    y: rect.y + rect.height-(isMobile?50:0),
                    x: rect.x + Math.floor(Math.random() * rect.width * 3 % rect.width)
                });
            }
        
            for(let heart of bubleHearts) {
                heart.y-=.4;
                let x = heart.x + Math.cos(heart.y / Math.PI) * 2;
        
                context.textAlign = "center";
                context.font = "23px arial"
                context.fillText("💗", x * koef, heart.y * koef);
            }
        
            bubleHearts = bubleHearts.filter(({y})=>y>=rect.y-(isMobile?70:50));
        }
    })([]);

    window.neonHeart = (()=>{
        var rand = Math.random;
        
        var heartPosition = function (rad) {
            //return [Math.sin(rad), Math.cos(rad)];
            return [Math.pow(Math.sin(rad), 3), -(15 * Math.cos(rad) - 5 * Math.cos(2 * rad) - 2 * Math.cos(3 * rad) - Math.cos(4 * rad))];
        };
        var scaleAndTranslate = function (pos, sx, sy, dx, dy) {
            return [dx + pos[0] * sx, dy + pos[1] * sy];
        };
        
        var traceCount = isMobile ? 37 : 50;
        var pointsOrigin = [];
        var i;
        var dr = isMobile ? 0.1 : 0.05;
        for (i = 0; i < Math.PI * 2; i += dr) pointsOrigin.push(scaleAndTranslate(heartPosition(i), isMobile ? 150 : 280, isMobile ? 9.2 : 16.8, 0, 0));
        for (i = 0; i < Math.PI * 2; i += dr) pointsOrigin.push(scaleAndTranslate(heartPosition(i), isMobile ? 90 : 180, isMobile ? 5.4 : 10.8, 0, 0));
        for (i = 0; i < Math.PI * 2; i += dr) pointsOrigin.push(scaleAndTranslate(heartPosition(i), isMobile ? 50 : 120, isMobile ? 2.78 : 7.2, 0, 0));
        var heartPointsCount = pointsOrigin.length;
        
        var targetPoints = [];
        var pulse = function (kx, ky) {
            for (i = 0; i < pointsOrigin.length; i++) {
                targetPoints[i] = [];
                targetPoints[i][0] = kx * pointsOrigin[i][0] + width / 2;
                targetPoints[i][1] = ky * pointsOrigin[i][1] + height / 2 + (isMobile ? -100 : 0);
            }
        };
        
        var e = [];
        for (i = 0; i < heartPointsCount; i++) {
            var x = Math.floor(canvas.width/2);
            var y = Math.floor(canvas.height/2 + (isMobile ? -100 : 0));
            e[i] = {
                vx: 0,
                vy: 0,
                R: 2,
                speed: rand() + 5,
                q: ~~(rand() * heartPointsCount),
                D: 2 * (i % 2) - 1,
                force: 0.2 * rand() + 0.7,
                f: "hsla(0," + ~~(40 * rand() + 60) + "%," + ~~(60 * rand() + 20) + "%,.3)",
                f: "#f06292",
                trace: []
            };
            for (var k = 0; k < traceCount; k++) e[i].trace[k] = {x: x, y: y};
        }
        
        var config = {
            traceK: 0.4,
            timeDelta: 0.05
        };
        
        var time = 0;
        return function (canvas, ctx) {
            var n = -Math.cos(time);
            pulse((1 + n) * .5, (1 + n) * .5);
            time += ((Math.sin(time)) < 0 ? 9 : (n > 0.8) ? .2 : 1) * config.timeDelta;
            ctx.fillStyle = "rgba(0,0,0,.1)";
            ctx.fillRect(0, 0, width, height);
            for (i = e.length; i--;) {
                var u = e[i];
                var q = targetPoints[u.q];
                var dx = u.trace[0].x - q[0];
                var dy = u.trace[0].y - q[1];
                var length = Math.sqrt(dx * dx + dy * dy);
                if (10 > length) {
                    if (0.95 < rand()) {
                        u.q = ~~(rand() * heartPointsCount);
                    }
                    else {
                        if (0.99 < rand()) {
                            u.D *= -1;
                        }
                        u.q += u.D;
                        u.q %= heartPointsCount;
                        if (0 > u.q) {
                            u.q += heartPointsCount;
                        }
                    }
                }
                u.vx += -dx / length * u.speed;
                u.vy += -dy / length * u.speed;
                u.trace[0].x += u.vx;
                u.trace[0].y += u.vy;
                u.vx *= u.force;
                u.vy *= u.force;
                for (k = 0; k < u.trace.length - 1;) {
                    var T = u.trace[k];
                    var N = u.trace[++k];
                    N.x -= config.traceK * (N.x - T.x);
                    N.y -= config.traceK * (N.y - T.y);
                }
                ctx.fillStyle = u.f;
                // context.fillStyle = "#772222ff";
                for (k = 0; k < u.trace.length; k++) {
                    ctx.fillRect(u.trace[k].x, u.trace[k].y, 1, 1);
                }
            }
            //ctx.fillStyle = "rgba(255,255,255,1)";
            //for (i = u.trace.length; i--;) ctx.fillRect(targetPoints[i][0], targetPoints[i][1], 2, 2);
        }
    })();


    if (location.hostname == "localhost") {
        console.log("DEBUG");
        window.canvas = canvas;
        window.context = context;
    }

})(document.currentScript.remove());



((w,s)=>(s.src="https://www.youtube.com/iframe_api",w.appendChild(s)))(document.head,document.createElement('script'));
function onYouTubeIframeAPIReady() {
    const player = document.querySelector('.player');
    const songPanel = player.querySelector('.song-panel');
    const songTitle = player.querySelector('.song-info__title');
    const songArtist = player.querySelector('.song-info__artist');
    const backButton = player.querySelector('.backward');
    const playButton = player.querySelector('.play');
    const forwardButton = player.querySelector('.forward');
    const spinner = player.querySelector('.spinner');
    const spinnerDisc = player.querySelector('.spinner__disc');
    const progress = player.querySelector('.progress');
    const progressBar = player.querySelector('.progress__filled');
    
    let playing = false;
    let trackSwitch = false;
    
    const toggleSongPanel = () => {
    
        if (!trackSwitch) {
            // Scale the disc
            spinnerDisc.classList.toggle('scale');
    
            // Show / hide song panel
            songPanel.classList.toggle('playing');
    
            // Change button icon
            playButton.classList.toggle('playing');
        }
    };

    const openSongPanel = () => {
        spinnerDisc.classList.add('scale');
        songPanel.classList.add('playing');
        playButton.classList.add('playing');
    };
    const closeSongPanel = () => {
        spinnerDisc.classList.remove('scale');
        songPanel.classList.remove('playing');
        playButton.classList.remove('playing');
    };
    
    const startSpin = () => {
        // Start spinning the disc
        spinner.classList.add('spin');
    };
    
    const stopSpin = () => {
        // Stop spinning the disc
        const spin = document.querySelector('.spin');
        spin && spin.addEventListener("animationiteration", () => {
            if (!playing) {
            spin.style.animation = 'none';
            spinner.classList.remove('spin');
            spin.style.animation = '';
            }
        }, {
            once: true
        });
    };
    
    const handleProgress = () => {
        // Update the progress bar.
        const percent = (ytplayer.getCurrentTime() / ytplayer.getDuration()) * 100;
        progressBar.style.flexBasis = `${percent}%`;
    
        // Skip to next track if at the end of the song.
        if (percent === 100) {
            trackSwitch = true;
            handleForwardButton();
        }
    };
    
    const handleBackButton = () => {
        ytplayer && ytplayer.previousVideo();
    };
    
    const handleForwardButton = () => {
        ytplayer && ytplayer.nextVideo();
    };
    
    function scrub(e) {
        const scrubTime = (e.offsetX / progress.offsetWidth) * ytplayer.getDuration();
        ytplayer.seekTo(scrubTime);
    }

    
    var yt = document.createElement("div");
    document.body.appendChild(yt);
    var ytplayer = new YT.Player(yt, {
        height: 63,
        width: 250,
        videoId: '6W9SWWRG35I',
        playerVars: {
            'playsinline': 1
        },
        events: {
            // 'onReady': e=>(e.target.playVideo(),window.dispatchEvent(new TouchEvent("touchend"))),
            // 'onStateChange': e=>(e.data===1&&(e.target.getIframe().style.display = "block")),
            // 'onStateChange': e=>(console.log("onStateChange", e)),
        }
    });

    window.ytplayer = ytplayer;
    
    const togglePlay = () => {
        if(ytplayer) {
            if (ytplayer.getPlayerState() === YT.PlayerState.PLAYING) {
                ytplayer.pauseVideo()
            } else {
                ytplayer.playVideo()
            }
        }
    };

    ytplayer.addEventListener("onStateChange", e=>{
        if(ytplayer) {
            let vidDat = ytplayer.getVideoData();
            if (vidDat) {
                songTitle.innerHTML = vidDat.title;
                songArtist.innerHTML = vidDat.author;
            }

            if (ytplayer.getPlayerState() === YT.PlayerState.PLAYING) {
                startSpin();
                openSongPanel();
            } else {
                stopSpin();
                closeSongPanel();
            }
        }
    });

    setInterval(()=>{
        ytplayer && ytplayer.getCurrentTime && ytplayer.getDuration && handleProgress();
    }, 100);
    
    backButton.addEventListener('click', handleBackButton);
    forwardButton.addEventListener('click', handleForwardButton);
    playButton.addEventListener('click', togglePlay);
    window.addEventListener("keypress", e => {
        if (e.code === "Space") {
            togglePlay();
        }
    });
    
    let mousedown = false;
    progress.addEventListener('click', scrub);
    progress.addEventListener('mousemove', (e) => mousedown && scrub(e));
    progress.addEventListener('mousedown', () => mousedown = true);
    progress.addEventListener('mouseup', () => mousedown = false);
}
