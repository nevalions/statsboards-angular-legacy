import {
  ChangeDetectionStrategy,
  Component,
  inject,
  ViewEncapsulation,
} from '@angular/core';
import {
  TuiElasticContainerModule,
  TuiInputCountModule,
  TuiInputNumberModule,
} from '@taiga-ui/kit';
import { AsyncPipe, UpperCasePipe, TitleCasePipe } from '@angular/common';
import {
  TuiAppearance,
  TuiButtonModule,
  TuiDropdownModule,
  TuiHostedDropdownModule,
  TuiLoaderModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IMatchWithFullData } from '../../../type/match.type';
import { ListOfMatchesComponent } from '../../../shared/ui/list/list-of-matches/list-of-matches.component';
import { BodyListTitleComponent } from '../../../shared/ui/body/body-title/body-list-title.component';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ITeam } from '../../../type/team.type';
import { SearchListService } from '../../../services/search-list.service';
import { PaginationService } from '../../../services/pagination.service';
import { FormSearchTextComponent } from '../../../shared/ui/forms/form-search-text/form-search-text.component';
import { paginationWithItemsPerPage } from '../../../shared/ui/pagination/pagination-with-items-per-page/pagination-with-items-per-page.component';
import { DeleteDialogComponent } from '../../../shared/ui/dialogs/delete-dialog/delete-dialog.component';
import { AddTeamToTournamentComponent } from './add-team-to-tournament/add-team-to-tournament.component';
import { DeleteButtonComponent } from '../../../shared/ui/buttons/delete-button/delete-button.component';
import { DeleteButtonIconComponent } from '../../../shared/ui/buttons/delete-button-icon/delete-button-icon.component';
import { RemoveDialogComponent } from '../../../shared/ui/dialogs/remove-dialog/remove-dialog.component';
import { CreateButtonShowDialogComponent } from '../../../shared/ui/buttons/create-button-show-dialog/create-button-show-dialog.component';
import { Sport } from '../../sport/sport';
import { Tournament } from '../tournament';
import { Team } from '../../team/team';
import { TeamTournament } from '../../team-tournament/teamTournament';
import { Season } from '../../season/season';
import { MatchWithFullData } from '../../match-with-full-data/matchWithFullData';
import { urlWithProtocol } from '../../../base/constants';
import { SponsorLine } from '../../adv/sponsor-line/sponsorLine';
import { SponsorLineComponent } from '../../../shared/scoreboards/sponsor-line/sponsor-line.component';
import { EditButtonComponent } from '../../../shared/ui/buttons/edit-button/edit-button.component';
import { TournamentAddEditFormComponent } from '../tournament-add-edit-form/tournament-add-edit-form.component';
import { Sponsor } from '../../adv/sponsor/sponsor';
import { TuiValueChangesModule } from '@taiga-ui/cdk';
import { AddEditMatchComponent } from '../../match/add-edit-match/add-edit-match.component';
import { AddEditPlayerToTeamTournamentTableComponent } from '../../player-team-tournament/add-edit-player-to-team-tournament-table/add-edit-player-to-team-tournament-table.component';
import { Player } from '../../player/player';
import { Position } from '../../position/postion';
import { PlayerInTeamTournament } from '../../player-team-tournament/player-team-tournament';
import { Person } from '../../person/person';
import { AddEditPlayerToTeamTournamentComponent } from '../../player-team-tournament/add-edit-player-to-team-tournament/add-edit-player-to-team-tournament.component';
import { Search } from '../../../store/search/search';
import { Pagination } from '../../../store/pagination/pagination';
import { BaseSearchFormComponent } from '../../../shared/ui/search/base-search-form/base-search-form.component';
import { BasePaginationComponent } from '../../../shared/ui/pagination/base-pagination/base-pagination.component';

