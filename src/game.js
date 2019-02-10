import Board from './board';

class Game {
  constructor(canvas,tempCanvas) {
    this.canvas = canvas;
    this.tempCanvas = tempCanvas;
    this.ctx = canvas.getContext("2d");
    this.tempCtx = tempCanvas.getContext("2d");
    
    this.board = new Board(
      canvas,
      tempCanvas, 
      this.ctx, 
      this.tempCtx);
  }

  startGame() {
    this.board.grid.render();
  }
}

export default Game