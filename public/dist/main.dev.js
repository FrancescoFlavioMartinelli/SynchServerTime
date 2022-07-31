"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Player =
/*#__PURE__*/
function () {
  function Player() {
    _classCallCheck(this, Player);

    this.player = $("#audio").get(0);
    this._master = 100;
    this._delay = 0;
    this._track = undefined;
    this._start = 0;
    this.interval = 0;
  }

  _createClass(Player, [{
    key: "play",
    value: function play() {
      console.log("PLAY");
      $("#underlay").addClass("active"); // let ct = (Date.now() - this.start + this._delay)/1000

      $(this.player).prop("muted", false);
      this.player.play();
      this.time = Date.now() - this.start; // this.player.play()
      // setTimeout(() =>{
      //     //TODO: perchè devi aspettare 500ms dopo il play altrimenti non va il curretnTime?
      //     this.player.currentTime = 100
      // }, 500)

      this.check();
    }
  }, {
    key: "stop",
    value: function stop() {
      clearInterval(this.interval);
      this.player.prop("muted", true);
      this.player.pause();
    }
  }, {
    key: "check",
    value: function check() {
      var contx = this;

      function checkMaster() {
        console.log("check master"); //this.master = getMaster

        $("#volume").html(contx.master);
      }

      function checkTempo() {
        console.log("check tempo"); // getDealy
        // getTime
        // checkTime

        var checkedTime = Date.now() - contx.start + contx.delay;

        if (checkedTime > contx.player.currentTime + 3 || checkedTime < contx.player.currentTime - 3) {
          console.log("ADJUST", checkedTime, contx.currentTime);
          contx.time = checkedTime;
        }

        $("#tempo").html(contx.time);
      }

      clearInterval(this.interval); // this.interval = window.setInterval(function () {
      //     checkMaster();
      //     checkTempo();
      // }, 500);
    }
  }, {
    key: "checkReady",
    value: function checkReady() {
      var p = this;
      setTimeout(function () {
        console.log(p.player.readyState);

        if (p.player.readyState == 4 || p.player.readyState == 3 || p.player.readyState == 1) {
          console.log("READY"); // $("#playBtn").attr("disabled", false)

          console.log("CRISTO", (Date.now() - p.start + p._delay) / 1000);
          p.currentTime = (Date.now() - p.start + p._delay) / 1000;
          p.play();
        } else {
          console.log("NOT READY", p.player.readyState);
          p.checkReady();
        }
      }, 1000); // console.log(this.player);
      // $(this.player).bind('canplay', function () {
      //     this.currentTime = (Date.now() - p.start + p._delay) / 1000;
      //     p.play()
      // });
    }
  }, {
    key: "start",
    set: function set(t) {
      this._start = t;
    },
    get: function get() {
      return this._start;
    }
  }, {
    key: "time",
    get: function get() {
      return this.player.currentTime;
    },
    set: function set(t) {
      this.player.currentTime = t / 1000;
      console.log("Set time", t, this.player.currentTime);
    }
  }, {
    key: "master",
    set: function set(m) {
      $("#masterInput").val(m);

      if (!m || m < 0 || m > 100) {
        m = 100;
      }

      console.log(m);
      this._master = m;
      this.player.animate({
        volume: this.master / 100
      }, 1000);
    },
    get: function get() {
      return this._master;
    }
  }, {
    key: "track",
    set: function set(data) {
      // $("#playBtn").attr("disabled", false)
      // data = $.parseJSON(data)
      this._track = data;
      $("#track").val(data.src);
      $("#trackH3").html(data.src);
      $("#audio").attr("src", 'tracks/' + data.src);
      this.master = data.master;
      this.delay = data.delay; // this.master = data.master;

      this.checkReady();
    }
  }, {
    key: "delay",
    set: function set(d) {
      $("#delay").html(d);
      this._delay = d;
    }
  }]);

  return Player;
}();

var s;
var p = new Player();
var tracks = [];

function setup() {
  return regeneratorRuntime.async(function setup$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          console.log("Setup");
          _context.next = 3;
          return regeneratorRuntime.awrap(getAllTracks());

        case 3:
          _context.next = 5;
          return regeneratorRuntime.awrap(time());

        case 5:
          _context.next = 7;
          return regeneratorRuntime.awrap(track());

        case 7:
          // p.play()
          loadOut();

        case 8:
        case "end":
          return _context.stop();
      }
    }
  });
}

function loadOut() {
  $("#loading").fadeOut(100);
}

function loadIn() {
  $("#loading").fadeIn(100);
}

function time() {
  return regeneratorRuntime.async(function time$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          console.log("getting time"); // s = Date.now();

          _context2.next = 3;
          return regeneratorRuntime.awrap(fetch("/time").then(function (res) {
            return res.json();
          }).then(function (res) {
            $("#check").html(res);
            console.log("start", res);
            p.start = res; // console.log(res);
            // p.time = Date.now() - res
          }));

        case 3:
        case "end":
          return _context2.stop();
      }
    }
  });
}

function track() {
  return regeneratorRuntime.async(function track$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          console.log("getting track");
          _context3.next = 3;
          return regeneratorRuntime.awrap(fetch("/track").then(function (res) {
            return res.json();
          }).then(function (res) {
            console.log("Track: ", res);
            p.track = res;
          }));

        case 3:
        case "end":
          return _context3.stop();
      }
    }
  });
}

function getAllTracks() {
  return regeneratorRuntime.async(function getAllTracks$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return regeneratorRuntime.awrap(fetch("/all_tracks").then(function (res) {
            return res.json();
          }).then(function (res) {
            tracks = res;
            res.forEach(function (t) {
              var track = document.createElement("option");
              track.value = JSON.stringify(t);
              track.innerHTML = t.title;
              $("#track").append(track);
            });
          }));

        case 2:
        case "end":
          return _context4.stop();
      }
    }
  });
}

function startServer() {
  console.log("starting server");
  fetch("/start").then(function (res) {
    return res.json();
  }).then(function (res) {
    if (res == 1) console.log("Server started correctly");
    alert("Server started counting");
  });
}