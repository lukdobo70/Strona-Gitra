document.addEventListener("DOMContentLoaded", () => {
  const startScreen = document.getElementById("start-screen");
  const gameScreen = document.getElementById("game-screen");

  const startBtn = document.getElementById("start-game");
  const replayBtn = document.getElementById("replay-btn");
  const tapBtn = document.getElementById("tap-btn");
  const nextRoundWrap = document.getElementById("next-round-wrap");
  const nextRoundBtn = document.getElementById("next-round-btn");

  const statusEl = document.getElementById("rhythm-status");
  const resultBox = document.getElementById("rhythm-result");
  const resultScore = document.getElementById("result-score");
  const resultText = document.getElementById("result-text");
  const pulseDot = document.querySelector(".pulse-dot");
  const noteEls = Array.from(document.querySelectorAll(".pattern-note"));

  const patterns = [

  [500, 500, 1000, 500],
  [400, 400, 400, 800],
  [700, 350, 350, 700],
  [600, 300, 600, 300],
  [300, 300, 600, 900],

  [500, 250, 250, 1000],
  [800, 400, 400, 400],
  [350, 350, 700, 700],
  [600, 600, 300, 300],
  [300, 600, 300, 900],

  [450, 450, 900, 450],
  [500, 750, 250, 500],
  [400, 800, 400, 400],
  [350, 350, 350, 1050],
  [250, 250, 250, 1250],

  [700, 700, 350, 350],
  [300, 300, 300, 300],
  [800, 400, 200, 600],
  [450, 900, 450, 450],
  [600, 300, 300, 900]

];

  let currentPattern = [];
  let expectedTaps = [];
  let userTaps = [];
  let isPlaying = false;
  let isRecording = false;

  function setStatus(text) {
    statusEl.textContent = text;
  }

  function flashPulse() {
    pulseDot.classList.add("active");
    setTimeout(() => pulseDot.classList.remove("active"), 180);
  }

  function activateNote(index) {
    const note = noteEls[index];
    if (!note) return;
    note.classList.add("active");
    setTimeout(() => note.classList.remove("active"), 220);
  }

  function resetForNewRound() {
    userTaps = [];
    expectedTaps = [];
    resultBox.hidden = true;
    nextRoundWrap.hidden = true;
    tapBtn.disabled = true;
    isPlaying = false;
    isRecording = false;
  }

  function playClickSound() {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;

    const audioCtx = new AudioCtx();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = "square";
    oscillator.frequency.setValueAtTime(880, audioCtx.currentTime);
    gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.08);
  }

  function playPattern(pattern) {
    return new Promise((resolve) => {
      let currentTime = 0;
      expectedTaps = [];

      pattern.forEach((duration, index) => {
        expectedTaps.push(currentTime);

        setTimeout(() => {
          flashPulse();
          activateNote(index);
          try {
            playClickSound();
          } catch (e) {}
        }, currentTime);

        currentTime += duration;
      });

      setTimeout(resolve, currentTime + 250);
    });
  }

  function scoreRhythm() {
    if (userTaps.length !== expectedTaps.length) return 0;

    const firstTapOffset = userTaps[0];
    const normalizedUser = userTaps.map((time) => time - firstTapOffset);

    const diffs = normalizedUser.map((tap, i) => Math.abs(tap - expectedTaps[i]));
    const avgDiff = diffs.reduce((sum, value) => sum + value, 0) / diffs.length;

    return Math.max(0, Math.round(100 - avgDiff / 6));
  }

  function getResultText(score) {
    if (score >= 90) return "Świetny timing! Bardzo dobre wyczucie rytmu.";
    if (score >= 75) return "Bardzo dobrze! Jeszcze trochę i będzie perfekcyjnie.";
    if (score >= 55) return "Jest dobrze — ćwicząc rytm, szybko wejdziesz poziom wyżej.";
    return "Spróbuj jeszcze raz. Na lekcjach właśnie takie rzeczy rozwijamy krok po kroku.";
  }

  async function startRound(generateNew = true) {
    if (isPlaying) return;

    resetForNewRound();

    if (generateNew || currentPattern.length === 0) {
      currentPattern = patterns[Math.floor(Math.random() * patterns.length)];
    }

    isPlaying = true;
    replayBtn.disabled = true;
    tapBtn.disabled = true;

    setStatus("Słuchaj uważnie rytmu...");
    await playPattern(currentPattern);

    isPlaying = false;
    isRecording = true;
    replayBtn.disabled = false;
    tapBtn.disabled = false;

    setStatus("Teraz wystukaj ten sam rytm. Możesz w każdej chwili odsłuchać go jeszcze raz.");
  }

  async function replayCurrentPattern() {
    if (!currentPattern.length || isPlaying) return;

    isPlaying = true;
    replayBtn.disabled = true;
    tapBtn.disabled = true;

    setStatus("Odsłuchujesz rytm jeszcze raz...");
    await playPattern(currentPattern);

    isPlaying = false;

    if (!resultBox.hidden) {
      replayBtn.disabled = false;
      tapBtn.disabled = true;
      setStatus("Runda zakończona. Możesz przejść do następnego rytmu.");
      return;
    }

    isRecording = true;
    replayBtn.disabled = false;
    tapBtn.disabled = false;
    setStatus("Teraz wystukaj ten sam rytm.");
  }

  function finishRound() {
    isRecording = false;
    tapBtn.disabled = true;

    const score = scoreRhythm();
    resultScore.textContent = `${score}%`;
    resultText.textContent = getResultText(score);
    resultBox.hidden = false;
    nextRoundWrap.hidden = false;

    setStatus("Gotowe! Możesz odsłuchać rytm jeszcze raz albo przejść do następnego.");
  }

  function registerTap() {
    if (!isRecording) return;

    const now = performance.now();
    userTaps.push(now);

    flashPulse();

    if (userTaps.length >= currentPattern.length) {
      finishRound();
    }
  }

  startBtn.addEventListener("click", async () => {
  startScreen.remove();        // usuwa start na stałe
  gameScreen.hidden = false;
  await startRound(true);
});

  replayBtn.addEventListener("click", async () => {
    await replayCurrentPattern();
  });

  tapBtn.addEventListener("click", registerTap);

  nextRoundBtn.addEventListener("click", async () => {
    await startRound(true);
  });

  document.addEventListener("keydown", (event) => {
    if (event.code === "Space") {
      event.preventDefault();
      registerTap();
    }
  });
});