import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from '../../store/appstate';
import { ISport } from '../../type/sport.type';
import { sportActions } from './store/actions';

@Injectable({
  providedIn: 'root',
})
export class Sport {
  private store = inject<Store<AppState>>(Store);

  currentSport$: Observable<ISport | null | undefined>;
  allSports$: Observable<ISport[]>;

  constructor() {
    const store = this.store;

    this.currentSport$ = store.select((state) => state.sport.currentSport);
    this.allSports$ = store.select((state) => state.sport.allSports);
  }

  loadCurrentSport() {
    this.store.dispatch(sportActions.getId());
  }

  loadSportByMatch() {
    this.store.dispatch(sportActions.getSportByMatch());
  }

  loadAllSports() {
    this.store.dispatch(sportActions.getAll());
  }
}
