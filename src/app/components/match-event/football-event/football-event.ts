import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IFootballEvent } from '../../../type/football-event.type';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/appstate';
import {
  selectAllMatchFootballEvents,
  selectCurrentFootballEvent,
  selectFootballEventIsSubmitting,
} from './store/reducers';
import { footballEventActions } from './store/actions';

@Injectable({
  providedIn: 'root',
})
export class FootballEvent {
  footballEvent$: Observable<IFootballEvent | null | undefined>;
  allFootballEvents$: Observable<IFootballEvent[]>;
  footballEventIsSubmitting$: Observable<boolean>;

  constructor(private store: Store<AppState>) {
    this.footballEvent$ = this.store.select(selectCurrentFootballEvent);
    this.footballEventIsSubmitting$ = this.store.select(
      selectFootballEventIsSubmitting,
    );
    this.allFootballEvents$ = this.store.select(selectAllMatchFootballEvents);
  }

  updateFootballEventKeyValue(id: number, data: Partial<IFootballEvent>) {
    this.store.dispatch(
      footballEventActions.updateFootballEventByKeyValue({
        id: id,
        data: data,
      }),
    );
  }
}
