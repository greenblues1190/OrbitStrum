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

let createNoteNumTable = () => {
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
};

const noteNumTable = createNoteNumTable();

let noteToNum = (note) => {
  if (!note) return 0;
  const regexp = /([A-G]#?)(\d)/;
  parsedNote = regexp.exec(note);
  let key = parsedNote[1];
  let oct = parsedNote[2];
  return noteNumTable[oct][key];
};

const fps = 30;

let bg;
let lightGray;

let newGrid;
let ballList = [];
let lineList = [];

let isPlaying = false;
let bar = 0;

let viewScale = 1;
let ballAmount = 2;
let velocity = 12;

function Ball(startX, startY, rad, orbitRad, angle, velocity) {
  this.startX = startX;
  this.startY = startY;
  this.x = width / 2;
  this.y = height / 2;
  this.r = rad;
  this.scalar = orbitRad;
  this.angle = angle;
  this.velocity = velocity;
  this.ease = 0.3;

  this.display = function () {
    noStroke();
    fill(lightGray);
    circle(this.x, this.y, this.r * 2);
  };

  this.update = function () {
    const centerX = width / 2;
    const centerY = height / 2;
    let targetX =
      centerX +
      this.startX +
      this.scalar * viewScale * cos(radians(this.angle));
    let dx = targetX - this.x;
    this.x += dx * this.ease;

    let targetY =
      centerY +
      this.startY +
      this.scalar * viewScale * sin(radians(this.angle));
    let dy = targetY - this.y;
    this.y += dy * this.ease;

    this.angle += 0.1 * this.velocity;
  };
}

function Line(y) {
  this.targetVec1 = createVector(0, y);
  this.targetVec2 = createVector(0, y);
  this.vec1 = createVector(width / 2, y + height / 2);
  this.vec2 = createVector(width / 2, y + height / 2);
  this.cpx = (this.vec1.x + this.vec2.x) / 2;
  this.cpy = (this.vec1.y + this.vec2.y) / 2;
  this.shakyCpx = this.cpx;
  this.shakyCpy = this.cpy;

  this.ease = 0.3;

  this.color = lightGray;
  this.magnitude = 0;
  this.tail = 0.5;

  this.osc = new p5.Oscillator("sine");
  this.osc.amp(0);
  this.env = new p5.Envelope(0.0045, velocity * 0.01, 0.2 + this.tail / 1.8, 0);
  this.osc.start();
  reverb.process(this.osc, 5, 2);

  this.isHit = false;

  this.display = function () {
    noFill();
    stroke(this.color);
    bezier(
      this.vec1.x,
      this.vec1.y,
      this.shakyCpx,
      this.shakyCpy,
      this.shakyCpx,
      this.shakyCpy,
      this.vec2.x,
      this.vec2.y
    );
  };

  this.checkCollision = function (ball) {
    // check for collision
    // if hit, change line's stroke color
    let hit = lineCircle(this, ball);
    if (hit && this.isHit === false) {
      this.magnitude = abs(ball.velocity / 1.5);
      let stringLength = dist(
        this.vec1.x,
        this.vec1.y,
        this.vec2.x,
        this.vec2.y
      );
      let lengthToFreq = -1 * ((stringLength - 50) * 3 - 1024);
      this.osc.freq(lengthToFreq);
      if (stringLength > 50) {
        this.env.play(this.osc);
      }
      this.isHit = true;
    } else if (!hit && this.isHit) {
      this.isHit = false;
    }
  };

  this.changeNote = function (note) {
    let x1, x2, stringLength;
    stringLength = note > 0 ? (1024 - midiToFreq(note)) / 3 + 50 : 0;
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
    const centerVec = createVector(width / 2, height / 2);
    let absoluteTargetVec1 = p5.Vector.add(this.targetVec1, centerVec);
    let absoluteTargetVec2 = p5.Vector.add(this.targetVec2, centerVec);
    this.vec1 = easeVector(this.vec1, absoluteTargetVec1, this.ease);
    this.vec2 = easeVector(this.vec2, absoluteTargetVec2, this.ease);

    this.cpx = (this.vec1.x + this.vec2.x) / 2;
    this.cpy = (this.vec1.y + this.vec2.y) / 2;

    if (this.magnitude > 0) this.magnitude *= 0.8 + this.tail * 0.13;
    this.shakyCpx = this.cpx;
    this.shakyCpy = this.cpy + sin(frameCount * 1.5) * this.magnitude;
  };
}

function grid(gridColor) {
  this.gridColor = gridColor;
  this.centerVec = createVector(width / 2, height / 2);
  this.ease = 0.3;

  this.display = function () {
    stroke(this.gridColor);
    line(this.centerVec.x, 0, this.centerVec.x, height);
    line(0, this.centerVec.y, width, this.centerVec.y);
  };
  this.update = function () {
    const updatedCenterVec = createVector(width / 2, height / 2);
    this.centerVec = easeVector(this.centerVec, updatedCenterVec, this.ease);
  };
}

// function preload() {
//   inconsolata = loadFont("assets/SourceSansPro-Regular.ttf");
// }

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(fps);

  reverb = new p5.Reverb();
  let dryWet = 0.6;
  reverb.drywet(dryWet);

  bg = color("#1D4E89");
  lightGray = color("#e6e6e6");

  newGrid = new grid(color("#00397F"));

  let orbitRadius = width / 4;
  for (let i = 0; i < ballAmount; i += 1) {
    let newBall = new Ball(
      -1 * orbitRadius,
      0,
      4,
      orbitRadius,
      (360 / ballAmount) * i - 50,
      velocity
    );
    ballList.push(newBall);
  }
  for (let i = 0; i < ballAmount; i += 1) {
    let newBall = new Ball(
      orbitRadius,
      0,
      4,
      orbitRadius,
      (360 / ballAmount) * (i + 0.5) + 50,
      -1 * velocity
    );
    ballList.push(newBall);
  }

  let lineAmount = 8;
  let lineSpace = 37;
  for (let i = 0; i < lineAmount; i += 1) {
    newLine = new Line(lineSpace * ((lineAmount - 1) / 2 - i) * viewScale);
    lineList.push(newLine);
  }

  textFont("assets/SourceSansPro-Regular.ttf");
  textSize(32);

  // mimics the autoplay policy
  getAudioContext().suspend();
}

