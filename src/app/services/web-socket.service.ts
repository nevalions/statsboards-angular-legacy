import { Injectable } from '@angular/core';
import { fromEvent, Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class WebSocketService {
  private socket: WebSocket | undefined;
  private closing$ = new Subject<void>();
  private retryAttempt = 0;
  private maxRetryAttempts = 10;
  private retryTime = 2000; // time between retries (in milliseconds)
  private readonly clientId: string;

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

  // public regenerateClientId(): void {
  //   this.clientId = this.generateUUID();
  //   localStorage.setItem('clientId', this.clientId);
  // }

  public connect(matchId: number): Observable<number> {
    return new Observable<number>((observer) => {
      // If a WebSocket is already open, use it.
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        console.log('WebSocket is already OPEN');
        observer.next(this.socket.readyState);
        observer.complete();
      } else {
        // Otherwise, create a new WebSocket.
        console.log('Attempting to connect');
        this.socket = new WebSocket(
          // `wss://`,
          `${environment.wsProtocol}://${environment.apiUrl}/api/matches/ws/id/${matchId}/${this.clientId}/`,
        );

        // When the WebSocket opens, emit its readyState.
        this.socket.onopen = () => {
          console.log('WebSocket opened:', this.socket!.readyState);
          observer.next(this.socket!.readyState);
          observer.complete();
        };

        // If the WebSocket encounters an error, emit an error.
        this.socket.onerror = (error) => {
          console.error('WebSocket error:', error);
          observer.error(error);
        };
      }
    });
  }

  public messages(): Observable<any> {
    if (!this.socket) {
      console.log('Connection not established');
      throw new Error('Connection not established');
    }
    console.log('WebSocket messages method called');
    return fromEvent<MessageEvent>(this.socket, 'message').pipe(
      takeUntil(this.closing$),
      map((event: MessageEvent) => {
        // console.log('Listen message event:', event);
        const data = JSON.parse(event.data);
        console.log('Listen message websocket', data);

        // Check if the message contains playclock data
        if ('playclock' in data) {
          return { type: 'playclock-update', data: data.playclock };
        } else if ('gameclock' in data) {
          return { type: 'gameclock-update', data: data.gameclock };
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
      console.log(
        'WebSocket readyState before closing:',
        this.socket.readyState,
      );
      this.socket.close();

      console.log(
        'WebSocket readyState after closing:',
        this.socket.readyState,
      );
    }
  }
}
