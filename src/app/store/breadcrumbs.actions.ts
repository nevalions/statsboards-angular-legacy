import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Breadcrumb } from '../type/base.type';

export const breadcrumbActions = createActionGroup({
  source: 'breadcrumb',
  events: {
    LoadBreadcrumbs: emptyProps(),
    LoadBreadcrumbsFailure: emptyProps(),
    SetBreadcrumb: props<{ breadcrumb: Breadcrumb }>(),
    SetCurrentBreadcrumb: props<{ breadcrumb: Breadcrumb }>(),
    ClearCurrentBreadcrumb: emptyProps(),
    BreadcrumbsUpdated: props<{ breadcrumbs: Breadcrumb[] }>(),
    ClearBreadcrumbsAfterIndex: props<{ index: number }>(),
    ClearBreadcrumbsFromLevel: props<{ level: number }>(),
    ClearBreadcrumb: emptyProps(),
  },
});
