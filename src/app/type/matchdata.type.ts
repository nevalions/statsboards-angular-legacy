import {IBaseID} from "./base.type";

export interface IMatchData extends IBaseID{
  score_team_a?: number;
  score_team_b?: number;
  timeout_team_a?: string;
  qtr?: string;
  gameclock_status?: string;
  playclock_status?: string;
  down?: string;
  match_id: number;
  game_status?: string;
  field_length?: number;
  timeout_team_b?: string;
  gameclock?: number;
  playclock?: number | null;
  ball_on?: number;
  distance?: string;
}
