import { Injectable } from '@angular/core';
import { fromEvent, Observable } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WebSocketService {
  private socket: WebSocket | undefined;
  private closing$ = new Subject<void>();

  constructor() {}

  public connect(matchId: number): Observable<any> {
    // Creating the WebSocket connection
    this.socket = new WebSocket(
      `ws://localhost:9000/api/matches/ws/id/${matchId}`,
    );

    // Wrapping each WebSocket event in an Observable
    const messages$ = fromEvent<MessageEvent>(this.socket, 'message').pipe(
      takeUntil(this.closing$),
    );
    const open$ = fromEvent<Event>(this.socket, 'open').pipe(
      takeUntil(this.closing$),
    );
    const close$ = fromEvent<CloseEvent>(this.socket, 'close').pipe(
      takeUntil(this.closing$),
    );
    const error$ = fromEvent<ErrorEvent>(this.socket, 'error').pipe(
      takeUntil(this.closing$),
    );

    // Mapping each WebSocket event to a JS object
    return new Observable((subscriber) => {
      open$.subscribe(() => subscriber.next({ type: 'open' }));
      messages$
        .pipe(map((event) => ({ type: 'message', data: event.data })))
        .subscribe(subscriber);
      close$
        .pipe(map((event) => ({ type: 'close', code: event.code })))
        .subscribe(subscriber);
      error$
        .pipe(map((event) => ({ type: 'error', error: event.error })))
        .subscribe(subscriber);
    });
  }

  public messages(): Observable<any> {
    if (!this.socket) {
      throw new Error('Connection not established');
    }
    return fromEvent<MessageEvent>(this.socket, 'message').pipe(
      takeUntil(this.closing$),
      map((event) => ({ type: 'message', data: event.data })),
    );
  }

  public sendMessage(message: any): void {
    if (this.socket) {
      this.socket.send(JSON.stringify(message));
    }
  }

  public disconnect(): void {
    this.closing$.next();
    if (this.socket) {
      this.socket.close();
    }
  }
}

// import { Injectable } from '@angular/core';
// import { Subject } from 'rxjs';
//
// @Injectable({ providedIn: 'root' })
// export class WebSocketService {
//   private socket: WebSocket | undefined;
//
//   // Observable source
//   private messageSource = new Subject<any>();
//   // Observable stream
//   public message$ = this.messageSource.asObservable();
//
//   constructor() {}
//
//   public matchFullDataWithScoreboardConnect(matchId: number): void {
//     this.socket = new WebSocket(
//       `ws://localhost:9000/api/matches/ws/id/${matchId}`,
//     );
//     this.socket.onopen = (event) => {
//       console.log('WebSocket opened:', event);
//     };
//     this.socket.onmessage = (event) => {
//       console.log('WebSocket message:', event.data);
//       // Next message to the observable stream
//       this.messageSource.next(event.data);
//     };
//     this.socket.onerror = (error) => {
//       console.error('WebSocket error:', error);
//     };
//     this.socket.onclose = (event) => {
//       console.log('WebSocket closed:', event);
//     };
//   }
//
//   public sendMessage(message: any): void {
//     if (this.socket) {
//       this.socket.send(JSON.stringify(message));
//     }
//   }
//
//   public disconnect(): void {
//     this.socket!.close();
//     this.messageSource.complete(); // Stop emitting after WebSocket is closed
//   }
// }
