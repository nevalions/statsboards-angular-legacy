export const offensiveLine = ['ot', 't', 'oc', 'c', 'og', 'g', 'ol'];
export const offensiveBackfield = ['qb', 'rb', 'fb', 'hb'];
export const offensiveReceivers = ['wr', 'te'];
export const offensiveST = ['k'];

export const offensePositions = [
  ...offensiveLine,
  ...offensiveBackfield,
  ...offensiveReceivers,
  ...offensiveST,
];

export const defensiveLine = ['dt', 'de', 'n', 'nt', 'ng', 'dl'];
export const defensiveLB = ['lb', 'olb', 'mlb'];
export const defensiveBacks = ['db', 'cb', 'ss', 'fs'];
export const defensiveST = ['p'];

export const defensePositions = [
  ...defensiveLine,
  ...defensiveLB,
  ...defensiveBacks,
  ...defensiveST,
];

export const specialTeams = [...offensiveST, ...defensiveST, 'ls', 'h'];
