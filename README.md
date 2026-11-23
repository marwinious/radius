# Radius: Javascript State Manager
This is a simple, drop-in javascript state management library intended for small or medium projects that don't need a lot of the "extras".

Radius is framework-agnostic and can be used in anything from Vanilla JS to React to Vue to Lit and more.

## Creating new `state`

The basic usage of Radius is creating a new `state` object for your project.

**Basic example:**
```javascript
import { createState } from 'path-to-radius'

const state = createState();
```

**Create with default state:**
```javascript
import { createState } from 'path-to-radius'

const defaultState = {
    count: 0,
    theme: 'dark'
}

const state = createState(defaultState);
```

## Working with `state`

Once your new state object is created, you'll want to be able to set and get that state.

**Get all `state`:**
```javascript
import { createState } from 'path-to-radius'

const defaultState = {
    count: 0,
    theme: 'dark'
}

const state = createState(defaultState);

const currentState = state.getState();
```

**Get single property from `state`:**
```javascript
import { createState } from 'path-to-radius'

const defaultState = {
    count: 0,
    theme: 'dark'
}

const state = createState(defaultState);

const currentState = state.getState('count');
```

**Get single property from `state`:**
```javascript
import { createState } from 'path-to-radius'

const defaultState = {
    count: 0,
    theme: 'dark'
}

const state = createState(defaultState);

const currentState = state.getState('count');
```

Radius supports retrieving `nested state properties` via custom selector functions. Create a selector function to get the data you want from state and pass it into `getState()`

**Using custom selectors to get `state`:**
```javascript
import { createState } from 'path-to-radius'

const defaultState = {
    count: 0,
    theme: 'dark',
    user: { name: 'Alice', role: 'admin' }
    items: [10, 20, 30]
}

const state = createState(defaultState);

const currentState = state.getState((state) => state.user.name);
// currentState would equal 'Alice'
```

```javascript
import { createState } from 'path-to-radius'

const defaultState = {
    count: 0,
    theme: 'dark',
    user: { name: 'Alice', role: 'admin' },
    items: [10, 20, 30]
}

const state = createState(defaultState);

const totalSum = state.getState((state) => 
    state.items.reduce((sum, n) => sum + n, 0)
);
// totalSum would equal 60
```

## Setting `State`

Setting state in Radius is flexible, allowing you to pass either an object or a custom updater function.

**Basic `state` setting**
```javascript
import { createState } from 'path-to-radius'

const defaultState = {
    count: 0,
    theme: 'dark',
    user: { name: 'Alice', role: 'admin' },
    items: [10, 20, 30]
}

const state = createState(defaultState);

state.setState({ count: 1})
// .getState() would now show count equal to 1 instead of the initial 0

// You can set multiple properties at once
state.setState({
    count: 2,
    theme: 'light'
})
```

**Setting `state` without notifying subscribers**
There might be times where you want to set or update state without triggering reactions from listeners/subscribers.

```javascript
import { createState } from 'path-to-radius'

const defaultState = {
    count: 0,
    theme: 'dark',
    user: { name: 'Alice', role: 'admin' },
    items: [10, 20, 30]
}

const state = createState(defaultState);

state.setState({ count: 1}, false) // Use false as the second (optional) parameter
// This will update count to 1 in state without triggering subscriber callbacks
```

**Calculating `next values` based on current `state`**
By passing a function into .setState(), you can add actions and custom calculations to dynamically determine what the state update will be, without the need for external logic/methods.

```javascript
import { createState } from 'path-to-radius'

const defaultState = {
    count: 0,
    theme: 'dark',
    user: { name: 'Alice', role: 'admin' },
    items: [10, 20, 30]
}

const state = createState(defaultState);

state.setState((currentState) => ({
    ...currentState,
    count: currentState.count + 1
}))
```

**Immutably updating arrays (adding/removing/filtering)**

