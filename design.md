User story sentence - User can see a song played visually, user can save whatever image was generated, visual fingerprint of a song

Questions:
- Does Web Audio allow me to listen to whatever is being played over the speakers? Or does it require me to play the song through the Web Audio api?
- Options: iframe to youtube, ask someone to play a sound, find another streaming service
- Is there a music api that provides me with frequency data?

Discovery via Prototyping (discover what's possible):
- getting a song to play via SoundCloud API
- getting a song to play via Web Audio (do these integrate? what other options are there?)
- getting data from Web Audio (displaying song data)
- how to display the song data (single style)
- save the image
- put previous steps together to have a completed capstone

Project planning:

- How much time do I have?
- What needs to be done regardless?
- Adjust your scope to match deadlines.

Strengths:
- writing your own javascript (not as strong with looking at someone else's)
- dom manipulation
- summarizing data
- ajax requests

Two Weeks to Complete Capstone, 14 days:

- Ideation (min. 3 project ideas), Discovery, Prototyping -> Decided your capstone MVP (2d)
- Idea #1: what is needed? discovery and prototyping (1d)
- Planning (3h)
- JavaScript (3d)
- Basic UI (1d)
- Clean-up code, MVP Capstone complete (1d)
- Polished UI (3d)
- Stretch Goals (1d)
- Buffer for unexpected (2d)

Nail down MVP Capstone

API Requirements:
- gives back json, doesn't require auth or key (paid)
- gives back textual information
- something that you can visualize with canvas

Resources:
- https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode/getByteFrequencyData
- https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Using_Web_Audio_API
- https://howlerjs.com/
- https://github.com/goldfire/howler.js/tree/master/examples/radio
- http://stackoverflow.com/questions/32460123/connect-analyzer-to-howler-sound
- https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Visualizations_with_Web_Audio_API
- https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/createAnalyser
- http://www.sonicapi.com/docs/api/analyze-chords

- stretch: frequency identifier
- stretch: add configurable options, support various styles and audio inputs (lines, curves, shapes, colors, etc.)
- stretch: choose a specific goal


a5 = 440hz
a4 = 220hz
a3 = 110hz
a2 = 55hz
a1 = 27.5hz
chords:
c major = c + e + g (has it's own frequency)
map all 24 chords (major minor), analyze the data for occurences of specific frequencies.
write a function that identifies the chord, and outputs a color from an array



array of functions (shape drawing), array of functions (colors), array of functions (effects)
functionarray[1] vs functionarray [2]
