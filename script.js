const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const highScoreElement = document.getElementById("highScore");
const speedValueElement = document.getElementById("speedValue");
const statusElement = document.getElementById("gameStatus");
const restartBtn = document.getElementById("restartBtn");

const pauseKey = "p";
const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [];
let direction = { x: 1, y: 0 };
let nextDirection = { x: 1, y: 0 };
let food = { x: 0, y: 0 };
let score = 0;
let highScore = 0;
let gameOver = false;
let isPaused = false;
let speed = 1.0;
let frameCount = 0;

function updateStatus(text) {
  statusElement.textContent = text;
}

function updateScore() {
  scoreElement.textContent = score;
  highScoreElement.textContent = highScore;
  updateSpeed();
}

function updateSpeed() {
  speedValueElement.textContent = speed.toFixed(1);
}

function resetGame() {
  snake = [
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 },
  ];
  direction = { x: 1, y: 0 };
  nextDirection = { x: 1, y: 0 };
  score = 0;
  gameOver = false;
  isPaused = false;
  speed = 1.0;
  placeFood();
  updateScore();
  updateStatus("游戏开始，WASD 控制，按 P 暂停");
}

function placeFood() {
  let valid = false;
  while (!valid) {
    food.x = Math.floor(Math.random() * tileCount);
    food.y = Math.floor(Math.random() * tileCount);
    valid = !snake.some(segment => segment.x === food.x && segment.y === food.y);
  }
}

function drawGrid() {
  ctx.strokeStyle = "rgba(148, 163, 184, 0.08)";
  ctx.lineWidth = 1;
  for (let x = 0; x <= canvas.width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let y = 0; y <= canvas.height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
}

function drawCell(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x * gridSize, y * gridSize, gridSize, gridSize);
}

function draw() {
  ctx.fillStyle = "#111827";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  drawGrid();

  drawCell(food.x, food.y, "#f59e0b");

  snake.forEach((segment, index) => {
    const color = index === 0 ? "#34d399" : "#10b981";
    drawCell(segment.x, segment.y, color);
  });

  if (gameOver) {
    ctx.fillStyle = "rgba(17, 24, 39, 0.9)";
    ctx.fillRect(0, canvas.height / 2 - 40, canvas.width, 80);
    ctx.fillStyle = "#f8fafc";
    ctx.font = "24px Arial";
    ctx.textAlign = "center";
    ctx.fillText("游戏结束！按空格或点击重新开始", canvas.width / 2, canvas.height / 2 + 8);
  }
}

function endGame() {
  if (gameOver) return;
  gameOver = true;
  updateStatus("游戏结束！按空格或点击重新开始");
}

function update() {
  if (gameOver || isPaused) return;
  direction = nextDirection;
  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

  if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
    endGame();
    return;
  }

  if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
    endGame();
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score += 10;
    highScore = Math.max(highScore, score);
    speed = Math.min(12, speed + 0.35);
    placeFood();
    updateScore();
  } else {
    snake.pop();
  }
}

function gameLoop() {
  frameCount += 1;
  if (frameCount >= 60 / speed) {
    frameCount = 0;
    update();
  }
  draw();
  requestAnimationFrame(gameLoop);
}

function togglePause() {
  if (gameOver) return;
  isPaused = !isPaused;
  updateStatus(isPaused ? "游戏已暂停，按 P 继续" : "继续游戏");
}

window.addEventListener("keydown", (event) => {
  const key = event.key.toLowerCase();
  if (key === "w" && direction.y !== 1) {
    nextDirection = { x: 0, y: -1 };
  }
  if (key === "s" && direction.y !== -1) {
    nextDirection = { x: 0, y: 1 };
  }
  if (key === "a" && direction.x !== 1) {
    nextDirection = { x: -1, y: 0 };
  }
  if (key === "d" && direction.x !== -1) {
    nextDirection = { x: 1, y: 0 };
  }
  if (key === pauseKey) {
    togglePause();
  }
  if (key === " " || key === "enter") {
    if (gameOver) {
      resetGame();
    }
  }
});

restartBtn.addEventListener("click", () => resetGame());

resetGame();
requestAnimationFrame(gameLoop);
