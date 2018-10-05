///INITIALIZE
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
window.onload = init;

function init() {
  // getScoreData();
  setInterval(gameLoop, 10);
  document.addEventListener("keydown", keyDownHandler, false);
  document.addEventListener("keyup", keyUpHandler, false);
}

//GAME PLAY
let gameStarted = false;
canvas.addEventListener("click", gameStart, false);

function gameStart() {
  gameStarted = true;
  canvas.removeEventListener("click", gameStart, false);
}

function gameLoop() {
  $("#score-form").addClass("hidden");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground();
  getScoreData();
  if (alive && gameStarted && health > 0 && score > 1000 && bossAlive) {
    bossLaserCollision();
    userCollision();
    bossLaserDamage();
    moveBossEnemy();
    moveLaser();
    moveBossLaser();
    drawBossEnemy();
    drawBossHealth();
    drawBossLasers();
    drawShip();
    drawLaser();
  }
  if (alive && gameStarted && health > 0 && bossAlive) {
    laserCollision();
    midLaserCollision();
    userCollision();
    moveEnemies();
    moveMidEnemies();
    moveLaser();
    drawEnemies();
    drawMidEnemies();
    drawShip();
    drawLaser();
  }
  scoreTotal();
}

function keyDownHandler(e) {
  switch (e.keyCode) {
    case 39:
      e.preventDefault();
      rightPressed = true;
      break;
    case 37:
      e.preventDefault();
      leftPressed = true;
      break;
    case 38:
      e.preventDefault();
      upPressed = true;
      break;
    case 40:
      e.preventDefault();
      downPressed = true;
      break;
    case 32:
      e.preventDefault();
      spacePressed = true;
      break;
  }

  if (e.keyCode == 88 && lasersArray.length <= laserTotal) {
    laserSound();
    lasersArray.push([userShip_x + 10, userShip_y - 20, 4, 20]);
  }
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

////////BACKGROUND
let background = new Image();
background.src = "./assets/images/scrolling_copy4.gif";
let startX = -10;
let startY = 0;
let startY2 = -600;
function drawBackground() {
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
let alive = true;
let health = 100;
let userShip = new Image();
userShip.src = "./assets/images/ship.png";

let userShip_w = 45; //make sure matches sprite or else collision is off
let userShip_h = 70;
let userShip_x = (canvas.width - userShip_w) / 2;
let userShip_y = canvas.height - userShip_h;

let rightPressed = false;
let leftPressed = false;
let downPressed = false;
let upPressed = false;

function drawShip() {
  if (rightPressed) userShip_x += 4;
  else if (leftPressed) userShip_x -= 4;
  if (upPressed) userShip_y -= 4;
  else if (downPressed) userShip_y += 4;

  if (userShip_x <= 0) userShip_x = 0;
  if (userShip_x + userShip_w >= canvas.width)
    userShip_x = canvas.width - userShip_w;
  if (userShip_y <= 0) userShip_y = 0;
  if (userShip_y + userShip_h >= canvas.height)
    userShip_y = canvas.height - userShip_h;

  ctx.drawImage(userShip, userShip_x, userShip_y);
}

function reducehealth() {
  health -= 1;
  if (health == 0) {
    alive = false;
  }
}

//ENEMIES
const enemy = new Image();
enemy.src = "./assets/images/enemy.png";

const midEnemy = new Image();
midEnemy.src = "./assets/images/fastEnemy.png";

const bossEnemy = new Image();
bossEnemy.src = "./assets/images/bossEnemy.png";
let bossAlive = true;
let bossHealth = 200;

let enemyTotal = 100;
let enemiesArray = [];
let enemy_x = 0;
let enemy_y = 0;
let enemy_w = 60; //make sure matches sprite or else collision will be off
let enemy_h = 30;
let speed = 3;

let midEnemyTotal = 50;
let midEnemiesArray = [];
let midEnemy_x = 0;
let midEnemy_y = 0;
let midEnemy_w = 40; //make sure matches sprite or else collision will be off
let midEnemy_h = 40;
let midSpeed = 6;

let bossEnemy_x = canvas.width / 2;
let bossEnemy_y = -20;
let bossEnemy_w = 250; //make sure matches sprite or else collision will be off
let bossEnemy_h = 200;
let bossYSpeed = 1;
let bossXSpeed = 1;

while (enemyTotal > 0) {
  speed = 2;
  enemy_y = -Math.floor(Math.random() * 12000 + 1);
  enemy_x = Math.floor(Math.random() * canvas.width - 50);
  if (enemyTotal % 5 === 0) {
    speed = 4;
  }
  if (enemyTotal % 3 === 0) {
    speed = 2;
  }
  enemiesArray.push([enemy_x, enemy_y, enemy_w, enemy_h, speed]);
  enemyTotal--;
}

function drawEnemies() {
  for (let i = 0; i < enemiesArray.length; i++) {
    ctx.drawImage(enemy, enemiesArray[i][0], enemiesArray[i][1]);
  }
}

function moveEnemies() {
  for (let i = 0; i < enemiesArray.length; i++) {
    enemiesArray[i][1] += enemiesArray[i][4];
    if (enemiesArray[i][1] > canvas.height + 20) {
      enemiesArray.splice(i, 1);
      enemiesArray.push([0, -500, 30, 60, 0]);
    }
  }
}

while (midEnemyTotal > 0) {
  midEnemy_y = -Math.floor(Math.random() * 12000 + 1);
  midEnemy_x = Math.floor(Math.random() * canvas.width - 50);
  midEnemiesArray.push([
    midEnemy_x,
    midEnemy_y,
    midEnemy_w,
    midEnemy_h,
    midSpeed
  ]);
  midEnemyTotal--;
}

function drawMidEnemies() {
  for (let i = 0; i < midEnemiesArray.length; i++) {
    ctx.drawImage(midEnemy, midEnemiesArray[i][0], midEnemiesArray[i][1]);
  }
}

function moveMidEnemies() {
  for (let i = 0; i < midEnemiesArray.length; i++) {
    midEnemiesArray[i][1] += midEnemiesArray[i][4];
    if (midEnemiesArray[i][1] > canvas.height + 20) {
      midEnemiesArray.splice(i, 1);
      midEnemiesArray.push([0, -500, 30, 60, 0]);
    }
  }
}

function drawBossEnemy() {
  ctx.drawImage(bossEnemy, bossEnemy_x, bossEnemy_y);
}

function reduceBossHealth() {
  bossHealth -= 5;
  if (bossHealth == 0) {
    bossAlive = false;
  }
}

function drawBossHealth() {
  ctx.beginPath();
  ctx.lineWidth = "6";
  ctx.strokeStyle = "red";
  ctx.rect(5, 5, bossHealth, 50);
  ctx.stroke();
}

function moveBossEnemy() {
  if (bossEnemy_y > 15 && bossLasersArray.length <= bossLaserTotal) {
    bossLasersArray.push([bossEnemy_x + 30, bossEnemy_y + 40, 5, 25]);
    bossLasersArray.push([bossEnemy_x + 0, bossEnemy_y + 40, 5, 25]);
    bossLasersArray.push([bossEnemy_x + 200, bossEnemy_y + 40, 5, 25]);
    bossLasersArray.push([bossEnemy_x + 230, bossEnemy_y + 40, 5, 25]);
  }

  if (bossEnemy_y > 20) {
    bossYSpeed = 0;
  }
  bossEnemy_y += bossYSpeed;

  if (bossEnemy_x + 200 > canvas.width) {
    bossXSpeed = -1;
  }
  if (bossEnemy_x < 0) {
    bossXSpeed = 1;
  }
  bossEnemy_x += bossXSpeed;
}

//LASERS
// Lasers production occurs on keyDownHandler above. FIRE LASERS! 3 at a time.
let laserTotal = 3;
let lasersArray = [];

function drawLaser() {
  //Anytime there is a laser in the laser array (whenever user pushes spacebar)
  if (lasersArray.length)
    for (let i = 0; i < lasersArray.length; i++) {
      ctx.fillStyle = "#f00";
      ctx.fillRect(
        lasersArray[i][0],
        lasersArray[i][1],
        lasersArray[i][2],
        lasersArray[i][3]
      );
    }
}

function moveLaser() {
  for (let i = 0; i < lasersArray.length; i++) {
    lasersArray[i][1] -= 10;
    if (lasersArray[i][1] < -10) {
      lasersArray.splice(i, 1);
    }
  }
}

let bossLaserTotal = 5;
let bossLasersArray = [];

function drawBossLasers() {
  if (bossLasersArray.length)
    for (let i = 0; i < bossLasersArray.length; i++) {
      ctx.fillStyle = "#fff";
      ctx.fillRect(
        bossLasersArray[i][0],
        bossLasersArray[i][1],
        bossLasersArray[i][2],
        bossLasersArray[i][3]
      );
    }
}

function moveBossLaser() {
  for (let i = 0; i < bossLasersArray.length; i++) {
    bossLasersArray[i][1] += 20;
    if (bossLasersArray[i][1] > canvas.height) {
      bossLasersArray.splice(i, 1);
    }
  }
}

//COLLISIONS
// let removeLaser = false;
function laserCollision() {
  let removeLaser = false;
  for (let i = 0; i < lasersArray.length; i++) {
    for (let j = 0; j < enemiesArray.length; j++) {
      if (
        lasersArray[i][1] <= enemiesArray[j][1] + enemiesArray[j][3] &&
        lasersArray[i][0] >= enemiesArray[j][0] &&
        lasersArray[i][0] <= enemiesArray[j][0] + enemiesArray[j][2]
      ) {
        removeLaser = true;
        enemiesArray.splice(j, 1);
        enemiesArray.push([0, -500, 30, 60, 0]);
        score += 30;
        enemySound();
      }
    }
    if (removeLaser == true) {
      lasersArray.splice(i, 1);
      removeLaser = false;
    }
  }
}

function midLaserCollision() {
  let midRemoveLaser = false;
  for (let i = 0; i < lasersArray.length; i++) {
    for (let j = 0; j < midEnemiesArray.length; j++) {
      if (
        lasersArray[i][1] <= midEnemiesArray[j][1] + midEnemiesArray[j][3] &&
        lasersArray[i][0] >= midEnemiesArray[j][0] &&
        lasersArray[i][0] <= midEnemiesArray[j][0] + midEnemiesArray[j][2]
      ) {
        midRemoveLaser = true;
        midEnemiesArray.splice(j, 1);
        midEnemiesArray.push([0, -500, 30, 60, 0]);
        score += 60;
        enemySound();
      }
    }
    if (midRemoveLaser == true) {
      lasersArray.splice(i, 1);
      midRemoveLaser = false;
    }
  }
}

function bossLaserDamage() {
  let bossRemoveLaser = false;
  for (let i = 0; i < lasersArray.length; i++) {
    if (
      lasersArray[i][1] <= bossEnemy_y + bossEnemy_h &&
      lasersArray[i][0] >= bossEnemy_x &&
      lasersArray[i][0] <= bossEnemy_x + bossEnemy_w
    ) {
      bossRemoveLaser = true;
      reduceBossHealth();
      score += 75;
    }
    if (bossRemoveLaser == true) {
      lasersArray.splice(i, 1);
      bossRemoveLaser = false;
    }
  }
}

function bossLaserCollision() {
  for (let i = 0; i < bossLasersArray.length; i++) {
    if (
      //checks to see left side and top collision
      userShip_x > bossLasersArray[i][0] &&
      userShip_x < bossLasersArray[i][0] + enemy_w &&
      userShip_y > bossLasersArray[i][1] &&
      userShip_y < bossLasersArray[i][1] + enemy_h
    ) {
      reducehealth();
    }
    if (
      //checkts to see right side (adding ship width) and bottom collision (adding ship height)
      userShip_x + userShip_w > bossLasersArray[i][0] &&
      userShip_x + userShip_w < bossLasersArray[i][0] + enemy_w &&
      userShip_y + userShip_h > bossLasersArray[i][1] &&
      userShip_y + userShip_h < bossLasersArray[i][1] + enemy_h
    ) {
      reducehealth();
    }
  }
}

function userCollision() {
  for (let i = 0; i < enemiesArray.length; i++) {
    if (
      //checks to see left side and top collision
      userShip_x > enemiesArray[i][0] &&
      userShip_x < enemiesArray[i][0] + enemy_w &&
      userShip_y > enemiesArray[i][1] &&
      userShip_y < enemiesArray[i][1] + enemy_h
    ) {
      reducehealth();
    }
    if (
      //checkts to see right side (adding ship width) and bottom collision (adding ship height)
      userShip_x + userShip_w > enemiesArray[i][0] &&
      userShip_x + userShip_w < enemiesArray[i][0] + enemy_w &&
      userShip_y + userShip_h > enemiesArray[i][1] &&
      userShip_y + userShip_h < enemiesArray[i][1] + enemy_h
    ) {
      reducehealth();
    }
  }
  for (let i = 0; i < midEnemiesArray.length; i++) {
    if (
      userShip_x > midEnemiesArray[i][0] &&
      userShip_x < midEnemiesArray[i][0] + midEnemy_w &&
      userShip_y > midEnemiesArray[i][1] &&
      userShip_y < midEnemiesArray[i][1] + midEnemy_h
    ) {
      reducehealth();
    }
    if (
      userShip_x + userShip_w > midEnemiesArray[i][0] &&
      userShip_x + userShip_w < midEnemiesArray[i][0] + midEnemy_w &&
      userShip_y + userShip_h > midEnemiesArray[i][1] &&
      userShip_y + userShip_h < midEnemiesArray[i][1] + midEnemy_h
    ) {
      reducehealth();
    }
  }
}

//SOUNDEFFECTS

function laserSound() {
  let laserSound = new Audio("lib/PM_FSSF_GUN_LASER_GUN_2.mp3"); // buffers automatically when created
  laserSound.play();
}

function enemySound() {
  let enemySound = new Audio("lib/aaj_0013_Explosion_R2_SFX.mp3"); // buffers automatically when created
  enemySound.play();
}

//SCORE
let score = 0;
let name = "";

function scoreTotal() {
  ctx.font = "12px Arial";
  ctx.fillStyle = "black";
  ctx.fillText("Score: ", 10, 30);
  ctx.fillText(score, 50, 30);
  ctx.fillText("Health Bar:", 350, 30);
  ctx.fillText(health, 420, 30);
  if (!gameStarted) {
    ctx.font = "26px Arial";
    ctx.fillText(
      "Welcome to Sky View!",
      canvas.width / 2 - 130,
      canvas.height / 2 - 100
    );
    ctx.font = "20px Arial";
    ctx.fillText(
      "Click to Play",
      canvas.width / 2 - 60,
      canvas.height / 2 - 60
    );
    ctx.font = "16px Arial";
    ctx.fillText(
      "X for lasers -- Arrows to move",
      canvas.width / 2 - 110,
      canvas.height / 2 - 20
    );
    ctx.font = "16px Arial";
    ctx.fillText(
      "**Defeat the boss the beat the game**",
      canvas.width / 2 - 135,
      canvas.height / 2 + 100
    );
  }
  if (!alive) {
    ctx.font = "20px Arial";
    ctx.fillText("Try again?", 180, canvas.height / 2 - 50);
    ctx.fillStyle = "#black";
    ctx.font = "20px Arial";
    ctx.fillText("Hit space to Continue", 125, canvas.height / 2 + -15);
    continueButton();
    spacePressed = false;
    $("#score-form").removeClass("hidden");
  }
  if (!bossAlive) {
    ctx.font = "20px Arial";
    ctx.fillText("You win!", 180, canvas.height / 2 - 50);
    ctx.fillStyle = "#black";
    ctx.font = "20px Arial";
    ctx.fillText("Hit space to play again", 125, canvas.height / 2 + -15);
    continueButton();
    spacePressed = false;
    $("#score-form").removeClass("hidden");
  }
}

//CONTINUE
let spacePressed = false;

function continueButton() {
  if (spacePressed) {
    alive = true;
    health = 100;
    gameStarted = true;
    score = 0;
    $("#score-form").addClass("hidden");
    window.location.reload();
  }
}

//FIREBASE DATABASE AND HIGHSCORE
var config = {
  apiKey: "AIzaSyAs_xDlQv1Q2QgvQluqT1STuoyxWXYUSvU",
  authDomain: "sky-view.firebaseapp.com",
  databaseURL: "https://sky-view.firebaseio.com",
  projectId: "sky-view",
  storageBucket: "",
  messagingSenderId: "454516180641"
};
firebase.initializeApp(config);

let database = firebase.database();
function writeScoreData(name, score) {
  firebase
    .database()
    .ref(`${name}/`)
    .set({
      userScore: score
    });
}

$("#score-form").submit(nameForm);

function nameForm(e) {
  e.preventDefault();
  name = $("#score-input")[0].value;
  writeScoreData(name, score);
  $("#score-input")[0].remove();
  window.location.reload();
}

function getScoreData() {
  firebase
    .database()
    .ref("/")
    .once("value")
    .then(response => {
      let scorePosts = {};
      let userProfiles = response.val();

      for (k in userProfiles) {
        scorePosts[k] = response.val()[k].userScore;
      }

      keysSorted = Object.keys(scorePosts)
        .slice(0, 5)
        .sort(function(a, b) {
          return scorePosts[b] - scorePosts[a];
        });

      for (k of keysSorted) {
        $("#highscores").append(`<li>${k}: ${scorePosts[k]}</li>`);
      }
    });
}
