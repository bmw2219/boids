class Boid{
  constructor(){
    this.x = randomRange(0, canvas.width);
    this.y = randomRange(0, canvas.height);
    this.angle = 2*Math.random()*Math.PI;
    this.va = 0;
    this.speed = randomRange(3, 12);
    this.size = randomRange(7, 9);
    this.r = randomRange(160, 240);
    this.g = randomRange(160, 240);
    this.b = randomRange(160, 240);
    this.pressure = 0.8;
    //this.color = 'rgba('+randomRange(140, 240)+', '+randomRange(140, 240)+', '+randomRange(140, 240)+', '+1+')';
  }
  calc(index){
    var xspeed = 0;
    var yspeed = 0;

    var avoidx = 0;
    var avoidy = 0;
    this.pressure = 0.8;
    for(var i = 0; i < boids.length; i++){
      if(index != i){
        var boidist = dist(this, boids[i].x, boids[i].y);
        var boiddit = Math.sqrt(Math.pow(boidist[0], 2)+Math.pow(boidist[1], 2)); // distance to boid
        var repel;
        if(boiddit < 31){
          repel = (-4)*boiddit+178+bump;
          this.pressure = this.pressure + boiddit*0.002;
        } else if(boiddit > 200){
          repel = 0;
          if(220<=boiddit && boiddit<=228){
            //console.log(boiddit)
            repel = -(boiddit-220)*(boiddit-230)*repelbump; // DAMN
          }
        } else {
          if(boiddit < 80){
            this.pressure = this.pressure + boiddit*0.0003;
          }
          repel = (boiddit-50)*(boiddit-200)/(50*(boiddit-30));
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

    //console.log(xspeed, yspeed);

    if(-maxspeed>xspeed){
      xspeed = -maxspeed;
    } else if(xspeed>maxspeed){
      xspeed = maxspeed;
    }
    if(-maxspeed>yspeed){
      yspeed = -maxspeed;
    } else if(yspeed>maxspeed){
      yspeed = maxspeed;
    }

    /*
    var maxvx = maxspeed * Math.sin(this.angle)
    var maxvy = maxspeed * Math.cos(this.angle)
    if(-maxvx>xspeed){
      xspeed = -maxvx
    } else if(xspeed>maxvx){
      xspeed = maxvx
    }
    if(-maxvy>yspeed){
      yspeed = -maxvy
    } else if(yspeed>maxvy){
      yspeed = maxvy
    }
    */

    var va = 0;
    if(yspeed >= 0){
      //console.log("down")
      this.va = Math.atan(xspeed/yspeed) - this.angle;

    } else {
      this.va = Math.atan(xspeed/yspeed)+Math.PI - this.angle;
      //console.log("up")
    }

    /*
    if(this.va>maxturn){
      this.va = maxturn;
    } else if(this.va<-maxturn){
      this.va = -maxturn;
    }
    */
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

    this.angle = this.angle + this.va;
    if(mousein){
      this.angle += (facecursor)*mouseinfluence;
    }
    this.speed = Math.sqrt(Math.pow(xspeed, 2)+Math.pow(yspeed, 2));


    this.x = this.x + xspeed; /* + (1 + pressure*1.2)*Math.sin(this.angle); */
    this.y = this.y + yspeed; /* + (1 + pressure*1.2)*Math.cos(this.angle); */

  }
  draw(){
    this.size = Math.sqrt(this.speed+1.2)*1.8/this.pressure+1.5;

    var red = this.r * Math.sin(this.angle)/3 + 174;
    var green = this.g * Math.sin(this.angle+2*Math.PI/3)/3 + 174;
    var blue = this.b * Math.sin(this.angle+4*Math.PI/3)/3 + 174;

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

      ctx.lineWidth = this.size;
      ctx.strokeStyle = 'rgba('+(red+lighten)+', '+(green+lighten)+', '+(blue+lighten)+', '+1+')';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.x+this.size*Math.sin(this.angle+1.35*Math.PI), this.y+this.size*Math.cos(this.angle+1.35*Math.PI));
      ctx.lineTo(this.x+this.size*1.3*Math.sin(this.angle), this.y+this.size*1.3*Math.cos(this.angle));
      ctx.lineTo(this.x+this.size*Math.sin(this.angle+0.65*Math.PI), this.y+this.size*Math.cos(this.angle+0.65*Math.PI));
      ctx.lineTo(this.x, this.y);
      ctx.closePath();
      ctx.stroke();



      //line(this.x, this.y, distance[2], Math.sqrt(Math.pow(distance[0], 2)+Math.pow(distance[1], 2))/6, 'green');
      //line(this.x, this.y, Math.PI/2, distance[0]/6, 'yellow');
      //line(this.x, this.y, Math.PI, -distance[1]/6, 'yellow');
    }
  }
}