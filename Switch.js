class Switch {
  constructor(name, value, container, checkUpdateFunc, updateFunc){
    this.name = name;
    this.value = value;
    this.locked = false;
    this.container = container;
    this.checkUpdateFunc = checkUpdateFunc;
    this.updateFunc = updateFunc;
    this.boundingBox = [0, 0, 0, 0];
    this.startX;
    this.startY;
    this.isBeingClicked = false;
    if(value){
      this.currentSwitchPos = 1;
      this.targetSwitchPos = 1;
    } else {
      this.currentSwitchPos = 0;
      this.targetSwitchPos = 0;
    }
    this.elementHeight = this.container.width/8;


  }
  clickEvent(x, y){

    let x1 = this.startX - this.container.width/32;
    let y1 = this.startY - this.container.width/32;
    let x2 = this.startX + 3*this.container.width/32;
    let y2 = this.startY + this.container.width/32;

    if(x1 < x && x < x2 && y1 < y && y < y2 && this.locked == false){
      this.value = !this.value;
      this.updateFunc(this.value);
      this.isBeingClicked = true;
    }
  }
  releaseEvent(){
  }
  mouseMove(x, y){
    let x1 = this.startX - this.container.width/32;
    let y1 = this.startY - this.container.width/32;
    let x2 = this.startX + 3*this.container.width/32;
    let y2 = this.startY + this.container.width/32;

    if(x1 < x && x < x2 && y1 < y && y < y2 && this.locked == false) {
      canvas.style.cursor = "pointer";
    } else if(this.boundingBox[0] < x && x < this.boundingBox[2] &&
              this.boundingBox[1] < y && y < this.boundingBox[3]){
      canvas.style.cursor = "default";
    }
  }
  draw(containerX, elementY){
    this.value = this.checkUpdateFunc();
    if(this.value){this.targetSwitchPos = 1;}
    else{this.targetSwitchPos = 0;}
    this.elementHeight = this.container.width/8;

    this.boundingBox = [containerX - this.container.width,
                        elementY,
                        containerX,
                        elementY+this.elementHeight];

    // calculate switch pos
    if(this.targetSwitchPos > this.currentSwitchPos){
      this.currentSwitchPos = (this.currentSwitchPos * 10 + 1)/10;
    } else if(this.targetSwitchPos < this.currentSwitchPos){
      this.currentSwitchPos = (this.currentSwitchPos * 10 - 1)/10;
    }


    if(this.locked) {
      ctx.fillStyle = 'rgba(50, 50, 50, 0.5)';
    } else if(this.value){
      ctx.fillStyle = 'rgba(0, 200, 0, 0.5)';
    } else if(this.value == false){
      ctx.fillStyle = 'rgba(200, 0, 0, 0.5)';
    }
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';

    var startX = containerX-24*this.container.width/25+this.container.width/32+ctx.lineWidth;
    var startY = elementY+this.container.width/16;
    this.startX = startX;
    this.startY = startY;

    //draw switch outline
    ctx.beginPath();
    ctx.arc(startX, startY, this.container.width/32, 0.5*Math.PI, 1.5*Math.PI);
    ctx.moveTo(startX, startY+this.container.width/32);
    ctx.arc(startX+this.container.width/16, startY, this.container.width/32, 0.5*Math.PI, 1.5*Math.PI, true);
    ctx.lineTo(startX, startY-this.container.width/32);
    ctx.fill();
    ctx.stroke();

    //draw switch thing
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.beginPath();
    ctx.arc(startX+this.currentSwitchPos*this.container.width/16, startY, this.container.width/64, 0, 2*Math.PI);
    ctx.fill();
    ctx.stroke();

    ctx.font = this.container.width/24 + "px Arial";
    ctx.fillStyle = 'rgba(200, 200, 255, 0.5)';

    ctx.fillText(this.name, startX + this.container.width/8, startY+this.container.width/64)


  }

}
