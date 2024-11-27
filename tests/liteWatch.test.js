import { describe, expect, test, expectTypeOf, vi, beforeEach } from 'vitest'
import { RadiusLite } from '../main';

describe('watchers', () => {

    let radius = new RadiusLite();
    const mockData = {
        name: "John",
        age: 30,
        eyeColor: "Blue"
    };
    const mockDataUpdated = {
        name: "Jane",
        age: 30,
        eyeColor: "Blue"
    };
    const mockResponse = mockData;

    beforeEach(() => {
        radius = new RadiusLite();
    })

    test('should register a watcher on a property', () => {
        const mockCallback = vi.fn(() => mockResponse)

        radius.setStateOnly(mockData);
        console.log(radius.state);
        
        const watcher = radius.watch('name', mockCallback)
        // console.log('watcher: ', watcher);

        expect(watcher).toHaveProperty('property')
        expect(watcher).toHaveProperty('callback')
        expect(watcher).toHaveProperty('unsubscribe')
        expect(watcher.property).toBe('name');
    })

    test('watcher callback should fire on watched property change', () => {
        const mockCallback = vi.fn(() => mockResponse)

        radius.setStateOnly(mockData);
        console.log(radius.state);
        
        const watcher = radius.watch('name', mockCallback)
        // console.log('watcher: ', watcher);
        
        const updatedState = radius.setState(mockDataUpdated);
        // console.log('updatedState: ', updatedState);

        expect(mockCallback).toHaveBeenCalledOnce();
        expect(updatedState.newState.name).toBe(mockDataUpdated.name)
    })

    test('watcher callback should not fire when non-watched property changes', () => {
        const mockCallback = vi.fn(() => mockResponse)

        radius.setStateOnly(mockData);
        console.log(radius.state);
        
        const watcher = radius.watch('age', mockCallback)
        // console.log('watcher: ', watcher);
        
        const updatedState = radius.setState(mockDataUpdated)
        // console.log(radius.getState(mockEvent));
        // console.log('updatedState: ', updatedState);

        expect(mockCallback).not.toHaveBeenCalled();
        expect(updatedState.newState.age).toBe(mockDataUpdated.age)
    })

    test('watcher unsubscribe should work', () => {
        const mockCallback = vi.fn(() => mockResponse)

        radius.setStateOnly(mockData);
        console.log(radius.state);

        // Add watcher        
        const watcher = radius.watch('name', mockCallback)
        // console.log('watcher: ', watcher);
        
        // Update watched state
        const updatedState = radius.setState(mockDataUpdated)
        // console.log(radius.getState(mockEvent));
        // console.log('updatedState: ', updatedState);

        // Unsubscribe the watcher
        watcher.unsubscribe();

        // Revert state that watcher was originally attached to
        const revertedState = radius.setState(mockData)

        expect(mockCallback).toHaveBeenCalledOnce();
        expect(revertedState.newState.name).toBe(mockData.name)
    })

})