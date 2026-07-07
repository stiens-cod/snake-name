const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const highScoreElement = document.getElementById("highScore");
const restartBtn = document.getElementById("restartBtn");

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [];
let direction = { x: 1, y: 0 };
let nextDirection = { x: 1, y: 0 };
let food = { x: 0, y: 0 };
let score = 0;
let highScore = 0;
let gameOver = false;
let speed = 5;
let frameCount = 0;

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
  speed = 5;
  placeFood();
  updateScore();
}

function placeFood() {
  let valid = false;
  while (!valid) {
    food.x = Math.floor(Math.random() * tileCount);
    food.y = Math.floor(Math.random() * tileCount);
    valid = !snake.some(segment => segment.x === food.x && segment.y === food.y);
  }
}

function updateScore() {
  scoreElement.textContent = score;
  highScoreElement.textContent = highScore;
}

function drawCell(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x * gridSize, y * gridSize, gridSize, gridSize);
}

function draw() {
  ctx.fillStyle = "#111827";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawCell(food.x, food.y, "#f59e0b");

  snake.forEach((segment, index) => {
    const color = index === 0 ? "#34d399" : "#10b981";
    drawCell(segment.x, segment.y, color);
  });

  if (gameOver) {
    ctx.fillStyle = "rgba(17, 24, 39, 0.85)";
    ctx.fillRect(0, canvas.height / 2 - 40, canvas.width, 80);
    ctx.fillStyle = "#f8fafc";
    ctx.font = "24px Arial";
    ctx.textAlign = "center";
    ctx.fillText("游戏结束！按空格或点击重新开始", canvas.width / 2, canvas.height / 2 + 8);
  }
}

function update() {
  if (gameOver) return;
  direction = nextDirection;
  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

  if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
    gameOver = true;
    return;
  }

  if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
    gameOver = true;
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score += 10;
    highScore = Math.max(highScore, score);
    speed = Math.min(10, speed + 0.15);
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
  if (key === " " || key === "enter") {
    if (gameOver) {
      resetGame();
    }
  }
});

restartBtn.addEventListener("click", () => resetGame());

resetGame();
requestAnimationFrame(gameLoop);
