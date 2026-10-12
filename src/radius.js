export function createState(initialState = {}) {
    // Init
    let state = initialState;
    const listeners = new Set();

    return {
        getState: () => state,
        setState: (updater) => {
            if(typeof updater === 'function') {
                // If function is passed, run function and pass in current state. Store result as new state.
                state = updater(state);
            }
            else {
                // If not a function, spread updater values in with current state.
                state = {...state, ...updater}
            }
        },
        subscribe: (fn) => {
            listeners.add(fn);
            return () => listeners.delete(fn);
        }
    }
}