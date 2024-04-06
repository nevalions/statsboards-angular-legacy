import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { ISponsorLine } from '../../../../type/sponsor.type';

export const sponsorLineActions = createActionGroup({
  source: 'sponsorLine',
  events: {
    GetId: emptyProps(),
    'Get sponsorLine id successfully': props<{ sponsorLineId: number }>(),
    'Get sponsorLine id failure': emptyProps(),

    Create: props<{ request: ISponsorLine }>(),
    'Created successfully': props<{ currentSponsorLine: ISponsorLine }>(),
    'Create failure': emptyProps(),

    Get: props<{ id: number }>(),
    'Get item success': props<{ currentSponsorLine: ISponsorLine }>(),
    'Get item failure': emptyProps(),

    GetAll: emptyProps(),
    'Get all success': props<{ allSponsorLines: ISponsorLine[] }>(),
    'Get all failure': emptyProps(),
  },
});
