
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

        // Return
        return {
            callback: callbackFn,
            unsubscribe: () => { this.unsubscribe(callbackFn) }
        }
    }

    unsubscribe(callbackFn) {
        // Find subscriber in list
        const subscriberIndex = this.#subscribers.indexOf(callbackFn);

        // If subscriber is found
        if(subscriberIndex >= 0) {
            // Remove from subscribers array
            this.#subscribers.splice(subscriberIndex, 1);

            return {
                unsubscribedCallback: callbackFn
            }
        }
    }

    addAction(actionName, mutatorFn) {
        // Make sure we're getting a function for the callback
        if(typeof mutatorFn !== 'function') { throw new Error("Action callbacks must be functions") } 

        // Add action to list of actions
        this.#actions[actionName] = mutatorFn;

        // Return
        return {
            actionName: actionName,
            mutator: mutatorFn
        }
    }

    runAction(actionName, ...args) {
        const action = this.#actions[actionName];
        const previousState = this.state;

        if(action) {
            const newState = action(this.#state, ...args);
            if(newState) {
                this.state = newState;

                return {
                    actionName: actionName,
                    newState: newState,
                    previousState: previousState
                }
            }
        }
        else {
            console.warn(`Action "${actionName}" not found`);
        }
    }

    notify() {
        const notifiedSubscribers = [];

        // Loop through subscribers
        this.#subscribers.forEach((subscriber) => {
                // Call the subscriber's callback and pass the current state
                subscriber(this.state)
                notifiedSubscribers.push(subscriber)
            }
        )

        return {
            notifiedSubscribers: notifiedSubscribers
        }
    }

    get state() { return this.#state }
    set state(newState) {
        // Merge current state with new state
        this.#state = {...this.#state, ...newState}

        // Notify subscribers of changes to state
        this.notify();
    }
}