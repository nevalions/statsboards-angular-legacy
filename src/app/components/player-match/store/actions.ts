import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  IPlayerInMatch,
  IPlayerInMatchFullData,
} from '../../../type/player.type';

export const playerInMatchActions = createActionGroup({
  source: 'playerInMatch',
  events: {
    GetId: emptyProps(),
    'Get playerInMatch id successfully': props<{
      playerInMatchId: number;
    }>(),
    'Get playerInMatch id failure': emptyProps(),

    Create: props<{ request: IPlayerInMatch }>(),
    'Created successfully': props<{
      currentPlayerInMatch: IPlayerInMatch;
    }>(),
    'Create failure': emptyProps(),

    // get playerInMatch
    Get: props<{ id: number }>(),
    'Get item success': props<{
      playerInMatch: IPlayerInMatch;
    }>(),
    'Get item failure': emptyProps(),

    //get playerInMatch full data
    GetPlayerInMatchFullData: props<{ id: number }>(),
    'Get playerInMatch full data success': props<{
      playerInMatchFullData: IPlayerInMatchFullData;
    }>(),
    'Get playerInMatch full data failure': emptyProps(),

    GetAll: emptyProps(),
    'Get all items success': props<{
      playerInMatches: IPlayerInMatch[];
    }>(),
    'Get all items failure': emptyProps(),

    GetAllPlayersInMatch: emptyProps(),
    'Get all playersInMatch success': props<{
      playersInMatch: IPlayerInMatch[];
    }>(),
    'Get all playersInMatch failure': emptyProps(),

    GetAllPlayersWithFullDataInMatch: emptyProps(),
    'Get all playersWithFullDataInMatch success': props<{
      playersInMatch: IPlayerInMatchFullData[];
    }>(),
    'Get all playersWithFullDataInMatch failure': emptyProps(),

    // GetAllPlayersInTournamentByTournamentId: emptyProps(),
    // 'Get all players in match by match id success': props<{
    //   playersInMatch: IPlayerInMatch[];
    // }>(),
    // 'Get all players in match by match id failure': emptyProps(),

    Update: props<{
      id: number;
      newPlayerInMatchData: IPlayerInMatch;
    }>(),
    'Updated successfully': props<{
      updatedPlayerInMatch: IPlayerInMatch;
    }>(),
    'Update failure': emptyProps(),

    Delete: emptyProps(),
    'Deleted successfully': props<{
      playerInMatchId: number;
      match_id: number;
    }>(),
    'Delete failure': emptyProps(),

    DeleteById: props<{ id: number }>(),
    'Deleted by id successfully': props<{
      playerInMatchId: number;
    }>(),
    'Delete by id failure': emptyProps(),

    // ParsPlayersFromMatchTeamEESL: emptyProps,
    // 'Parsed player from match EESL successfully': props<{
    //   parseList: any[] | IPlayerInMatch[];
    // }>(),
    // 'Parsed player from match EESL failure': emptyProps(),
  },
});
