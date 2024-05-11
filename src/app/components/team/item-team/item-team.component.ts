import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { AsyncPipe, NgOptimizedImage, UpperCasePipe } from '@angular/common';
import { TuiLoaderModule } from '@taiga-ui/core';
import { DeleteDialogComponent } from '../../../shared/ui/dialogs/delete-dialog/delete-dialog.component';
import { Team } from '../team';
import { ImageService } from '../../../services/image.service';
import { urlWithProtocol } from '../../../base/constants';
import { BodyListTitleComponent } from '../../../shared/ui/body/body-title/body-list-title.component';
import { EditButtonComponent } from '../../../shared/ui/buttons/edit-button/edit-button.component';
import { AddEditTeamComponent } from '../add-edit-team/add-edit-team.component';
import { TournamentAddEditFormComponent } from '../../tournament/tournament-add-edit-form/tournament-add-edit-form.component';
import { Sponsor } from '../../adv/sponsor/sponsor';
import { SponsorLine } from '../../adv/sponsor-line/sponsorLine';
import { DeleteButtonComponent } from '../../../shared/ui/buttons/delete-button/delete-button.component';
import { SponsorLineComponent } from '../../../shared/scoreboards/sponsor-line/sponsor-line.component';
import { Person } from '../../person/person';
import { Tournament } from '../../tournament/tournament';
import { Player } from '../../player/player';
import { PlayerInTeamTournament } from '../../player-team-tournament/player-team-tournament';
import { Position } from '../../position/postion';
import { AddEditPlayerToTeamTournamentTableComponent } from '../../player-team-tournament/add-edit-player-to-team-tournament-table/add-edit-player-to-team-tournament-table.component';
import { Sport } from '../../sport/sport';
import { AddEditPlayerToTeamTournamentComponent } from '../../player-team-tournament/add-edit-player-to-team-tournament/add-edit-player-to-team-tournament.component';
import { CreateButtonShowDialogComponent } from '../../../shared/ui/buttons/create-button-show-dialog/create-button-show-dialog.component';

@Component({
  selector: 'app-item-team',
  standalone: true,
  imports: [
    AsyncPipe,
    TuiLoaderModule,
    UpperCasePipe,
    DeleteDialogComponent,
    NgOptimizedImage,
    BodyListTitleComponent,
    EditButtonComponent,
    AddEditTeamComponent,
    TournamentAddEditFormComponent,
    DeleteButtonComponent,
    SponsorLineComponent,
    AddEditPlayerToTeamTournamentTableComponent,
    AddEditPlayerToTeamTournamentComponent,
    CreateButtonShowDialogComponent,
  ],
  templateUrl: './item-team.component.html',
  styleUrl: './item-team.component.less',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Default,
})
export class ItemTeamComponent {
  sport$ = this.sport.currentSport$;
  tournament$ = this.tournament.currentTournament$;
  currentTeam$ = this.team.team$;
  currentTournament$ = this.tournament.currentTournament$;
  currentTeamMainSponsor$ = this.sponsor.currentSponsor$;
  allSportPlayersWithPerson$ = this.player.allSportPlayersWithPerson$;
  allAvailableSportPlayersInTeamTournament$ =
    this.playerInTeamTournament.allAvailableSportPlayersToAddInTeamTournament$;
  allAvailableTournamentPlayersForTeamTournament$ =
    this.playerInTeamTournament.allAvailableTournamentPlayersForTeamTournament$;
  // allAvailablePlayersToAddInTournament$ =
  //   this.playerInTeamTournament.allAvailablePlayersToAddInTournament$;
  allPlayersInTeamTournamentFullData$ =
    this.playerInTeamTournament.allPlayersInTeamTournamentFullData$;
  allSportPositions$ = this.position.allSportPositions$;

  sponsorLine$ = this.sponsorLine.sponsorLineWithFullData$;
  allSponsors$ = this.sponsor.allSponsors$;
  allSponsorLines$ = this.sponsorLine.allSponsorLines$;

  buttonTitle: string = 'Team';

  constructor(
    private sport: Sport,
    private team: Team,
    private person: Person,
    private tournament: Tournament,
    private player: Player,
    private playerInTeamTournament: PlayerInTeamTournament,
    private position: Position,
    private imageService: ImageService,
    private sponsor: Sponsor,
    private sponsorLine: SponsorLine,
  ) {
    team.loadCurrentTeam();
    tournament.loadCurrentTournament();
    playerInTeamTournament.loadAllPlayersInTeamTournament();
    playerInTeamTournament.loadAllPlayersInTournament();
    sponsor.loadAllSponsors();
    sponsorLine.loadAllSponsorLines();
    person.loadAllPersons();
    player.loadAllPlayersBySportId();
    position.loadAllPositionsBySportId();
  }

  onImgError(event: Event) {
    this.imageService.handleError(event);
  }

  onDelete() {
    this.team.deleteTeam();
  }

  protected readonly url = urlWithProtocol;
}
