// const UserCar = require("./userCar");

///Initialize
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

let alive = true;

function init() {
  setInterval(gameLoop, 25);
  document.addEventListener("keydown", keyDownHandler, false);
  document.addEventListener("keyup", keyUpHandler, false);
}

function drawBackground() {
  let startX = -10;
  let startY = 0;
  let startY2 = -600;
  let background = new Image();
  background.src = "./assets/images/scrolling_copy4.gif";
  ctx.drawImage(background, startX, startY);
  ctx.drawImage(background, startX, startY2);
  if (startY > 600) {
    startY = -599;
  }
  if (startY2 > 600) {
    startY2 = -599;
  }
  startY += 1;
  startY2 += 1;
}

////////USER
let userShip = new Image();
userShip.src = "./assets/images/ship.png";

let userShip_w = 50;
let userShip_h = 50;
let userShip_x = (canvas.width - userShip_w) / 2;
let userShip_y = canvas.height - userShip_h;

let rightPressed = false;
let leftPressed = false;
let downPressed = false;
let upPressed = false;

function drawShip() {
  if (rightPressed) userShip_x += 5;
  else if (leftPressed) userShip_x -= 5;
  if (upPressed) userShip_y -= 5;
  else if (downPressed) userShip_y += 5;
  if (userShip_x <= 0) userShip_x = 0;
  if (userShip_x + userShip_w >= canvas.width)
    userShip_x = canvas.width - userShip_w;
  if (userShip_y <= 0) userShip_y = 0;
  if (userShip_y + userShip_h >= canvas.height)
    userShip_y = canvas.height - userShip_h;
  ctx.drawImage(userShip, userShip_x, userShip_y);
}

function keyDownHandler(e) {
  switch (e.keyCode) {
    case 39:
      rightPressed = true;
      break;
    case 37:
      leftPressed = true;
      break;
    case 38:
      upPressed = true;
      break;
    case 40:
      downPressed = true;
      break;
  }

  //FIRE LASER. 3 at a time.
  if (e.keyCode == 88 && lasers.length <= laserTotal)
    lasers.push([userShip_x + 10, userShip_y - 20, 4, 20]);
}

function keyUpHandler(e) {
  switch (e.keyCode) {
    case 39:
      rightPressed = false;
      break;
    case 37:
      leftPressed = false;
      break;
    case 38:
      upPressed = false;
      break;
    case 40:
      downPressed = false;
      break;
  }
}

//ENEMIES
let enemy = new Image();
enemy.src = "./assets/images/enemy.png";

let enemy2 = new Image();
enemy2.src = "./assets/images/llamacopy.png";

let enemyTotal = 200;
let enemiesArray = [];
let enemy_x = 0;
let enemy_y = 0;
let enemy_w = 20;
let enemy_h = 30;
let speed = 1.5;

while (enemyTotal > 0) {
  speed = 1.5;
  enemy_w = 20;
  enemy_x = 0;

  enemy_y = -Math.floor(Math.random() * 10000 + 1);
  enemy_x = enemy_w + Math.floor(Math.random() * canvas.width);

  if (enemyTotal % 10 === 0) {
    speed = 3;
    enemy_w = 40;
  }

  enemiesArray.push([enemy_x, enemy_y, enemy_w, enemy_h, speed]);
  enemyTotal--;
}

while (enemyTotal > 0) {
  speed = 1.5;
  enemy_w = 20;
  enemy_x = 0;

  enemy_y = -Math.floor(Math.random() * 5000 + 1);
  enemy_x = enemy_w + Math.floor(Math.random() * canvas.width);

  if (enemyTotal % 10 === 0) {
    speed = 3;
    enemy_w = 40;
  }

  enemiesArray.push(enemy);
  enemyTotal--;
}

function drawEnemies() {
  for (var i = 0; i < enemiesArray.length; i++) {
    if (i % 10 === 0) {
      ctx.drawImage(enemy2, enemiesArray[i][0], enemiesArray[i][1]);
    } else {
      ctx.drawImage(enemy, enemiesArray[i][0], enemiesArray[i][1]);
    }
  }
}
// function drawEnemies() {
//   for (enemy of enemiesArray) {
//     if (enemy[2] === 40) {
//       ctx.fillStyle = "#031926";
//       ctx.fillRect(enemy[0], enemy[1], enemy[2], enemy[3]);
//     } else {
//       ctx.fillStyle = "#B8D8D8";
//       ctx.fillRect(enemy[0], enemy[1], enemy[2], enemy[3]);
//     }
//   }
// }

// function drawEnemies() {
//   for (enemy of enemiesArray) {
//     ctx.drawImage(enemy, enemy_x, enemy_y);
//   }
// }

