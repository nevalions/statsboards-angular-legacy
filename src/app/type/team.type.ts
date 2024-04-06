export interface ITeam {
  id?: number;
  title: string;
  city?: string;
  description?: string;
  team_eesl_id?: number | null;
  team_logo_url?: string;
  team_color?: string;
  sport_id: number;
  sponsor_line_id?: number;
  main_sponsor_id?: number;
}

export interface ITeamTournament {
  id?: number;
  team_id: number;
  tournament_id: number;
}
