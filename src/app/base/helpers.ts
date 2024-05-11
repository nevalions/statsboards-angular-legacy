import { IPerson } from '../type/person.type';
import { AnyObjectWithTitle } from '../type/base.type';
import { ISport } from '../type/sport.type';
import { IPlayerInSport } from '../type/player.type';

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

export function stringifySurnameName(item: IPerson): string {
  return `${toTitleCase(item.second_name) ?? ''} ${toTitleCase(item.first_name) ?? ''}`.trim();
}

export function stringifySportPlayerSurnameName(item: IPlayerInSport): string {
  if (item.person) {
    return `${toTitleCase(item.person.second_name) ?? ''} ${toTitleCase(item.person.first_name) ?? ''}`.trim();
  }
  return item.toString();
}

export function stringifyTitle(item: AnyObjectWithTitle | any): string {
  return `${toTitleCase(item.title) ?? ''}`.trim();
}

export function stringifyTitleUpperCase(
  item: AnyObjectWithTitle | any,
): string {
  return `${item.title ?? ''}`.toUpperCase().trim();
}

export function getTitleCase<T>(item: T, prop: keyof T): string {
  const val = item[prop];
  return typeof val === 'string' ? val : '';
}
