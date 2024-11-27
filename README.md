# Radius Javascript State Manager
This is a simple, drop-in javascript state management library intended for small or medium projects that don't need a lot of the "extras". 

Radius uses a simple pub/sub pattern and offers 2 flavors: Simple subscriptions and Event Subscriptions.

## Event Subscriptions
The core Radius usage is to allow subscribers to attach to an "event" via a passed-in label which links that subscriber to the state for _that_ event and no others that might have been registered.

This allows for singelton of Radius to provide app-wide state management without running _all_ subscriber callbacks on _any_ state change, even those that a given subscriber might not care about.

Example usage:

```javascript
import { Radius } from './path/to/radius'

// Init Radius
const radius = new Radius();
const myEventLabel = 'some-event-label';

// Define a callback for your subscription. Keep this handy if you want to unsubscribe later.
const someCallback = (data) => { console.log('The data from my callback is: ', data) }

// Subscribe to an event
radius.subscribe(myEventLabel, someCallback);

// Add some data to the state for this event
radius.setState(myEventLabel, { test: "This is a test value in my state data" })
```

Expected output:

```
The data from my callback is: { 
    test: "This is a test value in my state data" 
}
```

**To unsubscribe from an event:**
To programatically unsubscribe from an event you will need to retain a reference to the callback that was part of the original subscription and pass that into the unsubscribe method.

```javascript
import { Radius } from './path/to/radius'

// Init Radius
const radius = new Radius();
const myEventLabel = 'some-event-label';

// Define a callback for your subscription. Keep this handy if you want to unsubscribe later.
const someCallback = (data) => { console.log('The data from my callback is: ', data) }

// Subscribe to an event
radius.subscribe(myEventLabel, someCallback);

// Add some data to the state for this event
radius.setState(myEventLabel, { test: "This is a test value in my state data" })

// Unsubscribe from the event (same params as the subscrube method)
radius.unsubscribe(myEventLabel, someCallback);

// Add some more data to the state for this event
radius.setState(myEventLabel, { test: "This is a test value in my state data", anotherTest: "More data" })
```

Expected output:

```
The data from my callback is: { 
    test: "This is a test value in my state data" 
}
```
(no data from the second state update will display because the subscriber callback has been removed)

**Easier Unsubscribe Option**
When subscribing to an event, the subscription method will return an object of useful information, including an unsubscribe method. If you capture the return from a subscription, you can pass or store that reference anywhere and simply call the `.unsubcribe()` method on that reference.

```javascript
import { Radius } from './path/to/radius'

// Init Radius
const radius = new Radius();
const myEventLabel = 'some-event-label';

// Define a callback for your subscription. Keep this handy if you want to unsubscribe later.
const someCallback = (data) => { console.log('The data from my callback is: ', data) }

// Subscribe to an event
const someEvent = radius.subscribe(myEventLabel, someCallback);

// Add some data to the state for this event
radius.setState(myEventLabel, { test: "This is a test value in my state data" })

// Unsubscribe from the event via the captured return
someEvent.unsubscribe()

// Add some more data to the state for this event
radius.setState(myEventLabel, { test: "This is a test value in my state data", anotherTest: "More data" })
```

## Adding Actions
You can setup "actions" in Radius to handle re-usable patterns with differing inputs. These actions can be called by any file that imports the instance of Radius where the action was defined.

```javascript
import { Radius } from './path/to/radius'

// Init
const radius = new Radius()
const eventLabel = 'some-event-label';
const actionName = 'incrementCounter';

// Setup initial state
const initialState = { counter: 0 }
radius.setState(eventLabel, initialState)

// Define action
radius.addAction(eventLabel, actionName, (state) => {
    /*
    Anything "returned" from an action is applied to the state of that event.
    Be careful when defining actions to avoid wiping out existing state completely.
    Use the spread operator (...) to help with merging items into state.
    Running actions will trigger state update callbacks for the specified event.
    */
    return {...state, counter: state.counter+1 } // Overwrites "counter" with new value in state
})

// Run the defined action. This can be done from any file that has access to the instance where the action was defined.
radius.runAction(eventLabel, actionName)
```