```javascript
import { createState } from 'path-to-radius'

const defaultState = {
    count: 0,
    theme: 'dark',
    user: { name: 'Alice', role: 'admin' },
    items: [10, 20, 30]
}

const state = createState(defaultState);

// Add an item to an array immutably using array spread
state.setState((prev) => ({
    ...prev,
    items: [...prev.items, 'Item 2']
}));

// Remove an item using array filter
state.setState((prev) => ({
    ...prev,
    items: prev.items.filter((item) => item !== 'Item 1')
}));
```

**Safely updating nested objects in `state`**
```javascript
import { createState } from 'path-to-radius'

const defaultState = {
    count: 0,
    theme: 'dark',
    user: { name: 'Alice', role: 'admin' },
    items: [10, 20, 30]
}

const state = createState(defaultState);

// Update user's name while retaining user's role and all other state keys
state.setState((prev) => ({
    ...prev,
    user: {
        ...prev.user,
        name: 'Alice Smith'
    }
}));
```

**Toggling boolean flags**
```javascript
import { createState } from 'path-to-radius'

const defaultState = {
    count: 0,
    theme: 'dark',
    user: { name: 'Alice', role: 'admin' },
    items: [10, 20, 30],
    isSidebarOpen: false
}

const state = createState(defaultState);

// Invert boolean state cleanly
state.setState((prev) => ({
    ...prev,
    isSidebarOpen: !prev.isSidebarOpen,
}));
```

## Subscribers/Listeners

You can easily subscriber/listen to state changes using either `.subscribe()` or `.watch()`

**Subscribe to `state` changes**
You can subscribe to general state changes using this example:

```javascript
import { createState } from 'path-to-radius'

const defaultState = {
    count: 0,
    theme: 'dark',
    user: { name: 'Alice' }
}

const state = createState(defaultState);

// Create subscription. This returns the unsubscribe method.
const unsubscribeLogger = state.subscribe((newState) => {
    console.log('[State Updated]:', newState);
})

// Trigger a state change
state.setState({ theme: 'light' });
// console output: [Store Updated]: { count: 0, user: { name: 'Alice' }, theme: 'light' }

// Unsubscribe when finished
unsubscribeLogger();

// Trigger another state change
state.setState({ theme: 'dark' });
// (No console output)
```

**Synchronizing multiple UI components**
```javascript
const counterDisplay = document.querySelector('#counter');
const themeBadge = document.querySelector('#theme-badge');

// Component A: Listens for counter updates
const unsubCounter = state.subscribe((newState) => {
    counterDisplay.textContent = `Current Count: ${newState.count}`;
});

// Component B: Listens for theme updates
const unsubTheme = state.subscribe((newState) => {
    themeBadge.setAttribute('data-theme', newState.theme);
});

// Updating state triggers BOTH subscribers
state.setState({ count: 5, theme: 'dark' });
```

**Subscribing to a single state property (`watch()`)**
Using `.subscribe()` listens for any/all state changes. If you only want to monitor changes on a single property of `state`, use `.watch()`.

`.watch()` is only looks for CHANGED data. If a watched property is updated in `state` but the value does not change, subscribed callbacks will NOT FIRE.

The callback receives both the updated value and the previous value.

```javascript
import { createState } from './radius_state_manager.js';

const state = createState({
    count: 0,
    user: {
        name: 'Alice',
        settings: { theme: 'light' }
    },
    items: ['Item A', 'Item B']
});

// Watch only the 'count' property
const unwatchCount = state.watch(
    (currentState) => currentState.count,
    (newCount, oldCount) => {
        console.log(`[Watch]: Count changed from ${oldCount} to ${newCount}`);
    }
);

// Updating 'theme' -> Watcher DOES NOT fire
state.setState({ user: { ...state.getState('user'), settings: { theme: 'dark' } } });

// Updating 'count' with the SAME value (0) -> Watcher DOES NOT fire
store.setState({ count: 0 });

// Updating 'count' with a NEW value (1) -> Watcher FIRES
store.setState({ count: 1 });
// Console Output: "[Watch]: Count changed from 0 to 1"

// Clean up watcher when component or page unmounts
unwatchCount();
```

