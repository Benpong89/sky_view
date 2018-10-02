///INITIALIZE
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
window.onload = init;

function init() {
  getScoreData();
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
  if (alive && gameStarted && health > 0) {
    laserCollision();
    userCollision();
    moveEnemies();
    moveLaser();
    drawEnemies();
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

  if (e.keyCode == 88 && lasersArray.length <= laserTotal)
    lasersArray.push([userShip_x + 10, userShip_y - 20, 4, 20]);
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

//Glitchy...need to find a better sprite?
// const enemy2 = new Image();
// enemy2.src = "./assets/images/llamacopy.png";

let enemyTotal = 200;
let enemiesArray = [];
let enemy_x = 0;
let enemy_y = 0;
let enemy_w = 60; //make sure matches sprite or else collision will be off
let enemy_h = 30;
let speed = 1;

//Creates different enemies randomly
while (enemyTotal > 0) {
  //Need to reset speed for each new enemy to create
  speed = 1;
  enemy_y = -Math.floor(Math.random() * 12000 + 1);
  enemy_x = Math.floor(Math.random() * canvas.width);

  if (enemyTotal % 5 === 0) {
    speed = 2;
  }

  if (enemyTotal % 3 === 0) {
    speed = 0.5;
  }

  enemiesArray.push([enemy_x, enemy_y, enemy_w, enemy_h, speed]);
  enemyTotal--;
}

function drawEnemies() {
  for (let i = 0; i < enemiesArray.length; i++) {
    ctx.drawImage(enemy, enemiesArray[i][0], enemiesArray[i][1]);
  }
}
//Draw boss here after enemiesArray is emptied
//ctx.drawImage(boss, cavnas.width/2, 30)

function moveEnemies() {
  for (let i = 0; i < enemiesArray.length; i++) {
    enemiesArray[i][1] += enemiesArray[i][4];
  }
}

//LASERS
// Lasers production occurs on keyDownHandler above. FIRE LASERS! 3 at a time.
let laserTotal = 2;
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

//COLLISIONS
let removeLaser = false;
function laserCollision() {
  removeLaser = false;
  for (let i = 0; i < lasersArray.length; i++) {
    for (let j = 0; j < enemiesArray.length; j++) {
      if (
        lasersArray[i][1] <= enemiesArray[j][1] + enemiesArray[j][3] &&
        lasersArray[i][0] >= enemiesArray[j][0] &&
        lasersArray[i][0] <= enemiesArray[j][0] + enemiesArray[j][2]
      ) {
        removeLaser = true;
        enemiesArray.splice(j, 1);
        score += 30;
      }
    }
    if (removeLaser == true) {
      lasersArray.splice(i, 1);
      removeLaser = false;
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
}

$("#score-form").submit(nameForm);

function nameForm(e) {
  e.preventDefault();
  name = $("#score-input")[0].value;
  writeScoreData(name, score);
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
    userShip_x = (canvas.width - userShip_w) / 2;
    userShip_y = canvas.height - userShip_h;
  }
}

//HighScore Databse initialize and submit
var config = {
  apiKey: "AIzaSyAs_xDlQv1Q2QgvQluqT1STuoyxWXYUSvU",
  authDomain: "sky-view.firebaseapp.com",
  databaseURL: "https://sky-view.firebaseio.com",
  projectId: "sky-view",
  storageBucket: "",
  messagingSenderId: "454516180641"
};
firebase.initializeApp(config);

var database = firebase.database();

function writeScoreData(name, score) {
  firebase
    .database()
    .ref(`${name}/`)
    .set({
      userScore: score
    });
}

$(".commentsToggle").click(function() {
  $(this)
    .siblings(".comments")
    .toggleClass("hidden");
});

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
