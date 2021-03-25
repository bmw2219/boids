class Overlay{
  constructor(){
    this.slide = 0;
    this.x = 0;
    this.width = canvas.width/3;
    this.select = 0;
  }
  calc(neg){
    if(this.x<this.width -1|| neg > 0){
      this.slide += 1
      this.x = this.width/(1+Math.pow(Math.E, (neg*180/this.width)*(this.slide-15))) //logistic sweepy curve
      console.log(this.slide, this.x)

    } else if (this.x>this.width-1){
      this.x = this.width;
    }

  }
  slider(y, upper, lower, value, text, index){
    if(index == this.select){
      ctx.fillStyle = canvascolor = "rgba(230, 230, 255, 0.05)";
      ctx.fillRect(this.x-49*this.width/50, y-115, 48*this.width/50, 200);
    }
    ctx.fillStyle = canvascolor = "rgba(19, 23, 26, 0.2)";
    ctx.fillRect(this.x-24*this.width/25, y-103, 23*this.width/25, 176);

    var diff = upper-lower;
    var point = (value/diff)*(3*this.width/4);
    ctx.lineWidth = canvas.height/100;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(this.x-7*this.width/8, y);
    ctx.lineTo(this.x-this.width/8, y)
    ctx.fillStyle = 'rgba(50, 50, 50, 0.5)';
    //ctx.moveTo(this.x-7*this.width/8+point, y);
    ctx.arc(this.x-7*this.width/8+point, y, canvas.height/50, 0, 2 * Math.PI);
      ctx.fill();
    ctx.closePath();
    ctx.stroke();

    ctx.font = canvas.width / 120 + "px Arial";
    ctx.fillStyle = 'rgba(200, 200, 255, 0.5)';
    ctx.fillText(Math.round(value, 2), this.x-7*this.width/8+point-10, y+50);

    ctx.font = canvas.width / 70 + "px Arial";
    ctx.fillStyle = 'rgba(200, 200, 255, 0.5)';
    ctx.fillText(text, this.x-7*this.width/8, y-50);

  }
  draw(){
    ctx.fillStyle = "rgba(114, 137, 218, 0.3)";
    ctx.fillRect(0, 0, this.x, canvas.height);

    ctx.font = canvas.width / 60 + "px Arial";
    ctx.fillStyle = 'rgba(200, 200, 255, 0.5)';
    ctx.fillText("Pause the boids with spacebar.", this.x-19*this.width/20, 55);
    ctx.fillText("Use arrow keys to navigate menu.", this.x-19*this.width/20, 55+canvas.width / 58);
    ctx.fillText("Gaming.", this.x-19*this.width/20, 55+canvas.width / 29);
    for(var i = 0; i < 4; i++){
      this.slider(280+200*i, slidata[i][0], slidata[i][1], slidata[i][2], slidata[i][3], i);

    }

  }
}
