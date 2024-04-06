import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { ISponsorLineConnection } from '../../../../type/sponsor.type';

export const sponsorSponsorLineConnectionActions = createActionGroup({
  source: 'sponsorSponsorLineConnection',
  events: {
    GetId: emptyProps(),
    'Get sponsorSponsorLineConnection id successfully': props<{
      sponsorSponsorLineConnectionId: number;
    }>(),
    'Get sponsorSponsorLineConnection id failure': emptyProps(),

    Create: props<{ request: ISponsorLineConnection }>(),
    'Created successfully': props<{
      currentSponsorSponsorLineConnection: ISponsorLineConnection;
    }>(),
    'Create failure': emptyProps(),

    Get: props<{ id: number }>(),
    'Get item success': props<{
      currentSponsorSponsorLineConnection: ISponsorLineConnection;
    }>(),
    'Get item failure': emptyProps(),

    GetAll: emptyProps(),
    'Get all success': props<{
      allSponsorSponsorLineConnections: ISponsorLineConnection[];
    }>(),
    'Get all failure': emptyProps(),
  },
});
