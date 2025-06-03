const grid = document.getElementById("grid");
const scoreEl = document.getElementById("score");
const highScoreEl = document.getElementById("highScore");
const startBtn = document.getElementById("startBtn");
const gameOverModal = document.getElementById("gameOverModal");
const finalScoreEl = document.getElementById("finalScore");
const restartBtn = document.getElementById("restartBtn");

const bgMusic = document.getElementById("bgMusic");
const failSound = document.getElementById("failSound");

let tiles = [];
let activeTile = null;
let score = 0;
let highScore = localStorage.getItem("tileTapHighScore") || 0;
let lastTileIndex = -1;

const INITIAL_SPEED = 1300;
const MIN_SPEED = 100;
let speed = INITIAL_SPEED;

let flashTimeoutId = null;

const bgSongs = [
  "./sounds/WITHYOU.mp3",
  "./sounds/Francis.mp3",
  "./sounds/fairy.mp3",
  // add your Nigerian songs URLs here
];

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

function startGame() {
  score = 0;
  speed = INITIAL_SPEED;
  scoreEl.textContent = score;
  startBtn.disabled = true;

  createGrid();

  clearTimeout(flashTimeoutId);

  flashRandomTile();

  failSound.pause();
  failSound.currentTime = 0;
}

function flashRandomTile() {
  if (activeTile !== null) {
    endGame();
    return;
  }

  let index;

  // Keep picking until it's different from the last tile
  do {
    index = Math.floor(Math.random() * tiles.length);
  } while (index === lastTileIndex && tiles.length > 1);

  lastTileIndex = index;
  activeTile = tiles[index];
  activeTile.classList.add("active");

  flashTimeoutId = setTimeout(() => {
    if (activeTile) {
      activeTile.classList.remove("active");
      activeTile = null;
      endGame();
    }
  }, 1200); // 1.2 seconds
}

function handleTileClick(index) {
  if (tiles[index] === activeTile) {
    clearTimeout(flashTimeoutId);

    activeTile.classList.remove("active");
    activeTile = null;

    score++;
    scoreEl.textContent = score;

    if (score > highScore) {
      highScore = score;
      localStorage.setItem("tileTapHighScore", highScore);
      highScoreEl.textContent = highScore;
    }

    if (speed > MIN_SPEED) {
      speed -= 50;
      if (speed < MIN_SPEED) speed = MIN_SPEED;
    }

    flashRandomTile();
  } else {
    endGame();
  }
}

function endGame() {
  clearTimeout(flashTimeoutId);

  bgMusic.pause();
  bgMusic.currentTime = 0;

  failSound.volume = 0.2;
  failSound.play();

  finalScoreEl.textContent = score;
  gameOverModal.style.display = "block";

  startBtn.disabled = false;

  if (activeTile) {
    activeTile.classList.remove("active");
    activeTile = null;
  }
}

// 🎵 Fix: Attach music play directly to user interaction
startBtn.addEventListener("click", () => {
  // Setup background music
  const randomIndex = Math.floor(Math.random() * bgSongs.length);
  bgMusic.src = bgSongs[randomIndex];
  bgMusic.load();
  bgMusic.volume = 0.2;
  bgMusic.muted = false;

  bgMusic.play().catch((err) => {
    console.warn("Music autoplay was blocked:", err);
  });

  startGame(); // Start game after music starts
});

restartBtn.addEventListener("click", () => {
  gameOverModal.style.display = "none";
  // startGame(); // Optional if you want auto-restart
});
