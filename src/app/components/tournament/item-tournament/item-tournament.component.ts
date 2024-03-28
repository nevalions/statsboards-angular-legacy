import {
  ChangeDetectionStrategy,
  Component,
  inject,
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
import {
  AsyncPipe,
  SlicePipe,
  UpperCasePipe,
  Location,
  TitleCasePipe,
} from '@angular/common';
import { DropDownMenuComponent } from '../../../shared/ui/dropdownmenu/dropdownmenu.component';
import { ListOfItemsIslandComponent } from '../../../shared/ui/list-of-items-island/list-of-items-island.component';
import {
  TuiButtonModule,
  TuiHintModule,
  TuiLoaderModule,
} from '@taiga-ui/core';
import { ActivatedRoute, Params, Router, RouterOutlet } from '@angular/router';
import { first, Observable, of, take } from 'rxjs';
import { IMatch, IMatchWithFullData } from '../../../type/match.type';
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
import { ITeam, ITeamTournament } from '../../../type/team.type';
import { ListOfTeamsSmallComponent } from '../../team/list-of-teams-small/list-of-teams-small.component';
import { SearchListService } from '../../../services/search-list.service';
import { PaginationService } from '../../../services/pagination.service';
import { FormSearchTextComponent } from '../../../shared/ui/forms/form-search-text/form-search-text.component';
import { paginationWithItemsPerPage } from '../../../shared/ui/pagination/pagination-with-items-per-page/pagination-with-items-per-page.component';
import { FormSearchAutoCompleteComponent } from '../../../shared/ui/forms/form-search-auto-complete/form-search-auto-complete.component';
import { TournamentDeleteFormComponent } from '../tournament-delete-form/tournament-delete-form.component';
import { DeleteDialogComponent } from '../../../shared/ui/dialogs/delete-dialog/delete-dialog.component';
import { AddEditMatchComponent } from '../../match/add-edit-match/add-edit-match.component';
import { MatchService } from '../../match/match.service';
import { MatchWithFullDataService } from '../../match-with-full-data/matchfulldata.service';
import { AddTeamToTournamentComponent } from './add-team-to-tournament/add-team-to-tournament.component';
import { DeleteButtonComponent } from '../../../shared/ui/buttons/delete-button/delete-button.component';
import { DeleteButtonIconComponent } from '../../../shared/ui/buttons/delete-button-icon/delete-button-icon.component';
import { RemoveDialogComponent } from '../../../shared/ui/dialogs/remove-dialog/remove-dialog.component';
import { CreateButtonShowDialogComponent } from '../../../shared/ui/buttons/create-button-show-dialog/create-button-show-dialog.component';
import { AddItemDialogFromListComponent } from '../../../shared/ui/dialogs/add-item-dialog-from-list/add-item-dialog-from-list.component';
import { Store } from '@ngrx/store';
import { tournamentActions } from '../store/actions';
import { teamActions } from '../../team/store/actions';
import { teamTournamentActions } from '../../team-tournament/store/actions';
import { AppState } from '../../../store/appstate';
import { ISport } from '../../../type/sport.type';
import { sportActions } from '../../sport/store/actions';
import { Sport } from '../../sport/sport';
import { Tournament } from '../tournament';
import { Team } from '../../team/team';
import { TeamTournament } from '../../team-tournament/teamTournament';
import { Season } from '../../season/season';
import { Match } from '../../match/match';
import { MatchWithFullData } from '../../match-with-full-data/matchWithFullData';
import { urlWithProtocol } from '../../../base/constants';

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
    RouterOutlet,
    TitleCasePipe,
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
  matchesInTournament$ =
    this.matchWithFullData.matchesWithFullDataInTournament$;

  constructor(
    private season: Season,
    private sport: Sport,
    private tournament: Tournament,
    private team: Team,
    private teamTournament: TeamTournament,
    // private match: Match,
    private matchWithFullData: MatchWithFullData,
  ) {
    // season.loadCurrentSeason();
    // sport.loadCurrentSport();
    // tournament.loadCurrentTournament();
    team.loadAllTeamsInTournament();
    team.loadAllTeamsInSport();
    matchWithFullData.loadAllMatchesInTournament();
  }

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  // private tournamentService = inject(TournamentService);
  // private seasonService = inject(SeasonService);
  matchService = inject(MatchService);

  //   routeId$: Observable<string | undefined> = this.store.select(
  //   fromRouter.getRouterSelectors().selectRouteParam('id'),
  // );
  // routeParams$: Observable<Params> = this.tournamentStore.select(
  //   fromRouter.getRouterSelectors().selectRouteParams,
  // );

  // matchWithFullDataService = inject(MatchFullDataService);

  searchListService = inject(SearchListService);
  paginationService = inject(PaginationService);

  // tournamentId!: number;

  // matchesWithFullData$: Observable<IMatchFullData[]> =
  //   this.matchWithFullDataService.matchesWithFullData$;

  readonly formWeek = new FormGroup({
    matchWeekSearch: new FormControl(1),
  });

  buttonTitle: string = 'Tournament';

  islandTeamTitleProperty: keyof ITeam = 'title';

  // teamItemHref(item: ITeam): string {
  //   return `/team/${item.id}`;
  // }

  navigateToTeamItem(item: ITeam): void {
    this.router.navigate(['team', item.id], { relativeTo: this.route });
  }

  // navigateToMatchItem(item: IMatchFullData): void {
  //   this.router.navigate(['match', item.id], { relativeTo: this.route });
  // }

  // navigateTo(route: string): void {
  //   this.router.navigateByUrl(route);
  // }
  //
  // matchHref(item: IMatchFullData): string {
  //   return `/matches/id/${item.id}`;
  // }

  // ngOnInit() {
  //   // this.route.paramMap.subscribe((params) => {
  //   //   let tournamentId = params.get('tournament_id');
  //   //   let seasonId = params.get('season_id');
  //   //   let sportId = params.get('sport_id');
  //   //   console.log(tournamentId, seasonId, sportId);
  //
  //   // if (tournamentId && seasonId && sportId) {
  //   //   this.tournamentId = Number(tournamentId);
  //   // this.store.dispatch(sportActions.getId());
  //   // this.loadTournament();
  //   // this.loadTeamsInSport();
  //   // this.loadTeamsInTournament();
  //
  //   // this.matchWithFullDataService.refreshMatchesWithDataInTournament(
  //   //   this.tournamentId,
  //   // );
  //   //
  //   // this.matchWithFullDataService.matchesWithFullData$.subscribe(
  //   //   (matches: IMatchFullData[]) => {
  //   //     this.searchListService.updateData(of(matches));
  //   //     this.paginationService.initializePagination(
  //   //       this.searchListService.filteredData$,
  //   //     );
  //   //   },
  //   // );
  //   // } else {
  //   //   console.log('Params are empty');
  //   // }
  //   // });
  // }

  // }

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

  // onMatchAdd(match: IMatch | null | undefined): void {
  //   if (match && this.tournamentId) {
  //     this.matchWithFullDataService.addMatchWithFullData(match);
  //   } else {
  //     console.log('Match data is empty');
  //   }
  // }

  // onMatchAdd(match: IMatch | null | undefined): void {
  //   if (match && this.tournamentId) {
  //     this.matchWithFullDataService.addMatchWithFullData(match);
  //   } else {
  //     console.log('Match data is empty');
  //   }
  // }

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
}

