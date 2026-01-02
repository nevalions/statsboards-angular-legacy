import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { AppState } from '../../store/appstate';

import {
  selectCurrentPlayclock,
  selectPlayclockIsSubmitting,
  selectPlayclockLoading,
} from './store/reducers';
import { playclockActions } from './store/actions';
import { IPlayclock } from '../../type/playclock.type';

@Injectable({
  providedIn: 'root',
})
export class Playclock {
  private store = inject<Store<AppState>>(Store);

  playclock$: Observable<IPlayclock | null | undefined>;
  playclockIsSubmitting$: Observable<boolean> = of(false);
  playclockIsLoading$: Observable<boolean> = of(false);

  constructor() {
    this.playclock$ = this.store.select(selectCurrentPlayclock);
    this.playclockIsSubmitting$ = this.store.select(
      selectPlayclockIsSubmitting,
    );
    this.playclockIsLoading$ = this.store.select(selectPlayclockLoading);
  }

  loadCurrentPlayclockByMatchId() {
    this.store.dispatch(playclockActions.getPlayClockByMatchId());
  }

  updatePlayclock(playclock: IPlayclock) {
    // console.log(playclock, playclock.id);
    this.store.dispatch(
      playclockActions.update({ id: playclock.id!, newPlayclock: playclock }),
    );
  }

  startGameClock() {
    this.store.dispatch(playclockActions.startGameClock());
  }

  pauseGameClock() {
    this.store.dispatch(playclockActions.pauseGameClock());
  }

  resetGameClock(seconds: number) {
    this.store.dispatch(playclockActions.resetGameClock({ seconds: seconds }));
  }

  startPlayClock(seconds: number) {
    this.store.dispatch(playclockActions.startPlayClock({ seconds: seconds }));
  }

  resetPlayClock() {
    this.store.dispatch(playclockActions.resetPlayClock());
  }
}

// loadCurrentMatchByMatchId(matchId: number) {
//   this.store.dispatch(
//     playclockActions.getPlayclockByMatchId({ matchId: matchId }),
//   );
// }
