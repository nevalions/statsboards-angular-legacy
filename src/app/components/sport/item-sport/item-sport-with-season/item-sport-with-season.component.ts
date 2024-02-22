import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import { Observable, of } from 'rxjs';

import { AsyncPipe, UpperCasePipe } from '@angular/common';
import { TuiBlockStatusModule } from '@taiga-ui/layout';
import { TuiIslandModule, TuiSelectModule } from '@taiga-ui/kit';
import {
  TuiButtonModule,
  TuiDataListModule,
  TuiLoaderModule,
} from '@taiga-ui/core';
import { SeasonDropdownComponent } from '../../../season/season-dropdown/season-dropdown.component';
import { ListOfItemsIslandComponent } from '../../../../shared/ui/list-of-items-island/list-of-items-island.component';
import { ITournament } from '../../../../type/tournament.type';
import { IBaseIdElse } from '../../../../type/base.type';
import { DropDownMenuComponent } from '../../../../shared/ui/dropdownmenu/dropdownmenu.component';
import { FormSearchTextComponent } from '../../../../shared/ui/forms/form-search-text/form-search-text.component';
import { paginationWithItemsPerPage } from '../../../../shared/ui/pagination/pagination-with-items-per-page/pagination-with-items-per-page.component';
import { SearchListService } from '../../../../services/search-list.service';
import { PaginationService } from '../../../../services/pagination.service';
import { SportWithSeasonDropdownComponent } from '../../../../shared/ui/dropdownmenu/sport-with-season-dropdown/sport-with-season-dropdown.component';
import { CreateButtonComponent } from '../../../../shared/ui/buttons/create-button/create-button.component';
import { BodyTitleComponent } from '../../../../shared/ui/body/body-title/body-title.component';
import { TournamentAddEditFormComponent } from '../../../tournament/tournament-add-edit-form/tournament-add-edit-form.component';
import { Store } from '@ngrx/store';
import { TournamentState } from '../../../tournament/store/reducers';
import { tournamentActions } from '../../../tournament/store/actions';
import { SeasonState } from '../../../season/store/reducers';
import { ISeason } from '../../../../type/season.type';
import { seasonActions } from '../../../season/store/actions';
import { IslandListOfTournamentsComponent } from '../../../tournament/island-list-of-tournaments/island-list-of-tournaments.component';
import { ItemSportComponent } from '../item-sport.component';
import { AppState } from '../../../../store/appstate';
import { ISport } from '../../../../type/sport.type';
import { sportActions } from '../../store/actions';
import { Sport } from '../../sport';
import { Season } from '../../../season/season';
import { Tournament } from '../../../tournament/tournament';

