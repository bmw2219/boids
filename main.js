canvascolor = "rgba(19, 23, 26, 0.3)";

var canvas = document.getElementById('screen');
var ctx = canvas.getContext('2d');

var boids = [];
var mouseX = 0;
var mouseY = 0;
var pause = false;
var overlay = false;
var mousein = false;
var clicking = false;
var boidframes = 0;
// CUSTOMIZABLES!!!
var speciesrepel = true; //enable racis--
var trailstrength = 3; // number of frames
canvascolor = "rgba(19, 23, 26, "+(1/trailstrength)+")";
var constantspeed = 1; // a constant speed added to the boid. 0-100, default 1
var speciescolors = true; //if false, shows original color scheme
var colordiff = 30; //0 to 60, default 30 makes species colors more distinguished from eachother
var highlights = true;
var auras = false;
var friction = 0.93; // 0.1 to 1.1, and 0.70 to 0.99, default 0.93
var maxspeed = 20; // 1-50 default 20
var bump = 40; // bigger = less clumped (highlighted) boids
var mouseinfluence = 0.00; // max: 1 min: 0 default: 0.01
var scrollnumber = 5; //min: 1 max: 10 default: 5
var repelbump = 0.05; //encourages smaller groups of boids. 0 - 1, default 0.05
var maxcell = 4; // 0.1 to 10, default.... 4????
var maxturn	= 0.2;
var borderwidth = 125; //0 to 300 or so, default 125
var borderstrength = 30; //0 to 200, default 30
var spotlight = 20;
// Formatting for sliders: ["slider", value, text, min, max, updateFunc, checkUpdateFunc, roundAmt]
// Formatting for text: ["text", text, size]
// Formatting for switch: ["switch", value, name, checkUpdateFunc, updateFunc]
var mainMenuElements = [
["text", "Boids", 1.5],
["slider", 0, "Boid Amount", 0, 250, boidAmtAdjuster, getBoidAmt, 0],
["switch", speciesrepel, "Species Seperation", getSpeciesRepel, setSpeciesRepel],
["switch", speciescolors, "Unique Species Colors", getSpeciesColors, setSpeciesColors],
["switch", auras, "Aura", getAuras, setAuras],
["switch", highlights, "Whitening Pressure Points", getHighlights, setHighlights],
["slider", 40, "Wave Intensity", 0, 1000, updateWaveIntensity, getWaveIntensity, 0],
["slider", 1, "Mouse Influence", 0, 100, updateMouseInfluence, getMouseInfluence, 0],
["slider", 93, "Friction", 10, 110, updateFriction, getFriction, 0],
["slider", 3, "trailstrength", 1, 16, updateTrailsStrength, getTrailStrength, 0]
];

// ui update and getupdate functions
function updateMouseInfluence(amt){mouseinfluence=amt/100;}
function getMouseInfluence(){return mouseinfluence*100;}
function updateWaveIntensity(amt){bump=amt;}
function getWaveIntensity(){return bump;}
function getAuras(){return auras;}
function setAuras(setTo){auras = setTo;}
function getSpeciesColors(){return speciescolors;}
function setSpeciesColors(setTo){speciescolors = setTo;}
function getHighlights(){return highlights;}
function setHighlights(setTo){highlights = setTo;}
function getSpeciesRepel(){return speciesrepel;}
function setSpeciesRepel(setTo){speciesrepel = setTo;}
function updateFriction(amt){friction=amt/100;}
function getFriction(){return friction*100;}
function updateTrailsStrength(amt){trailstrength=amt;canvascolor = "rgba(19, 23, 26, "+(1/trailstrength)+")";}
function getTrailStrength(){return trailstrength;}

function dist(bo1d, x, y){
  xdist = x - bo1d.x;
  ydist = y - bo1d.y;
  if(ydist >= 0){
    originangle = Math.atan(xdist/ydist);
    //console.log("no pi")
  } else {
    originangle = Math.atan(xdist/ydist)+Math.PI;
    //console.log("+pi")
  }
  return [xdist, ydist, originangle];
}

function randomRange(low, high){
  var difference = high-low;
  var output = Math.random();
  output = Math.round(output*(difference+0.99)-0.5)+low;
  return output;
}

function line(x, y, angle, length, color){
    ctx.lineWidth = 3;
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + length*Math.sin(angle), y + length*Math.cos(angle));
    ctx.closePath();
    ctx.stroke();
}


function onMouseMove(event){

  mouseX = event.pageX;
  mouseY = event.pageY;
  Over.mouseMove(mouseX, mouseY)

}

function boidAmtAdjuster(amt){
  var currentAmt = boids.length;
  for(var i = 0; i < Math.abs(amt-boids.length); i++){
    if(amt > currentAmt){
      x = randomRange(0, canvas.width);
      y = randomRange(0, canvas.height);
      boid = new Boid();
      if(100>x){
        x = 100;
      } else if(x>canvas.width-100) {
        x = canvas.width-100;
      }
      if(100>y){
        y = 100;
      } else if(y>canvas.height-100) {
        y = canvas.height-100;
      }
      boid.x = x + randomRange(-50, 50);
      boid.y = y + randomRange(-50, 50);
      boids.push(boid);
    } else {
      boids.shift();
    }
  }
}
function getBoidAmt(amt){
  return boids.length;
}

function onClick(event){
  Over.clickEvent(event.clientX, event.clientY);
}

