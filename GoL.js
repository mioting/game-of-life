let unitLength = 25; //The width and height of a box.
let boxColor = 200; //The color of the box.
let gameBGColor = 0;
let strokeColor = 80; //The color of the stroke of the box.
let columns; /* To be determined by window width */
let rows; /* To be determined by window height */
let currentBoard;
let nextBoard;
let boxRadius = 5;
let fr;
let speedSlider = document.getElementById("speed-slider");

let alive = [];
let dead = [];

document.querySelectorAll(".deadBox").forEach((element) =>
  element.addEventListener("click", function (event) {
    let deadNumber = parseInt(event.target.textContent);
    const index = dead.indexOf(deadNumber);
    if (index > -1) {
      dead.splice(index, 1);
      event.target.classList.remove("color2");
    } else {
      dead.push(deadNumber);
      event.target.classList.add("color2");
    }
  })
);

document.querySelectorAll(".aliveBox").forEach((element) =>
  element.addEventListener("click", function (event) {
    let aliveNumber = parseInt(event.target.textContent);
    const index = alive.indexOf(aliveNumber);
    if (index > -1) {
      alive.splice(index, 1);
      event.target.classList.remove("color");
    } else {
      alive.push(aliveNumber);
      event.target.classList.add("color");
    }
  })
);

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  const canvas = createCanvas(
    windowWidth - (windowWidth % unitLength), //or windowWidth + 1000,
    windowHeight - (windowHeight % unitLength)
  );
  canvas.parent(document.querySelector("#canvas"));
  columns = floor(windowWidth / unitLength);
  rows = floor(windowHeight / unitLength);

  let tmpBoard = currentBoard;
  currentBoard = [];
  nextBoard = [];
  for (let i = 0; i < columns; i++) {
    currentBoard[i] = [];
    nextBoard[i] = [];
  }
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      if (i < tmpBoard.length && j < tmpBoard[0].length) {
        currentBoard[i][j] = tmpBoard[i][j];
        nextBoard[i][j] = 0;
      } else {
        currentBoard[i][j] = 0;
        nextBoard[i][j] = 0;
      }
    }
  }
}

function setup() {
  const tmp = windowWidth > 1000 ? 500 : 0;
  // const containerWidth = windowWidth - 10;
  // const containerHeight = windowHeight - 10;
  const canvas = createCanvas(
    windowWidth - (windowWidth % unitLength), //or windowWidth + 1000,
    windowHeight - (windowHeight % unitLength)
  );
  canvas.parent(document.querySelector("#canvas"));
  columns = floor(windowWidth / unitLength);
  rows = floor(windowHeight / unitLength);

  currentBoard = [];
  nextBoard = [];
  for (let i = 0; i < columns; i++) {
    currentBoard[i] = [];
    nextBoard[i] = [];
  }
  init();
}

function draw() {
  fr = parseInt(speedSlider.value);
  background(0); //game board background color
  generate();
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      if (currentBoard[i][j] == 1) {
        fill(boxColor);
      } else {
        fill(gameBGColor); // game board color
      }
      stroke(strokeColor);
      rect(i * unitLength, j * unitLength, unitLength, unitLength, boxRadius);
    }
  }
  frameRate(fr);
}

//start pattern
function init(randomPop) {
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      if (randomPop) {
        currentBoard[i][j] = random() > 0.8 ? 1 : 0;
      } else {
        currentBoard[i][j] = 0;
      }
      nextBoard[i][j] = 0;

      // currentBoard[i][j] = 0;
      // nextBoard[i][j] = 0;
    }
  }
}

function generate() {
  for (let x = 0; x < columns; x++) {
    for (let y = 0; y < rows; y++) {
      let neighbors = 0;

      for (let i of [-1, 0, 1]) {
        for (let j of [-1, 0, 1]) {
          if (i === 0 && j === 0) {
            continue;
          }
          neighbors +=
            currentBoard[(x + i + columns) % columns][(y + j + rows) % rows]; // make game board warp
        }
      }

      if (currentBoard[x][y] == 1 && !alive.includes(neighbors)) {
        nextBoard[x][y] = 0;
      } else if (currentBoard[x][y] == 0 && dead.includes(neighbors)) {
        nextBoard[x][y] = 1;
      } else {
        nextBoard[x][y] = currentBoard[x][y];
      }
    }
  }

  // Swap the nextBoard to be the current Board
  [currentBoard, nextBoard] = [nextBoard, currentBoard];
}

document
  .querySelector(".random")
  .addEventListener("click", function randomLife() {
    init(true);
  });

document
  .querySelector(".start")
  .addEventListener("click", function startGame() {
    loop();
    console.log("hihihihi");
  });

document
  .querySelector(".pause")
  .addEventListener("click", function pauseGame() {
    noLoop();
  });

document
  .querySelector(".clear")
  .addEventListener("click", function clearGame() {
    setup();
    draw();
    init();
  });

function mouseDragged() {
  /**
   * If the mouse coordinate is outside the board
   */
  if (mouseX > unitLength * columns || mouseY > unitLength * rows) {
    return;
  }
  const x = Math.floor(mouseX / unitLength);
  const y = Math.floor(mouseY / unitLength);
  currentBoard[x][y] = 1;
  fill(boxColor);
  stroke(strokeColor);
  rect(x * unitLength, y * unitLength, unitLength, unitLength);
}

/**
 * When mouse is pressed
 */
function mousePressed() {
  noLoop();
  mouseDragged();
}

/**
 * When mouse is released
 */
function mouseReleased() {
  loop();
}
