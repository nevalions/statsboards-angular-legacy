import { BehaviorSubject, Observable } from 'rxjs';

export enum ICautionColors {
  Caution = '#ebd6a8',
  MaxCaution = '#CF5F10FF',
  MinCaution = '#BAE7F3FF',
  Transparent = 'transparent',
}

export interface IEnumObject {
  value: string;
  label: string;
}

export interface IBaseID {
  id?: number;
}

export interface IBaseDescription {
  description?: string;
}

export interface IBaseTitle {
  title?: string;
}

export interface AnyObjectWithTitle {
  title: string;

  [key: string]: any;
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

export interface UploadResizeImageResponse {
  original: string;
  icon: string;
  webview: string;
}

// export type UploadFile = {
//   filePath: string;
// };
