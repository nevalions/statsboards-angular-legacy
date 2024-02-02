import { IBaseID } from './base.type';
import { ITeam } from './team.type';
import { IMatchData } from './matchdata.type';

export interface IMatch extends IBaseID {
  match_date: Date;
  week: number;
  match_eesl_id?: number;
  team_a_id: number;
  team_b_id: number;
  tournament_id: number;
}

export interface IMatchTeamsData {
  team_a: ITeam;
  team_b: ITeam;
}

export interface IMatchFullData {
  id: number;
  match_id: number;
  status_code: number;
  match: IMatch;
  teams_data: IMatchTeamsData;
  match_data: IMatchData;
}

export function getDefaultFullData(): IMatchFullData {
  return {
    id: 0,
    match_id: 0,
    status_code: 0,
    match: {
      id: 0,
      match_date: new Date(),
      week: 0,
      team_a_id: 0,
      team_b_id: 0,
      tournament_id: 0,
    },
    teams_data: {
      team_a: {
        id: 0,
        title: 'Loading...',
        description: 'Loading...',
        sport_id: 1,
      },
      team_b: {
        id: 0,
        title: 'Loading...',
        description: 'Loading...',
        sport_id: 1,
      },
    },
    match_data: {
      id: 0,
      match_id: 0,
      score_team_a: 0,
      score_team_b: 0,
      timeout_team_a: '',
      qtr: '',
      gameclock_status: '',
      playclock_status: '',
      down: '',
      game_status: '',
      field_length: 100,
      timeout_team_b: '',
      gameclock: 0,
      playclock: null,
      ball_on: 50,
      distance: '',
    },
  };
}
