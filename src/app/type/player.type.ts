import { IPerson } from './person.type';
import { IPosition } from './position.type';
import { ITeam } from './team.type';

export interface IPlayer {
  id?: number | null;
  sport_id?: number;
  person_id: number | null;
  player_eesl_id?: number | null;
}

export interface IPlayerInSport {
  player: IPlayer;
  person: IPerson | null;
}

export interface IPlayerInTeamTournament {
  id?: number | null;
  player_team_tournament_eesl_id?: number | null;
  player_id?: number;
  position_id?: number | null;
  team_id?: number | null;
  tournament_id?: number | null;
  player_number?: string | null;
}

export interface IPlayerInTeamTournamentWithPersonWithSportWithPosition {
  playerInSport: IPlayerInSport | null;
  playerInTeamTournament: IPlayerInTeamTournament;
  position?: IPosition | null;
  team?: ITeam | null;
}

export interface IPlayerInMatch {
  id?: number | null;
  player_match_eesl_id?: number | null;
  player_team_tournament_id?: number | null;
  match_position_id?: number | null;
  match_id?: number | null;
  match_number?: string | null;
  team_id?: number | null;
}

export interface IPlayerInMatchFullData {
  match_player: IPlayerInMatch;
  team_tournament_player?: IPlayerInTeamTournament | null;
  person?: IPerson | null;
}
