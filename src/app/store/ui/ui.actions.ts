import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const uiActions = createActionGroup({
  source: 'ui',
  events: {
    ToggleForm: props<{ formName: string }>(),
    ToggleAllForms: emptyProps(),
  },
});
