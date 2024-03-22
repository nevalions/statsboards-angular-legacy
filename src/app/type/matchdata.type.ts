export interface IMatchData {
  id?: number;
  score_team_a?: number;
  score_team_b?: number;
  timeout_team_a?: string;
  qtr?: string;
  down?: string;
  match_id?: number;
  game_status?: string;
  field_length?: number;
  timeout_team_b?: string;
  ball_on?: number;
  distance?: string;
}

export interface IScoreboard {
  id?: number;
  is_qtr?: boolean;
  is_time?: boolean;
  is_playclock?: boolean;
  is_downdistance?: boolean;

  team_a_game_color?: string;
  team_b_game_color?: string;
  team_a_game_title?: string;
  team_b_game_title?: string;
  team_a_game_logo?: string;
  team_b_game_logo?: string;

  use_team_a_game_color: boolean;
  use_team_b_game_color: boolean;
  use_team_a_game_title: boolean;
  use_team_b_game_title: boolean;
  use_team_a_game_logo: boolean;
  use_team_b_game_logo: boolean;

  match_id: number;
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
    ball_on: 0,
    distance: '',
    qtr: '',
    down: '',
  };
}
