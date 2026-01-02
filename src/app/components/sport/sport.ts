import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from '../../store/appstate';
import { ISport } from '../../type/sport.type';
import { sportActions } from './store/actions';
import { selectAllSports, selectCurrentSport } from './store/reducers';

@Injectable({
  providedIn: 'root',
})
export class Sport {
  private store = inject<Store<AppState>>(Store);

  currentSport$: Observable<ISport | null | undefined>;
  allSports$: Observable<ISport[]>;

  constructor() {
    this.currentSport$ = this.store.select(selectCurrentSport);
    this.allSports$ = this.store.select(selectAllSports);
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
