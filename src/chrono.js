/**
 * Chronometer library.
 */

function Chrono(options) {
    this.minutes = 0;
    this.seconds = 0;
    this.hours   = 0;
    this.ondraw  = function(what) {};

    if (options !== undefined && (options.ondraw !== undefined && typeof options.ondraw === 'function')) {
        this.ondraw = options.ondraw;
    }

    var flag      = true;
    var listeners = [];
    var runner    = null;

    this.notifyOn = function(when, cb) {
        listeners.push({
            when: when,
            callback: cb
        });
    }

    this.start = function() {
        var start = new Date().getTime();
        var self = this;

        runner = setInterval(function() {
            var elapsed = dt(start);
            handler.call(self, elapsed);
        }, 1000);
    }

    this.pause = function() {
        flag = false;
    }

    this.resume = function() {
        flag = true;
    }

    this.stop = function() {
        if (runner !== null)
            clearInterval(runner);
    }

    function handler(dt) {
        update.call(this, dt);
    }

    function dt(start) {
        var curr = new Date().getTime();
        return (curr - start);
    }

    function update(dt) {
        if (flag) {
            var shouldIncrementMinutes = false;
            var shouldIncrementHours = false;

            if (++this.seconds == 60) {
                this.seconds = 0;
                shouldIncrementMinutes = true;
            }

            if (shouldIncrementMinutes) {
                if (++this.minutes == 60) {
                    this.minutes = 0;
                    shouldIncrementHours = true;
                }
            }

            if (shouldIncrementHours) {
                if (++this.hours == 24) {
                    this.hours = 0;
                }
            }

            var prettyTime = prettify.call(this);


            draw.call(this, prettyTime);

            if (notify.call(this, prettyTime)) {
                this.stop();
            }
        }
    }

    function notify(when) {
        var l;

        for (var i = 0; i < listeners.length; i++) {
            l = listeners[i];

            if (when === l.when) {
                return l.callback();
            }
        }

        return false;
    }

    function prettify() {
        var hours   = formatInterval(this.hours);
        var minutes = formatInterval(this.minutes);
        var seconds = formatInterval(this.seconds);

        return hours + ':' + minutes + ':' + seconds;
    }

    function draw(what) {
        this.ondraw(what);
    }

    function formatInterval(data) {
        return fill(data, 2, '0', -1);
    }

    function fill(to, len, char, direction) {
        var source = new String(to);
        var repeat = len - source.length;
        var final = source;

        if (repeat > 0) {
            for (var i = 0; i < repeat; i++) {
                if (direction < 0) {
                    final = char + final;
                } else {
                    final += char;
                }
            }
        }

        return final;
    }

}
