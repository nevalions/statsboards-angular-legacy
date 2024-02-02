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
    const lowerCaseSearch = String(searchString)?.toLowerCase();
    const filterStrategyMap = {
      startsWith: (str: string) => str.startsWith(lowerCaseSearch),
      includes: (str: string) => str.includes(lowerCaseSearch),
    };
    if (!filterStrategyMap.hasOwnProperty(filterStrategy)) {
      throw new Error(`Invalid filter strategy: ${filterStrategy}`);
    }

    console.log(parameter);

    return items.filter((item: T) => {
      let paramValue = '';

      if (parameter.includes('+')) {
        const parts = parameter.split('+').map((part) => part.trim());
        paramValue = parts
          .map((part) => this.getNestedProp(item, part))
          .join(' ');
      } else {
        paramValue = String(this.getNestedProp(item, parameter));
      }

      paramValue = paramValue.toLowerCase();
      return filterStrategyMap[filterStrategy](paramValue);
    });
  }

  private getNestedProp(object: any, pathString: string) {
    const path = pathString.split('.');
    let result = object;
    for (let i = 0; i < path.length; i++) {
      result = result[path[i]];
      if (result == null) break;
    }
    return result;
  }
}
