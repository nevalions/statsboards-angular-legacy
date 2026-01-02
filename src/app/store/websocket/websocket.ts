import { Observable } from 'rxjs';
import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../appstate';
import { WebSocketStateEnum } from './websocket.reducers';
import { webSocketActions } from './websocket.actions';

@Injectable({
  providedIn: 'root',
})
export class Websocket {
  private store = inject<Store<AppState>>(Store);

  // loading$: Observable<any>;
  data$: Observable<any>;
  playclock$: Observable<any>;
  gameclock$: Observable<any>;
  websocketState$: Observable<WebSocketStateEnum>;

  // error$: Observable<any>;

  constructor() {
    this.data$ = this.store.select((state) => state.webSocket.data);
    this.playclock$ = this.store.select((state) => state.webSocket.playclock);
    this.gameclock$ = this.store.select((state) => state.webSocket.gameclock);
    this.websocketState$ = this.store.select(
      (state) => state.webSocket.connectionState,
    );
  }

  connect() {
    this.store.dispatch(webSocketActions.connect());
  }

  checkConnection() {
    this.store.dispatch(webSocketActions.checkConnection());
  }

  // connectMatchByUrl() {
  //   this.store.dispatch();
  // }

  // isConnected() {
  //   this.store
  //     .select(selectConnectionState)
  //     .pipe(map((state) => state === 'CONNECTED'));
  // }

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
