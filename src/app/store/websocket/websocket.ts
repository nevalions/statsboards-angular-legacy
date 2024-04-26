import { map, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../appstate';
import {
  selectConnectionState,
  selectData,
  selectError,
  selectGameclock,
  selectLoading,
  selectPlayclock,
} from './websocket.reducers';
import { webSocketActions } from './websocket.actions';

@Injectable({
  providedIn: 'root',
})
export class Websocket {
  // loading$: Observable<any>;
  data$: Observable<any>;
  playclock$: Observable<any>;
  gameclock$: Observable<any>;

  // error$: Observable<any>;

  constructor(private store: Store<AppState>) {
    // this.loading$ = this.store.select(selectLoading);
    this.data$ = this.store.select((state) => state.webSocket.data);
    this.playclock$ = this.store.select((state) => state.webSocket.playclock);
    this.gameclock$ = this.store.select((state) => state.webSocket.gameclock);
    // this.data$ = this.store.select(selectData);
    // this.playclock$ = this.store.select(selectPlayclock);
    // this.gameclock$ = this.store.select(selectGameclock);
    // this.error$ = this.store.select(selectError);
  }

  connect() {
    this.store.dispatch(webSocketActions.connect());
  }

  // connectMatchByUrl() {
  //   this.store.dispatch();
  // }

  isConnected() {
    this.store
      .select(selectConnectionState)
      .pipe(map((state) => state === 'CONNECTED'));
  }

  // message(){
  //   this.store.dispatch(webSocketActions.());
  // }

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
