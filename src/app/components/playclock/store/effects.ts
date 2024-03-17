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
import { PlayclockService } from '../playclock.service';
import { playclockActions } from './actions';
import { IPlayclock } from '../../../type/playclock.type';
import { selectCurrentMatchId } from '../../match/store/reducers';
import { matchActions } from '../../match/store/actions';
import { selectCurrentPlayclockId } from './reducers';

@Injectable()
export class PlayclockEffects {
  updatePlayclockEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(playclockActions.update),
        switchMap(({ id, newPlayclock }) => {
          return this.playclockService.editPlayclock(id, newPlayclock).pipe(
            map((updatedPlayclock: IPlayclock) => {
              return playclockActions.updatedSuccessfully({
                updatedPlayclock,
              });
            }),
            catchError(() => {
              return of(playclockActions.updateFailure());
            }),
          );
        }),
      );
    },
    { functional: true },
  );

  getPlayclockByIdEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(playclockActions.get),
        switchMap(({ id }) => {
          return this.playclockService.findById(id).pipe(
            map((playclock: IPlayclock) => {
              return playclockActions.getPlayclockSuccess({
                playclock,
              });
            }),
            catchError(() => {
              return of(playclockActions.getPlayclockFailure());
            }),
          );
        }),
      );
    },
    { functional: true },
  );

  getPlayclockByMatchIdMainEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(playclockActions.getPlayClockByMatchId),
        switchMap(() => this.store.select(selectCurrentMatchId)),
        map((matchId) => matchId),
        switchMap((matchId) => {
          return this.playclockService.getPlayclockByMatchId(matchId!).pipe(
            map((playclock: IPlayclock) => {
              return playclockActions.getPlayclockByMatchIDSuccess({
                playclock,
              });
            }),
            catchError(() => {
              return of(playclockActions.getPlayclockByMatchIDFailure());
            }),
          );
        }),
      );
    },
    { functional: true },
  );

  getPlayclockByMatchIdSideEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(matchActions.getMatchIdSuccessfully),
        switchMap((action) =>
          this.playclockService.getPlayclockByMatchId(action.matchId).pipe(
            map((playclock: IPlayclock) =>
              playclockActions.getPlayclockByMatchIDSuccess({ playclock }),
            ),
            catchError((error) =>
              of(playclockActions.getPlayclockByMatchIDFailure()),
            ),
          ),
        ),
      );
    },
    { functional: false },
  );

  // startGameClock = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(playclockActions.startGameClock),
  //     withLatestFrom(this.store.select(selectCurrentPlayclockId)),
  //     exhaustMap(([action, playclockId]) =>
  //       this.playclockService.startGameClock(playclockId!).pipe(
  //         map((response) =>
  //           playclockActions.clockStartSuccess({ playclock: response }),
  //         ),
  //         catchError((error) => of(playclockActions.clockStartFailure())),
  //       ),
  //     ),
  //   ),
  // );

  // pauseGameClock = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(playclockActions.pauseGameClock),
  //     withLatestFrom(this.store.select(selectCurrentPlayclockId)),
  //     exhaustMap(([action, playclockId]) =>
  //       this.playclockService.pauseGameClock(playclockId!).pipe(
  //         map((response) =>
  //           playclockActions.clockPauseSuccess({ playclock: response }),
  //         ),
  //         catchError((error) => of(playclockActions.clockPauseFailure())),
  //       ),
  //     ),
  //   ),
  // );

  // resetGameClock = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(playclockActions.resetGameClock),
  //     withLatestFrom(this.store.select(selectCurrentPlayclockId)),
  //     exhaustMap(([action, playclockId]) =>
  //       this.playclockService.resetGameClock(playclockId!, action.seconds).pipe(
  //         map((response) =>
  //           playclockActions.clockResetSuccess({ playclock: response }),
  //         ),
  //         catchError((error) => of(playclockActions.clockResetFailure())),
  //       ),
  //     ),
  //   ),
  // );

  startPlayclock = createEffect(() =>
    this.actions$.pipe(
      ofType(playclockActions.startPlayClock),
      withLatestFrom(this.store.select(selectCurrentPlayclockId)),
      exhaustMap(([action, playclockId]) =>
        this.playclockService.startPlayClock(playclockId!, action.seconds).pipe(
          map((response) =>
            playclockActions.playClockStartSuccess({ playclock: response }),
          ),
          catchError((error) => of(playclockActions.playClockStartFailure())),
        ),
      ),
    ),
  );

  resetPlayclock = createEffect(() =>
    this.actions$.pipe(
      ofType(playclockActions.resetPlayClock),
      withLatestFrom(this.store.select(selectCurrentPlayclockId)),
      exhaustMap(([action, playclockId]) =>
        this.playclockService.resetPlayClock(playclockId!).pipe(
          map((response) =>
            playclockActions.playClockResetSuccess({ playclock: response }),
          ),
          catchError((error) => of(playclockActions.playClockResetFailure())),
        ),
      ),
    ),
  );

  constructor(
    private actions$: Actions,
    private playclockService: PlayclockService,
    private store: Store,
  ) {}
}
