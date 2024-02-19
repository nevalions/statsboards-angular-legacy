import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  filter,
  Observable,
  of,
  Subject,
  switchMap,
  take,
  takeUntil,
} from 'rxjs';
import {
  getDefaultFullData,
  IMatch,
  IMatchFullData,
} from '../../../type/match.type';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MatchService } from '../match.service';
import { tap } from 'rxjs/operators';
import { AsyncPipe, DatePipe } from '@angular/common';
import {
  TuiAppearance,
  TuiButtonModule,
  TuiLoaderModule,
} from '@taiga-ui/core';
import { TuiIslandModule } from '@taiga-ui/kit';
import { DeleteDialogComponent } from '../../../shared/ui/dialogs/delete-dialog/delete-dialog.component';
import { MatchFullDataService } from '../matchfulldata.service';
import { DeleteButtonComponent } from '../../../shared/ui/buttons/delete-button/delete-button.component';
import { EditButtonComponent } from '../../../shared/ui/buttons/edit-button/edit-button.component';
import { CreateButtonShowDialogComponent } from '../../../shared/ui/buttons/create-button-show-dialog/create-button-show-dialog.component';
import { AddEditMatchComponent } from '../add-edit-match/add-edit-match.component';
import { TeamTournamentService } from '../../team-tournament/team-tournament.service';
import { ITeam } from '../../../type/team.type';

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
    EditButtonComponent,
    CreateButtonShowDialogComponent,
    AddEditMatchComponent,
  ],
  templateUrl: './item-match.component.html',
  styleUrl: './item-match.component.less',
})
export class ItemMatchComponent implements OnInit, OnDestroy {
  private readonly ngUnsubscribe = new Subject<void>();

  route = inject(ActivatedRoute);
  router = inject(Router);
  matchService = inject(MatchService);
  matchWithFullDataService = inject(MatchFullDataService);
  teamTournamentService = inject(TeamTournamentService);

  matchId: number | undefined;
  match$ = this.matchWithFullDataService.matchWithFullData$;
  teamsInTournament$: Observable<ITeam[]> = of([]);

  buttonTitle: string = 'Match';

  constructor() {}

  ngOnInit() {
    this.route.params
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((params: Params) => {
        this.matchId = Number(params['id']);
        this.matchWithFullDataService.refreshMatchWithFullData(this.matchId);

        // Subscribe to dataLoaded which indicates when data has finished loading
        this.matchWithFullDataService.dataLoaded
          .pipe(
            takeUntil(this.ngUnsubscribe),
            filter((isLoaded) => isLoaded), // Only allow isLoaded === true to pass by
          )
          .subscribe((isLoaded) => {
            this.match$.pipe(take(1)).subscribe((match) => {
              // console.log('Match data:', match); // logging match data

              const tournamentId = match.match.tournament_id;
              this.teamsInTournament$ =
                this.teamTournamentService.fetchTeamsByTournamentId(
                  tournamentId,
                );
            });

            this.teamsInTournament$
              .pipe(takeUntil(this.ngUnsubscribe))
              .subscribe((teams) => {
                // console.log('Teams data:', teams); // logging teams data
              });
          });
      });
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

  onMatchEdit(match: IMatch | null | undefined): void {
    console.log(match);
    if (match && match.id) {
      console.log(match);
      this.matchService.editMatch(match.id, match).subscribe((match) => {});
    } else {
      console.log('Match data is empty');
    }
  }

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

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  protected readonly TuiAppearance = TuiAppearance;
}
