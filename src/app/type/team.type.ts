import {IBaseID} from "./base.type";

export interface ITeamData extends IBaseID{
  title: string;
  description?: string;
  team_eesl_id?: number | null;
  team_logo_url?: string;
}


