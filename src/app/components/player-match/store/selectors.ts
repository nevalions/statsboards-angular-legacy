import { createSelector } from '@ngrx/store';
import {
  defensePositions,
  defensiveBacks,
  defensiveLB,
  defensiveLine,
  offensePositions,
  offensiveBackfield,
  offensiveLine,
  offensiveReceivers,
} from '../../../base/footballHelpers';
import { SortService } from '../../../services/sort.service';
import {
  IPlayerInMatchFullData,
  IPlayerInTeamTournamentFullData,
} from '../../../type/player.type';
import { selectCurrentMatchWithFullData } from '../../match-with-full-data/store/reducers';
import {
  selectAllAwayPlayersInTeamTournamentWithPerson,
  selectAllHomePlayersInTeamTournamentWithPerson,
} from '../../player-team-tournament/store/reducers';
import {
  selectAllPlayersInMatchFullData,
  selectSelectedPlayerInMatchId,
} from './reducers';

export const selectHomeTeamRoster = createSelector(
  selectAllPlayersInMatchFullData,
  selectCurrentMatchWithFullData,
  (players, match) => {
    if (players && match) {
      const homeRoster = players.filter(
        (player) => player.match_player.team_id === match.match.team_a_id,
      );
      // console.log('homeRoster', homeRoster);
      return SortService.sort(homeRoster, 'match_player.match_number');
    }
    return [];
  },
);

export const selectAwayTeamRoster = createSelector(
  selectAllPlayersInMatchFullData,
  selectCurrentMatchWithFullData,
  (players, match) => {
    if (players && match) {
      const awayRoster = players.filter(
        (player) => player.match_player.team_id === match.match.team_b_id,
      );
      return SortService.sort(awayRoster, 'match_player.match_number');
    }
    return [];
  },
);

export const selectAvailableHomePlayers = createSelector(
  selectAllHomePlayersInTeamTournamentWithPerson,
  selectHomeTeamRoster,
  selectSelectedPlayerInMatchId,
  (
    teamPlayers: IPlayerInTeamTournamentFullData[],
    matchPlayers: IPlayerInMatchFullData[],
    selectedPlayerId: number | null | undefined,
  ) => {
    if (!matchPlayers) {
      return SortService.sort(teamPlayers, 'person.second_name');
    }

    // console.log('selectedPlayerId', selectedPlayerId);

    const matchPlayersIds = matchPlayers.map(
      (matchPlayer) => matchPlayer.match_player.player_team_tournament_id,
    );

    let availablePlayersInTeam = teamPlayers.filter(
      (player) =>
        !matchPlayersIds.includes(player.player_team_tournament?.id) ||
        player.player_team_tournament?.id === selectedPlayerId,
    );

    if (
      selectedPlayerId &&
      !availablePlayersInTeam.some(
        (player) => player.player_team_tournament?.id === selectedPlayerId,
      )
    ) {
      const selectedPlayer = teamPlayers.find(
        (player) => player.player_team_tournament?.id === selectedPlayerId,
      );
      if (selectedPlayer) {
        // console.log('pushed player');
        availablePlayersInTeam.push(selectedPlayer);
      }
    }

    return SortService.sort(availablePlayersInTeam, 'person.second_name');
  },
);

export const selectAvailableAwayPlayers = createSelector(
  selectAllAwayPlayersInTeamTournamentWithPerson,
  selectAwayTeamRoster,
  (
    teamPlayers: IPlayerInTeamTournamentFullData[],
    matchPlayers: IPlayerInMatchFullData[],
  ) => {
    if (!matchPlayers) {
      return teamPlayers;
    }
    const matchPlayersIds = matchPlayers.map(
      (matchPlayer) => matchPlayer.match_player.player_team_tournament_id,
    );

    if (teamPlayers && matchPlayers) {
      const availablePlayersInTeam = teamPlayers.filter(
        (players) =>
          !matchPlayersIds.includes(players.player_team_tournament?.id),
      );
      return SortService.sort(availablePlayersInTeam, 'person.second_name');
    }
    return [];
  },
);

