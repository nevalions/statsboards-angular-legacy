export interface ITournament {
  title: string;
  description: string;
  season_id: number;
  sport_id: number;
  tournament_eesl_id?: number;
  tournament_logo_url?: string;
  tournament_logo_icon_url?: string;
  tournament_logo_web_url?: string;
  id?: number | null;
  main_sponsor_id?: number | null;
  sponsor_line_id?: number | null;
}
