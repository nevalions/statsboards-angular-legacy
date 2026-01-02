import { concatLatestFrom } from '@ngrx/operators';import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { routerNavigatedAction } from '@ngrx/router-store';
import { Store } from '@ngrx/store';
import { catchError, filter, map, of, switchMap, withLatestFrom } from 'rxjs';
import { getAllRouteParameters } from '../../../router/router.selector';
import {
  IPlayerInMatch,
  IPlayerInMatchFullData,
} from '../../../type/player.type';
import {
  selectCurrentMatch,
  selectCurrentMatchId,
} from '../../match/store/reducers';
import { PlayerMatchService } from '../player-match.service';
import { playerInMatchActions } from './actions';
import { selectCurrentPlayerInMatch } from './reducers';

@Injectable()
export class PlayerInMatchEffects {
  private router = inject(Router);
  private actions$ = inject(Actions);
  private playerInMatchService = inject(PlayerMatchService);
  private store = inject(Store);

  getPlayerInMatchIdFromRouteEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(routerNavigatedAction),
        switchMap(({ payload }) => {
          let params = getAllRouteParameters(payload.routerState);
          let playerInMatchId = params.get('player_in_match_id');
          return of(playerInMatchId).pipe(
            filter((id: string | undefined): id is string => !!id),
            switchMap((id: string) => [
              playerInMatchActions.getPlayerInMatchIdSuccessfully({
                playerInMatchId: Number(id),
              }),
            ]),
            catchError(() =>
              of(playerInMatchActions.getPlayerInMatchIdFailure()),
            ),
          );
        }),
      );
    },
    { functional: false },
  );

  createPlayerInMatchEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(playerInMatchActions.create),
        switchMap(({ request }) => {
          return this.playerInMatchService.addItem(request).pipe(
            map((currentPlayerInMatch: IPlayerInMatch) => {
              return playerInMatchActions.createdSuccessfully({
                currentPlayerInMatch,
              });
            }),
            catchError(() => {
              return of(playerInMatchActions.createFailure());
            }),
          );
        }),
      );
    },
    { functional: true },
  );

  getPlayerInMatchFullDataOnCreateSuccessEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(playerInMatchActions.createdSuccessfully),
        switchMap(({ currentPlayerInMatch }) =>
          this.playerInMatchService
            .findCurrentPlayerInMatchFullData(currentPlayerInMatch.id!)
            .pipe(
              map((playerInMatchFullData: IPlayerInMatchFullData) =>
                playerInMatchActions.getPlayerInMatchFullDataSuccess({
                  playerInMatchFullData,
                }),
              ),
              catchError(() =>
                of(playerInMatchActions.getPlayerInMatchFullDataFailure()),
              ),
            ),
        ),
      );
    },
    { functional: true },
  );

  getSelectedPlayerLowerByIdEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(playerInMatchActions.getSelectedPlayerLowerById),
        switchMap(({ playerInMatchId }) =>
          this.playerInMatchService
            .findCurrentPlayerInMatchFullData(playerInMatchId)
            .pipe(
              map((player: IPlayerInMatchFullData) =>
                playerInMatchActions.getSelectedPlayerLowerByIdSuccessfully({
                  player,
                }),
              ),
              catchError(() =>
                of(playerInMatchActions.getSelectedPlayerLowerByIdFailure()),
              ),
            ),
        ),
      );
    },
    { functional: true },
  );

  // getSelectedFootballQbFullStatsLowerByIdEffect = createEffect(
  //   () => {
  //     return this.actions$.pipe(
  //       ofType(playerInMatchActions.getSelectedFootballQbLowerById),
  //       withLatestFrom(
  //         this.store.pipe(select(selectLowerSelectedFootballQbStats)),
  //       ),
  //       switchMap(
  //         ([action, qb]: [
  //           { qbInMatchId: number },
  //           IPlayerInMatchFullDataWithQbStats | null,
  //         ]) => {
  //           console.log('qb effect', action, qb);
  //           if (qb) {
  //             return of(
  //               playerInMatchActions.getSelectedPlayerLowerByIdSuccessfully({
  //                 player: qb,
  //               }),
  //             );
  //           } else {
  //             return of(
  //               playerInMatchActions.getSelectedFootballQbLowerByIdFailure(),
  //             );
  //           }
  //         },
  //       ),
  //       catchError(() =>
  //         of(playerInMatchActions.getSelectedFootballQbLowerByIdFailure()),
  //       ),
  //     );
  //   },
  //   { functional: true },
  // );

  updatePlayerInMatchEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(playerInMatchActions.update),
        switchMap(({ id, newPlayerInMatchData }) => {
          return this.playerInMatchService
            .editItem(id, newPlayerInMatchData)
            .pipe(
              map((updatedPlayerInMatch: IPlayerInMatch) => {
                return playerInMatchActions.updatedSuccessfully({
                  updatedPlayerInMatch,
                });
              }),
            );
        }),
        catchError(() => {
          return of(playerInMatchActions.updateFailure);
        }),
      );
    },
    { functional: true },
  );

  getPlayerInMatchFullDataOnUpdateSuccessEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(playerInMatchActions.updatedSuccessfully),
        switchMap(({ updatedPlayerInMatch }) =>
          this.playerInMatchService
            .findCurrentPlayerInMatchFullData(updatedPlayerInMatch.id!)
            .pipe(
              map((playerInMatchFullData: IPlayerInMatchFullData) =>
                playerInMatchActions.getPlayerInMatchFullDataSuccess({
                  playerInMatchFullData,
                }),
              ),
              catchError(() =>
                of(playerInMatchActions.getPlayerInMatchFullDataFailure()),
              ),
            ),
        ),
      );
    },
    { functional: true },
  );

  getAllPlayersInMatchEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(playerInMatchActions.getAllPlayersInMatch),
        switchMap(() => this.store.select(selectCurrentMatchId)),
        filter((matchId) => matchId !== null && matchId !== undefined),
        switchMap((matchId) => {
          return this.playerInMatchService
            .findPlayersInMatchByMatchId(matchId!)
            .pipe(
              map((playersInMatch: IPlayerInMatch[]) => {
                return playerInMatchActions.getAllPlayersInMatchSuccess({
                  playersInMatch,
                });
              }),
              catchError(() => {
                return of(playerInMatchActions.getAllPlayersInMatchFailure());
              }),
            );
        }),
      );
    },
    { functional: true },
  );

  getAllPlayersFullDataInMatchEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(playerInMatchActions.getAllPlayersWithFullDataInMatch),
        switchMap(() => this.store.select(selectCurrentMatchId)),
        filter((matchId) => matchId !== null && matchId !== undefined),
        switchMap((matchId) => {
          return this.playerInMatchService
            .findPlayersFullDataByMatchId(matchId!)
            .pipe(
              map((playersInMatch: IPlayerInMatchFullData[]) => {
                return playerInMatchActions.getAllPlayersWithFullDataInMatchSuccess(
                  {
                    playersInMatch,
                  },
                );
              }),
              catchError(() => {
                return of(
                  playerInMatchActions.getAllPlayersWithFullDataInMatchFailure(),
                );
              }),
            );
        }),
      );
    },
    { functional: true },
  );

  getPlayerInMatchByIdSuccessEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(playerInMatchActions.getPlayerInMatchIdSuccessfully),
        switchMap(({ playerInMatchId }) =>
          this.playerInMatchService.findById(playerInMatchId).pipe(
            map((playerInMatch: IPlayerInMatch) =>
              playerInMatchActions.getItemSuccess({
                playerInMatch,
              }),
            ),
            catchError(() => of(playerInMatchActions.getItemFailure())),
          ),
        ),
      );
    },
    { functional: true },
  );

  getPlayerInMatchByIdEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(playerInMatchActions.get),
        switchMap(({ id }) =>
          this.playerInMatchService.findById(id).pipe(
            map((playerInMatch: IPlayerInMatch) =>
              playerInMatchActions.getItemSuccess({
                playerInMatch,
              }),
            ),
            catchError(() => of(playerInMatchActions.getItemFailure())),
          ),
        ),
      );
    },
    { functional: true },
  );

  deletePlayerInMatchEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(playerInMatchActions.delete),
        concatLatestFrom(() => this.store.select(selectCurrentPlayerInMatch)),
        switchMap(([action, currentPlayerInMatch]) => {
          if (!currentPlayerInMatch || !currentPlayerInMatch.id) {
            return of(playerInMatchActions.deleteFailure());
          }

          return this.playerInMatchService
            .deleteItem(currentPlayerInMatch.id)
            .pipe(
              map(() =>
                playerInMatchActions.deletedSuccessfully({
                  playerInMatchId: currentPlayerInMatch.id!,
                  match_id: currentPlayerInMatch.match_id!,
                }),
              ),
              catchError(() => {
                return of(playerInMatchActions.deleteFailure());
              }),
            );
        }),
      );
    },
    { functional: true },
  );

  deletePlayerInMatchByIdEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(playerInMatchActions.deleteById),
        switchMap(({ id }) => {
          return this.playerInMatchService.deleteItem(id).pipe(
            map(() => {
              return playerInMatchActions.deletedByIdSuccessfully({
                playerInMatchId: id,
              });
            }),
            catchError(() => {
              return of(playerInMatchActions.deleteByIdFailure());
            }),
          );
        }),
      );
    },
    { functional: true },
  );

  parsPlayersInMatchFromEESLEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(playerInMatchActions.parsPlayersFromMatchEESL),
        switchMap(() => this.store.select(selectCurrentMatch)),
        filter((match) => match !== null && match !== undefined),
        switchMap((match) =>
          this.playerInMatchService
            .parsPlayersFromMatchEESL(match!.match_eesl_id!)
            .pipe(
              map((parseList: any[] | IPlayerInMatchFullData[]) =>
                playerInMatchActions.parsedPlayerFromMatchEESLSuccessfully({
                  parseList,
                }),
              ),
              catchError(() =>
                of(playerInMatchActions.parsedPlayerFromMatchEESLFailure()),
              ),
            ),
        ),
      );
    },
    { functional: true },
  );
}
