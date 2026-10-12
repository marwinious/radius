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

**Getting state:**
```javascript
import { createState } from 'path-to-radius'

const defaultState = {
    count: 0,
    theme: 'dark'
}

const state = createState(defaultState);

const currentState = state.getState();
```