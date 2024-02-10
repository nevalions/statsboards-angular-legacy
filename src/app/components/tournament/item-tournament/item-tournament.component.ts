import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import {
  TuiDataListWrapperModule,
  TuiElasticContainerModule,
  TuiFilterByInputPipeModule,
  TuiInputModule,
  TuiInputNumberModule,
  TuiPaginationModule,
  TuiStringifyContentPipeModule,
} from '@taiga-ui/kit';
import { AsyncPipe, SlicePipe, UpperCasePipe, Location } from '@angular/common';
import { DropDownMenuComponent } from '../../../shared/ui/dropdownmenu/dropdownmenu.component';
import { ListOfItemsIslandComponent } from '../../../shared/ui/list-of-items-island/list-of-items-island.component';
import {
  TuiButtonModule,
  TuiHintModule,
  TuiLoaderModule,
} from '@taiga-ui/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TournamentService } from '../tournament.service';
import { map, Observable, of, Subject, switchMap, takeUntil } from 'rxjs';
import { ITournament } from '../../../type/tournament.type';
import { IMatchFullData } from '../../../type/match.type';
import { ListOfMatchesComponent } from '../../../shared/ui/list-of-matches/list-of-matches.component';
import { CreateButtonComponent } from '../../../shared/ui/buttons/create-button/create-button.component';
import { BodyTitleComponent } from '../../../shared/ui/body/body-title/body-title.component';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { TuiValueChangesModule } from '@taiga-ui/cdk';
import { ListOfTeamsComponent } from '../../team/list-of-teams/list-of-teams.component';
import { ITeam } from '../../../type/team.type';
import { ListOfTeamsSmallComponent } from '../../team/list-of-teams-small/list-of-teams-small.component';
import { SearchListService } from '../../../services/search-list.service';
import { PaginationService } from '../../../services/pagination.service';
import { FormSearchTextComponent } from '../../../shared/ui/forms/form-search-text/form-search-text.component';
import { paginationWithItemsPerPage } from '../../../shared/ui/pagination/pagination-with-items-per-page/pagination-with-items-per-page.component';
import { FormSearchAutoCompleteComponent } from '../../../shared/ui/forms/form-search-auto-complete/form-search-auto-complete.component';
import { SeasonService } from '../../../services/season.service';
import { tap } from 'rxjs/operators';
import { ISeason } from '../../../type/season.type';
import { TournamentDeleteFormComponent } from '../tournament-delete-form/tournament-delete-form.component';
import { DeleteDialogComponent } from '../../../shared/ui/dialogs/delete-dialog/delete-dialog.component';
import { AddEditMatchComponent } from '../../match/add-edit-match/add-edit-match.component';
import { MatchService } from '../../match/match.service';
import { MatchFullDataService } from '../../match/matchfulldata.service';
import { TeamTournamentService } from '../../../services/team-tournament.service';
import { AddTeamToTournamentComponent } from '../../team/add-team-to-tournament/add-team-to-tournament.component';
import { TeamService } from '../../team/team.service';
import { DeleteButtonComponent } from '../../../shared/ui/buttons/delete-button/delete-button.component';
import { DeleteButtonIconComponent } from '../../../shared/ui/buttons/delete-button-icon/delete-button-icon.component';
import { tuiIconClose } from '@taiga-ui/icons';
import { RemoveDialogComponent } from '../../../shared/ui/dialogs/remove-dialog/remove-dialog.component';
import { CreateButtonShowDialogComponent } from '../../../shared/ui/buttons/create-button-show-dialog/create-button-show-dialog.component';
import { AddItemDialogFromListComponent } from '../../../shared/ui/dialogs/add-item-dialog-from-list/add-item-dialog-from-list.component';

