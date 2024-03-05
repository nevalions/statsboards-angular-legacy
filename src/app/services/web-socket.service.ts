import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WebSocketService {
  private socket: WebSocket | undefined;

  // Observable source
  private messageSource = new Subject<any>();
  // Observable stream
  public message$ = this.messageSource.asObservable();

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
      // Next message to the observable stream
      this.messageSource.next(event.data);
    };
    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
    this.socket.onclose = (event) => {
      console.log('WebSocket closed:', event);
    };
  }

  public sendMessage(message: any): void {
    if (this.socket) {
      this.socket.send(JSON.stringify(message));
    }
  }

  public disconnect(): void {
    this.socket!.close();
    this.messageSource.complete(); // Stop emitting after WebSocket is closed
  }
}