You can also setup a top-level watcher for a property using the string key of that property.

```javascript
// String key (for top-level properties)
store.watch('count', (newCount, oldCount) => {
    console.log(`Count: ${oldCount} -> ${newCount}`);
});
```

**Watching deeply nested properties**

Because `.watch()` uses selector functions `(state) => value`, watching nested objects works natively without string-path parsing (`'user.settings.theme'`).

```javascript
import { createState } from './radius_state_manager.js';

const state = createState({
    count: 0,
    user: {
        name: 'Alice',
        settings: { theme: 'light' }
    },
    items: ['Item A', 'Item B']
});

// Watch the nested 'theme' setting specifically
state.watch(
    (currentState) => currentState.user.settings.theme,
    (newTheme, oldTheme) => {
        document.body.setAttribute('data-theme', newTheme);
        console.log(`[Theme Watcher]: Theme updated from ${oldTheme} to ${newTheme}`);
    }
);

// Updating user name DOES NOT trigger the theme watcher
state.setState((prev) => ({
    user: { ...prev.user, name: 'Alice Smith' },
}));

// Updating theme DOES trigger the watcher
state.setState((prev) => ({
    user: {
        ...prev.user,
        settings: { theme: 'dark' },
    },
}));
// Console Output: "[Theme Watcher]: Theme updated from light to dark"
```

**Watching computed/derived values**

You can pass a function that computes a result from state (like calculating totals, array lengths, or filtered lists). The watcher only fires if the **computed result** changes.

```javascript
const cartStore = createState({
    items: [
        { name: 'Book', price: 15 },
        { name: 'Pen', price: 5 }
    ],
    couponCode: null
});

// Watch total cart price
cartStore.watch(
    (state) => state.items.reduce((sum, item) => sum + item.price, 0),
    (newTotal, oldTotal) => {
        console.log(`[Cart Watcher]: Total changed from $${oldTotal} to $${newTotal}`);
    }
);

// Applying a coupon code changes state, but NOT the item prices -> Watcher DOES NOT fire
cartStore.setState({ couponCode: 'SUMMER10' });

// Adding an item changes the computed sum -> Watcher FIRES
cartStore.setState((prev) => ({
    items: [...prev.items, { name: 'Notebook', price: 10 }],
}));
// Console Output: "[Cart Watcher]: Total changed from $20 to $30"
```

**Direct DOM & side-effect binding**

`.watch()` is ideal for syncing state directly to local storage, network calls, or specific DOM elements without re-rendering an entire UI.

```javascript
const appStore = createState({
    authToken: null,
    isLoggedIn: false,
});

// Sync token to localStorage whenever it changes
appStore.watch(
    (state) => state.authToken,
    (newToken) => {
        if (newToken) {
            localStorage.setItem('auth_token', newToken);
        } else {
            localStorage.removeItem('auth_token');
        }
    }
);

// Toggle login modal visibility based on status
appStore.watch(
    (state) => state.isLoggedIn,
    (isLoggedIn) => {
        const modal = document.querySelector('#login-modal');
        modal.style.display = isLoggedIn ? 'none' : 'block';
    }
);

// Trigger both side-effects automatically:
appStore.setState({
    authToken: 'abc-123-token',
    isLoggedIn: true,
});
```

**Multiple, independent watchers & isolation**

Multiple watchers can monitor the same or different properties simultaneously. Unsubscribing one watcher will never interfere with active watchers.

```javascript
const store = createState({ count: 0, title: 'Dashboard' });

const unwatchCount = store.watch(
    (state) => state.count,
    (count) => console.log('Count:', count)
);

const unwatchTitle = store.watch(
    (state) => state.title,
    (title) => console.log('Title:', title)
);

// Unwatch 'count' only
unwatchCount();

// Update both properties
store.setState({ count: 10, title: 'Analytics' });
// Console Output: "Title: Analytics"
// ('count' watcher is unsubscribed and did not fire)
```