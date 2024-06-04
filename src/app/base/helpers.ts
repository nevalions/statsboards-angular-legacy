import { AnyObjectWithTitle } from '../type/base.type';
import { IPerson } from '../type/person.type';
import {
  IPlayerInMatchFullData,
  IPlayerInSport,
  IPlayerInTeamTournamentWithPersonWithSportWithPosition,
} from '../type/player.type';

export function hasTitle(item: any): item is { title: string } {
  return item != null && typeof item === 'object' && 'title' in item;
}

export function toTitleCase(str: string) {
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

export function stringifyPerson(
  item: IPlayerInSport | IPlayerInTeamTournamentWithPersonWithSportWithPosition,
): string {
  if (
    'playerInSport' in item &&
    item.playerInSport &&
    'person' in item.playerInSport
  ) {
    return toTitleCase(
      `${item.playerInSport.person!.second_name} ${item.playerInSport.person!.first_name}`,
    );
  } else if ('person' in item) {
    if (!item.person) {
      return '';
    }
    return toTitleCase(
      `${item.person?.second_name} ${item.person?.first_name}`,
    );
  }
  return 'Unknown Item';
}

export function stringifyMatchPlayer(item: IPlayerInMatchFullData): string {
  if ('match_player' in item && item.match_player && 'person' in item) {
    return toTitleCase(
      `${item.match_player.match_number} ${item.person!.second_name} ${item.person!.first_name}`,
    );
  }
  return 'Unknown Item';
}

export function getTitleCase<T>(item: T, prop: keyof T): string {
  const val = item[prop];
  return typeof val === 'string' ? val : '';
}

export function hexToRgba(hex: string, a: number = 1): string {
  hex = hex.replace(/^#/, '');

  let r: number, g: number, b: number;

  if (hex.length === 3) {
    // For #RGB, double each character (e.g., #ABC -> #AABBCC)
    r = parseInt(hex.charAt(0) + hex.charAt(0), 16);
    g = parseInt(hex.charAt(1) + hex.charAt(1), 16);
    b = parseInt(hex.charAt(2) + hex.charAt(2), 16);
  } else if (hex.length === 6) {
    // For #RRGGBB
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);
  } else if (hex.length === 8) {
    // For #RRGGBBAA
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);
    a = parseInt(hex.substring(6, 8), 16) / 255;
  } else {
    throw new Error('Invalid hex color: ' + hex);
  }

  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

export function averageAge(
  players: IPlayerInTeamTournamentWithPersonWithSportWithPosition[],
): number | null {
  const currentYear = new Date().getFullYear();

  const validAges = players
    .map((p) => p.playerInSport?.person?.person_dob)
    .filter((dob): dob is Date => dob !== null)
    .map((dob) => {
      const dateOfBirth = new Date(dob); // Convert to Date object
      console.log(
        `Date of Birth: ${dob}, Converted: ${dateOfBirth}, Valid: ${!isNaN(dateOfBirth.getTime())}`,
      ); // Log for debugging
      return currentYear - dateOfBirth.getFullYear();
    })
    .filter((age) => !isNaN(age)); // Filter out invalid ages, resulting from invalid DOB strings

  console.log(`Valid Ages: ${validAges}`); // To see the filtered and mapped ages

  if (validAges.length === 0) {
    return null;
  }

  const sum = validAges.reduce((acc, age) => acc + age, 0);
  return sum / validAges.length;
}
