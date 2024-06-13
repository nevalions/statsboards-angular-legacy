import { createFeature, createReducer, on } from '@ngrx/store';
import { webSocketActions } from './websocket.actions';

export enum WebSocketStateEnum {
  CONNECTED = 'CONNECTED',
  DISCONNECTED = 'DISCONNECTED',
  CONNECTING = 'CONNECTING',
  DISCONNECTING = 'DISCONNECTING',
}

export interface WebSocketState {
  data: any | null;
  playclock: any | null;
  gameclock: any | null;
  error: any | null;
  event: any | null;
  loading: boolean;
  connectionState: WebSocketStateEnum;
}

const initialState: WebSocketState = {
  data: null,
  playclock: null,
  gameclock: null,
  error: null,
  event: null,
  loading: false,
  connectionState: WebSocketStateEnum.DISCONNECTED,
};

const webSocketFeature = createFeature({
  name: 'webSocket',
  reducer: createReducer(
    initialState,
    on(webSocketActions.connect, (state) => ({
      ...state,
      loading: true,
      error: null,
      connectionState: WebSocketStateEnum.CONNECTING,
    })),
    on(webSocketActions.connectSuccess, (state, { readyState }) => ({
      ...state,
      loading: false,
      error: null,
      connectionState: WebSocketStateEnum.CONNECTED,
    })),
    on(webSocketActions.connectFailure, (state, { error }) => ({
      ...state,
      loading: false,
      connectionState: WebSocketStateEnum.DISCONNECTED,
      error,
    })),
    on(webSocketActions.disconnect, (state) => ({
      ...state,
      loading: true,
      error: null,
    })),
    on(webSocketActions.disconnectSuccess, (state) => ({
      ...state,
      loading: false,
      connectionState: WebSocketStateEnum.DISCONNECTED,
      error: null,
    })),
    on(webSocketActions.disconnectFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error,
    })),
    on(webSocketActions.send, (state) => ({
      ...state,
      loading: true,
      error: null,
    })),
    on(webSocketActions.sendSuccess, (state) => ({
      ...state,
      loading: false,
      error: null,
    })),
    on(webSocketActions.sendFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error,
    })),
    on(webSocketActions.gameclockMessage, (state, action) => ({
      ...state,
      gameclock: action.gameclock,
      error: null,
    })),
    on(webSocketActions.playclockMessage, (state, action) => ({
      ...state,
      playclock: action.playclock,
      error: null,
    })),
    on(webSocketActions.data, (state, action) => ({
      ...state,
      data: action.data.data,
      error: null,
    })),
    on(webSocketActions.error, (state, action) => ({
      ...state,
      data: null,
      error: action.error,
    })),
    on(webSocketActions.close, (state) => ({
      ...state,
      loading: true,
      error: null,
    })),
    on(webSocketActions.closeSuccess, (state) => ({
      ...state,
      loading: false,
      connectionState: WebSocketStateEnum.DISCONNECTED,
      error: null,
    })),
    on(webSocketActions.closeFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error,
    })),
  ),
});

export const {
  name: webSocketFeatureKey,
  reducer: webSocketReducer,
  selectConnectionState,
  selectData,
  selectGameclock,
  selectPlayclock,
  selectError,
  selectEvent,
  selectLoading,
} = webSocketFeature;
