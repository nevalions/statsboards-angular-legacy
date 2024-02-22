import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ISeason } from '../../type/season.type';
import { AppState } from '../../store/appstate';
import { seasonActions } from './store/actions';

@Injectable({
  providedIn: 'root',
})
export class Season {
  season$: Observable<ISeason | null | undefined>;

  constructor(private store: Store<AppState>) {
    this.season$ = store.select((state) => state.season.currentSeason);
  }

  loadCurrentSeason() {
    this.store.dispatch(seasonActions.getId());
  }
}
