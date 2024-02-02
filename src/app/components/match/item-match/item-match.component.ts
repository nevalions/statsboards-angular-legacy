import { Component, inject, OnInit } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { IMatchFullData } from '../../../type/match.type';
import { ActivatedRoute } from '@angular/router';
import { MatchService } from '../../../services/match.service';
import { tap } from 'rxjs/operators';
import { AsyncPipe, DatePipe } from '@angular/common';
import { TuiLoaderModule } from '@taiga-ui/core';

@Component({
  selector: 'app-item-match',
  standalone: true,
  imports: [AsyncPipe, TuiLoaderModule, DatePipe],
  templateUrl: './item-match.component.html',
  styleUrl: './item-match.component.less',
})
export class ItemMatchComponent implements OnInit {
  route = inject(ActivatedRoute);
  matchService = inject(MatchService);

  match$: Observable<IMatchFullData> = of({} as IMatchFullData);

  constructor() {}

  ngOnInit() {
    this.route.params
      .pipe(
        switchMap((params) => {
          const matchId = Number(params['id']);
          // console.log(matchId);
          return this.matchService.fetchFullMatchDataById(matchId);
        }),
        tap((match: IMatchFullData) => {
          this.match$ = of(match);
          console.log('Match data:', match);
        }),
      )
      .subscribe();
  }
}
