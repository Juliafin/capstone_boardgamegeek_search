//console.log('howler', Howler);

// Create an analyser node in the Howler WebAudio context
var sound = new Howl({
    urls: [
      'mp3test/sordid.mp3',
    ]
});

var ctx = Howler.ctx;
console.log(ctx);
var analyser = ctx.createAnalyser();
console.log (analyser);
// console.log('ctx', Howler.ctx.createAnalyser());

// console.log('radio', radio);
// radio.play(0);
// console.log('ctx', radio.stations[0].howl.ctx);
// radio.stop();


// Connect the masterGain -> analyser (disconnecting masterGain -> destination)
//Howler.masterGain.connect(analyser);

// Connect the analyser -> destination
//analyser.connect(Howler.ctx.destination);
