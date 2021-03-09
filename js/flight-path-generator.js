// How often to update plane positions while animation is playing
var dt = 1e3/60; // in milliseconds

// To set animation duration based on window width
function setDuration() {
  dur = 8e3; // in milliseconds

  // Decrease duration if screen is small
  if (window.innerWidth < 768) {
    dur = 0.5*dur;
  } else if (window.innerWidth < 1024) {
    dur = 0.75*dur;
  }
  
  return dur
}

// Set duration
var duration = setDuration();

// To start animation
var intervals = null;
function startAnimation() {
  intervals = [];
  duration = setDuration();
  
  // Show all planes
  for (i = 1; i <= 11; i++) {
    document.getElementById('plane' + i).style.display = 'block';
  }

  /* animateFlight_1();
  intervals.push(setInterval(animateFlight_1, duration)); */ // PLANE 1 SWIRL DEFINED BY CSS ANIMATION (KEYFRAMES)
  
  setTimeout(() => {animateFlight_2();
    intervals.push(setInterval(animateFlight_2, duration)); }, duration*1/11);
  
  setTimeout(() => {animateFlight_3();
    intervals.push(setInterval(animateFlight_3, duration)); }, duration*2/11);
    
  setTimeout(() => {animateFlight_4();
    intervals.push(setInterval(animateFlight_4, duration)); }, duration*3/11);
    
  setTimeout(() => {animateFlight_5();
    intervals.push(setInterval(animateFlight_5, duration)); }, duration*4/11);
    
  setTimeout(() => {animateFlight_6();
    intervals.push(setInterval(animateFlight_6, duration)); }, duration*5/11);
    
  setTimeout(() => {animateFlight_7();
    intervals.push(setInterval(animateFlight_7, duration)); }, duration*6/11);
    
  setTimeout(() => {animateFlight_8();
    intervals.push(setInterval(animateFlight_8, duration)); }, duration*7/11);
    
  setTimeout(() => {animateFlight_9();
    intervals.push(setInterval(animateFlight_9, duration)); }, duration*8/11);
    
  setTimeout(() => {animateFlight_10();
    intervals.push(setInterval(animateFlight_10, duration)); }, duration*9/11);
    
  /* setTimeout(() => {animateFlight_11();
    intervals.push(setInterval(animateFlight_11, duration)); }, duration*10/11); */ // PLANE 11 SWIRL DEFINED BY CSS ANIMATION (KEYFRAMES)
}

// To stop animation
function stopAnimation() {
  // Hide all planes immediately upon window resize
  for (i = 1; i <= 11; i++) {
    document.getElementById('plane' + i).style.display = 'none';
  }
  
  // Clear all intervals
  for (i = 0; i < intervals.length; i++) {
    clearInterval(intervals[i]);
  }
  intervals = [];
}

// To stop and restart animation
var doit = null;
function resetAnimation() {
  // Clear the "do it" time-out
  clearTimeout(doit);
  
  // Stop animation immediately upon window resize
  stopAnimation();
  
  // Only restart animation if window hasn't been resized in time > duration
  doit = setTimeout(startAnimation, duration);
}

// Callback function when window is resized
window.onresize = resetAnimation;

// Callback function when window/tab visibility changes
document.onvisibilitychange = resetAnimation;

// Start animation
startAnimation();

// To generate example parabolic path (not used in current code)
function generatePath() {
  var flightPath = {x: [], y: [], angle: []}
  for (i = -30; i <= duration/dt; i++) {
    // Push new coordinates (note that left will move from -30% to 130%, so total x-distance
	// traversed is 160%
    flightPath.x.push(i*dt/duration*160); // left coordinate (as percentage)
	flightPath.y.push(100 - (50 - 0.01*(flightPath.x[flightPath.x.length - 1] - 50)**2)); // top coordinate (as percentage)
  }
  
  // Compute tangent angle at each point (a baseline rotation of 30 deg is added to make the plane point horizontally)
  flightPath.angle.push(30 + Math.atan2(
    flightPath.y[1] - flightPath.y[0], 
    flightPath.x[1] - flightPath.x[0])*180/Math.PI); // in degrees
  for (i = 1; i < flightPath.x.length - 1; i++) {
    flightPath.angle.push(30 + Math.atan2(flightPath.y[i + 1] - flightPath.y[i - 1], 
    flightPath.x[i + 1] - flightPath.x[i - 1])*180/Math.PI); // in degrees
  }
  flightPath.angle.push(30 + Math.atan2(
    flightPath.y[flightPath.x.length - 1] - flightPath.y[flightPath.x.length - 2], 
    flightPath.x[flightPath.x.length - 1] - flightPath.x[flightPath.x.length - 2])*180/Math.PI); // in degrees
  
  return flightPath
}

