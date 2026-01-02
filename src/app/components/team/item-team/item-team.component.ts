import { ChangeDetectionStrategy, Component, ViewEncapsulation, inject } from '@angular/core';
import {
  AsyncPipe,
  UpperCasePipe,
  DecimalPipe,
  TitleCasePipe,
} from '@angular/common';
import { TuiLoader } from '@taiga-ui/core';
import { Team } from '../team';
import { ImageService } from '../../../services/image.service';
import { urlWithProtocol } from '../../../base/constants';
import { Sponsor } from '../../adv/sponsor/sponsor';
import { SponsorLine } from '../../adv/sponsor-line/sponsorLine';
import { SponsorLineComponent } from '../../../shared/scoreboards/sponsor-line/sponsor-line.component';
import { Person } from '../../person/person';
import { Tournament } from '../../tournament/tournament';
import { Player } from '../../player/player';
import { PlayerInTeamTournament } from '../../player-team-tournament/player-team-tournament';
import { Position } from '../../position/postion';
import { Sport } from '../../sport/sport';
import { DeleteDialogComponent } from '../../../shared/ui/dialogs/delete-dialog/delete-dialog.component';
import { EditButtonComponent } from '../../../shared/ui/buttons/edit-button/edit-button.component';
import { BodyListTitleComponent } from '../../../shared/ui/body/body-title/body-list-title.component';
import { DeleteButtonComponent } from '../../../shared/ui/buttons/delete-button/delete-button.component';
import { AddEditTeamComponent } from '../add-edit-team/add-edit-team.component';
import { ParseButtonComponent } from '../../../shared/ui/buttons/parse-button/parse-button.component';
import { AddEditPlayerToTeamTournamentTableComponent } from '../../player-team-tournament/add-edit-player-to-team-tournament-table/add-edit-player-to-team-tournament-table.component';

import { AgeStats } from '../../../type/person.type';
import { calculateAgeStats } from '../../../base/helpers';
import { TuiAppearance } from '@taiga-ui/core';

@Component({
  selector: 'app-item-team',
  standalone: true,
  imports: [
    AsyncPipe,
    TuiLoader,
    UpperCasePipe,
    DecimalPipe,
    TitleCasePipe,
    DeleteDialogComponent,
    BodyListTitleComponent,
    EditButtonComponent,
    DeleteButtonComponent,
    SponsorLineComponent,
    AddEditTeamComponent,
    ParseButtonComponent,
    AddEditPlayerToTeamTournamentTableComponent,
  ],
  templateUrl: './item-team.component.html',
  styleUrl: './item-team.component.less',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Default,
})
export class ItemTeamComponent {
  private sport = inject(Sport);
  private team = inject(Team);
  private person = inject(Person);
  private tournament = inject(Tournament);
  private player = inject(Player);
  private playerInTeamTournament = inject(PlayerInTeamTournament);
  private position = inject(Position);
  private imageService = inject(ImageService);
  private sponsor = inject(Sponsor);
  private sponsorLine = inject(SponsorLine);

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

  constructor() {
    const team = this.team;
    const person = this.person;
    const tournament = this.tournament;
    const player = this.player;
    const playerInTeamTournament = this.playerInTeamTournament;
    const position = this.position;
    const sponsor = this.sponsor;
    const sponsorLine = this.sponsorLine;

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
