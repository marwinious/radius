//#region src/radius.js
function createState(initialState = {}) {
	let state = initialState;
	const listeners = /* @__PURE__ */ new Set();
	return {
		getState: (selector) => {
			if (typeof selector === "function") return selector(state);
			else if (selector !== void 0 && selector !== null) return state[selector];
			return state;
		},
		setState: (updater, runListeners = true) => {
			if (typeof updater === "function") state = updater(state);
			else state = {
				...state,
				...updater
			};
			if (runListeners === true) listeners.forEach((fn) => fn(state));
		},
		subscribe: (fn) => {
			listeners.add(fn);
			return () => listeners.delete(fn);
		},
		watch: (selector, callback) => {
			let selectFn = selector;
			if (typeof selector !== "function") selectFn = (state) => state[selector];
			let prevValue = selectFn(state);
			const watcherListener = (nextState) => {
				const nextValue = selectFn(nextState);
				if (!Object.is(prevValue, nextValue)) {
					const oldValue = prevValue;
					prevValue = nextValue;
					callback(nextValue, oldValue);
				}
			};
			listeners.add(watcherListener);
			return () => listeners.delete(watcherListener);
		}
	};
}
//#endregion
export { createState };