export const selectHomeFootballOffense = createSelector(
  selectHomeTeamRoster,
  (homePlayers: IPlayerInMatchFullData[]) => {
    if (!homePlayers) {
      return [];
    }
    const offensePlayers = homePlayers.filter((player) => {
      if (player.position) {
        return offensePositions.includes(player.position.title!.toLowerCase());
      }
      return [];
    });
    return offensePlayers;
  },
);

export const selectAwayFootballOffense = createSelector(
  selectAwayTeamRoster,
  (awayPlayers: IPlayerInMatchFullData[]) => {
    if (!awayPlayers) {
      return [];
    }
    const offensePlayers = awayPlayers.filter((player) => {
      if (player.position) {
        return offensePositions.includes(player.position.title!.toLowerCase());
      }
      return [];
    });
    return offensePlayers;
  },
);

export const selectHomeFootballDefense = createSelector(
  selectHomeTeamRoster,
  (homePlayers: IPlayerInMatchFullData[]) => {
    if (!homePlayers) {
      return [];
    }
    const defensePlayers = homePlayers.filter((player) => {
      if (player.position) {
        return defensePositions.includes(player.position.title!.toLowerCase());
      }
      return [];
    });
    return defensePlayers;
  },
);

export const selectAwayFootballDefense = createSelector(
  selectAwayTeamRoster,
  (awayPlayers: IPlayerInMatchFullData[]) => {
    if (!awayPlayers) {
      return [];
    }
    const defensePlayers = awayPlayers.filter((player) => {
      if (player.position) {
        return defensePositions.includes(player.position.title!.toLowerCase());
      }
      return [];
    });
    return defensePlayers;
  },
);

// start defense
export const selectAwayFootballStartDefense = createSelector(
  selectAwayFootballDefense,
  (awayRoster: IPlayerInMatchFullData[]) => {
    if (!awayRoster) {
      return [];
    }
    const startPlayers = awayRoster.filter(
      (player) => player.match_player.is_start,
    );
    return startPlayers;
  },
);
export const selectHomeFootballStartDefense = createSelector(
  selectHomeFootballDefense,
  (homeRoster: IPlayerInMatchFullData[]) => {
    if (!homeRoster) {
      return [];
    }
    const startPlayers = homeRoster.filter(
      (player) => player.match_player.is_start,
    );
    return startPlayers;
  },
);

// start offense
export const selectAwayFootballStartOffense = createSelector(
  selectAwayFootballOffense,
  (awayRoster: IPlayerInMatchFullData[]) => {
    if (!awayRoster) {
      return [];
    }
    const startPlayers = awayRoster.filter(
      (player) => player.match_player.is_start,
    );
    return startPlayers;
  },
);
export const selectHomeFootballStartOffense = createSelector(
  selectHomeFootballOffense,
  (homeRoster: IPlayerInMatchFullData[]) => {
    if (!homeRoster) {
      return [];
    }
    const startPlayers = homeRoster.filter(
      (player) => player.match_player.is_start,
    );
    return startPlayers;
  },
);

// football positions
// defense
// DL
export const selectAwayFootballStartDL = createSelector(
  selectAwayFootballStartDefense,
  (roster: IPlayerInMatchFullData[]) => {
    if (!roster) {
      return [];
    }

    return roster.filter((player) => {
      const positionTitle = player.position?.title?.toLowerCase() ?? '';
      return defensiveLine.includes(positionTitle);
    });
  },
);
export const selectHomeFootballStartDL = createSelector(
  selectHomeFootballStartDefense,
  (roster: IPlayerInMatchFullData[]) => {
    if (!roster) {
      return [];
    }

    return roster.filter((player) => {
      const positionTitle = player.position?.title?.toLowerCase() ?? '';
      return defensiveLine.includes(positionTitle);
    });
  },
);

