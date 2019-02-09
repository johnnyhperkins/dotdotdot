import _ from 'lodash';
import Dot from './dot';

class Board {
  constructor(canvas, tempCanvas) {
    this.dots = [];
    this.canvas = canvas;
    this.tempCanvas = tempCanvas;
    this.ctx = canvas.getContext("2d");
    this.tempCtx = tempCanvas.getContext("2d")
    this.canvasOffset = $("#canvas").offset();
    this.canvasX = this.canvasOffset.left;
    this.canvasY = this.canvasOffset.top;
    this.selectedDots = [];
    this.currentDotPos = [];
    this.legalMoves = [];
    this.startingDot = null;
    this.startLineX = null;
    this.startLineY = null;
    this.isDown = false;
    
    // makegrind(number of rows, position of first dot)
    this.makeGrid(6, 10);
    console.log(this.dots);
  }

  findLegalMoves(pos) {
    const row = pos[0];
    const col = pos[1];
    const positions = [
      [row, col-1],
      [row, col+1],
      [row+1, col],
      [row-1, col]
    ]
    const colorId = this.getDot(pos).colorId;

    this.legalMoves = positions.filter(pos => 
       this.getDot(pos) && this.getDot(pos).colorId === colorId )
       .map(pos => this.getDot(pos));
  }

  getDotGridPosition(uuid) {
    for (let i = 0; i < this.dots.length; i++) {
      for (let j = 0; j < this.dots[i].length; j++) {
        if(this.dots[i][j].id == uuid) {
          return this.findLegalMoves([i,j]);
        } 
      }
    }
  }

  getDot(pos) {
    const row = pos[0];
    const col = pos[1];
    if(row < 0 || row > 5 || col < 0 || col > 5) return false;
    return this.dots[row][col];
  }

  handleMouseDown(e) {
    e.preventDefault();
    const mouseX = e.pageX - this.canvasX,
          mouseY = e.pageY - this.canvasY;
    this.startingDot = this.selectedDots.length ? this.selectedDots[0] : null;

    this.dots.flat().forEach(dot => {
      if( mouseY > dot.py && 
          mouseY < (dot.py + dot.height) &&
          mouseX > dot.px &&
          mouseX < (dot.px + dot.width) 
        ) {
          this.startLineX = mouseX;
          this.startLineY = mouseY;
          this.tempCtx.clearRect(0,0,this.tempCanvas.width,this.tempCanvas.height);
          if(!this.startingDot) {
            this.selectedDots.push(dot);
            this.getDotGridPosition(dot.id);
            this.startingDot = dot;
          } 
          console.log('mousedown');
        }
    })
    this.isDown = true;
    console.log(this.selectedDots);
  }

  handleMouseMove(e) {
    e.preventDefault();
    // debugger;
    if(!this.isDown && this.selectedDots.length == 0) return;
    
    const mouseX = e.pageX - this.canvasX,
          mouseY = e.pageY - this.canvasY;
    
    // starts drawing a line from the center of closest dot to click:
    // debugger;
    this.drawMouseLine(
      {x: this.startingDot.x, y: this.startingDot.y}, 
      {x: mouseX, y: mouseY}, 
      this.startingDot.color
    )

    // if cursor mouses over another dot of the same color
      // draw a line between those dots
      // add to the array of selected dots
      // recenter the anchor dot to the next dot selected
    console.log("x:", mouseX);
    console.log("y:", mouseY);
    this.legalMoves.forEach(dot => {
      if( mouseY > dot.py && mouseY < dot.py + dot.height && 
          mouseX > dot.px && mouseX < dot.px + dot.width ) { 
        
      } 
    })
  }

  handleMouseUp(e) {
    e.preventDefault();
    if(!this.isDown) return;
    this.isDown = false;
    this.startingDot = null;
    this.selectedDots = [];
    // Remove dots
    // trigger new dots dropping
    this.tempCtx.clearRect(0,0,this.tempCanvas.width,this.tempCanvas.height);
    const mouseX = e.pageX - this.canvasX,
          mouseY = e.pageY - this.canvasY;
    this.dots.flat().forEach(dot => {
      if( mouseY > dot.py && mouseY < dot.py + (dot.height)
        && mouseX > dot.px && mouseX < dot.px + (dot.width) ) {
          console.log('mouseup');
        }
    })
    console.log('mouseup');
  }

  clearLine() {
    this.tempCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawConnections(coords) {
    
    this.ctx.beginPath();
    this.ctx.moveTo(start.x, start.y);
    this.ctx.lineTo(end.x, end.y);
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = 4;
    this.ctx.stroke();
  }

  drawMouseLine(start, end, color) {
    this.clearLine();
    this.tempCtx.beginPath();
    this.tempCtx.moveTo(start.x, start.y);
    this.tempCtx.lineTo(end.x, end.y);
    this.tempCtx.strokeStyle = color;
    this.tempCtx.lineWidth = 4;
    this.tempCtx.stroke();
  }

  makeRow(x, y, numDots) {
    const dotRow = []
    while (numDots > 0 ) {
      dotRow.push(new Dot(x, y, this.ctx))
      x += 40;
      numDots--;
    }
    this.dots.push(dotRow);
  }

  makeGrid(rows, y) {
    while(rows > 0) {
      this.makeRow(10, y, 6);
      y += 40;
      rows--;
    }    
  }

  render() {
    this.dots.flat().forEach(function(dot) {
      dot.drawBall();
    });
  } 
}
  

export default Board