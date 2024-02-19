import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { SportComponent } from '../sport.component';
import { HeaderMenuComponent } from '../../../shared/ui/headermenu/header-menu.component';
import { IBaseIdElse } from '../../../type/base.type';
import { tap } from 'rxjs/operators';
import { map, Observable } from 'rxjs';
import { SortService } from '../../../services/sort.service';
import { TuiLoaderModule } from '@taiga-ui/core';
import { AsyncPipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { SportState } from '../store/reducers';
import { ISport } from '../../../type/sport.type';
import { sportActions } from '../store/actions';
import { currentSeasonId, currentYear } from '../../../base/constants';

@Component({
  selector: 'app-sport-nav',
  standalone: true,
  imports: [HeaderMenuComponent, TuiLoaderModule, AsyncPipe],
  templateUrl: './sport-nav.component.html',
  styleUrl: './sport-nav.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SportNavComponent implements OnInit {
  sportStore: Store<{ sport: SportState }> = inject(Store);
  sports$: Observable<ISport[]> = this.sportStore.select(
    (state) => state.sport.allSports,
  );

  mapItemToLabel(item: IBaseIdElse): string {
    return item.title ?? '';
  }

  sportRoutWithSeason(item: IBaseIdElse): any[] {
    return [`/sport/${item.id}/season/${currentSeasonId}/tournaments`];
  }

  sportTeamsRout(item: IBaseIdElse): any[] {
    return [`/sport/${item.id}/teams`];
  }

  sportPlayersRout(item: IBaseIdElse): any[] {
    return [`/sport/${item.id}/players`];
  }

  ngOnInit() {
    this.sportStore.dispatch(sportActions.getAll());
    // this.sports$.pipe(tap((data) => console.log(data))).subscribe();
  }

  // ngOnInit() {
  //   this.dataList$ = this.sportService.findAll().pipe(
  //     tap((data) => console.log(data)),
  //     map((data) => SortService.sort(data, 'title')),
  //   );
  // }
}
