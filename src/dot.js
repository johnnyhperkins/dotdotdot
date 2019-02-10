import _ from 'lodash';
import uuid from 'uuid';

const COLORS = ['red', 'blue', 'green'];

class Dot {
  constructor(x,y,ctx) {
    this.deleted = false;
    this.id = uuid();
    this.ballRadius = 10;
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.px = this.x - this.ballRadius;
    this.py = this.y - this.ballRadius;
    this.row = this.py / 40;
    this.col = this.px / 40;
    this.height = 20;
    this.width = 20;
    this.color = _.sample(COLORS);
    this.colorId = COLORS.indexOf(this.color) + 1;
    
    // this.gridPos = ;
  }

  drawBall() {
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.ballRadius, 0, Math.PI*2);
    this.ctx.fillStyle = this.deleted ? '#ccc' : this.color;
    this.ctx.fill();
    this.ctx.closePath();
  }

}

export default Dot