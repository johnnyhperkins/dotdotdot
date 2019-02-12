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
    this.interval = setInterval(this.render.bind(this), 33);
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
      row > this.rows - 1 
      || col < 0 
      || col > this.rows - 1
    ) return false;
    
    return this.grid[col][row];
  }

  lockDots() {
    this.isLocked = true;
  }

  removeDeletedDots() {
    let finished = false;
    
    while(!finished) {
      finished = true;
      for (let i = 0; i < this.grid.length; i++) {
        for (let j = 0; j < this.grid[i].length; j++) {
          
          const currentDot = this.grid[i][j];
          if(currentDot.deleted) {
            finished = false;
            let updatedY = currentDot.y;
            //if not the first element in the array...
            if(j > 0) {
              this.getDot([i, j]).y = this.getDot([i, j-1]).y;
              this.getDot([i, j-1]).y = updatedY;
              [this.grid[i][j], this.grid[i][j-1]] = [this.grid[i][j-1], this.grid[i][j]]
            } else {
              this.grid[i] = this.grid[i].filter(dot => currentDot.id !== dot.id)
            }
          } 
        }
      }
    }

    this.addDots();
  }

  addDots() {
    let addedDots = false;
    while(!addedDots) {
      addedDots = true;
      for (let i = 0; i < this.grid.length; i++) {
        let col = this.grid[i];
        
        if(col.length < 6) {
          addedDots = false;
          let numDotsToAdd = this.rows - col.length;
          let counter = 0;
          let bottomDotX, bottomDotY;

          //check if the whole column was wiped out:
          if(col[0]) {
            bottomDotX = col[0].x;
            bottomDotY = col[0].y;
          } else {
            bottomDotX = (i * this.padding) + this.startingXYPosition;
            bottomDotY = this.canvas.height + this.padding - this.startingXYPosition;
          }
          
          while( counter < numDotsToAdd) {
            bottomDotY -= this.padding
            this.grid[i].unshift( 
              new Dot(
                bottomDotX, 
                bottomDotY, 
                this.ctx, 
                true,
                ((counter + 1) * -this.padding)
              )
            )

            counter++;
          }
        }
      }
    }  
    this.render();
  }

  makeRow(x, y, numDots) {
    const dotRow = []
    while (numDots > 0 ) {
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