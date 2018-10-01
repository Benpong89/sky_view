/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./lib/game.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./lib/game.js":
/*!*********************!*\
  !*** ./lib/game.js ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

///INITIALIZE
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
window.onload = init;

function init() {
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
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground();
  if (alive && gameStarted && health > 0) {
    laserCollision();
    userCollision();
    moveEnemies();
    moveLaser();
    drawEnemies();
    // drawMidenemies();
    drawShip();
    drawLaser();
  }
  scoreTotal();
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
    case 32:
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

  //limit userShip to canvas borders
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
const enemy2 = new Image();
enemy2.src = "./assets/images/llamacopy.png";
// enemy2.src = "./assets/images/enemy.png";

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
// for (let j = enemiesArray.length / 2; j < enemiesArray.length; j++) {
//   ctx.drawImage(enemy2, enemiesArray[i][0], enemiesArray[i][1]);
// }
//Draw boss here after enemiesArray is emptied
//ctx.drawImage(boss, cavnas.width/2, 30)

// function drawMidenemies() {
//   for (let i = 0; i < enemiesArray.length / 2; i++) {
//     if (i % 5 === 0) {
//       ctx.drawImage(enemy2, enemiesArray[i][0], enemiesArray[i][1]);
//     }
//   }
// }

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
        // enemiesArray[j] = null;
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
    userShip_x = (canvas.width - userShip_w) / 2;
    userShip_y = canvas.height - userShip_h;
  }
}


/***/ })

/******/ });
//# sourceMappingURL=bundle.js.map