import Dot from './dot';

class Grid {
  constructor(rows, startingXYPosition, canvas, ctx) {
    this.ctx = ctx;
    this.canvas = canvas;
    this.startingXYPosition = startingXYPosition;
    this.grid = [];
    this.rows = rows;
    this.makeGrid(rows);
  }

  getDot(pos) {
    const row = pos[0];
    const col = pos[1];
    if(row < 0 || row > 5 || col < 0 || col > 5) return false;
    return this.grid[row][col];
  }

  makeRow(x, y, numDots) {
    const dotRow = []
    while (numDots > 0 ) {
      // debugger;
      dotRow.push(new Dot(x, y, this.ctx))
      x += 40;
      numDots--;
    }
    this.grid.push(dotRow);
  }

  makeGrid() {
    let y = this.startingXYPosition;
    let counter = this.rows;
    // console.log('makegrid rows', rows);
    while(counter > 0) {
      this.makeRow(
        this.startingXYPosition, 
        y, 
        this.rows);
      y += 40;
      counter--;
    }    
  }
  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  render() {
    this.clearCanvas();
    // this.makeGrid();
    this.grid.flat().forEach(function(dot) {
      if(dot) {
        dot.drawBall();
      }
    });
  }   
}

export default Grid;