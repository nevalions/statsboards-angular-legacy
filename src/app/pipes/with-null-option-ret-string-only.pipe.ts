import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'withNullOptionRetStringOnly',
  standalone: true,
})
export class WithNullOptionRetStringOnlyPipe implements PipeTransform {
  transform(items: any[], includeNull: boolean): any[] {
    if (!includeNull) {
      return items;
    }
    return ['None', ...items];
  }
}
