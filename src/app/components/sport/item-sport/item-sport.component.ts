import { Component, inject, OnInit } from '@angular/core';
import { ISport } from '../../../type/sport.type';
import { Observable, switchMap } from 'rxjs';
import { AsyncPipe, UpperCasePipe } from '@angular/common';
import { ActivatedRoute, Params, RouterOutlet } from '@angular/router';
import { TuiBlockStatusModule } from '@taiga-ui/layout';
import { TuiIslandModule, TuiSelectModule } from '@taiga-ui/kit';
import { TuiButtonModule, TuiLoaderModule } from '@taiga-ui/core';
import { SeasonDropdownComponent } from '../../season/season-dropdown/season-dropdown.component';
import { ListOfItemsIslandComponent } from '../../../shared/ui/list-of-items-island/list-of-items-island.component';
import { Store } from '@ngrx/store';
import { SportState } from '../store/reducers';
import { sportActions } from '../store/actions';
import { AppState } from '../../../store/appstate';

@Component({
  selector: 'app-item-sport',
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
    RouterOutlet,
    TuiLoaderModule,
  ],
  templateUrl: './item-sport.component.html',
  styleUrl: './item-sport.component.less',
})
export class ItemSportComponent {
  store: Store<AppState> = inject(Store);
  sport$: Observable<ISport | null | undefined> = this.store.select(
    (state) => state.sport.currentSport,
  );
  sportId$: Observable<number | null | undefined> = this.store.select(
    (state) => state.sport.currentSport?.id,
  );

  constructor() {
    this.store.dispatch(sportActions.getId());
  }

  //
  // loadSport(id: number) {
  //   return this.sportStore.dispatch(sportActions.get({ id: id }));
  // }

  // ngOnInit() {
  //   this.route.paramMap.subscribe((params) => {
  //     let sportId = params.get('sport_id');
  //     console.log(sportId);
  //     if (sportId) {
  //       const id = Number(sportId);
  //       this.loadSport(id);
  //       this.sportId = id;
  //     } else {
  //       console.log('Params are empty');
  //     }
  //   });
  // }
}
