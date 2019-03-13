import Dot from './dot';

class Grid {
  constructor(rows, padding, startingXYPosition, canvas, ctx) {
    this.ctx = ctx;
    this.canvas = canvas;
    this.padding = padding;
    this.startingXYPosition = startingXYPosition;
    this.grid = [];
    this.rows = rows;
    this.isLocked = false;
    this.makeGrid(rows);
    this.interval = setInterval(this.render.bind(this), 43);
    this.interval;
  }

  clearGridInterval() {
    clearInterval(this.interval);
  }

  getDot(pos) {
    const col = pos[0];
    const row = pos[1];

    if(
      row < 0 || 
      row > this.rows - 1 ||
      col < 0 ||
      col > this.rows - 1
    ) return false;
    return this.grid[col][row];
  }

  lockDots() {
    this.isLocked = true;
  }
  
  updateRow(arr) {
    const xVal = arr[0].x;
    let updatedArr = arr.filter(dot => !dot.deleted);
    let numDotsToAdd = this.rows - updatedArr.length;
    let j = numDotsToAdd;
    
    for (let i = 0; i < numDotsToAdd; i++) {
      let newDot = new Dot(
        xVal, 
        ((j - 1) * this.padding) + this.startingXYPosition, 
        this.ctx, 
        true,
        (i * -this.padding) - this.startingXYPosition
      )

      j--;
      updatedArr.unshift(newDot);
    }

    if(numDotsToAdd == 6) return updatedArr;

    return updatedArr.map((dot, idx) => {
      if(!dot.animated) {
        dot.animated = true;
        dot.animateYStart = dot.y;
        dot.y = (idx * this.padding) + this.startingXYPosition; 
      }
      
      return dot
    })
  }

  removeDeletedDots(deletedDots) {
    const rowsToUpdate = {}
    const rows = {};
    
    deletedDots.forEach(dot => rowsToUpdate[dot.col] = true)
  
    Object.keys(rowsToUpdate).forEach(row => {
      rows[row] = this.grid[row];
    })

    for (let key in cols) {
      if(rows.hasOwnProperty(key)) {
        const updatedRow = this.updateRow(rows[key]);
        this.grid[key] = updatedRow;
      }
    }

    this.render();
  }

  makeRow(x, y, numDots) {
    const dotRow = []
    while (numDots > 0) {
      dotRow.push(new Dot(x, y, this.ctx))
      y += this.padding;
      numDots--;
    }

    this.grid.push(dotRow);
  }

  makeGrid() {
    let x = this.startingXYPosition;
    let counter = this.rows;
    while(counter > 0) {
      this.makeRow(
        x, 
        this.startingXYPosition, 
        this.rows);
      x += this.padding;
      counter--;
    }    
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  render() {
    this.clearCanvas();
    this.grid.flat().forEach(function(dot) {
      dot.drawDot();
    });
    
  }
}

export default Grid;