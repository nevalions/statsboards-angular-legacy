import { IPerson } from '../type/person.type';
import { AnyObjectWithTitle } from '../type/base.type';

export function hasTitle(item: any): item is { title: string } {
  return item != null && typeof item === 'object' && 'title' in item;
}

export function toTitleCase(str: string | null | undefined) {
  if (str) {
    return str
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  } else {
    return '';
  }
}

export function stringifyNameSurname(item: IPerson): string {
  return `${toTitleCase(item.first_name) ?? ''} ${toTitleCase(item.second_name) ?? ''}`.trim();
}

export function stringifyTitle(item: AnyObjectWithTitle): string {
  return `${toTitleCase(item.title) ?? ''}`.trim();
}

export function getTitleCase<T>(item: T, prop: keyof T): string {
  const val = item[prop];
  return typeof val === 'string' ? val : '';
}
