const midiNotes = [
  ["A#2", "C3", "D3", "G3", "G3", "D3", "C3", "A#2"],
  ["A#2", "C3", "D3", "G3", "G3", "D3", "C3", "A#2"],
  ["A#2", "C3", "D3", "G3", "G3", "D3", "C3", "A#2"],
  ["A#2", "C3", "D3", "G3", "G3", "D3", "C3", "A#2"],
  ["A#2", "C3", "D3", "G3", "G3", "D3", "C3", "A#2"],
  ["A#2", "C3", "D3", "G3", "G3", "D3", "C3", "A#2"],
  ["A2", "A#2", "C3", "F3", "F3", "C3", "A#2", "A2"],
  ["G2", "A2", "A#2", "E3", "E3", "A#2", "A2", "G2"],
  ["F1", "C2", "A2", "F3", "D3", "A2", "C3", "F3"],
  ["F1", "C2", "A2", "F3", "D3", "A2", "C3", "F3"],
  ["D1", "A1", "D2", "F2", "A2", "C3", "E3", "C3"],
  ["A2", "F2", "A2", "C3", "G1", "D2", "G2", "A#2"],
  ["D1", "A1", "D2", "F2", "A2", "C3", "E3", "C3"],
  ["A2", "F2", "A2", "C3", "G1", "D2", "G2", "A#2"],
  ["C1", "G1", "E2", "G2", "A#2", "D3", "E3", "D3"],
  ["A#2", "D2", "A#2", "G2", "F1", "C2", "F2", "A2"],
  ["A1", "E2", "A2", "E2", "D2", "A2", "F2", "D2"],
  ["G1", "F2", "G2", "A#2", "C1", "G1", "E2", "A#2"],
  ["F0", "F1", "C2", "D#2", "G2", "A2", "C3", "D#3"],
  ["G3", "D#3", "C3", "A2", "G2", "D#2", "C2", "F1"],
  ["F0", "F1", "C2", "D#2", "G2", "A2", "C3", "D#3"],
  ["G3", "D#3", "C3", "A2", "G2", "D#2", "C2", "F1"],
  ["A#0", "F1", "A#2", "D2", "F2", "A#2", "D3", "F3"],
  ["D3", "A#2", "F2", "D2", "A#1", "F1", "A#0", "F1"],
  ["A#0", "F1", "A#2", "D2", "F2", "A#2", "D3", "F3"],
  ["D3", "A#2", "F2", "D2", "A#1", "F1", "A#0", "F1"],
  ["G0", "G1", "C#2", "F2", "A2", "C#3", "F3", "A3"],
  ["G1", "D2", "F2", "A2", "D3", "A2", "F2", "D2"],
  ["G0", "G1", "C#2", "F2", "A2", "C#3", "F3", "A3"],
  ["G1", "D2", "F2", "A2", "D3", "A2", "F2", "D2"],
  ["G1", "D2", "F2", "A2", "D3", "A2", "F2", "D2"],
  ["G1", "D2", "F2", "A2", "B2", "A2", "G2", "F2"],
  ["C1", "G1", "C2", "E2", "G2", "C3", "E3", "G3"],
  ["C4", "E4", "G4", "C5", "G4", "E4", "C4", "G3"],
];

function createNoteNumTable() {
  let root;
  let noteNumTable = [];
  for (let oct = 0; oct < 8; ++oct) {
    noteNumTable[oct] = [];
    root = 12 * (oct + 2);
    noteNumTable[oct]["C"] = root;
    noteNumTable[oct]["C#"] = root + 1;
    noteNumTable[oct]["D"] = root + 2;
    noteNumTable[oct]["D#"] = root + 3;
    noteNumTable[oct]["E"] = root + 4;
    noteNumTable[oct]["F"] = root + 5;
    noteNumTable[oct]["F#"] = root + 6;
    noteNumTable[oct]["G"] = root + 7;
    noteNumTable[oct]["G#"] = root + 8;
    noteNumTable[oct]["A"] = root + 9;
    noteNumTable[oct]["A#"] = root + 10;
    noteNumTable[oct]["B"] = root + 11;
  }

  return noteNumTable;
}

const noteNumTable = createNoteNumTable();