function onRelease(event){
  Over.releaseEvent();
}

function onMouseEnter(event){
  //console.log("mouse is in")
  mousein = true;

}

function onMouseLeave(event){
  //console.log("mouse is out")
  mousein = false;
}


canvas.addEventListener("wheel", scroll);
canvas.addEventListener('mousemove', onMouseMove);
canvas.addEventListener('mousedown', onClick);
canvas.addEventListener("mouseup", onRelease)
canvas.addEventListener('mouseenter', onMouseEnter);
canvas.addEventListener('mouseleave', onMouseLeave);
window.onresize = canvasResize;

document.addEventListener('keydown', (event) => {
  const keyName = event.key;

  if (keyName === 'Control') {
    // do not alert when only Control key is pressed.
    return;
    }
  if (event.ctrlKey) {
    // Even though event.key is not 'Control' (e.g., 'a' is pressed),
    // event.ctrlKey may be true if Ctrl key is pressed at the same time.
    return;
  } else {
    if((keyName == " " || keyName == "p") && boids.length>0){
      console.log("spacebar");
      pause = !pause;
    } else if(keyName == "Escape" || keyName == "m"){
      console.log("escape");
      if(overlay && Over.x > Over.width-4){
        Over.slide = 0;
        overlay = !overlay;
      } else if(overlay == false && Over.x < 4){
        Over.slide = 0;
        overlay = !overlay;
      }


    } else if(keyName == "Shift"){
      return;
    } else if(keyName == "ArrowUp"){
      Over.defaultHeight -= 10;
    } else if(keyName == "ArrowDown"){
      Over.defaultHeight += 10;
    } else {
      console.log(keyName);
    }

  }
}, false);

Over = new Overlay(mainMenuElements);

setInterval(function(){
  if(boids.length != 0){
    ctx.fillStyle = canvascolor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = canvas.width / 15 + "px Arial";
    ctx.fillStyle = '#7289DA';
    strboid = boids.length.toString();
    ctx.fillText(boids.length, canvas.width - canvas.width*strboid.length/27 - canvas.width/30, canvas.width / 15);
    if(mousein){

      var gradient = ctx.createRadialGradient(mouseX,mouseY,spotlight, mouseX,mouseY,spotlight+30);

      gradient.addColorStop(0, "rgba(87, 99, 108, 0.2)");
      gradient.addColorStop(1, "rgba(0, 0, 0, 0.0)");//canvascolor); //"rgba(19, 23, 26, 0.3)";
      //gradient.addColorStop(1, canvascolor);

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(mouseX, mouseY, spotlight+30, 0, 2 * Math.PI);
      ctx.fill();
      if(spotlight>20.1){
        spotlight-=2;
      }
    }
    if(!pause){
      for(var i = 0; i < boids.length; i++){
        boids[i].calc(i);
      }
    } else {
      ctx.font = canvas.width / 15 + "px Arial";
      ctx.fillStyle = '#7289DA';
      ctx.fillText("paused", 3*canvas.width/4, canvas.height-100);
    }
  } else {
    ctx.fillStyle = canvascolor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = canvas.width / 15 + "px Arial";
    ctx.fillStyle = '#7289DA';
    ctx.fillText("scroll for boids :D", 80, canvas.height-100);
    ctx.fillStyle = canvascolor;
  }

  for(var boid of boids){
    boid.draw();
  }
  if(overlay){
    Over.calc(-1);
    Over.scrollcalc();
    Over.draw();
  } else if (Over.x>2){
    Over.calc(1);
    Over.scrollcalc();
    Over.draw();
  }

}, 14);


function scroll(event){
  var x = mouseX;
  var y = mouseY;
  delta = event.deltaX + event.deltaY + event.deltaZ;
  if(x<Over.x){
      Over.scrollvelo=Math.sqrt(Math.abs(Math.sign(delta)*canvas.width*canvas.width/18000+Over.scrollvelo*Over.scrollvelo*Math.sign(Over.scrollvelo)))*Math.sign(delta);
      //console.log(Over.scrollvelo)
  } else{
    if(delta<=-1 && !pause){
    //console.log(mouseX, mouseY)
      for(var i = 0; i < scrollnumber; i++){
        boid = new Boid();
        if(spotlight<53){
            spotlight+=16/scrollnumber;
        }
        if(100>x){
          x = 100;
        } else if(x>canvas.width-100) {
          x = canvas.width-100;
        }
        if(100>y){
          y = 100;
        } else if(y>canvas.height-100) {
          y = canvas.height-100;
        }
        boid.x = x + Math.random()*100-50;
        boid.y = y + Math.random()*100-50;
        boids.push(boid);
        if(boids.length>250){
          boids.shift();
        }
      }
    } else if(delta>=1 && !pause){
      if(boids.length>0){
        for(var i = 0; i < scrollnumber; i++){
          boids.shift();
          if(boids.length==0){
            break;
          }
        }

      }
    }
  }
}


function canvasResize() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  ctx.fillStyle = '#13171A';
  //ctx.fillStyle = canvascolor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  if(boids.length == 0){
    ctx.font = canvas.width / 15 + "px Arial";
    ctx.fillStyle = '#7289DA';
    ctx.fillText("scroll for boids :D", 80, canvas.height-100);
  }
  Over.updateWidth(canvas.width);
  if(Over.x > Over.width){
    Over.x = Over.width;
  }
}
canvasResize();
