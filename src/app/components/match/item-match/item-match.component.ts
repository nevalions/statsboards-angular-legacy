import { Component } from '@angular/core';
import { IMatch } from '../../../type/match.type';
import { ActivatedRoute, Router } from '@angular/router';
import { AsyncPipe, DatePipe, NgIf, TitleCasePipe } from '@angular/common';
import {
  TuiAppearance,
  TuiButtonModule,
  TuiLoaderModule,
} from '@taiga-ui/core';
import { TuiIslandModule } from '@taiga-ui/kit';
import { DeleteDialogComponent } from '../../../shared/ui/dialogs/delete-dialog/delete-dialog.component';
import { DeleteButtonComponent } from '../../../shared/ui/buttons/delete-button/delete-button.component';
import { EditButtonComponent } from '../../../shared/ui/buttons/edit-button/edit-button.component';
import { CreateButtonShowDialogComponent } from '../../../shared/ui/buttons/create-button-show-dialog/create-button-show-dialog.component';
import { AddEditMatchComponent } from '../add-edit-match/add-edit-match.component';
import { Season } from '../../season/season';
import { Sport } from '../../sport/sport';
import { Tournament } from '../../tournament/tournament';
import { Team } from '../../team/team';
import { MatchWithFullData } from '../../match-with-full-data/matchWithFullData';
import { Match } from '../match';
import { environment } from '../../../../environments/environment';
import { Person } from '../../person/person';
import { PlayerInTeamTournament } from '../../player-team-tournament/player-team-tournament';
import { PlayerInMatch } from '../../player-match/player-match';
import { Position } from '../../position/postion';
import { BodyListTitleComponent } from '../../../shared/ui/body/body-title/body-list-title.component';
import { AddEditPlayerMatchTableComponent } from '../../player-match/add-edit-player-match-table/add-edit-player-match-table.component';
import { AddEditPlayerToTeamTournamentTableComponent } from '../../player-team-tournament/add-edit-player-to-team-tournament-table/add-edit-player-to-team-tournament-table.component';

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
    TitleCasePipe,
    BodyListTitleComponent,
    AddEditPlayerMatchTableComponent,
    AddEditPlayerToTeamTournamentTableComponent,
  ],
  templateUrl: './item-match.component.html',
  styleUrl: './item-match.component.less',
})
export class ItemMatchComponent {
  sport$ = this.sport.currentSport$;
  allSportTeams$ = this.team.teamsInSport$;
  teamsInTournament$ = this.team.teamsInTournament$;
  tournament$ = this.tournament.currentTournament$;
  allPlayersInMatch$ = this.playerInMatch.allPlayersInMatch$;

  allSportPositions$ = this.position.allSportPositions$;
  match$ = this.matchWithFullData.matchWithFullData$;

  constructor(
    private season: Season,
    private sport: Sport,
    private tournament: Tournament,
    private team: Team,
    private person: Person,
    private playerInTeamTournament: PlayerInTeamTournament,
    private playerInMatch: PlayerInMatch,
    private position: Position,
    private match: Match,
    private matchWithFullData: MatchWithFullData,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    playerInMatch.loadAllPlayersInMatch();
    team.loadAllTeamsInTournament();
  }

  buttonTitle: string = 'Match';

  navigateToWebSocketItem(): void {
    this.router.navigate(['admin'], { relativeTo: this.route });
  }

  navigateToWebSocketScoreboardDisplay(match_id: number) {
    // this.router.navigate(['hd'], { relativeTo: this.route });
    if (match_id) {
      window.open(
        `http://${environment.url}${environment.angular_port}/scoreboard/match/${match_id}/hd/`,
        '_blank',
      );
    }
  }

  onMatchEdit(match: IMatch | null | undefined): void {
    // console.log(match);
    if (match && match.id) {
      // console.log(match);
    } else {
      // console.log('Match data is empty');
    }
  }

  onDelete() {
    this.match.deleteMatch();
  }

  protected readonly TuiAppearance = TuiAppearance;
}