// routeId$: Observable<string | undefined> = this.tournamentStore.select(
//   fromRouter.getRouterSelectors().selectRouteParam('id'),
// );
// routeParams$: Observable<Params> = this.tournamentStore.select(
//   fromRouter.getRouterSelectors().selectRouteParams,
// );

// this.tournament$
//   .pipe(
//     switchMap((tournament) =>
//       this.seasonService
//         .findById(tournament.season_id)
//         .pipe(
//           switchMap((season) =>
//             this.tournamentService
//               .deleteTournament(tournament.id!)
//               .pipe(map(() => ({ tournament, season }))),
//           ),
//         ),
//     ),
//   )
//   .subscribe(({ tournament, season }) => {
//     const sport_id = tournament.sport_id;
//     const year = season.year;
//     this.router.navigateByUrl(
//       `/sports/id/${sport_id}/seasons/${year}/tournaments`,
//     );
//   });

//   this.route.params
//     .pipe(takeUntil(this.ngUnsubscribe))
//     .subscribe((params: Params) => {
//       const t_id = Number([params['id']]);
//       this.tournamentId = t_id;
//       // this.tournament$ = this.tournamentService.findById(this.tournamentId);
//       this.tournamentStore.dispatch(tournamentActions.get({ id: t_id }));
//
//       this.teamTournamentService.refreshTeamsInTournament(t_id);
//       this.matchWithFullDataService.refreshMatchesWithDataInTournament(
//         this.tournamentId,
//       );
//     });
//
//   this.matchWithFullDataService.matchesWithFullData$
//     .pipe(takeUntil(this.ngUnsubscribe))
//     .subscribe((matches: IMatchFullData[]) => {
//       this.searchListService.updateData(of(matches));
//       this.paginationService.initializePagination(
//         this.searchListService.filteredData$,
//       );
//     });
//
//   this.onSearch();
