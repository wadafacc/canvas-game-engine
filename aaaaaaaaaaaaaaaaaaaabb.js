import { Comparator } from './comparator.js';
// uses AABB - model
export class AAAAAAAAAAAAAAAAAAAABB {
  c = new Comparator();

  to_global(parent, local_coords) {
    return {
      x: parent.pos.x + (local_coords.x),
      y: parent.pos.y + (local_coords.y)
    }
  }

  // bounds check™️
  check_bounds(that, other, bounds) {
    return (
      (this.c.compare_to(that.x, other.x) && this.c.compare_to(other.x + bounds.width, that.x))
      && (this.c.compare_to(that.y, other.y) && this.c.compare_to(other.y + bounds.height, that.y))
    );
  }

  check_collision_x(that, other) {
    return (this.c.lte(that.pos.x, other.pos.x + other.width) && this.c.gte(that.pos.x + that.width, other.pos.x));
  }

  check_collision_y(that, other) {
    return (this.c.lte(that.pos.y, other.pos.y + other.height) && this.c.gte(that.pos.y + that.height, other.pos.y));
  }
}