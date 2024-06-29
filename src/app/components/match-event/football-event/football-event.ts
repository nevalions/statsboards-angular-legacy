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
  allMatchFootballEvents$: Observable<IFootballEvent[]>;
  footballEventIsSubmitting$: Observable<boolean>;

  constructor(private store: Store<AppState>) {
    this.footballEvent$ = this.store.select(selectCurrentFootballEvent);
    this.footballEventIsSubmitting$ = this.store.select(
      selectFootballEventIsSubmitting,
    );
    this.allMatchFootballEvents$ = this.store.select(
      selectAllMatchFootballEvents,
    );
  }

  createFootballEvent(event: IFootballEvent) {
    this.store.dispatch(footballEventActions.create({ request: event }));
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
