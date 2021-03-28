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
    this.scrollvelo = 0;

  }
  processElementInput(elementsInput){
    this.elements = [];
    for(var element of elementsInput){
      if(element[0] == "slider"){
        this.elements.push(new Slider(element[2], element[1], element[3], element[4], this.width, element[5], this, element[6], element[7]));
      } else if(element[0] == "text"){
        this.elements.push(new TextElement(element[1], element[2], this));
      }
    }
  }
  updateWidth(width){
    this.width = width/Math.PI;
    this.defaultHeight = this.width/25;
    this.scrolldest = this.defaultHeight;
  }
  calc(neg){
    if(this.x<this.width -1|| neg > 0){
      this.slide += 1
      this.x = this.width/(1+Math.pow(Math.E, (neg*180/this.width)*(this.slide-15))) //logistic sweepy curve

    } else if (this.x>this.width-1){
      this.x = this.width;
    }
  }
  scrollcalc(){
    console.log(this.scrollvelo)
    if(Math.abs(this.scrollvelo)>canvas.width/1500){//arbitrary number to handle inaccuracies
      this.scrollvelo = (Math.abs(this.scrollvelo)-canvas.width/1500)*Math.sign(this.scrollvelo);
      //console.log(this.scrollvelo);
      this.defaultHeight = this.defaultHeight - this.scrollvelo;
      if(this.defaultHeight>this.width/25){
        this.defaultHeight = this.width/25;
        this.scrollvelo = 0;
      }
    } else {
      this.scrollvelo = 0;
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
