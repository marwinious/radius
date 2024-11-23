import { describe, expect, test, expectTypeOf, vi, beforeEach } from 'vitest'
import { Radius } from '../main';

describe('actions', () => {

    let radius = new Radius();
    const mockData = { test: "Testing nav update event" };
    const mockActionData = { actionUpdate: "This was from an action" }
    const mockActionReturn = {...mockData, newProperty: mockActionData }
    const mockActionMergeReturn = {...mockData, ...mockActionData }
    const mockResponse = mockData;
    const mockEvent = 'testEvent';
    const mockActionName = 'run-an-action';

    beforeEach(() => {
        radius = new Radius();
    })

    test('should register and run an action that adds a new property to state', () => {
        const mockCallback = vi.fn(() => mockResponse)

        radius.subscribe(mockEvent, mockCallback)
        radius.setState(mockEvent, mockData)

        radius.addAction(mockEvent, mockActionName, (state, newProperty) => {
            return {...state, newProperty} // Adds a new property to state labeled "newProperty"
        })

        radius.runAction(mockEvent, mockActionName, mockActionData);
        console.log(radius.getState(mockEvent));
        
        expect(radius.getState(mockEvent)).toMatchObject(mockActionReturn);
    })

    test('should register and run an action that combines new data with state', () => {
        const mockCallback = vi.fn(() => mockResponse)

        radius.subscribe(mockEvent, mockCallback)
        radius.setState(mockEvent, mockData)

        radius.addAction(mockEvent, mockActionName, (state, newData) => {
            return {...state, ...newData} // Adds "newData" as siblings to existing state
        })

        radius.runAction(mockEvent, mockActionName, mockActionData);
        console.log(radius.getState(mockEvent));
        
        expect(radius.getState(mockEvent)).toMatchObject(mockActionMergeReturn);
    })

    test('should create a counter action that correctly increments', () => {
        const mockCallback = vi.fn(() => mockResponse)

        radius.subscribe(mockEvent, mockCallback)
        radius.setState(mockEvent, { counter: 0 })

        radius.addAction(mockEvent, 'incrementCounter', (state) => {
            return {...state, counter: state.counter+1 } // Overwrites "counter" with new value in state
        })

        radius.runAction(mockEvent, 'incrementCounter');
        console.log(radius.getState(mockEvent));
        
        expect(radius.getState(mockEvent).counter).toBe(1);
    })

    test('should create an action that adds user data', () => {
        const mockCallback = vi.fn(() => mockResponse)
        const newUser = { name: "John Does", age: "30" }
        const initialState = { notAUser: true, user: {} }
        const updatedState = {...initialState, user: newUser}

        radius.subscribe(mockEvent, mockCallback)
        radius.setState(mockEvent, initialState)

        radius.addAction(mockEvent, 'addUser', (state, user) => {
            return {...state, user } // Adds or Overwrites "user" with new value in state
        })

        radius.runAction(mockEvent, 'addUser', newUser);
        console.log(updatedState);
        console.log(radius.getState(mockEvent));
        
        expect(radius.getState(mockEvent)).toMatchObject(updatedState)
    })

})