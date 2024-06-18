import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const webSocketActions = createActionGroup({
  source: 'webSocket',
  events: {
    Connect: emptyProps(),
    ConnectSuccess: props<{ readyState: number }>(),
    ConnectFailure: props<{ error: any }>(),

    Reconnect: emptyProps(),

    Disconnect: emptyProps(),
    DisconnectSuccess: emptyProps(),
    DisconnectFailure: props<{ error: any }>(),

    CheckConnection: emptyProps(),
    CheckConnectionSuccess: props<{ isConnected: boolean }>(),
    CheckConnectionFailure: props<{ error: any }>(),

    Send: props<{ message: any }>(),
    SendSuccess: emptyProps(),
    SendFailure: props<{ error: any }>(),

    Data: props<{ data: any }>(),
    PlayclockMessage: props<{ playclock: any }>(),
    GameclockMessage: props<{ gameclock: any }>(),
    Error: props<{ error: any }>(),

    connected: emptyProps(),
    disconnected: emptyProps(),

    connectIfNeeded: emptyProps(),
    disconnectIfNeeded: emptyProps(),

    Close: props<{ event: any }>(),
    CloseSuccess: emptyProps(),
    CloseFailure: props<{ error: any }>(),
  },
});
