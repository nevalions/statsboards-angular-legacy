import {IBaseDescription, IBaseID, IBaseTitle} from "./base.type";

export interface ITournament extends
  IBaseID,
  IBaseDescription,
  IBaseTitle
{
  season_id: number;
  sport_id: number;
  tournament_eesl_id?: number | string;
  tournament_logo_url?: string;
}
