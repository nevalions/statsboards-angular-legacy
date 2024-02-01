import { Injectable } from '@angular/core';
import { FilterStrategy } from '../type/filter.type';

@Injectable({
  providedIn: 'root',
})
export class FilteringService {
  filterItems<T>(
    items: T[],
    searchString: string,
    parameter: string,
    filterStrategy: FilterStrategy,
  ): T[] {
    const lowerCaseSearch = searchString?.toLowerCase();
    const filterStrategyMap = {
      startsWith: (str: string) => str.startsWith(lowerCaseSearch),
      includes: (str: string) => str.includes(lowerCaseSearch),
    };
    if (!filterStrategyMap.hasOwnProperty(filterStrategy)) {
      throw new Error(`Invalid filter strategy: ${filterStrategy}`);
    }

    return items.filter((item: T) => {
      const paramValue = String(item[parameter as keyof T]).toLowerCase();
      return filterStrategyMap[filterStrategy](paramValue);
    });
  }
}
