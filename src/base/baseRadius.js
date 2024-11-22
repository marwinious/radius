
export class RadiusBase {

    #state = {}
    #listeners = [];

    constructor(initialState={}) {
        this.#state = initialState;
    }

    subscribe(listener) {
        /*
        This is where we need to allow for event names to subscribe to and then notifications need to be event-based.'
        If we only allow a general subscription, then all listeners will fire on any event that causes the state to change.
        This ios important if we want to use this as a singleton for multiple scenarios (e.g. global to app, app feature, single component/file, etc.)
        */
    }

    notify() {
        this.#listeners.forEach((listener) => { listener(this.state) }) // Trigger listener callback and pass current state
    }

    get state() { return this.#state }
    set state(newState) {
        this.#state = {...this.#state, ...newState} // Merge new state with current state
        this.notify() // Notify listeners of state changes
    }
}