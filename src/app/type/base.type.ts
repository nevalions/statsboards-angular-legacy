export interface IBaseID {
  id: number;
}

export interface IBaseDescription {
  description?: string;
}

export interface IBaseTitle {
  title?: string;
}

export interface IBaseName {
  name?: string;
}

export interface IBaseYear {
  year?: number;
}

export interface IBaseIdTitle extends IBaseID, IBaseTitle, IBaseName, IBaseYear {

}
