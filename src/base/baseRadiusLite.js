
export class RadiusLiteBase {

    #state = {};
    #subscribers = [];
    #actions = {};

    constructor(initialState = {}) {
        this.#state = initialState;
    }

    subscribe(callbackFn) {
        // Make sure we're getting a function for the callback
        if(typeof callbackFn !== 'function') { throw new Error("Subscriber callbacks must be functions") }

        // Add subscriber callback to subscribers list
        this.#subscribers.push(callbackFn);
    }

    unsubscribe(callbackFn) {
        // Find subscriber in list
        const subscriberIndex = this.#subscribers.indexOf(callbackFn);

        // If subscriber is found
        if(subscriberIndex >= 0) {
            // Remove from subscribers array
            this.#subscribers.splice(subscriberIndex, 1);
        }
    }

    addAction(actionName, mutatorFn) {
        // Make sure we're getting a function for the callback
        if(typeof mutatorFn !== 'function') { throw new Error("Action callbacks must be functions") } 

        // Add action to list of actions
        this.#actions[actionName] = mutatorFn;
    }

    runAction(actionName, ...args) {
        const action = this.#actions[actionName];
        if(action) {
            const newState = action(this.#state, ...args);
            if(newState) {
                this.state = newState;
            }
        }
        else {
            console.warn(`Action "${actionName}" not found"`);
        }
    }

    notify() {
        // Loop through subscribers
        this.#subscribers.forEach((subscriber) => 
            // Call the subscriber's callback and pass the current state
            subscriber(this.state)
        )
    }

    get state() { return this.#state }
    set state(newState) {
        // Merge current state with new state
        this.#state = {...this.#state, ...newState}

        // Notify subscribers of changes to state
        this.notify();
    }
}