import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { IPlayerInTeamTournament } from '../../../type/player.type';

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

    AddPlayerToTeam: props<{ playerId: number; teamId: number }>(),
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
  },
});
