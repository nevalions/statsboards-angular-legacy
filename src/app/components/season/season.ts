import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ISeason } from '../../type/season.type';
import { AppState } from '../../store/appstate';
import { seasonActions } from './store/actions';

@Injectable({
  providedIn: 'root',
})
export class Season {
  private store = inject<Store<AppState>>(Store);

  season$: Observable<ISeason | null | undefined>;

  constructor() {
    const store = this.store;

    this.season$ = store.select((state) => state.season.currentSeason);
  }

  loadCurrentSeason() {
    this.store.dispatch(seasonActions.getId());
  }
}
