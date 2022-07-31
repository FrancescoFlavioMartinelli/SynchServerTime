class Player {
    constructor() {
        this.player = $("#audio").get(0);
        this._master = 100;
        this._delay = 0
        this._track = undefined
        this._start = 0
        this.interval = 0
    }

    set start(t) {
        this._start = t
    }
    get start() {
        return this._start
    }

    get time() {
        return this.player.currentTime
    }
    set time(t) {
        this.player.currentTime = t / 1000
        console.log("Set time", t, this.player.currentTime);
    }

    set master(m) {
        $("#masterInput").val(m);

        if (!m || m < 0 || m > 100) {
            m = 100;
        }
        console.log(m);
        this._master = m
        this.player.animate({
            volume: (this.master / 100)
        }, 1000)
    }

    get master() {
        return this._master
    }

    set track(data) {
        // $("#playBtn").attr("disabled", false)
        // data = $.parseJSON(data)
        this._track = data
        $("#track").val(data.src)
        $("#trackH3").html(data.src)
        $("#audio").attr("src", 'tracks/' + data.src);

        this.master = data.master

        this.delay = data.delay
        // this.master = data.master;
        this.checkReady()
    }

    set delay(d) {
        $("#delay").html(d)
        this._delay = d
    }

    play() {
        console.log("PLAY");
        $("#underlay").addClass("active");
        // let ct = (Date.now() - this.start + this._delay)/1000
        $(this.player).prop("muted", false);

        this.player.play()
        this.time = Date.now() - this.start
        // this.player.play()
        // setTimeout(() =>{
        //     //TODO: perchè devi aspettare 500ms dopo il play altrimenti non va il curretnTime?
        //     this.player.currentTime = 100
        // }, 500)
        this.check()
    }

    stop() {
        clearInterval(this.interval);
        this.player.prop("muted", true);
        this.player.pause()
    }

    check() {
        let contx = this

        function checkMaster() {
            console.log("check master")
            //this.master = getMaster
            $("#volume").html(contx.master);
        }

        function checkTempo() {
            console.log("check tempo")
            // getDealy
            // getTime
            // checkTime
            let checkedTime = Date.now() - contx.start + contx.delay

            if (checkedTime > contx.player.currentTime + 3 || checkedTime < contx.player.currentTime - 3) {
                console.log("ADJUST", checkedTime, contx.currentTime);
                contx.time = checkedTime;
            }
            $("#tempo").html(contx.time);
        }

        clearInterval(this.interval)
        // this.interval = window.setInterval(function () {
        //     checkMaster();
        //     checkTempo();
        // }, 500);
    }

    checkReady() {
        let p = this
        setTimeout(function () {
            console.log(p.player.readyState);
            if (p.player.readyState == 4 || p.player.readyState == 3 || p.player.readyState == 1) {
                console.log("READY");
                // $("#playBtn").attr("disabled", false)
                console.log("CRISTO", (Date.now() - p.start + p._delay) / 1000);
                p.currentTime = (Date.now() - p.start + p._delay) / 1000
                p.play()
            } else {
                console.log("NOT READY", p.player.readyState);
                p.checkReady();
            }
        }, 1000)
        // console.log(this.player);
        // $(this.player).bind('canplay', function () {
        //     this.currentTime = (Date.now() - p.start + p._delay) / 1000;
        //     p.play()
        // });
    }

}
var s;
var p = new Player();

let tracks = [];

async function setup() {
    console.log("Setup");
    await getAllTracks();
    await time();
    await track();
    // p.play()
    loadOut();
}



function loadOut() {
    $("#loading").fadeOut(100);
}

function loadIn() {
    $("#loading").fadeIn(100);
}

async function time() {
    console.log("getting time");
    // s = Date.now();
    await fetch("/time").then(res => res.json()).then((res) => {
        $("#check").html(res);
        console.log("start", res);
        p.start = res
        // console.log(res);
        // p.time = Date.now() - res
    })
}

async function track() {
    console.log("getting track");
    await fetch("/track").then(res => res.json()).then((res) => {
        console.log("Track: ", res);
        p.track = res
    })
}

async function getAllTracks() {
    await fetch("/all_tracks").then(res => res.json()).then((res) => {
        tracks = res
        res.forEach((t) => {
            let track = document.createElement("option")
            track.value = JSON.stringify(t)
            track.innerHTML = t.title
            $("#track").append(track)
        })
    })
}

function startServer() {
    console.log("starting server");
    fetch("/start").then(res => res.json()).then((res) => {
        if (res == 1) console.log("Server started correctly")
        alert("Server started counting");
    })
}