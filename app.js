/* eslint-disable semi */
// JavaScript code goes here
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

class Ball {
  constructor(x, y, color = '#FF0000', radius = 10) {
    this.x = x
    this.y = y
    this.radius = radius
    this.dx = -2
    this.dy = -2
    this.color = color
  }

  move() {
    this.x += this.dx
    this.y += this.dy
  }

  render(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }
}

class Paddle {
  constructor(x, y, width = 75, height = 10, color = '#41dd08') {
    this.width = width
    this.height = height
    this.color = color
    this.y = y
    this.x = (x - this.width) / 2
  }

  render(ctx) {
    ctx.beginPath();
    ctx.rect(this.x, this.y - this.height, this.width, this.height);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }
}

// class Brick {

//   constructor() {
//     this.rowCount = 5
//     this.columnCount = 6
//     this.width = 75
//     this.height = 20
//     this.padding = 10

//   }

// }

const brickRowCount = 5;
const brickColumnCount = 6;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;


const ball = new Ball(canvas.width / 2, canvas.height - 30);
const paddle = new Paddle(canvas.width, canvas.height);

let rightPressed = false;
let leftPressed = false;

let score = 0;
let lives = 3;

// var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
// var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;

function randomHslaColors() {
  const hue = Math.random() * 360;
  return `hsla(${hue}, 100%, 30%, 0.7)`
}

const bricks = [];

for (let c = 0; c < brickColumnCount; c += 1) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r += 1) {
    const color = randomHslaColors();
    bricks[c][r] = {
      x: 0,
      y: 0,
      status: 3,
      color,
    };
  }
}

function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c += 1) {
    for (let r = 0; r < brickRowCount; r += 1) {
      const b = bricks[c][r];
      if (b.status >= 1) {
        if (ball.x > b.x && ball.x < b.x + brickWidth && ball.y > b.y && ball.y < b.y + brickHeight) {
          ball.dy = -ball.dy;
          // b.status = 0;
          b.status -= 1
          score += 1;
          if (ball.dx > 1) {
            ball.dx += 0.25
          } else {
            ball.dx -= 0.25
          }
          if (ball.dy > 1) {
            ball.dy += 0.25
          } else {
            ball.dy -= 0.25
          }
          if (score === brickRowCount * brickColumnCount) {
            alert('YOU WIN, CONGRATULATIONS!');
            document.location.reload();
            clearInterval(interval); // Needed for Chrome to end game
          }
        }
      }
    }
  }
}

function drawScore() {
  ctx.font = '16px Arial';
  ctx.fillStyle = '#0095DD';
  ctx.fillText("Score: "+score, 8, 20);
}
function drawLives() {
  ctx.font = '16px Arial';
  ctx.fillStyle = '#0095DD';
  ctx.fillText("Lives: "+lives, canvas.width - 65, 20);
}

function mouseMoveHandler(e) {
  const relativeX = e.clientX - canvas.offsetLeft;
  if (relativeX > 0 && relativeX < canvas.width) {
    paddle.x = relativeX - paddle.width / 2;
  }
}

function keyDownHandler(e) {
  if (e.key === 'Right' || e.key === 'ArrowRight') {
    rightPressed = true;
  } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.key === 'Right' || e.key === 'ArrowRight') {
    rightPressed = false;
  } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
    leftPressed = false;
  }
}

document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);
document.addEventListener('mousemove', mouseMoveHandler, false);

function drawBricks() {
  for (let c = 0; c < brickColumnCount; c += 1) {
    for (let r = 0; r < brickRowCount; r += 1) {
      if (bricks[c][r].status >= 1) {
        const brickX = (c*(brickWidth+brickPadding)) + brickOffsetLeft;
        const brickY = (r*(brickHeight+brickPadding)) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = bricks[c][r].color;
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  // drawBall();
  ball.render(ctx);
  // drawPaddle();
  paddle.render(ctx);
  drawScore();
  drawLives();
  collisionDetection();

  if (ball.x + ball.dx > canvas.width - ball.radius || ball.x + ball.dx < ball.radius) {
    ball.dx = -ball.dx;
  }
  if (ball.y + ball.dy < ball.radius) {
    ball.dy = -ball.dy;
  } else if (ball.y + ball.dy > canvas.height - ball.radius) {
    if (ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
      ball.dy = -ball.dy;
    } else {
      lives -= 1;
      if (!lives) {
        alert("GAME OVER");
        document.location.reload();
      } else {
        ball.x = canvas.width / 2;
        ball.y = canvas.height - 30;
        ball.dx = 3;
        ball.dy = -3;
        paddle.x = (canvas.width - paddle.width) / 2;
      }
    }
  }

  if (rightPressed && paddle.x < canvas.width - paddle.width) {
    paddle.x += 7;
  } else if (leftPressed && paddle.x > 0) {
    paddle.x -= 7;
  }

  ball.move()
  requestAnimationFrame(draw);
}
draw();
