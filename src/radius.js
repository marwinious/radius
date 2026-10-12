export function createState(initialState = {}) {
    // Init
    let state = initialState;
    const listeners = new Set();

    return {
        getState: (selector) => {
            // Check selector type
            if(typeof selector === 'function') {
                // If function is passed, return the result of that function with state as the param
                return selector(state);
            }
            else if(selector !== undefined && selector !== null) {
                // Selector is not undefined/null. Attempt to return the specified piece of state.
                return state[selector];
            }

            // If no selector was passed, return full state snapshot
            return state;
        },
        setState: (updater, runListeners = true) => {
            // Check updater type
            if (typeof updater === "function") {
                // If function is passed, run function and pass in current state. Store result as new state.
                state = updater(state)
            } else {
                // If not a function, spread updater values in with current state.
                state = { ...state, ...updater }
            }

            // Check if listeners should run on state updates
            if (runListeners === true) {
                // Run listeners
                listeners.forEach((fn) => fn(state))
            }
        },
        subscribe: (fn) => {
            // Add the listener function to the listeners set
            listeners.add(fn)

            // Return the unsubscribe method
            return () => listeners.delete(fn)
        },
        watch: (selector, callback) => {
            // Set original value when watcher is created
            let prevValue = selector(state)

            // Create the internal subscriber function
            const watcherListener = (nextState) => {
                // Get the "new state" value supplied in the watch call
                const nextValue = selector(nextState)

                // Check if the previous and new values are different
                if (!Object.is(prevValue, nextValue)) {
                    // The values are different.
                    // Preserve the previous value before updating it with the new value
                    const oldValue = prevValue;

                    // Update the previous value with the new value for future comparisons
                    prevValue = nextValue

                    // Run the watcher's callback, passing the new and old values
                    callback(nextValue, oldValue)
                }
            }

            // Add the new watch subscriber to listeners.
            // This wraps the watcher's callback in our custom method above to prevent calling it until conditions are met.
            listeners.add(watcherListener)

            // Return cleanup function (just like subscribe does) to delete just this watcher
            return () => listeners.delete(watcherListener)
        }
    }
}
