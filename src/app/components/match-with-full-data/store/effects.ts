import { concatLatestFrom } from '@ngrx/operators';import { Injectable, inject } from '@angular/core';
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
import { getRouterSelectors, routerNavigatedAction } from '@ngrx/router-store';
import { matchWithFullDataActions } from './actions';
import { MatchWithFullDataService } from '../matchfulldata.service';
import { IMatchWithFullData } from '../../../type/match.type';
import { getAllRouteParameters } from '../../../router/router.selector';
import { sportActions } from '../../sport/store/actions';
import { matchActions } from '../../match/store/actions';

@Injectable()
export class MatchWithFullDataEffects {
  private router = inject(Router);
  private actions$ = inject(Actions);
  private matchWithFullDataService = inject(MatchWithFullDataService);
  private store = inject(Store);

  getMatchIdFromRouteEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(routerNavigatedAction),
        switchMap(({ payload }) => {
          let params = getAllRouteParameters(payload.routerState);
          let matchId = params.get('match_id');
          return of(matchId).pipe(
            filter((id: string | undefined): id is string => !!id),
            switchMap((id: string) => [
              matchWithFullDataActions.getMatchWithFullDataIdSuccessfully({
                matchWithFullDataId: Number(id),
              }),
            ]),
            catchError(() =>
              of(matchWithFullDataActions.getMatchWithFullDataIdFailure()),
            ),
          );
        }),
      );
    },
    { functional: false },
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
    { return this.actions$.pipe(
      ofType(matchWithFullDataActions.createdSuccessfully),
      concatLatestFrom(() => this.store.select(selectCurrentTournamentId)),
      filter(
        ([action, tournamentId]) =>
          action.currentMatchWithFullData.match.tournament_id === tournamentId,
      ),
      map(([action]) =>
        matchWithFullDataActions.updateAllMatchesWithFullDataInTournament({
          newMatchWithFullData: action.currentMatchWithFullData,
        }),
      ),
    ) },
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

  getMatchWithFullDataByIdSuccessEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(matchWithFullDataActions.getMatchWithFullDataIdSuccessfully), // You will have to define this action
        switchMap(({ matchWithFullDataId }) => {
          return this.matchWithFullDataService
            .fetchMatchWithDataById(matchWithFullDataId)
            .pipe(
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
    { return this.actions$.pipe(
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
    ) },
  );
}
