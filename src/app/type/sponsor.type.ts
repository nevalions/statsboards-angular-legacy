export interface ISponsor {
  title: string;
  logo_url: string;
  id?: number;
}

export interface ISponsorLine {
  title: string;
  tournament_id?: number;
  team_id?: number;
  id?: number;
}

export interface ISponsorLineConnection {
  sponsor_id: number;
  sponsor_line_id: number;
}
