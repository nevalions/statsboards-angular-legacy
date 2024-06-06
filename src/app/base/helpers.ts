import { AnyObjectWithTitle } from '../type/base.type';
import { AgeStats, IPerson } from '../type/person.type';
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

// export function stringifyTitleUpperCase(
//   item: AnyObjectWithTitle | any,
// ): string {
//   return `${item.title ?? ''}`.toUpperCase().trim();
// }

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

export function calculateAge(dob: Date): number {
  if (!dob) {
    return 0;
  }
  const birthDate = new Date(dob);
  if (isNaN(birthDate.getTime())) {
    throw new Error('Invalid date of birth');
  }
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();
  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
}

function calculateFullAge(dob: Date): { years: number; days: number } {
  if (!dob) {
    return { years: 0, days: 0 };
  }

  const birthDate = new Date(dob);
  const today = new Date();
  if (isNaN(birthDate.getTime())) {
    throw new Error('Invalid date of birth');
  }

  let years = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    years--;
  }

  const lastBirthday = new Date(
    today.getFullYear(),
    birthDate.getMonth(),
    birthDate.getDate(),
  );
  if (lastBirthday > today) {
    lastBirthday.setFullYear(today.getFullYear() - 1);
  }
  const days = Math.floor(
    (today.getTime() - lastBirthday.getTime()) / (24 * 60 * 60 * 1000),
  );

  return { years, days };
}

export function calculateMedian(ages: number[]): number {
  const sortedAges = [...ages].sort((a, b) => a - b);
  const mid = Math.floor(sortedAges.length / 2);

  return sortedAges.length % 2 !== 0
    ? sortedAges[mid]
    : (sortedAges[mid - 1] + sortedAges[mid]) / 2;
}

export function calculateAgeStats(
  players: IPlayerInTeamTournamentWithPersonWithSportWithPosition[],
): AgeStats | null {
  const playersWithFullAges = players
    .map((p) => ({
      ...p.playerInSport?.person,
      fullAge: p.playerInSport?.person?.person_dob
        ? calculateFullAge(p.playerInSport.person.person_dob)
        : null,
    }))
    .filter((player) => player.fullAge !== null);

  if (playersWithFullAges.length === 0) {
    return null;
  }

  const average =
    playersWithFullAges.reduce(
      (acc, player) => acc + (player.fullAge?.years ?? 0),
      0,
    ) / playersWithFullAges.length;
  const sortedAges = playersWithFullAges
    .map((p) => p.fullAge!.years)
    .sort((a, b) => a - b);
  const median = calculateMedian(sortedAges);

  const minPlayer = playersWithFullAges.reduce((prev, current) =>
    prev.fullAge!.years * 365 + prev.fullAge!.days <
    current.fullAge!.years * 365 + current.fullAge!.days
      ? prev
      : current,
  );

  const maxPlayer = playersWithFullAges.reduce((prev, current) =>
    prev.fullAge!.years * 365 + prev.fullAge!.days >
    current.fullAge!.years * 365 + current.fullAge!.days
      ? prev
      : current,
  );

  return {
    average,
    min: minPlayer.fullAge!,
    max: maxPlayer.fullAge!,
    median,
    minPlayer,
    maxPlayer,
  };
}
