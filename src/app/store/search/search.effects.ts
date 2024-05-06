import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { searchActions } from './search.actions';
import { catchError, map, switchMap } from 'rxjs/operators';
import { combineLatest, of, withLatestFrom } from 'rxjs';
import { selectAllTeamsInSport } from '../../components/team/store/reducers';
import { selectAllTournaments } from '../../components/tournament/store/reducers';
import { ITournament } from '../../type/tournament.type';
import { AnyObjectWithTitle } from '../../type/base.type';
import { selectAllPersons } from '../../components/person/store/reducers';
import {
  selectAllPlayersWithPersons,
  selectAllSportPlayersWithPersons,
} from '../../components/player/store/selectors';
import { IPerson } from '../../type/person.type';

@Injectable()
export class SearchEffects {
  searchOnList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(searchActions.searchOnList),
      map(({ context, term, list }) => {
        const results = list['filter']((item: AnyObjectWithTitle) =>
          item.title.toLowerCase().startsWith(term.toLowerCase()),
        );
        return searchActions.listSearchSuccess({ context, results });
      }),
    ),
  );

  // searchPersonsOnList$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(searchActions.updatePersonSearchTerm),
  //     withLatestFrom(this.store.pipe(select(selectAllPersons))),
  //     map(([{ term }, allPersons]) => {
  //       const results = term
  //         ? allPersons.filter((person: IPerson) =>
  //             person.second_name.toLowerCase().includes(term.toLowerCase()),
  //           )
  //         : allPersons;
  //       return searchActions.personSearchSuccess({ persons: results });
  //     }),
  //     catchError(() => of(searchActions.personSearchFailure())),
  //   ),
  // );

  // PERSONS
  searchPersonEffect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(searchActions.updatePersonSearchTerm),
        switchMap((action) =>
          combineLatest([
            of(action.term),
            this.store.pipe(select(selectAllPersons)),
          ]).pipe(
            map(([searchTerm, persons]) => {
              const results = searchTerm
                ? persons.filter((person) =>
                    person.second_name
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase()),
                  )
                : persons;
              return searchActions.personSearchSuccess({ persons: results });
            }),
            catchError(() => of(searchActions.personSearchFailure())),
          ),
        ),
      ),
    { functional: true },
  );

  // PLAYERS
  searchPlayerEffect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(searchActions.updatePlayerInSportSearchTerm),
        switchMap((action) =>
          combineLatest([
            of(action.term),
            this.store.pipe(select(selectAllSportPlayersWithPersons)),
          ]).pipe(
            map(([searchTerm, player]) => {
              const results = searchTerm
                ? player.filter((player) =>
                    player
                      .person!.second_name.toLowerCase()
                      .startsWith(searchTerm.toLowerCase()),
                  )
                : player;
              return searchActions.playerInSportSearchSuccess({
                player: results,
              });
            }),
            catchError(() => of(searchActions.playerInSportSearchFailure())),
          ),
        ),
      ),
    { functional: true },
  );

  // TEAMS
  searchTeamsInSport$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(searchActions.updateTeamInSportSearchTerm),
        switchMap((action) =>
          combineLatest([
            of(action.term),
            this.store.pipe(select(selectAllTeamsInSport)),
          ]).pipe(
            map(([searchTerm, teams]) => {
              const results = searchTerm
                ? teams.filter((team) =>
                    team.title
                      .toLowerCase()
                      .startsWith(searchTerm.toLowerCase()),
                  )
                : teams;
              return searchActions.teamInSportSearchSuccess({ teams: results });
            }),
            catchError(() => of(searchActions.teamInSportSearchFailure())),
          ),
        ),
      ),
    { functional: true },
  );

  searchTournaments$ = createEffect(() =>
    this.actions$.pipe(
      ofType(searchActions.updateTournamentSearchTerm),
      switchMap(({ term }) =>
        // Pretend we're calling a selector to get all tournaments
        this.store.pipe(select(selectAllTournaments)).pipe(
          map((tournaments: ITournament[]) =>
            searchActions.tournamentSearchSuccess({
              tournaments: tournaments.filter((tournament) =>
                tournament.title.toLowerCase().startsWith(term.toLowerCase()),
              ),
            }),
          ),
          catchError(() => of(searchActions.tournamentSearchFailure())),
        ),
      ),
    ),
  );

  constructor(
    private actions$: Actions,
    private store: Store,
  ) {}
}
