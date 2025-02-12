class Node {
  position = { x: 0, y: 0 }; // x : y
  velocity = { x: 0, y: 0 }; // x : y


  physics_mode; // static : dynamic
  collider = { x: 0, y: 0, w: 0, h: 0 }; // local coordinates

  width = 0;
  height = 0;

  center = 0; // uses position if unset / todo: sprite handling
  damp = 0; // 1 if unset; controls acceleration dampening

  keys = [];

  // TODO
  sprite;

  constructor(sprite, width, height, position) {
    this.width = width;
    this.height = height;
    this.position = position;
    this.sprite = sprite;    
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
    if ( this.velocity.x == 0 && this.velocity.y == 0) {
      return;
    }
    this.#angular_damp();

    this.position.x += this.velocity.x * delta;
    this.position.y += this.velocity.y * delta;

    this.velocity.x *= Math.max(0, (1 - this.damp));
    this.velocity.y *= Math.max(0, (1 - this.damp));
  }

  on_key(key, callback) {
    this.keys[`${key}`] = false;
    this[`${key}_cb`] = callback;
  }

  on_click(e) { }

}

