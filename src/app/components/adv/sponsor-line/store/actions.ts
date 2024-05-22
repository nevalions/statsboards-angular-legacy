import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  ISponsorLine,
  ISponsorLineFullData,
} from '../../../../type/sponsor.type';

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
    'Get item success': props<{
      currentSponsorLine: ISponsorLine | null | undefined;
    }>(),
    'Get item failure': emptyProps(),

    GetAll: emptyProps(),
    'Get all success': props<{ allSponsorLines: ISponsorLine[] }>(),
    'Get all failure': emptyProps(),

    GetFullDataSponsorLine: props<{ sponsorLineId: number }>(),
    'Get full data sponsor line success': props<{
      currentSponsorLineWithFullData: ISponsorLineFullData;
    }>(),
    'Get full data sponsor line failure': emptyProps(),

    GetFullDataMatchSponsorLine: emptyProps(),
    'Get full data match sponsor line success': props<{
      currentMatchSponsorLineWithFullData: ISponsorLineFullData;
    }>(),
    'Get full data match sponsor line failure': emptyProps(),

    // GetFullDataSponsorLineWithTournament: props<{
    //   sponsorLineTournament: ITournament;
    // }>(),
    // 'Get full data sponsor line with tournament success': props<{
    //   currentSponsorLineWithFullData: ISponsorLineFullData;
    // }>(),
    // 'Get full data sponsor line with tournament failure': emptyProps(),
  },
});