// To generate n standard normal samples using the Box-Muller transform
function randomStandardNormalVector(n) {
  var z = [];
  var u1 = null; // First random uniform number
  var u2 = null; // First random uniform number
  var R = null; // Polar magnitude
  
  // Add standard normal variates to z, 2 at a time
  for (i = 0; i < n/2; i++) {
    u1 = Math.random();
	u2 = Math.random();
	R = Math.sqrt(-2*Math.log(u1));
	z.push(R*Math.cos(2*Math.PI*u2), R*Math.sin(2*Math.PI*u2))
  }
  return z.slice(0, n)
}

// To interpolate data vector array with fitCount number of points (found code on web)
function interpolateArray(data, fitCount) {
  var linearInterpolate = function (before, after, atPoint) {
      return before + (after - before) * atPoint;
  };

  var newData = new Array();
  var springFactor = new Number((data.length - 1) / (fitCount - 1));
  newData[0] = data[0]; // for new allocation
  for ( var i = 1; i < fitCount - 1; i++) {
    var tmp = i * springFactor;
    var before = new Number(Math.floor(tmp)).toFixed();
    var after = new Number(Math.ceil(tmp)).toFixed();
    var atPoint = tmp - before;
    newData[i] = linearInterpolate(data[before], data[after], atPoint);
  }
  newData[fitCount - 1] = data[data.length - 1]; // for new allocation
  return newData;
};

