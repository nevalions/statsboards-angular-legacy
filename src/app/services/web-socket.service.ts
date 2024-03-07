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

    // Log the readyState of the WebSocket immediately after creation
    console.log('WebSocket readyState after creation:', this.socket.readyState);

    return fromEvent<MessageEvent>(this.socket, 'message').pipe(
      map((event) => ({ type: 'message', data: event.data })),
    );
  }

  public messages(): Observable<any> {
    if (!this.socket) {
      console.log('Connection not established');
      throw new Error('Connection not established');
    }
    return fromEvent<MessageEvent>(this.socket, 'message').pipe(
      takeUntil(this.closing$),
      map((event) => {
        console.log('Message event:', event);
        return { type: 'message', data: event.data };
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

// public connect(matchId: number): Observable<any> {
//   console.log('Attempting to connect');
//
//   // Creating the WebSocket connection, since we have a clientId available,
//   // we include it to the connection URL
//   this.socket = new WebSocket(
//     `ws://localhost:9000/api/matches/ws/id/${matchId}/${this.clientId}/`,
//   );
//
//   // Wrapping each WebSocket event in an Observable
//   const messages$ = fromEvent<MessageEvent>(this.socket, 'message').pipe(
//     takeUntil(this.closing$),
//   );
//   const open$ = fromEvent<Event>(this.socket, 'open').pipe(
//     takeUntil(this.closing$),
//   );
//   const close$ = fromEvent<CloseEvent>(this.socket, 'close').pipe(
//     takeUntil(this.closing$),
//   );
//   const error$ = fromEvent<ErrorEvent>(this.socket, 'error').pipe(
//     takeUntil(this.closing$),
//   );
//
//   // Mapping each WebSocket event to a JS object
//   return new Observable((subscriber) => {
//     open$.subscribe(() => {
//       console.log('Connection opened');
//       subscriber.next({ type: 'open' });
//     });
//     messages$
//       .pipe(map((event) => ({ type: 'message', data: event.data })))
//       .subscribe((msg) => {
//         console.log('Message received', msg);
//         subscriber.next(msg);
//       });
//     close$
//       .pipe(map((event) => ({ type: 'close', code: event.code })))
//       .subscribe((msg) => {
//         console.log('Connection closed', msg);
//         subscriber.next(msg);
//       });
//     error$
//       .pipe(map((event) => ({ type: 'error', error: event.error })))
//       .subscribe((err) => {
//         console.log('Error occurred', err);
//         subscriber.next(err);
//       });
//   });
// }
