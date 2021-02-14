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
