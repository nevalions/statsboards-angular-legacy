import { createSelector } from '@ngrx/store';
import { selectAllPersons } from '../../person/store/reducers';
import {
  selectAllPlayers,
  selectAllSportPlayers,
  selectCurrentPlayerId,
} from './reducers';
import { IPlayer, IPlayerInSport } from '../../../type/player.type';
import { IPerson } from '../../../type/person.type';

function combinePlayerWithPerson(
  persons: IPerson[],
  player: IPlayer,
): IPlayerInSport {
  const person = persons.find((p) => p.id === player.person_id) || null;
  return { player, person };
}

export const selectAllPlayersWithPersons = createSelector(
  selectAllPersons,
  selectAllPlayers,
  (persons, players) =>
    players.map((player) => combinePlayerWithPerson(persons, player)),
);

export const selectAllSportPlayersWithPersons = createSelector(
  selectAllPersons,
  selectAllSportPlayers,
  (persons, players): IPlayerInSport[] | [] => {
    if (persons && players) {
      const playersWithPersons = players.map((player) =>
        combinePlayerWithPerson(persons, player),
      );

      return playersWithPersons.sort((a, b) => {
        const aName = a.person?.second_name ?? '';
        const bName = b.person?.second_name ?? '';
        return aName.localeCompare(bName);
      });
    } else {
      return [];
    }
  },
);

export const selectAvailablePersonsForSport = createSelector(
  selectAllPersons,
  selectAllSportPlayersWithPersons,
  (allPersons: IPerson[], sportPlayersWithPersons) => {
    const playersPersonIds = sportPlayersWithPersons.map(
      (playerWithPerson) => playerWithPerson.person?.id,
    );

    return allPersons.filter(
      (person: IPerson) => !playersPersonIds.includes(person.id),
    );
  },
);

export const selectCurrentPlayerWithPerson = createSelector(
  selectAllPersons,
  selectAllPlayers,
  selectCurrentPlayerId,
  (persons, players, currentPlayerId): IPlayerInSport | null | undefined => {
    const currentPlayer = players.find(
      (player) => player.id === currentPlayerId,
    );
    return currentPlayer
      ? combinePlayerWithPerson(persons, currentPlayer)
      : null;
  },
);
