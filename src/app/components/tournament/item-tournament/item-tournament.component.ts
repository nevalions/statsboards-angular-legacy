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
import { filter, map, Observable, of, take } from 'rxjs';

import { IMatch, IMatchFullData } from '../../../type/match.type';
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
import { SeasonService } from '../../season/season.service';

import { TournamentDeleteFormComponent } from '../tournament-delete-form/tournament-delete-form.component';
import { DeleteDialogComponent } from '../../../shared/ui/dialogs/delete-dialog/delete-dialog.component';
import { AddEditMatchComponent } from '../../match/add-edit-match/add-edit-match.component';
import { MatchService } from '../../match/match.service';
import { MatchFullDataService } from '../../match/matchfulldata.service';
import { TeamTournamentService } from '../../team-tournament/team-tournament.service';
import { AddTeamToTournamentComponent } from '../../team-tournament/add-team-to-tournament/add-team-to-tournament.component';

import { DeleteButtonComponent } from '../../../shared/ui/buttons/delete-button/delete-button.component';
import { DeleteButtonIconComponent } from '../../../shared/ui/buttons/delete-button-icon/delete-button-icon.component';

import { RemoveDialogComponent } from '../../../shared/ui/dialogs/remove-dialog/remove-dialog.component';
import { CreateButtonShowDialogComponent } from '../../../shared/ui/buttons/create-button-show-dialog/create-button-show-dialog.component';
import { AddItemDialogFromListComponent } from '../../../shared/ui/dialogs/add-item-dialog-from-list/add-item-dialog-from-list.component';
import { select, Store } from '@ngrx/store';
import { TournamentState } from '../store/reducers';
import { tournamentActions } from '../store/actions';
import * as fromRouter from '@ngrx/router-store';

import { TeamState } from '../../team/store/reducers';
import { teamActions } from '../../team/store/actions';

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
export class ItemTournamentComponent implements OnInit {
  tournamentStore: Store<{ tournament: TournamentState }> = inject(Store);
  teamStore: Store<{ team: TeamState }> = inject(Store);

  teamsInTournament$ = this.teamStore.select(
    (state) => state.team.allTeamsInTournament,
  );
  tournament$ = this.tournamentStore.select(
    (state) => state.tournament.currentTournament,
  );

  // routeId$: Observable<string | undefined> = this.tournamentStore.select(
  //   fromRouter.getRouterSelectors().selectRouteParam('id'),
  // );
  // routeParams$: Observable<Params> = this.tournamentStore.select(
  //   fromRouter.getRouterSelectors().selectRouteParams,
  // );

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private tournamentService = inject(TournamentService);
  private seasonService = inject(SeasonService);
  matchService = inject(MatchService);

  matchWithFullDataService = inject(MatchFullDataService);
  // teamTournamentService = inject(TeamTournamentService);

  searchListService = inject(SearchListService);
  paginationService = inject(PaginationService);

  // tournament$: Observable<ITournament> = of({} as ITournament);
  tournamentId!: number;

  matchesWithFullData$: Observable<IMatchFullData[]> =
    this.matchWithFullDataService.matchesWithFullData$;

  // teamsInTournament$ = this.teamTournamentService.teamsInTournament$;

  readonly formWeek = new FormGroup({
    matchWeekSearch: new FormControl(1),
  });

  buttonTitle: string = 'Tournament';

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

  loadTournament(id: number) {
    // console.log(id);
    this.tournamentStore.dispatch(tournamentActions.get({ id: id }));
  }

  loadTeamsInTournament(id: number) {
    // console.log(id);
    this.teamStore.dispatch(teamActions.getTeamsByTournamentId({ id: id }));
  }

  loadTeamsInSport(id: number) {
    // console.log(id);
    this.teamStore.dispatch(teamActions.getTeamsBySportId({ id: id }));
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      let tournamentId = params.get('tournament_id');
      let seasonId = params.get('season_id');
      let sportId = params.get('sport_id');
      console.log(tournamentId, seasonId, sportId);

      if (tournamentId && seasonId && sportId) {
        this.tournamentId = Number(tournamentId);
        this.loadTournament(Number(tournamentId));
        // this.loadTeamsInSport(Number(tournamentId));
        this.loadTeamsInTournament(Number(tournamentId));

        // this.teamTournamentService.refreshTeamsInTournament(
        //   Number(tournamentId),
        // );

        this.matchWithFullDataService.refreshMatchesWithDataInTournament(
          this.tournamentId,
        );

        this.matchWithFullDataService.matchesWithFullData$.subscribe(
          (matches: IMatchFullData[]) => {
            this.searchListService.updateData(of(matches));
            this.paginationService.initializePagination(
              this.searchListService.filteredData$,
            );
          },
        );
      } else {
        console.log('Params are empty');
      }
    });
  }

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
    this.tournament$.pipe(take(1)).subscribe((currentItem) => {
      if (currentItem) {
        const { id, sport_id, season_id } = currentItem;

        this.tournamentStore.dispatch(
          tournamentActions.delete({
            id: id!,
            sportId: sport_id,
            seasonId: season_id,
          }),
        );
      }
    });

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
  }

  onMatchAdd(match: IMatch | null | undefined): void {
    if (match && this.tournamentId) {
      this.matchWithFullDataService.addMatchWithFullData(match);
    } else {
      console.log('Match data is empty');
    }
  }

  onTeamRemoveFromTournament(teamId: number, tournamentId: number) {
    // this.teamTournamentService
    //   .deleteTeamTournament(teamId, tournamentId)
    //   .subscribe();
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
