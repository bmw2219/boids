canvascolor = "rgba(19, 23, 26, 0.3)";

var canvas = document.getElementById('screen');
var ctx = canvas.getContext('2d');

var boids = [];
var mouseX = 0;
var mouseY = 0;
var pause = false;
var overlay = false;
var mousein = false;

// CUSTOMIZABLES!!!
const highlights = true;
const auras = true;
const friction = 0.93;
const maxspeed = 20;
const bump = 40; // bigger = less clumped (highlighted) boids
const mouseinfluence = 1/100;
const scrollnumber = 5;
const repelbump = 1/100;
const maxcell = 10;
const maxturn	= 0.5;
const borderwidth = 150;
const borderstrength = 30;

// Formatting for sliders: ["slider", value, text, min, max, updateFunc, checkUpdateFunc, roundAmt]
var mainMenuElements = [
["slider", 0, "Boids", 0, 250, boidAmtAdjuster, getBoidAmt, 0],
["slider", 0, "GAMING", 0, 1000, null, returnZero, 0],
["text", "lksjdfklsdjfslkjf"]
];

function returnZero(){return 0;}

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
  //if(100>mouseX){
  //	mouseX = 100
  //} else if(mouseX>canvas.width-100) {
  //	mouseX = canvas.width-100
  //}
  //if(100>mouseY){
  //	mouseY = 100
  //} else if(mouseY>canvas.height-100) {
  //	mouseY = canvas.height-100
  //}
}

function boidAmtAdjuster(amt){
  // adjust amount of boids based on amount in slider
}
function getBoidAmt(amt){
  return boids.length;
}

function onClick(event){
  // nothing for now
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
      Over.select--;
      if(Over.select==-1){
        Over.select = 3;
      }
    } else if(keyName == "ArrowDown"){
      Over.select++;
      if(Over.select==4){
        Over.select = 0;
      }
    } else if(keyName == "ArrowLeft"){
      sli(-1);
    } else if(keyName == "ArrowRight"){
      sli(1);
    } else {
      console.log(keyName);
    }

  }
}, false);

function sli(effect){
  switch(Over.select){
    case 0:  //boid species 1


      break;
    case 1:


      break;
    case 2:


      break;
    case 3:


      break;
  }
}


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
      ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.beginPath();
      ctx.arc(mouseX, mouseY, 50, 0, 2 * Math.PI);
      ctx.fill();
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
    boid.draw()
  }
  if(overlay){
    Over.calc(-1);
    Over.draw();
  } else if (Over.x>2){
    Over.calc(1);
    Over.draw();
  }

}, 14);


function scroll(event){
  var x = mouseX;
  var y = mouseY;
  delta = event.deltaX + event.deltaY + event.deltaZ;
  if(delta<=-1 && !pause){
  //console.log(mouseX, mouseY)
    for(var i = 0; i < scrollnumber; i++){
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
  Over.width = canvas.width/3;
  if(Over.x > Over.width){
    Over.x = Over.width;
  }
}
canvasResize();
