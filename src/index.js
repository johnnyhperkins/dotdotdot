import Game from './game';

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('canvas');
  const tempCanvas = document.getElementById('tempCanvas');

  const game = new Game(canvas, tempCanvas);

  $('#canvas').mousedown(function(e) {game.board.handleMouseDown(e)});
  $('#canvas').mousemove(function(e) {game.board.handleMouseMove(e)});
  $('#canvas').mouseup(function(e) {game.board.handleMouseUp(e)});
  
  game.startGame();

})



