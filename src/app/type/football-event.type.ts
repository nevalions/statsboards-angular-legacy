import { ITeam } from './team.type';
import { IPlayerInMatchFullData } from './player.type';
import { IEnumObject } from './base.type';

export enum IFootballPlayType {
  None = '',
  Run = 'run',
  Pass = 'pass',
  Kick = 'kick',
  Kickoff = 'kickoff',
  Punt = 'punt',
  PatOne = 'pat 1',
  PatTwo = 'pat 2',
}

export enum IEventHash {
  None = '',
  Left = 'left',
  Middle = 'middle',
  Right = 'right',
}

export enum IEventDirection {
  None = '',
  LeftWide = 'left wide',
  Left = 'left',
  Middle = 'middle',
  Right = 'right',
  RightWide = 'right wide',
}

export enum IFootballPlayResult {
  None = '',
  Run = 'run',
  PassCompleted = 'completed',
  PassIncomplete = 'incomplete',
  PassDropped = 'dropped',
  PassDeflected = 'deflected',
  PassIntercepted = 'intercepted',
  Sack = 'sack',
  Kick = 'kick',
  KickBlocked = 'kick blocked',
  PuntReturn = 'punt return',
  PuntBlocked = 'punt blocked',
  KickOffReturn = 'kickoff return',
  Flag = 'flag',
}

export enum IFootballScoreResult {
  None = '',
  Td = 'td',
  TdDefence = 'defence td',
  KickGood = 'kick is good',
  KickMissed = 'kick is missed',
  PatOneGood = 'pat 1 is good',
  PatOneMissed = 'pat 1 is missed',
  PatOneReturn = 'pat 1 return',
  PatTwoGood = 'pat 2 is good',
  PatTwoMissed = 'pat 2 is missed',
  PatTwoReturn = 'pat 2 return',
  KickOffTdReturn = 'kickoff td return',
  PuntTdReturn = 'punt td return',
  Safety = 'safety',
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
  play_direction?: string | null;
  play_type?: string | null;
  play_result?: string | null;
  score_result?: string | null;

  is_fumble?: boolean | null;
  is_fumble_recovered?: boolean | null;

  run_player?: number | null;
  pass_received_player?: number | null;
  pass_dropped_player?: number | null;
  pass_deflected_player?: number | null;
  pass_intercepted_player?: number | null;
  fumble_player?: number | null;
  fumble_recovered_player?: number | null;
  tackle_player?: number | null;
  assist_tackle_player?: number | null;
  sack_player?: number | null;
  kick_player?: number | null;
  punt_player?: number | null;
  score_player?: number | null;
  defence_score_player?: number | null;
  kickoff_player?: number | null;
  return_player?: number | null;
  pat_one_player?: number | null;
  flagged_player?: number | null;
}

export interface IFootballEventWithPlayers {
  id?: number | null;
  match_id?: number | null;

  event_number?: number | null;
  event_qtr?: number | null;
  ball_on?: number | null;
  distance_moved?: number | null;
  offense_team?: ITeam | null;
  event_qb?: IPlayerInMatchFullData | null;
  event_down?: number | null;
  event_distance?: number | null;

  event_hash?: IEnumObject | null;
  play_direction?: IEnumObject | null;
  play_type?: IEnumObject | null;
  play_result?: IEnumObject | null;
  score_result?: IEnumObject | null;

  is_fumble?: boolean | null;
  is_fumble_recovered?: boolean | null;

  run_player?: IPlayerInMatchFullData | null;
  pass_received_player?: IPlayerInMatchFullData | null;
  pass_dropped_player?: IPlayerInMatchFullData | null;
  pass_deflected_player?: IPlayerInMatchFullData | null;
  pass_intercepted_player?: IPlayerInMatchFullData | null;
  fumble_player?: IPlayerInMatchFullData | null;
  fumble_recovered_player?: IPlayerInMatchFullData | null;
  tackle_player?: IPlayerInMatchFullData | null;
  assist_tackle_player?: IPlayerInMatchFullData | null;
  sack_player?: IPlayerInMatchFullData | null;
  score_player?: IPlayerInMatchFullData | null;
  defence_score_player?: IPlayerInMatchFullData | null;
  kick_player?: IPlayerInMatchFullData | null;
  kickoff_player?: IPlayerInMatchFullData | null;
  return_player?: IPlayerInMatchFullData | null;
  pat_one_player?: IPlayerInMatchFullData | null;
  flagged_player?: IPlayerInMatchFullData | null;
  punt_player?: IPlayerInMatchFullData | null;
}

export const eventHashOptions: IEnumObject[] = Object.entries(IEventHash).map(
  ([key, value]) => ({
    value: value,
    label: key,
  }),
);

export const eventDirectionOptions: IEnumObject[] = Object.entries(
  IEventDirection,
).map(([key, value]) => ({
  value: value,
  label: key,
}));
