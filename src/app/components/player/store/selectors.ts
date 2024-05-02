import { createSelector } from '@ngrx/store';
import { selectAllPersons } from '../../person/store/reducers';
import {
  selectAllPlayers,
  selectAllSportPlayers,
  selectCurrentPlayerId,
} from './reducers';
import { IPlayer, IPlayerInSport } from '../../../type/player.type';
import { IPerson } from '../../../type/person.type';

export const selectAllPlayersWithPersons = createSelector(
  selectAllPersons,
  selectAllPlayers,
  (persons: IPerson[], players: IPlayer[]) => {
    const combinedPlayers: IPlayerInSport[] = players.map((player) => {
      const person = persons.find((p) => p.id === player.person_id) || null;
      return { player, person };
    });
    // console.log('Combined Players with Persons:', combinedPlayers);
    return combinedPlayers;
  },
);

export const selectAllSportPlayersWithPersons = createSelector(
  selectAllPersons,
  selectAllSportPlayers,
  (persons: IPerson[], players: IPlayer[]) => {
    const combinedPlayers: IPlayerInSport[] = players.map((player) => {
      const person = persons.find((p) => p.id === player.person_id) || null;
      return { player, person };
    });
    // console.log('Combined Players with Persons:', combinedPlayers);
    return combinedPlayers;
  },
);

export const selectCurrentPlayerWithPerson = createSelector(
  selectAllPersons,
  selectAllPlayers,
  selectCurrentPlayerId,
  (persons, players, currentPlayerId): IPlayerInSport | null | undefined => {
    const currentPlayer: IPlayer | undefined | null = players.find(
      (player) => player.id === currentPlayerId,
    );
    const currentPerson: IPerson | undefined | null = currentPlayer
      ? persons.find((person) => person.id === currentPlayer.person_id)
      : null;
    const result: IPlayerInSport | undefined | null = currentPlayer
      ? ({ player: currentPlayer, person: currentPerson } as IPlayerInSport)
      : null;
    // console.log('Current Player with Person:', result);
    return result;
  },
);
