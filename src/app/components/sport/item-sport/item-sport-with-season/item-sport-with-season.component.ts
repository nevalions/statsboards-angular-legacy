import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { Observable, of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

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

import { ISport } from '../../../../type/sport.type';
import { SportService } from '../../sport.service';
import { IBaseIdElse } from '../../../../type/base.type';
import { DropDownMenuComponent } from '../../../../shared/ui/dropdownmenu/dropdownmenu.component';
import { SeasonService } from '../../../../services/season.service';

import { FormSearchTextComponent } from '../../../../shared/ui/forms/form-search-text/form-search-text.component';
import { paginationWithItemsPerPage } from '../../../../shared/ui/pagination/pagination-with-items-per-page/pagination-with-items-per-page.component';
import { SearchListService } from '../../../../services/search-list.service';
import { PaginationService } from '../../../../services/pagination.service';
import { SportWithSeasonDropdownComponent } from '../../../../shared/ui/dropdownmenu/sport-with-season-dropdown/sport-with-season-dropdown.component';
import { CreateButtonComponent } from '../../../../shared/ui/buttons/create-button/create-button.component';
import { BodyTitleComponent } from '../../../../shared/ui/body/body-title/body-title.component';
import { TournamentAddEditFormComponent } from '../../../tournament/tournament-add-edit-form/tournament-add-edit-form.component';
import { createSelector, Store } from '@ngrx/store';
import {
  selectItemsList,
  TournamentState,
} from '../../../tournament/store/reducers';
import { tournamentActions } from '../../../tournament/store/actions';
import * as fromRouter from '@ngrx/router-store';
import { SeasonState } from '../../../season/store/reducers';
import { ISeason } from '../../../../type/season.type';
import { seasonActions } from '../../../season/store/actions';

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
  ],
  providers: [],
  templateUrl: './item-sport-with-season.component.html',
  styleUrl: './item-sport-with-season.component.less',
  encapsulation: ViewEncapsulation.None, //helps with full width of buttons select season
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemSportWithSeasonComponent implements OnInit {
  // private crudStateObj = crudState<ITournament>();
  // crudStore: Store<{ crud: crudStoreInterface<ITournament> }> = inject(Store);
  // tournamentActions = crudActions<ITournament>();
  tournamentStore: Store<{ tournament: TournamentState }> = inject(Store);
  seasonStore: Store<{ season: SeasonState }> = inject(Store);

  season$: Observable<ISeason | null | undefined> = this.seasonStore.select(
    (state) => state.season.currentItem,
  );
  tournaments$: Observable<ITournament[]> = this.tournamentStore.select(
    (state) => state.tournament.itemsList,
  );

  routeParams$ = this.tournamentStore.select(
    fromRouter.getRouterSelectors().selectRouteParams,
  );

  private sportService = inject(SportService);

  searchListService = inject(SearchListService);
  paginationService = inject(PaginationService);

  sport$: Observable<ISport> = of({} as ISport);

  constructor() {}

  islandTitleProperty: keyof IBaseIdElse = 'title';

  tournamentItemHref(item: IBaseIdElse): string {
    return `/tournaments/id/${item.id}`;
  }

  loadSportSeasonTournaments(sportId: number, seasonYear: number) {
    this.tournamentStore.dispatch(
      tournamentActions.getTournamentsBySportAndSeason({
        id: sportId,
        year: seasonYear,
      }),
    );
  }

  loadSeasonByYear(year: number) {
    this.seasonStore.dispatch(seasonActions.getSeasonByYear({ year: year }));
  }

  ngOnInit() {
    this.routeParams$.subscribe((params) => {
      console.log(params);
      const { id, year } = params;
      const sportId = Number(id);
      const seasonYear = Number(year);

      this.loadSeasonByYear(seasonYear);
      this.sport$ = this.sportService.findById(sportId);

      this.loadSportSeasonTournaments(sportId, seasonYear);
    });
    this.tournaments$.subscribe((tournaments: ITournament[]) => {
      this.searchListService.updateData(of(tournaments));
      this.paginationService.initializePagination(
        this.searchListService.filteredData$,
      );
    });
  }
}
