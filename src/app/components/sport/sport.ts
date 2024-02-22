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
  sport$: Observable<ISport | null | undefined>;

  constructor(private store: Store<AppState>) {
    this.sport$ = store.select((state) => state.sport.currentSport);
  }

  loadCurrentSport() {
    this.store.dispatch(sportActions.getId());
  }
}
