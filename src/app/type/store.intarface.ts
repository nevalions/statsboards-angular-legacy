export interface crudStoreInterface {
  isSubmitting: boolean;
  isLoading: boolean;
  errors: any | undefined | null;
}

export function getDefaultCrudStore(): crudStoreInterface {
  return {
    isSubmitting: false,
    isLoading: false,
    errors: null,
  };
}
