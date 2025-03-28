import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  IPlayerInMatch,
  IPlayerInMatchFullData,
  IPlayerInMatchFullDataWithQbStats,
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

    // lower
    // simple player
    SetSelectedPlayerId: props<{ id: number }>(),
    'Set selected player id failure': emptyProps(),

    GetSelectedPlayerLowerById: props<{ playerInMatchId: number }>(),
    'Get selected player lower by Id successfully': props<{
      player: IPlayerInMatchFullData;
    }>(),
    'Get selected player lower by Id failure': emptyProps(),

    SetSelectedPlayerLower: props<{ player: IPlayerInMatchFullData }>(),
    'Set selected player lower failure': emptyProps(),

    // qb
    SetSelectedFootballQbId: props<{ id: number }>(),
    'Set selected football qb id failure': emptyProps(),

    GetSelectedFootballQbLowerById: props<{ qbInMatchId: number }>(),
    'Get selected football qb lower by id successfully': props<{
      qb: IPlayerInMatchFullDataWithQbStats;
    }>(),
    'Get selected football qb lower by id failure': emptyProps(),

    SetSelectedFootballQbLower: props<{
      qb: IPlayerInMatchFullDataWithQbStats;
    }>(),
    'Set selected football qb lower failure': emptyProps(),

    ParsPlayersFromMatchEESL: emptyProps,
    'Parsed player from match EESL successfully': props<{
      parseList: any[] | IPlayerInMatchFullData[];
    }>(),
    'Parsed player from match EESL failure': emptyProps(),
  },
});
