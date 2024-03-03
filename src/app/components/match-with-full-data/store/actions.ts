import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { IMatchWithFullData } from '../../../type/match.type';

export const matchWithFullDataActions = createActionGroup({
  source: 'matchWithFullData',
  events: {
    GetId: emptyProps(),
    'Get matchWithFullData id successfully': props<{
      matchWithFullDataId: number;
    }>(),
    'Get matchWithFullData id failure': emptyProps(),

    Create: props<{ request: IMatchWithFullData }>(),
    'Created successfully': props<{
      currentMatchWithFullData: IMatchWithFullData;
    }>(),
    'Create failure': emptyProps(),

    Get: props<{ id: number }>(),
    'Get item success': props<{ matchWithFullData: IMatchWithFullData }>(),
    'Get item failure': emptyProps(),

    GetAll: emptyProps(),
    'Get all items success': props<{
      matchesWithFullData: IMatchWithFullData[];
    }>(),
    'Get all items failure': emptyProps(),

    GetMatchesWithFullDataBySportId: emptyProps(),
    'Get matches with full data by sport ID success': props<{
      matchesWithFullData: IMatchWithFullData[];
    }>(),
    'Get matches with full data by sport ID failure': emptyProps(),

    GetMatchesWithFullDataByTournamentId: emptyProps(),
    'Get matches with full data by tournament ID success': props<{
      matchesWithFullData: IMatchWithFullData[];
    }>(),
    'Get matches with full data by tournament ID failure': emptyProps(),

    Update: props<{
      id: number;
      newMatchWithFullDataData: IMatchWithFullData;
    }>(),
    'Updated successfully': props<{
      updatedMatchWithFullData: IMatchWithFullData;
    }>(),
    'Update failure': emptyProps(),

    UpdateAllMatchesWithFullDataInTournament: props<{
      newMatchWithFullData: IMatchWithFullData;
    }>(),
    UpdateMatchWithFullData: props<{
      newMatchWithFullData: IMatchWithFullData;
    }>(),
    RemoveMatchFromTournament: props<{ id: number }>(),

    // UpdateAllMatchesWithFullDataOnDelete: props<{
    //   newMatchesWithFullData: IMatchWithFullData[];
    // }>(),

    Delete: props<{ id: number }>(),
    'Deleted successfully': props<{ id: number }>(),
    'Delete failure': emptyProps(),
  },
});
