import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { AppState } from '../../store/appstate';
import { IMatchData } from '../../type/matchdata.type';
import { matchDataActions } from './store/match-data/actions';
import {
  selectCurrentMatchData,
  selectMatchDataIsSubmitting,
  selectMatchDataLoading,
} from './store/match-data/reducers';

@Injectable({
  providedIn: 'root',
})
export class MatchData {
  matchData$: Observable<IMatchData | null | undefined>;
  matchDataIsSubmitting$: Observable<boolean> = of(false);
  matchDataIsLoading$: Observable<boolean> = of(false);

  constructor(private store: Store<AppState>) {
    this.matchData$ = this.store.select(selectCurrentMatchData);
    this.matchDataIsSubmitting$ = this.store.select(
      selectMatchDataIsSubmitting,
    );
    this.matchDataIsLoading$ = this.store.select(selectMatchDataLoading);
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

  updateMatchDataKeyValue(id: number, data: any) {
    console.log(id, data);
    this.store.dispatch(
      matchDataActions.updateMatchDataByKeyValue({
        id: id,
        data: data,
      }),
    );
  }
}
