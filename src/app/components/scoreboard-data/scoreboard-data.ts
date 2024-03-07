import { Injectable, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from '../../store/appstate';
import { IMatchData, IScoreboard } from '../../type/matchdata.type';
import {
  selectCurrentScoreboardData,
  selectScoreboardDataIsSubmitting,
} from './store/reducers';
import { scoreboardDataActions } from './store/actions';

@Injectable({
  providedIn: 'root',
})
export class ScoreboardData {
  scoreboardData$: Observable<IScoreboard | null | undefined>;
  scoreboardDataIsSubmitting$: Observable<boolean>;

  constructor(private store: Store<AppState>) {
    this.scoreboardData$ = this.store.select(selectCurrentScoreboardData);
    this.scoreboardDataIsSubmitting$ = this.store.select(
      selectScoreboardDataIsSubmitting,
    );
  }

  loadCurrentScoreboardDataByMatchId() {
    this.store.dispatch(scoreboardDataActions.getScoreboardDataByMatchId());
  }

  updateMatchData(newScoreboardData: IScoreboard) {
    // console.log(matchData, matchData.id);
    this.store.dispatch(
      scoreboardDataActions.update({
        id: newScoreboardData.id!,
        newScoreboardData: newScoreboardData,
      }),
    );
  }
}
