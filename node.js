import { Physics } from './physics.js';

export class Node {
  id;
  pos = { x: 0, y: 0 }; // x : y
  velocity = { x: 0, y: 0 }; // x : y

  collider = { x: 0, y: 0, width: 0, height: 0 }; // local coordinates
  collision_mask;

  mode = Physics.STATIC; // static : dynamic

  width = 0;
  height = 0;

  center = 0; // uses pos if unset / todo: sprite handling
  damp = 0; // 1 if unset; controls acceleration dampening

  keys = [];

  // TODO
  sprite;

  constructor(sprite, width, height, pos) {
    this.id = (Math.random() + 1).toString(16).slice(2);
    this.width = width;
    this.height = height;
    this.pos = pos;
    this.sprite = sprite;

    this.collision_mask = 0;
  }

  // allows multiple key presses at the same time
  #key_tick() {
    for (const prop in this.keys) {
      if (this.hasOwnProperty.call(this.keys, prop)) {
        const key = this.keys[prop];
        if (key == true) {
          this[`${prop}_cb`]();  // call key callback if pressed
        }
      }
    }
  }

  #angular_damp() {
    const damp = 1 / Math.sqrt(2);
    const angular_v = Math.sqrt(Math.abs(this.velocity.x) + Math.abs(this.velocity.y));
    // apply damp if moving diagonally
    if (angular_v > 1) {
      this.velocity.x *= damp;
      this.velocity.y *= damp;
    }
  }

  process(delta) {
    this.#key_tick();

    // skip if velocity is 0
    if (this.velocity.x == 0 && this.velocity.y == 0) {
      return;
    }
    this.#angular_damp();

    this.pos = this.get_next_pos(delta);

    this.velocity.x *= Math.max(0, (1 - this.damp));
    this.velocity.y *= Math.max(0, (1 - this.damp));

    // reset collision mask
    this.collision_mask = 0;
  }

  on_key(key, callback) {
    this.keys[`${key}`] = false;
    this[`${key}_cb`] = callback;
  }

  on_click(e) { }

  get_next_pos(delta) {
    return {
      x: this.pos.x + this.velocity.x * delta,
      y: this.pos.y + this.velocity.y * delta
    };
  }

  get_center() {
    return {
      x: Math.floor((this.width) / 2),
      y: Math.floor((this.height) / 2),
    };
  }

  get_global_center() {
    return {
      x: Math.floor(this.pos.x + (this.width / 2)),
      y: Math.floor(this.pos.y + (this.height / 2)),
    };
  }

  // only squares for now
  attach_collider(collider) {
    this.collider = collider;
    this.mode = Physics.DYNAMIC;
    console.log(this.collider);
  }


  /**
* @param other {AABB}
* @returns {boolean}
*/
  rightOf(other) {
    return this.pos.x >= other.pos.x + other.width;
  }

  /**
 * @param other {AABB}
 * @returns {boolean}
 */
  topOf(other) {
    return this.pos.y + this.height <= other.pos.y;
  }

  /**
 * @param other {AABB}
 * @returns {boolean}
 */
  leftOf(other) {
    return this.pos.x + this.width <= other.pos.x;
  }

  /**
 * @param other {AABB}
 * @returns {boolean}
 */
  bottomOf(other) {
    return this.pos.y >= other.pos.y + other.height;
  }
}

