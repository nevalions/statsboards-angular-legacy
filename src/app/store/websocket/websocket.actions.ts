import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const webSocketActions = createActionGroup({
  source: 'webSocket',
  events: {
    Connect: emptyProps(),
    ConnectSuccess: props<{ message: any }>(),
    ConnectFailure: props<{ error: any }>(),

    Reconnect: emptyProps(),

    Disconnect: emptyProps(),
    DisconnectSuccess: emptyProps(),
    DisconnectFailure: props<{ error: any }>(),

    Send: props<{ message: any }>(),
    SendSuccess: emptyProps(),
    SendFailure: props<{ error: any }>(),

    Message: props<{ message: any }>(),
    Error: props<{ error: any }>(),

    Close: props<{ event: any }>(),
    CloseSuccess: emptyProps(),
    CloseFailure: props<{ error: any }>(),
  },
});
