export interface IMatchData {
  id?: number;
  score_team_a?: number;
  score_team_b?: number;
  timeout_team_a?: string;
  qtr?: string;
  gameclock_status?: string;
  playclock_status?: string;
  down?: string;
  match_id?: number;
  game_status?: string;
  field_length?: number;
  timeout_team_b?: string;
  gameclock?: number;
  playclock?: number | null;
  ball_on?: number;
  distance?: string;
}

export interface IScoreboard {
  id?: number;
  is_qtr?: boolean;
  is_time?: boolean;
  is_playclock?: boolean;
  is_downdistance?: boolean;
  team_a_color?: string;
  team_b_color?: string;
  match_id: 0;
}

export function DefaultMatchData(match_id: number): IMatchData {
  return {
    id: 83, // Or any default ID value
    match_id: match_id, // It's better to set match_id manually as it seems to be a required field
    score_team_a: 0,
    score_team_b: 0,
    timeout_team_a: '',
    timeout_team_b: '',
    game_status: '',
    field_length: 0,
    gameclock: 0,
    playclock: null,
    ball_on: 0,
    distance: '',
    qtr: '',
    gameclock_status: '',
    playclock_status: '',
    down: '',
  };
}