// LB
export const selectAwayFootballStartLB = createSelector(
  selectAwayFootballStartDefense,
  (roster: IPlayerInMatchFullData[]) => {
    if (!roster) {
      return [];
    }

    return roster.filter((player) => {
      const positionTitle = player.position?.title?.toLowerCase() ?? '';
      return defensiveLB.includes(positionTitle);
    });
  },
);
export const selectHomeFootballStartLB = createSelector(
  selectHomeFootballStartDefense,
  (roster: IPlayerInMatchFullData[]) => {
    if (!roster) {
      return [];
    }

    return roster.filter((player) => {
      const positionTitle = player.position?.title?.toLowerCase() ?? '';
      return defensiveLB.includes(positionTitle);
    });
  },
);

// DB
export const selectAwayFootballStartDB = createSelector(
  selectAwayFootballStartDefense,
  (roster: IPlayerInMatchFullData[]) => {
    if (!roster) {
      return [];
    }

    return roster.filter((player) => {
      const positionTitle = player.position?.title?.toLowerCase() ?? '';
      return defensiveBacks.includes(positionTitle);
    });
  },
);
export const selectHomeFootballStartDB = createSelector(
  selectHomeFootballStartDefense,
  (roster: IPlayerInMatchFullData[]) => {
    if (!roster) {
      return [];
    }

    return roster.filter((player) => {
      const positionTitle = player.position?.title?.toLowerCase() ?? '';
      return defensiveBacks.includes(positionTitle);
    });
  },
);

// offense
// OL
export const selectAwayFootballStartOL = createSelector(
  selectAwayFootballStartOffense,
  (roster: IPlayerInMatchFullData[]) => {
    if (!roster) {
      return [];
    }

    return roster.filter((player) => {
      const positionTitle = player.position?.title?.toLowerCase() ?? '';
      return offensiveLine.includes(positionTitle);
    });
  },
);
export const selectHomeFootballStartOL = createSelector(
  selectHomeFootballStartOffense,
  (roster: IPlayerInMatchFullData[]) => {
    if (!roster) {
      return [];
    }

    return roster.filter((player) => {
      const positionTitle = player.position?.title?.toLowerCase() ?? '';
      return offensiveLine.includes(positionTitle);
    });
  },
);

// Backfield
export const selectAwayFootballStartBackfield = createSelector(
  selectAwayFootballStartOffense,
  (roster: IPlayerInMatchFullData[]) => {
    if (!roster) {
      return [];
    }

    return roster.filter((player) => {
      const positionTitle = player.position?.title?.toLowerCase() ?? '';
      return offensiveBackfield.includes(positionTitle);
    });
  },
);
export const selectHomeFootballStartBackfield = createSelector(
  selectHomeFootballStartOffense,
  (roster: IPlayerInMatchFullData[]) => {
    if (!roster) {
      return [];
    }

    return roster.filter((player) => {
      const positionTitle = player.position?.title?.toLowerCase() ?? '';
      return offensiveBackfield.includes(positionTitle);
    });
  },
);

// WR
export const selectAwayFootballStartWR = createSelector(
  selectAwayFootballStartOffense,
  (roster: IPlayerInMatchFullData[]) => {
    if (!roster) {
      return [];
    }

    return roster.filter((player) => {
      const positionTitle = player.position?.title?.toLowerCase() ?? '';
      return offensiveReceivers.includes(positionTitle);
    });
  },
);
export const selectHomeFootballStartWR = createSelector(
  selectHomeFootballStartOffense,
  (roster: IPlayerInMatchFullData[]) => {
    if (!roster) {
      return [];
    }

    return roster.filter((player) => {
      const positionTitle = player.position?.title?.toLowerCase() ?? '';
      return offensiveReceivers.includes(positionTitle);
    });
  },
);
