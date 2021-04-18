class Boid{
  constructor(){
    this.x = randomRange(0, canvas.width);
    this.y = randomRange(0, canvas.height);
    this.angle = 2*Math.random()*Math.PI;
    this.facing = this.angle;
    this.va = 0;
    this.facingva = 0;
    this.speed = randomRange(3, 12);
    this.size = randomRange(7, 9);
    // this.r = randomRange(160, 240);
    // this.g = randomRange(160, 240);
    // this.b = randomRange(160, 240);
    this.r = randomRange(40,60);
    this.g = randomRange(40,60);
    this.b = randomRange(40,60);
    this.pressure = 0.8;
    this.species = randomRange(0,2);
    //this.color = 'rgba('+randomRange(140, 240)+', '+randomRange(140, 240)+', '+randomRange(140, 240)+', '+1+')';
  }
  calc(index){
    var xspeed = 0;
    var yspeed = 0;

    var avoidx = 0;
    var avoidy = 0;
    this.pressure = 0.8;
    for(var i = 0; i < boids.length; i++){ // BOID DISTANCE CHECKING
      if(index != i){
        var boidist = dist(this, boids[i].x, boids[i].y);
        var boiddit = Math.sqrt(Math.pow(boidist[0], 2)+Math.pow(boidist[1], 2)); // distance to boid
        var repel = 0;
        if(speciesrepel){
          var rightspecies = this.species==boids[i].species;
        } else {
          var rightspecies = true;
        }
        if(boiddit < 31){
          repel = (-4)*boiddit+178+bump/friction;
          this.pressure = this.pressure + boiddit*0.002;
        } else if(boiddit > 200 && rightspecies){
          repel = 0;
          if(220<=boiddit && boiddit<=228){
            if(rightspecies){
              repel = -(boiddit-220)*(boiddit-230)*repelbump; // DAMN
            } else{
              repel = -(boiddit-220)*(boiddit-230)*1; // DAMN
            }
          }
        } else {
          if(boiddit < 80){
            this.pressure = this.pressure + boiddit*0.0003;
          }
          if(rightspecies){
            repel = (boiddit-50)*(boiddit-200)/(50*(boiddit-30));
          } else{
            if(boiddit<70){
              repel = -4*boiddit+280;
            } // MAIN EQUATION SORT OF
          }
        }


        avoidx = avoidx + repel*Math.sin(boidist[2]);
        avoidy = avoidy + repel*Math.cos(boidist[2]);

        //line(this.x, this.y, boiddit[2], boidist, 'pink');
        //console.log(boidist, boiddit, repel)
      }
    }

    avoidx = 0.01*avoidx + avoidx/boids.length;
    avoidy = 0.01*avoidy + avoidy/boids.length;

    var windx = 0;
    var windy = 0;
    var borderslope = borderwidth/borderstrength;
    if(borderwidth>=this.x){
      windx = -this.x/borderslope+borderstrength;
    } else if(this.x>=canvas.width-borderwidth) {
      windx = -(this.x-canvas.width)/borderslope-borderstrength;
    }

    if(borderwidth>=this.y){
      windy = -this.y/borderslope+borderstrength;
    } else if(this.y>=canvas.height-borderwidth) {
      windy = -(this.y-canvas.height)/borderslope-borderstrength;
    }


    var xccel = - avoidx + windx/25;
    var yccel = - avoidy + windy/25;

    if(-maxcell>xccel){
      xccel = -maxcell;
    } else if(xccel>maxcell){
      xccel = maxcell;
    }
    if(-maxcell>yccel){
      yccel = -maxcell;
    } else if(yccel>maxcell){
      yccel = maxcell;
    }

    xspeed = (this.speed * Math.sin(this.angle)+xccel)*friction;
    yspeed = (this.speed * Math.cos(this.angle)+yccel)*friction;


    var va = 0;
    if(yspeed >= 0){
      this.va = Math.atan(xspeed/yspeed) - this.angle;
    } else {
      this.va = Math.atan(xspeed/yspeed)+Math.PI - this.angle;
    }

    while(Math.abs(this.va)>Math.PI){
      this.va -= Math.sign(this.va)*2*Math.PI
    }

    var mom = dist(this, mouseX, mouseY);

    var facecursor = mom[2]-this.angle;
    if(facecursor > Math.PI){
      while(facecursor > Math.PI){
        facecursor += -2*Math.PI;
      }
    } else if(facecursor < -Math.PI){
      while(facecursor < Math.PI){
        facecursor += 2*Math.PI;
      }
    }

    this.angle += this.va;
    if(mousein){
      this.angle += (facecursor)*mouseinfluence;
    }
    this.speed = Math.sqrt(Math.pow(xspeed, 2)+Math.pow(yspeed, 2));

    //console.log(xspeed, yspeed);
    var maxvx = maxspeed*Math.sin(this.angle)+1;
    var maxvy = maxspeed*Math.cos(this.angle)+1;
    //console.log(xspeed,yspeed,maxvx,maxvy,this.angle)
    if(maxvx<xspeed&&xspeed>0){
      xspeed = maxvx;
    } else if(0>xspeed&&xspeed<maxvx){
      xspeed = maxvx;
    }
    if(maxvy<yspeed&&yspeed>0){
      yspeed = maxvy;
    } else if(0>yspeed&&yspeed<maxvy){
      yspeed = maxvy;
    }

    this.x = this.x + xspeed + constantspeed*Math.sin(this.angle); /* + (1 + pressure*1.2)*Math.sin(this.angle); */
    this.y = this.y + yspeed + constantspeed*Math.cos(this.angle); /* + (1 + pressure*1.2)*Math.cos(this.angle); */

    this.facingva = this.angle - this.facing;
    if(this.facingva>maxturn && this.facingva>0){
      this.facingva = maxturn;
    } else if(this.facingva<-maxturn && this.facingva<0){
      this.facingva = -maxturn;
    }
    this.facing = this.facing+this.facingva;

  }
  draw(){
    this.size = Math.sqrt(this.speed+1.2)*1.8/this.pressure+1.5;
    ctx.lineWidth = this.size;
    ctx.lineJoin = 'round';
    if(speciescolors){
      switch(this.species){
        case 0:
          var red = this.r * Math.sin(this.facing) + 195 + colordiff;
          var blue = this.b * Math.sin(this.facing+Math.PI) + 195 + colordiff;
          var green = this.g*2.5;
          break;
        case 1:
          var blue = this.b * Math.sin(this.facing) + 195 + colordiff;
          var green = this.g * Math.sin(this.facing+Math.PI) + 195 + colordiff;
          var red = this.g*2.5;
          break;
        case 2:
          var green = this.g * Math.sin(this.facing) + 195 + colordiff;
          var red = this.r * Math.sin(this.facing+Math.PI) + 195 + colordiff;
          var blue = this.g*2.5;
          break;
      }
    } else{
      var red = this.r * 1.3 * Math.sin(this.facing) + 180;
      var green = this.g * 1.3 * Math.sin(this.facing+2*Math.PI/3) + 180;
      var blue = this.b * 1.3 * Math.sin(this.facing+4*Math.PI/3) + 180;
    }
    if(-20<this.x<canvas.width+20 && -20<this.y<canvas.height+20){
      var lighten = 0;
      if(highlights){
        lighten = 6*(Math.pow(1.7,this.pressure*10-9)-1);
      }
      if(auras){
      ctx.fillStyle = 'rgba('+red+', '+green+', '+blue+', '+(0.03+(this.speed)/140)+')';
      ctx.beginPath();
        ctx.arc(this.x, this.y, 3*this.size, 0, 2 * Math.PI);
        ctx.fill();
      }

      var color = 'rgba('+(red+lighten)+', '+(green+lighten)+', '+(blue+lighten)+', '+1+')';
      ctx.strokeStyle = color;
      var displayspecies;
      if(speciesrepel==true){
        displayspecies = this.species;
      } else{
        displayspecies = 1;
      }
      switch(displayspecies){ //4 seperate boid shapes
        case 0: //round heart
          ctx.lineWidth = this.size;
          ctx.lineJoin = 'round';
          ctx.beginPath();
          ctx.moveTo(this.x, this.y);
          ctx.lineTo(this.x+this.size*Math.sin(this.facing+1.35*Math.PI), this.y+this.size*Math.cos(this.facing+1.35*Math.PI));
          ctx.lineTo(this.x+this.size*1.3*Math.sin(this.facing), this.y+this.size*1.3*Math.cos(this.facing));
          ctx.lineTo(this.x+this.size*Math.sin(this.facing+0.65*Math.PI), this.y+this.size*Math.cos(this.facing+0.65*Math.PI));
          ctx.lineTo(this.x, this.y);
          break;
        case 1: //avocado
          var tangent = 1.2
          ctx.fillStyle = color
          this.size += 0.5;
          ctx.lineWidth = this.size*0.6;
          ctx.lineJoin = 'round';
          ctx.beginPath();
          ctx.arc(this.x, this.y, 0.8*this.size, 0, 2*Math.PI);
          ctx.fillStyle = 'black'
          ctx.fill();
          ctx.moveTo(this.x-this.size*0.8*Math.sin(this.facing+tangent), this.y-this.size*0.8*Math.cos(this.facing+tangent));
          ctx.lineTo(this.x-this.size*2*Math.sin(this.facing), this.y-this.size*2*Math.cos(this.facing));
          ctx.lineTo(this.x-this.size*0.8*Math.sin(this.facing-tangent), this.y-this.size*0.8*Math.cos(this.facing-tangent));
          ctx.moveTo(this.x, this.y);
          break;
        // case 2: //sharp heart
        //   this.size += 1;
        //   ctx.lineWidth = this.size/5;
        //   ctx.lineJoin = 'miter';
        //   ctx.beginPath();
        //   ctx.moveTo(this.x, this.y);
        //   ctx.lineTo(this.x+this.size*Math.sin(this.facing+1.35*Math.PI), this.y+this.size*Math.cos(this.facing+1.35*Math.PI));
        //   ctx.lineTo(this.x+this.size*1.3*Math.sin(this.facing), this.y+this.size*1.3*Math.cos(this.facing));
        //   ctx.lineTo(this.x+this.size*Math.sin(this.facing+0.65*Math.PI), this.y+this.size*Math.cos(this.facing+0.65*Math.PI));
        //   ctx.lineTo(this.x, this.y);
        //   break;
//        case 2: //stroke circle
//          this.size += 1;
          // ctx.lineWidth = this.size/5;
          // ctx.lineJoin = 'miter';
          // ctx.beginPath();
          // ctx.arc(this.x, this.y, this.size, 0, 2*Math.PI);
          // break;
        case 2: //wings
          this.size += 1;
          ctx.lineWidth = this.size/5;
          ctx.lineJoin = 'miter';
          ctx.beginPath();
          line(this.x, this.y, this.facing, this.size, color, ctx.lineWidth);
          ctx.arc(this.x, this.y, this.size, -this.facing-0.5, -this.facing+0.5+Math.PI);
          break;

      }
      ctx.closePath();
      ctx.stroke();
      //line(this.x, this.y, distance[2], Math.sqrt(Math.pow(distance[0], 2)+Math.pow(distance[1], 2))/6, 'green');
      //line(this.x, this.y, Math.PI/2, distance[0]/6, 'yellow');
      //line(this.x, this.y, Math.PI, -distance[1]/6, 'yellow');
    }
  }
}
