import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { searchActions } from './search.actions';
import { catchError, map, switchMap } from 'rxjs/operators';
import { combineLatest, of } from 'rxjs';
import { ITeam } from '../../type/team.type';
import {
  selectAllTeams,
  selectAllTeamsInSport,
} from '../../components/team/store/reducers';
import { selectAllTournaments } from '../../components/tournament/store/reducers';
import { ITournament } from '../../type/tournament.type';
import { AnyObjectWithTitle } from '../../type/base.type';

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

  searchTeams$ = createEffect(() =>
    this.actions$.pipe(
      ofType(searchActions.updateTeamSearchTerm),
      switchMap(({ term }) =>
        // Pretend we're calling a selector to get all teams
        this.store.pipe(select(selectAllTeams)).pipe(
          map((teams: ITeam[]) =>
            searchActions.teamSearchSuccess({
              teams: teams.filter((team) =>
                team.title.toLowerCase().startsWith(term.toLowerCase()),
              ),
            }),
          ),
          catchError(() => of(searchActions.teamSearchFailure())),
        ),
      ),
    ),
  );

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
