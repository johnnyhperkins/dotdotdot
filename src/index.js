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

    dots.forEach(function(dot) {
      if( y > dot.py && y < dot.py + (dot.height)
        && x > dot.px && x < dot.px + (dot.width) ) {
          canvas.addEventListener('mousemove', handleMouseMove(dot))
          console.log('mousedown');
        }
    })
  }, false)

  function handleMouseMove(dot) {  
    return function(e) {
      const mouseX = e.pageX - dotX,
            mouseY = e.pageY - dotY;
            
      drawLine({x: dot.x, y: dot.y}, {x: mouseX, y: mouseY})
    }
  }

  canvas.addEventListener('mouseup', function(e) {
    const x = e.pageX - dotX,
          y = e.pageY - dotY;
    clearLine();
    canvas.removeEventListener('mousemove', handleMouseMove);
    dots.forEach(function(dot) {
      if( y > dot.py && y < dot.py + (dot.height)
        && x > dot.px && x < dot.px + (dot.width) ) {
          canvas.removeEventListener('mousemove', handleMouseMove);
          
          console.log('mouseup');
        }
    })
  })

  function clearLine() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    render();
  }
  
  function drawLine(start, end) {
    clearLine();
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.strokeStyle = "blue";
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



