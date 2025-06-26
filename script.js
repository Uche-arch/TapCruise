const grid = document.getElementById("grid");
const scoreEl = document.getElementById("score");
const highScoreEl = document.getElementById("highScore");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const musicBtn = document.getElementById("musicBtn");
const gameOverModal = document.getElementById("gameOverModal");
const pauseModal = document.getElementById("pauseModal");
const finalScoreEl = document.getElementById("finalScore");
const restartBtn = document.getElementById("restartBtn");
const continueBtn = document.getElementById("continueBtn");

const bgMusic = document.getElementById("bgMusic");
const failSound = document.getElementById("failSound");

let tiles = [];
let activeTile = null;
let isRedTile = false;
let score = 0;
let highScore = localStorage.getItem("tileTapHighScore") || 0;
let lastTileIndex = -1;

let speed = 1000;
let flashInterval;
let gameStartTime;
let gameRunning = false;
let paused = false;

const bgSongs = [
  "./sounds/WITHYOU.mp3",
  "./sounds/Francis.mp3",
  "./sounds/fairy.mp3",
  "./sounds/gata.mp3"
];

let selectedSong = "";
let musicStarted = false;
let lastSongIndex = -1;

highScoreEl.textContent = highScore;

function createGrid() {
  grid.innerHTML = "";
  tiles = [];

  for (let i = 0; i < 9; i++) {
    const tile = document.createElement("div");
    tile.classList.add("tile");
    tile.addEventListener("click", () => handleTileClick(i));
    grid.appendChild(tile);
    tiles.push(tile);
  }
}

function flashRandomTile() {
  if (paused) return;

  tiles.forEach((tile) => tile.classList.remove("active", "red"));

  let index;
  do {
    index = Math.floor(Math.random() * tiles.length);
  } while (index === lastTileIndex && tiles.length > 1);

  lastTileIndex = index;
  activeTile = tiles[index];

  const timeElapsed = Date.now() - gameStartTime;

  if (timeElapsed >= 20000 && Math.random() < 0.4) {
    activeTile.classList.add("red");
    isRedTile = true;
  } else {
    activeTile.classList.add("active");
    isRedTile = false;
  }

  if (timeElapsed >= 40000) {
    speed = 450;
    clearInterval(flashInterval);
    flashInterval = setInterval(flashRandomTile, speed);
  }
  if (timeElapsed >= 59000) {
    speed = 280;
    clearInterval(flashInterval);
    flashInterval = setInterval(flashRandomTile, speed);
  }
}

function handleTileClick(index) {
  if (!gameRunning || paused) return;

  const clickedTile = tiles[index];

  if (clickedTile === activeTile) {
    if (isRedTile) {
      endGame();
      return;
    }

    score++;
    scoreEl.textContent = score;

    if (score > highScore) {
      highScore = score;
      localStorage.setItem("tileTapHighScore", highScore);
      highScoreEl.textContent = highScore;
    }

    activeTile.classList.remove("active", "red");
    activeTile = null;
    isRedTile = false;
  } else {
    endGame();
  }
}

function startGame() {
  gameRunning = true;
  paused = false;
  startBtn.disabled = true;
  pauseBtn.disabled = false;

  score = 0;
  speed = 1000;
  scoreEl.textContent = score;
  gameStartTime = Date.now();

  createGrid();

  clearInterval(flashInterval);
  flashInterval = setInterval(flashRandomTile, speed);
}

function endGame() {
  gameRunning = false;
  clearInterval(flashInterval);
  bgMusic.pause();
  bgMusic.currentTime = 0;

  failSound.volume = 0.2;
  failSound.pause();
  failSound.currentTime = 0;
  failSound.play().catch((e) => console.log("Fail sound error:", e));

  // Stop the fail sound after 2 seconds (2000 ms)
  setTimeout(() => {
    failSound.pause();
    failSound.currentTime = 0;
  }, 2000);

  finalScoreEl.textContent = score;
  gameOverModal.style.display = "block";
  startBtn.disabled = false;
  pauseBtn.disabled = true;

  musicStarted = false;
  musicBtn.textContent = "🎵 Play Music";
  musicBtn.disabled = false;
}


startBtn.addEventListener("click", () => {
  startGame();
});

restartBtn.addEventListener("click", () => {
  gameOverModal.style.display = "none";
  startGame();
});

pauseBtn.addEventListener("click", () => {
  if (!gameRunning || paused) return;

  paused = true;
  clearInterval(flashInterval);
  pauseModal.style.display = "block";
  bgMusic.pause();
});

continueBtn.addEventListener("click", () => {
  paused = false;
  pauseModal.style.display = "none";
  if (musicStarted) {
    bgMusic.play().catch((e) => console.log("Resume music error:", e));
  }
  flashInterval = setInterval(flashRandomTile, speed);
});

// 🎵 MUSIC BUTTON – with no repeat
musicBtn.addEventListener("click", () => {
  if (!musicStarted) {
    let randomIndex;

    do {
      randomIndex = Math.floor(Math.random() * bgSongs.length);
    } while (randomIndex === lastSongIndex && bgSongs.length > 1);

    lastSongIndex = randomIndex;
    selectedSong = bgSongs[randomIndex];

    bgMusic.src = selectedSong;
    bgMusic.loop = true;
    bgMusic.volume = 0.2;

    bgMusic
      .play()
      .then(() => {
        musicStarted = true;
        musicBtn.textContent = "🎵 Music Playing";
        musicBtn.disabled = true;
      })
      .catch((e) => {
        console.log("Music play error:", e);
      });
  }
});
