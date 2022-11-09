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

        // bubleHeart && bubleHeart(canvas, context);
        window.neonHeart && window.neonHeart(canvas, context);

        // console.log(window.bubleHeart);
    });

    var bubleHeart = (bubleHearts => {
        return function (canvas, context) {
            const maxHeart = canvas.width; //Math.floor(canvas.width / 10);
            if (bubleHearts.length < maxHeart && Math.random() > 0.93) {
                bubleHearts.push({
                    y: canvas.height,
                    x: Math.floor(Math.random() * canvas.width * 3 % canvas.width)
                });
            }
        
            for(let heart of bubleHearts) {
                heart.y-=.4;
                let x = heart.x + Math.cos(heart.y / Math.PI) * 2;
        
                context.textAlign = "center";
                context.font = "23px arial"
                // context.fillStyle = "#77222299";
                context.fillText("💗", x, heart.y);
            }
        
            bubleHearts = bubleHearts.filter(({y})=>y>=0);
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
                targetPoints[i][1] = ky * pointsOrigin[i][1] + height / 2;
            }
        };
        
        var e = [];
        for (i = 0; i < heartPointsCount; i++) {
            var x = Math.floor(canvas.width/2);
            var y = Math.floor(canvas.height/2);
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