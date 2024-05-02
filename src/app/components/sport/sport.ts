import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { sportActions } from './store/actions';
import { Observable } from 'rxjs';
import { ISport } from '../../type/sport.type';
import { AppState } from '../../store/appstate';

@Injectable({
  providedIn: 'root',
})
export class Sport {
  currentSport$: Observable<ISport | null | undefined>;
  allSports$: Observable<ISport[]>;

  constructor(private store: Store<AppState>) {
    this.currentSport$ = store.select((state) => state.sport.currentSport);
    this.allSports$ = store.select((state) => state.sport.allSports);
  }

  loadCurrentSport() {
    this.store.dispatch(sportActions.getId());
  }

  loadAllSports() {
    this.store.dispatch(sportActions.getAll());
  }
}
