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

    this.username = 'Anonymous';
    
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

    this.setLocalStorageScore = this.setLocalStorageScore.bind(this);
    this.restartGame = this.restartGame.bind(this);

    Object.keys(LEVELS).forEach(level => this.score[level] = 0);
  }

  hasPlayed(name) {
    const scores = window.localStorage.getItem('dotHighScores');
    if( scores ) {
      return JSON.parse(scores).filter(record => record.name == name)
    } else {
      return false;  
    }
  }

  setLocalStorageScore() {
    this.username = $('#name').val();
    let storage = window.localStorage;
    const hasPlayed = this.hasPlayed(this.username)
    
    if(hasPlayed.length) {
      if(hasPlayed[0].name == this.username && hasPlayed[0].score < this.getTotalScore()) {
        const updatedPlayers = JSON.parse(storage.getItem('dotHighScores')).map(record => {
          if(record.name == this.username) {
            record.score = this.getTotalScore();
            return record
          } else {
            return record
          }
        });
        storage.setItem('dotHighScores', JSON.stringify(updatedPlayers))
      } 
    } else {
      const newRecord = {name: this.username, score:this.getTotalScore()}

      if(storage.getItem('dotHighScores')) {
        let dotScores = JSON.parse(storage.getItem('dotHighScores'));
        dotScores.push(newRecord);
        storage.setItem('dotHighScores', JSON.stringify(dotScores));  
      } else {
        storage.setItem('dotHighScores', JSON.stringify([newRecord]));
      }
    }

    this.renderHighScores()
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
    this.board.createNewGrid();
    this.startGame(this.level);
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
      this.score[this.level] += (this.movesRemaining * 100);
      if(this.level == _.last(Object.keys(LEVELS))) {
        this.winLossWrapper.empty().append($('<p>You won the game!</p><input id="name" placeholder="Enter your name" type="text" class="text-input" value="" /><button class="high-score-btn">Save</button><button class="restart-game">Restart Game</button>'));
        
        $('.high-score-btn').on('click', () => this.setLocalStorageScore());  
        $('.restart-game').on('click', () => this.restartGame());
      } else {
        this.winLossWrapper.append(
          $('<p>You did it!</p><button class="next-level">Next Level</button>')
        );
        $('.next-level').on('click', this.nextLevel.bind(this));
      }
      

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

  createScoreboard() {
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

  renderHighScores() {
    let scores;
    const highScoreContainer = $('.high-scores');
    const storageArr = JSON.parse(window.localStorage.getItem('dotHighScores'));
    let highScores = _.orderBy(storageArr, ['score'], ['desc']);
    highScores = highScores.length > 10 ? highScores.slice(0,10) : highScores;

    highScoreContainer.empty();

    if(highScores.length) {
      scores = $('<ol></ol>');
      highScores.forEach(record => {
        scores.append($(`<li>${record.name} ${record.score}</li>`))
      })
    } else {
      scores = $('<p class="center">none yet!</p>');
    }

    highScoreContainer.append(scores);
    $('#name').fadeOut();
    $('.high-score-btn').fadeOut();
  }

  startGame(level = 1) {
    this.level = level || this.level;
    this.winLossWrapper.empty();
    this.updateLevel();
    this.createScoreboard();
    this.renderScoreboard();
    this.renderScore(); 
    this.renderHighScores();
    this.board.grid.render();
  }
}

export default Game