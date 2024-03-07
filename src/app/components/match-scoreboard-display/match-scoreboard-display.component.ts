import { AfterViewChecked, Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { IMatchFullDataWithScoreboard } from '../../type/match.type';
import { Match } from '../match/match';
import { Websocket } from '../../store/websocket/websocket';
import { AsyncPipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-match-scoreboard-display',
  standalone: true,
  imports: [AsyncPipe, NgIf],
  templateUrl: './match-scoreboard-display.component.html',
  styleUrl: './match-scoreboard-display.component.less',
})
export class MatchScoreboardDisplayComponent
  implements OnInit, OnDestroy, AfterViewChecked
{
  loading$: Observable<boolean> = this.Websocket.loading$;
  error$: Observable<any> = this.Websocket.error$;
  data$: Observable<IMatchFullDataWithScoreboard> = this.Websocket.data$;

  fontSizeA!: string;
  fontSizeB!: string;

  constructor(
    private Websocket: Websocket,
    private match: Match,
  ) {
    match.loadCurrentMatch();
  }

  ngOnInit() {
    this.Websocket.connect();
  }

  ngOnDestroy() {
    this.Websocket.disconnect();
  }

  ngAfterViewChecked(): void {
    this.adjustFontSize();
  }

  adjustFontSize() {
    setTimeout(() => {
      // These selectors should point to your team names
      const teamNameAElement = <HTMLElement>(
        document.querySelector('.team_a-name span')
      );
      const teamNameBElement = <HTMLElement>(
        document.querySelector('.team_b-name span')
      );

      if (teamNameAElement && teamNameBElement) {
        const maxWidthA = teamNameAElement.parentElement!.offsetWidth;
        const maxWidthB = teamNameBElement.parentElement!.offsetWidth;

        this.fontSizeA = Math.min(20, maxWidthA / 14) + 'px';
        this.fontSizeB = Math.min(20, maxWidthB / 14) + 'px';
      }
    });
  }

  getMinutes(seconds: number): string {
    if (seconds === undefined) {
      return '--';
    } else {
      return Math.floor(seconds / 60)
        .toString()
        .padStart(2, '0');
    }
  }

  getSeconds(seconds: number): string {
    if (seconds === undefined) {
      return '--';
    } else {
      return (seconds % 60).toString().padStart(2, '0');
    }
  }

  getPlayClockSeconds(seconds: number): string {
    if (seconds === undefined) {
      return '';
    } else {
      return (seconds % 60).toString().padStart(1, '0');
    }
  }
}
