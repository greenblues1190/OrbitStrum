const fps = 60;
const X_AXIS = 1;
const Y_AXIS = 2;

let intro;
let newGrid;
let ballList = [];
let lineList = [];
let bgBottom, bgTop, ballColor, lineColor, textColor;
let viewScale;
let ballAmount;
let velocity;
let bar;
let isPlaying = false;

function Ball(ballColor, ballStrokeColor, rad, angle, velocity, clockwise = false) {
  this.color = color(ballColor);
  this.strokeColor = color(ballStrokeColor);
  this.targetVec = createVector(0, 0);
  this.vec = createVector((width / 5) * (clockwise ? -1 : 1), 0);
  this.r = rad;
  this.angle = angle;
  this.velocity = velocity;
  this.clockwise = clockwise;
  this.ease = 0.3;
  this.display = function () {
    // noStroke();
    stroke(this.strokeColor);
    fill(this.color);
    circle(this.vec.x + width / 2, this.vec.y + height / 2, this.r * 2);
  };

  this.update = function () {
    let orbitRadius = width / 4;

    let startVec = createVector(orbitRadius * (this.clockwise ? -1 : 1), 0);

    this.targetVec.x = orbitRadius * cos(radians(this.angle));
    this.targetVec.y = orbitRadius * sin(radians(this.angle));
    this.targetVec.add(startVec).mult(viewScale);

    this.vec = easeVector(this.vec, this.targetVec, this.ease);

    this.angle += (this.clockwise ? 1 : -1) * 0.1 * this.velocity; //
  };
}

function Line(quantity, index, lineColor) {
  this.quantity = quantity;
  this.index = index;
  this.lineSpace = 62;
  this.targetVec1 = createVector(0, 0);
  this.targetVec2 = createVector(0, 0);
  let y = ((this.lineSpace * width) / 1440) * (this.index - (this.quantity - 1) / 2);
  this.vec1 = createVector(
    0,
    y
  );
  this.vec2 = createVector(
    0,
    y
  );
  this.cpx = (this.vec1.x + this.vec2.x) / 2;
  this.cpy = (this.vec1.y + this.vec2.y) / 2;
  this.shakyCpx = this.cpx;
  this.shakyCpy = this.cpy;

  this.ease = 0.2;

  this.color = color(lineColor);
  this.magnitude = 0;
  this.tail = 0.5;

  this.osc = new p5.Oscillator("sine");
  this.osc.amp(0);
  this.env = new p5.Envelope(0.0045, velocity * 0.05, 0.2 + this.tail / 1.8, 0);
  this.osc.start();
  reverb.process(this.osc, 5, 2);

  this.isFirstHit = false;

  this.display = function () {
    const centerVec = createVector(width / 2, height / 2);

    noFill();
    stroke(this.color);
    bezier(
      this.vec1.x + centerVec.x,
      this.vec1.y + centerVec.y,
      this.shakyCpx + centerVec.x,
      this.shakyCpy + centerVec.y,
      this.shakyCpx + centerVec.x,
      this.shakyCpy + centerVec.y,
      this.vec2.x + centerVec.x,
      this.vec2.y + centerVec.y
    );
    let stringLength = dist(this.vec1.x, this.vec1.y, this.vec2.x, this.vec2.y);
    let lengthToFreq =
      -1 * ((stringLength / viewScale / (width / 1440)) * 1.5 - 1300);

    fill(this.color);
    noStroke();
    textSize(12);
    text(
      stringLength > 1 ? lengthToFreq.toFixed(2) + " Hz" : "",
      this.vec2.x + centerVec.x + 50 / (1440 / width),
      this.vec2.y + centerVec.y + 4
    );
  };

  this.checkCollision = function (ballList) {
    // check for collision
    // if hit, change line's stroke color
    let hitBallIndex = false;
    ballList.map((ball, index) => {
      let hit = lineCircle(this, ball);
      if (hit) {
        hitBallIndex = index;
      }
    });
    if (hitBallIndex !== false && !this.isFirstHit) {
      this.magnitude = abs(ballList[hitBallIndex].velocity * 2);
      let stringLength = dist(
        this.vec1.x,
        this.vec1.y,
        this.vec2.x,
        this.vec2.y
      );
      let lengthToFreq =
        -1 * ((stringLength / viewScale / (width / 1440)) * 1.5 - 1300);
      this.osc.freq(lengthToFreq);
      if (stringLength > 30) {
        this.env.play(this.osc);
      }
      this.isFirstHit = true;
    } else if (hitBallIndex === false && this.isFirstHit) {
      this.isFirstHit = false;
    }
  };

  this.changeNote = function (note) {
    let x1, x2, stringLength;
    stringLength = note > 0 ? (1300 - midiToFreq(note)) / 1.5 + 0 : 0;
    x1 = (-1 * stringLength) / 2;
    x2 = stringLength / 2;

    targetVec1 = createVector(x1, this.targetVec1.y);
    targetVec2 = createVector(x2, this.targetVec2.y);

    this.move(targetVec1, targetVec2);
  };

  this.move = function (targetVec1, targetVec2) {
    this.targetVec1 = targetVec1;
    this.targetVec2 = targetVec2;
  };

  this.update = function () {
    let lineSpace = this.lineSpace * (width / 1440);

    let y = lineSpace * (this.index - (this.quantity - 1) / 2);
    this.targetVec1.y = y;
    this.targetVec2.y = y;

    let absoluteTargetVec1 = createVector(
      this.targetVec1.x * (width / 1440),
      this.targetVec1.y
    );
    absoluteTargetVec1.mult(viewScale);

    let absoluteTargetVec2 = createVector(
      this.targetVec2.x * (width / 1440),
      this.targetVec2.y
    );
    absoluteTargetVec2.mult(viewScale);

    this.vec1 = easeVector(this.vec1, absoluteTargetVec1, this.ease);
    this.vec2 = easeVector(this.vec2, absoluteTargetVec2, this.ease);

    this.cpx = (this.vec1.x + this.vec2.x) / 2;
    this.cpy = (this.vec1.y + this.vec2.y) / 2;

    if (this.magnitude > 0) {
      this.magnitude *= 0.8 + this.tail * 0.2;
    }
    this.shakyCpx = this.cpx;
    this.shakyCpy =
      this.cpy + (sin(frameCount * 1.5) * this.magnitude * width) / 1440;
  };
}

