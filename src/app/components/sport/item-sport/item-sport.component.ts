import { Component, inject, OnInit } from '@angular/core';
import { ISport } from '../../../type/sport.type';
import { Observable } from 'rxjs';
import { AsyncPipe, UpperCasePipe } from '@angular/common';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { TuiBlockStatusModule } from '@taiga-ui/layout';
import { TuiIslandModule, TuiSelectModule } from '@taiga-ui/kit';
import { TuiButtonModule, TuiLoaderModule } from '@taiga-ui/core';
import { SeasonDropdownComponent } from '../../season/season-dropdown/season-dropdown.component';
import { ListOfItemsIslandComponent } from '../../../shared/ui/list-of-items-island/list-of-items-island.component';
import { Store } from '@ngrx/store';
import { SportState } from '../store/reducers';
import { sportActions } from '../store/actions';

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
export class ItemSportComponent implements OnInit {
  sportStore: Store<{ sport: SportState }> = inject(Store);
  sport$: Observable<ISport | null | undefined> = this.sportStore.select(
    (state) => state.sport.currentSport,
  );
  sportId$: Observable<number | null | undefined> = this.sportStore.select(
    (state) => state.sport.currentSport?.id,
  );

  route = inject(ActivatedRoute);
  sportId!: number;

  constructor() {}

  loadSport(id: number) {
    this.sportStore.dispatch(sportActions.get({ id: id }));
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      let sportId = params.get('sport_id');
      console.log(sportId);
      if (sportId) {
        const id = Number(sportId);
        this.loadSport(id);
        this.sportId = id;
      } else {
        console.log('Params are empty');
      }
    });
  }
}
