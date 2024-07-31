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
  is_tournament_logo?: boolean;
  is_main_sponsor?: boolean;
  is_sponsor_line?: boolean;
  is_match_sponsor_line?: boolean;

  is_team_a_start_offense?: boolean;
  is_team_b_start_offense?: boolean;
  is_team_a_start_defense?: boolean;
  is_team_b_start_defense?: boolean;

  is_home_match_team_lower?: boolean;
  is_away_match_team_lower?: boolean;

  is_match_player_lower?: boolean;
  player_match_lower_id?: number | null;

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

  scale_tournament_logo: number;
  scale_main_sponsor: number;
  scale_logo_a: number;
  scale_logo_b: number;

  is_flag: boolean;
  is_goal_team_a: boolean;
  is_goal_team_b: boolean;
  is_timeout_team_a: boolean;
  is_timeout_team_b: boolean;

  match_id: number;
}
