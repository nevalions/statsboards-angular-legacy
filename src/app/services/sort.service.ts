export class SortService {
  static sort(data: any[], ...properties: string[]): any[] {
    return data.sort((a, b) => {
      for (let property of properties) {
        const isAscending = !property.startsWith('-');
        const nestedProperties = (isAscending ? property : property.slice(1)).split(".");
        let propertyA = this.getNestedProperty(a, nestedProperties);
        let propertyB = this.getNestedProperty(b, nestedProperties);

        if (propertyA < propertyB) {
          return isAscending ? -1 : 1;
        } else if (propertyA > propertyB) {
          return isAscending ? 1 : -1;
        }
      }
      return 0;
    });
  }

  private static getNestedProperty(obj: any, properties: string[]) {
    return properties.reduce((prev, curr) => prev && prev[curr], obj);
  }
}
