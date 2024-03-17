import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { AppState } from '../../store/appstate';

import {
  selectCurrentGameclock,
  selectGameclockIsSubmitting,
  selectGameclockLoading,
} from './store/reducers';
import { IGameclock } from '../../type/gameclock.type';
import { gameclockActions } from './store/actions';

@Injectable({
  providedIn: 'root',
})
export class Gameclock {
  gameclock$: Observable<IGameclock | null | undefined>;
  gameclockIsSubmitting$: Observable<boolean> = of(false);
  gameclockIsLoading$: Observable<boolean> = of(false);

  constructor(private store: Store<AppState>) {
    this.gameclock$ = this.store.select(selectCurrentGameclock);
    this.gameclockIsSubmitting$ = this.store.select(
      selectGameclockIsSubmitting,
    );
    this.gameclockIsLoading$ = this.store.select(selectGameclockLoading);
  }

  loadCurrentGameclockByMatchId() {
    this.store.dispatch(gameclockActions.getGameClockByMatchId());
  }

  updateGameclock(gameclock: IGameclock) {
    console.log(gameclock, gameclock.id);
    this.store.dispatch(
      gameclockActions.update({ id: gameclock.id!, newGameclock: gameclock }),
    );
  }

  startGameClock() {
    this.store.dispatch(gameclockActions.startGameClock());
  }

  pauseGameClock() {
    this.store.dispatch(gameclockActions.pauseGameClock());
  }

  resetGameClock(seconds: number) {
    this.store.dispatch(gameclockActions.resetGameClock({ seconds: seconds }));
  }
}
