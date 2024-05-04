import {
  ChangeDetectionStrategy,
  Component,
  inject,
  ViewEncapsulation,
} from '@angular/core';
import { TuiElasticContainerModule, TuiInputNumberModule } from '@taiga-ui/kit';
import { AsyncPipe, UpperCasePipe, TitleCasePipe } from '@angular/common';
import {
  TuiAppearance,
  TuiButtonModule,
  TuiLoaderModule,
} from '@taiga-ui/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IMatchWithFullData } from '../../../type/match.type';
import { ListOfMatchesComponent } from '../../../shared/ui/list-of-matches/list-of-matches.component';
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
  ],
  templateUrl: './item-tournament.component.html',
  styleUrl: './item-tournament.component.less',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Default,
})
export class ItemTournamentComponent {
  allSportTeams$ = this.team.teamsInSport$;
  teamsInTournament$ = this.team.teamsInTournament$;
  tournament$ = this.tournament.currentTournament$;
  currentTournamentMainSponsor$ = this.tournament.currentTournamentMainSponsor$;
  sponsorLine$ = this.sponsorLine.sponsorLineWithFullData$;
  allSponsors$ = this.sponsor.allSponsors$;
  allSponsorLines$ = this.sponsorLine.allSponsorLines$;
  matchesInTournament$ =
    this.matchWithFullData.matchesWithFullDataInTournament$;

  constructor(
    private season: Season,
    private sport: Sport,
    private tournament: Tournament,
    private team: Team,
    private teamTournament: TeamTournament,
    private matchWithFullData: MatchWithFullData,
    private sponsor: Sponsor,
    private sponsorLine: SponsorLine,
  ) {
    sponsor.loadAllSponsors();
    sponsorLine.loadAllSponsorLines();
    team.loadAllTeamsInTournament();
    team.loadAllTeamsInSport();
    matchWithFullData.loadAllMatchesInTournament();
  }

  private route = inject(ActivatedRoute);
  private router = inject(Router);

  searchListService = inject(SearchListService);
  paginationService = inject(PaginationService);

  readonly formWeek = new FormGroup({
    matchWeekSearch: new FormControl(1),
  });

  buttonTitle: string = 'Tournament';

  islandTeamTitleProperty: keyof ITeam = 'title';

  navigateToTeamItem(item: ITeam): void {
    this.router.navigate(['team', item.id], { relativeTo: this.route });
  }

  onSearch() {
    this.formWeek
      .get('matchWeekSearch')!
      .valueChanges.pipe
      // Unsubscribe when the component is destroyed.
      // takeUntil(this.ngUnsubscribe),
      ()
      .subscribe((matchWeekSearch) => {
        this.searchListService.updateFilteredData(
          String(matchWeekSearch).toString(),
          'match.week',
        );
      });
  }

  onDelete() {
    this.tournament.deleteTournament();
  }

  onTeamRemoveFromTournament(teamId: number, tournamentId: number) {
    this.teamTournament.deleteTeamTournamentConnection(teamId, tournamentId);
  }

  readonly stringify = (match: IMatchWithFullData): string =>
    match?.match?.week?.toString();
  // `${teams_data?.team_a?.title?.toString()} vs ${teams_data?.team_b?.title?.toString()}` ||
  // '';

  readonly matcherM = (match: IMatchWithFullData, search: string): boolean =>
    match?.match?.week
      ?.toString()
      .toLowerCase()
      .includes(search.toLowerCase()) ?? false;

  protected readonly url = urlWithProtocol;
  protected readonly TuiAppearance = TuiAppearance;
}
