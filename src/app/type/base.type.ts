import { BehaviorSubject, Observable } from 'rxjs';

export interface IBaseID {
  id?: number;
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

export interface IBaseIdElse extends IBaseID, IBaseTitle, IBaseName, IBaseYear {
  routeInfo?: string;
}

export type PagedDataArgs<T> = {
  data$: Observable<T[]>;
  currentPage$: BehaviorSubject<number>;
  itemsPerPage$: BehaviorSubject<number>;
};

export interface PaginationData<T> {
  items: T[];
  currentPage: number;
  itemsPerPage: number;
}

export type Breadcrumb = {
  caption: string;
  routerLink: string;
  level?: number;
};
