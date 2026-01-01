import { concatLatestFrom } from '@ngrx/operators';import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { filter, mergeMap, of, withLatestFrom } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { WebSocketService } from '../../services/web-socket.service';
import { webSocketActions } from './websocket.actions';
import { selectCurrentMatchId } from '../../components/match/store/reducers';
import { select, Store } from '@ngrx/store';
import { routerNavigatedAction } from '@ngrx/router-store';
import { selectRouterState } from '../../router/router.selector';

@Injectable()
export class WebSocketEffects {
  connectWebSocketOnMatchRoutes$ = createEffect(() =>
    { return this.actions$.pipe(
      ofType(routerNavigatedAction),
      concatLatestFrom(() => this.store.select((selectRouterState))),
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
    ) },
  );

  connect$ = createEffect(() =>
    { return this.actions$.pipe(
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
    ) },
  );

  checkConnection$ = createEffect(() =>
    { return this.actions$.pipe(
      ofType(webSocketActions.checkConnection),
      switchMap(() =>
        this.webSocketService.checkConnection().pipe(
          map((isConnected) =>
            webSocketActions.checkConnectionSuccess({ isConnected }),
          ),
          catchError((error) =>
            of(webSocketActions.checkConnectionFailure({ error })),
          ),
        ),
      ),
    ) },
  );

  reconnectOnCheckConnectionFailure$ = createEffect(() =>
    { return this.actions$.pipe(
      ofType(webSocketActions.checkConnectionSuccess),
      tap(({ isConnected }) =>
        console.log(
          `WebSocket connection status: ${isConnected ? 'Connected' : 'Disconnected'}`,
        ),
      ),
      mergeMap(
        ({ isConnected }) =>
          isConnected
            ? of().pipe(tap(() => console.log('Already connected')))
            : of(webSocketActions.connect()).pipe(
                tap(() => console.log('Reconnecting WebSocket...')),
              ), // Dispatch reconnect action if not connected
      ),
    ) },
  );

  // checkConnection$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(webSocketActions.checkConnection),
  //     switchMap(() =>
  //       this.webSocketService.checkConnection().pipe(
  //         map((isConnected) =>
  //           webSocketActions.checkConnectionSuccess({ isConnected }),
  //         ),
  //         catchError((error) =>
  //           of(webSocketActions.checkConnectionFailure({ error })),
  //         ),
  //       ),
  //     ),
  //   ),
  // );

  receiveMessage$ = createEffect(() =>
    { return this.actions$.pipe(
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
    ) },
  );

  // Effect to send a message to the WebSocket server when the Send action is dispatched
  sendMessage$ = createEffect(
    () =>
      { return this.actions$.pipe(
        ofType(webSocketActions.send),
        tap((action) => {
          this.webSocketService.sendMessage(action.message);
          return webSocketActions.sendSuccess();
        }),
        catchError((error) => {
          return of(webSocketActions.sendFailure({ error }));
        }),
      ) },
    { functional: true },
  );

  constructor(
    private actions$: Actions,
    private webSocketService: WebSocketService,
    private store: Store,
  ) {}
}
