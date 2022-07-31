class Track {
  constructor(id, title, src) {
    this.id = id
    this.title = title
    this.src = src
    this.istances = 0
    this.volume = 100
    this.delay = 0
  }
}

class Controller {
  constructor(tracks) {
    this._tracks = tracks

  }

  get track(){

    let picked = this._tracks.reduce((pick, t)=>{
      pick = pick.istances > t.istances ? t : pick
    })
    picked.istances++
    return picked
  }
}


const express = require('express')
, async = require('async')
, http = require('http')
, mysql = require('mysql')
const app = express()
const port = 3333


app.set("view options", {layout: false});
app.use(express.static(__dirname + '/public'));

// var connection = mysql.createConnection({
//   host: 'localhost',
//   user: 'u447090379_user1',
//   password: "pompet-tYnfig-3qahgo",
//   database: 'u447090379_db1'
// });

// connection.connect(); 


let startTime = Date.now()

let duration = 1188.8848979591837 * 1000 //ms durata

let tracksUrl = '';
let trackQuery = 'SELECT * FROM `Tracks`';

let tracks = []
let MANAGER //controller

setupTracks();

function getCurrentTime() {
  let d = Date.now() - startTime
  if(d > duration) {
    loopBackTime()
    return d -= duration
  }
  return  d;
}

async function loopBackTime() {
  return new Promise((succ, err)=>{
    startTime = startTime + duration
    succ(1)
  })
}

function setupTracks(){
//   connection.query(trackQuery, function(err, rows, fields) {
//     console.log('Connection result error '+err);
//     tracks = rows;
// });

tracks = [
  new Track(0, 'A', '36127a.mp3'),
  new Track(1, 'B', '192802b.mp3'),
  new Track(2, 'D', '414785d.mp3'),
  new Track(3, 'G', '945960g enerico.mp3'),
  new Track(4, 'B bit', '652043b bit.mp3'),
  new Track(5, 'D bit', '64070d bit.mp3'),
  new Track(6, 'E bit', '380734e bit.mp3'),
  new Track(8, 'G bit', '80481g bit.mp3'),
  new Track(9, 'C bit', '211289c bit.mp3'),
  new Track(10, 'C', '607891c.mp3'),
  new Track(11, 'E', '785061e.mp3'),
  new Track(12, 'K prova2', '881452k prova2.mp3'),
  new Track(13, 'K prova1', '298588k prova1.mp3'),
  new Track(14, 'K prova slow', '457820k prova slow.mp3'),
  new Track(15, 'Anuovo', '403123a.mp3'),
  new Track(16, 'Gbit nuovo', '533398gbit nuovo.mp3')
]

MANAGER = new Controller(tracks)
}

function getTrack() {
  return MANAGER.track
}

app.listen(port, () => {
  console.log(`Synch Server Time listening on port ${port}`)
})

app.get('/', (req, res) => {
  res.render('public/index')
})

app.get('/start', (req, res)=>{
  console.log("START");
  startTime = Date.now()
  res.send(JSON.stringify(1))
})

app.get('/time', (req, res)=>{
  res.send(JSON.stringify(getCurrentTime()))
})

app.get('/track', (req, res)=>{
  res.send(JSON.stringify(getTrack()))
})

app.get('/all_tracks', (req, res)=>{
  res.send(JSON.stringify(tracks))
})

app.get('/delay', (req, res)=>{
  let id = req.query.id
  res.send(tracks.find(x => x.id === id).delay)
})

app.get('/volume', (req, res)=>{
  let id = req.query.id
  res.send(tracks.find(x => x.id === id).volume)
})

app.post('/delay', (req, res)=>{
  let id = req.body.id
  let delay = req.body.delay
  tracks.find(x => x.id === id).delay = delay;
})

app.post('/volume', (req, res)=>{
  let id = req.body.id
  let volume = req.body.volume
  tracks.find(x => x.id === id).volume = volume;
})