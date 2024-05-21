import { AsyncPipe, DatePipe, NgIf, TitleCasePipe } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  TuiAppearance,
  TuiButtonModule,
  TuiLoaderModule,
} from '@taiga-ui/core';
import { TuiIslandModule } from '@taiga-ui/kit';
import { environment } from '../../../../environments/environment';
import { BodyListTitleComponent } from '../../../shared/ui/body/body-title/body-list-title.component';
import { CreateButtonShowDialogComponent } from '../../../shared/ui/buttons/create-button-show-dialog/create-button-show-dialog.component';
import { DeleteButtonComponent } from '../../../shared/ui/buttons/delete-button/delete-button.component';
import { EditButtonComponent } from '../../../shared/ui/buttons/edit-button/edit-button.component';
import { DeleteDialogComponent } from '../../../shared/ui/dialogs/delete-dialog/delete-dialog.component';
import { IMatch } from '../../../type/match.type';
import { MatchWithFullData } from '../../match-with-full-data/matchWithFullData';
import { Person } from '../../person/person';
import { AddEditPlayerMatchTableComponent } from '../../player-match/add-edit-player-match-table/add-edit-player-match-table.component';
import { PlayerInMatch } from '../../player-match/player-match';
import { AddEditPlayerToTeamTournamentTableComponent } from '../../player-team-tournament/add-edit-player-to-team-tournament-table/add-edit-player-to-team-tournament-table.component';
import { PlayerInTeamTournament } from '../../player-team-tournament/player-team-tournament';
import { Player } from '../../player/player';
import { Position } from '../../position/postion';
import { Season } from '../../season/season';
import { Sport } from '../../sport/sport';
import { Team } from '../../team/team';
import { Tournament } from '../../tournament/tournament';
import { AddEditMatchComponent } from '../add-edit-match/add-edit-match.component';
import { Match } from '../match';

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
  match$ = this.matchWithFullData.matchWithFullData$;
  tournament$ = this.tournament.currentTournament$;
  teamsInTournament$ = this.team.teamsInTournament$;
  allPlayersInMatch$ = this.playerInMatch.allPlayersFullDataInMatch$;
  // allHomePlayersInTeam$ =
  // this.playerInTeamTournament.allHomePlayersInTeamTournamentWithPerson$;
  availableMatchHomePlayers$ =
    this.playerInTeamTournament.availableMatchHomePlayers$;
  availableMatchAwayPlayers$ =
    this.playerInTeamTournament.availableMatchAwayPlayers$;
  // allAwayPlayersInTeam$ =
  //   this.playerInTeamTournament.allAwayPlayersInTeamTournamentWithPerson$;
  homeRoster$ = this.playerInMatch.homeRoster$;
  awayRoster$ = this.playerInMatch.awayRoster$;

  allSportPositions$ = this.position.allSportPositions$;

  constructor(
    private season: Season,
    private sport: Sport,
    private tournament: Tournament,
    private team: Team,
    private person: Person,
    private player: Player,
    private playerInTeamTournament: PlayerInTeamTournament,
    private playerInMatch: PlayerInMatch,
    private position: Position,
    private match: Match,
    private matchWithFullData: MatchWithFullData,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    match.loadCurrentMatch();
    tournament.loadCurrentTournament();
    playerInTeamTournament.loadAllPlayersForMatch();
    position.loadAllPositionsBySportId();
    playerInMatch.loadAllPlayersFullDataInMatch();
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
