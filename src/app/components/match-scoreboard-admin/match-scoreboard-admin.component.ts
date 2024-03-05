import { Component, OnDestroy, OnInit } from '@angular/core';
import { WebSocketService } from '../../services/web-socket.service';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { DefaultMatchData, IMatchData } from '../../type/matchdata.type';
import { MatchDataService } from '../match/matchData.service';

@Component({
  selector: 'app-match-scoreboard-admin',
  standalone: true,
  imports: [],
  templateUrl: './match-scoreboard-admin.component.html',
  styleUrl: './match-scoreboard-admin.component.less',
})
export class MatchScoreboardAdminComponent implements OnInit, OnDestroy {
  private messagesSubscription: Subscription | undefined;
  matchData: IMatchData = DefaultMatchData(82);

  constructor(
    private webSocketService: WebSocketService,
    private http: HttpClient,
    private matchDataService: MatchDataService,
  ) {}

  ngOnInit() {
    this.webSocketService.connect(82);
    this.messagesSubscription = this.webSocketService.message$.subscribe(
      (message) => {
        console.log('Received message: ', message);
        // Handle your message here
      },
    );
  }

  ngOnDestroy() {
    this.webSocketService.disconnect();

    // Don't forget to unsubscribe from the observable to avoid memory leaks
    if (this.messagesSubscription) {
      this.messagesSubscription.unsubscribe();
    }
  }

  sendMessageToServer() {
    // Here, we're just sending a simple string, but you could send any JSON-serializable object.
    this.webSocketService.sendMessage('Hello from client!');
  }

  sendMessageTwoToServer() {
    // Here, we're just sending a simple string, but you could send any JSON-serializable object.
    this.webSocketService.sendMessage('Hello from client Two!');
  }

  increaseScoreTeamA() {
    this.matchData.score_team_a! += 1;
    this.matchDataService
      .editMatch(this.matchData.id!, this.matchData)
      .subscribe(
        (data) => {
          // After successful update, clone the object to trigger change detection
          this.matchData = { ...data };
          console.log('Data successfully updated', data);
        },
        (error) => {
          console.error('There was an error during the update', error);
        },
      );
  }
}
