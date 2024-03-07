import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { scoreboardDataActions } from './actions';
import { ScoreboardDataService } from '../scoreboard-data.service';
import { IScoreboard } from '../../../type/matchdata.type';
import { matchActions } from '../../match/store/actions';

import { selectCurrentMatchId } from '../../match/store/reducers';

@Injectable()
export class ScoreboardDataEffects {
  updateScoreboardDataEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(scoreboardDataActions.update),
        switchMap(({ id, newScoreboardData }) => {
          return this.scoreboardDataService
            .editScoreboardData(id, newScoreboardData)
            .pipe(
              map((updatedScoreboardData: IScoreboard) => {
                return scoreboardDataActions.updatedSuccessfully({
                  updatedScoreboardData,
                });
              }),
              catchError(() => {
                return of(scoreboardDataActions.updateFailure());
              }),
            );
        }),
      );
    },
    { functional: true },
  );

  getScoreboardDataByIdEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(scoreboardDataActions.get),
        switchMap(({ id }) => {
          return this.scoreboardDataService.findById(id).pipe(
            map((scoreboardData: IScoreboard) => {
              return scoreboardDataActions.getItemSuccess({
                scoreboardData,
              });
            }),
            catchError(() => {
              return of(scoreboardDataActions.getItemFailure());
            }),
          );
        }),
      );
    },
    { functional: true },
  );

  getScoreboardDataByMatchIdMainEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(scoreboardDataActions.getScoreboardDataByMatchId),
        switchMap(() => this.store.select(selectCurrentMatchId)),
        map((matchId) => matchId),
        switchMap((matchId) => {
          return this.scoreboardDataService
            .getScoreboardDataByMatchId(matchId!)
            .pipe(
              map((scoreboardData: IScoreboard) => {
                return scoreboardDataActions.getScoreboardDataByMatchIDSuccess({
                  scoreboardData,
                });
              }),
              catchError(() => {
                return of(
                  scoreboardDataActions.getScoreboardDataByMatchIDFailure(),
                );
              }),
            );
        }),
      );
    },
    { functional: true },
  );

  getScoreboardDataByMatchIdSideEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(matchActions.getMatchIdSuccessfully),
        switchMap((action) =>
          this.scoreboardDataService
            .getScoreboardDataByMatchId(action.matchId)
            .pipe(
              map((scoreboardData: IScoreboard) =>
                scoreboardDataActions.getScoreboardDataByMatchIDSuccess({
                  scoreboardData: scoreboardData,
                }),
              ),
              catchError((error) =>
                of(scoreboardDataActions.getScoreboardDataByMatchIDFailure()),
              ),
            ),
        ),
      );
    },
    { functional: false },
  );

  constructor(
    private router: Router,
    private actions$: Actions,
    private scoreboardDataService: ScoreboardDataService,
    private store: Store,
  ) {}
}
