import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  IFootballEvent,
  IFootballEventWithPlayers,
} from '../../../type/football-event.type';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/appstate';
import {
  selectAllMatchFootballEvents,
  selectCurrentFootballEvent,
  selectFootballEventIsLoading,
  selectFootballEventIsSubmitting,
} from './store/reducers';
import { footballEventActions } from './store/actions';
import { selectFootballEventsWithPlayers } from './store/selectors';

@Injectable({
  providedIn: 'root',
})
export class FootballEvent {
  footballEvent$: Observable<IFootballEvent | null | undefined>;
  allMatchFootballEvents$: Observable<IFootballEvent[]>;
  allMatchFootballEventsWithPlayers$: Observable<IFootballEventWithPlayers[]>;
  footballEventIsSubmitting$: Observable<boolean>;
  footballEventIsLoading$: Observable<boolean>;

  constructor(private store: Store<AppState>) {
    this.footballEvent$ = this.store.select(selectCurrentFootballEvent);
    this.footballEventIsSubmitting$ = this.store.select(
      selectFootballEventIsSubmitting,
    );
    this.footballEventIsLoading$ = this.store.select(
      selectFootballEventIsLoading,
    );
    this.allMatchFootballEvents$ = this.store.select(
      selectAllMatchFootballEvents,
    );
    this.allMatchFootballEventsWithPlayers$ = this.store.select(
      selectFootballEventsWithPlayers,
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

  deleteEventInMatchById(id: number) {
    this.store.dispatch(footballEventActions.deleteById({ id: id }));
  }
}
