import { Time } from './time.js';
import { Comparator } from './comparator.js';
import { AAAAAAAAAAAAAAAAAAAABB } from './aaaaaaaaaaaaaaaaaaaabb.js';

export class Engine {
  bounds;
  mousepos; // x : y
  gravity = { x: 0, y: 0 }; // godot-style

  time = new Time();
  #comp = new Comparator();
  #coordhandler = new AAAAAAAAAAAAAAAAAAAABB();

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

    // ((clickPos.x >= e.position.x && clickPos.x <= e.position.x + e.width) && (clickPos.y >= e.position.y && clickPos.y <= e.position.y + e.height))
    const item = this.#dyn_tree.find((e) => this.#coordhandler.check_bounds(clickPos, { x: e.position.x, y: e.position.y }, e));

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
    this.time.init(); // init timing function
    while (this.#running) {
      this.#ctx.reset();
      this.delta_time = this.time.get_delta();
      this.#get_fps();

      for (let i = 0; i < this.#dyn_tree.length; i++) {
        let element = this.#dyn_tree[i];
        element['process'](this.delta_time);

        // out of bounds check
        if (element.position.x > this.bounds.x | element.position.y > this.bounds.y) {
          console.log("t")
          return;
        }

        this.#ctx.fillRect(element.position.x, element.position.y, element.width, element.height);

        this.#ctx.fillStyle = 'blue';
        this.#ctx.fillRect(element.position.x, element.position.y, 5, 5);
        /*
        if (element.sprite) {
          this.#ctx.drawImage()
        }
        */
      }

      this.#frame_count++;
      this.#elapsed += this.delta_time;
      await new Promise(res => setTimeout(res, 0.1));  // needed; Javascript is single thread, meaning infinite loops lead to a softlock that stops everything else from loading
    }
  }

  /*
  -------------------
  */


  // public stuff
  start() {
    this.#running = true;
    this.delta_time = Date.now(); // init delta_time
    this.#update();
  }

  register(element) {
    this.#dyn_tree.push(element);
    console.log(this.#dyn_tree);
  }
}