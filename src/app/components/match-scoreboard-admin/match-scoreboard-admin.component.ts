import { Component, OnDestroy, OnInit } from '@angular/core';

import { map, Observable } from 'rxjs';

import { IMatchData } from '../../type/matchdata.type';

import { MatchData } from '../match/matchdata';
import { Match } from '../match/match';
import { AsyncPipe } from '@angular/common';
import { IMatch, IMatchFullDataWithScoreboard } from '../../type/match.type';
import { switchMap } from 'rxjs/operators';
import { Websocket } from '../../store/websocket/websocket';

@Component({
  selector: 'app-match-scoreboard-admin',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './match-scoreboard-admin.component.html',
  styleUrl: './match-scoreboard-admin.component.less',
})
export class MatchScoreboardAdminComponent {
  loading$: Observable<boolean> = this.Websocket.loading$;
  error$: Observable<any> = this.Websocket.error$;
  data$: Observable<IMatchFullDataWithScoreboard> = this.Websocket.data$;

  match$ = this.match.match$;
  matchData$ = this.matchData.matchData$;
  vm$: Observable<{
    match: IMatch | null | undefined;
    matchData: IMatchData | null | undefined;
  }>;

  constructor(
    private Websocket: Websocket,
    private match: Match,
    private matchData: MatchData,
  ) {
    match.loadCurrentMatch();
    Websocket.connect();

    this.vm$ = this.match$.pipe(
      switchMap((match) =>
        this.matchData$.pipe(map((matchData) => ({ match, matchData }))),
      ),
    );
  }

  adjustScore(team: 'a' | 'b', amount: number) {
    return (matchData: IMatchData) => {
      if (!matchData) return;

      const currentScoreKey = team === 'a' ? 'score_team_a' : 'score_team_b';
      let currentScore = matchData[currentScoreKey];
      if (currentScore != null) {
        currentScore = Math.max(0, currentScore + amount);
        const newMatchData = { ...matchData, [currentScoreKey]: currentScore };
        this.matchData.updateMatchData(newMatchData);
      }
    };
  }
}

// ngOnInit() {
//   this.webSocketService.connect(82);
//   this.messagesSubscription = this.webSocketService.message$.subscribe(
//     (message) => {
//       console.log('Received message: ', message);
//       // Handle your message here
//     },
//   );
// }
//
// ngOnDestroy() {
//   this.webSocketService.disconnect();
//
//   // Don't forget to unsubscribe from the observable to avoid memory leaks
//   if (this.messagesSubscription) {
//     this.messagesSubscription.unsubscribe();
//   }
// }
