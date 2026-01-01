import { concatLatestFrom } from '@ngrx/operators';import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  catchError,
  exhaustMap,
  map,
  of,
  switchMap,
  withLatestFrom,
} from 'rxjs';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { matchDataActions } from './actions';
import { MatchDataService } from '../../matchData.service';
import { IMatchData } from '../../../../type/matchdata.type';
import { matchActions } from '../actions';
import { selectCurrentMatchId } from '../reducers';
import { selectCurrentMatchDataId } from './reducers';

@Injectable()
export class MatchDataEffects {
  updateMatchDataEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(matchDataActions.update),
        switchMap(({ id, newMatchData }) => {
          return this.matchDataService.editMatchData(id, newMatchData).pipe(
            map((updatedMatchData: IMatchData) => {
              return matchDataActions.updatedSuccessfully({
                updatedMatchData,
              });
            }),
            catchError(() => {
              return of(matchDataActions.updateFailure());
            }),
          );
        }),
      );
    },
    { functional: true },
  );

  updateMatchDataByKeyValueEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(matchDataActions.updateMatchDataByKeyValue),
        switchMap(({ id, data }) => {
          return this.matchDataService.editMatchDataKeyValue(id, data).pipe(
            map((updatedMatchData: IMatchData) => {
              return matchDataActions.updateMatchDataByKeyValueSuccessfully({
                updatedMatchData,
              });
            }),
            catchError(() => {
              return of(matchDataActions.updateMatchDataByKeyValueFailure());
            }),
          );
        }),
      );
    },
    { functional: true },
  );

  getMatchDataByIdEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(matchDataActions.get),
        switchMap(({ id }) => {
          return this.matchDataService.findById(id).pipe(
            map((matchdata: IMatchData) => {
              return matchDataActions.getItemSuccess({
                matchdata,
              });
            }),
            catchError(() => {
              return of(matchActions.getItemFailure());
            }),
          );
        }),
      );
    },
    { functional: true },
  );

  getMatchDataByMatchIdMainEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(matchDataActions.getMatchDataByMatchId),
        switchMap(() => this.store.select(selectCurrentMatchId)),
        map((matchId) => matchId),
        switchMap((matchId) => {
          return this.matchDataService.getMatchDataByMatchId(matchId!).pipe(
            map((matchdata: IMatchData) => {
              return matchDataActions.getMatchdataByMatchIDSuccess({
                matchdata,
              });
            }),
            catchError(() => {
              return of(matchDataActions.getMatchdataIdFailure());
            }),
          );
        }),
      );
    },
    { functional: true },
  );

  getMatchDataByMatchIdSideEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(matchActions.getMatchIdSuccessfully),
        switchMap((action) =>
          this.matchDataService.getMatchDataByMatchId(action.matchId).pipe(
            map((matchdata: IMatchData) =>
              matchDataActions.getMatchdataByMatchIDSuccess({ matchdata }),
            ),
            catchError((error) =>
              of(matchDataActions.getMatchdataByMatchIDFailure()),
            ),
          ),
        ),
      );
    },
    { functional: false },
  );

  startMatchDataGameClock = createEffect(() =>
    { return this.actions$.pipe(
      ofType(matchDataActions.startGameClock),
      concatLatestFrom(() => this.store.select(selectCurrentMatchDataId)),
      exhaustMap(([action, matchDataId]) =>
        this.matchDataService.startGameClock(matchDataId!).pipe(
          map((response) =>
            matchDataActions.clockStartSuccess({ matchData: response }),
          ),
          catchError((error) => of(matchDataActions.clockStartFailure())),
        ),
      ),
    ) },
  );

  pauseMatchDataGameClock = createEffect(() =>
    { return this.actions$.pipe(
      ofType(matchDataActions.pauseGameClock),
      concatLatestFrom(() => this.store.select(selectCurrentMatchDataId)),
      exhaustMap(([action, matchDataId]) =>
        this.matchDataService.pauseGameClock(matchDataId!).pipe(
          map((response) =>
            matchDataActions.clockPauseSuccess({ matchData: response }),
          ),
          catchError((error) => of(matchDataActions.clockPauseFailure())),
        ),
      ),
    ) },
  );

  resetMatchDataGameClock = createEffect(() =>
    { return this.actions$.pipe(
      ofType(matchDataActions.resetGameClock),
      concatLatestFrom(() => this.store.select(selectCurrentMatchDataId)),
      exhaustMap(([action, matchDataId]) =>
        this.matchDataService.resetGameClock(matchDataId!, action.seconds).pipe(
          map((response) =>
            matchDataActions.clockResetSuccess({ matchData: response }),
          ),
          catchError((error) => of(matchDataActions.clockResetFailure())),
        ),
      ),
    ) },
  );

  startMatchDataPlayClock = createEffect(() =>
    { return this.actions$.pipe(
      ofType(matchDataActions.startPlayClock),
      concatLatestFrom(() => this.store.select(selectCurrentMatchDataId)),
      exhaustMap(([action, matchDataId]) =>
        this.matchDataService.startPlayClock(matchDataId!, action.seconds).pipe(
          map((response) =>
            matchDataActions.playClockStartSuccess({ matchData: response }),
          ),
          catchError((error) => of(matchDataActions.playClockStartFailure())),
        ),
      ),
    ) },
  );

  resetMatchDataPlayClock = createEffect(() =>
    { return this.actions$.pipe(
      ofType(matchDataActions.resetPlayClock),
      concatLatestFrom(() => this.store.select(selectCurrentMatchDataId)),
      exhaustMap(([action, matchDataId]) =>
        this.matchDataService.resetPlayClock(matchDataId!).pipe(
          map((response) =>
            matchDataActions.playClockResetSuccess({ matchData: response }),
          ),
          catchError((error) => of(matchDataActions.playClockResetFailure())),
        ),
      ),
    ) },
  );

  constructor(
    private router: Router,
    private actions$: Actions,
    private matchDataService: MatchDataService,
    private store: Store,
  ) {}
}
