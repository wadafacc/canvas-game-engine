export class Time {
  #start_time;
  #last_time;

  init() {
    this.#last_time = Date.now();
    this.#start_time = Date.now();
  }

  get_delta() {
    let current_time = Date.now();

    let delta = (current_time - this.#last_time) / 1000;
    this.#last_time = current_time;

    return delta;
  }

  get_elapsed() {
    return Date.now() - this.#start_time;
  }
}