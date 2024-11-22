class e {
  #t = {};
  #s = {};
  constructor() {
  }
  getState(s) {
    return this.#t[s] || {};
  }
  setState(s, t) {
    this.initEvent(s), this.#t[s] = { ...this.#t[s], ...t }, this.notify(s);
  }
  subscribe(s, t) {
    if (typeof t != "function")
      throw new Error("Subscriber callbacks must be functions");
    this.initEvent(s), this.#s[s].push(t);
  }
  initEvent(s) {
    this.#t[s] || (this.#t[s] = {}, this.#s[s] = []);
  }
  unsubscribe(s, t) {
    this.#s[s] = this.#s[s].filter((r) => r !== t);
  }
  notify(s) {
    this.#s.hasOwnProperty(s) && this.#s[s].forEach((t) => {
      t(this.getState(s));
    });
  }
}
class u extends e {
  constructor() {
    super();
  }
}
class h {
  #t = {};
  #s = [];
  constructor(s = {}) {
    this.#t = s;
  }
  subscribe(s) {
    if (typeof s != "function")
      throw new Error("Subscriber callbacks must be functions");
    this.#s.push(s);
  }
  unsubscribe(s) {
    const t = this.#s.indexOf(s);
    t >= 0 && this.#s.splice(t, 1);
  }
  notify() {
    this.#s.forEach(
      (s) => (
        // Call the subscriber's callback and pass the current state
        s(this.state)
      )
    );
  }
  get state() {
    return this.#t;
  }
  set state(s) {
    this.#t = { ...this.#t, ...s }, this.notify();
  }
}
class c extends h {
  constructor() {
    super();
  }
}
export {
  u as Radius,
  c as RadiusLite
};
//# sourceMappingURL=radius_state_manager.js.map
