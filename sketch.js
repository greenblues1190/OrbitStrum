const midiNotes = [
  [56, 60, 63, 67, 58, 68],
  [60, 64, 67, 71, 74, 69],
];

const fps = 30;

let bg;
let lightGray;

let ballList = [];
let lineList = [];

let isPlaying = false;
let bar = 0;

let velocity = 15;
let debounceTime = 60; // 60frame

function Ball(startX, startY, rad, orbitRad, angle, velocity) {
  this.startX = startX;
  this.startY = startY;
  this.x = startX;
  this.y = startY;
  this.r = rad;
  this.scalar = orbitRad;
  this.angle = angle;
  this.velocity = velocity;
  this.ease = 0.4;

  this.display = function () {
    noStroke();
    fill(lightGray);
    circle(this.x, this.y, this.r * 2);
  };

  this.update = function () {
    this.angle += 0.1 * this.velocity;

    let targetX = this.startX + this.scalar * cos(radians(this.angle));
    let dx = targetX - this.x;
    this.x += dx * this.ease;

    let targetY = this.startY + this.scalar * sin(radians(this.angle));
    let dy = targetY - this.y;
    this.y += dy * this.ease;

    if (this.x < -1 * (rad + 1)) {
      this.x = width;
    }
    if (this.y < -1 * (rad + 1)) {
      this.y = height;
    }
    if (this.x > width + rad + 1) {
      this.x = 0;
    }
    if (this.y > height + rad + 1) {
      this.y = 0;
    }
  };
}

function Line(x) {
  this.targetVec1 = createVector(x, height / 2);
  this.targetVec2 = createVector(x, height / 2);
  this.vec1 = createVector(x, height / 2);
  this.vec2 = createVector(x, height / 2);
  this.cpx = (this.vec1.x + this.vec2.x) / 2;
  this.cpy = (this.vec1.y + this.vec2.y) / 2;
  this.shakyCpx = this.cpx;
  this.shakyCpy = this.cpy;

  this.ease = 0.07;

  this.color = lightGray;
  this.magnitude = 0;
  this.tail = 0.2;

  this.osc = new p5.Oscillator("sine");
  this.osc.amp(0);
  this.env = new p5.Envelope(0.0045, 0.2, 0.2 + this.tail / 1.8, 0);
  this.osc.start();
  reverb.process(this.osc, 4, 2);

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
    if (hit && this.isHit == false) {
      this.magnitude = abs(ball.velocity / 1.5);
      let stringLength = dist(this.vec1.x, this.vec1.y, this.vec2.x, this.vec2.y);
      let lengthToFreq = -1 * (stringLength * 2.5 - 1024);
      this.osc.freq(lengthToFreq);
      if (stringLength > 5) {
      this.env.play(this.osc);
      }
      this.isHit = true;
    } else if (!hit && this.isHit) {
      this.isHit = false;
    }
  };

  this.changeNote = function (note) {
    let y1, y2, stringLength;
    stringLength = note >= 40 ? (1024 - midiToFreq(note)) / 2.5 : 0;
    y1 = height / 2 - stringLength / 2;
    y2 = height / 2 + stringLength / 2;

    targetVec1 = createVector(this.targetVec1.x, y1);
    targetVec2 = createVector(this.targetVec1.x, y2);

    this.move(targetVec1, targetVec2);
  }

  this.move = function (targetVec1, targetVec2) {
    this.targetVec1 = targetVec1;
    this.targetVec2 = targetVec2;
  };

  this.update = function () {
    this.vec1 = easeVector(this.vec1, this.targetVec1, this.ease);
    this.vec2 = easeVector(this.vec2, this.targetVec2, this.ease);

    this.cpx = (this.vec1.x + this.vec2.x) / 2;
    this.cpy = (this.vec1.y + this.vec2.y) / 2;

    if (this.magnitude > 0) this.magnitude *= 0.8 + this.tail * 0.13;
    this.shakyCpx = this.cpx + sin(frameCount * 1.5) * this.magnitude;
    this.shakyCpy = this.cpy;
  };
}

function preload() {
  inconsolata = loadFont('assets/SourceSansPro-Regular.ttf');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(fps);
  reverb = new p5.Reverb();
  let dryWet = 0.6;
  reverb.drywet(dryWet);

  bg = color("#1D4E89");
  lightGray = color("#e6e6e6");

  let ballAmount = 2;
  let orbitRadius = height / 4 - 40;
  for (let i = 0; i < ballAmount; i += 1) {
    newBall = new Ball(
      width / 2,
      height / 2 + 10 - orbitRadius,
      4,
      orbitRadius,
      (360 / ballAmount) * (i + 0.5) + 38,
      velocity
    );
    ballList.push(newBall);
  }
  for (let i = 0; i < ballAmount; i += 1) {
    newBall = new Ball(
      width / 2,
      height / 2 - 10 + orbitRadius,
      4,
      orbitRadius,
      (360 / ballAmount) * (i + 1) - 38,
      -1 * velocity
    );
    ballList.push(newBall);
  }

  let lineAmount = 8;
  for (let i = 0; i < lineAmount; i += 1) {
    newLine = new Line(
      width / 2 + 24 * ((lineAmount - 1) / 2 - i)
    );
    lineList.push(newLine);
  }

  textFont("assets/SourceSansPro-Regular.ttf");
  textSize(32);

  // mimics the autoplay policy
  getAudioContext().suspend();
}

function draw() {
  background(bg);

  // Grid
  // stroke(color("#00397F"));
  // line(width / 2, 0, width / 2, height);
  // line(0, height / 2, width, height / 2);

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

  bar = frameCount/(450/fps);
  text("orbit " + (bar / 40).toFixed(0), 10, 30);
  if ((bar % 40).toFixed(1)== 0 && isPlaying) {
    changeMelody(bar);
  }
}

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

// this function fires after the mouse has been
// clicked anywhere
function changeMelody(bar) {
  // console.log(int(bar)/5);
  lineList.map((line, index) => {
    note = midiNotes[int(bar) / 40 % midiNotes.length][int(random(midiNotes[0].length))];
    line.changeNote(note);
  });
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
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

//180 = 0.1 * velocity