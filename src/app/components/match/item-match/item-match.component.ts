import { Component, inject, OnInit } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { getDefaultFullData, IMatchFullData } from '../../../type/match.type';
import { ActivatedRoute } from '@angular/router';
import { MatchService } from '../../../services/match.service';
import { tap } from 'rxjs/operators';
import { AsyncPipe, DatePipe } from '@angular/common';
import { TuiButtonModule, TuiLoaderModule } from '@taiga-ui/core';
import { TuiIslandModule } from '@taiga-ui/kit';

@Component({
  selector: 'app-item-match',
  standalone: true,
  imports: [
    AsyncPipe,
    TuiLoaderModule,
    DatePipe,
    TuiIslandModule,
    TuiButtonModule,
  ],
  templateUrl: './item-match.component.html',
  styleUrl: './item-match.component.less',
})
export class ItemMatchComponent implements OnInit {
  route = inject(ActivatedRoute);
  matchService = inject(MatchService);
  matchId: number | undefined;

  match$: Observable<IMatchFullData> = of(getDefaultFullData());

  constructor() {}

  ngOnInit() {
    this.route.params
      .pipe(
        switchMap((params) => {
          const matchId = Number(params['id']);
          this.matchId = matchId;
          // console.log(matchId);
          return this.matchService.fetchFullMatchDataWithScoreboardSettingsById(
            matchId,
          );
        }),
        tap((match: IMatchFullData) => {
          this.match$ = of(match);
          console.log('Match data:', match);
        }),
      )
      .subscribe();
  }

  navigateToScoreboardAdmin() {
    if (this.matchId) {
      window.open(
        `http://0.0.0.0:9000/matches/id/${this.matchId}/scoreboard/`,
        '_blank',
      );
    }
  }

  navigateToScoreboardDisplay() {
    if (this.matchId) {
      window.open(
        `http://0.0.0.0:9000/matches/id/${this.matchId}/scoreboard/hd/`,
        '_blank',
      );
    }
  }
}