The counter property of our event state will change from 0 to 1 after the action is called once. Any subscribers to that event's state will receive the new state passed into the callback they registered when they originally subscribed.

### Passing data into Actions
You can do more than simply create static actions that only do one thing over and over when called. You can setup actions to accept additional parameters that can be used in the action to update state.

```javascript
import { Radius } from './path/to/radius'

// Init
const radius = new Radius()
const eventLabel = 'some-event-label';
const actionName = 'changeName';

// Setup initial state
const initialState = { name: "John" }
radius.setState(eventLabel, initialState)

// Define action
radius.addAction(eventLabel, actionName, (state, newName) => {
    return {...state, name: newName } // Sets a new value for "name" in state
})

// Run the defined action. This can be done from any file that has access to the instance where the action was defined.
radius.runAction(eventLabel, actionName, "Bob")

// Alternatively, we could shorten things in our action setup like this...
radius.addAction(eventLabel, actionName, (state, name) => {
    return {...state, name } // Overwrites "name" with new value in state
})
radius.runAction(eventLabel, actionName, "Bob") // has the same effect as the original action
```

In the example above, the original "name" property in state will change from "John" to "Bob" after the action is called. Any new data can be passed into this action and it will always replace the "name" property with the data that was passed.

## Subscribing to a single property on an event
If you only want a callback to fire when a single property changes on an event's state, use the `.watch()` method.

The `.watch()` method accepts 3 parameters: an event label, a property label, and a callback function. 

Usage: `.watch(eventLabel, propertyLabel, callback)`

This returns an object that includes the standard `.unsubscribe()` method which can be called to stop watching a property.

```javascript
import { Radius } from './path/to/radius'

// Init Radius
const radius = new Radius();
const myEventLabel = 'some-event-label';
const sampleState = { name: "John", age: 30, eyeColor: "Blue" }
const sampleChangedState = { name: "Jane", age: 30, eyeColor: "Blue" }

// Define a callback for your subscription. Keep this handy if you want to unsubscribe later.
const someCallback = (data) => { console.log('The data from my callback is: ', data) }

// Initialize the state
radius.setStateOnly(myEventLabel, sampleState);

// Add a watcher
const nameWatcher = radius.watch(myEventLabel, 'name', someCallback)

// Update the state but only change the watched property
radius.setState(myEventLabel, sampleChangedState)

// "someCallback" will fire once as a results of the "name" change.
// Changing a different property will not trigger the callback.

// Unsubscribe the watcher
nameWatcher.unsubscribe();
```

## "Lite" Simple Subscriptions
There is a "lite" version of Radius built-in that facilitates bare-bones state management for when you want/need an even simpler solution.

It functions similarly to the main Radius class with the exception that an "event label" is no longer used. All subscribers will have their callbacks called on _all_/_any_ state changes. 

This is less efficient at larger scales but if used for a single feature or component it could be a tidier solution.

Example usage:

```javascript
import { RadiusLite } from './path/to/radius'

// Init Radius
const radius = new RadiusLite();

// Define a callback for your subscription. Keep this handy if you want to unsubscribe later.
const someCallback = (data) => { console.log('The data from my callback is: ', data) }

// Subscribe to the store
radius.subscribe(someCallback);

// Add some data to the state for this event
radius.state = { test: "This is a test value in my state data" }
```

Expected output:

```
The data from my callback is: { 
    test: "This is a test value in my state data" 
}
```

**To unsubscribe from state updates:**

```javascript
import { RadiusLite } from './path/to/radius'

// Init Radius
const radius = new RadiusLite();

// Define a callback for your subscription. Keep this handy if you want to unsubscribe later.
const someCallback = (data) => { console.log('The data from my callback is: ', data) }

// Subscribe to an event
radius.subscribe(someCallback);

// Add some data to the state for this event
radius.state = { test: "This is a test value in my state data" }

// Unsubscribe from the event (same params as the subscrube method)
radius.unsubscribe(someCallback);

// Add some more data to the state for this event
radius.state = { test: "This is a test value in my state data", anotherTest: "More data" }
```

Expected output:

