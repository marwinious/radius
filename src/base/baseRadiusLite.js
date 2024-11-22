
export class RadiusLiteBase {

    #state = {};
    #subscribers = [];

    constructor(initialState = {}) {
        this.#state = initialState;
    }

    subscribe(callbackFn) {
        // Make sure we're getting a function for the callback
        if(typeof callbackFn !== 'function') { throw new Error("Subscriber callbacks must be functions") } 
    }

    get state() { return this.#state }
    set state(newState) {
        // Merge current state with new state
        this.#state = {...this.#state, ...newState}

        // Notify subscribers of changes to state
    }
}