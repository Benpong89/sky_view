[Live demo!](https://benpong.com/sky_view)

![alt text](sky_view.gif)

Single page Javascript game. Incorporates Canvas and Javascript logic to achieve a nostalgic arcade-shooter user experience. Utilizes Google Firebase to store high scores. The core of features of this app include Canvas shapes and sprites rendering, JavaScript logic to incorporate collisions, and key input handling for user game play.

One of the highlights of the code behind this game includes the random generation of enemies. While I'm sure there are many ways to generate enemies, I felt that utilizing JavaScript array structure to assign various starting points for drawing Canvas image enemies was clever and effective.

Below, I create a set number of enemies that are instantiated as an array with coordinates, width, height and speed. I use JavaSCript to randomize the coordinates set various speeds. Lastly, I pass those parameters to a Canvas function that ultimately draws the enemies at random locations, providing a consistently new user game experience.

```
let enemyTotal = 100;
let enemiesArray = [];
let enemy_x = 0;
let enemy_y = 0;
let enemy_w = 60; //make sure matches sprite or else collision will be off
let enemy_h = 30;
let speed = 2;

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
```

Future improvements include:

1.  Additional enemy types.
2.  Explosion graphics.
3.  New levels.
