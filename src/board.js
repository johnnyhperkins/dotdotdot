import _ from 'lodash';
import Grid from './grid';
import Sound from './sound';
// const select = require('../sounds/select_dot.wav');
// const box = require('../sounds/make_square.wav');

class Board {
  constructor(canvas, tempCanvas, ctx, tempContext, game) {
    this.canvas = canvas;
    this.tempCanvas = tempCanvas;
    this.ctx = ctx;
    this.tempCtx = tempContext;
    this.canvasOffset = $("#canvas").offset();
    this.canvasX = this.canvasOffset.left;
    this.canvasY = this.canvasOffset.top;
    this.selectedDots = [];
    this.legalMoves = [];
    this.currentDot = null;
    this.prevDot = null;
    this.isDown = false;
    this.isSquare = false;
    this.game = game;
    this.makeSquare = new Sound('./sounds/make_square.mp3');
    this.selectDot = new Sound('./sounds/select_dot.mp3');
    this.popDots = new Sound('./sounds/pop_dots.mp3')
    
    // args: numRows, paddingBetweenDots, startingXYPosition
    this.grid = new Grid(6, 40, 10, canvas, ctx);
    this.dotGrid = this.grid.grid;
  }

  createNewGrid() {
    this.grid.clearGridInterval();
    this.grid.clearCanvas(this.ctx);
    this.grid = new Grid(6, 40, 10, this.canvas, this.ctx);
    this.dotGrid = this.grid.grid;
  }

  updateLegalMoves(pos) {
    const col = pos[0];
    const row = pos[1];
    const positions = [
      [col, row-1],
      [col, row+1],
      [col+1, row],
      [col-1, row]
    ]
    const colorId = this.grid.getDot(pos).colorId;

    if(this.isSquare) {
      this.legalMoves = [this.prevDot];
    } else {
      this.legalMoves = positions.filter(pos => {
        return this.grid.getDot(pos) && 
          this.grid.getDot(pos).colorId === colorId
      }).map(pos => this.grid.getDot(pos));
    }
  }

  handleMouseDown(e) {
    e.preventDefault();
    const mouseX = e.pageX - this.canvasX,
          mouseY = e.pageY - this.canvasY;

    this.currentDot = this.selectedDots.length ? this.selectedDots[0] : null;

    this.dotGrid.flat().forEach(dot => {
      if( !this.grid.isLocked &&
          mouseY > dot.py && 
          mouseY < (dot.py + dot.height) &&
          mouseX > dot.px &&
          mouseX < (dot.px + dot.width) ) {

        this.tempCtx.clearRect(0,0,this.tempCanvas.width,this.tempCanvas.height);

        if(!this.currentDot) {
          dot.animateHighlight();
          this.selectedDots.push(dot);
          this.selectDot.play();
          this.updateLegalMoves([dot.col,dot.row]);
          this.currentDot = dot;
        } 
      }
    })

    this.isDown = true;
  }

  handleMouseMove(e) {
    e.preventDefault();
    if(!this.isDown && this.selectedDots.length == 0) return;
    
    const mouseX = e.pageX - this.canvasX,
          mouseY = e.pageY - this.canvasY;

    // starts drawing a line from the center of closest dot to click:
    this.currentDot && this.drawMouseLine(
      {x: this.currentDot.x, y: this.currentDot.y}, 
      {x: mouseX, y: mouseY}
    )
    
    this.legalMoves.forEach(dot => {
      if( mouseY > dot.py && mouseY < dot.py + dot.height && 
          mouseX > dot.px && mouseX < dot.px + dot.width ) {

        const numDots = this.selectedDots.length;

        if( numDots > 3 && 
            dot.id !== this.prevDot.id &&
            this.selectedDots.includes(dot) && 
            !this.isSquare
          ) {
          this.isSquare = true;
          this.selectedDots.push(dot);
        } else if(!this.selectedDots.includes(dot)) {
          this.selectedDots.push(dot);
          this.isSquare = false;
        } else {
          this.selectedDots.pop();
          this.prevDot = this.selectedDots.length > 1 ? this.selectedDots[this.selectedDots.length - 2] : null;
          this.currentDot = dot;
          dot.animateHighlight();
          this.isSquare = false;
          this.selectDot.play();
          return this.updateLegalMoves([dot.col, dot.row]);
        }

        this.selectDot.play();
        this.prevDot = this.currentDot;
        this.currentDot = dot;
        dot.animateHighlight()
        this.updateLegalMoves([dot.col, dot.row]);
      } 
    })
  }

  handleMouseUp(e) {
    e.preventDefault();
    if(!this.isDown) return;

    if(this.selectedDots.length > 1) {
      this.handleRemoveDots();
    }
    
    this.isDown = false;
    this.currentDot = null;
    this.selectedDots = [];
    this.isSquare = false;
    this.clearCanvas(this.tempCtx);
  }

  handleSquare() {
    let colorId = this.currentDot.colorId;
    this.selectedDots = this.dotGrid.flat().filter(dot => dot.colorId === colorId)
    this.makeSquare.play();
  }

  handleRemoveDots() {
    this.isSquare && this.handleSquare();
    !this.isSquare && this.popDots.play();
    this.selectedDots.forEach(dot => {
      this.grid.getDot([dot.col, dot.row]).deleted = true;
    })

    this.game.updateScore(this.selectedDots.length,this.currentDot.colorId);
    
    this.grid.removeDeletedDots();
  }

  clearCanvas(ctx) {
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawConnection(start, end) {
    this.tempCtx.beginPath();
    this.tempCtx.moveTo(start.x, start.y);
    this.tempCtx.lineTo(end.x, end.y);
    this.tempCtx.strokeStyle = this.currentDot.color;
    this.tempCtx.lineWidth = 4;
    this.tempCtx.stroke();
  }

  drawMouseLine(start, end) {
    this.clearCanvas(this.tempCtx);
    if(this.selectedDots.length > 1) {
      const dots = this.selectedDots;
      for (let i = 0; i < dots.length -1; i++) {
        this.drawConnection(
          {x: dots[i].x, y: dots[i].y},
          {x: dots[i+1].x, y: dots[i+1].y},
        )
      }
    }
    this.tempCtx.beginPath();
    this.tempCtx.moveTo(start.x, start.y);
    this.tempCtx.lineTo(end.x, end.y);
    this.tempCtx.strokeStyle = this.currentDot.color;
    this.tempCtx.lineWidth = 4;
    this.tempCtx.stroke();
  } 
}
  

export default Board