import { IPlayerInMatchFullData } from '../type/player.type';

export const offensiveLine: string[] = [
  'lt',
  'rt',
  'rg',
  'rt',
  'ot',
  't',
  'oc',
  'c',
  'og',
  'g',
  'ol',
];
export const offensiveBackfield = ['qb', 'rb', 'fb', 'hb'];
export const offensiveReceivers = ['wr', 'slot', 'te'];
export const offensiveST = ['k'];

export const offensePositions = [
  ...offensiveLine,
  ...offensiveBackfield,
  ...offensiveReceivers,
  ...offensiveST,
];

export const defensiveLine = ['a', 'e', 'dt', 'de', 'n', 'nt', 'ng', 'dl'];
export const defensiveLB = ['slb', 'wlb', 'lb', 'olb', 'mlb'];
export const defensiveBacks = ['db', 'cb', 'ss', 'fs'];
export const defensiveST = ['p'];

export const defensePositions = [
  ...defensiveLine,
  ...defensiveLB,
  ...defensiveBacks,
  ...defensiveST,
];

export const specialTeams = [...offensiveST, ...defensiveST, 'ls', 'h'];

export function selectPlayersForPositions(
  players: IPlayerInMatchFullData[],
  positionsHierarchy: Record<string, string[]>,
  excludedPlayerIds: Set<string> = new Set<string>(),
): Record<string, IPlayerInMatchFullData | null> {
  let selectedPositions: Record<string, IPlayerInMatchFullData | null> = {};

  for (const [positionKey, hierarchy] of Object.entries(positionsHierarchy)) {
    const player =
      players.find((player) => {
        const matchPlayerId = player?.match_player?.id;
        const positionTitle = player?.position?.title?.toLowerCase();
        return (
          matchPlayerId &&
          positionTitle &&
          hierarchy.includes(positionTitle) &&
          !excludedPlayerIds.has(matchPlayerId.toString())
        );
      }) || null;

    if (player) {
      selectedPositions[positionKey] = player;
      if (player.match_player && player.match_player.id) {
        excludedPlayerIds.add(player.match_player.id.toString());
      }
    } else {
      selectedPositions[positionKey] = null;
    }
  }

  return selectedPositions;
}
