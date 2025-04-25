export class Vec2 {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  add(v) {
    this.x += v;
    this.y += v;
    return this;
  }

  sub(v) {
    this.x -= v;
    this.y -= v;
    return this;
  }

  mult(scalar) {
    this.x *= scalar;
    this.y *= scalar;
    return this;
  }

  div(scalar) {
    if (scalar == 0)
      return this;

    this.x /= scalar;
    this.y /= scalar;
    return this;
  }

  add_v(vec) {
    this.x += vec.x;
    this.y += vec.y;
    return this;
  }

  magnitude() {
    return Math.sqrt(self.x * self.x + self.y * self.y);
  }

  normalize() {
    const length = this.magnitude();
    if (length !== 0) {
      this.x /= length;
      this.y /= length;
    }
    return this;
  }
}

export const ZERO = new Vec2(0,0);