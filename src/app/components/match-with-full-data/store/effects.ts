import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  catchError,
  filter,
  map,
  mergeMap,
  of,
  switchMap,
  withLatestFrom,
} from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectCurrentTournamentId } from '../../tournament/store/reducers';
import { getRouterSelectors } from '@ngrx/router-store';
import { matchWithFullDataActions } from './actions';
import { MatchWithFullDataService } from '../matchfulldata.service';
import { IMatchWithFullData } from '../../../type/match.type';

@Injectable()
export class MatchWithFullDataEffects {
  getMatchWithFullDataIdFromRouteEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(matchWithFullDataActions.getId),
        mergeMap(() =>
          this.store
            .select(getRouterSelectors().selectRouteParam('match_id'))
            .pipe(
              filter((id: string | undefined): id is string => !!id),
              switchMap((id: string) => [
                matchWithFullDataActions.get({ id: Number(id) }),
                matchWithFullDataActions.getMatchWithFullDataIdSuccessfully({
                  matchWithFullDataId: Number(id),
                }),
              ]),
              catchError(() =>
                of(matchWithFullDataActions.getMatchWithFullDataIdFailure()),
              ),
            ),
        ),
      );
    },
    { functional: true },
  );

  createMatchWithFullDataEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(matchWithFullDataActions.create),
        switchMap(({ request }) => {
          return this.matchWithFullDataService.addItem(request).pipe(
            map((currentMatchWithFullData: IMatchWithFullData) => {
              return matchWithFullDataActions.createdSuccessfully({
                currentMatchWithFullData,
              });
            }),
            catchError(() => {
              return of(matchWithFullDataActions.createFailure());
            }),
          );
        }),
      );
    },
    { functional: true },
  );

  createdSuccessfullyEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(matchWithFullDataActions.createdSuccessfully),
      withLatestFrom(this.store.select(selectCurrentTournamentId)),
      filter(
        ([action, tournamentId]) =>
          action.currentMatchWithFullData.match.tournament_id === tournamentId,
      ),
      map(([action]) =>
        matchWithFullDataActions.updateAllMatchesWithFullDataInTournament({
          newMatchWithFullData: action.currentMatchWithFullData,
        }),
      ),
    ),
  );

  getAllMatchesWithFullDataEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(matchWithFullDataActions.getAll),
        switchMap(() => {
          return this.matchWithFullDataService.findAll().pipe(
            map((matchesWithFullData: IMatchWithFullData[]) => {
              return matchWithFullDataActions.getAllItemsSuccess({
                matchesWithFullData,
              });
            }),
            catchError(() => {
              return of(matchWithFullDataActions.getAllItemsFailure());
            }),
          );
        }),
      );
    },
    { functional: true },
  );

  // getMatchesBySportIdEffect = createEffect(
  //   () => {
  //     return this.actions$.pipe(
  //       ofType(matchWithFullDataActions.getMatchesBySportId),
  //       switchMap(() => this.store.select(selectCurrentSportId)),
  //       filter(
  //         (sportId): sportId is number =>
  //           sportId !== null && sportId !== undefined,
  //       ),
  //       switchMap((sportId: number) =>
  //         this.matchService.fetchMatchesBySportId(sportId).pipe(
  //           map((teams: IMatchWithFullData[]) =>
  //             matchWithFullDataActions.getMatchesBySportIDSuccess({ teams }),
  //           ),
  //           catchError(() => of(matchWithFullDataActions.getMatchesBySportIDFailure())),
  //         ),
  //       ),
  //     );
  //   },
  //   { functional: true },
  // );

  getMatchesWithFullDataByTournamentIdEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(matchWithFullDataActions.getMatchesWithFullDataByTournamentId),
        switchMap(() => this.store.select(selectCurrentTournamentId)),
        filter(
          (tournamentId): tournamentId is number =>
            tournamentId !== null && tournamentId !== undefined,
        ),
        switchMap((tournamentId) => {
          return this.matchWithFullDataService
            .fetchMatchesWithFullDataByTournamentId(tournamentId)
            .pipe(
              map((matchesWithFullData: IMatchWithFullData[]) => {
                return matchWithFullDataActions.getMatchesWithFullDataByTournamentIDSuccess(
                  {
                    matchesWithFullData,
                  },
                );
              }),
              catchError(() => {
                return of(
                  matchWithFullDataActions.getMatchesWithFullDataByTournamentIDFailure,
                );
              }),
            );
        }),
      );
    },
    { functional: true },
  );

  getMatchWithFullDataByIdEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(matchWithFullDataActions.get), // You will have to define this action
        switchMap(({ id }) => {
          return this.matchWithFullDataService.fetchMatchWithDataById(id).pipe(
            // Assuming you have a getTournaments method in your service
            map((matchWithFullData: IMatchWithFullData) => {
              return matchWithFullDataActions.getItemSuccess({
                matchWithFullData,
              });
            }),
            catchError(() => {
              return of(matchWithFullDataActions.getItemFailure());
            }),
          );
        }),
      );
    },
    { functional: true },
  );

  deleteMatchWithFullDataEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(matchWithFullDataActions.delete),
        switchMap(({ id }) => {
          // const _id = typeof id === 'string' ? Number(id) : id;
          return this.matchWithFullDataService.deleteItem(id).pipe(
            map(() => {
              return matchWithFullDataActions.deletedSuccessfully({ id: id });
            }),
            catchError(() => {
              return of(matchWithFullDataActions.deleteFailure());
            }),
          );
        }),
      );
    },
    { functional: true },
  );

  updateMatchesWithFullDataInTournamentEffect = createEffect(() =>
    this.actions$.pipe(
      ofType(matchWithFullDataActions.createdSuccessfully),
      mergeMap((action) => {
        console.log('createdSuccessfully action', action); // log the action

        const newMatch = action.currentMatchWithFullData;
        const currentTournamentId = newMatch.match.tournament_id;

        console.log('currentMatch id and tournament id', {
          matchId: newMatch.id,
          tournamentId: currentTournamentId,
        });
        return [
          matchWithFullDataActions.updateAllMatchesWithFullDataInTournament({
            newMatchWithFullData: newMatch,
          }),
        ];
      }),
    ),
  );

  // navigateOnMatchWithFullDataDeletion$ = createEffect(
  //   () => {
  //     return this.actions$.pipe(
  //       ofType(matchWithFullDataActions.deletedSuccessfully),
  //       tap(() => this.router.navigateByUrl('/')),
  //     );
  //   },
  //   { dispatch: false },
  // );

  constructor(
    private router: Router,
    private actions$: Actions,
    private matchWithFullDataService: MatchWithFullDataService,
    private store: Store,
  ) {}
}
