import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'teamName',
})
export class TeamNamePipe implements PipeTransform {
  transform(value: string): string {
    if (value.toLowerCase() === 'a') {
      return 'Home';
    } else if (value.toLowerCase() === 'b') {
      return 'Away';
    } else {
      return value;
    }
  }
}
