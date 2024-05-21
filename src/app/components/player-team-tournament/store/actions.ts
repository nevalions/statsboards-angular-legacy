import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  IPlayerInTeamTournament,
  IPlayerInTeamTournamentFullData,
} from '../../../type/player.type';

export const playerInTeamTournamentActions = createActionGroup({
  source: 'playerInTeamTournament',
  events: {
    GetId: emptyProps(),
    'Get playerInTeamTournament id successfully': props<{
      playerInTeamTournamentId: number;
    }>(),
    'Get playerInTeamTournament id failure': emptyProps(),

    Create: props<{ request: IPlayerInTeamTournament }>(),
    'Created successfully': props<{
      currentPlayerInTeamTournament: IPlayerInTeamTournament;
    }>(),
    'Create failure': emptyProps(),

    AddPlayerToTeam: props<{
      playerId: number;
      player: IPlayerInTeamTournament;
    }>(),
    'Player added to team successfully': props<{
      updatedPlayerInTeamTournament: IPlayerInTeamTournament;
    }>(),
    'Player add to team failure': emptyProps(),

    RemovePlayerFromTeam: props<{ playerId: number }>(),
    'Remove player from team successfully': props<{
      updatedPlayerInTeamTournament: IPlayerInTeamTournament;
    }>(),
    'Remove player from team failure': emptyProps(),

    Get: props<{ id: number }>(),
    'Get item success': props<{
      playerInTeamTournament: IPlayerInTeamTournament;
    }>(),
    'Get item failure': emptyProps(),

    GetAll: emptyProps(),
    'Get all items success': props<{
      playerInTeamTournaments: IPlayerInTeamTournament[];
    }>(),
    'Get all items failure': emptyProps(),

    GetAllPlayerInTeamTournamentsByTeamIdTournamentId: emptyProps(),
    'Get all playersInTeamTournament by team id and tournament id success':
      props<{
        playersInTeamTournament: IPlayerInTeamTournament[];
      }>(),
    'Get all playersInTeamTournament by team id and tournament id failure':
      emptyProps(),

    GetAllPlayersInTeamTournamentsForMatch: props<{ side: 'home' | 'away' }>(),
    'Get all playersInTeamTournament for match success': props<{
      side: 'home' | 'away';
      playersInTeamTournamentWithPerson: IPlayerInTeamTournamentFullData[];
    }>(),
    'Get all playersInTeamTournament for match failure': emptyProps(),

    GetAllPlayerInTeamTournamentsWithPersonProps: props<{
      teamId: number;
      tournamentId: number;
    }>(),
    'Get all playersInTeamTournament with person props success': props<{
      playersInTeamTournamentWithPerson: IPlayerInTeamTournamentFullData[];
    }>(),
    'Get all playersInTeamTournament with person props failure': emptyProps(),

    GetAllPlayersInTournamentByTournamentId: emptyProps(),
    'Get all players in tournament by tournament id success': props<{
      playersInTeamTournament: IPlayerInTeamTournament[];
    }>(),
    'Get all players in tournament by tournament id failure': emptyProps(),

    Update: props<{
      id: number;
      newPlayerInTeamTournamentData: IPlayerInTeamTournament;
    }>(),
    'Updated successfully': props<{
      updatedPlayerInTeamTournament: IPlayerInTeamTournament;
    }>(),
    'Update failure': emptyProps(),

    Delete: emptyProps(),
    'Deleted successfully': props<{
      playerInTeamTournamentId: number;
      tournament_id: number;
    }>(),
    'Delete failure': emptyProps(),

    DeleteById: props<{ id: number }>(),
    'Deleted by id successfully': props<{
      playerInTeamTournamentId: number;
    }>(),
    'Delete by id failure': emptyProps(),

    ParsPlayersFromTeamEESL: emptyProps,
    'Parsed player from team EESL successfully': props<{
      parseList: any[] | IPlayerInTeamTournament[];
    }>(),
    'Parsed player from team EESL failure': emptyProps(),
  },
});
