
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
        const previousState = this.#states[event];

        // Merge new state with current state
        this.#states[event] = {...this.#states[event], ...newState}

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
        this.#events[event].push(callbackFn) 

        // Return
        return {
            event: event,
            callback: callbackFn,
            unsubscribe: () => { this.unsubscribe(event, callbackFn) }
        }

    }

    initEvent(event) {
        if(!this.#states[event]) { 
            this.#states[event] = {};
            this.#events[event] = [];
        }
        else {
            console.warn(`Event "${event}" already exists`)
        }
    }

    unsubscribe(event, callbackFn) {
        let unsubscribedFromEvent = false;

        // Filter event to only items that do not match the callbackFn (it will be omitted)
        this.#events[event] = this.#events[event].filter((sub) => {
            if(sub === callbackFn) { unsubscribedFromEvent = true }
            return sub !== callbackFn
        })

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
            this.#actions[event] = {} 
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
            })
        }

        return { 
            event: event,
            notifiedSubscribers: notifiedSubscribers
        }
    }

}