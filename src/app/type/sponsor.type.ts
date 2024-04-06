export interface ISponsor {
  title: string;
  logo_url: string;
  scale_logo: number;
  id?: number;
}

export interface ISponsorLine {
  title: string;
  id?: number;
}

export interface ISponsorLineConnection {
  sponsor_id: number;
  sponsor_line_id: number;
  position: number;
}
