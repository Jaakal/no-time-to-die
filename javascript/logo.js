function setupCanvas(canvas) {
  // Get the device pixel ratio, falling back to 1.
  let devicePixelRatio = window.devicePixelRatio || 1;
  
  // Get the size of the canvas in CSS pixels.
  let rect = canvas.getBoundingClientRect();
  
  // Give the canvas pixel dimensions of their CSS
  // size * the device pixel ratio.
  canvas.width = rect.width * devicePixelRatio;
  canvas.height = rect.height * devicePixelRatio;
  
  // Scale all drawing operations by the device pixel ratio, so you
  // don't have to worry about the difference.
  let context = canvas.getContext('2d');
  
  context.scale(devicePixelRatio, devicePixelRatio);
  
  return context;
}

// Calculates vector length
function vectorLength(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

// Creates straight line equation after two points and calculates a point second coordinate on that line after one coordinate
function calculateCoordinate(x1, y1, x2, y2, coordinateGiven, coordinate1) {
  let k = (y2 - y1) / (x2 - x1);
  let coordinate2;

  switch(coordinateGiven) {
    case 'x':
      coordinate2 = k * (coordinate1 - x1) + y1;
      break;
    case 'y':
      coordinate2 = (coordinate1 - y1 + k * x1) / k;
  }

  return coordinate2;
}

// Overall variables
let canvas = document.getElementsByClassName("canvas")[0];
let context = setupCanvas(canvas);

let time;
let startTime;
let currentTime;
let animationDuration = 4000;

let devicePixelRatio = window.devicePixelRatio || 1;
let unitLength;

if (canvas.width / canvas.height >= 103.5 / 114) {
  unitLength = (canvas.height / devicePixelRatio) / 154;
} else {
  unitLength = (canvas.width / devicePixelRatio) / 137.5;
}

let xStart = ((canvas.width / devicePixelRatio) - 103.5 * unitLength) / 2 + unitLength;
let yStart = ((canvas.height / devicePixelRatio) - 114 * unitLength) / 2 + unitLength;

let letterFunctionsArray = [];

// Letter 'N' (first - n1)
//  ______  ____
// |      \ \   |
//  \      \ \ 3|
//   \      \ \ |
// |\ \  1   \ \|
// | \ \      \
// |2 \ \      \
// |___| \______|

/*
 * Overall variables
 */

// That specific animation duration time from the overall animation time
let n1AnimationStart = 0;
let n1AnimationDuration = animationDuration * 0.467;

// Boolean for detecting if the whole animation is over
let n1AnimationOver = false;

/*
 * Part 1 related variables (n1_p1)
 */

// Boolean for detecting if first part is growing or diminishing
let n1_p1Growing = true;

// Animation ending coordinates what are used to calculate all the rest
let n1_p1_x2 = xStart + unitLength * 11;
let n1_p1_y2 = yStart;
let n1_p1_x3 = xStart + unitLength * 23;
let n1_p1_y3 = yStart + unitLength * 25;

// End coordinates for the extended part one
let n1_p1_y3Extended = yStart + unitLength * 114;
let n1_p1_x3Extended = calculateCoordinate(n1_p1_x2, n1_p1_y2, n1_p1_x3, n1_p1_y3, 'y', n1_p1_y3Extended);

// k is slope for the straight line equation
// d is length between the initial two side points
// dExtended is the length between two side points of the extended part one
let n1_p1_k = (n1_p1_y3 - n1_p1_y2) / (n1_p1_x3 - n1_p1_x2);
let n1_p1_d = Math.sqrt(Math.pow(n1_p1_x3 - n1_p1_x2, 2) + Math.pow(n1_p1_y3 - n1_p1_y2, 2));
let n1_p1_dExtended = Math.sqrt(Math.pow(n1_p1_x3Extended - n1_p1_x2, 2) + Math.pow(n1_p1_y3Extended - n1_p1_y2, 2));

// percentage shows how much of the animation is completed
// length is the extended straight line length
// sqrt is a middle outcome for calculating end coordinate for the straight line relative to length
let n1_p1Percentage;
let n1_p1Length;
let n1_p1Sqrt;

// Dynamic coordinates used during the animation
let n1_p1_x2New;
let n1_p1_y2New;
let n1_p1_x3New = n1_p1_x3Extended;
let n1_p1_y3New = n1_p1_y3Extended;

/*
 * Part 2 related variables (n1_p2)
 */

// percentage shows how much of the animation is completed
let n1_p2Percentage;

// x-coordinates are static through the animation, only y-coordinates are necessary
// y-coordinates in the animation start
let n1_p2_y1Start = yStart + unitLength * 39;
let n1_p2_y2Start = yStart + unitLength * 55.667;
let n1_p2_y3Start = n1_p1_y3Extended;
let n1_p2_y4Start = n1_p1_y3Extended;

// y-coordinates in the animation end
let n1_p2_y1End = yStart + unitLength * 7;
let n1_p2_y2End = yStart + unitLength * 23.667;
let n1_p2_y3End = yStart + unitLength * 27;
let n1_p2_y4End = yStart + unitLength * 27;

/*
 * Part 3 related variables (n1_p3)
 */

// percentage shows how much of the animation is completed
let n1_p3Percentage;

// x-coordinates are static through the animation, only y-coordinates are necessary
// y-coordinates in the animation start
let n1_p3_y1Start = yStart - unitLength * 20;
let n1_p3_y2Start = yStart - unitLength * 20;
let n1_p3_y3Start = yStart;
let n1_p3_y4Start = yStart - unitLength * 16.667;

// y-coordinates in the animation end
let n1_p3_y1End = yStart;
let n1_p3_y2End = yStart;
let n1_p3_y3End = yStart + unitLength * 20;
let n1_p3_y4End = yStart + unitLength * 3.333;

// Variable for the delayed animation
let n1_p3_yAdd;

function drawAnimatedLetterNFirst() {
  if(!n1AnimationOver) {
    if (n1_p1Growing) {
      n1_p1Percentage = (currentTime - startTime - n1AnimationStart) / (n1AnimationDuration * 0.5);

      if (n1_p1Percentage >= 1.0) {
        n1_p1_x2New = n1_p1_x2;
        n1_p1_y2New = n1_p1_y2;
        n1_p1Growing = false;
      } else {
        n1_p1Length = (n1_p1_dExtended - n1_p1_d) * n1_p1Percentage + n1_p1_d;
        n1_p1Sqrt = Math.sqrt(Math.pow(n1_p1Length, 2) / (1 + Math.pow(n1_p1_k, 2)));
    
        n1_p1_x2New = n1_p1_x3Extended - n1_p1Sqrt;
        n1_p1_y2New = calculateCoordinate(n1_p1_x2, n1_p1_y2, n1_p1_x3, n1_p1_y3, 'x', n1_p1_x2New);
      }
    } else {
      n1_p1Percentage = 2 - (currentTime - startTime - n1AnimationStart) / (n1AnimationDuration * 0.5);

      if (n1_p1Percentage <= 0.0) {
        n1_p1_x3New = n1_p1_x3;
        n1_p1_y3New = n1_p1_y3;
      } else {
        n1_p1Length = (n1_p1_dExtended - n1_p1_d) * n1_p1Percentage + n1_p1_d;
        n1_p1Sqrt = Math.sqrt(Math.pow(n1_p1Length, 2) / (1 + Math.pow(n1_p1_k, 2)));

        n1_p1_x3New = n1_p1_x2 + n1_p1Sqrt;
        n1_p1_y3New = calculateCoordinate(n1_p1_x2, n1_p1_y2, n1_p1_x3, n1_p1_y3, 'x', n1_p1_x3New);
      }
    }
    
    n1_p2Percentage = (currentTime - startTime - n1AnimationStart) / (n1AnimationDuration * 0.8);

    if (n1_p2Percentage >= 1.0) {
      n1_p2Percentage = 0;
      n1_p2_y1Start = n1_p2_y1End;
      n1_p2_y2Start = n1_p2_y2End;
      n1_p2_y3Start = n1_p2_y3End;
      n1_p2_y4Start = n1_p2_y4End;
    }
    
    n1_p3Percentage = (currentTime - startTime - n1AnimationStart) / (n1AnimationDuration * 0.5);
    
    if (n1_p3Percentage >= 1.0) {
      n1_p3_yAdd = (n1_p3_y1End - n1_p3_y1Start) * (n1_p3Percentage - 1);
    } else {
      n1_p3_yAdd = 0;
    }
  }

  // Part one drawing
  context.beginPath();
  context.moveTo(n1_p1_x2New - unitLength * 11, n1_p1_y2New);
  context.lineTo(n1_p1_x2New, n1_p1_y2New);
  context.lineTo(n1_p1_x3New, n1_p1_y3New);
  context.lineTo(n1_p1_x3New, n1_p1_y3New + unitLength * 2);
  context.lineTo(n1_p1_x3New - unitLength * 11, n1_p1_y3New + unitLength * 2);
  context.lineTo(n1_p1_x2New - unitLength * 11, n1_p1_y2New + unitLength * 2);
  context.fillStyle = "white";
  context.fill();

  // Part two drawing
  context.beginPath();
  context.moveTo(xStart, n1_p2_y1Start - (n1_p2_y1Start - n1_p2_y1End) * n1_p2Percentage);
  context.lineTo(xStart + unitLength * 8, n1_p2_y2Start - (n1_p2_y2Start - n1_p2_y2End) * n1_p2Percentage);
  context.lineTo(xStart + unitLength * 8, n1_p2_y3Start - (n1_p2_y3Start - n1_p2_y3End) * n1_p2Percentage);
  context.lineTo(xStart, n1_p2_y4Start - (n1_p2_y4Start - n1_p2_y4End) * n1_p2Percentage);
  context.fill();

  // Part three drawing
  context.beginPath();
  context.moveTo(xStart + unitLength * 15, n1_p3_y1Start + n1_p3_yAdd);
  context.lineTo(xStart + unitLength * 23, n1_p3_y2Start + n1_p3_yAdd);
  context.lineTo(xStart + unitLength * 23, n1_p3_y3Start + (n1_p3_y3End - n1_p3_y3Start) * n1_p3Percentage * 0.5);
  context.lineTo(xStart + unitLength * 15, n1_p3_y4Start + (n1_p3_y4End - n1_p3_y4Start) * n1_p3Percentage * 0.5);
  context.fill();

  if (n1_p1Percentage <= 0.0 && !n1_p1Growing) {
    // letterFunctionsArray.splice(0, 1);
    n1AnimationOver = true;
  }
}

// Letter 'O' (first - o1)
//    __   __
//   /  | |  \ 
//  /   | |   \
// |    | |    |
// |  1 | | 2  |
// |    | |    |
//  \   | |   /
//   \__| |__/

/*
 * Overall variables
 */

// That specific animation duration time from the overall animation time
let o1AnimationStart = animationDuration * 0.267;
let o1AnimationDuration = animationDuration * 0.333;

// Boolean for detecting if the whole animation is over
let o1AnimationOver = false;

// percentage shows how much of the animation is completed
let o1_pPercentage;

/*
 * Part 1 related variables (o1_p1)
 */

let o1_p1_x1 = xStart + unitLength * 35;
let o1_p1_y1 = yStart;

let o1_p1_cp1x = xStart + unitLength * 21.8;
let o1_p1_cp1y = yStart;
let o1_p1_cp2x = xStart + unitLength * 21.8;
let o1_p1_cp2y = yStart + unitLength * 27;
let o1_p1_x2 = xStart + unitLength * 35;
let o1_p1_y2 = yStart + unitLength * 27;

// Variable moving the clipping region
let o1_p1_xAdd;

/*
 * Part 2 related variables (o1_p2)
 */

let o1_p2_x1 = xStart + unitLength * 37;
let o1_p2_y1 = yStart;

let o1_p2_cp1x = xStart + unitLength * 50.2;
let o1_p2_cp1y = yStart;
let o1_p2_cp2x = xStart + unitLength * 50.2;
let o1_p2_cp2y = yStart + unitLength * 27;
let o1_p2_x2 = xStart + unitLength * 37;
let o1_p2_y2 = yStart + unitLength * 27;

// Variable moving the clipping region
let o1_p2_xAdd;

function drawAnimatedLetterOFirst() {
  o1_pPercentage = (currentTime - startTime - o1AnimationStart) / o1AnimationDuration;

  if (!o1AnimationOver) {
    if (o1_pPercentage < 0) {
      return;
    } else if (o1_pPercentage >= 1.0) {
      o1_p2_xAdd = 0;
      o1AnimationOver = true;
    } else if (o1_pPercentage >= 0.83) {
      o1_p1_xAdd = 0;
      o1_p2_xAdd = unitLength * 10 * (1 - (o1_pPercentage - 0.17) * 1.205);
    } else if (o1_pPercentage >= 0.17) {
      o1_p1_xAdd = unitLength * 10 * (1 - o1_pPercentage * 1.205);
      o1_p2_xAdd = unitLength * 10 * (1 - (o1_pPercentage - 0.17) * 1.205);
    } else {
      o1_p1_xAdd = unitLength * 10 * (1 - o1_pPercentage * 1.205);
    }
  }

  context.save();
  context.beginPath();
  context.moveTo(o1_p1_x1, o1_p1_y1);
  context.bezierCurveTo(o1_p1_cp1x, o1_p1_cp1y, o1_p1_cp2x, o1_p1_cp2y, o1_p1_x2, o1_p1_y2);
  context.clip();

  context.beginPath();
  context.moveTo(o1_p1_x1 + o1_p1_xAdd, o1_p1_y1);
  context.bezierCurveTo(o1_p1_cp1x + o1_p1_xAdd, o1_p1_cp1y, o1_p1_cp2x + o1_p1_xAdd, o1_p1_cp2y, o1_p1_x2 + o1_p1_xAdd, o1_p1_y2);
  context.fill();
  context.restore();
  
  context.save();
  context.beginPath();
  context.moveTo(o1_p2_x1, o1_p2_y1);
  context.bezierCurveTo(o1_p2_cp1x, o1_p2_cp1y, o1_p2_cp2x, o1_p2_cp2y, o1_p2_x2, o1_p2_y2);
  context.clip();

  context.beginPath();
  context.moveTo(o1_p2_x1 - o1_p2_xAdd, o1_p2_y1);
  context.bezierCurveTo(o1_p2_cp1x - o1_p2_xAdd, o1_p2_cp1y, o1_p2_cp2x - o1_p2_xAdd, o1_p2_cp2y, o1_p2_x2 - o1_p2_xAdd, o1_p2_y2);
  context.fill();
  context.restore();
}

// Letter 'T' (first - t1)
//  ___ ______ ___
// |  /|      |\  |
// |2/ |  1   | \3|
// |/  |      |  \|
//     |      |
//     |      |
//     |      |
//     |      |
//     |______|

/*
 * Overall variables
 */

// That specific animation duration time from the overall animation time
let t1AnimationStart = animationDuration * 0.467;
let t1AnimationDuration = animationDuration * 0.267;

// Boolean for detecting if the whole animation is over
let t1AnimationOver = false;

// percentage shows how much of the animation is completed
let t1_pPercentage;

/*
 * Part 1 related variables (t1_p1)
 */

// Animation ending coordinates
let t1_p1_x1 = xStart + unitLength * 7;
let t1_p1_y1 = yStart + unitLength * 29;
let t1_p1_x2 = xStart + unitLength * 16;
let t1_p1_y2 = yStart + unitLength * 29;
let t1_p1_x3 = xStart + unitLength * 16;
let t1_p1_y3 = yStart + unitLength * 56;
let t1_p1_x4 = xStart + unitLength * 7;
let t1_p1_y4 = yStart + unitLength * 56;

// x-coordinates are static through the animation, only y-coordinates are necessary
// y-coordinates in the animation start
let t1_p1_y1Start = t1_p1_y1;
let t1_p1_y2Start = t1_p1_y2;
let t1_p1_y3Start = t1_p1_y2;
let t1_p1_y4Start = t1_p1_y2;

// y-coordinates in the animation end
let t1_p1_y1End = t1_p1_y1;
let t1_p1_y2End = t1_p1_y2;
let t1_p1_y3End = t1_p1_y3;
let t1_p1_y4End = t1_p1_y4;

/*
 * Part 2 related variables (t1_p2)
 */

// Animation ending coordinates
let t1_p2_x1 = xStart;
let t1_p2_y1 = yStart + unitLength * 29;
let t1_p2_x2 = t1_p2_x1 + unitLength * 6.5;
let t1_p2_y2 = yStart + unitLength * 29;
let t1_p2_x3 = t1_p2_x1;
let t1_p2_y3 = yStart + unitLength * 42;

// Height and basis ratio
let t1_p2Basis = t1_p2_x2 - t1_p2_x1;
let t1_p2hbRatio = (t1_p2_y3 - t1_p2_y1) / t1_p2Basis;

// Dynamic coordinates
let t1_p2_x2New = t1_p2_x1;
let t1_p2_y3New = t1_p2_y1;

/*
 * Part 3 related variables (t1_p3)
 */

let t1_p3_x1 = xStart + unitLength * 16.5;
let t1_p3_y1 = yStart + unitLength * 29;
let t1_p3_x2 = t1_p3_x1 + unitLength * 6.5;
let t1_p3_y2 = t1_p3_y1;
let t1_p3_x3 = t1_p3_x2;
let t1_p3_y3 = t1_p3_y2 + unitLength * 13;

// Height and basis ratio
let t1_p3Basis = t1_p3_x2 - t1_p3_x1;
let t1_p3hbRatio = (t1_p3_y3 - t1_p3_y1) / t1_p3Basis;

// // Dynamic coordinates
let t1_p3_x1New = t1_p3_x2;
let t1_p3_y3New = t1_p3_y1;

function drawAnimatedLetterTFirst() {
  t1Percentage = (currentTime - startTime - t1AnimationStart) / t1AnimationDuration;

  if (!t1AnimationOver) {
    if (t1Percentage < 0) {
      return;
    } else if (t1Percentage >= 1.0) {
      t1_p3_x1New = t1_p3_x1;
      t1_p3_y3New = t1_p3_y3;
      
      t1AnimationOver = true;
    } else if (t1Percentage >= 0.8) {
      t1_p1_y3Start = t1_p1_y3End;
      t1_p1_y4Start = t1_p1_y4End;

      t1_p3_x1New = t1_p3_x2 - t1_p3Basis * (t1Percentage - 0.45) * 1.82;
      t1_p3_y3New = t1_p3_y2 + t1_p3hbRatio * t1_p3Basis * (t1Percentage - 0.45) * 1.82;
    } else if (t1Percentage >= 0.65) {
      t1_p2_x2New = t1_p2_x2;
      t1_p2_y3New = t1_p2_y3;

      t1_p3_x1New = t1_p3_x2 - t1_p3Basis * (t1Percentage - 0.45) * 1.82;
      t1_p3_y3New = t1_p3_y2 + t1_p3hbRatio * t1_p3Basis * (t1Percentage - 0.45) * 1.82;
    } else if (t1Percentage >= 0.45) { 
      t1_p2_x2New = t1_p2_x1 + t1_p2Basis * (t1Percentage - 0.1) * 1.82;
      t1_p2_y3New = t1_p2_y1 + t1_p2hbRatio * t1_p2Basis * (t1Percentage - 0.1) * 1.82;

      t1_p3_x1New = t1_p3_x2 - t1_p3Basis * (t1Percentage - 0.45) * 1.82;
      t1_p3_y3New = t1_p3_y2 + t1_p3hbRatio * t1_p3Basis * (t1Percentage - 0.45) * 1.82;
    } else if (t1Percentage >= 0.1) {
      t1_p2_x2New = t1_p2_x1 + t1_p2Basis * (t1Percentage - 0.1) * 1.82;
      t1_p2_y3New = t1_p2_y1 + t1_p2hbRatio * t1_p2Basis * (t1Percentage - 0.1) * 1.82;
    }
  }

  context.beginPath();
  context.moveTo(t1_p1_x1, t1_p1_y1);
  context.lineTo(t1_p1_x2, t1_p1_y2);
  context.lineTo(t1_p1_x3, t1_p1_y3Start + (t1_p1_y3End - t1_p1_y3Start) * t1Percentage * 1.25);
  context.lineTo(t1_p1_x4, t1_p1_y4Start + (t1_p1_y4End - t1_p1_y4Start) * t1Percentage * 1.25);
  context.fill();

  context.beginPath();
  context.moveTo(t1_p2_x1, t1_p2_y1);
  context.lineTo(t1_p2_x2New, t1_p2_y2);
  context.lineTo(t1_p2_x3, t1_p2_y3New);
  context.fill();
  
  context.beginPath();
  context.moveTo(t1_p3_x1New, t1_p3_y1);
  context.lineTo(t1_p3_x2, t1_p3_y2);
  context.lineTo(t1_p3_x3, t1_p3_y3New);
  context.fill();
}

// Letter 'I' (first - i1)
//  ____ 
// |    |
// |    |
// |    |
// | 1  |
// |    |
// |    |
// |    |
// |____|

/*
 * Overall variables
 */

// That specific animation duration time from the overall animation time
let i1AnimationStart = animationDuration * 0.5;
let i1AnimationDuration = animationDuration * 0.233;

// Boolean for detecting if the whole animation is over
let i1AnimationOver = false;

// percentage shows how much of the animation is completed
let i1Percentage;

/*
 * Part 1 related variables (e1_p1)
 */

// Animation ending coordinates
let i1_p1_x1 = xStart + unitLength * 25;
let i1_p1_y1 = yStart + unitLength * 29;
let i1_p1_x2 = i1_p1_x1 + unitLength * 10;
let i1_p1_y2 = i1_p1_y1;
let i1_p1_x3 = i1_p1_x1 + unitLength * 10;
let i1_p1_y3 = i1_p1_y1 + unitLength * 27;
let i1_p1_x4 = i1_p1_x1;
let i1_p1_y4 = i1_p1_y3;

// x-coordinates are static through the animation, only y-coordinates are necessary
// y-coordinates in the animation start
let i1_p1_y1Start = i1_p1_y1;
let i1_p1_y2Start = i1_p1_y2;
let i1_p1_y3Start = i1_p1_y2;
let i1_p1_y4Start = i1_p1_y2;

// y-coordinates in the animation end
let i1_p1_y1End = i1_p1_y1;
let i1_p1_y2End = i1_p1_y2;
let i1_p1_y3End = i1_p1_y3;
let i1_p1_y4End = i1_p1_y4;

// Variable for the delayed animation
let i1_p1_yAdd = 0;

function drawAnimatedLetterIFirst() {
  i1Percentage = (currentTime - startTime - i1AnimationStart) / i1AnimationDuration;

  if (!i1AnimationOver) {
    if (i1Percentage < 0) {
      return;
    } if (i1Percentage >= 1.0) {
      i1_p1_y3Start = i1_p1_y3End;
      i1_p1_y4Start = i1_p1_y4End;
      i1AnimationOver = true;
    }
  }

  context.beginPath();
  context.moveTo(i1_p1_x1, i1_p1_y1);
  context.lineTo(i1_p1_x2, i1_p1_y2);
  context.lineTo(i1_p1_x3, i1_p1_y3Start + (i1_p1_y3End - i1_p1_y3Start) * i1Percentage);
  context.lineTo(i1_p1_x4, i1_p1_y4Start + (i1_p1_y4End - i1_p1_y4Start) * i1Percentage);
  context.fill();
}

// Letter 'M' (first - m1)
//         ___   _______
//        /   \  \      \
//       /     \  \      \ 
//       \      \  \      \
//     /\ \      \  \      \
//    /  \ \      \  \      \
//   / 1  \ \  2   \  \  3   \
//  /     /  \      \  \      \
// /_____/    \______\  \______\

/*
 * Overall variables
 */

// That specific animation duration time from the overall animation time
let m1AnimationStart = animationDuration * 0.567;
let m1AnimationDuration = animationDuration * 0.283;

// Boolean for detecting if the whole animation is over
let m1AnimationOver = false;

// Percentage shows how much of the animation is completed
let m1Percentage;

/*
 * Part 1 related variables (m1_p1)
 */
 
// Animation ending coordinates
let m1_p1_x1 = xStart + unitLength * 36;
let m1_p1_y1 = yStart + unitLength * 56;
let m1_p1_x2 = xStart + unitLength * 40.611;
let m1_p1_y2 = yStart + unitLength * 38.214;
let m1_p1_x3 = xStart + unitLength * 44.704;
let m1_p1_y3 = yStart + unitLength * 54;
let m1_p1_x4 = xStart + unitLength * 44.185;
let m1_p1_y4 = yStart + unitLength * 56;

// Variables needed for the animation
// Vector length between point 1 and point 2
let m1_p1_p1p2Length = vectorLength(m1_p1_x1, m1_p1_y1, m1_p1_x2, m1_p1_y2);

// Height length for point 1 and point 2
let m1_p1Height = m1_p1_y1 - m1_p1_y2;

// I'm creating triangle from trapezoid to use triangle laws
let m1_p1FullBasis = 2 * Math.sqrt(Math.pow(m1_p1_p1p2Length, 2) - Math.pow(m1_p1Height, 2));

// Full basis and height ratio
let m1_p1bhRatio = m1_p1Height / m1_p1FullBasis; 

// Actual basis of the trapezoid
let m1_p1ActualBasis = vectorLength(m1_p1_x1, m1_p1_y1, m1_p1_x4, m1_p1_y4); 

// Dynamic coordinates
let m1_p1_x1New;
let m1_p1_y1New;
let m1_p1_x2New;
let m1_p1_y2New;
let m1_p1_x3New;
let m1_p1_y3New;
let m1_p1_x4New;
let m1_p1_y4New;

/*
 * Part 2 related variables (m1_p2)
 */

// Animation ending coordinates
let m1_p2_x1 = xStart + unitLength * 41.704;
let m1_p2_y1 = yStart + unitLength * 34;
let m1_p2_x2 = xStart + unitLength * 43;
let m1_p2_y2 = yStart + unitLength * 29;
let m1_p2_x3 = xStart + unitLength * 49;
let m1_p2_y3 = yStart + unitLength * 29;
let m1_p2_x4 = xStart + unitLength * 55.985;
let m1_p2_y4 = yStart + unitLength * 56;
let m1_p2_x5 = xStart + unitLength * 47.404;
let m1_p2_y5 = yStart + unitLength * 56;

// Dynamic coordinates
let m1_p2_x1New;
let m1_p2_y1New;
let m1_p2_x2New;
let m1_p2_y2New;
let m1_p2_x3New;
let m1_p2_y3New;
let m1_p2_x4New;
let m1_p2_y4New;
let m1_p2_x5New;
let m1_p2_y5New;

/*
 * Part 3 related variables (m1_p3)
 */

// Animation ending coordinates
let m1_p3_x1 = xStart + unitLength * 52.504;
let m1_p3_y1 = yStart + unitLength * 34;
let m1_p3_x2 = xStart + unitLength * 53.8;
let m1_p3_y2 = yStart + unitLength * 29;
let m1_p3_x3 = xStart + unitLength * 59.8;
let m1_p3_y3 = yStart + unitLength * 29;
let m1_p3_x4 = xStart + unitLength * 66.8;
let m1_p3_y4 = yStart + unitLength * 56;
let m1_p3_x5 = xStart + unitLength * 58.208;
let m1_p3_y5 = yStart + unitLength * 56;

// Dynamic coordinates
let m1_p3_x1New;
let m1_p3_y1New;
let m1_p3_x2New;
let m1_p3_y2New;
let m1_p3_x3New;
let m1_p3_y3New;
let m1_p3_x4New;
let m1_p3_y4New;
let m1_p3_x5New;
let m1_p3_y5New;

function drawAnimatedLetterMFirst() {
  m1Percentage = (currentTime - startTime - m1AnimationStart) / m1AnimationDuration;

  if (!m1AnimationOver) {
    if (m1Percentage < 0) {
      return;
    } else if (m1Percentage >= 1.0) {
      m1_p2_x1New = m1_p2_x1;
      m1_p2_y1New = m1_p2_y1;
      m1_p2_x2New = m1_p2_x2;
      m1_p2_y2New = m1_p2_y2;
      m1_p2_x3New = m1_p2_x3;
      m1_p2_y3New = m1_p2_y3;

      m1_p3_x4New = m1_p3_x4;
      m1_p3_y4New = m1_p3_y4;
      m1_p3_x5New = m1_p3_x5;
      m1_p3_y5New = m1_p3_y5;

      m1AnimationOver = true;
    } else if (m1Percentage >= 0.9) {
      m1_p2_y1New = m1_p2_y1;
      m1_p2_x2New = m1_p2_x2;
      m1_p2_y2New = m1_p2_y2;
      m1_p2_x3New = m1_p2_x3;
      m1_p2_y3New = m1_p2_y3;
    
      m1_p3_y4New = m1_p3_y2 + (m1_p3_y4 - m1_p3_y3) * (m1Percentage - 0.2) * 1.25;
      m1_p3_x4New = calculateCoordinate(m1_p3_x3, m1_p3_y3, m1_p3_x4, m1_p3_y4, 'y', m1_p3_y4New);
      m1_p3_y5New = m1_p3_y4New;

      if (m1_p3_y5New < m1_p3_y1) {
        m1_p3_x5New = calculateCoordinate(m1_p3_x1, m1_p3_y1, m1_p3_x2, m1_p3_y2, 'y', m1_p3_y5New);
        m1_p3_x1New = m1_p3_x5New;
        m1_p3_y1New = m1_p3_y5New;
      } else {
        m1_p3_x5New = m1_p3_x4New - (m1_p3_x4 - m1_p3_x5);
        m1_p3_x1New = m1_p3_x1;
        m1_p3_y1New = m1_p3_y1;
      }
    } else if (m1Percentage >= 0.824) {
      m1_p1_x2New = m1_p1_x2;
      m1_p1_y2New = m1_p1_y2;
      m1_p1_x3New = m1_p1_x3;
      m1_p1_x4New = m1_p1_x4;

      m1_p2_y3New = m1_p2_y4 - (m1_p2_y4 - m1_p2_y3) * (m1Percentage - 0.1) * 1.25;
      m1_p2_x3New = calculateCoordinate(m1_p2_x3, m1_p2_y3, m1_p2_x4, m1_p2_y4, 'y', m1_p2_y3New);
      m1_p2_y2New = m1_p2_y4 - (m1_p2_y4 - m1_p2_y3) * (m1Percentage - 0.1) * 1.25;
      m1_p2_x2New = m1_p2_x3New - (m1_p2_x3 - m1_p2_x2);
      m1_p2_y1New = m1_p2_y2New + (m1_p2_y1 - m1_p2_y2);

      if (m1_p2_y1New > m1_p2_y5) {
        m1_p2_x1New = calculateCoordinate(m1_p2_x1, m1_p2_y1, m1_p2_x5, m1_p2_y5, 'y', m1_p2_y1New);
        m1_p2_x5New = calculateCoordinate(m1_p2_x1New, m1_p2_y1New, m1_p2_x2New, m1_p2_y2New, 'y', m1_p2_y5);
        m1_p2_x1New = m1_p2_x5New;
        m1_p2_y1New = m1_p2_y5;
      } else {
        m1_p2_x1New = calculateCoordinate(m1_p2_x1, m1_p2_y1, m1_p2_x5, m1_p2_y5, 'y', m1_p2_y1New);
        m1_p2_x5New = m1_p2_x5;
      }

      m1_p3_y4New = m1_p3_y2 + (m1_p3_y4 - m1_p3_y3) * (m1Percentage - 0.2) * 1.25;
      m1_p3_x4New = calculateCoordinate(m1_p3_x3, m1_p3_y3, m1_p3_x4, m1_p3_y4, 'y', m1_p3_y4New);
      m1_p3_y5New = m1_p3_y4New;

      if (m1_p3_y5New < m1_p3_y1) {
        m1_p3_x5New = calculateCoordinate(m1_p3_x1, m1_p3_y1, m1_p3_x2, m1_p3_y2, 'y', m1_p3_y5New);
        m1_p3_x1New = m1_p3_x5New;
        m1_p3_y1New = m1_p3_y5New;
      } else {
        m1_p3_x5New = m1_p3_x4New - (m1_p3_x4 - m1_p3_x5);
        m1_p3_x1New = m1_p3_x1;
        m1_p3_y1New = m1_p3_y1;
      }
    } else if (m1Percentage >= 0.2) {
      m1_p1_y2New = m1_p1_y1 - m1_p1bhRatio * (m1_p1FullBasis - m1_p1ActualBasis + m1_p1ActualBasis * m1Percentage * 1.214);
      m1_p1_x2New = calculateCoordinate(m1_p1_x1, m1_p1_y1, m1_p1_x2, m1_p1_y2, 'y', m1_p1_y2New);
      m1_p1_x4New = m1_p1_x1 + m1_p1ActualBasis * m1Percentage * 1.214;
      m1_p1_x3New = m1_p1_x4New + (m1_p1_x3 - m1_p1_x4);

      m1_p2_y3New = m1_p2_y4 - (m1_p2_y4 - m1_p2_y3) * (m1Percentage - 0.1) * 1.25;
      m1_p2_x3New = calculateCoordinate(m1_p2_x3, m1_p2_y3, m1_p2_x4, m1_p2_y4, 'y', m1_p2_y3New);
      m1_p2_y2New = m1_p2_y4 - (m1_p2_y4 - m1_p2_y3) * (m1Percentage - 0.1) * 1.25;
      m1_p2_x2New = m1_p2_x3New - (m1_p2_x3 - m1_p2_x2);
      m1_p2_y1New = m1_p2_y2New + (m1_p2_y1 - m1_p2_y2);

      if (m1_p2_y1New > m1_p2_y5) {
        m1_p2_x1New = calculateCoordinate(m1_p2_x1, m1_p2_y1, m1_p2_x5, m1_p2_y5, 'y', m1_p2_y1New);
        m1_p2_x5New = calculateCoordinate(m1_p2_x1New, m1_p2_y1New, m1_p2_x2New, m1_p2_y2New, 'y', m1_p2_y5);
        m1_p2_x1New = m1_p2_x5New;
        m1_p2_y1New = m1_p2_y5;
      } else {
        m1_p2_x1New = calculateCoordinate(m1_p2_x1, m1_p2_y1, m1_p2_x5, m1_p2_y5, 'y', m1_p2_y1New);
        m1_p2_x5New = m1_p2_x5;
      }

      m1_p3_y4New = m1_p3_y2 + (m1_p3_y4 - m1_p3_y3) * (m1Percentage - 0.2) * 1.25;
      m1_p3_x4New = calculateCoordinate(m1_p3_x3, m1_p3_y3, m1_p3_x4, m1_p3_y4, 'y', m1_p3_y4New);
      m1_p3_y5New = m1_p3_y4New;

      if (m1_p3_y5New < m1_p3_y1) {
        m1_p3_x5New = calculateCoordinate(m1_p3_x1, m1_p3_y1, m1_p3_x2, m1_p3_y2, 'y', m1_p3_y5New);
        m1_p3_x1New = m1_p3_x5New;
        m1_p3_y1New = m1_p3_y5New;
      } else {
        m1_p3_x5New = m1_p3_x4New - (m1_p3_x4 - m1_p3_x5);
        m1_p3_x1New = m1_p3_x1;
        m1_p3_y1New = m1_p3_y1;
      }
    } else if (m1Percentage >= 0.1) {
      m1_p1_y2New = m1_p1_y1 - m1_p1bhRatio * (m1_p1FullBasis - m1_p1ActualBasis + m1_p1ActualBasis * m1Percentage * 1.214);
      m1_p1_x2New = calculateCoordinate(m1_p1_x1, m1_p1_y1, m1_p1_x2, m1_p1_y2, 'y', m1_p1_y2New);
      m1_p1_x4New = m1_p1_x1 + m1_p1ActualBasis * m1Percentage * 1.214;
      m1_p1_x3New = m1_p1_x4New + (m1_p1_x3 - m1_p1_x4);

      m1_p2_y3New = m1_p2_y4 - (m1_p2_y4 - m1_p2_y3) * (m1Percentage - 0.1) * 1.25;
      m1_p2_x3New = calculateCoordinate(m1_p2_x3, m1_p2_y3, m1_p2_x4, m1_p2_y4, 'y', m1_p2_y3New);
      m1_p2_y2New = m1_p2_y4 - (m1_p2_y4 - m1_p2_y3) * (m1Percentage - 0.1) * 1.25;
      m1_p2_x2New = m1_p2_x3New - (m1_p2_x3 - m1_p2_x2);
      m1_p2_y1New = m1_p2_y2New + (m1_p2_y1 - m1_p2_y2);

      if (m1_p2_y1New > m1_p2_y5) {
        m1_p2_x1New = calculateCoordinate(m1_p2_x1, m1_p2_y1, m1_p2_x5, m1_p2_y5, 'y', m1_p2_y1New);
        m1_p2_x5New = calculateCoordinate(m1_p2_x1New, m1_p2_y1New, m1_p2_x2New, m1_p2_y2New, 'y', m1_p2_y5);
        m1_p2_x1New = m1_p2_x5New;
        m1_p2_y1New = m1_p2_y5;
      } else {
        m1_p2_x1New = calculateCoordinate(m1_p2_x1, m1_p2_y1, m1_p2_x5, m1_p2_y5, 'y', m1_p2_y1New);
        m1_p2_x5New = m1_p2_x5;
      }
    } else {
      m1_p1_y2New = m1_p1_y1 - m1_p1bhRatio * (m1_p1FullBasis - m1_p1ActualBasis + m1_p1ActualBasis * m1Percentage * 1.214);
      m1_p1_x2New = calculateCoordinate(m1_p1_x1, m1_p1_y1, m1_p1_x2, m1_p1_y2, 'y', m1_p1_y2New);
      m1_p1_x4New = m1_p1_x1 + m1_p1ActualBasis * m1Percentage * 1.214;
      m1_p1_x3New = m1_p1_x4New + (m1_p1_x3 - m1_p1_x4);
    }
  }

  context.beginPath();
  context.moveTo(m1_p1_x1, m1_p1_y1);
  context.lineTo(m1_p1_x2New, m1_p1_y2New);
  context.lineTo(m1_p1_x3New, m1_p1_y3);
  context.lineTo(m1_p1_x4New, m1_p1_y4);
  context.fill();

  context.beginPath();
  context.moveTo(m1_p2_x1New, m1_p2_y1New);
  context.lineTo(m1_p2_x2New, m1_p2_y2New);
  context.lineTo(m1_p2_x3New, m1_p2_y3New);
  context.lineTo(m1_p2_x4, m1_p2_y4);
  context.lineTo(m1_p2_x5New, m1_p2_y5);
  context.fill();

  context.beginPath();
  context.moveTo(m1_p3_x1New, m1_p3_y1New);
  context.lineTo(m1_p3_x2, m1_p3_y2);
  context.lineTo(m1_p3_x3, m1_p3_y3);
  context.lineTo(m1_p3_x4New, m1_p3_y4New);
  context.lineTo(m1_p3_x5New, m1_p3_y5New);
  context.fill();
}

// Letter 'E' (first - e1)
//  ____  _____
// |    | \    |
// |    |   \ 3|
// |    |  /| \|
// | 1  |/ 2|
// |    |\  |
// |    |  \| /|
// |    |   / 4|
// |____| /____|

/*
 * Overall variables
 */

// That specific animation duration time from the overall animation time
let e1AnimationStart = animationDuration * 0.433;
let e1AnimationDuration = animationDuration * 0.467;

// Boolean for detecting if the whole animation is over
let e1AnimationOver = false;

// percentage shows how much of the animation is completed
let e1Percentage;

/*
 * Part 1 related variables (e1_p1)
 */

// Animation ending coordinates
let e1_p1_x1 = xStart + unitLength * 67.8;
let e1_p1_y1 = yStart + unitLength * 29;
let e1_p1_x2 = e1_p1_x1 + unitLength * 9;
let e1_p1_y2 = e1_p1_y1;
let e1_p1_x3 = e1_p1_x1 + unitLength * 9;
let e1_p1_y3 = e1_p1_y1 + unitLength * 27;
let e1_p1_x4 = e1_p1_x1;
let e1_p1_y4 = e1_p1_y3;

// x-coordinates are static through the animation, only y-coordinates are necessary
// y-coordinates in the animation start
let e1_p1_y1Start = yStart + unitLength * 132;
let e1_p1_y2Start = yStart + unitLength * 132;
let e1_p1_y3Start = yStart + unitLength * 132;
let e1_p1_y4Start = yStart + unitLength * 132;

// y-coordinates in the animation end
let e1_p1_y1End = e1_p1_y1;
let e1_p1_y2End = e1_p1_y2;
let e1_p1_y3End = e1_p1_y3;
let e1_p1_y4End = e1_p1_y4;

// Variable for the delayed animation
let e1_p1_yAdd = 0;

/*
 * Part 2 related variables (e1_p2)
 */

let e1_p2_x1 = xStart + unitLength * 77.3;
let e1_p2_y1 = yStart + unitLength * 42.5;
let e1_p2_x2 = xStart + unitLength * 83.3;
let e1_p2_y2 = yStart + unitLength * 37;
let e1_p2_x3 = xStart + unitLength * 83.3;
let e1_p2_y3 = yStart + unitLength * 48;

// Animated coordinates
let e1_p2_x1New;
let e1_p2_y1New;
let e1_p2_x2New;
let e1_p2_y2New;
let e1_p2_x3New;
let e1_p2_y3New;

// Triangle height
let e1_p2Height = e1_p2_x2 - e1_p2_x1;

// Triangle height and basis ratio
let e1_p2_hbRatio = (e1_p2_y3 - e1_p2_y2) / e1_p2Height;

// Transformation length
let e1_p2TranslateX = unitLength * 32;
let e1_p2_xAdd = e1_p2TranslateX;

/*
 * Part 3 related variables (e1_p3)
 */

// Animation ending coordinates
let e1_p3_x1 = xStart + unitLength * 77.3;
let e1_p3_y1 = yStart + unitLength * 29;
let e1_p3_x2 = xStart + unitLength * 86.3;
let e1_p3_y2 = yStart + unitLength * 29;
let e1_p3_x3 = xStart + unitLength * 86.3;
let e1_p3_y3 = yStart + unitLength * 40;

// Animated coordinates
let e1_p3_x1New;
let e1_p3_y1New;
let e1_p3_x2New;
let e1_p3_y2New;
let e1_p3_x3New;
let e1_p3_y3New;

// Side length
let e1_p3SideLength1 = e1_p3_x2 - e1_p3_x1;
let e1_p3SideLength1New;

// Rotation center coordinates
let e1_p3_rc_x = e1_p3_x1 + (e1_p3_x2 - e1_p3_x1) / 2;
let e1_p3_rc_y = e1_p3_y1 + (e1_p3_y2 - e1_p3_y1) / 2;

let e1_p3_vec1Length = vectorLength(e1_p3_x1, e1_p3_y1, e1_p3_rc_x, e1_p3_rc_y);
let e1_p3_vec2 = [e1_p3_rc_x - e1_p3_x3, e1_p3_rc_y - e1_p3_y3];
let e1_p3_vec2Length = vectorLength(e1_p3_x3, e1_p3_y3, e1_p3_rc_x, e1_p3_rc_y);
let e1_p3_vec1vec2Ratio = e1_p3_vec2Length / e1_p3_vec1Length;
let e1_p3_vec3 = [e1_p3_x2 - e1_p3_x3, e1_p3_y2 - e1_p3_y3];
let e1_p3_vec3Length = vectorLength(e1_p3_x3, e1_p3_y3, e1_p3_x2, e1_p3_y2);
let e1_p3_p3ExtraAngleCos = (e1_p3_vec2[0] * e1_p3_vec3[0] + e1_p3_vec2[1] * e1_p3_vec3[1]) / (e1_p3_vec2Length * e1_p3_vec3Length);
let e1_p3_p3ExtraAngle = Math.acos(e1_p3_p3ExtraAngleCos) * 180 / Math.PI;

// Rotation angle
let e1_p3FullRotationAngle = 80;
let e1_p3_p3RotationAngle;

/*
 * Part 4 related variables (e1_p4)
 */

// Animation ending coordinates
let e1_p4_x1 = xStart + unitLength * 77.3;
let e1_p4_y1 = yStart + unitLength * 56;
let e1_p4_x2 = xStart + unitLength * 86.3;
let e1_p4_y2 = yStart + unitLength * 56;
let e1_p4_x3 = xStart + unitLength * 86.3;
let e1_p4_y3 = yStart + unitLength * 45;

// Animated coordinates
let e1_p4_x1New;
let e1_p4_y1New;
let e1_p4_x2New;
let e1_p4_y2New;
let e1_p4_x3New;
let e1_p4_y3New;

// Side length
let e1_p3_p4SideLength1 = e1_p4_x2 - e1_p4_x1;
let e1_p3_p4SideLength1New;

// Rotation center coordinates
let e1_p4_rc_x = e1_p4_x1 + (e1_p4_x2 - e1_p4_x1) / 2;
let e1_p4_rc_y = e1_p4_y1 + (e1_p4_y2 - e1_p4_y1) / 2;

let e1_p4_vec1Length = vectorLength(e1_p4_x1, e1_p4_y1, e1_p4_rc_x, e1_p4_rc_y);
let e1_p4_vec2 = [e1_p4_rc_x - e1_p4_x3, e1_p4_rc_y - e1_p4_y3];
let e1_p4_vec2Length = vectorLength(e1_p4_x3, e1_p4_y3, e1_p4_rc_x, e1_p4_rc_y);
let e1_p4_vec1vec2Ratio = e1_p4_vec2Length / e1_p4_vec1Length;
let e1_p4_vec3 = [e1_p4_x2 - e1_p4_x3, e1_p4_y2 - e1_p4_y3];
let e1_p4_vec3Length = vectorLength(e1_p4_x3, e1_p4_y3, e1_p4_x2, e1_p4_y2);
let e1_p4_p3ExtraAngleCos = (e1_p4_vec2[0] * e1_p4_vec3[0] + e1_p4_vec2[1] * e1_p4_vec3[1]) / (e1_p4_vec2Length * e1_p4_vec3Length);
let e1_p4_p3ExtraAngle = Math.acos(e1_p4_p3ExtraAngleCos) * 180 / Math.PI;

// Rotation angle
let e1_p3_p4RotationAngle;

function drawAnimatedLetterEFirst() {
  e1Percentage = (currentTime - startTime - e1AnimationStart) / e1AnimationDuration;

  if (!e1AnimationOver) {
    if (e1Percentage < 0) {
      return;
    } else if (e1Percentage >= 1.0) {
      e1_p3_x1New = e1_p3_x1;
      e1_p3_y1New = e1_p3_y1;
      e1_p3_x2New = e1_p3_x2;
      e1_p3_y2New = e1_p3_y2;
      e1_p3_x3New = e1_p3_x3;
      e1_p3_y3New = e1_p3_y3;
      
      e1_p4_x1New = e1_p4_x1;
      e1_p4_y1New = e1_p4_y1;
      e1_p4_x2New = e1_p4_x2;
      e1_p4_y2New = e1_p4_y2;
      e1_p4_x3New = e1_p4_x3;
      e1_p4_y3New = e1_p4_y3;

      e1_p2_x1New = e1_p2_x1;
      e1_p2_x2New = e1_p2_x2;
      e1_p2_y2New = e1_p2_y2;
      e1_p2_x3New = e1_p2_x3;
      e1_p2_y3New = e1_p2_y3;

      e1AnimationOver = true;
    } else if (e1Percentage >= 0.86) {
      e1_p1_y1Start = e1_p1_y1End; 
      e1_p1_y2Start = e1_p1_y2End;
      e1_p1_yAdd = e1_p1_y3Start - e1_p1_y3End;

      e1_p3_p3RotationAngle = e1_p3FullRotationAngle * (1 - ((e1Percentage - 0.64) * 2.778));
      e1_p3_p4RotationAngle = e1_p3FullRotationAngle * ((e1Percentage - 0.64) * 2.778);

      e1_p3SideLength1New = e1_p3SideLength1 * ((e1Percentage - 0.64) * 2.778);
      e1_p3_vec1Length = e1_p3SideLength1New / 2;
      e1_p3_vec2Length = e1_p3_vec1Length * e1_p3_vec1vec2Ratio;
      e1_p3_rc_x = e1_p3_x1 + e1_p3_vec1Length;
      e1_p3_x1New = e1_p3_rc_x + e1_p3_vec1Length * Math.cos((180 + e1_p3_p3RotationAngle) * Math.PI / 180);
      e1_p3_y1New = e1_p3_rc_y + e1_p3_vec1Length * (-1) * Math.sin((180 + e1_p3_p3RotationAngle) * Math.PI / 180);
      e1_p3_x2New = e1_p3_rc_x + e1_p3_vec1Length * Math.cos(e1_p3_p3RotationAngle * Math.PI / 180);
      e1_p3_y2New = e1_p3_rc_y + e1_p3_vec1Length * (-1) * Math.sin(e1_p3_p3RotationAngle * Math.PI / 180);
      e1_p3_x3New = e1_p3_rc_x + e1_p3_vec2Length * Math.cos((270 + e1_p3_p3ExtraAngle + e1_p3_p3RotationAngle) * Math.PI / 180);
      e1_p3_y3New = e1_p3_rc_y + e1_p3_vec2Length * (-1) * Math.sin((270 + e1_p3_p3ExtraAngle + e1_p3_p3RotationAngle) * Math.PI / 180);

      e1_p4_rc_x = e1_p4_x1 + e1_p3_vec1Length;
      e1_p4_x1New = e1_p4_rc_x + e1_p3_vec1Length * Math.cos((e1_p3_p4RotationAngle - e1_p3FullRotationAngle) * Math.PI / 180);
      e1_p4_y1New = e1_p4_rc_y + e1_p3_vec1Length * (-1) * Math.sin((e1_p3_p4RotationAngle - e1_p3FullRotationAngle) * Math.PI / 180);
      e1_p4_x2New = e1_p4_rc_x + e1_p3_vec1Length * Math.cos((180 + e1_p3_p4RotationAngle - e1_p3FullRotationAngle) * Math.PI / 180);
      e1_p4_y2New = e1_p4_rc_y + e1_p3_vec1Length * (-1) * Math.sin((180 + e1_p3_p4RotationAngle - e1_p3FullRotationAngle) * Math.PI / 180);
      e1_p4_x3New = e1_p4_rc_x + e1_p3_vec2Length * Math.cos((90 - e1_p3_p3ExtraAngle + e1_p3_p4RotationAngle - e1_p3FullRotationAngle) * Math.PI / 180);
      e1_p4_y3New = e1_p4_rc_y + e1_p3_vec2Length * (-1) * Math.sin((90 - e1_p3_p3ExtraAngle + e1_p3_p4RotationAngle - e1_p3FullRotationAngle) * Math.PI / 180);

      e1_p2_xAdd = e1_p2TranslateX * (1 - ((e1Percentage - 0.64) * 2.778));
      e1_p2_x1New = e1_p2_x1 + e1_p2_xAdd;
      e1_p2_x2New = e1_p2_x1New + e1_p2Height * ((e1Percentage - 0.64) * 2.778);
      e1_p2_y2New = e1_p2_y1 - (e1_p2Height * e1_p2_hbRatio * ((e1Percentage - 0.64) * 2.778) / 2);
      e1_p2_x3New = e1_p2_x2New;
      e1_p2_y3New = e1_p2_y1 + (e1_p2Height * e1_p2_hbRatio * ((e1Percentage - 0.64) * 2.778) / 2);
    } else if (e1Percentage >= 0.64) {
      e1_p1_yAdd = (e1_p1_y3Start - e1_p1_y3End) * ((e1Percentage - 0.59) * 3.763);

      e1_p3_p3RotationAngle = e1_p3FullRotationAngle * (1 - ((e1Percentage - 0.64) * 2.778));
      e1_p3_p4RotationAngle = e1_p3FullRotationAngle * ((e1Percentage - 0.64) * 2.778);

      e1_p3SideLength1New = e1_p3SideLength1 * ((e1Percentage - 0.64) * 2.778);
      e1_p3_vec1Length = e1_p3SideLength1New / 2;
      e1_p3_vec2Length = e1_p3_vec1Length * e1_p3_vec1vec2Ratio;
      e1_p3_rc_x = e1_p3_x1 + e1_p3_vec1Length;
      
      e1_p3_x1New = e1_p3_rc_x + e1_p3_vec1Length * Math.cos((180 + e1_p3_p3RotationAngle) * Math.PI / 180);
      e1_p3_y1New = e1_p3_rc_y + e1_p3_vec1Length * (-1) * Math.sin((180 + e1_p3_p3RotationAngle) * Math.PI / 180);
      e1_p3_x2New = e1_p3_rc_x + e1_p3_vec1Length * Math.cos(e1_p3_p3RotationAngle * Math.PI / 180);
      e1_p3_y2New = e1_p3_rc_y + e1_p3_vec1Length * (-1) * Math.sin(e1_p3_p3RotationAngle * Math.PI / 180);
      e1_p3_x3New = e1_p3_rc_x + e1_p3_vec2Length * Math.cos((270 + e1_p3_p3ExtraAngle + e1_p3_p3RotationAngle) * Math.PI / 180);
      e1_p3_y3New = e1_p3_rc_y + e1_p3_vec2Length * (-1) * Math.sin((270 + e1_p3_p3ExtraAngle + e1_p3_p3RotationAngle) * Math.PI / 180);

      e1_p4_rc_x = e1_p4_x1 + e1_p3_vec1Length;
      e1_p4_x1New = e1_p4_rc_x + e1_p3_vec1Length * Math.cos((e1_p3_p4RotationAngle - e1_p3FullRotationAngle) * Math.PI / 180);
      e1_p4_y1New = e1_p4_rc_y + e1_p3_vec1Length * (-1) * Math.sin((e1_p3_p4RotationAngle - e1_p3FullRotationAngle) * Math.PI / 180);
      e1_p4_x2New = e1_p4_rc_x + e1_p3_vec1Length * Math.cos((180 + e1_p3_p4RotationAngle - e1_p3FullRotationAngle) * Math.PI / 180);
      e1_p4_y2New = e1_p4_rc_y + e1_p3_vec1Length * (-1) * Math.sin((180 + e1_p3_p4RotationAngle - e1_p3FullRotationAngle) * Math.PI / 180);
      e1_p4_x3New = e1_p4_rc_x + e1_p3_vec2Length * Math.cos((90 - e1_p3_p3ExtraAngle + e1_p3_p4RotationAngle - e1_p3FullRotationAngle) * Math.PI / 180);
      e1_p4_y3New = e1_p4_rc_y + e1_p3_vec2Length * (-1) * Math.sin((90 - e1_p3_p3ExtraAngle + e1_p3_p4RotationAngle - e1_p3FullRotationAngle) * Math.PI / 180);
      
      e1_p2_xAdd = e1_p2TranslateX * (1 - ((e1Percentage - 0.64) * 2.778));
      e1_p2_x1New = e1_p2_x1 + e1_p2_xAdd;
      e1_p2_x2New = e1_p2_x1New + e1_p2Height * ((e1Percentage - 0.64) * 2.778);
      e1_p2_y2New = e1_p2_y1 - (e1_p2Height * e1_p2_hbRatio * ((e1Percentage - 0.64) * 2.778) / 2);
      e1_p2_x3New = e1_p2_x2New;
      e1_p2_y3New = e1_p2_y1 + (e1_p2Height * e1_p2_hbRatio * ((e1Percentage - 0.64) * 2.778) / 2);
    } else if (e1Percentage >= 0.59) {
      e1_p1_yAdd = (e1_p1_y3Start - e1_p1_y3End) * ((e1Percentage - 0.59) * 3.763);
    }
  }

  context.beginPath();
  context.moveTo(e1_p1_x1, e1_p1_y1Start + (e1_p1_y1End - e1_p1_y1Start) * e1Percentage * 1.167);
  context.lineTo(e1_p1_x2, e1_p1_y2Start + (e1_p1_y2End - e1_p1_y2Start) * e1Percentage * 1.167);
  context.lineTo(e1_p1_x3, e1_p1_y3Start - e1_p1_yAdd);
  context.lineTo(e1_p1_x4, e1_p1_y4Start - e1_p1_yAdd);
  context.fill();

  context.beginPath();
  context.moveTo(e1_p2_x1New, e1_p2_y1);
  context.lineTo(e1_p2_x2New, e1_p2_y2New);
  context.lineTo(e1_p2_x3New, e1_p2_y3New);
  context.fill();
  
  context.beginPath();
  context.moveTo(e1_p3_x1New, e1_p3_y1New);
  context.lineTo(e1_p3_x2New, e1_p3_y2New);
  context.lineTo(e1_p3_x3New, e1_p3_y3New);
  context.fill();
  
  context.beginPath();
  context.moveTo(e1_p4_x1New, e1_p4_y1New);
  context.lineTo(e1_p4_x2New, e1_p4_y2New);
  context.lineTo(e1_p4_x3New, e1_p4_y3New);
  context.fill();
}

// Letter 'T' (second - t2)
//  ___ ______ ___
// |  /|      |\  |
// |2/ |  1   | \3|
// |/  |      |  \|
//     |      |
//     |      |
//     |      |
//     |      |
//     |______|

/*
 * Overall variables
 */

// That specific animation duration time from the overall animation time
let t2AnimationStart = animationDuration * 0.167;
let t2AnimationDuration = animationDuration * 0.667;

// Boolean for detecting if the whole animation is over
let t2AnimationOver = false;

// percentage shows how much of the animation is completed
let t2Percentage;

/*
 * Part 1 related variables (t2_p1)
 */

// Animation ending coordinates
let t2_p1_x1 = xStart + unitLength * 32;
let t2_p1_y1 = yStart + unitLength * 58;
let t2_p1_x2 = xStart + unitLength * 41;
let t2_p1_y2 = yStart + unitLength * 58;
let t2_p1_x3 = xStart + unitLength * 41;
let t2_p1_y3 = yStart + unitLength * 85;
let t2_p1_x4 = xStart + unitLength * 32;
let t2_p1_y4 = yStart + unitLength * 85;

// x-coordinates are static through the animation, only y-coordinates are necessary
// y-coordinates in the animation start
let t2_p1_y1Start = yStart + unitLength * 132;
let t2_p1_y2Start = yStart + unitLength * 132;
let t2_p1_y3Start = yStart + unitLength * 132;
let t2_p1_y4Start = yStart + unitLength * 132;

// y-coordinates in the animation end
let t2_p1_y1End = t2_p1_y1;
let t2_p1_y2End = t2_p1_y2;
let t2_p1_y3End = t2_p1_y3;
let t2_p1_y4End = t2_p1_y4;

// Variable for the delayed animation
let t2_p1_yAdd = 0;

/*
* Part 2 related variables (t2_p2)
*/

let t2_p2_x1 = xStart + unitLength * 25;
let t2_p2_y1 = yStart + unitLength * 58;
let t2_p2_x2 = xStart + unitLength * 31.5;
let t2_p2_y2 = yStart + unitLength * 58;
let t2_p2_x3 = xStart + unitLength * 25;
let t2_p2_y3 = yStart + unitLength * 71;

// Dynamic coordinates
let t2_p2_xNew = t2_p2_x1;
let t2_p2_y3New;

/*
* Part 3 related variables (t2_p3)
*/

let t2_p3_x1 = xStart + unitLength * 41.5;
let t2_p3_y1 = yStart + unitLength * 58;
let t2_p3_x2 = xStart + unitLength * 48;
let t2_p3_y2 = yStart + unitLength * 58;
let t2_p3_x3 = xStart + unitLength * 48;
let t2_p3_y3 = yStart + unitLength * 71;

// Dynamic coordinates
let t2_p3_xNew = t2_p3_x1;
let t2_p3_y3New;

function drawAnimatedLetterTSecond() {
  t2Percentage = (currentTime - startTime - t2AnimationStart) / t2AnimationDuration;

  if (!t2AnimationOver) {
    if (t2Percentage < 0) {
      return;
    } else if (t2Percentage >= 1.0) {
      t2_p2_xNew = t2_p2_x1;
      t2_p2_y3New = t2_p2_y3;
      t2AnimationOver = true;
    } else if (t2Percentage >= 0.8) {
      t2_p1_y1Start = t2_p1_y1End; 
      t2_p1_y2Start = t2_p1_y2End;
      t2_p1_yAdd = t2_p1_y3Start - t2_p1_y3End;

      t2_p2_xNew = t2_p2_x2 - (t2_p2_x2 - t2_p2_x1) * ((t2Percentage - 0.64) * 2.778);
      t2_p2_y3New = calculateCoordinate(t2_p2_x2, t2_p2_y2, t2_p2_x3, t2_p2_y3, 'x', t2_p2_xNew);
    } else if (t2Percentage >= 0.64) {
      t2_p1_yAdd = (t2_p1_y3Start - t2_p1_y3End) * ((t2Percentage - 0.4) * 2.5);
      t2_p3_xNew = t2_p3_x2;
      t2_p3_y3New = t2_p3_y3;

      t2_p2_xNew = t2_p2_x2 - (t2_p2_x2 - t2_p2_x1) * ((t2Percentage - 0.64) * 2.778);
      t2_p2_y3New = calculateCoordinate(t2_p2_x2, t2_p2_y2, t2_p2_x3, t2_p2_y3, 'x', t2_p2_xNew);
    } else if (t2Percentage >= 0.4) {
      t2_p1_yAdd = (t2_p1_y3Start - t2_p1_y3End) * ((t2Percentage - 0.4) * 2.5);
      t2_p3_xNew = t2_p3_x1 + (t2_p3_x2 - t2_p3_x1) * ((t2Percentage - 0.4) * 4.167);
      t2_p3_y3New = calculateCoordinate(t2_p3_x1, t2_p3_y1, t2_p3_x3, t2_p3_y3, 'x', t2_p3_xNew);
    }
  }

  context.beginPath();
  context.moveTo(t2_p1_x1, t2_p1_y1Start + (t2_p1_y1End - t2_p1_y1Start) * t2Percentage * 1.25);
  context.lineTo(t2_p1_x2, t2_p1_y2Start + (t2_p1_y2End - t2_p1_y2Start) * t2Percentage * 1.25);
  context.lineTo(t2_p1_x3, t2_p1_y3Start - t2_p1_yAdd);
  context.lineTo(t2_p1_x4, t2_p1_y4Start - t2_p1_yAdd);
  context.fill();

  context.beginPath();
  context.moveTo(t2_p2_xNew, t2_p2_y1);
  context.lineTo(t2_p2_x2, t2_p2_y2);
  context.lineTo(t2_p2_xNew, t2_p2_y3New);
  context.fill();
  
  context.beginPath();
  context.moveTo(t2_p3_x1, t2_p3_y1);
  context.lineTo(t2_p3_xNew, t2_p3_y2);
  context.lineTo(t2_p3_xNew, t2_p3_y3New);
  context.fill();
}

// Letter 'O' (second - o2)
//    __   __
//   /  | |  \ 
//  /   | |   \
// |    | |    |
// |  1 | | 2  |
// |    | |    |
//  \   | |   /
//   \__| |__/

/*
 * Overall variables
 */

// That specific animation duration time from the overall animation time
let o2AnimationStart = animationDuration * 0.63;
let o2AnimationDuration = animationDuration * 0.37;

// Boolean for detecting if the whole animation is over
let o2AnimationOver = false;

// percentage shows how much of the animation is completed
let o2Percentage;

/*
 * Part 1 related variables (o2_p1)
 */

// Animation ending coordinates
let o2_p1_x1 = xStart + unitLength * 60;
let o2_p1_y1 = yStart + unitLength * 58;

let o2_p1_cp1x = xStart + unitLength * 46.8;
let o2_p1_cp1y = yStart + unitLength * 58;
let o2_p1_cp2x = xStart + unitLength * 46.8;
let o2_p1_cp2y = yStart + unitLength * 85;
let o2_p1_x2 = xStart + unitLength * 60;
let o2_p1_y2 = yStart + unitLength * 85;

// Variable moving the clipping region
let o2_p1_xAdd;

/*
 * Part 2 related variables (o2_p2)
 */

// Animation ending coordinates
let o2_p2_x1 = xStart + unitLength * 62;
let o2_p2_y1 = yStart + unitLength * 58;

let o2_p2_cp1x = xStart + unitLength * 75.2;
let o2_p2_cp1y = yStart + unitLength * 58;
let o2_p2_cp2x = xStart + unitLength * 75.2;
let o2_p2_cp2y = yStart + unitLength * 85;
let o2_p2_x2 = xStart + unitLength * 62;
let o2_p2_y2 = yStart + unitLength * 85;

// Variable moving the clipping region
let o2_p2_xAdd;

function drawAnimatedLetterOSecond() {
  o2Percentage = (currentTime - startTime - o2AnimationStart) / o2AnimationDuration;

  if (!o2AnimationOver) {
    if (o2Percentage < 0) {
      return;
    } else if (o2Percentage >= 1.0) {
      o2_p2_xAdd = 0;
      o2AnimationOver = true;
    } else if (o2Percentage >= 0.6) {
      o2_p2_xAdd = unitLength * 10 * (1 - (o2Percentage - 0.6) * 2.5);
    } else if (o2Percentage >= 0.54) {
      o2_p1_xAdd = 0;
    } else {
      o2_p1_xAdd = unitLength * 10 * (1 - o2Percentage * 1.852);
    }
  }

  context.save();
  context.beginPath();
  context.moveTo(o2_p1_x1 - unitLength * 10, o2_p1_y1);
  context.lineTo(o2_p1_x1 - o2_p1_xAdd, o2_p1_y1);
  context.lineTo(o2_p1_x1 - o2_p1_xAdd, o2_p1_y2);
  context.lineTo(o2_p1_x1 - unitLength * 10, o2_p1_y2);
  context.clip();

  context.beginPath();
  context.moveTo(o2_p1_x1, o2_p1_y1);
  context.bezierCurveTo(o2_p1_cp1x, o2_p1_cp1y, o2_p1_cp2x, o2_p1_cp2y, o2_p1_x2, o2_p1_y2);
  context.fill();
  context.restore();
  
  context.save();
  context.beginPath();
  context.moveTo(o2_p2_x1, o2_p2_y1);
  context.bezierCurveTo(o2_p2_cp1x, o2_p2_cp1y, o2_p2_cp2x, o2_p2_cp2y, o2_p2_x2, o2_p2_y2);
  context.clip();

  context.beginPath();
  context.moveTo(o2_p2_x1 - o2_p2_xAdd, o2_p2_y1);
  context.bezierCurveTo(o2_p2_cp1x - o2_p2_xAdd, o2_p2_cp1y, o2_p2_cp2x - o2_p2_xAdd, o2_p2_cp2y, o2_p2_x2 - o2_p2_xAdd, o2_p2_y2);
  context.fill();
  context.restore();
}

// Letter 'D' (first - d1)
//  ____   __
// |    | |  \ 
// |    | |   \
// |    | |    \
// |  1 | | 2  |
// |    | |    |
// |    | |    /
// |    | |   /
// |____| |__/

/*
 * Overall variables
 */

// That specific animation duration time from the overall animation time
let d1AnimationStart = animationDuration * 0.45;
let d1AnimationDuration = animationDuration * 0.4;

// Boolean for detecting if the whole animation is over
let d1AnimationOver = false;

// percentage shows how much of the animation is completed
let d1Percentage;

/*
 * Part 1 related variables (d1_p1)
 */

// Animation ending coordinates
let d1_p1_x1 = xStart + unitLength * 50;
let d1_p1_y1 = yStart + unitLength * 87;
let d1_p1_x2 = d1_p1_x1 + unitLength * 10;
let d1_p1_y2 = d1_p1_y1;
let d1_p1_x3 = d1_p1_x2;
let d1_p1_y3 = d1_p1_y1 + unitLength * 27;
let d1_p1_x4 = d1_p1_x1;
let d1_p1_y4 = d1_p1_y3;

// x-coordinates are static through the animation, only y-coordinates are necessary
// y-coordinates in the animation start
let d1_p1_y1Start = yStart + unitLength * 132;
let d1_p1_y2Start = yStart + unitLength * 132;
let d1_p1_y3Start = yStart + unitLength * 132;
let d1_p1_y4Start = yStart + unitLength * 132;

// y-coordinates in the animation end
let d1_p1_y1End = d1_p1_y1;
let d1_p1_y2End = d1_p1_y2;
let d1_p1_y3End = d1_p1_y3;
let d1_p1_y4End = d1_p1_y4;

// Variable for the delayed animation
let d1_p1_yAdd = 0;

/*
 * Part 2 related variables (d1_p2)
 */

// Animation ending coordinates
let d1_p2_x1 = xStart + unitLength * 62;
let d1_p2_y1 = yStart + unitLength * 87;

let d1_p2_cp1x = d1_p2_x1 + unitLength * 13.2;
let d1_p2_cp1y = d1_p2_y1;
let d1_p2_cp2x = d1_p2_cp1x;
let d1_p2_cp2y = d1_p2_cp1y + unitLength * 27;
let d1_p2_x2 = d1_p2_x1;
let d1_p2_y2 = d1_p2_cp2y;

// Variable for the delayed animation
let d1_p2_xAdd = unitLength * 10;

function drawAnimatedLetterDFirst() {
  d1Percentage = (currentTime - startTime - d1AnimationStart) / d1AnimationDuration;

  if (!d1AnimationOver) {
    if (d1Percentage < 0) {
      return;
    } else if (d1Percentage >= 1.0) {
      d1_p2_xAdd = 0;
      d1AnimationOver = true;
    } else if (d1Percentage >= 0.5) {
      d1_p2_xAdd = unitLength * 10 * (1 - (d1Percentage - 0.5) * 2);

      d1_p1_y1Start = d1_p1_y1End;
      d1_p1_y2Start = d1_p1_y2End;
      d1_p1_yAdd = d1_p1_y3Start - d1_p1_y3End;
    } else if (d1Percentage >= 0.4) {
      d1_p1_yAdd = (d1_p1_y3Start - d1_p1_y3End) * ((d1Percentage - 0.4) * 10);
    }
  }
  
  context.beginPath();
  context.moveTo(d1_p1_x1, d1_p1_y1Start + (d1_p1_y1End - d1_p1_y1Start) * d1Percentage * 2);
  context.lineTo(d1_p1_x2, d1_p1_y1Start + (d1_p1_y1End - d1_p1_y1Start) * d1Percentage * 2);
  context.lineTo(d1_p1_x3, d1_p1_y3Start - d1_p1_yAdd);
  context.lineTo(d1_p1_x4, d1_p1_y4Start - d1_p1_yAdd);
  context.fill();

  context.save();
  context.beginPath();
  context.moveTo(d1_p2_x1, d1_p2_y1);
  context.bezierCurveTo(d1_p2_cp1x, d1_p2_cp1y, d1_p2_cp2x, d1_p2_cp2y, d1_p2_x2, d1_p2_y2);
  context.clip();

  context.beginPath();
  context.moveTo(d1_p2_x1 - d1_p2_xAdd, d1_p2_y1);
  context.bezierCurveTo(d1_p2_cp1x - d1_p2_xAdd, d1_p2_cp1y, d1_p2_cp2x - d1_p2_xAdd, d1_p2_cp2y, d1_p2_x2 - d1_p2_xAdd, d1_p2_y2);
  context.fill();
  context.restore();
}

// Letter 'I' (second - i2)
//  ____ 
// |    |
// |    |
// |    |
// | 1  |
// |    |
// |    |
// |    |
// |____|

/*
 * Overall variables
 */

// That specific animation duration time from the overall animation time
let i2AnimationStart = animationDuration * 0.72;
let i2AnimationDuration = animationDuration * 0.213;

// Boolean for detecting if the whole animation is over
let i2AnimationOver = false;

// percentage shows how much of the animation is completed
let i2Percentage;

/*
 * Part 1 related variables (e1_p1)
 */

// xStart + unitLength * 73, yStart + unitLength * 87
// Animation ending coordinates
let i2_p1_x1 = xStart + unitLength * 73;
let i2_p1_y1 = yStart + unitLength * 87;
let i2_p1_x2 = i2_p1_x1 + unitLength * 10;
let i2_p1_y2 = i2_p1_y1;
let i2_p1_x3 = i2_p1_x1 + unitLength * 10;
let i2_p1_y3 = i2_p1_y1 + unitLength * 27;
let i2_p1_x4 = i2_p1_x1;
let i2_p1_y4 = i2_p1_y3;

// x-coordinates are static through the animation, only y-coordinates are necessary
// y-coordinates in the animation start
let i2_p1_y1Start = yStart + unitLength * 132;
let i2_p1_y2Start = yStart + unitLength * 132;
let i2_p1_y3Start = yStart + unitLength * 132;
let i2_p1_y4Start = yStart + unitLength * 132;

// y-coordinates in the animation end
let i2_p1_y1End = i2_p1_y1;
let i2_p1_y2End = i2_p1_y2;
let i2_p1_y3End = i2_p1_y3;
let i2_p1_y4End = i2_p1_y4;

// Variable for the delayed animation
let i2_p1_yAdd = 0;

function drawAnimatedLetterISecond() {
  i2Percentage = (currentTime - startTime - i2AnimationStart) / i2AnimationDuration;

  if (!i2AnimationOver) {
    if (i2Percentage < 0) {
      return;
    } else if (i2Percentage >= 1.0) {
      i2_p1_y1Start = i2_p1_y1End;
      i2_p1_y2Start = i2_p1_y2End;
      i2_p1_yAdd = i2_p1_y3Start - i2_p1_y3End;
      i2AnimationOver = true;
    } else if (i2Percentage >= 0.8) {
      i2_p1_yAdd = (i2_p1_y3Start - i2_p1_y3End) * ((i2Percentage - 0.8) * 5);
    }
  }

  context.beginPath();
  context.moveTo(i2_p1_x1, i2_p1_y1Start + (i2_p1_y1End - i2_p1_y1Start) * i2Percentage);
  context.lineTo(i2_p1_x2, i2_p1_y2Start + (i2_p1_y2End - i2_p1_y2Start) * i2Percentage);
  context.lineTo(i2_p1_x3, i2_p1_y3Start - i2_p1_yAdd);
  context.lineTo(i2_p1_x4, i2_p1_y4Start - i2_p1_yAdd);
  context.fill();
}

// Letter 'E' (second - e2)
//  ____  _____
// |    | \    |
// |    |   \ 3|
// |    |  /| \|
// | 1  |/ 2|
// |    |\  |
// |    |  \| /|
// |    |   / 4|
// |____| /____|

/*
 * Overall variables
 */

// This specific animation duration time from the overall animation time
let e2AnimationStart = animationDuration * 0.57;
let e2AnimationDuration = animationDuration * 0.467;

// Boolean for detecting if the whole animation is over
let e2AnimationOver = false;

// percentage shows how much of the animation is completed
let e2Percentage;

/*
 * Part 1 related variables (e1_p1)
 */

// Animation ending coordinates
let e2_p1_x1 = xStart + unitLength * 85;
let e2_p1_y1 = yStart + unitLength * 87;
let e2_p1_x2 = e2_p1_x1 + unitLength * 9;
let e2_p1_y2 = e2_p1_y1;
let e2_p1_x3 = e2_p1_x1 + unitLength * 9;
let e2_p1_y3 = e2_p1_y1 + unitLength * 27;
let e2_p1_x4 = e2_p1_x1;
let e2_p1_y4 = e2_p1_y3;

// x-coordinates are static through the animation, only y-coordinates are necessary
// y-coordinates in the animation start
let e2_p1_y1Start = e2_p1_y1;
let e2_p1_y2Start = e2_p1_y2;
let e2_p1_y3Start = e2_p1_y2;
let e2_p1_y4Start = e2_p1_y2;

// y-coordinates in the animation end
let e2_p1_y1End = e2_p1_y1;
let e2_p1_y2End = e2_p1_y2;
let e2_p1_y3End = e2_p1_y3;
let e2_p1_y4End = e2_p1_y4;

/*
 * Part 2 related variables (e1_p2)
 */

// Animation ending coordinates
let e2_p2_x1 = xStart + unitLength * 94.5;
let e2_p2_y1 = yStart + unitLength * 100.5;
let e2_p2_x2 = xStart + unitLength * 100.5;
let e2_p2_y2 = yStart + unitLength * 95;
let e2_p2_x3 = xStart + unitLength * 100.5;
let e2_p2_y3 = yStart + unitLength * 106;

// Animated coordinates
let e2_p2_x1New;
let e2_p2_y1New;
let e2_p2_x2New;
let e2_p2_y2New;
let e2_p2_x3New;
let e2_p2_y3New;

// Triangle height
let e2_p2Height = e2_p2_x2 - e2_p2_x1;

// Triangle height and basis ratio
let e2_p2_hbRatio = (e2_p2_y3 - e2_p2_y2) / e2_p2Height;

// Transformation length
let e2_p2TranslateX = unitLength * 32;
let e2_p2_xAdd = e2_p2TranslateX;

/*
 * Part 3 related variables (e1_p3)
 */

// Animation ending coordinates
let e2_p3_x1 = xStart + unitLength * 94.5;
let e2_p3_y1 = yStart + unitLength * 87;
let e2_p3_x2 = xStart + unitLength * 103.5;
let e2_p3_y2 = yStart + unitLength * 87;
let e2_p3_x3 = xStart + unitLength * 103.5;
let e2_p3_y3 = yStart + unitLength * 98;

// Animated coordinates
let e2_p3_x1New;
let e2_p3_y1New;
let e2_p3_x2New;
let e2_p3_y2New;
let e2_p3_x3New;
let e2_p3_y3New;

// Side length
let e2_p3SideLength1 = e2_p3_x2 - e2_p3_x1;
let e2_p3SideLength1New;

// Rotation center coordinates
let e2_p3_rc_x = e2_p3_x1 + (e2_p3_x2 - e2_p3_x1) / 2;
let e2_p3_rc_y = e2_p3_y1 + (e2_p3_y2 - e2_p3_y1) / 2;

let e2_p3_vec1Length = vectorLength(e2_p3_x1, e2_p3_y1, e2_p3_rc_x, e2_p3_rc_y);
let e2_p3_vec2 = [e2_p3_rc_x - e2_p3_x3, e2_p3_rc_y - e2_p3_y3];
let e2_p3_vec2Length = vectorLength(e2_p3_x3, e2_p3_y3, e2_p3_rc_x, e2_p3_rc_y);
let e2_p3_vec1vec2Ratio = e2_p3_vec2Length / e2_p3_vec1Length;
let e2_p3_vec3 = [e2_p3_x2 - e2_p3_x3, e2_p3_y2 - e2_p3_y3];
let e2_p3_vec3Length = vectorLength(e2_p3_x3, e2_p3_y3, e2_p3_x2, e2_p3_y2);
let e2_p3_p3ExtraAngleCos = (e2_p3_vec2[0] * e2_p3_vec3[0] + e2_p3_vec2[1] * e2_p3_vec3[1]) / (e2_p3_vec2Length * e2_p3_vec3Length);
let e2_p3_p3ExtraAngle = Math.acos(e2_p3_p3ExtraAngleCos) * 180 / Math.PI;

// Rotation angle
let e2_p3FullRotationAngle = 80;
let e2_p3_p3RotationAngle;

/*
 * Part 4 related variables (e1_p4)
 */

// Animation ending coordinates 
let e2_p4_x1 = xStart + unitLength * 94.5;
let e2_p4_y1 = yStart + unitLength * 114;
let e2_p4_x2 = xStart + unitLength * 103.5;
let e2_p4_y2 = yStart + unitLength * 114;
let e2_p4_x3 = xStart + unitLength * 103.5;
let e2_p4_y3 = yStart + unitLength * 103;

// Animated coordinates
let e2_p4_x1New;
let e2_p4_y1New;
let e2_p4_x2New;
let e2_p4_y2New;
let e2_p4_x3New;
let e2_p4_y3New;

// Side length
let e2_p3_p4SideLength1 = e2_p4_x2 - e2_p4_x1;
let e2_p3_p4SideLength1New;

// Rotation center coordinates
let e2_p4_rc_x = e2_p4_x1 + (e2_p4_x2 - e2_p4_x1) / 2;
let e2_p4_rc_y = e2_p4_y1 + (e2_p4_y2 - e2_p4_y1) / 2;

let e2_p4_vec1Length = vectorLength(e2_p4_x1, e2_p4_y1, e2_p4_rc_x, e2_p4_rc_y);
let e2_p4_vec2 = [e2_p4_rc_x - e2_p4_x3, e2_p4_rc_y - e2_p4_y3];
let e2_p4_vec2Length = vectorLength(e2_p4_x3, e2_p4_y3, e2_p4_rc_x, e2_p4_rc_y);
let e2_p4_vec1vec2Ratio = e2_p4_vec2Length / e2_p4_vec1Length;
let e2_p4_vec3 = [e2_p4_x2 - e2_p4_x3, e2_p4_y2 - e2_p4_y3];
let e2_p4_vec3Length = vectorLength(e2_p4_x3, e2_p4_y3, e2_p4_x2, e2_p4_y2);
let e2_p4_p3ExtraAngleCos = (e2_p4_vec2[0] * e2_p4_vec3[0] + e2_p4_vec2[1] * e2_p4_vec3[1]) / (e2_p4_vec2Length * e2_p4_vec3Length);
let e2_p4_p3ExtraAngle = Math.acos(e2_p4_p3ExtraAngleCos) * 180 / Math.PI;

// Rotation angle
let e2_p3_p4RotationAngle;

function drawAnimatedLetterESecond() {
  e2Percentage = (currentTime - startTime - e2AnimationStart) / e2AnimationDuration;

  if (!e2AnimationOver) {
    if (e2Percentage < 0) {
      return;
    } else if (e2Percentage >= 1.0) {
      e2_p3_x1New = e2_p3_x1;
      e2_p3_y1New = e2_p3_y1;
      e2_p3_x2New = e2_p3_x2;
      e2_p3_y2New = e2_p3_y2;
      e2_p3_x3New = e2_p3_x3;
      e2_p3_y3New = e2_p3_y3;
      
      e2_p4_x1New = e2_p4_x1;
      e2_p4_y1New = e2_p4_y1;
      e2_p4_x2New = e2_p4_x2;
      e2_p4_y2New = e2_p4_y2;
      e2_p4_x3New = e2_p4_x3;
      e2_p4_y3New = e2_p4_y3;

      e2_p2_x1New = e2_p2_x1;
      e2_p2_x2New = e2_p2_x2;
      e2_p2_y2New = e2_p2_y2;
      e2_p2_x3New = e2_p2_x3;
      e2_p2_y3New = e2_p2_y3;

      e2AnimationOver = true;
    } else if (e2Percentage >= 0.86) {
      e2_p1_y3Start = e2_p1_y3End; 
      e2_p1_y4Start = e2_p1_y4End;

      e2_p3_p3RotationAngle = e2_p3FullRotationAngle * (1 - ((e2Percentage - 0.64) * 2.778));
      e2_p3_p4RotationAngle = e2_p3FullRotationAngle * ((e2Percentage - 0.64) * 2.778);

      e2_p3SideLength1New = e2_p3SideLength1 * ((e2Percentage - 0.64) * 2.778);
      e2_p3_vec1Length = e2_p3SideLength1New / 2;
      e2_p3_vec2Length = e2_p3_vec1Length * e2_p3_vec1vec2Ratio;
      e2_p3_rc_x = e2_p3_x1 + e2_p3_vec1Length;

      e2_p3_x1New = e2_p3_rc_x + e2_p3_vec1Length * Math.cos((180 + e2_p3_p3RotationAngle) * Math.PI / 180);
      e2_p3_y1New = e2_p3_rc_y + e2_p3_vec1Length * (-1) * Math.sin((180 + e2_p3_p3RotationAngle) * Math.PI / 180);
      e2_p3_x2New = e2_p3_rc_x + e2_p3_vec1Length * Math.cos(e2_p3_p3RotationAngle * Math.PI / 180);
      e2_p3_y2New = e2_p3_rc_y + e2_p3_vec1Length * (-1) * Math.sin(e2_p3_p3RotationAngle * Math.PI / 180);
      e2_p3_x3New = e2_p3_rc_x + e2_p3_vec2Length * Math.cos((270 + e2_p3_p3ExtraAngle + e2_p3_p3RotationAngle) * Math.PI / 180);
      e2_p3_y3New = e2_p3_rc_y + e2_p3_vec2Length * (-1) * Math.sin((270 + e2_p3_p3ExtraAngle + e2_p3_p3RotationAngle) * Math.PI / 180);

      e2_p4_rc_x = e2_p4_x1 + e2_p3_vec1Length;
      e2_p4_x1New = e2_p4_rc_x + e2_p3_vec1Length * Math.cos((e2_p3_p4RotationAngle - e2_p3FullRotationAngle) * Math.PI / 180);
      e2_p4_y1New = e2_p4_rc_y + e2_p3_vec1Length * (-1) * Math.sin((e2_p3_p4RotationAngle - e2_p3FullRotationAngle) * Math.PI / 180);
      e2_p4_x2New = e2_p4_rc_x + e2_p3_vec1Length * Math.cos((180 + e2_p3_p4RotationAngle - e2_p3FullRotationAngle) * Math.PI / 180);
      e2_p4_y2New = e2_p4_rc_y + e2_p3_vec1Length * (-1) * Math.sin((180 + e2_p3_p4RotationAngle - e2_p3FullRotationAngle) * Math.PI / 180);
      e2_p4_x3New = e2_p4_rc_x + e2_p3_vec2Length * Math.cos((90 - e2_p3_p3ExtraAngle + e2_p3_p4RotationAngle - e2_p3FullRotationAngle) * Math.PI / 180);
      e2_p4_y3New = e2_p4_rc_y + e2_p3_vec2Length * (-1) * Math.sin((90 - e2_p3_p3ExtraAngle + e2_p3_p4RotationAngle - e2_p3FullRotationAngle) * Math.PI / 180);

      e2_p2_xAdd = e2_p2TranslateX * (1 - ((e2Percentage - 0.64) * 2.778));
      e2_p2_x1New = e2_p2_x1 + e2_p2_xAdd;
      e2_p2_x2New = e2_p2_x1New + e2_p2Height * ((e2Percentage - 0.64) * 2.778);
      e2_p2_y2New = e2_p2_y1 - (e2_p2Height * e2_p2_hbRatio * ((e2Percentage - 0.64) * 2.778) / 2);
      e2_p2_x3New = e2_p2_x2New;
      e2_p2_y3New = e2_p2_y1 + (e2_p2Height * e2_p2_hbRatio * ((e2Percentage - 0.64) * 2.778) / 2);
    } else if (e2Percentage >= 0.64) {
      e2_p3_p3RotationAngle = e2_p3FullRotationAngle * (1 - ((e2Percentage - 0.64) * 2.778));
      e2_p3_p4RotationAngle = e2_p3FullRotationAngle * ((e2Percentage - 0.64) * 2.778);

      e2_p3SideLength1New = e2_p3SideLength1 * ((e2Percentage - 0.64) * 2.778);
      e2_p3_vec1Length = e2_p3SideLength1New / 2;
      e2_p3_vec2Length = e2_p3_vec1Length * e2_p3_vec1vec2Ratio;
      e2_p3_rc_x = e2_p3_x1 + e2_p3_vec1Length;
      
      e2_p3_x1New = e2_p3_rc_x + e2_p3_vec1Length * Math.cos((180 + e2_p3_p3RotationAngle) * Math.PI / 180);
      e2_p3_y1New = e2_p3_rc_y + e2_p3_vec1Length * (-1) * Math.sin((180 + e2_p3_p3RotationAngle) * Math.PI / 180);
      e2_p3_x2New = e2_p3_rc_x + e2_p3_vec1Length * Math.cos(e2_p3_p3RotationAngle * Math.PI / 180);
      e2_p3_y2New = e2_p3_rc_y + e2_p3_vec1Length * (-1) * Math.sin(e2_p3_p3RotationAngle * Math.PI / 180);
      e2_p3_x3New = e2_p3_rc_x + e2_p3_vec2Length * Math.cos((270 + e2_p3_p3ExtraAngle + e2_p3_p3RotationAngle) * Math.PI / 180);
      e2_p3_y3New = e2_p3_rc_y + e2_p3_vec2Length * (-1) * Math.sin((270 + e2_p3_p3ExtraAngle + e2_p3_p3RotationAngle) * Math.PI / 180);

      e2_p4_rc_x = e2_p4_x1 + e2_p3_vec1Length;
      e2_p4_x1New = e2_p4_rc_x + e2_p3_vec1Length * Math.cos((e2_p3_p4RotationAngle - e2_p3FullRotationAngle) * Math.PI / 180);
      e2_p4_y1New = e2_p4_rc_y + e2_p3_vec1Length * (-1) * Math.sin((e2_p3_p4RotationAngle - e2_p3FullRotationAngle) * Math.PI / 180);
      e2_p4_x2New = e2_p4_rc_x + e2_p3_vec1Length * Math.cos((180 + e2_p3_p4RotationAngle - e2_p3FullRotationAngle) * Math.PI / 180);
      e2_p4_y2New = e2_p4_rc_y + e2_p3_vec1Length * (-1) * Math.sin((180 + e2_p3_p4RotationAngle - e2_p3FullRotationAngle) * Math.PI / 180);
      e2_p4_x3New = e2_p4_rc_x + e2_p3_vec2Length * Math.cos((90 - e2_p3_p3ExtraAngle + e2_p3_p4RotationAngle - e2_p3FullRotationAngle) * Math.PI / 180);
      e2_p4_y3New = e2_p4_rc_y + e2_p3_vec2Length * (-1) * Math.sin((90 - e2_p3_p3ExtraAngle + e2_p3_p4RotationAngle - e2_p3FullRotationAngle) * Math.PI / 180);
      
      e2_p2_xAdd = e2_p2TranslateX * (1 - ((e2Percentage - 0.64) * 2.778));
      e2_p2_x1New = e2_p2_x1 + e2_p2_xAdd;
      e2_p2_x2New = e2_p2_x1New + e2_p2Height * ((e2Percentage - 0.64) * 2.778);
      e2_p2_y2New = e2_p2_y1 - (e2_p2Height * e2_p2_hbRatio * ((e2Percentage - 0.64) * 2.778) / 2);
      e2_p2_x3New = e2_p2_x2New;
      e2_p2_y3New = e2_p2_y1 + (e2_p2Height * e2_p2_hbRatio * ((e2Percentage - 0.64) * 2.778) / 2);
    }
  }

  context.beginPath();
  context.moveTo(e2_p1_x1, e2_p1_y1);
  context.lineTo(e2_p1_x2, e2_p1_y2);
  context.lineTo(e2_p1_x3, e2_p1_y3Start + (e2_p1_y3End - e2_p1_y3Start) * e2Percentage * 1.163);
  context.lineTo(e2_p1_x4, e2_p1_y4Start + (e2_p1_y4End - e2_p1_y4Start) * e2Percentage * 1.163);
  context.fill();

  context.beginPath();
  context.moveTo(e2_p2_x1New, e2_p2_y1);
  context.lineTo(e2_p2_x2New, e2_p2_y2New);
  context.lineTo(e2_p2_x3New, e2_p2_y3New);
  context.fill();
  
  context.beginPath();
  context.moveTo(e2_p3_x1New, e2_p3_y1New);
  context.lineTo(e2_p3_x2New, e2_p3_y2New);
  context.lineTo(e2_p3_x3New, e2_p3_y3New);
  context.fill();
  
  context.beginPath();
  context.moveTo(e2_p4_x1New, e2_p4_y1New);
  context.lineTo(e2_p4_x2New, e2_p4_y2New);
  context.lineTo(e2_p4_x3New, e2_p4_y3New);
  context.fill();
}

// This specific animation duration and start time related to letters animation time
let logoAnimationStart = animationDuration;
let logoAnimationDuration = 500;

// Boolean for detecting if the whole animation is over
let logoAnimationOver = false;

// Percentage shows how much of the animation is completed
let logoPercentage;

// Alpha for the logo fade in animation
let logoAlpha = 0;

// Logo height and width
let logoHeight = unitLength * 27 * 0.5;
let logoWidth = logoHeight * 2.556;

// Logo starting coordinates
let logoX = xStart + unitLength * 74;
let logoY = yStart + unitLength * 58 + (unitLength * 27 - logoHeight) / 2;

function draw007Logo() {
  logoPercentage = (currentTime - startTime - logoAnimationStart) / logoAnimationDuration;

  if (!logoAnimationOver) {
    if (logoPercentage >= 0) {
      if (logoPercentage >= 1.0) {
        logoAnimationOver = true;
        logoAlpha = 1;
      } else {
        logoAlpha = logoPercentage;
      }
    }
  } else {
    $('.original').addClass('original-fall-animation');
    $('.start-button-wrapper .reflection-wrapper').addClass('reflection-fall-animation');
    $('.refresh-button-wrapper').addClass('slide-in');
  }

  context.save();
  context.globalAlpha = logoAlpha;
  context.drawImage(document.getElementById('logo'), logoX, logoY, logoWidth, logoHeight);
  context.restore();
}

function draw() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  time = new Date();
  currentTime = time.getSeconds() * 1000 + time.getMilliseconds();

  for(let i = 0; i < letterFunctionsArray.length; i++) {
    letterFunctionsArray[i]();
  }

  window.requestAnimationFrame(draw);
}

