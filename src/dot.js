import _ from 'lodash';
import uuid from 'uuid';
import { COLORS } from './constants/colors';

class Dot {
  constructor(x, y, ctx, animated = false, animatedYStart = -10, padding = 40) {
    this.deleted = false;
    this.animated = animated;
    this.x = x;
    this.y = y;
    this.padding = padding;
    this.animateYStart = animatedYStart;
    this.ballRadius = 10;
    this.px = this.x - this.ballRadius;
    this.py = this.y - this.ballRadius;
    this.row = this.py / this.padding;
    this.col = this.px / this.padding;
    this.id = uuid();
    this.ctx = ctx;
    this.height = this.padding / 2;
    this.width = this.padding / 2;
    this.color = _.sample(COLORS);
    this.colorId = COLORS.indexOf(this.color);
  }

  updateDot() {
    this.px = this.x - this.ballRadius;
    this.py = this.y - this.ballRadius;
    this.row = this.py / this.padding;
    this.col = this.px / this.padding;
  }

  drawDot() {
    this.ctx.beginPath();
    if(this.animated && this.animateYStart <= this.y) {
      const speed = this.padding / 1.5;
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