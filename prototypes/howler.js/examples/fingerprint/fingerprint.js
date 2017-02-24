//console.log('howler', Howler);

// Create an analyser node in the Howler WebAudio context
var sound = new Howl({
    src: [
      'http://www.myopusradio.com:8000/myopusradio',
      //  'mp3test/sordid.mp3',
    ],
    ext: ['mp3'],
    autoplay:true,
    html5:true,
    ctx: true,
  });

  // var id1 = sound.play();
  // sound.play(id1)

  // playing(id1);

  // Create an analyser node in the Howler WebAudio context


var analyser = Howler.ctx.createAnalyser();
analyser.maxDecibels = 50;
analyser.minDecibels = -50;
console.log(analyser);
  // Connect the masterGain -> analyser (disconnecting masterGain -> destination)
  Howler.masterGain.connect(analyser);
  console.log(Howler.masterGain);
  // Connect the analyser -> destination
  analyser.connect(Howler.ctx.destination);
  console.log(Howler.ctx.destination);

  var bufferLength = analyser.frequencyBinCount;
  console.log(bufferLength);

function getByteTimeDomainData() {
  var dataArray = new Uint8Array(bufferLength);
  analyser.getByteTimeDomainData(dataArray);
  console.log(dataArray);
  console.log(analyser.getByteTimeDomainData(dataArray));
};

function getFreqData() {
  var dataArray2 = new Uint8Array(bufferLength);
  analyser.getByteFrequencyData(dataArray2);
  console.log(dataArray2)
};

setTimeout(getFreqData, 5000);

setTimeout(getByteTimeDomainData, 5000);

  var canvas = $('#canvas').get(0);

var canvasCtx = canvas.getContext('2d');

function colorLoop () {
  Math.random() * (255-0);
  }

var rgbString = `rgb(${colorLoop},${colorLoop},${colorLoop})`


WIDTH = 200;
HEIGHT = 200;
function draw() {

      drawVisual = requestAnimationFrame(draw);

      analyser.getByteTimeDomainData(dataArray);

      canvasCtx.fillStyle = 'rgb(200, 200, 200)';
      canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

      canvasCtx.lineWidth = 2;
      canvasCtx.strokeStyle = 'rgb(0, 0, 0)';

      canvasCtx.beginPath();

      var sliceWidth = WIDTH * 1.0 / bufferLength;
      var x = 0;

      for(var i = 0; i < bufferLength; i++) {

        var v = dataArray[i] / 128.0;
        var y = v * HEIGHT/2;

        if(i === 0) {
          canvasCtx.moveTo(x, y);
        } else {
          canvasCtx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      canvasCtx.lineTo(canvas.width, canvas.height/2);
      canvasCtx.stroke();
    };

    draw();
