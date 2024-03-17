import { Injectable } from '@angular/core';
import { catchError, fromEvent, merge, Observable, throwError } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WebSocketService {
  private socket: WebSocket | undefined;
  private closing$ = new Subject<void>();
  private retryAttempt = 0;
  private maxRetryAttempts = 10;
  private retryTime = 2000; // time between retries (in milliseconds)

  private clientId: string;

  constructor() {
    // Generate a new UUID everytime the service is created (page refreshed)
    this.clientId = this.generateUUID();
  }

  private getClientId(): string {
    let clientId = localStorage.getItem('clientId');

    if (!clientId) {
      clientId = this.generateUUID();
      localStorage.setItem('clientId', clientId);
    }

    return clientId;
  }

  private generateUUID(): string {
    // UUID v4 generator (RFC4122 compliant)
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0,
          v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      },
    );
  }

  public regenerateClientId(): void {
    this.clientId = this.generateUUID();
    localStorage.setItem('clientId', this.clientId);
  }

  public connect(matchId: number): Observable<any> {
    console.log('Attempting to connect');
    this.socket = new WebSocket(
      `ws://localhost:9000/api/matches/ws/id/${matchId}/${this.clientId}/`,
    );

    console.log('WebSocket readyState after creation:', this.socket.readyState);

    return fromEvent<MessageEvent>(this.socket, 'message').pipe(
      map((event: MessageEvent) => {
        console.log('Connection message event', event);
        const data = JSON.parse(event.data);
        console.log('Connection WebSocket data:', data);
        return data;
      }),
    );
  }

  public messages(): Observable<any> {
    if (!this.socket) {
      console.log('Connection not established');
      throw new Error('Connection not established');
    }
    return fromEvent<MessageEvent>(this.socket, 'message').pipe(
      takeUntil(this.closing$),
      map((event: MessageEvent) => {
        console.log('Listen message event:', event);
        const data = JSON.parse(event.data);
        console.log('Listen message websocket', data);

        // Check if the message contains playclock data
        if ('playclock' in data) {
          return { type: 'playclock-update', data: data.playclock };
        } else {
          return { type: 'message-update', data: data };
        }
      }),
    );
  }

  public sendMessage(message: any): void {
    if (this.socket) {
      console.log('Sending message:', message);
      this.socket.send(JSON.stringify(message));
    }
  }

  public isConnected(): boolean {
    return this.socket?.readyState === 1 || false;
  }

  private reconnect(matchId: number): void {
    if (
      this.socket &&
      this.retryAttempt < this.maxRetryAttempts &&
      this.socket.readyState !== WebSocket.CLOSED
    ) {
      setTimeout(() => {
        console.log('Attempting to reconnect');
        this.retryAttempt++;
        this.connect(matchId);
      }, this.retryTime);
    }
  }

  public disconnect(): void {
    console.log('Disconnecting');
    this.closing$.next();

    if (this.socket) {
      // Log the readyState of the WebSocket before closing
      console.log(
        'WebSocket readyState before closing:',
        this.socket.readyState,
      );

      this.socket.close();

      // Log the readyState of the WebSocket immediately after closing
      console.log(
        'WebSocket readyState after closing:',
        this.socket.readyState,
      );
    }
  }
}
