const synth = window.speechSynthesis;
let utterance = new SpeechSynthesisUtterance();
// Select a voice
let selVoice = '';
let voices = synth.getVoices();
if (voices.length > 0) {
  for (let i = 0; i < voices.length; i++) {
    if (voices[i].name === 'Google US English') {
      selVoice = voices[i]; // Choose a specific voice
      break;
    }
  }
}

function speak() {

  document.getElementById("convert").disabled = true;

  let speaTxt = document.getElementById("speachTxt").value;
  speaTxt = speaTxt.replace(/(\r\n|\n|\r)/gm, " ");
  
  async function* speachTextAsync(words) {
    const maxLength = 20;
    let newTxt = words.split(' ');

    for (let i = 0; i < newTxt.length; i += maxLength) {
      text = newTxt.slice(i, i + maxLength);
      text = text.join(' ');

      if (selVoice != '') {
        utterance.voice = selVoice;
      }
      utterance.text = text;

      synth.cancel();      
      synth.speak(utterance);

      utterance.onstart = function() {
        console.log("Speech synthesis has started.");
      };    
      utterance.onerror = function(event) {
        document.getElementById("convert").disabled = false;
      };

      yield new Promise(function(resolve, reject){
        utterance.onend = function() {
          if (i + maxLength >= newTxt.length) {
            resolve('success');
          }else{
            resolve('working');
          }
          
        };
      });      
    }
  }

  
  async function processText(text) {
    const asyncTxt = speachTextAsync(text);
    for await (const chunk of asyncTxt) {
      if (chunk == 'success') {
        document.getElementById("convert").disabled = false;
      }
    }
  }

  processText(speaTxt);
  

}