class TextElement{
  constructor(text, size, container){
    this.text = text;
    this.container = container;
    this.size = size;
    this.elementHeight = 0;
  }
  clickEvent(x, y){}
  releaseEvent(){}
  mouseMove(x, y){}
  draw(containerX, elementY){
    var fontSize = this.size*(canvas.width / 60);
    ctx.font = fontSize + "px Arial";
    ctx.fillStyle = 'rgba(200, 200, 255, 0.5)';


    var maxLength = 23*this.container.width/25;
    var splitText = this.text.split(" ");
    var currentLine = ""
    var lines = [];
    var currIndex = 0;
    for(var word of splitText){
      var length = ctx.measureText(word).width;
      if(length>maxLength){

        lines.push(word);
        continue;
      }
      if(ctx.measureText(currentLine+" "+word).width < maxLength){
        if(currIndex == 0){
          currentLine += word;
        } else {
          currentLine += " "+word
        }
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
      currIndex++;
    }
    lines.push(currentLine);

    this.elementHeight = fontSize * .5 + lines.length * 1.2 * fontSize;
    var currentY = fontSize;
    for(var i = 0; i < lines.length; i++){
      ctx.fillText(lines[i], containerX - 24*this.container.width/25, elementY + currentY);
      if(i == lines.length - 1){
        currentY += fontSize;
      } else {
        currentY += 1.2*fontSize;
      }
    }

  }
}
