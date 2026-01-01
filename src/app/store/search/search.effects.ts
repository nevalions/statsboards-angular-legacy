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
import { selectAllMatchesInTournament } from '../../components/match/store/reducers';
import { IMatchWithFullData } from '../../type/match.type';
import { selectAllMatchesWithFullDataInTournament } from '../../components/match-with-full-data/store/reducers';

@Injectable()
export class SearchEffects {
  searchOnList$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(searchActions.searchOnList),
      map(({ context, term, list }) => {
        const results = list['filter']((item: AnyObjectWithTitle) =>
          item.title.toLowerCase().startsWith(term.toLowerCase()),
        );
        return searchActions.listSearchSuccess({ context, results });
      }),
    );
  });

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
    () => {
      return this.actions$.pipe(
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
      );
    },
    { functional: true },
  );

  // PLAYERS
  searchPlayerEffect$ = createEffect(
    () => {
      return this.actions$.pipe(
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
      );
    },
    { functional: true },
  );

  // TEAMS
  searchTeamsInSport$ = createEffect(
    () => {
      return this.actions$.pipe(
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
      );
    },
    { functional: true },
  );
  //
  // //TOURNAMENTS
  // searchTournamentsEffect$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(searchActions.updateTournamentSearchTerm),
  //     switchMap(({ term }) =>
  //       // Pretend we're calling a selector to get all tournaments
  //       this.store.pipe(select(selectAllTournaments)).pipe(
  //         map((tournaments: ITournament[]) =>
  //           searchActions.tournamentSearchSuccess({
  //             tournaments: tournaments.filter((tournament) =>
  //               tournament.title.toLowerCase().startsWith(term.toLowerCase()),
  //             ),
  //           }),
  //         ),
  //         catchError(() => of(searchActions.tournamentSearchFailure())),
  //       ),
  //     ),
  //   ),
  // );

  //MATCHES
  searchMatchesEffect$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(searchActions.updateMatchSearchTerm),
        switchMap((action) =>
          combineLatest([
            of(action.term),
            this.store.pipe(select(selectAllMatchesWithFullDataInTournament)),
          ]).pipe(
            map(([searchTerm, matches]) => {
              const results = searchTerm
                ? matches.filter(
                    (match: IMatchWithFullData) =>
                      match.teams_data?.team_a.title
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                      match.teams_data?.team_b.title
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()),
                  )
                : matches;
              return searchActions.matchSearchSuccess({ matches: results });
            }),
            catchError(() => of(searchActions.matchSearchFailure())),
          ),
        ),
      );
    },
    { functional: true },
  );
  searchMatchesByWeekEffect$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(searchActions.updateMatchSearchWeek),
        switchMap((action) =>
          combineLatest([
            of(action.week),
            this.store.pipe(select(selectAllMatchesWithFullDataInTournament)),
          ]).pipe(
            map(([searchTerm, matches]) => {
              const results = searchTerm
                ? matches.filter((match: IMatchWithFullData) =>
                    match.match.week
                      .toString()
                      .toLowerCase()
                      .startsWith(searchTerm.toString().toLowerCase()),
                  )
                : matches;
              return searchActions.matchSearchWeekSuccess({ matches: results });
            }),
            catchError(() => of(searchActions.matchSearchWeekFailure())),
          ),
        ),
      );
    },
    { functional: true },
  );

  //   = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(searchActions.updateMatchSearchTerm),
  //     switchMap(({ term }) =>
  //       // Pretend we're calling a selector to get all tournaments
  //       this.store.pipe(select(selectAllMatchesWithFullDataInTournament)).pipe(
  //         map((matches: IMatchWithFullData[]) =>
  //           searchActions.matchSearchSuccess({
  //             matches: matches.filter(
  //               (match: IMatchWithFullData) =>
  //                 match.teams_data?.team_a.title
  //                   .toLowerCase()
  //                   .startsWith(term.toLowerCase()) ||
  //                 match.teams_data?.team_b.title
  //                   .toLowerCase()
  //                   .startsWith(term.toLowerCase()),
  //             ),
  //           }),
  //         ),
  //         catchError(() => of(searchActions.matchSearchFailure())),
  //       ),
  //     ),
  //   ),
  // );

  constructor(
    private actions$: Actions,
    private store: Store,
  ) {}
}