function Grid(gridColor) {
  this.gridColor = color(gridColor);
  this.centerVec = createVector(width / 2, height / 2);

  this.display = function () {
    stroke(this.gridColor);
    line(this.centerVec.x, 0, this.centerVec.x, height);
    line(0, this.centerVec.y, width, this.centerVec.y);
  };
  this.update = function () {
    this.centerVec.x = width / 2;
    this.centerVec.y = height / 2;
  };
}

function Intro(introColor) {
  this.title = "ORBIT STRUM";
  this.message = "click or press spacebar";
  this.titleColor = color(introColor);
  this.messageColor = color(introColor);

  this.display = function () {
    noStroke();
    textSize(32);
    fill(this.titleColor);
    let introWidth = textWidth(this.title);
    text(this.title, width / 2 - introWidth / 2, height / 5 - 12);
    textSize(18);
    fill(this.messageColor);
    introWidth = textWidth(this.message);
    text(this.message, width / 2 - introWidth / 2, height / 2 + 5);
  };
  this.update = function () {
    if (isPlaying) {
      let introAlpha = alpha(this.titleColor);
      if (introAlpha > 0) {
        this.titleColor.setAlpha(alpha(this.titleColor) - 15);
        this.messageColor.setAlpha(alpha(this.messageColor) - 15);
      }
    } else {
      this.messageColor.setAlpha(128 + 128 * sin(frameCount / fps * 3));
    }
  };
}

function setGradient(x, y, w, h, c1, c2, axis) {
  noFill();

  if (axis === Y_AXIS) {
    // 위에서 아래 방향 그래디언트
    for (let i = y; i <= y + h; i++) {
      let inter = map(i, y, y + h, 0, 1);
      let c = lerpColor(c1, c2, inter);
      stroke(c);
      line(x, i, x + w, i);
    }
  } else if (axis === X_AXIS) {
    // 왼쪽에서 오른쪽 방향 그래디언트
    for (let i = x; i <= x + w; i++) {
      let inter = map(i, x, x + w, 0, 1);
      let c = lerpColor(c1, c2, inter);
      stroke(c);
      line(i, y, i, y + h);
    }
  }
}

// this function fires after the mouse has been
// clicked anywhere
function mousePressed() {
  if (!isPlaying) {
    isPlaying = true;
    userStartAudio();
  }
  changeMelody(int(random(midiNotes.length)));
}

function keyPressed() {
  if (keyCode === 32) {
    if (!isPlaying) {
      isPlaying = true;
      userStartAudio();
    }
    changeMelody(int(random(midiNotes.length)));
  }
  return false; // prevent any default behaviour
}

const efficientResize = debounce(function () {
  resizeCanvas(windowWidth, windowHeight);
}, 100);

function windowResized() {
  efficientResize();
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(fps);

  reverb = new p5.Reverb();
  let dryWet = 0.6;
  reverb.drywet(dryWet);

  textFont("Montserrat");

  bgTop = color("#FF6F03");
  bgBottom = color("#FF6F03");
  let colorA = "#ffffff";
  ballColor = colorA;
  ballStrokeColor = colorA;
  lineColor = colorA;
  textColor = colorA;
  gridColor = "#3f72af"

  viewScale = 0.9;

  ballAmount = 2;
  velocity = 7;
  bar = 0

  newGrid = new Grid(gridColor);

  let lineQuantity = midiNotes[0].length;
  for (let i = 0; i < lineQuantity; i += 1) {
    newLine = new Line(lineQuantity, i, lineColor);
    lineList.push(newLine);
  }

  let ballRad = 6;

  for (let i = 0; i < ballAmount; i += 1) {
    let newBall = new Ball(ballColor, ballStrokeColor, ballRad, (360 / ballAmount) * (i + 0.5) - 130, velocity);
    ballList.push(newBall);
  }

  for (let i = 0; i < ballAmount; i += 1) {
    let newBall = new Ball(ballColor, ballStrokeColor, ballRad, (360 / ballAmount) * i - 50, velocity, true);
    ballList.push(newBall);
  }

  intro = new Intro(textColor);

  // mimics the autoplay policy
  getAudioContext().suspend();
}

function draw() {
  setGradient(0, 0, width, height, bgTop, bgBottom, Y_AXIS)

  // newGrid.update();
  // newGrid.display();

  lineList.map((line) => {
    line.checkCollision(ballList);
    line.update();
    line.display();
  });

  ballList.map((ball) => {
    ball.update();
    ball.display();
  });

  // 1 strum = 1초 / 1 strum에 걸리는 시간 = (frameCount / fps) / (((180 / ballAmount)/(0.1 * velocity))/fps)
  // let deg = int((frameCount * 0.1 * velocity * ballAmount) / 2); // 1 strum * 90
  // let strum = int(deg / 90);
  // fill(color(textColor));
  // noStroke();
  // textSize(32);
  // text("strum " + strum + " deg " + deg, 10, 30);
  // if (deg % 90 === 0 && isPlaying) {
  //   changeMelody(strum);
  // }

  intro.update();
  intro.display();
}
