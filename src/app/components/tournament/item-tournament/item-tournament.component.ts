import {
  AsyncPipe,
  DecimalPipe,
  TitleCasePipe,
  UpperCasePipe,
} from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TuiValueChangesModule } from '@taiga-ui/cdk';
import {
  TuiAppearance,
  TuiLoaderModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import {
  TuiInputNumberModule,
  tuiInputNumberOptionsProvider,
} from '@taiga-ui/kit';
import { urlWithProtocol } from '../../../base/constants';
import { SponsorLineComponent } from '../../../shared/scoreboards/sponsor-line/sponsor-line.component';
import { BodyListTitleComponent } from '../../../shared/ui/body/body-title/body-list-title.component';
import { CreateButtonShowDialogComponent } from '../../../shared/ui/buttons/create-button-show-dialog/create-button-show-dialog.component';
import { DeleteButtonComponent } from '../../../shared/ui/buttons/delete-button/delete-button.component';
import { EditButtonComponent } from '../../../shared/ui/buttons/edit-button/edit-button.component';
import { DeleteDialogComponent } from '../../../shared/ui/dialogs/delete-dialog/delete-dialog.component';
import { ListOfMatchesComponent } from '../../../shared/ui/list/list-of-matches/list-of-matches.component';
import { BasePaginationComponent } from '../../../shared/ui/pagination/base-pagination/base-pagination.component';
import { BaseSearchFormComponent } from '../../../shared/ui/search/base-search-form/base-search-form.component';
import { Pagination } from '../../../store/pagination/pagination';
import { Search } from '../../../store/search/search';
import { SponsorLine } from '../../adv/sponsor-line/sponsorLine';
import { Sponsor } from '../../adv/sponsor/sponsor';
import { MatchWithFullData } from '../../match-with-full-data/matchWithFullData';
import { AddEditMatchComponent } from '../../match/add-edit-match/add-edit-match.component';
import { Person } from '../../person/person';
import { AddEditPlayerToTeamTournamentTableComponent } from '../../player-team-tournament/add-edit-player-to-team-tournament-table/add-edit-player-to-team-tournament-table.component';
import { PlayerInTeamTournament } from '../../player-team-tournament/player-team-tournament';
import { Player } from '../../player/player';
import { Position } from '../../position/postion';
import { Season } from '../../season/season';
import { Sport } from '../../sport/sport';
import { TeamTournament } from '../../team-tournament/teamTournament';
import { AddEditTeamToTournamentTableComponent } from '../../team/add-edit-team-to-tournament-table/add-edit-team-to-tournament-table.component';
import { Team } from '../../team/team';
import { Tournament } from '../tournament';
import { TournamentAddEditFormComponent } from '../tournament-add-edit-form/tournament-add-edit-form.component';
import { calculateAgeStats } from '../../../base/helpers';
import { Match } from '../../match/match';
import { ParseButtonComponent } from '../../../shared/ui/buttons/parse-button/parse-button.component';

@Component({
  selector: 'app-item-tournament',
  standalone: true,
  imports: [
    AsyncPipe,
    UpperCasePipe,
    SponsorLineComponent,
    TuiLoaderModule,
    EditButtonComponent,
    TournamentAddEditFormComponent,
    DeleteButtonComponent,
    DeleteDialogComponent,
    BodyListTitleComponent,
    ReactiveFormsModule,
    TuiInputNumberModule,
    BaseSearchFormComponent,
    BasePaginationComponent,
    ListOfMatchesComponent,
    CreateButtonShowDialogComponent,
    AddEditMatchComponent,
    AddEditTeamToTournamentTableComponent,
    AddEditPlayerToTeamTournamentTableComponent,
    TuiTextfieldControllerModule,
    TuiValueChangesModule,
    DecimalPipe,
    TitleCasePipe,
    ParseButtonComponent,
  ],
  templateUrl: './item-tournament.component.html',
  styleUrl: './item-tournament.component.less',
  providers: [
    tuiInputNumberOptionsProvider({
      decimal: 'never',
      step: 1,
    }),
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Default,
})
export class ItemTournamentComponent {
  sport$ = this.sport.currentSport$;

  teamsInTournament$ = this.team.teamsInTournament$;
  availableTeamsToAddToTournament$ = this.team.availableTeamsToAddToTournament$;
  tournament$ = this.tournament.currentTournament$;

  currentTournamentMainSponsor$ = this.tournament.currentTournamentMainSponsor$;
  sponsorLine$ = this.sponsorLine.sponsorLineWithFullData$;
  allSponsors$ = this.sponsor.allSponsors$;
  allSponsorLines$ = this.sponsorLine.allSponsorLines$;
  matchesInTournament$ =
    this.matchWithFullData.matchesWithFullDataInTournament$;

  parsMatchIsLoading$ = this.match.matchIsLoading$;

  allSportPlayersWithPerson$ = this.player.allSportPlayersWithPerson$;
  allAvailablePlayersToAddInTournament$ =
    this.playerInTeamTournament.allAvailablePlayersToAddInTournament$;
  allSportPositions$ = this.position.allSportPositions$;

  allPlayersInTournament$ =
    this.playerInTeamTournament.allPlayerInTournamentFullData$;
  currentPlayersInTournamentPage$ =
    this.pagination.currentPagePlayersInTeamTable$;
  currentPage$ = this.pagination.currentPage$;

  paginatedMatchCombinedSearchResults$ =
    this.pagination.paginatedMatchCombinedSearchResults$;
  totalMatchCombinedSearchPages$ =
    this.pagination.totalMatchCombinedSearchPages$;
  paginatedTablePlayerInTeamTournament$ =
    this.pagination.paginatedTablePlayerInTeamTournament$;
  totalPlayersInTeamTournament$ = this.pagination.totalPlayersInTeamTournament$;

  constructor(
    private season: Season,
    private sport: Sport,
    private tournament: Tournament,
    private team: Team,
    private teamTournament: TeamTournament,
    private match: Match,
    private matchWithFullData: MatchWithFullData,
    private sponsor: Sponsor,
    private sponsorLine: SponsorLine,
    private position: Position,
    private person: Person,
    private playerInTeamTournament: PlayerInTeamTournament,
    private player: Player,
    private search: Search,
    private pagination: Pagination,
  ) {
    sponsor.loadAllSponsors();
    sponsorLine.loadAllSponsorLines();
    team.loadAllTeamsInTournament();
    team.loadAllTeamsInSport();
    matchWithFullData.loadAllMatchesInTournament();
    playerInTeamTournament.loadAllPlayersInTournament();
    playerInTeamTournament.loadAllPlayersInTeamTournament();
    person.loadAllPersons();
    player.loadAllPlayersBySportId();
    position.loadAllPositionsBySportId();

    this.search.searchMatch(null);
    this.search.searchMatchByWeek(null);
    this.pagination.resetCurrentPage();
    this.pagination.resetPlayerInTournamentCurrentPage();
  }

  menuDropdownOpen = false;

  readonly formWeek = new FormGroup({
    matchWeekSearch: new FormControl(1),
  });

  buttonTitle: string = 'Tournament';

  onSearch(searchTerm: string | null) {
    this.search.searchMatch(searchTerm);
    this.pagination.resetCurrentPage();
  }

  onSearchByWeek(searchTerm: string | null) {
    this.search.searchMatchByWeek(searchTerm);
    this.pagination.resetCurrentPage();
  }

  onDelete() {
    this.tournament.deleteTournament();
  }

  onTeamRemoveFromTournament(teamId: number, tournamentId: number) {
    this.teamTournament.deleteTeamTournamentConnection(teamId, tournamentId);
  }

  setCurrentPage(page: number): void {
    this.pagination.changePage(page);
  }

  changePageSize(size: number | 'All'): void {
    this.pagination.changeItemsPerPage(size);
  }

  setPlayerInTournamentCurrentPage(page: number): void {
    this.pagination.changePlayerInTournamentPage(page);
  }

  changePlayerInTournamentPageSize(size: number | 'All'): void {
    this.pagination.changePlayerInTournamentItemsPerPage(size);
  }

  parsMatchesFromTournamentEESL() {
    this.match.parsMatchesInTournamentEESL();
  }

  protected readonly url = urlWithProtocol;
  protected readonly TuiAppearance = TuiAppearance;
  protected readonly calculateAgeStats = calculateAgeStats;
}
