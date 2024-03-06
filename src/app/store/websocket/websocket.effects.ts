import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

import { WebSocketService } from '../../services/web-socket.service';
import { webSocketActions } from './websocket.actions';
import { selectCurrentMatchId } from '../../components/match/store/reducers';
import { Store } from '@ngrx/store';

@Injectable()
export class WebSocketEffects {
  // Effect to connect to the WebSocket server when the Connect action is dispatched
  connect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(webSocketActions.connect),
        switchMap(() => this.store.select(selectCurrentMatchId)),
        map((matchId) => matchId),
        switchMap((matchId) =>
          this.webSocketService.connect(matchId!).pipe(
            tap((message: any) => console.log('MESSAGE ON LOAD', message.data)),
            map((message) => {
              let parsedMessage =
                message && message.data ? JSON.parse(message.data) : null;
              return webSocketActions.connectSuccess({
                message: parsedMessage,
              });
            }),
            catchError((error) =>
              of(webSocketActions.connectFailure({ error })),
            ),
          ),
        ),
      ),
    { functional: true },
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
              return webSocketActions.connectSuccess({
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
