import Dot from './dot';
import Board from './board';

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('canvas');
  const tempCanvas = document.getElementById('tempCanvas');

  let dots = [],
      canvasOffset = $("#canvas").offset(),
      canvasX = canvasOffset.left,
      canvasY = canvasOffset.top,
      ctx = canvas.getContext("2d"),
      tempCtx = tempCanvas.getContext("2d"),
      dotPositionsAndColors = [],
      selectedDots = [],
      startingDot,
      startLineX,
      startLineY,
      isDown;
  
  // on selection of dot, populate array with possible nearby moves?
  // MOUSE DOWN 
  function handleMouseDown(e) {
    
    e.preventDefault();
    const mouseX = e.pageX - canvasX,
          mouseY = e.pageY - canvasY,
          startingDot = selectedDots.length ? selectedDots[0] : null;

    dots.forEach(function(dot) {
      if( mouseY > dot.py && 
          mouseY < (dot.py + dot.height) &&
          mouseX > dot.px &&
          mouseX < (dot.px + dot.width) 
        ) {

          startLineX = mouseX;
          startLineY = mouseY;
          tempCtx.clearRect(0,0,tempCanvas.width,tempCanvas.height);
          if(!startingDot) {
            selectedDots.push(dot);
          } 
          console.log('mousedown');
        }
    })
    isDown = true;
    console.log(selectedDots);
//     debugger;
  }

  function handleMouseMove(e) {
    e.preventDefault();
    // debugger;
    if(!isDown && !!startingDot) return;
    
    const mouseX = e.pageX - canvasX,
          mouseY = e.pageY - canvasY;
    
    // starts drawing a line from the center of closest dot to click:
    // debugger;
    drawMouseLine({x: startingDot.x, y: startingDot.y}, {x: mouseX, y: mouseY}, startingDot.color)

    // if cursor mouses over another dot of the same color
      // draw a line between those dots
      // add to the array of selected dots
      // recenter the anchor dot to the next dot selected

    dots.forEach(function(nextDot) {
      if( mouseY > nextDot.py && mouseY < nextDot.py + nextDot.height && 
          mouseX > nextDot.px && mouseX < nextDot.px + nextDot.width && 
          startingDot.colorId == nextDot.colorId && 
          nextDot.px !== startingDot.px && 
          nextDot.py !== startingDot.py
        ) {
          console.log('inside another dot');
          // debugger
          // console.log(this);
          // console.log('dot:', dot);
          // console.log('selectedDots:',selectedDots);
          // console.log('nextDot', nextDot);
          // if(!selectedDots.includes(nextDot)) {
          //   console.log(nextDot);
          //   console.log(selectedDots);
          //   selectedDots.push(nextDot);
          // }
        } 
    })
  }


  // MOUSE UP
  function handleMouseUp(e) {
    e.preventDefault();
    if(!isDown) return;
    isDown = false;
    startingDot = null;
    selectedDots = [];
    // Remove dots
    // trigger new dots dropping
    tempCtx.clearRect(0,0,tempCanvas.width,tempCanvas.height);
    const mouseX = e.pageX - canvasX,
          y = e.pageY - canvasY;
    // canvas.removeEventListener('mousemove', handleMouseMove);
    dots.forEach(function(dot) {
      if( y > dot.py && y < dot.py + (dot.height)
        && mouseX > dot.px && mouseX < dot.px + (dot.width) ) {
          console.log('mouseup');
        }
    })
  }

  function clearLine() {
    tempCtx.clearRect(0, 0, canvas.width, canvas.height);
    render();
  }

  function drawConnections(coords) {
    ctx.beginPath();
    
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.strokeStyle = color;
    ctx.lineWidth = 4;
    ctx.stroke();
  }
  
  function drawMouseLine(start, end, color) {
    clearLine();
    tempCtx.beginPath();
    tempCtx.moveTo(start.x, start.y);
    tempCtx.lineTo(end.x, end.y);
    tempCtx.strokeStyle = color;
    tempCtx.lineWidth = 4;
    tempCtx.stroke();
  }

  function drawRow(x, y, numDots) {
    while (numDots > 0 ) {
      dots.push(new Dot(x, y, ctx))
      x += 46;
      numDots--;
    }
  }
  
  function drawGrid(rows, y) {
    while(rows > 0) {
      drawRow(33, y, 6);
      y += 46;
      rows--;
    }    
  }
  drawGrid(6, 33);

  function render() {
    dotPositionsAndColors = []
    dots.forEach(function(dot) {
      dot.drawBall();
      // debugger
      dotPositionsAndColors.push([dot.px,dot.py,dot.colorId])
    });
  }
  
  $('#canvas').mousedown(function(e) {handleMouseDown(e)});
  $('#canvas').mousemove(function(e) {handleMouseMove(e)});
  // canvas.addEventListener('mousedown', handleMouseDown);
  canvas.addEventListener('mouseup', handleMouseUp);
  render();

})



