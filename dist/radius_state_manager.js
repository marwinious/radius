class RadiusBase {

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
        const previousState = this.#states[event];

        // Merge new state with current state
        this.#states[event] = {...this.#states[event], ...newState};

        // Notify event subscribers of event state changes
        this.notify(event);

        // Return
        return {
            event: event,
            newState: newState,
            previousState: previousState
        }
    }

    subscribe(event, callbackFn) {
        // Make sure we're getting a function for the callback
        if(typeof callbackFn !== 'function') { throw new Error("Subscriber callbacks must be functions") } 

        // Init event if it doesn't exist
        this.initEvent(event);

        // Add callback to event
        this.#events[event].push(callbackFn); 

        // Return
        return {
            event: event,
            callback: callbackFn,
            unsubscribe: () => { this.unsubscribe(event, callbackFn); }
        }

    }

    initEvent(event) {
        if(!this.#states[event]) { 
            this.#states[event] = {};
            this.#events[event] = [];
        }
    }

    unsubscribe(event, callbackFn) {
        let unsubscribedFromEvent = false;

        // Filter event to only items that do not match the callbackFn (it will be omitted)
        this.#events[event] = this.#events[event].filter((sub) => {
            if(sub === callbackFn) { unsubscribedFromEvent = true; }
            return sub !== callbackFn
        });

        if(unsubscribedFromEvent) {
            return {
                event: event,
                unsubscribedCallback: callbackFn
            }
        }

        return {
            event: event,
            unsubscribedCallback: "not found"
        }

    }

    addAction(event, actionName, mutatorFn) {
        // Make sure we're getting a function for the callback
        if(typeof mutatorFn !== 'function') { throw new Error("Action callbacks must be functions") } 

        // Initialize the event category if it doesn't exist
        if(!this.#actions[event]) { 
            this.#actions[event] = {}; 
        }

        // Add action to list of actions
        this.#actions[event][actionName] = mutatorFn;

        return {
            event: event,
            actionName: actionName,
            mutator: mutatorFn
        }
    }

    runAction(event, actionName, ...args) {
        const action = this.#actions[event]?.[actionName];
        if(action) {
            const newState = action(this.#states[event], ...args);
            if(newState) {
                const previousState = this.getState(event);
                this.setState(event, newState);

                return {
                    newState: this.getState(event),
                    previousState: previousState
                }
            }
        }
        else {
            console.warn(`Action "${actionName}" for event "${event}" not found`);
        }
    }

    notify(event) {
        const notifiedSubscribers = [];
        const eventState = this.getState(event);

        if(this.#events.hasOwnProperty(event)) {
            this.#events[event].forEach((subscriber) => {
                subscriber(eventState);
                notifiedSubscribers.push(subscriber);
            });
        }

        return { 
            event: event,
            notifiedSubscribers: notifiedSubscribers
        }
    }

}

class Radius extends RadiusBase {

    constructor() {
        super();
    }

}

class RadiusLiteBase {

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
            unsubscribe: () => { this.unsubscribe(callbackFn); }
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
                subscriber(this.state);
                notifiedSubscribers.push(subscriber);
            }
        );

        return {
            notifiedSubscribers: notifiedSubscribers
        }
    }

    get state() { return this.#state }
    set state(newState) {
        // Merge current state with new state
        this.#state = {...this.#state, ...newState};

        // Notify subscribers of changes to state
        this.notify();
    }
}

class RadiusLite extends RadiusLiteBase {

    constructor() {
        super();
    }
    
}

export { Radius, RadiusLite };
//# sourceMappingURL=radius_state_manager.js.map
