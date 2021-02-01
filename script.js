let canvas;
let canvasContext;
let ballX = 50;
let ballY = 50;
let ballSpeedX = 10;
let ballSpeedY = 4;

let player1Score = 0;
let player2Score = 0;
const winningScore = 3;

let showingWinScreen = false;

let paddle1Y = 250;
let paddle2Y = 250;
const paddleHeight = 100;
const paddleThickness = 10;

function calculateMousePos(evt) {
  let rect = canvas.getBoundingClientRect();
  let root = document.documentElement;
  let mouseX = evt.clientX - rect.left - root.scrollLeft;
  let mouseY = evt.clientY - rect.top - root.scrollTop;
  return {
    x: mouseX,
    y: mouseY,
  };
}
function handleMouseClick(evt) {
  if (showingWinScreen) {
    player1Score = 0;
    player2Score = 0;
    showingWinScreen = false;
  }
}
window.onload = function () {
  canvas = document.getElementById("gameCanvas");
  canvasContext = canvas.getContext("2d");

  let framesPerSecond = 30;
  setInterval(function () {
    moveEverything();
    drawEverything();
  }, 1000 / framesPerSecond);

  canvas.addEventListener("mousedown", handleMouseClick);
  canvas.addEventListener("mousemove", function (evt) {
    let mousePos = calculateMousePos(evt);
    paddle1Y = mousePos.y - paddleHeight / 2;
  });
};

function ballReset() {
  if (player1Score >= winningScore || player2Score >= winningScore) {
    player1Score = 0;
    player2Score = 0;
    showingWinScreen = true;
  }
  ballSpeedX = -ballSpeedX;
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
}

function computerMovement() {
  let paddle2YCenter = paddle2Y + paddleHeight / 2;
  if (paddle2YCenter < ballY - 35) {
    paddle2Y += 6;
  } else if (paddle2YCenter > ballY + 35) {
    paddle2Y -= 6;
  }
}

function moveEverything() {
  if (showingWinScreen) {
    return;
  }
  computerMovement();
  ballX += ballSpeedX;
  ballY += ballSpeedY;
  if (ballX < 0) {
    if (ballY > paddle1Y && ballY < paddle1Y + paddleHeight) {
      ballSpeedX = -ballSpeedX;
      let deltaY = ballY - (paddle1Y + paddleHeight / 2);
      ballspeedY = deltaY * 0.35;
    } else {
      player2Score++;
      ballReset();
    }
  }
  if (ballX > canvas.width) {
    if (ballY > paddle2Y && ballY < paddle2Y + paddleHeight) {
      ballSpeedX = -ballSpeedX;
      let deltaY = ballY - (paddle2Y + paddleHeight / 2);
      ballspeedY = deltaY * 0.35;
    } else {
      player1Score++;
      ballReset();
    }
  }
  if (ballY < 0) {
    ballSpeedY = -ballSpeedY;
  }
  if (ballY > canvas.height) {
    ballSpeedY = -ballSpeedY;
  }
}

function drawNet() {
  for (let i = 0; i < canvas.height; i+= 40) {
    colorRect(canvas.width / 2 -1, i, 2, 20, "white");
    
  }
}

function drawEverything() {
  // blanks out screen with black
  colorRect(0, 0, canvas.width, canvas.height, "black");
  if (showingWinScreen) {
    canvasContext.fillStyle = "white";
    if (player1Score >= winningScore) {
      canvasContext.fillText("Left Player Won!", 400, 500);
    } else if (player2Score >= winningScore) {
      canvasContext.fillText("Right Player Won!", 350, 500);
    }
    canvasContext.fillText("click to continue", 350, 200);

    return;
  }
  drawNet();

  // this is left player paddle
  colorRect(0, paddle1Y, paddleThickness, paddleHeight, "white");

  // this is right player paddle
  colorRect(
    canvas.width - paddleThickness,
    paddle2Y,
    paddleThickness,
    paddleHeight,
    "white"
  );

  // next line draws the ball
  colorCircle(ballX, ballY, paddleThickness, "white");

  canvasContext.fillText(player1Score, 100, 100);
  canvasContext.fillText(player2Score, canvas.width - 100, 100);
}
function colorCircle(centerX, centerY, radius, drawColor) {
  canvasContext.fillStyle = drawColor;
  canvasContext.beginPath();
  canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
  canvasContext.fill();
}
function colorRect(leftX, topY, width, height, drawColor) {
  canvasContext.fillStyle = drawColor;
  canvasContext.fillRect(leftX, topY, width, height);
}
