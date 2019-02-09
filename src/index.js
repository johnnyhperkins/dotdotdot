import Board from './board';

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('canvas');
  const tempCanvas = document.getElementById('tempCanvas');

  const board = new Board(canvas, tempCanvas);
  
  $('#canvas').mousedown(function(e) {board.handleMouseDown(e)});
  $('#canvas').mousemove(function(e) {board.handleMouseMove(e)});
  $('#canvas').mouseup(function(e) {board.handleMouseUp(e)});
  
  board.render();

})



