import { describe, it, expect, vi } from 'vitest';
import { createState } from '../src/radius.js';

describe('createState', () => {
  // -------------------------------------------------------------
  // 1. Core State Management & Updates
  // -------------------------------------------------------------
  describe('getState & setState', () => {
    it('should initialize with default state or provided initial state', () => {
      const storeWithDefault = createState();
      expect(storeWithDefault.getState()).toEqual({});

      const storeWithInitial = createState({ count: 0, user: 'Alice' });
      expect(storeWithInitial.getState()).toEqual({ count: 0, user: 'Alice' });
    });

    it('should update state when passing a partial object', () => {
      const store = createState({ count: 0, theme: 'light' });

      store.setState({ theme: 'dark' });

      expect(store.getState()).toEqual({ count: 0, theme: 'dark' });
    });

    it('should update state when passing an updater function', () => {
      const store = createState({ count: 5 });

      store.setState((prev) => ({ count: prev.count + 1 }));

      expect(store.getState()).toEqual({ count: 6 });
    });
  });

  // -------------------------------------------------------------
  // 2. Global Subscriptions (subscribe)
  // -------------------------------------------------------------
  describe('subscribe', () => {
    it('should notify subscribers when state changes', () => {
      const store = createState({ count: 0 });
      const listener = vi.fn();

      store.subscribe(listener);
      store.setState({ count: 1 });

      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener).toHaveBeenCalledWith({ count: 1 });
    });

    it('should stop notifying subscriber after unsubscribing', () => {
      const store = createState({ count: 0 });
      const listener = vi.fn();

      const unsubscribe = store.subscribe(listener);
      store.setState({ count: 1 });
      expect(listener).toHaveBeenCalledTimes(1);

      // Unsubscribe
      unsubscribe();
      store.setState({ count: 2 });

      // Should still only have been called once
      expect(listener).toHaveBeenCalledTimes(1);
    });

    it('should respect the runListeners = false flag in setState', () => {
      const store = createState({ count: 0 });
      const listener = vi.fn();

      store.subscribe(listener);

      // Pass false to suppress listeners
      store.setState({ count: 1 }, false);

      expect(store.getState()).toEqual({ count: 1 });
      expect(listener).not.toHaveBeenCalled();
    });
  });

  // -------------------------------------------------------------
  // 3. Property & Selector Watchers (watch)
  // -------------------------------------------------------------
  describe('watch', () => {
    it('should trigger callback with (newValue, oldValue) when watched slice changes', () => {
      const store = createState({ count: 0, name: 'Alice' });
      const callback = vi.fn();

      store.watch((state) => state.count, callback);

      store.setState({ count: 1 });

      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith(1, 0); // (newValue, oldValue)
    });

    it('should NOT trigger callback if watched value did not change', () => {
      const store = createState({ count: 0, name: 'Alice' });
      const callback = vi.fn();

      store.watch((state) => state.count, callback);

      // Update unrelated property
      store.setState({ name: 'Bob' });
      expect(callback).not.toHaveBeenCalled();

      // Update count with same value
      store.setState({ count: 0 });
      expect(callback).not.toHaveBeenCalled();
    });

    it('should watch nested state properties via selector', () => {
      const store = createState({
        user: { profile: { theme: 'light' } },
      });
      const callback = vi.fn();

      store.watch((state) => state.user.profile.theme, callback);

      store.setState((prev) => ({
        user: {
          ...prev.user,
          profile: { theme: 'dark' },
        },
      }));

      expect(callback).toHaveBeenCalledWith('dark', 'light');
    });

    it('should watch computed / derived values', () => {
      const store = createState({
        items: [{ price: 10 }, { price: 20 }],
      });
      const callback = vi.fn();

      // Watch computed total price
      store.watch(
        (state) => state.items.reduce((sum, item) => sum + item.price, 0),
        callback
      );

      // Add item -> changes total from 30 to 40
      store.setState((prev) => ({
        items: [...prev.items, { price: 10 }],
      }));

      expect(callback).toHaveBeenCalledWith(40, 30);
    });

    it('should correctly handle NaN values using Object.is', () => {
      const store = createState({ value: 0 });
      const callback = vi.fn();

      store.watch((state) => state.value, callback);

      // 0 -> NaN (triggers)
      store.setState({ value: NaN });
      expect(callback).toHaveBeenCalledTimes(1);

      // NaN -> NaN (does NOT trigger because Object.is(NaN, NaN) === true)
      store.setState({ value: NaN });
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should isolate multiple watchers so unsubscribing one does not affect others', () => {
      const store = createState({ count: 0, name: 'Alice' });
      const countCallback = vi.fn();
      const nameCallback = vi.fn();

      const unwatchCount = store.watch((state) => state.count, countCallback);
      const unwatchName = store.watch((state) => state.name, nameCallback);

      // Both change
      store.setState({ count: 1, name: 'Bob' });
      expect(countCallback).toHaveBeenCalledWith(1, 0);
      expect(nameCallback).toHaveBeenCalledWith('Bob', 'Alice');

      // Unwatch count only
      unwatchCount();

      // Change both again
      store.setState({ count: 2, name: 'Charlie' });

      // countCallback should NOT have been called a second time
      expect(countCallback).toHaveBeenCalledTimes(1);
      // nameCallback SHOULD continue to work
      expect(nameCallback).toHaveBeenCalledTimes(2);
      expect(nameCallback).toHaveBeenCalledWith('Charlie', 'Bob');

      // Clean up remaining watcher
      unwatchName();
    });
  });
});