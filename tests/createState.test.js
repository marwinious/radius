import { describe, it, expect, vi } from "vitest"
import { createState } from "../src/radius.js"

describe("createState", () => {
    // -------------------------------------------------------------
    // 1. Core State Management & Updates
    // -------------------------------------------------------------
    describe("getState & setState", () => {
        it("should initialize with default state or provided initial state", () => {
            const storeWithDefault = createState()
            expect(storeWithDefault.getState()).toEqual({})

            const storeWithInitial = createState({ count: 0, user: "Alice" })
            expect(storeWithInitial.getState()).toEqual({
                count: 0,
                user: "Alice",
            })
        })
    })

    // -------------------------------------------------------------
    // New Tests: getState with Selectors & Keys
    // -------------------------------------------------------------
    describe("getState selector & key options", () => {
        const initialState = {
            theme: "dark",
            user: { name: "Alice", role: "admin" },
            items: [10, 20, 30],
        }

        it("should return full state snapshot when no arguments are passed", () => {
            const store = createState(initialState)
            expect(store.getState()).toEqual(initialState)
        })

        it("should return a top-level property when passed a string key", () => {
            const store = createState(initialState)
            expect(store.getState("theme")).toBe("dark")
            expect(store.getState("user")).toEqual({
                name: "Alice",
                role: "admin",
            })
        })

        it("should return undefined when requesting a key that does not exist", () => {
            const store = createState(initialState)
            expect(store.getState("nonExistentKey")).toBeUndefined()
        })

        it("should execute a selector function and return the selected slice", () => {
            const store = createState(initialState)

            const userName = store.getState((state) => state.user.name)
            expect(userName).toBe("Alice")
        })

        it("should support derived/computed values inside a selector function", () => {
            const store = createState(initialState)

            const itemCount = store.getState((state) => state.items.length)
            const totalSum = store.getState((state) =>
                state.items.reduce((sum, n) => sum + n, 0),
            )

            expect(itemCount).toBe(3)
            expect(totalSum).toBe(60)
        })

        it("should safely return undefined if a selector reads a missing nested property", () => {
            const store = createState({ user: null })

            const nestedProp = store.getState(
                (state) => state.user?.settings?.theme,
            )
            expect(nestedProp).toBeUndefined()
        })
    })

    // -------------------------------------------------------------
    // 2. Global Subscriptions (subscribe)
    // -------------------------------------------------------------
    describe("subscribe", () => {
        it("should notify subscribers when state changes", () => {
            const store = createState({ count: 0 })
            const listener = vi.fn()

            store.subscribe(listener)
            store.setState({ count: 1 })

            expect(listener).toHaveBeenCalledTimes(1)
            expect(listener).toHaveBeenCalledWith({ count: 1 })
        })

        it("should stop notifying subscriber after unsubscribing", () => {
            const store = createState({ count: 0 })
            const listener = vi.fn()

            const unsubscribe = store.subscribe(listener)
            store.setState({ count: 1 })
            expect(listener).toHaveBeenCalledTimes(1)

            // Unsubscribe
            unsubscribe()
            store.setState({ count: 2 })

            // Should still only have been called once
            expect(listener).toHaveBeenCalledTimes(1)
        })

        it("should respect the runListeners = false flag in setState", () => {
            const store = createState({ count: 0 })
            const listener = vi.fn()

            store.subscribe(listener)

            // Pass false to suppress listeners
            store.setState({ count: 1 }, false)

            expect(store.getState()).toEqual({ count: 1 })
            expect(listener).not.toHaveBeenCalled()
        })
    })

    // -------------------------------------------------------------
    // 3. Property & Selector Watchers (watch)
    // -------------------------------------------------------------
    describe("watch", () => {
        it("should trigger callback with (newValue, oldValue) when watched slice changes", () => {
            const store = createState({ count: 0, name: "Alice" })
            const callback = vi.fn()

            store.watch((state) => state.count, callback)

            store.setState({ count: 1 })

            expect(callback).toHaveBeenCalledTimes(1)
            expect(callback).toHaveBeenCalledWith(1, 0) // (newValue, oldValue)
        })

        it("should watch a top-level property using a string key", () => {
            const store = createState({ count: 0, theme: "light" })
            const callback = vi.fn()

            store.watch("count", callback)

            store.setState({ count: 1 })

            expect(callback).toHaveBeenCalledTimes(1)
            expect(callback).toHaveBeenCalledWith(1, 0) // (newValue, oldValue)
        })

        it("should NOT trigger string key watcher if unrelated property changes or value is unchanged", () => {
            const store = createState({ count: 0, theme: "light" })
            const callback = vi.fn()

            store.watch("theme", callback)

            // 1. Update unrelated property
            store.setState({ count: 5 })
            expect(callback).not.toHaveBeenCalled()

            // 2. Update theme with same value
            store.setState({ theme: "light" })
            expect(callback).not.toHaveBeenCalled()

            // 3. Update theme with new value
            store.setState({ theme: "dark" })
            expect(callback).toHaveBeenCalledTimes(1)
            expect(callback).toHaveBeenCalledWith("dark", "light")
        })

        it("should allow unsubscribing a string key watcher", () => {
            const store = createState({ status: "idle" })
            const callback = vi.fn()

            const unwatch = store.watch("status", callback)

            store.setState({ status: "loading" })
            expect(callback).toHaveBeenCalledWith("loading", "idle")

            // Unwatch
            unwatch()

            store.setState({ status: "success" })
            expect(callback).toHaveBeenCalledTimes(1)
        })

        it("should NOT trigger callback if watched value did not change", () => {
            const store = createState({ count: 0, name: "Alice" })
            const callback = vi.fn()

            store.watch((state) => state.count, callback)

            // Update unrelated property
            store.setState({ name: "Bob" })
            expect(callback).not.toHaveBeenCalled()

            // Update count with same value
            store.setState({ count: 0 })
            expect(callback).not.toHaveBeenCalled()
        })

        it("should watch nested state properties via selector", () => {
            const store = createState({
                user: { profile: { theme: "light" } },
            })
            const callback = vi.fn()

            store.watch((state) => state.user.profile.theme, callback)

            store.setState((prev) => ({
                user: {
                    ...prev.user,
                    profile: { theme: "dark" },
                },
            }))

            expect(callback).toHaveBeenCalledWith("dark", "light")
        })

        it("should watch computed / derived values", () => {
            const store = createState({
                items: [{ price: 10 }, { price: 20 }],
            })
            const callback = vi.fn()

            // Watch computed total price
            store.watch(
                (state) =>
                    state.items.reduce((sum, item) => sum + item.price, 0),
                callback,
            )

            // Add item -> changes total from 30 to 40
            store.setState((prev) => ({
                items: [...prev.items, { price: 10 }],
            }))

            expect(callback).toHaveBeenCalledWith(40, 30)
        })

        it("should correctly handle NaN values using Object.is", () => {
            const store = createState({ value: 0 })
            const callback = vi.fn()

            store.watch((state) => state.value, callback)

            // 0 -> NaN (triggers)
            store.setState({ value: NaN })
            expect(callback).toHaveBeenCalledTimes(1)

            // NaN -> NaN (does NOT trigger because Object.is(NaN, NaN) === true)
            store.setState({ value: NaN })
            expect(callback).toHaveBeenCalledTimes(1)
        })

        it("should isolate multiple watchers so unsubscribing one does not affect others", () => {
            const store = createState({ count: 0, name: "Alice" })
            const countCallback = vi.fn()
            const nameCallback = vi.fn()

            const unwatchCount = store.watch(
                (state) => state.count,
                countCallback,
            )
            const unwatchName = store.watch((state) => state.name, nameCallback)

            // Both change
            store.setState({ count: 1, name: "Bob" })
            expect(countCallback).toHaveBeenCalledWith(1, 0)
            expect(nameCallback).toHaveBeenCalledWith("Bob", "Alice")

            // Unwatch count only
            unwatchCount()

            // Change both again
            store.setState({ count: 2, name: "Charlie" })

            // countCallback should NOT have been called a second time
            expect(countCallback).toHaveBeenCalledTimes(1)
            // nameCallback SHOULD continue to work
            expect(nameCallback).toHaveBeenCalledTimes(2)
            expect(nameCallback).toHaveBeenCalledWith("Charlie", "Bob")

            // Clean up remaining watcher
            unwatchName()
        })
    })
})