import { Injectable, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from '../../store/appstate';
import { IMatch } from '../../type/match.type';
import { matchActions } from './store/actions';
import { selectCurrentMatchWithTeams } from './store/selectors';
import { IMatchData } from '../../type/matchdata.type';
import { matchDataActions } from './store/match-data/actions';
import {
  selectCurrentMatchData,
  selectMatchDataIsSubmitting,
} from './store/match-data/reducers';

@Injectable({
  providedIn: 'root',
})
export class MatchData {
  matchData$: Observable<IMatchData | null | undefined>;
  matchDataIsSubmitting$: Observable<boolean>;

  constructor(private store: Store<AppState>) {
    this.matchData$ = this.store.select(selectCurrentMatchData);
    this.matchDataIsSubmitting$ = this.store.select(
      selectMatchDataIsSubmitting,
    );
  }

  loadCurrentMatchDataByMatchId() {
    this.store.dispatch(matchDataActions.getMatchDataByMatchId());
  }

  updateMatchData(matchData: IMatchData) {
    // console.log(matchData, matchData.id);
    this.store.dispatch(
      matchDataActions.update({ id: matchData.id!, newMatchData: matchData }),
    );
  }

  startGameClock() {
    this.store.dispatch(matchDataActions.startGameClock());
  }

  pauseGameClock() {
    this.store.dispatch(matchDataActions.pauseGameClock());
  }

  resetGameClock(seconds: number) {
    this.store.dispatch(matchDataActions.resetGameClock({ seconds: seconds }));
  }

  startPlayClock(seconds: number) {
    this.store.dispatch(matchDataActions.startPlayClock({ seconds: seconds }));
  }

  resetPlayClock() {
    this.store.dispatch(matchDataActions.resetPlayClock());
  }
}

// loadCurrentMatchByMatchId(matchId: number) {
//   this.store.dispatch(
//     matchDataActions.getMatchDataByMatchId({ matchId: matchId }),
//   );
// }
