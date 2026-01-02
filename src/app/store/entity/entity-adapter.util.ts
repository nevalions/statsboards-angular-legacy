import {
  EntityState,
  createEntityAdapter,
  IdSelector,
  Comparer,
} from '@ngrx/entity';

export interface EntityStateWithLoading<T> extends EntityState<T> {
  isLoading: boolean;
  isSubmitting: boolean;
  errors: unknown | null;
}

export interface EntityStateWithCurrent<T> extends EntityStateWithLoading<T> {
  currentItemId: number | null;
  currentItem: T | null;
}

export interface AdapterOptions<T> {
  sortComparer?: false | Comparer<T>;
  selectId?: IdSelector<T>;
}

export function createAdapter<T>(options?: AdapterOptions<T>) {
  return createEntityAdapter<T>(options);
}

export function getInitialStateWithLoading<T>(options?: AdapterOptions<T>) {
  const adapter = createEntityAdapter<T>(options);

  return adapter.getInitialState<EntityStateWithLoading<T>>({
    isLoading: false,
    isSubmitting: false,
    errors: null,
  });
}

export function getInitialStateWithCurrent<T>(options?: AdapterOptions<T>) {
  const adapter = createEntityAdapter<T>(options);

  return adapter.getInitialState<EntityStateWithCurrent<T>>({
    isLoading: false,
    isSubmitting: false,
    currentItemId: null,
    currentItem: null,
    errors: null,
  });
}
