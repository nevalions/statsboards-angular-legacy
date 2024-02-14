import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  of,
  Subject,
  switchMap,
  takeUntil,
} from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs/operators';
import { AsyncPipe, UpperCasePipe } from '@angular/common';
import { TuiBlockStatusModule } from '@taiga-ui/layout';
import { TuiIslandModule, TuiSelectModule } from '@taiga-ui/kit';
import {
  TuiButtonModule,
  TuiDataListModule,
  TuiDialogService,
  TuiLoaderModule,
} from '@taiga-ui/core';
import { SeasonDropdownComponent } from '../../../season/season-dropdown/season-dropdown.component';
import { ListOfItemsIslandComponent } from '../../../../shared/ui/list-of-items-island/list-of-items-island.component';
import { ITournament } from '../../../../type/tournament.type';
import { TournamentService } from '../../../tournament/tournament.service';
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
import { provideState, provideStore } from '@ngrx/store';
import {
  tournamentFeatureKey,
  tournamentReducer,
} from '../../../tournament/store/reducers';

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
export class ItemSportWithSeasonComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();

  private route = inject(ActivatedRoute);
  private sportService = inject(SportService);
  tournamentService = inject(TournamentService);
  seasonService = inject(SeasonService);

  tournaments$ = this.tournamentService.tournaments$;
  seasons$ = this.seasonService.seasons$;
  season$ = this.seasonService.season$;

  searchListService = inject(SearchListService);
  paginationService = inject(PaginationService);

  sport$: Observable<ISport> = of({} as ISport);
  year: number = 0;

  constructor() {}

  islandTitleProperty: keyof IBaseIdElse = 'title';

  tournamentItemHref(item: IBaseIdElse): string {
    return `/tournaments/id/${item.id}`;
  }

  ngOnInit() {
    // initialize data
    this.route.params
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((params) => {
        const { id, year } = params;
        const sportId = Number(id);
        const seasonYear = Number(year);

        if (isNaN(sportId) || isNaN(seasonYear)) {
          return;
        }
        this.year = seasonYear;
        // console.log(this.year);
        this.seasonService.getSeasonByYear(this.year);
        this.sport$ = this.sportService.findById(sportId);

        this.tournamentService.refreshTournaments(sportId, seasonYear);
      });

    // subscribe to updates
    this.tournamentService.tournaments$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((tournaments: ITournament[]) => {
        this.searchListService.updateData(of(tournaments));
        this.paginationService.initializePagination(
          this.searchListService.filteredData$,
        );
      });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
