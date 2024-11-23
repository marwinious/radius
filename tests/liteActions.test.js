import { describe, expect, test, expectTypeOf, vi, beforeEach } from 'vitest'
import { RadiusLite } from '../main';

describe('lite actions', () => {

    let radius = new RadiusLite();
    const mockData = {test: "Testing nav update event" };
    const mockResponse = mockData;
    const mockActionName = 'run-an-action';
    const mockActionData = { actionUpdate: "This was from an action" }
    const mockActionReturn = {...mockData, newProperty: mockActionData }
    const mockActionMergeReturn = {...mockData, ...mockActionData }

    beforeEach(() => {
        radius = new RadiusLite();
    })

    test('should register and run an action that adds a new property to state', () => {
        const mockCallback = vi.fn(() => mockResponse)

        radius.subscribe(mockCallback)
        radius.state = mockData;

        radius.addAction(mockActionName, (state, newProperty) => {
            return {...state, newProperty} // Adds a new property to state labeled "newProperty"
        })

        radius.runAction(mockActionName, mockActionData);
        console.log(radius.state);

        expect(radius.state).toMatchObject(mockActionReturn);
    })

    test('should register and run an action that combines new data with state', () => {
        const mockCallback = vi.fn(() => mockResponse)

        radius.subscribe(mockCallback)
        radius.state = mockData;

        radius.addAction(mockActionName, (state, newData) => {
            return {...state, ...newData} // Adds "newData" as siblings to existing state
        })

        radius.runAction(mockActionName, mockActionData);
        console.log(radius.state);

        expect(radius.state).toMatchObject(mockActionMergeReturn);
    })

})