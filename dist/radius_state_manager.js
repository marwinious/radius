class c {
  #t = {};
  #s = {};
  #i = {};
  constructor() {
  }
  getState(t) {
    return this.#t[t] || {};
  }
  setState(t, s) {
    this.initEvent(t), this.#t[t] = { ...this.#t[t], ...s }, this.notify(t);
  }
  subscribe(t, s) {
    if (typeof s != "function")
      throw new Error("Subscriber callbacks must be functions");
    this.initEvent(t), this.#s[t].push(s);
  }
  initEvent(t) {
    this.#t[t] || (this.#t[t] = {}, this.#s[t] = []);
  }
  unsubscribe(t, s) {
    this.#s[t] = this.#s[t].filter((i) => i !== s);
  }
  addAction(t, s, i) {
    if (typeof i != "function")
      throw new Error("Action callbacks must be functions");
    this.#i[t] || (this.#i[t] = {}), this.#i[t][s] = i;
  }
  runAction(t, s, ...i) {
    const o = this.#i[t]?.[s];
    if (o) {
      const r = o(this.#t[t], ...i);
      r && this.setState(t, r);
    } else
      console.warn(`Action "${s}" for event "${t}" not found`);
  }
  notify(t) {
    this.#s.hasOwnProperty(t) && this.#s[t].forEach((s) => {
      s(this.getState(t));
    });
  }
}
class e extends c {
  constructor() {
    super();
  }
}
class h {
  #t = {};
  #s = [];
  #i = {};
  constructor(t = {}) {
    this.#t = t;
  }
  subscribe(t) {
    if (typeof t != "function")
      throw new Error("Subscriber callbacks must be functions");
    this.#s.push(t);
  }
  unsubscribe(t) {
    const s = this.#s.indexOf(t);
    s >= 0 && this.#s.splice(s, 1);
  }
  addAction(t, s) {
    if (typeof s != "function")
      throw new Error("Action callbacks must be functions");
    this.#i[t] = s;
  }
  runAction(t, ...s) {
    const i = this.#i[t];
    if (i) {
      const o = i(this.#t, ...s);
      o && (this.state = o);
    } else
      console.warn(`Action "${t}" not found`);
  }
  notify() {
    this.#s.forEach(
      (t) => (
        // Call the subscriber's callback and pass the current state
        t(this.state)
      )
    );
  }
  get state() {
    return this.#t;
  }
  set state(t) {
    this.#t = { ...this.#t, ...t }, this.notify();
  }
}
class u extends h {
  constructor() {
    super();
  }
}
export {
  e as Radius,
  u as RadiusLite
};
//# sourceMappingURL=radius_state_manager.js.map
