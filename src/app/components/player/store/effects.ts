import { concatLatestFrom } from '@ngrx/operators';import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, filter, map, of, switchMap, withLatestFrom } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { PlayerService } from '../player.service';
import { Store } from '@ngrx/store';
import { routerNavigatedAction } from '@ngrx/router-store';
import { getAllRouteParameters } from '../../../router/router.selector';
import { playerActions } from './actions';
import { IPlayer } from '../../../type/player.type';
import { selectCurrentPlayer } from './reducers';
import { selectCurrentSportId } from '../../sport/store/reducers';
import { SportService } from '../../sport/sport.service';

@Injectable()
export class PlayerEffects {
  private router = inject(Router);
  private actions$ = inject(Actions);
  private playerService = inject(PlayerService);
  private store = inject(Store);

  getPlayerIdFromRouteEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(routerNavigatedAction),
        switchMap(({ payload }) => {
          let params = getAllRouteParameters(payload.routerState);
          let playerId = params.get('player_id');
          return of(playerId).pipe(
            filter((id: string | undefined): id is string => !!id),
            switchMap((id: string) => [
              playerActions.getPlayerIdSuccessfully({ playerId: Number(id) }),
            ]),
            catchError(() => of(playerActions.getPlayerIdFailure())),
          );
        }),
      );
    },
    { functional: false },
  );

  createPlayerEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(playerActions.create),
        switchMap(({ request }) => {
          return this.playerService.addItem(request).pipe(
            map((currentPlayer: IPlayer) => {
              return playerActions.createdSuccessfully({
                currentPlayer,
              });
            }),
            catchError(() => {
              return of(playerActions.createFailure());
            }),
          );
        }),
      );
    },
    { functional: true },
  );

  updatePlayerEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(playerActions.update),
        switchMap(({ id, newPlayerData }) => {
          return this.playerService.editItem(id, newPlayerData).pipe(
            map((updatedPlayer: IPlayer) => {
              return playerActions.updatedSuccessfully({ updatedPlayer });
            }),
          );
        }),
        catchError(() => {
          return of(playerActions.updateFailure);
        }),
      );
    },
    { functional: true },
  );

  getAllPlayers = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(playerActions.getAll),
        switchMap(() => {
          return this.playerService.findAll().pipe(
            map((players: IPlayer[]) => {
              return playerActions.getAllItemsSuccess({
                players,
              });
            }),
            catchError(() => {
              return of(playerActions.getAllItemsFailure());
            }),
          );
        }),
      );
    },
    { functional: true },
  );

  getPlayerByIdSuccessEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(playerActions.getPlayerIdSuccessfully),
        switchMap(({ playerId }) =>
          this.playerService.findById(playerId).pipe(
            map((player: IPlayer) => playerActions.getItemSuccess({ player })),
            catchError(() => of(playerActions.getItemFailure())),
          ),
        ),
      );
    },
    { functional: true },
  );

  getPlayerByIdEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(playerActions.get),
        switchMap(({ id }) =>
          this.playerService.findById(id).pipe(
            map((player: IPlayer) => playerActions.getItemSuccess({ player })),
            catchError(() => of(playerActions.getItemFailure())),
          ),
        ),
      );
    },
    { functional: true },
  );

  getPlayersBySportIdEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(playerActions.getAllPlayersBySportId),
        switchMap(() => this.store.select(selectCurrentSportId)),
        filter(
          (sportId): sportId is number =>
            sportId !== null && sportId !== undefined,
        ),
        switchMap((sportId) => {
          return this.playerService.findPlayersBySportId(sportId).pipe(
            map((players: IPlayer[]) => {
              return playerActions.getAllPlayersBySportIdSuccess({
                players,
              });
            }),
            catchError(() => {
              return of(playerActions.getAllPlayersBySportIdFailure);
            }),
          );
        }),
      );
    },
    { functional: true },
  );

  deletePlayerEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(playerActions.delete),
        concatLatestFrom(() => this.store.select(selectCurrentPlayer)),
        switchMap(([action, currentPlayer]) => {
          if (!currentPlayer || !currentPlayer.id) {
            return of(playerActions.deleteFailure());
          }

          return this.playerService.deleteItem(currentPlayer.id).pipe(
            map(() =>
              playerActions.deletedSuccessfully({
                playerId: currentPlayer.id!,
                sportId: currentPlayer.sport_id!,
              }),
            ),
            catchError(() => {
              return of(playerActions.deleteFailure());
            }),
          );
        }),
      );
    },
    { functional: true },
  );

  // deletePlayerEffect = createEffect(
  //   () => {
  //     return this.actions$.pipe(
  //       ofType(playerActions.delete),
  //       switchMap(({ id }) => {
  //         // const _id = typeof id === 'string' ? Number(id) : id;
  //         return this.playerService.deleteItem(id).pipe(
  //           map(() => {
  //             return playerActions.deletedSuccessfully({ id: id });
  //           }),
  //           catchError(() => {
  //             return of(playerActions.deleteFailure());
  //           }),
  //         );
  //       }),
  //     );
  //   },
  //   { functional: true },
  // );

  navigateOnPlayerDeletion$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(playerActions.deletedSuccessfully),
        tap(({ sportId }) =>
          this.router.navigateByUrl(`/sport/${sportId}/players`),
        ),
      );
    },
    { dispatch: false },
  );
}
