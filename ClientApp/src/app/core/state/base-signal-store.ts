import { signal, WritableSignal, computed, Signal } from '@angular/core';

/**
 * Base class for signal-based stores.
 * Provides common functionality for managing state with Angular signals.
 */
export abstract class BaseSignalStore<T> {
  protected state: WritableSignal<T>;

  constructor(initialState: T) {
    this.state = signal<T>(initialState);
  }

  /**
   * Get the current state value
   */
  getState(): T {
    return this.state();
  }

  /**
   * Set the entire state
   */
  setState(newState: T): void {
    this.state.set(newState);
  }

  /**
   * Update state partially using a function
   */
  updateState(updater: (currentState: T) => T): void {
    this.state.update(updater);
  }

  /**
   * Patch state with partial updates
   */
  patchState(partialState: Partial<T>): void {
    this.state.update(current => ({ ...current, ...partialState }));
  }

  /**
   * Get a computed signal for derived state
   */
  select<R>(selector: (state: T) => R): Signal<R> {
    return computed(() => selector(this.state()));
  }

  /**
   * Reset state to initial value
   */
  abstract reset(): void;
}