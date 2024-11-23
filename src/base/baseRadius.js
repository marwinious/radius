
export class RadiusBase {

    #states = {}
    #events = {};
    #actions = {};

    constructor() {
        
    }

    getState(event) {
        return this.#states[event] || {};
    }

    setState(event, newState) {
        // Init event state and subscribers if it doesn't exist
        this.initEvent(event);

        // Merge new state with current state
        this.#states[event] = {...this.#states[event], ...newState}

        // Notify event subscribers of event state changes
        this.notify(event);
    }

    subscribe(event, callbackFn) {
        // Make sure we're getting a function for the callback
        if(typeof callbackFn !== 'function') { throw new Error("Subscriber callbacks must be functions") } 

        // Init event if it doesn't exist
        this.initEvent(event);

        // Add callback to event
        this.#events[event].push(callbackFn) 
    }

    initEvent(event) {
        if(!this.#states[event]) { 
            this.#states[event] = {};
            this.#events[event] = [];
        }
    }

    unsubscribe(event, callbackFn) {
        // Filter event to only items that do not match the callbackFn (it will be omitted)
        this.#events[event] = this.#events[event].filter((sub) => {
            return sub !== callbackFn
        })
    }

    addAction(event, actionName, mutatorFn) {
        // Make sure we're getting a function for the callback
        if(typeof mutatorFn !== 'function') { throw new Error("Action callbacks must be functions") } 

        // Initialize the event category if it doesn't exist
        if(!this.#actions[event]) { 
            this.#actions[event] = {} 
        }

        // Add action to list of actions
        this.#actions[event][actionName] = mutatorFn;
    }

    runAction(event, actionName, ...args) {
        const action = this.#actions[event]?.[actionName];
        if(action) {
            const newState = action(this.#states[event], ...args);
            if(newState) {
                this.setState(event, newState);
            }
        }
        else {
            console.warn(`Action "${actionName}" for event "${event} not found"`);
        }
    }

    notify(event) {
        if(this.#events.hasOwnProperty(event)) {
            this.#events[event].forEach((subscriber) => {
                subscriber(this.getState(event));
            })
        }
    }

}