// To generate random flight path (random Gaussian process with linear basis function)
function generateRandomPath() {
  // Scaling matrix (as fraction)
  const A = [[0.11498,0.10462,0.09444,0.084464,0.074707,0.06519,0.055929,0.046943,0.038248,0.029861,0.021796,0.014068,0.0066893,-0.00032658,-0.0069688,-0.013227,-0.019093,-0.024557,-0.029614,-0.034258,-0.038484,-0.042289,-0.045672,-0.048632,-0.05117,-0.053288,-0.054989,-0.056278,-0.05716,-0.057644,-0.057736,-0.057448,-0.056789,-0.055772,-0.05441,-0.052716,-0.050707,-0.048399,-0.045808,-0.042953,-0.039852,-0.036526,-0.032995,-0.02928,-0.025403,-0.021385,-0.01725,-0.013021,-0.00872,-0.0043719,1.1128e-16,0.0043719,0.00872,0.013021,0.01725,0.021385,0.025403,0.02928,0.032995,0.036526,0.039852,0.042953,0.045808,0.048399,0.050707,0.052716,0.05441,0.055772,0.056789,0.057448,0.057736,0.057644,0.05716,0.056278,0.054989,0.053288,0.05117,0.048632,0.045672,0.042289,0.038484,0.034258,0.029614,0.024557,0.019093,0.013227,0.0069688,0.00032658,-0.0066893,-0.014068,-0.021796,-0.029861,-0.038248,-0.046943,-0.055929,-0.06519,-0.074707,-0.084464,-0.09444,-0.10462,-0.11498],
             [0.3249,0.31254,0.29992,0.28706,0.27398,0.26069,0.24722,0.23358,0.21981,0.20591,0.19192,0.17785,0.16373,0.14958,0.13542,0.12129,0.1072,0.093171,0.079238,0.065422,0.051747,0.038236,0.024915,0.011808,-0.0010622,-0.013672,-0.025997,-0.038015,-0.049705,-0.061043,-0.072009,-0.082583,-0.092743,-0.10247,-0.11175,-0.12056,-0.12888,-0.1367,-0.14401,-0.15078,-0.15701,-0.16269,-0.16779,-0.17232,-0.17627,-0.17962,-0.18237,-0.18451,-0.18605,-0.18697,-0.18728,-0.18697,-0.18605,-0.18451,-0.18237,-0.17962,-0.17627,-0.17232,-0.16779,-0.16269,-0.15701,-0.15078,-0.14401,-0.1367,-0.12888,-0.12056,-0.11175,-0.10247,-0.092743,-0.082583,-0.072009,-0.061043,-0.049705,-0.038015,-0.025997,-0.013672,-0.0010622,0.011808,0.024915,0.038236,0.051747,0.065422,0.079238,0.093171,0.1072,0.12129,0.13542,0.14958,0.16373,0.17785,0.19192,0.20591,0.21981,0.23358,0.24722,0.26069,0.27398,0.28706,0.29992,0.31254,0.3249],
             [0.64734,0.64481,0.6418,0.63832,0.63436,0.62992,0.625,0.61958,0.61368,0.60729,0.60041,0.59304,0.58519,0.57684,0.56802,0.55871,0.54892,0.53867,0.52794,0.51676,0.50511,0.49302,0.48049,0.46753,0.45414,0.44034,0.42613,0.41153,0.39655,0.3812,0.3655,0.34945,0.33307,0.31637,0.29937,0.28209,0.26454,0.24673,0.22869,0.21042,0.19195,0.17329,0.15447,0.13549,0.11638,0.09716,0.077843,0.058449,0.038998,0.019509,1.481e-16,-0.019509,-0.038998,-0.058449,-0.077843,-0.09716,-0.11638,-0.13549,-0.15447,-0.17329,-0.19195,-0.21042,-0.22869,-0.24673,-0.26454,-0.28209,-0.29937,-0.31637,-0.33307,-0.34945,-0.3655,-0.3812,-0.39655,-0.41153,-0.42613,-0.44034,-0.45414,-0.46753,-0.48049,-0.49302,-0.50511,-0.51676,-0.52794,-0.53867,-0.54892,-0.55871,-0.56802,-0.57684,-0.58519,-0.59304,-0.60041,-0.60729,-0.61368,-0.61958,-0.625,-0.62992,-0.63436,-0.63832,-0.6418,-0.64481,-0.64734],
             [0.679,0.68907,0.69907,0.709,0.71886,0.72863,0.73831,0.74789,0.75737,0.76674,0.77598,0.78511,0.7941,0.80295,0.81166,0.82021,0.82861,0.83684,0.84491,0.85279,0.8605,0.86801,0.87533,0.88245,0.88936,0.89606,0.90254,0.9088,0.91484,0.92064,0.9262,0.93152,0.9366,0.94143,0.946,0.95032,0.95437,0.95816,0.96168,0.96493,0.96791,0.97061,0.97303,0.97517,0.97703,0.97861,0.9799,0.98091,0.98163,0.98206,0.9822,0.98206,0.98163,0.98091,0.9799,0.97861,0.97703,0.97517,0.97303,0.97061,0.96791,0.96493,0.96168,0.95816,0.95437,0.95032,0.946,0.94143,0.9366,0.93152,0.9262,0.92064,0.91484,0.9088,0.90254,0.89606,0.88936,0.88245,0.87533,0.86801,0.8605,0.85279,0.84491,0.83684,0.82861,0.82021,0.81166,0.80295,0.7941,0.78511,0.77598,0.76674,0.75737,0.74789,0.73831,0.72863,0.71886,0.709,0.69907,0.68907,0.679]];
  
  var flightPath = {x: [], y: [], angle: []}
  const z = randomStandardNormalVector(A.length);
  
  // X coordinate vector
  for (i = -30; i <= duration/dt; i++) {
    // Push new coordinates (note that left will move from -30% to 130%, so total x-distance
	// traversed is 160%
    flightPath.x.push(i*dt/duration*160); // left coordinate (as percentage)
	flightPath.y.push(100 - (50 - 0.01*(flightPath.x[flightPath.x.length - 1] - 50)**2)); // top coordinate (as percentage)
  }
  
  // Inner product: [y (size: 101)] = [z (size: 4)]*[A (size: 4 x 101)]
  var y = [];
  const mu = 100*Math.random(); // Random mean y value (at x=0), between 0 and 100% of container height
  for (i = 0; i < A[0].length; i++) {
    y.push(mu); // Mean y value (as percentage)
    for (j = 0; j < z.length; j++) {
	  y[y.length - 1] += z[j]*A[j][i]*40; // Standard deviation = 40% of container height
	}
  }
  
  // Interpolate y with the correct number of points (dependent on duration and dt)
  flightPath.y = interpolateArray(y, flightPath.x.length)
  
  // Add upward-trending baseline so that flight paths mostly go upward
  for (i = 0; i < flightPath.x.length; i++) {
    flightPath.y[i] -= 0.25*flightPath.x[i]; // Subtract (since origin is top-left) linear function of x from y values
  }
  
  // Compute tangent angle at each point (a baseline rotation of 30 deg is added to make the plane point horizontally)
  flightPath.angle.push(30 + Math.atan2(
    flightPath.y[1] - flightPath.y[0], 
    flightPath.x[1] - flightPath.x[0])*180/Math.PI); // in degrees
  for (i = 1; i < flightPath.x.length - 1; i++) {
    flightPath.angle.push(30 + Math.atan2(flightPath.y[i + 1] - flightPath.y[i - 1], 
    flightPath.x[i + 1] - flightPath.x[i - 1])*180/Math.PI); // in degrees
  }
  flightPath.angle.push(30 + Math.atan2(
    flightPath.y[flightPath.x.length - 1] - flightPath.y[flightPath.x.length - 2], 
    flightPath.x[flightPath.x.length - 1] - flightPath.x[flightPath.x.length - 2])*180/Math.PI); // in degrees
	
  return flightPath
}

