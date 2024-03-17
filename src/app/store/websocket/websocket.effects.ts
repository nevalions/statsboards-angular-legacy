import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { delay, filter, from, of, scan, withLatestFrom } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { WebSocketService } from '../../services/web-socket.service';
import { webSocketActions } from './websocket.actions';
import { selectCurrentMatchId } from '../../components/match/store/reducers';
import { Store } from '@ngrx/store';
import {
  selectConnectionState,
  WebSocketStateEnum,
} from './websocket.reducers';

@Injectable()
export class WebSocketEffects {
  connect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(webSocketActions.connect),
      switchMap(() => this.store.select(selectCurrentMatchId)),
      switchMap((matchId) =>
        this.webSocketService.connect(matchId!).pipe(
          scan((accumulatedMessage: {}, parsedMessage) => {
            // console.log('Received data inside effect', parsedMessage);

            if (parsedMessage && parsedMessage.data) {
              accumulatedMessage = {
                ...accumulatedMessage,
                data: parsedMessage.data,
              };
            }

            if (parsedMessage && parsedMessage.playclock) {
              accumulatedMessage = {
                ...accumulatedMessage,
                playclock: parsedMessage.playclock,
              };
            }

            return accumulatedMessage;
          }, {}),
          map((accumulatedMessage) =>
            webSocketActions.connectSuccess({ message: accumulatedMessage }),
          ),
          catchError((error) => of(webSocketActions.connectFailure({ error }))),
        ),
      ),
    ),
  );

  disconnect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(webSocketActions.disconnect),
        map(() => {
          this.webSocketService.disconnect();
          return webSocketActions.disconnectSuccess();
        }),
        catchError((error) =>
          of(webSocketActions.disconnectFailure({ error })),
        ),
      ),
    { dispatch: true },
  );

  receiveMessage$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(webSocketActions.connectSuccess),
        switchMap(() =>
          this.webSocketService.messages().pipe(
            tap((data: any) => console.log('Data received:', data)),
            map(({ type, data }) => {
              console.log('TYPE', type);
              switch (type) {
                case 'playclock-update':
                  // console.log(type);
                  return webSocketActions.playclockMessage({ playclock: data });
                case 'message-update':
                  return webSocketActions.data({ data: data });
                default:
                  return {
                    type: '[WebSocket] Unknown message type',
                    data: data,
                  };
              }
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

  connectIfNeeded$ = createEffect(() =>
    this.actions$.pipe(
      ofType(webSocketActions.connectIfNeeded),
      withLatestFrom(this.store.select(selectConnectionState)),
      filter(
        ([action, connectionState]) =>
          connectionState !== WebSocketStateEnum.CONNECTED,
      ),
      map(() => webSocketActions.connect()),
    ),
  );

  disconnectIfNeeded$ = createEffect(() =>
    this.actions$.pipe(
      ofType(webSocketActions.disconnectIfNeeded),
      withLatestFrom(this.store.select(selectConnectionState)),
      filter(
        ([action, connectionState]) =>
          connectionState !== WebSocketStateEnum.DISCONNECTED,
      ),
      map(() => webSocketActions.disconnect()),
    ),
  );

  constructor(
    private actions$: Actions,
    private webSocketService: WebSocketService,
    private store: Store,
  ) {}
}
