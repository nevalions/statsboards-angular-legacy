import {IBaseID} from "./base.type";
import {ITeamData} from "./team.type";
import {IMatchData} from "./matchdata.type";

export interface IMatch extends IBaseID{
  match_date: Date
  match_eesl_id?: number
  team_a_id: number,
  team_b_id: number,
  tournament_id: number
}

export interface IMatchTeamsData {
  team_a: ITeamData;
  team_b: ITeamData;
}

export interface IMatchFullData {
  id: number;
  match_id: number;
  status_code: number;
  match: IMatch;
  teams_data: IMatchTeamsData;
  match_data: IMatchData;
}
