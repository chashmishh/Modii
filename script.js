const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const bgMusic = document.getElementById('bgMusic');
const gameOverSound = document.getElementById('gameOverSound');

const playerImg = new Image();
playerImg.src = '/workspaces/Modii/MODI-13-removebg-preview.png'; // Replace with your player image file

const objectImg = new Image();
objectImg.src = '/workspaces/Modii/Statesman-50-removebg-preview.png'; // Replace with your falling object image file

const player = {
  x: canvas.width / 2 - 25,
  y: canvas.height - 70,
  width: 50,
  height: 50,
  speed: 7,
  dx: 0,
};

let objects = [];
let objectSpeed = 3;
let spawnInterval = 1500; // Spawn falling object every 1.5 sec
let lastSpawn = Date.now();

let score = 0;
let gameOver = false;

// Controls
document.addEventListener('keydown', (e) => {
  if (e.code === 'ArrowLeft') {
    player.dx = -player.speed;
  } else if (e.code === 'ArrowRight') {
    player.dx = player.speed;
  }
});

document.addEventListener('keyup', (e) => {
  if (
    e.code === 'ArrowLeft' && player.dx < 0 ||
    e.code === 'ArrowRight' && player.dx > 0
  ) {
    player.dx = 0;
  }
});

function drawPlayer() {
  ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);
}

function drawObjects() {
  objects.forEach(obj => {
    ctx.drawImage(objectImg, obj.x, obj.y, obj.width, obj.height);
  });
}

function updateObjects() {
  objects.forEach((obj, index) => {
    obj.y += objectSpeed;
    if (obj.y > canvas.height) {
      objects.splice(index, 1);
      score++;
      updateScore();
    }
    if (
      obj.x < player.x + player.width &&
      obj.x + obj.width > player.x &&
      obj.y < player.y + player.height &&
      obj.y + obj.height > player.y
    ) {
      endGame();
    }
  });
}

function spawnObject() {
  const size = 40;
  const x = Math.random() * (canvas.width - size);
  objects.push({ x, y: -size, width: size, height: size });
}

function updateScore() {
  document.getElementById('score').textContent = `Score: ${score}`;
}

function clear() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function movePlayer() {
  player.x += player.dx;
  if (player.x < 0) player.x = 0;
  if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
}

function endGame() {
  gameOver = true;
  bgMusic.pause();
  gameOverSound.play();
  alert('Game Over! Your score: ' + score);
  document.location.reload();
}

function gameLoop() {
  if (gameOver) return;
  clear();
  movePlayer();
  drawPlayer();
  if (Date.now() - lastSpawn > spawnInterval) {
    spawnObject();
    lastSpawn = Date.now();
  }
  updateObjects();
  drawObjects();
  requestAnimationFrame(gameLoop);
}

// Start game
bgMusic.volume = 0.2;
bgMusic.play();
gameLoop();