// ANIMATION FUNCTIONS FOR EVERY PLANE
function animateFlight_1() {
  var elem = document.getElementById('plane1');   
  var flightPath = generateRandomPath();
  
  updatePosition();
  const id = setInterval(updatePosition, dt);
  
  function updatePosition() {
    if (flightPath.x.length > 0) {
	  // Update element coordinates and angle
      elem.style.left = flightPath.x[0] + '%'; 
      elem.style.top = flightPath.y[0] + '%';
	  elem.style.transform = 'rotate(' + flightPath.angle[0] + 'deg)';
	  
	  // Remove added coordinates and angle from flightPath
	  flightPath.x.splice(0, 1);
	  flightPath.y.splice(0, 1);
	  flightPath.angle.splice(0, 1);
    } else {
	  clearInterval(id);
	}
  }
}

function animateFlight_2() {
  var elem = document.getElementById('plane2');   
  var flightPath = generateRandomPath();
  
  updatePosition();
  const id = setInterval(updatePosition, dt);
  
  function updatePosition() {
    if (flightPath.x.length > 0) {
	  // Update element coordinates and angle
      elem.style.left = flightPath.x[0] + '%'; 
      elem.style.top = flightPath.y[0] + '%';
	  elem.style.transform = 'rotate(' + flightPath.angle[0] + 'deg)';
	  
	  // Remove added coordinates and angle from flightPath
	  flightPath.x.splice(0, 1);
	  flightPath.y.splice(0, 1);
	  flightPath.angle.splice(0, 1);
    } else {
	  clearInterval(id);
	}
  }
}

function animateFlight_3() {
  var elem = document.getElementById('plane3');   
  var flightPath = generateRandomPath();
  
  updatePosition();
  const id = setInterval(updatePosition, dt);
  
  function updatePosition() {
    if (flightPath.x.length > 0) {
	  // Update element coordinates and angle
      elem.style.left = flightPath.x[0] + '%'; 
      elem.style.top = flightPath.y[0] + '%';
	  elem.style.transform = 'rotate(' + flightPath.angle[0] + 'deg)';
	  
	  // Remove added coordinates and angle from flightPath
	  flightPath.x.splice(0, 1);
	  flightPath.y.splice(0, 1);
	  flightPath.angle.splice(0, 1);
    } else {
	  clearInterval(id);
	}
  }
}

function animateFlight_4() {
  var elem = document.getElementById('plane4');   
  var flightPath = generateRandomPath();
  
  updatePosition();
  const id = setInterval(updatePosition, dt);
  
  function updatePosition() {
    if (flightPath.x.length > 0) {
	  // Update element coordinates and angle
      elem.style.left = flightPath.x[0] + '%'; 
      elem.style.top = flightPath.y[0] + '%';
	  elem.style.transform = 'rotate(' + flightPath.angle[0] + 'deg)';
	  
	  // Remove added coordinates and angle from flightPath
	  flightPath.x.splice(0, 1);
	  flightPath.y.splice(0, 1);
	  flightPath.angle.splice(0, 1);
    } else {
	  clearInterval(id);
	}
  }
}

function animateFlight_5() {
  var elem = document.getElementById('plane5');   
  var flightPath = generateRandomPath();
  
  updatePosition();
  const id = setInterval(updatePosition, dt);
  
  function updatePosition() {
    if (flightPath.x.length > 0) {
	  // Update element coordinates and angle
      elem.style.left = flightPath.x[0] + '%'; 
      elem.style.top = flightPath.y[0] + '%';
	  elem.style.transform = 'rotate(' + flightPath.angle[0] + 'deg)';
	  
	  // Remove added coordinates and angle from flightPath
	  flightPath.x.splice(0, 1);
	  flightPath.y.splice(0, 1);
	  flightPath.angle.splice(0, 1);
    } else {
	  clearInterval(id);
	}
  }
}

