
// https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Visualizations_with_Web_Audio_API
var audioCtx = new AudioContext();
var audio = document.querySelector('audio');
var source = audioCtx.createMediaElementSource(audio);
var analyser = audioCtx.createAnalyser();

// http://stackoverflow.com/questions/31308679/mediaelementaudiosource-outputs-zeros-due-to-cors-access-restrictions-local-mp3
audio.crossOrigin = "anonymous";

source.connect(analyser);
analyser.connect(audioCtx.destination);

// https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/createAnalyser
analyser.fftSize = 4096;
analyser.maxDecibels = 232;
analyser.minDecibels = -302;
var bufferLength = analyser.fftSize;
var dataArray = new Uint8Array(bufferLength);
analyser.getByteFrequencyData(dataArray);

var WIDTH = 640;
var HEIGHT = 100;

// drawing on canvas
const canvas = document.querySelector('canvas');
const canvasCtx = canvas.getContext('2d');

function colorLoop () {
var rand = Math.floor(Math.random() * (255-0));
return rand }

// var rgbString = `rgb(${colorLoop()},${colorLoop()},${colorLoop()})`;

var slowAnim = {
	animationCounter: 0
}

function draw() {
	requestAnimationFrame(draw);
	slowAnim.animationCounter++;
	if(slowAnim.animationCounter % 50 === 0) {
	var rgbString1 = `rgb(${colorLoop()},${colorLoop()},${colorLoop()})`;
	var rgbString2 = `rgb(${colorLoop()},${colorLoop()},${colorLoop()})`;
	};
	analyser.getByteTimeDomainData(dataArray);

	canvasCtx.fillStyle = rgbString1;
  canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

  canvasCtx.lineWidth = 1;
  canvasCtx.strokeStyle = rgbString2;

  canvasCtx.beginPath();

  var sliceWidth = WIDTH * .6 / bufferLength;
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
}

draw();
