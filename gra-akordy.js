document.addEventListener("DOMContentLoaded", () => {
  const NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

  const levelScreen = document.getElementById("chord-level-screen");
  const gameScreen = document.getElementById("chord-game-screen");
  const levelButtons = document.querySelectorAll(".level-btn");
  const difficultyButtons = document.querySelectorAll(".difficulty-btn");

  const currentLevelLabel = document.getElementById("current-level-label");
  const currentDifficultyLabel = document.getElementById("current-difficulty-label");
  const scoreEl = document.getElementById("chord-score");
  const targetChordEl = document.getElementById("target-chord");
  const slotsContainer = document.getElementById("note-slots");
  const noteBank = document.getElementById("note-bank");
  const checkBtn = document.getElementById("check-chord-btn");
  const clearBtn = document.getElementById("clear-chord-btn");
  const nextBtn = document.getElementById("next-chord-btn");
  const statusEl = document.getElementById("chord-status");
  const helpBox = document.getElementById("chord-help-box");
  const helpAnswer = document.getElementById("chord-help-answer");
  const flashEl = document.getElementById("chord-flash");
  const confettiEl = document.getElementById("emoji-confetti");
  const timerWrap = document.getElementById("timer-wrap");
  const timerFill = document.getElementById("timer-bar-fill");
  const timerText = document.getElementById("timer-text");

  let currentLevel = null;
  let currentDifficulty = null;
  let currentScore = 0;
  let currentChord = null;
  let previousChordName = null;
  let selectedNotes = [];
  let answerLocked = false;
  let timerInterval = null;
  let timeLeft = 0;

  const difficultySettings = {
    easy: { label: "Łatwy", seconds: null },
    medium: { label: "Średni", seconds: 30 },
    hard: { label: "Trudny", seconds: 20 },
    "very-hard": { label: "Very Hard 🔥", seconds: 12 }
  };

  const level1 = [
    { name: "C", notes: ["C", "E", "G"] },
    { name: "C#", notes: ["C#", "F", "G#"] },
    { name: "D", notes: ["D", "F#", "A"] },
    { name: "D#", notes: ["D#", "G", "A#"] },
    { name: "E", notes: ["E", "G#", "B"] },
    { name: "F", notes: ["F", "A", "C"] },
    { name: "F#", notes: ["F#", "A#", "C#"] },
    { name: "G", notes: ["G", "B", "D"] },
    { name: "G#", notes: ["G#", "C", "D#"] },
    { name: "A", notes: ["A", "C#", "E"] },
    { name: "A#", notes: ["A#", "D", "F"] },
    { name: "B", notes: ["B", "D#", "F#"] },

    { name: "Cm", notes: ["C", "D#", "G"] },
    { name: "C#m", notes: ["C#", "E", "G#"] },
    { name: "Dm", notes: ["D", "F", "A"] },
    { name: "D#m", notes: ["D#", "F#", "A#"] },
    { name: "Em", notes: ["E", "G", "B"] },
    { name: "Fm", notes: ["F", "G#", "C"] },
    { name: "F#m", notes: ["F#", "A", "C#"] },
    { name: "Gm", notes: ["G", "A#", "D"] },
    { name: "G#m", notes: ["G#", "B", "D#"] },
    { name: "Am", notes: ["A", "C", "E"] },
    { name: "A#m", notes: ["A#", "C#", "F"] },
    { name: "Bm", notes: ["B", "D", "F#"] }
  ];

  const level2 = [
    { name: "C7", notes: ["C", "E", "G", "A#"] },
    { name: "C#7", notes: ["C#", "F", "G#", "B"] },
    { name: "D7", notes: ["D", "F#", "A", "C"] },
    { name: "D#7", notes: ["D#", "G", "A#", "C#"] },
    { name: "E7", notes: ["E", "G#", "B", "D"] },
    { name: "F7", notes: ["F", "A", "C", "D#"] },
    { name: "F#7", notes: ["F#", "A#", "C#", "E"] },
    { name: "G7", notes: ["G", "B", "D", "F"] },
    { name: "G#7", notes: ["G#", "C", "D#", "F#"] },
    { name: "A7", notes: ["A", "C#", "E", "G"] },
    { name: "A#7", notes: ["A#", "D", "F", "G#"] },
    { name: "B7", notes: ["B", "D#", "F#", "A"] },

    { name: "Cm7", notes: ["C", "D#", "G", "A#"] },
    { name: "C#m7", notes: ["C#", "E", "G#", "B"] },
    { name: "Dm7", notes: ["D", "F", "A", "C"] },
    { name: "D#m7", notes: ["D#", "F#", "A#", "C#"] },
    { name: "Em7", notes: ["E", "G", "B", "D"] },
    { name: "Fm7", notes: ["F", "G#", "C", "D#"] },
    { name: "F#m7", notes: ["F#", "A", "C#", "E"] },
    { name: "Gm7", notes: ["G", "A#", "D", "F"] },
    { name: "G#m7", notes: ["G#", "B", "D#", "F#"] },
    { name: "Am7", notes: ["A", "C", "E", "G"] },
    { name: "A#m7", notes: ["A#", "C#", "F", "G#"] },
    { name: "Bm7", notes: ["B", "D", "F#", "A"] },

    { name: "Cmaj7", notes: ["C", "E", "G", "B"] },
    { name: "C#maj7", notes: ["C#", "F", "G#", "C"] },
    { name: "Dmaj7", notes: ["D", "F#", "A", "C#"] },
    { name: "D#maj7", notes: ["D#", "G", "A#", "D"] },
    { name: "Emaj7", notes: ["E", "G#", "B", "D#"] },
    { name: "Fmaj7", notes: ["F", "A", "C", "E"] },
    { name: "F#maj7", notes: ["F#", "A#", "C#", "F"] },
    { name: "Gmaj7", notes: ["G", "B", "D", "F#"] },
    { name: "G#maj7", notes: ["G#", "C", "D#", "G"] },
    { name: "Amaj7", notes: ["A", "C#", "E", "G#"] },
    { name: "A#maj7", notes: ["A#", "D", "F", "A"] },
    { name: "Bmaj7", notes: ["B", "D#", "F#", "A#"] }
  ];

  const level3 = [
    { name: "Csus2", notes: ["C", "D", "G"] },
    { name: "C#sus2", notes: ["C#", "D#", "G#"] },
    { name: "Dsus2", notes: ["D", "E", "A"] },
    { name: "D#sus2", notes: ["D#", "F", "A#"] },
    { name: "Esus2", notes: ["E", "F#", "B"] },
    { name: "Fsus2", notes: ["F", "G", "C"] },
    { name: "F#sus2", notes: ["F#", "G#", "C#"] },
    { name: "Gsus2", notes: ["G", "A", "D"] },
    { name: "G#sus2", notes: ["G#", "A#", "D#"] },
    { name: "Asus2", notes: ["A", "B", "E"] },
    { name: "A#sus2", notes: ["A#", "C", "F"] },
    { name: "Bsus2", notes: ["B", "C#", "F#"] },

    { name: "Csus4", notes: ["C", "F", "G"] },
    { name: "C#sus4", notes: ["C#", "F#", "G#"] },
    { name: "Dsus4", notes: ["D", "G", "A"] },
    { name: "D#sus4", notes: ["D#", "G#", "A#"] },
    { name: "Esus4", notes: ["E", "A", "B"] },
    { name: "Fsus4", notes: ["F", "A#", "C"] },
    { name: "F#sus4", notes: ["F#", "B", "C#"] },
    { name: "Gsus4", notes: ["G", "C", "D"] },
    { name: "G#sus4", notes: ["G#", "C#", "D#"] },
    { name: "Asus4", notes: ["A", "D", "E"] },
    { name: "A#sus4", notes: ["A#", "D#", "F"] },
    { name: "Bsus4", notes: ["B", "E", "F#"] },

    { name: "Cadd9", notes: ["C", "E", "G", "D"] },
    { name: "C#add9", notes: ["C#", "F", "G#", "D#"] },
    { name: "Dadd9", notes: ["D", "F#", "A", "E"] },
    { name: "D#add9", notes: ["D#", "G", "A#", "F"] },
    { name: "Eadd9", notes: ["E", "G#", "B", "F#"] },
    { name: "Fadd9", notes: ["F", "A", "C", "G"] },
    { name: "F#add9", notes: ["F#", "A#", "C#", "G#"] },
    { name: "Gadd9", notes: ["G", "B", "D", "A"] },
    { name: "G#add9", notes: ["G#", "C", "D#", "A#"] },
    { name: "Aadd9", notes: ["A", "C#", "E", "B"] },
    { name: "A#add9", notes: ["A#", "D", "F", "C"] },
    { name: "Badd9", notes: ["B", "D#", "F#", "C#"] }
  ];

  const level4 = [
    { name: "Cdim", notes: ["C", "D#", "F#"] },
    { name: "C#dim", notes: ["C#", "E", "G"] },
    { name: "Ddim", notes: ["D", "F", "G#"] },
    { name: "D#dim", notes: ["D#", "F#", "A"] },
    { name: "Edim", notes: ["E", "G", "A#"] },
    { name: "Fdim", notes: ["F", "G#", "B"] },
    { name: "F#dim", notes: ["F#", "A", "C"] },
    { name: "Gdim", notes: ["G", "A#", "C#"] },
    { name: "G#dim", notes: ["G#", "B", "D"] },
    { name: "Adim", notes: ["A", "C", "D#"] },
    { name: "A#dim", notes: ["A#", "C#", "E"] },
    { name: "Bdim", notes: ["B", "D", "F"] },

    { name: "Caug", notes: ["C", "E", "G#"] },
    { name: "C#aug", notes: ["C#", "F", "A"] },
    { name: "Daug", notes: ["D", "F#", "A#"] },
    { name: "D#aug", notes: ["D#", "G", "B"] },
    { name: "Eaug", notes: ["E", "G#", "C"] },
    { name: "Faug", notes: ["F", "A", "C#"] },
    { name: "F#aug", notes: ["F#", "A#", "D"] },
    { name: "Gaug", notes: ["G", "B", "D#"] },
    { name: "G#aug", notes: ["G#", "C", "E"] },
    { name: "Aaug", notes: ["A", "C#", "F"] },
    { name: "A#aug", notes: ["A#", "D", "F#"] },
    { name: "Baug", notes: ["B", "D#", "G"] }
  ];

  const level5 = [
    { name: "C9", notes: ["C", "E", "G", "A#", "D"] },
    { name: "D9", notes: ["D", "F#", "A", "C", "E"] },
    { name: "E9", notes: ["E", "G#", "B", "D", "F#"] },
    { name: "F9", notes: ["F", "A", "C", "D#", "G"] },
    { name: "G9", notes: ["G", "B", "D", "F", "A"] },
    { name: "A9", notes: ["A", "C#", "E", "G", "B"] },
    { name: "B9", notes: ["B", "D#", "F#", "A", "C#"] },

    { name: "Cm9", notes: ["C", "D#", "G", "A#", "D"] },
    { name: "Dm9", notes: ["D", "F", "A", "C", "E"] },
    { name: "Em9", notes: ["E", "G", "B", "D", "F#"] },
    { name: "Fm9", notes: ["F", "G#", "C", "D#", "G"] },
    { name: "Gm9", notes: ["G", "A#", "D", "F", "A"] },
    { name: "Am9", notes: ["A", "C", "E", "G", "B"] },
    { name: "Bm9", notes: ["B", "D", "F#", "A", "C#"] },

    { name: "Cmaj9", notes: ["C", "E", "G", "B", "D"] },
    { name: "Dmaj9", notes: ["D", "F#", "A", "C#", "E"] },
    { name: "Emaj9", notes: ["E", "G#", "B", "D#", "F#"] },
    { name: "Fmaj9", notes: ["F", "A", "C", "E", "G"] },
    { name: "Gmaj9", notes: ["G", "B", "D", "F#", "A"] },
    { name: "Amaj9", notes: ["A", "C#", "E", "G#", "B"] },
    { name: "Bmaj9", notes: ["B", "D#", "F#", "A#", "C#"] }
  ];

  function getChordPool() {
    if (currentLevel === 1) return level1;
    if (currentLevel === 2) return level2;
    if (currentLevel === 3) return level3;
    if (currentLevel === 4) return level4;
    if (currentLevel === 5) return level5;
    if (currentLevel === 6) return [...level1, ...level2, ...level3, ...level4, ...level5];
    return level1;
  }

  function setStatus(text) {
    statusEl.textContent = text;
  }

  function updateScore() {
    scoreEl.textContent = `Punkty: ${currentScore}`;
  }

  function getRandomChord() {
    const pool = getChordPool();
    if (pool.length === 1) return pool[0];

    let nextChord;
    do {
      nextChord = pool[Math.floor(Math.random() * pool.length)];
    } while (nextChord.name === previousChordName);

    return nextChord;
  }

  function renderSlots() {
    const slotsNeeded = currentChord.notes.length;
    slotsContainer.innerHTML = "";

    for (let index = 0; index < slotsNeeded; index++) {
      const slot = document.createElement("button");
      slot.type = "button";
      slot.className = "note-slot";
      slot.textContent = selectedNotes[index] || "";
      slot.classList.toggle("filled", Boolean(selectedNotes[index]));
      slot.disabled = answerLocked;

      slot.addEventListener("click", () => removeNoteFromSlot(index));

      slotsContainer.appendChild(slot);
    }
  }

  function renderNoteBank() {
    noteBank.innerHTML = "";
    noteBank.classList.toggle("very-hard-mode", currentDifficulty === "very-hard");

    NOTES.forEach((note) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "note-btn";
      btn.textContent = note;

      if (selectedNotes.includes(note)) {
        btn.classList.add("is-used");
      }

      if (answerLocked) {
        btn.disabled = true;
      }

      btn.addEventListener("click", () => {
        if (answerLocked) return;
        playNote(note);
        addNoteToSlot(note);
      });

      noteBank.appendChild(btn);
    });
  }

  function addNoteToSlot(note) {
    if (answerLocked) return;
    if (selectedNotes.length >= currentChord.notes.length) return;
    if (selectedNotes.includes(note)) return;

    selectedNotes.push(note);
    renderSlots();
    renderNoteBank();
  }

  function removeNoteFromSlot(index) {
    if (answerLocked) return;

    if (selectedNotes[index]) {
      selectedNotes.splice(index, 1);
      renderSlots();
      renderNoteBank();
    }
  }

  function clearSelection() {
    if (answerLocked) return;

    selectedNotes = [];
    renderSlots();
    renderNoteBank();
    helpBox.hidden = true;
    nextBtn.hidden = true;
    setStatus("Kliknij dźwięki, aby wypełnić pola.");
  }

  function normalize(arr) {
    return [...arr].sort();
  }

  function flash(type) {
    flashEl.classList.remove("flash-success", "flash-error");
    void flashEl.offsetWidth;
    flashEl.classList.add(type === "success" ? "flash-success" : "flash-error");
  }

  function dropConfetti() {
    confettiEl.innerHTML = "";
    const emojis = ["🎉", "✨", "🎸", "🎵", "🔥", "🎶"];
    const amount = 18;

    for (let i = 0; i < amount; i++) {
      const item = document.createElement("span");
      item.className = "confetti-emoji";
      item.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      item.style.left = `${Math.random() * 100}%`;
      item.style.animationDelay = `${Math.random() * 0.35}s`;
      item.style.fontSize = `${1 + Math.random() * 0.8}rem`;
      confettiEl.appendChild(item);
    }

    setTimeout(() => {
      confettiEl.innerHTML = "";
    }, 2200);
  }

  function lockAnswer() {
    answerLocked = true;
    renderSlots();
    renderNoteBank();
    checkBtn.disabled = true;
    clearBtn.disabled = true;
    stopTimer();
  }

  function unlockAnswer() {
    answerLocked = false;
    renderSlots();
    renderNoteBank();
    checkBtn.disabled = false;
    clearBtn.disabled = false;
  }

  function checkAnswer() {
    if (answerLocked) return;

    if (selectedNotes.length !== currentChord.notes.length) {
      setStatus("Najpierw wypełnij wszystkie pola.");
      return;
    }

    lockAnswer();

    const user = normalize(selectedNotes);
    const correct = normalize(currentChord.notes);
    const isCorrect = JSON.stringify(user) === JSON.stringify(correct);

    if (isCorrect) {
      currentScore += 1;
      updateScore();
      setStatus("Brawo! Poprawnie zbudowany akord.");
      helpBox.hidden = true;
      flash("success");
      dropConfetti();
    } else {
      setStatus("Niestety, to nie ten akord. Zobacz poprawną odpowiedź.");
      helpAnswer.textContent = currentChord.notes.join(" – ");
      helpBox.hidden = false;
      flash("error");
    }

    nextBtn.hidden = false;
  }

  function showTimer(seconds) {
    if (seconds === null) {
      timerWrap.hidden = true;
      return;
    }

    timerWrap.hidden = false;
    timeLeft = seconds;
    timerText.textContent = `Pozostało: ${timeLeft}s`;
    timerFill.style.width = "100%";

    const maxTime = seconds;

    timerInterval = setInterval(() => {
      timeLeft -= 1;

      if (timeLeft < 0) {
        clearInterval(timerInterval);
        timerInterval = null;
        forceTimeOut();
        return;
      }

      timerText.textContent = `Pozostało: ${timeLeft}s`;
      timerFill.style.width = `${(timeLeft / maxTime) * 100}%`;
    }, 1000);
  }

  function stopTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }

  function forceTimeOut() {
    if (answerLocked) return;

    lockAnswer();
    setStatus("Czas minął. Spróbuj kolejnego akordu.");
    helpAnswer.textContent = currentChord.notes.join(" – ");
    helpBox.hidden = false;
    flash("error");
    nextBtn.hidden = false;
  }

  function nextRound() {
    stopTimer();

    currentChord = getRandomChord();
    previousChordName = currentChord.name;

    targetChordEl.textContent = currentChord.name;
    selectedNotes = [];
    helpBox.hidden = true;
    nextBtn.hidden = true;
    unlockAnswer();
    renderSlots();
    renderNoteBank();
    setStatus("Kliknij dźwięki, aby zbudować akord.");

    const difficulty = difficultySettings[currentDifficulty];
    showTimer(difficulty.seconds);
  }

  function maybeStartGame() {
    if (!currentLevel || !currentDifficulty) return;

    currentScore = 0;
    previousChordName = null;
    updateScore();

    currentLevelLabel.textContent = `Level ${currentLevel}`;
    currentDifficultyLabel.textContent = difficultySettings[currentDifficulty].label;

    levelScreen.hidden = true;
    gameScreen.hidden = false;

    nextRound();
  }

  function startLevel(level) {
    currentLevel = Number(level);
    maybeStartGame();
  }

  function startDifficulty(difficulty) {
    currentDifficulty = difficulty;
    maybeStartGame();
  }

  const noteFrequencies = {
    "C": 261.63,
    "C#": 277.18,
    "D": 293.66,
    "D#": 311.13,
    "E": 329.63,
    "F": 349.23,
    "F#": 369.99,
    "G": 392.00,
    "G#": 415.30,
    "A": 440.00,
    "A#": 466.16,
    "B": 493.88
  };

  let audioContext = null;

  function getAudioContext() {
    if (!audioContext) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return null;
      audioContext = new AudioCtx();
    }
    return audioContext;
  }

  function playNote(note) {
    const ctx = getAudioContext();
    if (!ctx || !noteFrequencies[note]) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(noteFrequencies[note], ctx.currentTime);

    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.62);

    const buttons = [...document.querySelectorAll(".note-btn")];
    const currentBtn = buttons.find((btn) => btn.textContent === note);
    if (currentBtn) {
      currentBtn.classList.add("playing");
      setTimeout(() => currentBtn.classList.remove("playing"), 200);
    }
  }

  levelButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      levelButtons.forEach((b) => b.classList.remove("selected-choice"));
      btn.classList.add("selected-choice");
      startLevel(btn.dataset.level);
    });
  });

  difficultyButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      difficultyButtons.forEach((b) => b.classList.remove("selected-choice"));
      btn.classList.add("selected-choice");
      startDifficulty(btn.dataset.difficulty);
    });
  });

  checkBtn.addEventListener("click", checkAnswer);
  clearBtn.addEventListener("click", clearSelection);
  nextBtn.addEventListener("click", nextRound);
});