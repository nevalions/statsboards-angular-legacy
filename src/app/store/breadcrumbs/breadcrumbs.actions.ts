import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Breadcrumb } from '../../type/base.type';

export const breadcrumbActions = createActionGroup({
  source: 'breadcrumb',
  events: {
    BreadcrumbsUpdated: props<{ breadcrumbs: Breadcrumb[] }>(),
  },
});
