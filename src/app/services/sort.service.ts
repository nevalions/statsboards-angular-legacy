export class SortService {
  static sort(data: any[], property: string, isAscending: boolean = true) {
    return data.sort((a, b) => {
      const propertyA = a[property];
      const propertyB = b[property];

      // Check if property values are numbers
      if (!isNaN(propertyA) && !isNaN(propertyB)) {
        // Numeric sorting
        return (isAscending ? 1 : -1) * (propertyA - propertyB);
      } else {
        // String sorting
        return (isAscending ? 1 : -1) * propertyA.localeCompare(propertyB);
      }
    });
  }
}
