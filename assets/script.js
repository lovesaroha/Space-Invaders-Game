"use-strict";

/*  Love Saroha
    lovesaroha1994@gmail.com (email address)
    https://www.lovesaroha.com (website)
    https://github.com/lovesaroha  (github)
*/

// Themes.
const themes = [{ normal: "#5468e7", light: "#6577e9", veryLight: "#eef0fd" }, { normal: "#e94c2b", light: "#eb5e40", veryLight: "#fdedea" }];

// Choose random color theme.
let colorTheme = themes[Math.floor(Math.random() * themes.length)];

// This function set random color theme.
function setTheme() {
  // Change css values.
  document.documentElement.style.setProperty("--primary", colorTheme.normal);
}

// Set random theme.
setTheme();

// Get canvas info from DOM.
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

// Score defined.
let score = 0;

// Ship defined.
let ship = { x: 250, y: 395 };

// This function show ship on canvas.
function showShip() {
  ctx.save();
  ctx.translate(ship.x, ship.y);
  ctx.rotate(-45 * Math.PI / 180);
  ctx.translate(-(ship.x), -(ship.y));
  ctx.font = '300 46px "Font Awesome 5 Pro"';
  ctx.fillStyle = colorTheme.normal;
  ctx.textAlign = 'center';
  ctx.fillText("\uf135", ship.x, ship.y);
  ctx.restore();
}

// This function move ship.
function moveShip(direction) {
  ship.x += direction;
  if (ship.x < 0) {
    ship.x = 490;
  }
  if (ship.x > 510) {
    ship.x = 10;
  }
}

// Invaders.
let invaders = [];

// Invaders moves in x and y axis.
let xMoves = 30;
let yMoves = 0;
let direction = -1;

// This function initialize invaders array values.
function initiliazeInvadersPositions() {
  invaders = [];
  for (let i = -150; i < 0; i += 50) {
    for (let j = 50; j < 500; j += 50) {
      invaders.push({ x: j, y: i });
    }
  }
}

// This function shows invaders.
function showInvaders() {
  for (let i = 0; i < invaders.length; i++) {
    ctx.font = '300 30px "Font Awesome 5 Pro"';
    ctx.fillStyle = colorTheme.normal;
    ctx.textAlign = 'center';
    ctx.fillText("\uf717", invaders[i].x, invaders[i].y);
  }
}

// This function move invaders towards ship.
function moveInvaders() {
  let resetValues = false;
  if (invaders.length == 0) {
    // No invaders left reset invaders values.
    resetValues = true;
  } else {
    // Check if invaders out of canvas.
    if (invaders[0].y > 450) {
      score -= invaders.length;
      showScore();
      resetValues = true;
    }
  }
  if (resetValues) {
    // Reset invaders values.
    xMoves = 30;
    yMoves = 0;
    initiliazeInvadersPositions();
    return;
  }

  let x = 0;
  let y = 0;
  if (xMoves > 0) {
    // Horizontal movement.
    xMoves--
    x = direction;
    if (yMoves < 30) {
      // 30 moves maximum downward.
      yMoves++;
    }
  }
  if (xMoves == 0) {
    // Reset horizontal direction and move downward.
    yMoves--;
    y = 1;
    if (yMoves == 0) {
      // Reset downward movement and change direction.
      yMoves = 0;
      xMoves = 60;
      direction *= -1;
    }
  }
  for (let i = 0; i < invaders.length; i++) {
    invaders[i].x += x;
    invaders[i].y += y;
  }
}

// Missiles.
let missiles = [];

// Missile object defined.
class MissileObject {
  constructor(x, y) {
    this.x = x - 10;
    this.y = y - 30;
  }

  // This function moves missile in upward direct.
  move() {
    this.y -= 3;
  }

  // This function show missle in canvas.
  show() {
    ctx.beginPath();
    ctx.fillStyle = colorTheme.light;
    ctx.arc(this.x, this.y, 5, 0, 2 * Math.PI);
    ctx.fill();
  }
}

// This function show score.
function showScore() {
  document.getElementById("score_id").innerHTML = score;
}

// Initialize invaders positions.
initiliazeInvadersPositions();

// Draw function defined.
function draw() {
  ctx.globalCompositeOperation = 'destination-over';
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Show ship on canvas.
  showShip();

  // Move invaders.
  moveInvaders();

  // Show invaders on canvas.
  showInvaders();

  // Move and show missiles on canvas.
  for (let i = missiles.length - 1; i >= 0; i--) {
    missiles[i].move();
    missiles[i].show();

    if (missiles[i].y < 0) {
      // Remove missile.
      missiles.splice(i, 1);
    } else if (invaders.length > 0) {
      // Invaders more than 0.
      if (missiles[i].y > invaders[0].y) {
        // Missile is below invaders.
        for (let j = 0; j < invaders.length; j++) {
          if (missiles[i].x > invaders[j].x - 15 && missiles[i].x < invaders[j].x + 15 && missiles[i].y < invaders[j].y + 15 && missiles[i].y > invaders[j].y - 15) {
            // Collision detected remove invader and missile.
            invaders.splice(j, 1);
            missiles.splice(i, 1);
            score++;
            showScore();
            break;
          }
        }
      }
    }
  }

  window.requestAnimationFrame(draw);
}

draw();

// Windows key event.
window.addEventListener("keydown", function (e) {
  e.preventDefault();
  if (e.key == "ArrowLeft") {
    // Move ship left.
    moveShip(-10);
  }
  if (e.key == "ArrowRight") {
    // Move ship right.
    moveShip(10);
  }
  if (e.key == " ") {
    // Fire missile.
    missiles.push(new MissileObject(ship.x, ship.y));
  }
});