```
The data from my callback is: { 
    test: "This is a test value in my state data" 
}
```
(no data from the second state update will display because the subscriber callback has been removed)

**Easier Unsubscribe Option**
When subscribing to an event, the subscription method will return an object of useful information, including an unsubscribe method. If you capture the return from a subscription, you can pass or store that reference anywhere and simply call the `.unsubcribe()` method on that reference.

```javascript
import { RadiusLite } from './path/to/radius'

// Init Radius
const radius = new RadiusLite();

// Define a callback for your subscription. Keep this handy if you want to unsubscribe later.
const someCallback = (data) => { console.log('The data from my callback is: ', data) }

// Subscribe to an event
const subscription = radius.subscribe(someCallback);

// Add some data to the state for this event
radius.state = { test: "This is a test value in my state data" }

// Unsubscribe from the event using the captured return
subscription.unsubscribe();

// Add some more data to the state for this event
radius.state = { test: "This is a test value in my state data", anotherTest: "More data" }
```

## Adding Actions
You can setup "actions" in Radius to handle re-usable patterns with differing inputs. These actions can be called by any file that imports the instance of Radius where the action was defined.

```javascript
import { Radius } from './path/to/radius'

// Init
const radius = new Radius()
const actionName = 'incrementCounter';

// Setup initial state
const initialState = { counter: 0 }
radius.state = initialState;

// Define action
radius.addAction(actionName, (state) => {
    /*
    Anything "returned" from an action is applied to state.
    Be careful when defining actions to avoid wiping out existing state completely.
    Use the spread operator (...) to help with merging items into state.
    Running actions will trigger state update callbacks for subscribers.
    */
    return {...state, counter: state.counter+1 } // Overwrites "counter" with new value in state
})

// Run the defined action. This can be done from any file that has access to the instance where the action was defined.
radius.runAction(actionName)
```

The counter property of our state will change from 0 to 1 after the action is called once. Any subscribers to that state will receive the new state passed into the callback they registered when they originally subscribed.

### Passing data into Actions
You can do more than simply create static actions that only do one thing over and over when called. You can setup actions to accept additional parameters that can be used in the action to update state.

```javascript
import { Radius } from './path/to/radius'

// Init
const radius = new Radius()
const actionName = 'changeName';

// Setup initial state
const initialState = { name: "John" }
radius.state = initialState;

// Define action
radius.addAction(actionName, (state, newName) => {
    return {...state, name: newName } // Sets a new value for "name" in state
})

// Run the defined action. This can be done from any file that has access to the instance where the action was defined.
radius.runAction(actionName, "Bob")

// Alternatively, we could shorten things in our action setup like this...
radius.addAction(actionName, (state, name) => {
    return {...state, name } // Overwrites "name" with new value in state
})
radius.runAction(actionName, "Bob") // has the same effect as the original action
```

In the example above, the original "name" property in state will change from "John" to "Bob" after the action is called. Any new data can be passed into this action and it will always replace the "name" property with the data that was passed.

## Subscribing to a single property in state
If you only want a callback to fire when a single property changes in state, use the `.watch()` method.

The `.watch()` method accepts 2 parameters: a property label and a callback function. 

Usage: `.watch(propertyLabel, callback)`

This returns an object that includes the standard `.unsubscribe()` method which can be called to stop watching a property.

```javascript
import { RadiusLite } from './path/to/radiusLite'

// Init Radius
const radius = new RadiusLite();
const sampleState = { name: "John", age: 30, eyeColor: "Blue" }
const sampleChangedState = { name: "Jane", age: 30, eyeColor: "Blue" }

// Define a callback for your subscription. Keep this handy if you want to unsubscribe later.
const someCallback = (data) => { console.log('The data from my callback is: ', data) }

// Initialize the state
radius.setStateOnly(sampleState);

// Add a watcher
const nameWatcher = radius.watch('name', someCallback)

// Update the state but only change the watched property
radius.setState(sampleChangedState) // could also use radius.state = sampleChangedData

// "someCallback" will fire once as a results of the "name" change.
// Changing a different property will not trigger the callback.

// Unsubscribe the watcher
nameWatcher.unsubscribe();
```