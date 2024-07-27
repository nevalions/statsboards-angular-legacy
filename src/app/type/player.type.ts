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

export interface IPlayerInTeamTournamentFullData {
  player_team_tournament?: IPlayerInTeamTournament | null;
  person?: IPerson | null;
  position?: IPosition | null;
}

export interface IPlayerInMatch {
  id?: number | null;
  player_match_eesl_id?: number | null;
  player_team_tournament_id?: number | null;
  match_position_id?: number | null;
  match_id?: number | null;
  match_number?: string | null;
  team_id?: number | null;
  is_start?: boolean | null;
}

export interface IPlayerInMatchFullData {
  match_player: IPlayerInMatch;
  player_team_tournament?: IPlayerInTeamTournament | null;
  person?: IPerson | null;
  position?: IPosition | null;
}

export interface IQBStats {
  id: number;
  passes: number;
  passes_completed: number;
  pass_yards: number;
  run_attempts: number;
  run_yards: number;
  fumble: number;
  interception: number;
}

export interface IOffenceStats {
  id: number;
  pass_attempts: number;
  pass_received: number;
  pass_yards: number;
  pass_td: number;
  run_attempts: number;
  run_yards: number;
  run_td: number;
  fumble: number;
}

export interface IPlayerInMatchFullDataWithQbStats {
  match_player: IPlayerInMatch;
  player_team_tournament?: IPlayerInTeamTournament | null;
  person?: IPerson | null;
  position?: IPosition | null;
  qb_stats: IQBStats | null;
}

export interface IPlayerInMatchFullDataWithOffenceStats {
  match_player: IPlayerInMatch;
  player_team_tournament?: IPlayerInTeamTournament | null;
  person?: IPerson | null;
  position?: IPosition | null;
  off_stats: IOffenceStats | null;
}

export interface IRoster {
  home: IPlayerInMatchFullData[];
  away: IPlayerInMatchFullData[];
}