function animateFlight_6() {
  var elem = document.getElementById('plane6');   
  var flightPath = generateRandomPath();
  
  updatePosition();
  const id = setInterval(updatePosition, dt);
  
  function updatePosition() {
    if (flightPath.x.length > 0) {
	  // Update element coordinates and angle
      elem.style.left = flightPath.x[0] + '%'; 
      elem.style.top = flightPath.y[0] + '%';
	  elem.style.transform = 'rotate(' + flightPath.angle[0] + 'deg)';
	  
	  // Remove added coordinates and angle from flightPath
	  flightPath.x.splice(0, 1);
	  flightPath.y.splice(0, 1);
	  flightPath.angle.splice(0, 1);
    } else {
	  clearInterval(id);
	}
  }
}

function animateFlight_7() {
  var elem = document.getElementById('plane7');   
  var flightPath = generateRandomPath();
  
  updatePosition();
  const id = setInterval(updatePosition, dt);
  
  function updatePosition() {
    if (flightPath.x.length > 0) {
	  // Update element coordinates and angle
      elem.style.left = flightPath.x[0] + '%'; 
      elem.style.top = flightPath.y[0] + '%';
	  elem.style.transform = 'rotate(' + flightPath.angle[0] + 'deg)';
	  
	  // Remove added coordinates and angle from flightPath
	  flightPath.x.splice(0, 1);
	  flightPath.y.splice(0, 1);
	  flightPath.angle.splice(0, 1);
    } else {
	  clearInterval(id);
	}
  }
}

function animateFlight_8() {
  var elem = document.getElementById('plane8');   
  var flightPath = generateRandomPath();
  
  updatePosition();
  const id = setInterval(updatePosition, dt);
  
  function updatePosition() {
    if (flightPath.x.length > 0) {
	  // Update element coordinates and angle
      elem.style.left = flightPath.x[0] + '%'; 
      elem.style.top = flightPath.y[0] + '%';
	  elem.style.transform = 'rotate(' + flightPath.angle[0] + 'deg)';
	  
	  // Remove added coordinates and angle from flightPath
	  flightPath.x.splice(0, 1);
	  flightPath.y.splice(0, 1);
	  flightPath.angle.splice(0, 1);
    } else {
	  clearInterval(id);
	}
  }
}

function animateFlight_9() {
  var elem = document.getElementById('plane9');   
  var flightPath = generateRandomPath();
  
  updatePosition();
  const id = setInterval(updatePosition, dt);
  
  function updatePosition() {
    if (flightPath.x.length > 0) {
	  // Update element coordinates and angle
      elem.style.left = flightPath.x[0] + '%'; 
      elem.style.top = flightPath.y[0] + '%';
	  elem.style.transform = 'rotate(' + flightPath.angle[0] + 'deg)';
	  
	  // Remove added coordinates and angle from flightPath
	  flightPath.x.splice(0, 1);
	  flightPath.y.splice(0, 1);
	  flightPath.angle.splice(0, 1);
    } else {
	  clearInterval(id);
	}
  }
}

function animateFlight_10() {
  var elem = document.getElementById('plane10');   
  var flightPath = generateRandomPath();
  
  updatePosition();
  const id = setInterval(updatePosition, dt);
  
  function updatePosition() {
    if (flightPath.x.length > 0) {
	  // Update element coordinates and angle
      elem.style.left = flightPath.x[0] + '%'; 
      elem.style.top = flightPath.y[0] + '%';
	  elem.style.transform = 'rotate(' + flightPath.angle[0] + 'deg)';
	  
	  // Remove added coordinates and angle from flightPath
	  flightPath.x.splice(0, 1);
	  flightPath.y.splice(0, 1);
	  flightPath.angle.splice(0, 1);
    } else {
	  clearInterval(id);
	}
  }
}

function animateFlight_11() {
  var elem = document.getElementById('plane11');   
  var flightPath = generateRandomPath();
  
  updatePosition();
  const id = setInterval(updatePosition, dt);
  
  function updatePosition() {
    if (flightPath.x.length > 0) {
	  // Update element coordinates and angle
      elem.style.left = flightPath.x[0] + '%'; 
      elem.style.top = flightPath.y[0] + '%';
	  elem.style.transform = 'rotate(' + flightPath.angle[0] + 'deg)';
	  
	  // Remove added coordinates and angle from flightPath
	  flightPath.x.splice(0, 1);
	  flightPath.y.splice(0, 1);
	  flightPath.angle.splice(0, 1);
    } else {
	  clearInterval(id);
	}
  }
}