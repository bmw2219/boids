class Overlay{
  constructor(elementsInput){
    this.slide = 0;
    this.x = 0;
    this.width = 0; //placeholder value
    this.select = 0;
    this.elements = [];
    this.processElementInput(elementsInput);
    this.currentElementY = 0;
    this.defaultHeight = 0; //placeholder value

  }
  processElementInput(elementsInput){
    this.elements = [];
    for(var element of elementsInput){
      if(element[0] == "slider"){
        this.elements.push(new Slider(element[2], element[1], element[3], element[4], this.width, element[5], this, element[6], element[7]));
      } else if(element[0] == "text"){
        this.elements.push(new TextElement(element[1], element[2], this));
      } else if(element[0] == "switch"){
        this.elements.push(new Switch(element[2], element[1], this, element[3], element[4]));
      }
    }
  }
  updateWidth(width){
    this.width = width/Math.PI;
    this.defaultHeight = this.width/25;
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

    this.currentElementY = this.defaultHeight;
    for(var e of this.elements){
      e.draw(this.x, this.currentElementY);
      this.currentElementY += e.elementHeight;
    }

  }
}