function draw() {
  background(bg);

  newGrid.update();
  newGrid.display();

  fill(lightGray);

  ballList.map((ball) => {
    ball.update();
    ball.display();
  });

  lineList.map((line) => {
    ballList.map((ball) => {
      line.checkCollision(ball);
    });
    line.update();
    line.display();
  });

  // 1 strum = 1초 / 1 strum에 걸리는 시간 = (frameCount / fps) / (((180 / ballAmount)/(0.1 * velocity))/fps)
  let deg = int((frameCount * 0.1 * velocity * ballAmount) / 2); // 1 strum * 90
  let strum = int(deg / 90);
  // text("strum " + strum + " deg " + deg, 10, 30);
  if (deg % 90 === 0 && isPlaying) {
    changeMelody(strum);
  }
}

// this function fires after the mouse has been
// clicked anywhere
function mousePressed() {
  if (isPlaying) {
    lineList.map((line, index) => {
      line.changeNote(0);
    });
  } else {
    lineList.map((line, index) => {
      note = 56;
      line.changeNote(note);
    });
  }
  isPlaying = !isPlaying;
  userStartAudio();
}

function changeMelody(strum) {
  // console.log(strum);
  let note;
  lineList.map((line, index) => {
    note = midiNotes[strum % midiNotes.length][index];
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
let lineCircle = (line, circle) => {
  // is either end INSIDE the circle?
  // if so, return true immediately

  let x1 = line.vec1.x;
  let y1 = line.vec1.y;
  let x2 = line.vec2.x;
  let y2 = line.vec2.y;
  let cx = circle.x;
  let cy = circle.y;
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

  // optionally, draw a circle at the closest
  // point on the line
  // fill(255, 0, 0);
  // noStroke();
  // ellipse(closestX, closestY, 10, 10);

  // get distance to closest point
  let distance = dist(closestX, closestY, cx, cy);

  if (distance <= r) {
    return true;
  }
  return false;
};

// POINT/CIRCLE
let pointCircle = (px, py, cx, cy, r) => {
  // get distance between the point and circle's center
  // using the Pythagorean Theorem
  let distance = dist(px, py, cx, cy);

  // if the distance is less than the circle's
  // radius the point is inside!
  if (distance <= r) {
    return true;
  }
  return false;
};

// LINE/POINT
let linePoint = (x1, y1, x2, y2, px, py) => {
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
};

let easeVector = (vec, targetVec, ease) => {
  let dx = targetVec.x - vec.x;
  let dy = targetVec.y - vec.y;
  vec = createVector(vec.x + dx * ease, vec.y + dy * ease);
  return vec;
};

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
