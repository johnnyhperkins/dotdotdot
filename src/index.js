import Dot from './dot'

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('myCanvas');
  let dots = [],
      dotX = canvas.offsetLeft,
      dotY = canvas.offsetTop,
      ctx = canvas.getContext("2d");

  canvas.addEventListener('mousedown', function(e) {
    const x = e.pageX - dotX,
          y = e.pageY - dotY;

    canvas.addEventListener('mousemove', handleMouseMove(e,x,y), true)
    
    dots.forEach(function(dot) {
      // console.log(dot.height);
      if( y > dot.py && y < dot.py + (dot.height)
        && x > dot.px && x < dot.px + (dot.width) ) {
          // console.log('mousedown');
          // console.log(dot.px, dot.py);
        }
    })
  }, false)

  // const handleMouseDown = function(e) {

  // }

  const handleMouseMove = function(e, x, y) {  
    const mouseX = e.pageX - dotX,
          mouseY = e.pageY - dotY;
    return drawLine({x, y}, {x: mouseX, y: mouseY})
  }

  canvas.addEventListener('mouseup', function(e) {
    const x = e.pageX - dotX,
          y = e.pageY - dotY;
    
    // canvas.removeEventListener('mousemove', handleMouseMove);
    dots.forEach(function(dot) {
      if( y > dot.py && y < dot.py + (dot.height)
        && x > dot.px && x < dot.px + (dot.width) ) {
          // console.log('mouseup');
          // console.log(dot.px, dot.py);
        }
    })
  }, false)
  
  function drawLine(start, end) {
    // debugger
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    render();
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
  }

  function drawRow(x, y, numDots) {
    while (numDots > 0 ) {
      dots.push(new Dot(x, y, ctx))
      // new Dot(x, y, ctx).drawBall();
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

  // console.log(dots);
  function render() {
    dots.forEach(function(dot) {
      dot.drawBall();
    });
  }
  
  render();

})

// handleMouseMove(e, x, y)