@Component({
  selector: 'app-item-tournament',
  standalone: true,
  imports: [
    AsyncPipe,
    UpperCasePipe,
    SponsorLineComponent,
    TuiLoaderModule,
    BodyListTitleComponent,
    EditButtonComponent,
    TournamentAddEditFormComponent,
    CreateButtonShowDialogComponent,
    DeleteButtonComponent,
    DeleteDialogComponent,
    ReactiveFormsModule,
    TuiInputNumberModule,
    FormSearchTextComponent,
    paginationWithItemsPerPage,
    ListOfMatchesComponent,
    TuiElasticContainerModule,
    DeleteButtonIconComponent,
    RemoveDialogComponent,
    AddTeamToTournamentComponent,
    TitleCasePipe,
    TuiValueChangesModule,
    AddEditMatchComponent,
    TuiButtonModule,
    AddEditPlayerToTeamTournamentTableComponent,
    AddEditPlayerToTeamTournamentComponent,
    TuiHostedDropdownModule,
    TuiDropdownModule,
    BaseSearchFormComponent,
    BasePaginationComponent,
    TuiInputCountModule,
    TuiTextfieldControllerModule,
  ],
  templateUrl: './item-tournament.component.html',
  styleUrl: './item-tournament.component.less',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Default,
})
export class ItemTournamentComponent {
  sport$ = this.sport.currentSport$;
  allSportTeams$ = this.team.teamsInSport$;
  teamsInTournament$ = this.team.teamsInTournament$;
  tournament$ = this.tournament.currentTournament$;
  currentTournamentMainSponsor$ = this.tournament.currentTournamentMainSponsor$;
  sponsorLine$ = this.sponsorLine.sponsorLineWithFullData$;
  allSponsors$ = this.sponsor.allSponsors$;
  allSponsorLines$ = this.sponsorLine.allSponsorLines$;
  matchesInTournament$ =
    this.matchWithFullData.matchesWithFullDataInTournament$;
  allSportPlayersWithPerson$ = this.player.allSportPlayersWithPerson$;
  allPlayerInTournamentFullData$ =
    this.playerInTeamTournament.allPlayerInTournamentFullData$;
  allAvailablePlayersToAddInTournament$ =
    this.playerInTeamTournament.allAvailablePlayersToAddInTournament$;
  allSportPositions$ = this.position.allSportPositions$;

  paginatedMatchInTournamentSearchResults$ =
    this.pagination.paginatedMatchInTournamentSearchResults$;
  totalMatchInTournamentSearchPages$ =
    this.pagination.totalMatchInTournamentSearchPages$;
  currentPage$ = this.pagination.currentPage$;
  paginatedMatchCombinedSearchResults$ =
    this.pagination.paginatedMatchCombinedSearchResults$;
  totalMatchCombinedSearchPages$ =
    this.pagination.totalMatchCombinedSearchPages$;

  constructor(
    private season: Season,
    private sport: Sport,
    private tournament: Tournament,
    private team: Team,
    private teamTournament: TeamTournament,
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
    person.loadAllPersons();
    player.loadAllPlayersBySportId();
    position.loadAllPositionsBySportId();

    this.search.searchMatch(null);
    this.search.searchMatchByWeek(null);
    this.pagination.resetCurrentPage();
  }

  menuDropdownOpen = false;

  private route = inject(ActivatedRoute);
  private router = inject(Router);

  readonly formWeek = new FormGroup({
    matchWeekSearch: new FormControl(1),
  });

  buttonTitle: string = 'Tournament';

  navigateToTeamItem(item: ITeam): void {
    this.router.navigate(['team', item.id], { relativeTo: this.route });
  }

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

  // readonly stringify = (match: IMatchWithFullData): string =>
  //   match?.match?.week?.toString();
  // `${teams_data?.team_a?.title?.toString()} vs ${teams_data?.team_b?.title?.toString()}` ||
  // '';

  // readonly matcherM = (match: IMatchWithFullData, search: string): boolean =>
  //   match?.match?.week
  //     ?.toString()
  //     .toLowerCase()
  //     .includes(search.toLowerCase()) ?? false;

  protected readonly url = urlWithProtocol;
  protected readonly TuiAppearance = TuiAppearance;
}
