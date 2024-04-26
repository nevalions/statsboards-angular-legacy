import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'addSign',
})
export class AddSignPipe implements PipeTransform {
  transform(value: number): string {
    return value < 0 ? `${value}` : `+${value}`;
  }
}
