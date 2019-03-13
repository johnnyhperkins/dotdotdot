# Dot Dot .

### [Dot Dot . live](http://dotdotdots.xyz/)

## Background and Overview
* Dot Dot . is a Two Dots-inspired JS game where players have to connect a certain number of like-colored dots in a set number of moves. When the dots are connected they disappear and random new dots drop from the top of the canvas. If the player connects dots in the shape of a box, all like-colored dots disappear from the board. 

## Gameplay
* Users are presented with a random grid of colored dots and will use the mouse to connect them
* If win requirements are met in the set number of moves, a score is calculated based on number of remaining moves the player has and the next level begins
  
This project was considerably more difficult than I expected, mostly because it's all done in canvas; rather than have HTML elements for the dots (to which event listeners could be attached), I could only attach 3 event listeners to the canvas element itself. 

Determining which dot was clicked on, hovered over, or mouseup-ed over had to done by comparing the user's mouseX/mouseY postion to each dot class's x / y coordinates on the grid.

```js
handleMouseDown(e) {
  const mouseX = e.pageX - this.canvasX,
        mouseY = e.pageY - this.canvasY;

  this.currentDot = this.selectedDots.length ? this.selectedDots[0] : null;

  // Dots are stored in a 2D array, which is flattened and iterated over to check if the mouse's 
  // coordinates are over within a given dot's px and py (centerpoints) + the dot's height and width.
  this.dotGrid.flat().forEach(dot => {
    if( !this.grid.isLocked &&
        mouseY > dot.py && 
        mouseY < (dot.py + dot.height) &&
        mouseX > dot.px &&
        mouseX < (dot.px + dot.width) ) {

      this.tempCtx.clearRect(0,0,this.tempCanvas.width,this.tempCanvas.height);

      if(!this.currentDot) {
        this.soundOn && this.selectDot.play();
        this.selectedDots.push(dot);
        
        dot.animateHighlight();        
        this.updateLegalMoves([dot.col,dot.row]);
        this.currentDot = dot;
      } 
    }
  })

  this.isDown = true;
}
```

Knowing what dot was being moused over was a start, but selecting them, drawing lines between them (and only if they're like-colored and above, right, below or left) was another challenge. 

First, to draw the line I had to add a second canvas layer, absolutely positioned on top of the dot-grid canvas, so that when the line was being rendered and erased it wasn't wiping out the dots below.

To connect the dots as users mouse over them, I made a function that creates an array of 'valid moves' (a maximum of 4 tuples containing x and y coordinates) when a dot is initially clicked on. The 4 possible positions are then filtered to see if there are any like-colored dots near by and ensure the clicked dot wasn't in a corner or on the edge of the board:

```js
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
      // getDot returns false if the provided 'pos' is outside the grid
      return this.grid.getDot(pos) && 
        this.grid.getDot(pos).colorId === colorId
    // after filtering the possible positions, put the instances of dots 
    // that can be legally moused over into an array and use their x/y 
    // coordinately to determine where the mouse can legally be moved next
    }).map(pos => this.grid.getDot(pos));
  }
}
```

For as long as the mouse is held down, a line from the center of the initially clicked dot to the user's mouse pointer is drawn over the top layer canvas. The function also checks the array of 'selected dots' as it goes and draws lines connecting them: 

```js
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
```

Once the first dot is selected, the `mousedown` handler only checks whether the user's mouse coordinates correspond to any of the legal positions in the `legalMoves` array. If they do, a number of checks are made to determine whether or not the user has made a square (meaning all like-colored dots are removed from the board), an unconventially shaped square (i.e. ):

![Alt text](/images/odd-square.png?raw=true "Odd Square")

 or if they're 'backtracking' onto previous played dots:

```js
handleMouseMove(e) {
  if(!this.isDown && this.selectedDots.length == 0) return;
  
  const mouseX = e.pageX - this.canvasX,
        mouseY = e.pageY - this.canvasY;

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
        this.prevDot = this.selectedDots.length > 1 ? 
          this.selectedDots[this.selectedDots.length - 2] : null;

        this.currentDot = dot;
        dot.animateHighlight();
        this.isSquare = false;

        this.soundOn && this.selectDot.play();
        return this.updateLegalMoves([dot.col, dot.row]);
      }

      this.soundOn && this.selectDot.play();
      this.prevDot = this.currentDot;
      this.currentDot = dot;
      dot.animateHighlight()
      this.updateLegalMoves([dot.col, dot.row]);
    } 
  })
}
```
As the mouse moves from dot to dot, an array of selected dots grows, and when the mouse is lifted up the process of elimating the selected dots begins. Finding and removing the dots from the dot grid array is easy, getting them to fall *down* was a challenge. The simple solution was to swap the x and y coordinates of the dots while building the grid. So the first row in the grid would be [{x: 10, y: 10}, {x: 10, y: 50}, {x: 10, y: 90} ...etc ]. As a result, the arrays in the dot grid array are drawn as columns on canvas. 

But I couldn't simply delete them and replace them with new intances of the dot class, so the first step was to mark them all for deletion: 

```js
handleRemoveDots() {
  this.isSquare && this.handleSquare();
  (this.soundOn && !this.isSquare) && this.popDots.play();

  this.selectedDots.forEach(dot => {
    this.grid.getDot([dot.col, dot.row]).deleted = true;
  })

  this.game.updateScore(this.selectedDots.length,this.currentDot.colorId);
  this.grid.removeDeletedDots();
}
```

Once the deleted dots are marked, I find which rows they're in, filter the deleted dots, add new dots with starting coordinates outside the canvas frame and update the row:

```js
updateRow(arr) {
  const xVal = arr[0].x;
  let updatedArr = arr.filter(dot => !dot.deleted);
  let numDotsToAdd = this.rows - updatedArr.length;
  let j = numDotsToAdd;
  
  for (let i = 0; i < numDotsToAdd; i++) {
    let newDot = new Dot(
      // x coord
      xVal, 
      // y coord
      ((j - 1) * this.padding) + this.startingXYPosition, 
      // context
      this.ctx, 
      // is animated is set to true
      true,
      // it's starting y coordinate is set in an inverse
      // relationship to its final y coordinate since the 
      // new dots pushed into the array are stacked out of 
      // frame to fall in the right order
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
```

Finally, I call `this.render` in the `removeDeletedDots` sets in motion the animation of the surviving dots and the new dots, and the grid is repopulated for the next move.