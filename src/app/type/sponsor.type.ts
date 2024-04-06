export interface ISponsor {
  title: string;
  logo_url: string;
  scale_logo: number;
  id?: number;
}

export interface ISponsorWithPosition {
  sponsor: ISponsor;
  position: number;
}

export interface ISponsorLine {
  title: string;
  is_visible: boolean;
  id?: number;
}

export interface ISponsorLineConnection {
  id?: number;
  sponsor_id: number;
  sponsor_line_id: number;
  position: number;
}

export interface ISponsorLineFullData {
  sponsor_line: ISponsorLine;
  sponsors: ISponsorWithPosition[];
}
