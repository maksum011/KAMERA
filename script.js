const videoElement = document.getElementById('video');
const gestureDisplay = document.getElementById('gesture');
const startBtn = document.getElementById('startBtn');
const utter = new SpeechSynthesisUtterance(highest.className);
speechSynthesis.speak(utter);

let model, webcam, isPredicting = false;

// Ganti link di bawah ini dengan link model milikmu dari Teachable Machine
const MODEL_URL = "https://teachablemachine.withgoogle.com/models/eWa0VMsAk/";

async function init() {
  const modelURL = MODEL_URL + "model.json";
  const metadataURL = MODEL_URL + "metadata.json";

  model = await tmImage.load(modelURL, metadataURL);
  webcam = new tmImage.Webcam(480, 360, true);
  await webcam.setup();
  await webcam.play();

  document.querySelector(".camera-container").appendChild(webcam.canvas);
  window.requestAnimationFrame(loop);

  startBtn.disabled = true;
  startBtn.textContent = "Kamera Aktif 🎥";
  isPredicting = true;
}

async function loop() {
  webcam.update();
  if (isPredicting) {
    await predict();
  }
  window.requestAnimationFrame(loop);
}

async function predict() {
  const prediction = await model.predict(webcam.canvas);
  let highest = prediction[0];

  for (let i = 0; i < prediction.length; i++) {
    if (prediction[i].probability > highest.probability) {
      highest = prediction[i];
    }
  }

  gestureDisplay.textContent = `${highest.className} (${(highest.probability * 100).toFixed(1)}%)`;
}

startBtn.addEventListener('click', init);
