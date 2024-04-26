import { Pipe, PipeTransform } from '@angular/core';
import { hasTitle } from '../base/helpers';

@Pipe({ standalone: true, name: 'hasTitlePipe' })
export class HasTitlePipe implements PipeTransform {
  transform(value: any): string {
    if (value != null && typeof value === 'object' && 'title' in value) {
      return value.title;
    }
    return value;
  }
}
