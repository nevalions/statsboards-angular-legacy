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
  matchService = inject(MatchService);

  @Input() itemData: ISeason = {} as ISeason;

  searchListService = inject(SearchListService);
  paginationService = inject(PaginationService);

  tournament$: Observable<ITournament> = of({} as ITournament);

  // matches$: Observable<IMatchFullData[]> = of([]);
  matchesWithFullData$: Observable<IMatchFullData[]> =
    this.matchService.matchesWithFullData$;
  teams$: Observable<ITeam[]> = of([]);

  readonly formWeek = new FormGroup({
    matchWeekSearch: new FormControl(1),
  });

  constructor() {}

  islandTeamTitleProperty: keyof ITeam = 'title';

  teamItemHref(item: ITeam): string {
    return `/teams/id/${item.id}`;
  }

  matchHref(item: IMatchFullData): string {
    return `/matches/id/${item.id}`;
  }

  ngOnInit() {
    this.route.params
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((params: Params) => {
        const tournamentId = Number([params['id']]);
        this.tournament$ = this.tournamentService.findById(tournamentId);
        this.teams$ =
          this.tournamentService.fetchTeamsByTournamentId(tournamentId);

        this.matchService.refreshMatchesInTournament(tournamentId);
      });

    this.matchService.matchesWithFullData$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((matches: IMatchFullData[]) => {
        this.searchListService.updateData(of(matches));
        this.paginationService.initializePagination(
          this.searchListService.filteredData$,
        );
      });

    this.onSearch();
  }

  //   ngOnInit() {
  //   this.route.params
  //     .pipe(
  //       switchMap((params) => {
  //         const tournamentId = Number([params['id']]);
  //         this.tournament$ = this.tournamentService.findById(tournamentId);
  //         this.teams$ =
  //           this.tournamentService.fetchTeamsByTournamentId(tournamentId);
  //
  //         return this.tournamentService.fetchMatchesByTournamentId(
  //           tournamentId,
  //         );
  //       }),
  //       map((matches: IMatchFullData[]) => {
  //         this.searchListService.updateData(of(matches));
  //         this.paginationService.initializePagination(
  //           this.searchListService.filteredData$,
  //         );
  //
  //         return matches;
  //       }),
  //     )
  //     .subscribe((matches: IMatchFullData[]) => {
  //       this.matches$ = of(matches);
  //     });
  //
  //   this.onSearch();
  // }

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

// searchText: string = '';
// matchWeekSearchForm = new FormGroup({
//   matchWeek: new FormControl(''),
// });
//
// readonly form = new FormGroup({
//   match: new FormControl(),
// });
//
// readonly stringify = ({ match }: IMatchFullData): string =>
//   match.week.toString();
//
// readonly matcherM = (match: IMatchFullData, search: string): boolean =>
//   match.match.week.toString().toLowerCase().startsWith(search.toLowerCase());

// @ViewChild(ListOfItemsIslandComponent)
// comp!: ListOfItemsIslandComponent<IMatchFullData>;

// itemsPerPage = 4;
// currentPageIndex = 1;

// onSearch() {
//   this.searchText = this.matchWeekSearchForm.get('matchWeek')?.value || '';
//   this.loadMatches();
// }
//
// loadMatches() {
//   this.route.params.subscribe((params) => {
//     const tournamentId = Number([params['id']]);
//     this.matches$ = this.tournamentService
//       .fetchMatchByTournamentId(tournamentId)
//       .pipe(
//         map((items) => this.filterMatches(items)),
//         tap((filteredItems) =>
//           console.log(
//             `Filtered Matches in Tournament ID: ${tournamentId}`,
//             filteredItems,
//           ),
//         ),
//         map((items) =>
//           SortService.sort(items, 'match.week', '-match.match_date'),
//         ),
//       );
//   });
// }
//
// filterMatches(matches: IMatchFullData[]): IMatchFullData[] {
//   if (!this.searchText) {
//     return matches;
//   }
//   const lowerCaseSearch = this.searchText.toString().toLowerCase();
//   return matches.filter((match) =>
//     match.match.week.toString().includes(lowerCaseSearch),
//   );
// }
