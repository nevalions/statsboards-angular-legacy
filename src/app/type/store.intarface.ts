export interface crudStoreInterface<T> {
  isSubmitting: boolean;
  isLoading: boolean;
  itemsList: T[];
  currentItem: T | undefined | null;
  errors: any | undefined | null;
}

export function getDefaultCrudStore<T>(): crudStoreInterface<T> {
  return {
    isSubmitting: false,
    isLoading: false,
    itemsList: [],
    currentItem: null,
    errors: null,
  };
}
