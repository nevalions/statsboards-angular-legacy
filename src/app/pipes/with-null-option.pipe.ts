import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'withNullOption',
  standalone: true,
})
export class WithNullOptionPipe implements PipeTransform {
  transform(items: any[], includeNull: boolean): any[] {
    if (!includeNull) {
      return items;
    }

    // Define a "None" option object. Make sure it aligns with how your component
    // expects an item object to look, and it should have a unique value to represent "None"
    const noneOption = { title: 'None', id: null };

    // Return a new array with the "None" option as the first item
    return [noneOption, ...items];
  }
}
