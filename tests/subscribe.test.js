import { describe, expect, test, expectTypeOf, vi, beforeEach } from 'vitest'
import { Radius } from '../main';

describe('subscribe/unsubscribe', () => {

    let radius = new Radius();
    const mockData = {test: "Testing nav update event" };
    const mockResponse = mockData;
    const mockEvent = 'testEvent';

    beforeEach(() => {
        radius = new Radius();
    })

    test('should successfully subscribe to event', () => {
        const mockCallback = vi.fn(() => mockResponse)

        radius.subscribe(mockEvent, mockCallback)
        radius.setState(mockEvent, mockData)

        expect(mockCallback).toHaveBeenCalledOnce();
        expect(radius.getState(mockEvent)).toMatchObject(mockData)
    })

    test('should successfully unsubscribe from event', () => {
        const mockCallback = vi.fn(() => mockResponse)

        const subscriber = radius.subscribe(mockEvent, mockCallback)
        const unsub = subscriber.unsubscribe()
        
        radius.setState(mockEvent, mockData)

        expect(mockCallback).not.toHaveBeenCalled();
        expect(radius.getState(mockEvent)).toMatchObject(mockData)
    })

})