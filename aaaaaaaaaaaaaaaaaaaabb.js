import { Comparator } from './comparator.js';
// uses AABB - model
export class AAAAAAAAAAAAAAAAAAAABB {
  c = new Comparator();

  local_to_global(parent, local_coords) {
    return {
      x: parent.x + (local_coords),
      y: parent.y + (local_coords)
    }
  }

  // global_to_local(child, global_coords) {
  //   return {
  //     x:,
  //     y:
  //   }
  // }

  // bounds check™️
  check_bounds(that, other, bounds) {
    return (
      (this.c.compare_to(that.x, other.x) && this.c.compare_to(other.x + bounds.width, that.x))
      && (this.c.compare_to(that.y, other.y) && this.c.compare_to(other.y + bounds.height, that.y))
    );
  }
}