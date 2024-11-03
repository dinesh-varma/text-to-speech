function speak() {

  const synth = window.speechSynthesis;

  let speaTxt = document.getElementById("speachTxt").value;
  speaTxt = speaTxt.replace(/(\r\n|\n|\r)/gm, " ");
  let words = speaTxt;
  
  async function* speachTextAsync(words) {
    const maxLength = 40;
    let newTxt = words.split(' ');
    for (let i = 0; i < newTxt.length; i += maxLength) {
      text = newTxt.slice(i, i + maxLength);
      text = text.join(' ');

      let utterance = new SpeechSynthesisUtterance();
      
      // Select a voice
      let voices = synth.getVoices();
      if (voices.length > 0) {
        for (let i = 0; i < voices.length; i++) {
          if (voices[i].name === 'Google US English') {
            utterance.voice = voices[i]; // Choose a specific voice
            break;
          }
        }
      }

      speechSynthesis.cancel();
      utterance.text = text;
      speechSynthesis.speak(utterance);    
      yield new Promise((resolve) => utterance.onend = resolve);      
    }
  }

  async function processText(text) {
    const asyncTxt = speachTextAsync(text);
    for await (const chunk of asyncTxt) {
      //- console.log(chunk);
    }
  }

  processText(speaTxt);

}