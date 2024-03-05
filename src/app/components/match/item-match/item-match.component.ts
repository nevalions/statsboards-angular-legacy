import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { IMatch } from '../../../type/match.type';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MatchService } from '../match.service';
import { AsyncPipe, DatePipe, NgIf } from '@angular/common';
import {
  TuiAppearance,
  TuiButtonModule,
  TuiLoaderModule,
} from '@taiga-ui/core';
import { TuiIslandModule } from '@taiga-ui/kit';
import { DeleteDialogComponent } from '../../../shared/ui/dialogs/delete-dialog/delete-dialog.component';
import { MatchWithFullDataService } from '../../match-with-full-data/matchfulldata.service';
import { DeleteButtonComponent } from '../../../shared/ui/buttons/delete-button/delete-button.component';
import { EditButtonComponent } from '../../../shared/ui/buttons/edit-button/edit-button.component';
import { CreateButtonShowDialogComponent } from '../../../shared/ui/buttons/create-button-show-dialog/create-button-show-dialog.component';
import { AddEditMatchComponent } from '../add-edit-match/add-edit-match.component';
import { TeamTournamentService } from '../../team-tournament/team-tournament.service';
import { Season } from '../../season/season';
import { Sport } from '../../sport/sport';
import { Tournament } from '../../tournament/tournament';
import { Team } from '../../team/team';
import { TeamTournament } from '../../team-tournament/teamTournament';
import { MatchWithFullData } from '../../match-with-full-data/matchWithFullData';
import { Match } from '../match';
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
    NgIf,
  ],
  templateUrl: './item-match.component.html',
  styleUrl: './item-match.component.less',
})
export class ItemMatchComponent {
  allSportTeams$ = this.team.teamsInSport$;
  teamsInTournament$ = this.team.teamsInTournament$;
  tournament$ = this.tournament.currentTournament$;
  match$ = this.matchWithFullData.matchWithFullData$;
  // matchesInTournament$ =
  //   this.matchWithFullData.matchesWithFullDataInTournament$;

  constructor(
    private season: Season,
    private sport: Sport,
    private tournament: Tournament,
    private team: Team,
    private match: Match,
    private matchWithFullData: MatchWithFullData,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    season.loadCurrentSeason();
    sport.loadCurrentSport();
    tournament.loadCurrentTournament();
    team.loadAllTeamsInTournament();
    match.loadCurrentMatch();
    matchWithFullData.loadCurrentMatch();
    // matchWithFullData.loadAllMatchesInTournament();
  }

  // route = inject(ActivatedRoute);
  // router = inject(Router);
  // matchService = inject(MatchService);
  // matchWithFullDataService = inject(MatchWithFullDataService);
  // teamTournamentService = inject(TeamTournamentService);

  // matchId: number | undefined;
  // match$ = this.matchWithFullDataService.matchWithFullData$;
  // teamsInTournament$: Observable<ITeam[]> = of([]);

  buttonTitle: string = 'Match';

  // ngOnInit() {
  //   this.route.params
  //     .pipe(takeUntil(this.ngUnsubscribe))
  //     .subscribe((params: Params) => {
  //       this.matchId = Number(params['id']);
  //       this.matchWithFullDataService.refreshMatchWithFullData(this.matchId);
  //
  //       // Subscribe to dataLoaded which indicates when data has finished loading
  //       this.matchWithFullDataService.dataLoaded
  //         .pipe(
  //           takeUntil(this.ngUnsubscribe),
  //           filter((isLoaded) => isLoaded), // Only allow isLoaded === true to pass by
  //         )
  //         .subscribe((isLoaded) => {
  //           this.match$.pipe(take(1)).subscribe((match) => {
  //             // console.log('Match data:', match); // logging match data
  //
  //             const tournamentId = match.match.tournament_id;
  //             this.teamsInTournament$ =
  //               this.teamTournamentService.fetchTeamsByTournamentId(
  //                 tournamentId,
  //               );
  //           });
  //
  //           this.teamsInTournament$
  //             .pipe(takeUntil(this.ngUnsubscribe))
  //             .subscribe((teams) => {
  //               // console.log('Teams data:', teams); // logging teams data
  //             });
  //         });
  //     });
  // }

  navigateToScoreboardAdmin(match_id: number) {
    if (match_id) {
      window.open(
        `http://0.0.0.0:9000/matches/id/${match_id}/scoreboard/`,
        '_blank',
      );
    }
  }

  navigateToScoreboardDisplay(match_id: number) {
    if (match_id) {
      window.open(
        `http://0.0.0.0:9000/matches/id/${match_id}/scoreboard/hd/`,
        '_blank',
      );
    }
  }

  navigateToWebSocketItem(): void {
    this.router.navigate(['admin'], { relativeTo: this.route });
  }

  onMatchEdit(match: IMatch | null | undefined): void {
    console.log(match);
    if (match && match.id) {
      // console.log(match);
      // this.match.loadCurrentMatch();
      // this.match.updateMatch(match);
      // this.matchService.editMatch(match.id, match).subscribe((match) => {});
    } else {
      console.log('Match data is empty');
    }
  }

  onDelete() {
    this.match.deleteMatch();
  }

  protected readonly TuiAppearance = TuiAppearance;
}
