import { Component, inject, OnInit } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { getDefaultFullData, IMatchFullData } from '../../../type/match.type';
import { ActivatedRoute, Router } from '@angular/router';
import { MatchService } from '../match.service';
import { tap } from 'rxjs/operators';
import { AsyncPipe, DatePipe } from '@angular/common';
import { TuiButtonModule, TuiLoaderModule } from '@taiga-ui/core';
import { TuiIslandModule } from '@taiga-ui/kit';
import { DeleteDialogComponent } from '../../../shared/ui/dialogs/delete-dialog/delete-dialog.component';
import { MatchFullDataService } from '../matchfulldata.service';
import { DeleteButtonComponent } from '../../../shared/ui/buttons/delete-button/delete-button.component';

@Component({
  selector: 'app-item-match',
  standalone: true,
  imports: [
    AsyncPipe,
    TuiLoaderModule,
    DatePipe,
    TuiIslandModule,
    TuiButtonModule,
    DeleteDialogComponent,
    DeleteButtonComponent,
  ],
  templateUrl: './item-match.component.html',
  styleUrl: './item-match.component.less',
})
export class ItemMatchComponent implements OnInit {
  route = inject(ActivatedRoute);
  router = inject(Router);
  matchService = inject(MatchService);
  matchWithFullDataService = inject(MatchFullDataService);
  matchId: number | undefined;

  match$: Observable<IMatchFullData> = of(getDefaultFullData());

  buttonTitle: string = 'Match';

  constructor() {}

  ngOnInit() {
    this.route.params
      .pipe(
        switchMap((params) => {
          const matchId = Number(params['id']);
          this.matchId = matchId;
          // console.log(matchId);
          return this.matchWithFullDataService.fetchMatchWithDataById(matchId);
        }),
        tap((match: IMatchFullData) => {
          console.log('Match data:', match);
          this.match$ = of(match);
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

  // open: boolean = false;
  //
  // showDialog(): void {
  //   this.open = true;
  // }

  onDelete() {
    if (this.matchId) {
      this.match$.subscribe((match: IMatchFullData) => {
        if (match && match.match && match.match.tournament_id) {
          const tournamentId = match.match.tournament_id;

          // Now that you have the tournamentId, proceed with the deletion
          this.matchService.deleteMatch(match.id).subscribe(() => {
            this.router.navigateByUrl(`/tournaments/id/${tournamentId}`);
            console.log(`Match ID: ${match.id} deleted successfully.`);
          });
        } else {
          console.error('Invalid match object or missing tournament_id.');
        }
      });
    }
  }
}
