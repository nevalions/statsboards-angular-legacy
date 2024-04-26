import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { delay, filter, from, mergeMap, of, scan, withLatestFrom } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { WebSocketService } from '../../services/web-socket.service';
import { webSocketActions } from './websocket.actions';
import { selectCurrentMatchId } from '../../components/match/store/reducers';
import { select, Store } from '@ngrx/store';
import {
  selectConnectionState,
  WebSocketStateEnum,
} from './websocket.reducers';
import { routerNavigatedAction } from '@ngrx/router-store';
import { selectRouterState } from '../../router/router.selector';

@Injectable()
export class WebSocketEffects {
  connectWebSocketOnMatchRoutes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(routerNavigatedAction),
      withLatestFrom(this.store.pipe(select(selectRouterState))),
      filter(([_, routerState]) => {
        // Use a regular expression to check for the URL pattern /match/{matchId}/admin or /match/{matchId}/hd
        const matchPattern = /\/match\/(\d+)\/(admin|hd)/;
        return matchPattern.test(routerState.url);
      }),
      map(([_, routerState]) => {
        // Extract the matchId using the same regular expression
        const match = routerState.url.match(/\/match\/(\d+)\/(admin|hd)/);
        return match ? Number(match[1]) : undefined; // match[1] contains the matchId
      }),
      filter((matchId) => matchId !== undefined),
      tap(() => this.webSocketService.disconnect()), // Ensure to clean up any previous WebSocket connections
      switchMap((matchId) => {
        // Now we can be sure that matchId is a number and not undefined
        return this.webSocketService.connect(matchId!).pipe(
          mergeMap((readyState) =>
            readyState === WebSocket.OPEN
              ? of(webSocketActions.connectSuccess({ readyState }))
              : of(
                  webSocketActions.connectFailure({
                    error: { message: 'WebSocket connection failed' },
                  }),
                ),
          ),
          catchError((error) => of(webSocketActions.connectFailure({ error }))),
        );
      }),
    ),
  );

  connect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(webSocketActions.connect),
      switchMap(() => this.store.select(selectCurrentMatchId)),
      switchMap((matchId) =>
        this.webSocketService.connect(matchId!).pipe(
          mergeMap((readyState) =>
            readyState === WebSocket.OPEN
              ? of(webSocketActions.connectSuccess({ readyState }))
              : of(
                  webSocketActions.connectFailure({
                    error: { message: 'WebSocket connection failed' },
                  }),
                ),
          ),
          catchError((error) => of(webSocketActions.connectFailure({ error }))),
        ),
      ),
    ),
  );

  receiveMessage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(webSocketActions.connectSuccess),
      switchMap(() =>
        this.webSocketService.messages().pipe(
          map(({ type, data }) => {
            // console.log('Data received:', data);
            switch (type) {
              case 'playclock-update':
                console.log('PLAY');
                return webSocketActions.playclockMessage({ playclock: data });
              case 'gameclock-update':
                console.log('GAME');
                return webSocketActions.gameclockMessage({ gameclock: data });
              case 'message-update':
                console.log('DATA');
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
  );
  //
  // connect$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(webSocketActions.connect),
  //     switchMap(() => this.store.select(selectCurrentMatchId)),
  //     switchMap((matchId) =>
  //       this.webSocketService.connect(matchId!).pipe(
  //         scan((accumulatedMessage: {}, parsedMessage) => {
  //           // console.log('Received data inside effect', parsedMessage);
  //
  //           if (parsedMessage && parsedMessage.data) {
  //             accumulatedMessage = {
  //               ...accumulatedMessage,
  //               data: parsedMessage.data,
  //             };
  //           }
  //
  //           if (parsedMessage && parsedMessage.playclock) {
  //             accumulatedMessage = {
  //               ...accumulatedMessage,
  //               playclock: parsedMessage.playclock,
  //             };
  //           }
  //
  //           if (parsedMessage && parsedMessage.gameclock) {
  //             accumulatedMessage = {
  //               ...accumulatedMessage,
  //               gameclock: parsedMessage.gameclock,
  //             };
  //           }
  //
  //           return accumulatedMessage;
  //         }, {}),
  //         map((accumulatedMessage) =>
  //           webSocketActions.connectSuccess({ message: accumulatedMessage }),
  //         ),
  //         catchError((error) => of(webSocketActions.connectFailure({ error }))),
  //       ),
  //     ),
  //   ),
  // );
  //
  // disconnect$ = createEffect(
  //   () =>
  //     this.actions$.pipe(
  //       ofType(webSocketActions.disconnect),
  //       map(() => {
  //         this.webSocketService.disconnect();
  //         return webSocketActions.disconnectSuccess();
  //       }),
  //       catchError((error) =>
  //         of(webSocketActions.disconnectFailure({ error })),
  //       ),
  //     ),
  //   { dispatch: true },
  // );
  //
  // receiveMessage$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(webSocketActions.connectSuccess),
  //     switchMap(() =>
  //       this.webSocketService.messages().pipe(
  //         tap((data: any) => console.log('Data received:', data)),
  //         map(({ type, data }) => {
  //           console.log('TYPE', type);
  //           switch (type) {
  //             case 'playclock-update':
  //               return webSocketActions.playclockMessage({ playclock: data });
  //             case 'gameclock-update':
  //               return webSocketActions.gameclockMessage({ gameclock: data });
  //             case 'message-update':
  //               return webSocketActions.data({ data: data });
  //             default:
  //               // Optional: handle unknown message types
  //               return {
  //                 type: '[WebSocket] Unknown message type',
  //                 data: data,
  //               };
  //           }
  //         }),
  //         catchError((error) => of(webSocketActions.error({ error }))),
  //       ),
  //     ),
  //   ),
  // );

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

  // reconnect$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(webSocketActions.closeFailure, webSocketActions.connectFailure),
  //     // Utilize a delay or any other logic required for your reconnection strategy
  //     delay(2000),
  //     map(() => webSocketActions.reconnect()),
  //   ),
  // );
  //
  // // Effect to reconnect to the WebSocket server when the Reconnect action is dispatched
  // connectOnReconnect$ = createEffect(
  //   () =>
  //     this.actions$.pipe(
  //       ofType(webSocketActions.reconnect),
  //       switchMap(() => this.store.select(selectCurrentMatchId)),
  //       switchMap((matchId) =>
  //         this.webSocketService.connect(matchId!).pipe(
  //           tap((message: any) =>
  //             console.log('MESSAGE ON RECONNECT', message.data),
  //           ),
  //           map((message) =>
  //             webSocketActions.connectSuccess({
  //               message: message.data ? JSON.parse(message.data) : null,
  //             }),
  //           ),
  //           catchError((error) =>
  //             of(webSocketActions.connectFailure({ error })),
  //           ),
  //         ),
  //       ),
  //     ),
  //   { functional: true },
  // );
  //
  // connectIfNeeded$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(webSocketActions.connectIfNeeded),
  //     withLatestFrom(this.store.select(selectConnectionState)),
  //     filter(
  //       ([action, connectionState]) =>
  //         connectionState !== WebSocketStateEnum.CONNECTED,
  //     ),
  //     map(() => webSocketActions.connect()),
  //   ),
  // );
  //
  // disconnectIfNeeded$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(webSocketActions.disconnectIfNeeded),
  //     withLatestFrom(this.store.select(selectConnectionState)),
  //     filter(
  //       ([action, connectionState]) =>
  //         connectionState !== WebSocketStateEnum.DISCONNECTED,
  //     ),
  //     map(() => webSocketActions.disconnect()),
  //   ),
  // );

  constructor(
    private actions$: Actions,
    private webSocketService: WebSocketService,
    private store: Store,
  ) {}
}
