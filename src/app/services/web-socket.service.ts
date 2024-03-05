import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class WebSocketService {
  private socket: WebSocket | undefined;

  constructor() {}

  public connect(matchId: number): void {
    this.socket = new WebSocket(
      `ws://localhost:9000/api/matches/ws/id/${matchId}`,
    );
    this.socket.onopen = (event) => {
      console.log('WebSocket opened:', event);
    };
    this.socket.onmessage = (event) => {
      console.log('WebSocket message:', event.data);
    };
    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
    this.socket.onclose = (event) => {
      console.log('WebSocket closed:', event);
    };
  }

  public disconnect(): void {
    this.socket!.close();
  }
}
