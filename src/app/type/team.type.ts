export interface ITeam {
  id?: number | null;
  title: string;
  city?: string;
  description?: string;
  team_eesl_id?: number | undefined | null;
  team_logo_url?: string;
  team_color?: string;
  sport_id: number;
  sponsor_line_id?: number | null;
  main_sponsor_id?: number | null;
}

export interface ITeamTournament {
  id?: number;
  team_id: number;
  tournament_id: number;
}