function noteToNum(note) {
  if (!note) return 0;
  const regexp = /([A-G]#?)(\d)/;
  parsedNote = regexp.exec(note);
  let key = parsedNote[1];
  let oct = parsedNote[2];
  return noteNumTable[oct][key];
}

const fps = 60;
const X_AXIS = 1;
const Y_AXIS = 2;

let myFont;
let bgBottom, bgTop, ballColor, lineColor, textColor;

let intro;
let newGrid;
let ballList = [];
let lineList = [];

let isPlaying = false;
let bar = 0;

let viewScale;
let ballAmount = 2;
let velocity = 7;

function Ball(ballColor, rad, angle, velocity, clockwise = false) {
  this.color = color(ballColor);
  this.targetVec = createVector(0, 0);
  this.vec = createVector((width / 5) * (clockwise ? -1 : 1), 0);
  this.r = rad;
  this.angle = angle;
  this.velocity = velocity;
  this.clockwise = clockwise;
  this.ease = 0.5;
  this.display = function () {
    // noStroke();
    stroke(color("#FFFFFF"))
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
      this.vec2.y + centerVec.y + 5
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
      this.magnitude = abs(ballList[hitBallIndex].velocity * 3);
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
  this.title = "orbit strum";
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
    text(this.message, width / 2 - introWidth / 2, height / 2 + 9);
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

function preload() {
  myFont = loadFont('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_20-07@1.0/IBMPlexSansKR-Medium.woff'); 
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(fps);

  reverb = new p5.Reverb();
  let dryWet = 0.6;
  reverb.drywet(dryWet);

  textFont(myFont);

  bgTop = color("#FF6F03");
  bgBottom = color("#FF6F03");
  let colorA = "#f4f9f9";
  let black = "#000000";
  ballColor = black;
  lineColor = colorA;
  textColor = colorA;
  gridColor = "#3f72af"

  viewScale = 0.9;

  newGrid = new Grid(gridColor);

  let lineQuantity = midiNotes[0].length;
  for (let i = 0; i < lineQuantity; i += 1) {
    newLine = new Line(lineQuantity, i, lineColor);
    lineList.push(newLine);
  }

  let ballRad = 6;

  for (let i = 0; i < ballAmount; i += 1) {
    let newBall = new Ball(ballColor, ballRad, (360 / ballAmount) * (i + 0.5) - 130, velocity);
    ballList.push(newBall);
  }

  for (let i = 0; i < ballAmount; i += 1) {
    let newBall = new Ball(ballColor, ballRad, (360 / ballAmount) * i - 50, velocity, true);
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

function changeMelody(chordIndex) {
  lineList.map((line, index) => {
    note = midiNotes[chordIndex][index];
    line.changeNote(noteToNum(note));
  });
}

const efficientResize = debounce(function () {
  resizeCanvas(windowWidth, windowHeight);
}, 100);

function windowResized() {
  efficientResize();
}

// LINE/CIRCLE
function lineCircle(line, circle) {
  // is either end INSIDE the circle?
  // if so, return true immediately

  let x1 = line.vec1.x;
  let y1 = line.vec1.y;
  let x2 = line.vec2.x;
  let y2 = line.vec2.y;
  let cx = circle.vec.x;
  let cy = circle.vec.y;
  let r = circle.r;

  let inside1 = pointCircle(x1, y1, cx, cy, r);
  let inside2 = pointCircle(x2, y2, cx, cy, r);
  if (inside1 || inside2) return true;

  // get length of the line
  let distX = x1 - x2;
  let distY = y1 - y2;
  let len = dist(x1, y1, x2, y2);

  // get dot product of the line and circle
  let dot = ((cx - x1) * (x2 - x1) + (cy - y1) * (y2 - y1)) / pow(len, 2);

  // find the closest point on the line
  let closestX = x1 + dot * (x2 - x1);
  let closestY = y1 + dot * (y2 - y1);

  // is this point actually on the line segment?
  // if so keep going, but if not, return false
  let onSegment = linePoint(x1, y1, x2, y2, closestX, closestY);
  if (!onSegment) return false;

  // get distance to closest point
  let distance = dist(closestX, closestY, cx, cy);

  if (distance <= r) {
    return true;
  }
  return false;
}

// POINT/CIRCLE
function pointCircle(px, py, cx, cy, r) {
  // get distance between the point and circle's center
  // using the Pythagorean Theorem
  let distance = dist(px, py, cx, cy);

  // if the distance is less than the circle's
  // radius the point is inside!
  if (distance <= r) {
    return true;
  }
  return false;
}

// LINE/POINT
function linePoint(x1, y1, x2, y2, px, py) {
  // get distance from the point to the two ends of the line
  let d1 = dist(px, py, x1, y1);
  let d2 = dist(px, py, x2, y2);

  // get the length of the line
  let lineLen = dist(x1, y1, x2, y2);

  // since floats are so minutely accurate, add
  // a little buffer zone that will give collision
  let buffer = 0.1; // higher # = less accurate

  // if the two distances are equal to the line's
  // length, the point is on the line!
  // note we use the buffer here to give a range,
  // rather than one #
  if (d1 + d2 >= lineLen - buffer && d1 + d2 <= lineLen + buffer) {
    return true;
  }
  return false;
}

function easeVector(vec, targetVec, ease) {
  let dx = targetVec.x - vec.x;
  let dy = targetVec.y - vec.y;
  vec = createVector(vec.x + dx * ease, vec.y + dy * ease);
  return vec;
}

function debounce(func, wait) {
  let inDebounce;
  return function () {
    const context = this;
    const args = arguments;

    // setTimeout이 실행된 Timeout의 ID를 반환하고, clearTimeout()으로 이를 해제할 수 있음을 이용
    clearTimeout(inDebounce);

    inDebounce = setTimeout(() => func.apply(context, arguments), wait);
  };
}