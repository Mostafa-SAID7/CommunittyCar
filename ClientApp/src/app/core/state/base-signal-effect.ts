import { Injectable, inject, DestroyRef, OnDestroy } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap, finalize } from 'rxjs/operators';
import { BaseSignalStore } from './base-signal-store';

/**
 * Base class for signal-based effects.
 * Provides common functionality for handling side effects in signal stores.
 */
@Injectable()
export abstract class BaseSignalEffect<T> implements OnDestroy {
  protected destroyRef = inject(DestroyRef);

  constructor(protected store: BaseSignalStore<T>) {}

  ngOnDestroy(): void {
    // Cleanup if needed
  }

  /**
   * Execute an effect with error handling and loading states
   */
  protected executeEffect<R>(
    effectFn: () => Observable<R>,
    onSuccess?: (result: R) => void,
    onError?: (error: any) => void,
    loadingKey?: string
  ): Observable<R> {
    // Set loading state if specified
    if (loadingKey) {
      this.store.patchState({ [loadingKey]: true } as any);
    }

    return effectFn().pipe(
      tap(result => {
        if (onSuccess) {
          onSuccess(result);
        }
      }),
      catchError(error => {
        if (onError) {
          onError(error);
        }
        return throwError(() => error);
      }),
      finalize(() => {
        // Clear loading state if specified
        if (loadingKey) {
          this.store.patchState({ [loadingKey]: false } as any);
        }
      }),
      takeUntilDestroyed(this.destroyRef)
    );
  }

  /**
   * Create a simple effect that updates the store on success
   */
  protected createEffect<R>(
    effectFn: () => Observable<R>,
    successUpdater: (result: R, currentState: T) => Partial<T>,
    errorUpdater?: (error: any, currentState: T) => Partial<T>,
    loadingKey?: string
  ): Observable<R> {
    return this.executeEffect(
      effectFn,
      (result) => {
        this.store.updateState(currentState =>
          ({ ...currentState, ...successUpdater(result, currentState) })
        );
      },
      (error) => {
        if (errorUpdater) {
          this.store.updateState(currentState =>
            ({ ...currentState, ...errorUpdater(error, currentState) })
          );
        }
      },
      loadingKey
    );
  }
}