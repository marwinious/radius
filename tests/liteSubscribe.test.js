import { describe, expect, test, expectTypeOf, vi, beforeEach } from 'vitest'
import { RadiusLite } from '../main';

describe('subscribe/unsubscribe', () => {

    let radius = new RadiusLite();
    const mockData = {test: "Testing nav update event" };
    const mockResponse = mockData;

    beforeEach(() => {
        radius = new RadiusLite();
    })

    test('should successfully subscribe to store', () => {
        const mockCallback = vi.fn(() => mockResponse)

        radius.subscribe(mockCallback)
        radius.state = mockData;

        expect(mockCallback).toHaveBeenCalledOnce();
        expect(radius.state).toMatchObject(mockData);
    })

    test('should successfully unsubscribe from store', () => {
        const mockCallback = vi.fn(() => mockResponse)

        radius.subscribe(mockCallback)
        radius.unsubscribe(mockCallback)
        radius.state = mockData;

        expect(mockCallback).not.toHaveBeenCalled();
        expect(radius.state).toMatchObject(mockData)
    })

})