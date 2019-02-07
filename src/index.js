import Dot from './dot'

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('myCanvas');
  let dots = [],
      dotX = canvas.offsetLeft,
      dotY = canvas.offsetTop,
      ctx = canvas.getContext("2d"),
      selectedDotColor = '',
      selectedDots = [],
      startingDot = [];

  // MOUSE DOWN
  canvas.addEventListener('mousedown', function(e) {
    const x = e.pageX - dotX,
          y = e.pageY - dotY;

    dots.forEach(function(dot) {
      if( y > dot.py && y < dot.py + (dot.height)
        && x > dot.px && x < dot.px + (dot.width) ) {
          if(!!startingDot.length) {
            startingDot.push(dot);
          } else if(!selectedDots.includes(dot)) {
            selectedDots.push(dot);
          }
          
          canvas.addEventListener('mousemove', handleMouseMove(dot))
          console.log('mousedown');
        }
    })
  }, false)

  function handleMouseMove(dot) {  
    return function(e) {
      const mouseX = e.pageX - dotX,
            mouseY = e.pageY - dotY;
      
      drawMouseLine({x: dot.x, y: dot.y}, {x: mouseX, y: mouseY}, dot.color)
      // if cursor mouses over another dot of the same color
        // draw a line between those dots
        // add to the array of selected dots
        // recenter the anchor dot to the next dot selected

      dots.forEach(function(nextDot) {
        if( mouseY > nextDot.py && mouseY < nextDot.py + (nextDot.height)
          && mouseX > nextDot.px && mouseX < nextDot.px + (nextDot.width) && 
          (dot.px !== nextDot.px && dot.py !== nextDot.py) && 
          dot.colorId == nextDot.colorId) {
            console.log(selectedDots);
            console.log(nextDot);
            // if(!selectedDots.includes(nextDot)) {
            //   console.log(nextDot);
            //   console.log(selectedDots);
            //   selectedDots.push(nextDot);
            // }
          }
      })
    }
  }


  // MOUSE UP
  canvas.addEventListener('mouseup', function(e) {
    // Remove dots
    // trigger new dots dropping 
    selectedDotColor = '';
    selectedDots = [];
    startingDot = [];

    canvas.removeEventListener('mousemove', handleMouseMove);
    const x = e.pageX - dotX,
          y = e.pageY - dotY;
    clearLine();
    // canvas.removeEventListener('mousemove', handleMouseMove);
    dots.forEach(function(dot) {
      if( y > dot.py && y < dot.py + (dot.height)
        && x > dot.px && x < dot.px + (dot.width) ) {
          canvas.removeEventListener('mousemove', handleMouseMove);
          console.log('mouseup');
        }
    })
  }, false)

  function clearLine() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
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
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.strokeStyle = color;
    ctx.lineWidth = 4;
    ctx.stroke();
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
    dots.forEach(function(dot) {
      dot.drawBall();
    });
  }
  
  render();

})