//array at position [1] refers to Y position, array at position [4] refers to speed or rather the amount to move by
function moveEnemies() {
  for (var i = 0; i < enemiesArray.length; i++) {
    if (enemiesArray[i][1] < height) {
      enemiesArray[i][1] += enemiesArray[i][4];
    } else if (enemiesArray[i][1] > height - 1) {
      enemiesArray[i][1] = -45;
    }
  }
}

function moveEnemies() {
  for (var i = 0; i < enemiesArray.length; i++) {
    enemiesArray[i][1] += enemiesArray[i][4];
  }
}

//LASERS
// Lasers production similiar to enemies. // change from for loop to short for loop.

let laserTotal = 2;
let lasers = [];
function drawLaser() {
  if (lasers.length)
    for (var i = 0; i < lasers.length; i++) {
      ctx.fillStyle = "#f00";
      ctx.fillRect(lasers[i][0], lasers[i][1], lasers[i][2], lasers[i][3]);
    }
}
function moveLaser() {
  for (var i = 0; i < lasers.length; i++) {
    if (lasers[i][1] > -11) {
      lasers[i][1] -= 10;
    } else if (lasers[i][1] < -10) {
      lasers.splice(i, 1);
    }
  }
}

//COLLISION

function laserCollision() {
  var remove = false;
  for (var i = 0; i < lasers.length; i++) {
    for (var j = 0; j < enemiesArray.length; j++) {
      if (
        lasers[i][1] <= enemiesArray[j][1] + enemiesArray[j][3] &&
        lasers[i][0] >= enemiesArray[j][0] &&
        lasers[i][0] <= enemiesArray[j][0] + enemiesArray[j][2]
      ) {
        remove = true;
        enemiesArray.splice(j, 1);
        score += 10;
      }
    }
    if (remove == true) {
      lasers.splice(i, 1);
      remove = false;
    }
  }
}

function userCollision() {
  let userShip_xw = userShip_x + userShip_w;
  let userShip_yh = userShip_y + userShip_h;
  for (var i = 0; i < enemiesArray.length; i++) {
    if (
      userShip_x > enemiesArray[i][0] &&
      userShip_x < enemiesArray[i][0] + enemy_w &&
      userShip_y > enemiesArray[i][1] &&
      userShip_y < enemiesArray[i][1] + enemy_h
    ) {
      alive = false;
    }
    if (
      userShip_xw < enemiesArray[i][0] + enemy_w &&
      userShip_xw > enemiesArray[i][0] &&
      userShip_y > enemiesArray[i][1] &&
      userShip_y < enemiesArray[i][1] + enemy_h
    ) {
      alive = false;
    }
    if (
      userShip_yh > enemiesArray[i][1] &&
      userShip_yh < enemiesArray[i][1] + enemy_h &&
      userShip_x > enemiesArray[i][0] &&
      userShip_x < enemiesArray[i][0] + enemy_w
    ) {
      alive = false;
    }
    if (
      userShip_yh > enemiesArray[i][1] &&
      userShip_yh < enemiesArray[i][1] + enemy_h &&
      userShip_xw < enemiesArray[i][0] + enemy_w &&
      userShip_xw > enemiesArray[i][0]
    ) {
      alive = false;
    }
  }
}

//SCORE

function scoreTotal() {
  let score = 0;
  ctx.font = "bold 18px Arial";
  ctx.fillStyle = "#fff";
  ctx.fillText("Score: ", 0, 0);
  ctx.fillText(score, 550, 30);
  if (!alive) {
    ctx.fillText("Game Over!", 245, canvas.height / 2);
    // resetBoard();
  }
}

//RENDER
function resetBoard() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

//Rendered every 10ms, set by interval below.

function gameLoop() {
  resetBoard();
  drawBackground();
  moveEnemies();
  moveLaser();
  drawEnemies();
  drawShip();
  drawLaser();
}

window.onload = init;

//USER ship from blocks to png refactored.
// let userHeight = 30;
// let userWidth = 25;
// let userX = (canvas.width - userWidth) / 2;
// let userY = canvas.height - userHeight;
// function drawUser() {
//   ctx.beginPath();
//   ctx.rect(userX, userY, userWidth, userHeight);
//   ctx.fillStyle = "#FE5F55";
//   ctx.fill();
//   ctx.closePath();
// }
// function draw() {
//   laserCollision();
//   userCollision();
//   scoreTotal();
// }

//
// if (rightPressed) {
//   userX += 4;
//   if (userX + userWidth > canvas.width) {
//     userX = canvas.width - userWidth;
//   }
// }
//
// if (leftPressed) {
//   userX -= 4;
//   if (userX + userWidth < userWidth) {
//     userX = 0;
//   }
// }
//
// if (upPressed) {
//   userY -= 4;
//   if (userY + userHeight < userHeight) {
//     userY = 0;
//   }
// }
//
// if (downPressed) {
//   userY += 4;
//   if (userY + userHeight > canvas.height) {
//     userY = canvas.height - userHeight;
//   }
// }
