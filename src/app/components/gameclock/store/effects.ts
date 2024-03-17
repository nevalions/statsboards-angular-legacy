import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  catchError,
  exhaustMap,
  map,
  of,
  switchMap,
  withLatestFrom,
} from 'rxjs';

import { Store } from '@ngrx/store';
import { gameclockActions } from './actions';
import { IGameclock } from '../../../type/gameclock.type';
import { selectCurrentMatchId } from '../../match/store/reducers';
import { matchActions } from '../../match/store/actions';
import { selectCurrentGameclockId } from './reducers';
import { GameClockService } from '../gameclock.service';

@Injectable()
export class GameclockEffects {
  updateGameclockEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(gameclockActions.update),
        switchMap(({ id, newGameclock }) => {
          return this.gameclockService.editGameclock(id, newGameclock).pipe(
            map((updatedGameclock: IGameclock) => {
              return gameclockActions.updatedSuccessfully({
                updatedGameclock,
              });
            }),
            catchError(() => {
              return of(gameclockActions.updateFailure());
            }),
          );
        }),
      );
    },
    { functional: true },
  );

  getGameclockByIdEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(gameclockActions.get),
        switchMap(({ id }) => {
          return this.gameclockService.findById(id).pipe(
            map((gameclock: IGameclock) => {
              return gameclockActions.getGameclockSuccess({
                gameclock,
              });
            }),
            catchError(() => {
              return of(gameclockActions.getGameclockFailure());
            }),
          );
        }),
      );
    },
    { functional: true },
  );

  getGameclockByMatchIdMainEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(gameclockActions.getGameClockByMatchId),
        switchMap(() => this.store.select(selectCurrentMatchId)),
        map((matchId) => matchId),
        switchMap((matchId) => {
          return this.gameclockService.getGameclockByMatchId(matchId!).pipe(
            map((gameclock: IGameclock) => {
              return gameclockActions.getGameclockByMatchIDSuccess({
                gameclock,
              });
            }),
            catchError(() => {
              return of(gameclockActions.getGameclockByMatchIDFailure());
            }),
          );
        }),
      );
    },
    { functional: true },
  );

  getGameclockByMatchIdSideEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(matchActions.getMatchIdSuccessfully),
        switchMap((action) =>
          this.gameclockService.getGameclockByMatchId(action.matchId).pipe(
            map((gameclock: IGameclock) =>
              gameclockActions.getGameclockByMatchIDSuccess({ gameclock }),
            ),
            catchError((error) =>
              of(gameclockActions.getGameclockByMatchIDFailure()),
            ),
          ),
        ),
      );
    },
    { functional: false },
  );

  startGameClock = createEffect(() =>
    this.actions$.pipe(
      ofType(gameclockActions.startGameClock),
      withLatestFrom(this.store.select(selectCurrentGameclockId)),
      exhaustMap(([action, gameclockId]) =>
        this.gameclockService.startGameClock(gameclockId!).pipe(
          map((response) =>
            gameclockActions.clockStartSuccess({ gameclock: response }),
          ),
          catchError((error) => of(gameclockActions.clockStartFailure())),
        ),
      ),
    ),
  );

  pauseGameClock = createEffect(() =>
    this.actions$.pipe(
      ofType(gameclockActions.pauseGameClock),
      withLatestFrom(this.store.select(selectCurrentGameclockId)),
      exhaustMap(([action, gameclockId]) =>
        this.gameclockService.pauseGameClock(gameclockId!).pipe(
          map((response) =>
            gameclockActions.clockPauseSuccess({ gameclock: response }),
          ),
          catchError((error) => of(gameclockActions.clockPauseFailure())),
        ),
      ),
    ),
  );

  resetGameClock = createEffect(() =>
    this.actions$.pipe(
      ofType(gameclockActions.resetGameClock),
      withLatestFrom(this.store.select(selectCurrentGameclockId)),
      exhaustMap(([action, gameclockId]) =>
        this.gameclockService.resetGameClock(gameclockId!, action.seconds).pipe(
          map((response) =>
            gameclockActions.clockResetSuccess({ gameclock: response }),
          ),
          catchError((error) => of(gameclockActions.clockResetFailure())),
        ),
      ),
    ),
  );

  // startGameclock = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(gameclockActions.startGameClock),
  //     withLatestFrom(this.store.select(selectCurrentGameclockId)),
  //     exhaustMap(([action, gameclockId]) =>
  //       this.gameclockService.startGameClock(gameclockId!, action.seconds).pipe(
  //         map((response) =>
  //           gameclockActions.gameClockStartSuccess({ gameclock: response }),
  //         ),
  //         catchError((error) => of(gameclockActions.gameClockStartFailure())),
  //       ),
  //     ),
  //   ),
  // );
  //
  // resetGameclock = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(gameclockActions.resetGameClock),
  //     withLatestFrom(this.store.select(selectCurrentGameclockId)),
  //     exhaustMap(([action, gameclockId]) =>
  //       this.gameclockService.resetGameClock(gameclockId!).pipe(
  //         map((response) =>
  //           gameclockActions.gameClockResetSuccess({ gameclock: response }),
  //         ),
  //         catchError((error) => of(gameclockActions.gameClockResetFailure())),
  //       ),
  //     ),
  //   ),
  // );

  constructor(
    private actions$: Actions,
    private gameclockService: GameClockService,
    private store: Store,
  ) {}
}
