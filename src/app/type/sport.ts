import {IBaseID, IBaseDescription, IBaseIdElse} from "./base.type";

export interface ISport extends IBaseID, IBaseDescription{
  title: string
}

export interface ISportWithYear extends ISport {
  year: number;
}

export interface ISeasonAndSport extends IBaseIdElse {
  sport_id?: number;
}
