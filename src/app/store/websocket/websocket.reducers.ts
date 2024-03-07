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
  error: any | null;
  event: any | null;
  loading: boolean;
  connectionState: WebSocketStateEnum;
}

const initialState: WebSocketState = {
  data: null,
  error: null,
  event: null,
  loading: false,
  connectionState: WebSocketStateEnum.DISCONNECTED, // Use the enum here
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
    on(webSocketActions.connectSuccess, (state, { message }) => ({
      ...state,
      loading: false,
      error: null,
      data: message,
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
    on(webSocketActions.message, (state, action) => ({
      ...state,
      data: action.message,
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
  selectError,
  selectEvent,
  selectLoading,
} = webSocketFeature;
