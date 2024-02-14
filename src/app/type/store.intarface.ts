export interface crudStoreInterface<T> {
  isSubmitting: boolean;
  isLoading: boolean;
  itemList: T[];
  currentItem: T | undefined | null;
  errors: any | undefined | null;
}
