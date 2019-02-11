import _ from 'lodash';
import uuid from 'uuid';

const COLORS = ['red', 'blue','green','orange'];

class Dot {
  constructor(x,y,ctx, animated = false, animatedYStart = -10) {
    this.deleted = false;
    this.animated = animated;
    this.x = x;
    this.y = y;
    this.animateYStart = animatedYStart;
    this.ballRadius = 10;
    this.px = this.x - this.ballRadius;
    this.py = this.y - this.ballRadius;
    this.row = this.py / 40;
    this.col = this.px / 40;
    this.id = uuid();
    this.ctx = ctx;
    this.height = 20;
    this.width = 20;
    this.color = _.sample(COLORS);
    this.colorId = COLORS.indexOf(this.color) + 1;
  }

  updateDot() {
    this.px = this.x - this.ballRadius;
    this.py = this.y - this.ballRadius;
    this.row = this.py / 40;
    this.col = this.px / 40;
  }

  drawDot() {
    this.ctx.beginPath();
    if(this.animated && this.animateYStart <= this.y) {
      const speed = 25;
      this.ctx.arc(this.x, this.animateYStart, this.ballRadius, 0, Math.PI*2);
      this.animateYStart += speed;
    } else {
      this.animated = false;
      this.ctx.arc(this.x, this.y, this.ballRadius, 0, Math.PI*2);
    }
    this.ctx.fillStyle = this.color;
    this.ctx.fill();
    this.ctx.closePath();
    this.updateDot(); 
  }

}

export default Dot