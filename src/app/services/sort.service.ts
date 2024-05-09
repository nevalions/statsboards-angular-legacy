export class SortService {
  static sort(data: any[], ...properties: string[]): any[] {
    if (data && data.length > 0) {
      return [...data].sort((a, b) => this.compareProperties(a, b, properties));
    }
    return data;
  }

  private static compareProperties(
    a: any,
    b: any,
    properties: string[],
  ): number {
    for (let property of properties) {
      const isAscending = !property.startsWith('-');

      if (property.slice(1)) {
        const nestedProperties = (
          isAscending ? property : property.slice(1)
        ).split('.');

        let propertyA = this.getNestedProperty(a, nestedProperties);
        let propertyB = this.getNestedProperty(b, nestedProperties);

        [propertyA, propertyB] = this.normalizeProperties(propertyA, propertyB);

        if (propertyA < propertyB) {
          return isAscending ? -1 : 1;
        } else if (propertyA > propertyB) {
          return isAscending ? 1 : -1;
        }
      }
    }

    return 0;
  }

  private static getNestedProperty(obj: any, properties: string[]): any {
    return properties.reduce((prev, curr) => prev && prev[curr], obj);
  }

  private static normalizeProperties(
    propertyA: any,
    propertyB: any,
  ): [any, any] {
    // Convert numerical strings to numbers for correct sorting
    if (!isNaN(+propertyA)) {
      propertyA = +propertyA;
    }
    if (!isNaN(+propertyB)) {
      propertyB = +propertyB;
    }

    if (typeof propertyA === 'string') {
      propertyA = propertyA.toLowerCase();
    }

    if (typeof propertyB === 'string') {
      propertyB = propertyB.toLowerCase();
    }

    return [propertyA, propertyB];
  }
}
