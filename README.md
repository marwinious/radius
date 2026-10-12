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
    user: { name: 'Alice', role: 'admin' }
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