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

const INITIAL_SPEED = 1800; // Start slow (1.8 seconds)
const MIN_SPEED = 400; // Minimum speed (fastest)
let speed = INITIAL_SPEED;
let intervalId = null;

const bgSongs = [
  "./sounds/WITHYOU.mp3",
  "./sounds/Francis.mp3",
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

  clearInterval(intervalId);
  intervalId = setInterval(flashRandomTile, speed);

  // Set and play a random background song
  const randomIndex = Math.floor(Math.random() * bgSongs.length);
  bgMusic.src = bgSongs[randomIndex];
  bgMusic.load();
  bgMusic.play().catch((err) => {
    console.warn("Music autoplay blocked:", err);
  });

  // Reset fail sound
  failSound.pause();
  failSound.currentTime = 0;
}
  

function flashRandomTile() {
  if (activeTile !== null) {
    endGame();
    return;
  }

  const index = Math.floor(Math.random() * tiles.length);
  activeTile = tiles[index];
  activeTile.classList.add("active");

  setTimeout(() => {
    if (activeTile) {
      activeTile.classList.remove("active");
      activeTile = null;
    }
  }, speed - 100);
}

function handleTileClick(index) {
  if (tiles[index] === activeTile) {
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

    clearInterval(intervalId);
    intervalId = setInterval(flashRandomTile, speed);
  } else {
    endGame();
  }
}

function endGame() {
  clearInterval(intervalId);

  bgMusic.pause();
  bgMusic.currentTime = 0;

  failSound.play();

  finalScoreEl.textContent = score;
  gameOverModal.style.display = "block";

  startBtn.disabled = false;
  activeTile?.classList.remove("active");
  activeTile = null;
}
  

startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", () => {
  gameOverModal.style.display = "none";
  startGame();
});
  