import {IBaseID, IBaseDescription} from "./base.type";

export interface ISeason extends IBaseID, IBaseDescription{
  year: number
}