@Component({
  selector: 'app-item-tournament',
  standalone: true,
  imports: [
    AsyncPipe,
    DropDownMenuComponent,
    ListOfItemsIslandComponent,
    TuiButtonModule,
    TuiLoaderModule,
    UpperCasePipe,
    ListOfMatchesComponent,
    SlicePipe,
    TuiPaginationModule,
    CreateButtonComponent,
    BodyTitleComponent,
    TuiInputModule,
    TuiHintModule,
    ReactiveFormsModule,
    FormsModule,
    TuiDataListWrapperModule,
    TuiFilterByInputPipeModule,
    TuiStringifyContentPipeModule,
    TuiInputNumberModule,
    TuiValueChangesModule,
    ListOfTeamsComponent,
    ListOfTeamsSmallComponent,
    FormSearchTextComponent,
    paginationWithItemsPerPage,
    FormSearchAutoCompleteComponent,
    TournamentDeleteFormComponent,
    DeleteDialogComponent,
    AddEditMatchComponent,
    AddTeamToTournamentComponent,
    TuiElasticContainerModule,
    DeleteButtonComponent,
    DeleteButtonIconComponent,
    RemoveDialogComponent,
    CreateButtonShowDialogComponent,
    AddItemDialogFromListComponent,
  ],
  templateUrl: './item-tournament.component.html',
  styleUrl: './item-tournament.component.less',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Default,
})
export class ItemTournamentComponent implements OnInit, OnDestroy {
  private readonly ngUnsubscribe = new Subject<void>();

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private tournamentService = inject(TournamentService);
  private seasonService = inject(SeasonService);

  matchWithFullDataService = inject(MatchFullDataService);
  teamTournamentService = inject(TeamTournamentService);

  searchListService = inject(SearchListService);
  paginationService = inject(PaginationService);

  tournament$: Observable<ITournament> = of({} as ITournament);
  tournamentId!: number;

  matchesWithFullData$: Observable<IMatchFullData[]> =
    this.matchWithFullDataService.matchesWithFullData$;

  teamsInTournament$ = this.teamTournamentService.teamsInTournament$;

  readonly formWeek = new FormGroup({
    matchWeekSearch: new FormControl(1),
  });

  buttonTitle: string = 'Tournament';

  constructor() {}

  islandTeamTitleProperty: keyof ITeam = 'title';

  teamItemHref(item: ITeam): string {
    return `/tournaments/id/${this.tournamentId}/teams/id/${item.id}`;
  }

  navigateTo(route: string): void {
    this.router.navigateByUrl(route);
  }

  matchHref(item: IMatchFullData): string {
    return `/matches/id/${item.id}`;
  }

  ngOnInit() {
    this.route.params
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((params: Params) => {
        this.tournamentId = Number([params['id']]);
        this.tournament$ = this.tournamentService.findById(this.tournamentId);
        // this.teams$ =
        //   this.tournamentService.fetchTeamsByTournamentId(tournamentId);

        this.teamTournamentService.refreshTeamsInTournament(this.tournamentId);
        this.matchWithFullDataService.refreshMatchesWithDataInTournament(
          this.tournamentId,
        );
      });

    this.matchWithFullDataService.matchesWithFullData$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((matches: IMatchFullData[]) => {
        this.searchListService.updateData(of(matches));
        this.paginationService.initializePagination(
          this.searchListService.filteredData$,
        );
      });

    this.onSearch();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  onSearch() {
    this.formWeek
      .get('matchWeekSearch')!
      .valueChanges.pipe(
        // Unsubscribe when the component is destroyed.
        takeUntil(this.ngUnsubscribe),
      )
      .subscribe((matchWeekSearch) => {
        this.searchListService.updateFilteredData(
          String(matchWeekSearch).toString(),
          'match.week',
        );
      });
  }

  onDelete() {
    this.tournament$
      .pipe(
        switchMap((tournament) =>
          this.seasonService
            .findById(tournament.season_id)
            .pipe(
              switchMap((season) =>
                this.tournamentService
                  .deleteTournament(tournament.id!)
                  .pipe(map(() => ({ tournament, season }))),
              ),
            ),
        ),
      )
      .subscribe(({ tournament, season }) => {
        const sport_id = tournament.sport_id;
        const year = season.year;
        this.router.navigateByUrl(
          `/sports/id/${sport_id}/seasons/${year}/tournaments`,
        );
      });
  }

  onTeamRemoveFromTournament(teamId: number, tournamentId: number) {
    this.teamTournamentService
      .deleteTeamTournament(teamId, tournamentId)
      .subscribe();
  }

  readonly stringify = (match: IMatchFullData): string =>
    match?.match?.week?.toString();
  // `${teams_data?.team_a?.title?.toString()} vs ${teams_data?.team_b?.title?.toString()}` ||
  // '';

  readonly matcherM = (match: IMatchFullData, search: string): boolean =>
    match?.match?.week
      ?.toString()
      .toLowerCase()
      .includes(search.toLowerCase()) ?? false;
}
