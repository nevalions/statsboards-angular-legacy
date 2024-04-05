import { IBaseDescription, IBaseID, IBaseTitle } from './base.type';

export interface ITournament extends IBaseDescription, IBaseTitle {
  season_id: number;
  sport_id: number;
  tournament_eesl_id?: number | string;
  tournament_logo_url?: string;
  id?: number;
  main_sponsor_id?: number;
}
