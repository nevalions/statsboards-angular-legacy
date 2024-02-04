import { IBaseID } from './base.type';

export interface ITeam {
  id?: number;
  title: string;
  description?: string;
  team_eesl_id?: number | null;
  team_logo_url?: string;
  sport_id: number;
}
