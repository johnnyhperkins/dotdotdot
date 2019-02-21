import Board from './board';
import _ from 'lodash';
import { LEVELS } from './constants/levels';
import { COLORS } from './constants/colors';

class Game {
  constructor(canvas,tempCanvas) {
    this.canvas = canvas;
    this.tempCanvas = tempCanvas;
    this.ctx = canvas.getContext("2d");
    this.tempCtx = tempCanvas.getContext("2d");

    this.scoreboardWrapper = $('.scoreboard-wrapper');
    this.movesWrapper = $('.moves-wrapper');
    this.winLossWrapper = $('.win-loss-wrapper');

    this.levelEl = $('.level');
    this.movesRemainingEl = $('.moves-remaining');
    this.levelScore = $('.level-score');
    this.totalScore = $('.total-score');

    this.level = 1;
    this.score = {};
    
    this.dotsToPop;
    this.dotsPopped;
    this.movesRemaining;
    this.dotColorsToPop;
    this.dotColorsToPopIds;
       
    this.board = new Board(
      this.canvas,
      this.tempCanvas, 
      this.ctx, 
      this.tempCtx,
      this
    );
    
    Object.keys(LEVELS).forEach(level => this.score[level] = 0);
  }

  setLocalStorageScore(name) {
    const scores = window.localStorage
    const prevScores = scores.getItem('dotHighScores') ? scores.getItem('dotHighScores') : scores.setItem('dotHighScores', {});
    if(name) {
      scores.setItem('dotHighScores', {
        ...prevScores,
        [`${name}`]: this.totalScore
      });
    } else {
      scores.setItem('dotHighScores', {
        ...prevScores,
        Anonymous: this.totalScore
      })
    }
  }

  updateLevel() {
    let GAME_LEVELS = _.merge({}, LEVELS);
    this.dotsToPop = GAME_LEVELS[this.level].dotsToPop;
    this.dotsPopped = GAME_LEVELS[this.level].dotsPopped;
    this.movesRemaining = GAME_LEVELS[this.level].movesRemaining;
    this.dotColorsToPop = GAME_LEVELS[this.level].dotColorsToPop;
    this.dotColorsToPopIds = GAME_LEVELS[this.level].dotColorsToPopIds;
  }

  nextLevel() {
    this.level += 1;
    if(this.level < 6) {
      this.board.createNewGrid();
      this.startGame(this.level);
    } else {
      this.winLossWrapper.empty().append('<p>You won the game!</p>')
      this.winLossWrapper.append($('<input id="name" placeholder="Enter your name" type="text" class="text-input" value="" />'))
      this.winLossWrapper.append($('<button class="restart-game">Reset Game</button>'));
      
      // this.setLocalStorageScore($('#name').val())
        
      $('.restart-game').on('click', () => this.restartGame.bind(this));
    }
  }

  getTotalScore() {
    return Object.values(this.score).reduce((acc,val) => acc + val, 0);
  }

  renderScore() {
    this.levelScore.text(this.score[this.level]);
    this.totalScore.text(this.getTotalScore());
  }

  restartLevel() {
    this.board.createNewGrid();
    this.startGame(this.level);
  }

  restartGame() {
    this.board.createNewGrid();
    this.startGame(1);
  }

  allDotsPopped() {
    return Object.values(this.dotsPopped).every( dp => dp >= this.dotsToPop )
  }

  gameWon() {
    if(this.allDotsPopped()) {
      this.board.grid.lockDots();
      this.winLossWrapper.append(
        $('<p>You did it!</p><button class="next-level">Next Level</button>')
      );
      $('.next-level').on('click', this.nextLevel.bind(this));

    } else if(this.movesRemaining == 0) {
      this.score[this.level] = 0;
      this.renderScore();
      this.board.grid.lockDots();
      this.winLossWrapper.append(
        $('<p>You Lost...</p><button class="restart-level">Restart</button>')
      );
      $('.restart-level').on('click', this.restartLevel.bind(this));

    }
  }

  updateScore(dotsPopped, dotColorId) {
    this.score[this.level] += dotsPopped;
    this.renderScore();

    if(this.dotColorsToPopIds.includes(dotColorId)) {
      this.dotsPopped[dotColorId] += dotsPopped;
      if(this.dotsPopped[dotColorId] >= this.dotsToPop) {
        const color = COLORS[dotColorId];
        $(`#${color}`)
        .find('.dot-score-wrapper')
        .empty()
        .append($('<h5><i class="fas fa-check"></i></h5>'));
      }
      
    }
    --this.movesRemaining;
    this.gameWon();
    this.renderScoreboard();
  }

  createScoreBoard() {
    this.levelEl.text(this.level);
    this.scoreboardWrapper.empty();
    this.dotColorsToPop.forEach(color => {
      const targetColorContainer = $(`
        <div class="target-color-wrapper" id="${color}">
          <div class="target-color" style="background:${color}"></div>
          <div>
          <div class="dot-score-wrapper">
            <h5 class="dots-popped"></h5><h5>/</h5><h5 class="dots-to-pop"></h5>
          </div>
          </div>
        </div>`)
      this.scoreboardWrapper.append(targetColorContainer);
    });
  }

  renderScoreboard() {
    this.movesRemainingEl.text(this.movesRemaining);
    
    this.dotColorsToPop.forEach(color => {
      $(`#${color}`).find('.dots-to-pop').text(this.dotsToPop);
      $(`#${color}`).find('.dots-popped').text(this.dotsPopped[COLORS.indexOf(color)]);
    })
  }

  startGame(level = 1) {
    this.level = level || this.level;
    this.winLossWrapper.empty();
    this.updateLevel();
    this.createScoreBoard();
    this.renderScoreboard();
    this.renderScore(); 
    this.board.grid.render();
  }
}

export default Game