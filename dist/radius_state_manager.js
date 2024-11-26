class u {
  #t = {};
  #s = {};
  #i = {};
  constructor() {
  }
  getState(t) {
    return this.#t[t] || {};
  }
  setState(t, s) {
    this.initEvent(t);
    const i = this.#t[t];
    return this.#t[t] = { ...this.#t[t], ...s }, this.notify(t), {
      event: t,
      newState: s,
      previousState: i
    };
  }
  subscribe(t, s) {
    if (typeof s != "function")
      throw new Error("Subscriber callbacks must be functions");
    return this.initEvent(t), this.#s[t].push(s), {
      event: t,
      callback: s,
      unsubscribe: () => {
        this.unsubscribe(t, s);
      }
    };
  }
  initEvent(t) {
    this.#t[t] ? console.warn(`Event "${t}" already exists`) : (this.#t[t] = {}, this.#s[t] = []);
  }
  unsubscribe(t, s) {
    let i = !1;
    return this.#s[t] = this.#s[t].filter((r) => (r === s && (i = !0), r !== s)), i ? {
      event: t,
      unsubscribedCallback: s
    } : {
      event: t,
      unsubscribedCallback: "not found"
    };
  }
  addAction(t, s, i) {
    if (typeof i != "function")
      throw new Error("Action callbacks must be functions");
    return this.#i[t] || (this.#i[t] = {}), this.#i[t][s] = i, {
      event: t,
      actionName: s,
      mutator: i
    };
  }
  runAction(t, s, ...i) {
    const r = this.#i[t]?.[s];
    if (r) {
      const e = r(this.#t[t], ...i);
      if (e) {
        const o = this.getState(t);
        return this.setState(t, e), {
          newState: this.getState(t),
          previousState: o
        };
      }
    } else
      console.warn(`Action "${s}" for event "${t}" not found`);
  }
  notify(t) {
    const s = [], i = this.getState(t);
    return this.#s.hasOwnProperty(t) && this.#s[t].forEach((r) => {
      r(i), s.push(r);
    }), {
      event: t,
      notifiedSubscribers: s
    };
  }
}
class h extends u {
  constructor() {
    super();
  }
}
class c {
  #t = {};
  #s = [];
  #i = {};
  constructor(t = {}) {
    this.#t = t;
  }
  subscribe(t) {
    if (typeof t != "function")
      throw new Error("Subscriber callbacks must be functions");
    return this.#s.push(t), {
      callback: t,
      unsubscribe: () => {
        this.unsubscribe(t);
      }
    };
  }
  unsubscribe(t) {
    const s = this.#s.indexOf(t);
    if (s >= 0)
      return this.#s.splice(s, 1), {
        unsubscribedCallback: t
      };
  }
  addAction(t, s) {
    if (typeof s != "function")
      throw new Error("Action callbacks must be functions");
    return this.#i[t] = s, {
      actionName: t,
      mutator: s
    };
  }
  runAction(t, ...s) {
    const i = this.#i[t], r = this.state;
    if (i) {
      const e = i(this.#t, ...s);
      if (e)
        return this.state = e, {
          actionName: t,
          newState: e,
          previousState: r
        };
    } else
      console.warn(`Action "${t}" not found`);
  }
  notify() {
    const t = [];
    return this.#s.forEach(
      (s) => {
        s(this.state), t.push(s);
      }
    ), {
      notifiedSubscribers: t
    };
  }
  get state() {
    return this.#t;
  }
  set state(t) {
    this.#t = { ...this.#t, ...t }, this.notify();
  }
}
class a extends c {
  constructor() {
    super();
  }
}
export {
  h as Radius,
  a as RadiusLite
};
//# sourceMappingURL=radius_state_manager.js.map
