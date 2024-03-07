import { map, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../appstate';
import {
  selectConnectionState,
  selectData,
  selectError,
  selectLoading,
} from './websocket.reducers';
import { webSocketActions } from './websocket.actions';
import { IMatchFullDataWithScoreboard } from '../../type/match.type';

@Injectable({
  providedIn: 'root',
})
export class Websocket {
  loading$: Observable<any>;
  data$: Observable<any>;
  error$: Observable<any>;

  constructor(private store: Store<AppState>) {
    this.loading$ = this.store.select(selectLoading);
    this.data$ = this.store.select(selectData);
    this.error$ = this.store.select(selectError);
  }

  isConnected() {
    this.store
      .select(selectConnectionState)
      .pipe(map((state) => state === 'CONNECTED'));
  }

  connect() {
    this.store.dispatch(webSocketActions.connectIfNeeded());
  }

  disconnect() {
    this.store.dispatch(webSocketActions.disconnectIfNeeded());
  }

  send(data: any) {
    this.store.dispatch(webSocketActions.send({ message: data }));
  }

  close(event: any) {
    this.store.dispatch(webSocketActions.close({ event: event }));
  }
}
