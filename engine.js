import { Time } from './time.js';
import { Comparator } from './comparator.js';
import { AAAAAAAAAAAAAAAAAAAABB } from './aaaaaaaaaaaaaaaaaaaabb.js';
import { Directions, Physics } from './physics.js';

export class Engine {
  bounds;
  mousepos; // x : y
  gravity = { x: 0, y: 0 }; // godot-style

  time = new Time();
  #comp = new Comparator();
  // coordinate / collision handler
  #ch = new AAAAAAAAAAAAAAAAAAAABB();

  #dyn_tree = [];
  #static_tree = [];
  #canvas;
  #ctx;
  #running = false;

  // fps stuff
  fps = 0;
  #frame_count = 0;
  #elapsed = 0;

  constructor(display) {
    this.#canvas = display;

    this.#ctx = display.getContext("2d", {
      antialias: true,
      depth: true,
    });

    this.bounds = { width: display.clientWidth, height: display.clientHeight };

    display.addEventListener('mousemove', (e) => this.#mouse_move(e));
    display.addEventListener('click', (e) => this.#mouse_click(e));
    addEventListener('keydown', (e) => this.#key_down(e));
    addEventListener('keyup', (e) => this.#key_up(e));
  }

  #mouse_move(e) {
    this.mousepos = { x: (e.clientX - this.#canvas.offsetLeft), y: (e.clientY - this.#canvas.offsetTop) };
  }

  #mouse_click(e) {
    const clickPos = { x: (e.x - this.#canvas.offsetLeft), y: (e.y - this.#canvas.offsetTop) };
    // if click is within bounds

    // ((clickPos.x >= e.pos.x && clickPos.x <= e.pos.x + e.width) && (clickPos.y >= e.pos.y && clickPos.y <= e.pos.y + e.height))
    const item = this.#dyn_tree.find((e) => this.#ch.check_bounds(clickPos, { x: e.pos.x, y: e.pos.y }, e));

    if (item) {
      item['on_click'](e);
    }
  }

  #key_down(e) {
    const item = this.#dyn_tree.find((el) => el.keys[`${e.key}`] != undefined);
    if (item) {
      item.keys[`${e.key}`] = true;
    }
  }

  #key_up(e) {
    const item = this.#dyn_tree.find((el) => el.keys[`${e.key}`] != undefined);
    if (item) {
      item.keys[`${e.key}`] = false;
    }
  }

  #get_fps() {
    this.fps = this.#frame_count / this.#elapsed;
    if (this.#elapsed >= 10) {
      this.#frame_count = 0;
      this.#elapsed = 0;
    }

    this.#ctx.font = "20px consolas";
    this.#ctx.fillText('Δt ' + this.delta_time, 5, 20);
    this.#ctx.fillText(this.fps.toFixed(1) + ' fps', 5, 40);
  }

  /*
  ----- MAIN LOOP ----
  */

  async #update() {
    this.#ctx.reset();
    this.delta_time = this.time.get_delta();
    this.#get_fps();

    for (let i = 0; i < this.#dyn_tree.length; i++) {
      let element = this.#dyn_tree[i];

      element['process'](this.delta_time);

      element.collision_mask = this.#collision_check(element);


      // collider
      this.#ctx.beginPath();
      this.#ctx.strokeStyle = 'green';
      this.#ctx.lineWidth = '5';
      const local = this.#ch.to_global(element, element.collider);
      this.#ctx.rect(local.x,local.y, element.collider.width, element.collider.height);
      this.#ctx.stroke();
      
      
      this.#ctx.fillStyle = 'black';
      this.#ctx.fillRect(element.pos.x, element.pos.y, element.width, element.height);
      
      this.#ctx.fillStyle = 'red';
      const center = element.get_global_center();
      this.#ctx.fillRect(center.x, center.y, 2, 2);
      
      this.#ctx.fillStyle = 'white';
      this.#ctx.font = "10px consolas";
      this.#ctx.fillText(`${element.collision_mask}`, element.pos.x + 5, element.pos.y + 10);
      /*
      if (element.sprite) {
        this.#ctx.drawImage()
      }
      */


    }

    this.#frame_count++;
    this.#elapsed += this.delta_time;

    if (this.#running) {
      requestAnimationFrame(() => this.#update());
    }
  }

  /*
  -------------------
  */

  // called on every body that has a collider
  #collision_check(node) {
    for (let i = 0; i < this.#dyn_tree.length; i++) {
      // check against each node
      let x = this.#dyn_tree[i];

      // skip if its itself
      if (x.id == node.id) {
        continue;
      }

      let coll_x = this.#ch.check_collision_x(node, x);
      let coll_y = this.#ch.check_collision_y(node, x);
    
      if (coll_x && coll_y) {
        
      }
    }
    return {
      x: 0,
      y: 0,
    }
  }


  // public stuff
  start() {
    this.#running = true;
    this.delta_time = Date.now(); // init delta_time
    this.time.init(); // init timing function
    this.#update();
  }

  register(element) {
    if (element.mode == Physics.DYNAMIC) {
      this.#dyn_tree.push(element);
    }
    console.log(element.id);
  }
}