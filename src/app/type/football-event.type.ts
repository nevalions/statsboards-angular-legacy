import { ITeam } from './team.type';
import { IPlayerInMatchFullData } from './player.type';

export enum FootballPlayType {
  Run = 'run',
  Pass = 'pass',
  Kickoff = 'kickoff',
  Punt = 'punt',
  FieldGoal = 'field goal',
}

export enum EventHash {
  Left = 'l',
  Middle = 'm',
  Right = 'r',
}

export enum FootballPlayResult {
  Run = 'run',
  PassCompleted = 'pass completed',
  PassDropped = 'pass dropped',
  PassDeleted = 'pass deleted',
  PassIntercepted = 'pass intercepted',
  Sack = 'sack',
  Kick = 'kick',
  Punt = 'punt',
  Flag = 'flag',
}

export interface IFootballEvent {
  id?: number | null;
  match_id?: number | null;

  event_number?: number | null;
  event_qtr?: number | null;
  ball_on?: number | null;
  offense_team?: number | null;
  event_qb?: number | null;
  event_down?: number | null;
  event_distance?: number | null;

  event_hash?: string | null;
  play_type?: string | null;
  play_result?: string | null;
  fumble_result?: string | null; //TODO

  run_player?: number | null;
  pass_received_player?: number | null;
  pass_dropped_player?: number | null;
  pass_deflected_player?: number | null;
  pass_intercepted_player?: number | null;
  fumble_player?: number | null;
  fumble_recovered_player?: number | null;
  tackle_player?: number | null;
  sack_player?: number | null;
  kick_player?: number | null;
  punt_player?: number | null;
  flagged_player?: number | null; //TODO
}

export interface IFootballEventWithPlayers {
  id?: number | null;
  match_id?: number | null;

  event_number?: number | null;
  event_qtr?: [1, 2, 3, 4] | null;
  ball_on?: number | null;
  offense_team?: ITeam;
  event_qb?: IPlayerInMatchFullData | null;
  event_down?: [1, 2, 3, 4] | null;
  event_distance?: number | null;

  event_hash?: EventHash | null;
  play_type?: FootballPlayType | null;
  play_result?: FootballPlayResult | null;

  run_player?: IPlayerInMatchFullData | null;
  pass_received_player?: IPlayerInMatchFullData | null;
  pass_dropped_player?: IPlayerInMatchFullData | null;
  pass_deflected_player?: IPlayerInMatchFullData | null;
  pass_intercepted_player?: IPlayerInMatchFullData | null;
  fumble_player?: IPlayerInMatchFullData | null;
  fumble_recovered_player?: IPlayerInMatchFullData | null;
  tackle_player?: IPlayerInMatchFullData | null;
  sack_player?: IPlayerInMatchFullData | null;
  kick_player?: IPlayerInMatchFullData | null;
  punt_player?: IPlayerInMatchFullData | null;
}
