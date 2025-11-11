import { computed, Signal } from '@angular/core';

/**
 * Utility functions for creating signal-based selectors
 */

/**
 * Create a simple selector function
 */
export function createSelector<T, R>(
  source: Signal<T>,
  selector: (state: T) => R
): Signal<R> {
  return computed(() => selector(source()));
}

/**
 * Create a selector that combines multiple signals
 */
export function createCombinedSelector<T extends readonly Signal<any>[], R>(
  sources: T,
  combiner: (...values: { [K in keyof T]: T[K] extends Signal<infer U> ? U : never }) => R
): Signal<R> {
  return computed(() => {
    const values = sources.map(signal => signal()) as { [K in keyof T]: T[K] extends Signal<infer U> ? U : never };
    return combiner(...values);
  });
}

/**
 * Create a memoized selector with custom equality function
 */
export function createMemoizedSelector<T, R>(
  source: Signal<T>,
  selector: (state: T) => R,
  equals?: (a: R, b: R) => boolean
): Signal<R> {
  return computed(() => selector(source()), { equal: equals });
}

/**
 * Create a selector that filters values based on a predicate
 */
export function createFilteredSelector<T>(
  source: Signal<T[]>,
  predicate: (item: T) => boolean
): Signal<T[]> {
  return computed(() => source().filter(predicate));
}

/**
 * Create a selector that finds a single item
 */
export function createFindSelector<T>(
  source: Signal<T[]>,
  predicate: (item: T) => boolean
): Signal<T | undefined> {
  return computed(() => source().find(predicate));
}

/**
 * Create a selector that maps array items
 */
export function createMapSelector<T, R>(
  source: Signal<T[]>,
  mapper: (item: T) => R
): Signal<R[]> {
  return computed(() => source().map(mapper));
}

/**
 * Create a selector that reduces array items
 */
export function createReduceSelector<T, R>(
  source: Signal<T[]>,
  reducer: (accumulator: R, current: T) => R,
  initialValue: R
): Signal<R> {
  return computed(() => source().reduce(reducer, initialValue));
}