import _ from 'lodash';
import Grid from './grid';


class Board {
  constructor(canvas, tempCanvas, ctx, tempContext) {
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
    this.isDown = false;
    this.isSquare = false;
    this.deletedPositions = [];

    this.grid = new Grid(6,10, canvas, ctx);
    this.dotGrid = this.grid.grid;
    
    // board.makeGrid(number of rows)
  
  }

  updateLegalMoves(pos) {
    // TO DO: Feb 9th: finish figuring out backing off when a square is made 

    const row = pos[0];
    const col = pos[1];
    const positions = [
      [row, col-1],
      [row, col+1],
      [row+1, col],
      [row-1, col]
    ]
    const colorId = this.grid.getDot(pos).colorId;

    this.legalMoves = positions.filter(pos => {
      // TO DO: refactor to be more DRY:
      if(this.selectedDots.length < 3) {
        return !this.selectedDots.includes(this.grid.getDot(pos)) && 
        this.grid.getDot(pos) && 
        this.grid.getDot(pos).colorId === colorId
      } 
      // duplicate logic here and in mousemove
      else if(this.selectedDots.length > 1 && 
        this.selectedDots[0].id == _.last(this.selectedDots).id) {
        this.isSquare = true;
        console.log('running');
        return;
      } 
      else {
        // debugger
        return this.grid.getDot(pos) && 
        this.grid.getDot(pos).colorId === colorId
      }
    })
      .map(pos => this.grid.getDot(pos));
      //  console.log(this.legalMoves);
      this.legalMoves.forEach(dot => console.log("x", dot.x, "y", dot.y ))
  }

  getLegalMovesById(id) {
    for (let i = 0; i < this.dotGrid.length; i++) {
      for (let j = 0; j < this.dotGrid[i].length; j++) {
        if(this.dotGrid[i][j].id == id) {
          return this.updateLegalMoves([i,j]);
        } 
      }
    }
  }

  handleMouseDown(e) {
    e.preventDefault();
    const mouseX = e.pageX - this.canvasX,
          mouseY = e.pageY - this.canvasY;
    this.currentDot = this.selectedDots.length ? this.selectedDots[0] : null;
    this.dotGrid.flat().forEach(dot => {
      if( mouseY > dot.py && 
          mouseY < (dot.py + dot.height) &&
          mouseX > dot.px &&
          mouseX < (dot.px + dot.width) 
        ) {
          this.tempCtx.clearRect(0,0,this.tempCanvas.width,this.tempCanvas.height);
          if(!this.currentDot) {
            console.log('currentDotX', dot.x);
            console.log('currentDotY', dot.y);
            this.selectedDots.push(dot);
            this.getLegalMovesById(dot.id);
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
    // debugger;
    this.currentDot && this.drawMouseLine(
      // {x: this.selectedDots[-1].x, y: this.selectedDots[-1].y}, 
      {x: this.currentDot.x, y: this.currentDot.y}, 
      {x: mouseX, y: mouseY}
    )
    
    // if(!this.isSquare) {
      this.legalMoves.forEach(dot => {
        if( mouseY > dot.py && mouseY < dot.py + dot.height && 
            mouseX > dot.px && mouseX < dot.px + dot.width ) {
              
          if(this.selectedDots[0].id == dot.id) {
            this.isSquare = true;
            this.selectedDots.push(dot)
          } else if( !this.selectedDots.includes(dot) ) {
            this.selectedDots.push(dot);
            this.isSquare = false;
          }  else {
            this.selectedDots.pop();
            this.isSquare = false;
          } 
          
          this.currentDot = dot;
          console.log('selectedDots:', this.selectedDots);
          this.getLegalMovesById(dot.id)
        } 
      })
    // }    
  }

  handleMouseUp(e) {
    e.preventDefault();
    if(!this.isDown) return;
    
    // Remove dots
    // trigger new dots dropping
    // check for this.isSquare
      // else remove dots in the array
    if(this.selectedDots.length > 1) {
      this.handleRemoveDots();
    }
    
    this.isDown = false;
    this.currentDot = null;
    this.selectedDots = [];
    this.clearTempCanvas();

  }

  deleteDot(id) {
    for (let i = 0; i < this.dotGrid.length; i++) {
      for (let j = 0; j < this.dotGrid[i].length; j++) {
        const currentDot = this.dotGrid[i][j];
        if(currentDot.id == id && !currentDot.deleted) {
          currentDot.deleted = true;
          // this.dotGrid[i] = this.dotGrid[i].filter(dot => dot.id !== currentDot.id)
          // this.dotGrid[i].unshift(currentDot);
        } 
      }
    }
  }

  handleRemoveDots() {
    // rotates the array counterclockwise
    this.selectedDots.forEach(dot => {
      this.deleteDot(dot.id);
    })
    // debugger;
    // for (let i = 0; i < this.dotGrid.length; i++) {
    //   for (let j = 0; j < this.dotGrid[i].length; j++) {
    //     const currentDot = this.dotGrid[i][j];
    //     if(currentDot.deleted) {
    //       currentDot.deleted = true;
    //       // this.dotGrid[i] = this.dotGrid[i].filter(dot => dot.id !== currentDot.id)
    //     } 
    //   }
    // }
    //need to multiply y by the number of deleted dots in each row;
    // debugger;
    // finish up (last step)
    
    this.grid.render();
    // mark each dot to be removed and transpose the array then... 
    // move all nulls to the start of each array?
    // fill the nulls with newly generated random dots
    // transpose array again
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  clearTempCanvas() {
    this.tempCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
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
    this.clearTempCanvas();
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