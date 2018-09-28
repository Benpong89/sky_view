We are setting the total number of enemies, the array we’ll store our enemies in, the positioning of the first enemy, the width and height and finally, the speed our enemies will move at. Now, we’ll use a for loop to add our enemies to our enemies array:

1
2
3
4
for (var i = 0; i < enemyTotal; i++) {
enemies.push([enemy_x, enemy_y, enemy_w, enemy_h, speed]);
enemy_x += enemy_w + 60;
}
With the loop we’re also increasing the x position of each enemy by 60 in order to spread them out across the canvas. Next, we have to actually draw our enemies onto the canvas:

1
2
3
4
5
6
function drawEnemies() {
for (var i = 0; i < enemies.length; i++) {
ctx.fillStyle = '#f00';
ctx.fillRect(enemies[i][0], enemies[i][1], enemy_w, enemy_h);
}
}
We just run another for loop and draw an enemy for each enemy that’s in the enemies array. And as it runs through the entire array, it uses the individual x and y positions of each enemy in the array. This is important now for the x position of each enemy and will be import down the road when we want to replace dead enemies. Next, let’s get the enemies to move.

1
2
3
4
5
6
7
8
9
function moveEnemies() {
for (var i = 0; i < enemies.length; i++) {
if (enemies[i][1] < height) {
enemies[i][1] += enemies[i][4];
} else if (enemies[i][1] > height - 1) {
enemies[i][1] = -45;
}
}
}
With this function, we’re running a for loop to move each enemy and checking to see if they’ve passed beyond the bottom of the canvas. If they have, then we move them back to above the top of the canvas, so it seems like an new enemy has entered. We still have one more thing to do, we need to change the gameLoop function to actually call these functions.

1
2
3
4
5
6
function gameLoop() {
clearCanvas();
moveEnemies();
drawEnemies();
drawShip();
}
