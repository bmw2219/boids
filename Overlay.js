class Overlay{
  constructor(elementsInput){
    this.slide = 0;
    this.x = 0;
    this.width = canvas.width/3;
    this.select = 0;
    this.elements = [];
    this.processElementInput(elementsInput);
    this.currentElementY = 0;

  }
  processElementInput(elementsInput){
    this.elements = [];
    for(var element of elementsInput){
      if(element[0] == "slider"){
        this.elements.push(new Slider(element[2], element[1], element[3], element[4], this.width, element[5], this, element[6], element[7]));
      }
    }
  }
  calc(neg){
    if(this.x<this.width -1|| neg > 0){
      this.slide += 1
      this.x = this.width/(1+Math.pow(Math.E, (neg*180/this.width)*(this.slide-15))) //logistic sweepy curve

    } else if (this.x>this.width-1){
      this.x = this.width;
    }

  }
  clickEvent(x, y){
    for(var e of this.elements){
      e.clickEvent(x, y);
    }
  }
  releaseEvent(){
    for(var e of this.elements){
      e.releaseEvent();
    }
  }
  mouseMove(x, y){
    for(var e of this.elements){
      e.mouseMove(x, y);
    }
  }
  draw(){
    ctx.fillStyle = "rgba(114, 137, 218, 0.3)";
    ctx.fillRect(0, 0, this.x, canvas.height);

    // ctx.font = canvas.width / 60 + "px Arial";
    // ctx.fillStyle = 'rgba(200, 200, 255, 0.5)';
    // ctx.fillText("Pause the boids with spacebar.", this.x-19*this.width/20, 55);
    // ctx.fillText("Use arrow keys to navigate menu.", this.x-19*this.width/20, 55+canvas.width / 58);
    // ctx.fillText("Gaming.", this.x-19*this.width/20, 55+canvas.width / 29);
    this.currentElementY = 0;
    for(var e of this.elements){
      e.draw(this.x, this.currentElementY);
      this.currentElementY += e.elementHeight;
    }

  }
}