@Component({
  selector: 'app-item-sport-with-season',
  standalone: true,
  imports: [
    AsyncPipe,
    TuiBlockStatusModule,
    TuiSelectModule,
    TuiButtonModule,
    TuiIslandModule,
    UpperCasePipe,
    SeasonDropdownComponent,
    ListOfItemsIslandComponent,
    DropDownMenuComponent,
    TuiDataListModule,
    TuiLoaderModule,
    FormSearchTextComponent,
    paginationWithItemsPerPage,
    SportWithSeasonDropdownComponent,
    CreateButtonComponent,
    BodyTitleComponent,
    TournamentAddEditFormComponent,
    IslandListOfTournamentsComponent,
  ],
  providers: [],
  templateUrl: './item-sport-with-season.component.html',
  styleUrl: './item-sport-with-season.component.less',
  encapsulation: ViewEncapsulation.None, //helps with full width of buttons select season
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemSportWithSeasonComponent {
  sport$ = this.sport.sport$;
  season$ = this.season.season$;
  allSeasonSportTournaments$ = this.tournament.allSeasonSportTournaments$;

  constructor(
    private sport: Sport,
    private season: Season,
    private tournament: Tournament,
  ) {
    sport.loadCurrentSport();
    season.loadCurrentSeason();
    tournament.loadSeasonSportTournaments();
  }

  tournamentItemHref(item: ITournament): string {
    return `sport/${item.sport_id}/season/${item.season_id}/tournament/${item.id}`;
  }
}

// searchListService = inject(SearchListService);
// paginationService = inject(PaginationService);
//
// islandTitleProperty: keyof IBaseIdElse = 'title';

// ngAfterViewInit() {
//   this.loadSeason();
//   this.loadSportSeasonTournaments();
//
//   this.tournaments$.subscribe((tournaments: ITournament[]) => {
//     this.searchListService.updateData(of(tournaments));
//     this.paginationService.initializePagination(
//       this.searchListService.filteredData$,
//     );
//   });
//   // this.sportId$.subscribe((sportId) => {
//   //   if (sportId) {
//   //     this.route.paramMap.subscribe((params) => {
//   //       const seasonId = params.get('season_id');
//   //
//   //       if (seasonId) {
//   //         this.loadSeason(Number(seasonId));
//   //         this.loadSportSeasonTournaments(sportId, Number(seasonId));
//   //
//   //         this.tournaments$.subscribe((tournaments: ITournament[]) => {
//   //           this.searchListService.updateData(of(tournaments));
//   //           this.paginationService.initializePagination(
//   //             this.searchListService.filteredData$,
//   //           );
//   //         });
//   //       }
//   //     });
//   //   }
//   // });
// }
// }

// private crudStateObj = crudState<ITournament>();
// crudStore: Store<{ crud: crudStoreInterface<ITournament> }> = inject(Store);
// tournamentActions = crudActions<ITournament>();

// sportStore: Store<{ sport: SportState }> = inject(Store);
// route = inject(ActivatedRoute);

// sport$: Observable<ISport | null | undefined> = this.sportStore.select(
//   (store) => store.sport.currentItem,
// );

// routeParams$ = this.tournamentStore.select(
//   fromRouter.getRouterSelectors().selectRouteParams,
// );
//
// routeParamsId$ = this.tournamentStore.select(
//   fromRouter.getRouterSelectors().selectRouteParam('sport_id'),
// );
//
// routeParamsYear$ = this.tournamentStore.select(
//   fromRouter.getRouterSelectors().selectRouteParam('season_id'),
// );

//   ngOnInit() {
//   this.route.paramMap.subscribe((params) => {
//     let sport_id = params.get('sport_id');
//     let season_id = params.get('season_id');
//     console.log(sport_id, season_id);
//     if (sport_id && season_id) {
//       const sportId = Number(sport_id);
//       const seasonId = Number(season_id);
//
//       this.loadSeason(seasonId);
//       this.loadSport(sportId);
//       this.loadSportSeasonTournaments(sportId, seasonId);
//
//       this.tournaments$.subscribe((tournaments: ITournament[]) => {
//         this.searchListService.updateData(of(tournaments));
//         this.paginationService.initializePagination(
//           this.searchListService.filteredData$,
//         );
//       });
//     } else {
//       console.log('Params are empty');
//     }
//   });
// }

// this.routeParams$.subscribe((params) => {
//   // let sportId = params.get('sport_id');
//   // let seasonId = params.get('season_id');
//   const sportId = params['sport_id'];
//   const seasonId = params['season_id'];
//   console.log(sportId, seasonId);
//   if (sportId && seasonId) {
//     const id = Number(sportId);
//     const seasonYear = Number(seasonId);
//
//     this.loadSeasonByYear(seasonYear);
//     this.loadSport(id);
//     this.loadSportSeasonTournaments(id, seasonYear);
//
//     this.tournaments$.subscribe((tournaments: ITournament[]) => {
//       this.searchListService.updateData(of(tournaments));
//       this.paginationService.initializePagination(
//         this.searchListService.filteredData$,
//       );
//     });
//   } else {
//     console.log('Params are empty');
//   }
// });