$(".original").on("click", function() {
  time = new Date();
  startTime = startTime || (time.getSeconds() * 1000 + time.getMilliseconds());

  letterFunctionsArray.push(drawAnimatedLetterNFirst);
  letterFunctionsArray.push(drawAnimatedLetterOFirst);

  letterFunctionsArray.push(drawAnimatedLetterTFirst);
  letterFunctionsArray.push(drawAnimatedLetterIFirst);
  letterFunctionsArray.push(drawAnimatedLetterMFirst);
  letterFunctionsArray.push(drawAnimatedLetterEFirst);
  
  letterFunctionsArray.push(drawAnimatedLetterTSecond);
  letterFunctionsArray.push(drawAnimatedLetterOSecond);

  letterFunctionsArray.push(drawAnimatedLetterDFirst);
  letterFunctionsArray.push(drawAnimatedLetterISecond);
  letterFunctionsArray.push(drawAnimatedLetterESecond);
  letterFunctionsArray.push(draw007Logo);

  draw();
});

$(".refresh-button").on("click", function() {
  $('.letter').addClass('fade-out');
  $('.refresh-button-wrapper').addClass('close-button');
  $('.canvas').addClass('fade-out');
  $('.canvas').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend',   
    function(e) {
      location.reload();
  });
});

$(window).on('resize',function() { location.reload(); });

$(document).ready(function() {
  $('.start-button-wrapper').addClass('fade-in');
})