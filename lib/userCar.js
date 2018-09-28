let userHeight = 30;
let userWidth = 25;
let userX = (canvas.width - userWidth) / 2;
let userY = canvas.height - userHeight;

const UserCar = {
  drawUserCar(ctx) {
    ctx.beginPath();
    ctx.rect(userX, userY, userWidth, userHeight);
    ctx.fillStyle = "#FE5F55";
    ctx.fill();
    ctx.closePath();
  }
};

module.exports = UserCar;
