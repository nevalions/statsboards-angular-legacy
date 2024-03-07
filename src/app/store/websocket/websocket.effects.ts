import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { delay, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

import { WebSocketService } from '../../services/web-socket.service';
import { webSocketActions } from './websocket.actions';
import { selectCurrentMatchId } from '../../components/match/store/reducers';
import { Store } from '@ngrx/store';

@Injectable()
export class WebSocketEffects {
  // Effect to connect to the WebSocket server when the Connect action is dispatched
  connect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(webSocketActions.connect),
      switchMap(() => this.store.select(selectCurrentMatchId)),
      switchMap((matchId) =>
        this.webSocketService.connect(matchId!).pipe(
          map(({ type, data }) => {
            if (type === 'message') {
              let parsedMessage = data ? JSON.parse(data) : null;
              return webSocketActions.connectSuccess({
                message: parsedMessage,
              });
            }
            return { type: '[WebSocket] No Action' };
          }),
          catchError((error) => of(webSocketActions.connectFailure({ error }))),
        ),
      ),
    ),
  );

  receiveMessage$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(webSocketActions.connectSuccess),
        switchMap(() =>
          this.webSocketService.messages().pipe(
            tap((message: any) =>
              console.log('MESSAGE RECEIVED', message.data),
            ),
            map((message) => {
              let parsedMessage =
                message && message.data ? JSON.parse(message.data) : null;
              return webSocketActions.message({
                message: parsedMessage,
              });
            }),
            catchError((error) => of(webSocketActions.error({ error }))),
          ),
        ),
      ),
    { functional: true },
  );

  // Effect to send a message to the WebSocket server when the Send action is dispatched
  sendMessage$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(webSocketActions.send),
        tap((action) => {
          this.webSocketService.sendMessage(action.message);
          return webSocketActions.sendSuccess();
        }),
        catchError((error) => {
          return of(webSocketActions.sendFailure({ error }));
        }),
      ),
    { functional: true },
  );

  reconnect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(webSocketActions.closeFailure, webSocketActions.connectFailure),
      // Utilize a delay or any other logic required for your reconnection strategy
      delay(2000),
      map(() => webSocketActions.reconnect()),
    ),
  );

  // Effect to reconnect to the WebSocket server when the Reconnect action is dispatched
  connectOnReconnect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(webSocketActions.reconnect),
        switchMap(() => this.store.select(selectCurrentMatchId)),
        switchMap((matchId) =>
          this.webSocketService.connect(matchId!).pipe(
            tap((message: any) =>
              console.log('MESSAGE ON RECONNECT', message.data),
            ),
            map((message) =>
              webSocketActions.connectSuccess({
                message: message.data ? JSON.parse(message.data) : null,
              }),
            ),
            catchError((error) =>
              of(webSocketActions.connectFailure({ error })),
            ),
          ),
        ),
      ),
    { functional: true },
  );

  // Effect to disconnect from the WebSocket server when the Disconnect action is dispatched
  disconnect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(webSocketActions.disconnect),
        tap(() => {
          this.webSocketService.disconnect();
          return webSocketActions.disconnectSuccess();
        }),
        catchError((error) => {
          return of(webSocketActions.disconnectFailure({ error }));
        }),
      ),
    { functional: true },
  );

  constructor(
    private actions$: Actions,
    private webSocketService: WebSocketService,
    private store: Store,
  ) {}
}
