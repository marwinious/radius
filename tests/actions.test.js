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

})