import { createActionGroup, props } from '@ngrx/store';

export const paginationActions = createActionGroup({
  source: 'pagination',
  events: {
    'Update Current Page': props<{ currentPage: number }>(),
    'Update Items Per Page': props<{ itemsPerPage: number | 'All' }>(),
  },
});
