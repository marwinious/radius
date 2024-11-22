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

To unsubscribe from an event:

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

To unsubscribe from the store:

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