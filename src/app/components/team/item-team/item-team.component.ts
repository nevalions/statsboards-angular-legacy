import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import {
  AsyncPipe,
  DecimalPipe,
  NgOptimizedImage,
  TitleCasePipe,
  UpperCasePipe,
} from '@angular/common';
import { TuiAppearance, TuiLoader, TuiButton } from '@taiga-ui/core';
import { Team } from '../team';
import { ImageService } from '../../../services/image.service';
import { urlWithProtocol } from '../../../base/constants';
import { Sponsor } from '../../adv/sponsor/sponsor';
import { SponsorLine } from '../../adv/sponsor-line/sponsorLine';
import { Person } from '../../person/person';
import { Tournament } from '../../tournament/tournament';
import { Player } from '../../player/player';
import { PlayerInTeamTournament } from '../../player-team-tournament/player-team-tournament';
import { Position } from '../../position/postion';
import { Sport } from '../../sport/sport';
import { DeleteDialogComponent } from '../../../shared/ui/dialogs/delete-dialog/delete-dialog.component';
import { EditButtonComponent } from '../../../shared/ui/buttons/edit-button/edit-button.component';
import { BodyListTitleComponent } from '../../../shared/ui/body/body-title/body-list-title.component';
import { AddEditTeamComponent } from '../add-edit-team/add-edit-team.component';
import { TournamentAddEditFormComponent } from '../../tournament/tournament-add-edit-form/tournament-add-edit-form.component';
import { DeleteButtonComponent } from '../../../shared/ui/buttons/delete-button/delete-button.component';
import { AddEditPlayerToTeamTournamentTableComponent } from '../../player-team-tournament/add-edit-player-to-team-tournament-table/add-edit-player-to-team-tournament-table.component';
import { AddEditPlayerToTeamTournamentComponent } from '../../player-team-tournament/add-edit-player-to-team-tournament/add-edit-player-to-team-tournament.component';
import { CreateButtonShowDialogComponent } from '../../../shared/ui/buttons/create-button-show-dialog/create-button-show-dialog.component';
import { ParseButtonComponent } from '../../../shared/ui/buttons/parse-button/parse-button.component';
import { AgeStats } from '../../../type/person.type';
import { SponsorLineComponent } from '../../../shared/scoreboards/sponsor-line/sponsor-line.component';
import { calculateAgeStats } from '../../../base/helpers';

@Component({
  selector: 'app-item-team',
  standalone: true,
  imports: [
    AsyncPipe,
    TuiLoader,
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
    TuiButton,
    ParseButtonComponent,
    DecimalPipe,
    TitleCasePipe,
  ],
  templateUrl: './item-team.component.html',
  styleUrl: './item-team.component.less',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Default,
})
export class ItemTeamComponent {
  sport$ = this.sport.currentSport$;
  currentTeam$ = this.team.team$;
  currentTournament$ = this.tournament.currentTournament$;
  currentTeamMainSponsor$ = this.sponsor.currentSponsor$;
  allSportPlayersWithPerson$ = this.player.allSportPlayersWithPerson$;
  allAvailableTournamentPlayersForTeamTournament$ =
    this.playerInTeamTournament.allAvailableTournamentPlayersForTeamTournament$;
  allPlayersInTeamTournamentFullData$ =
    this.playerInTeamTournament.allPlayersInTeamTournamentFullData$;
  allSportPositions$ = this.position.allSportPositions$;

  sponsorLine$ = this.sponsorLine.sponsorLineWithFullData$;
  allSponsors$ = this.sponsor.allSponsors$;
  allSponsorLines$ = this.sponsorLine.allSponsorLines$;

  playerInTeamTournamentIsLoading$ =
    this.playerInTeamTournament.playerInTeamTournamentIsLoading$;

  buttonTitle: string = 'Team';

  ageStats: AgeStats | null = null;

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

  parsPlayerFromEESL() {
    this.playerInTeamTournament.parsPlayersFromEESL();
  }

  protected readonly url = urlWithProtocol;
  protected readonly TuiAppearance = TuiAppearance;
  protected readonly calculateAgeStats = calculateAgeStats;
}
