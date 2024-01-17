import {Component, OnInit} from '@angular/core';
import {SeasonService} from "../../services/season.service";
import {map, Observable, of} from "rxjs";
import {IBaseIdElse} from "../../type/base.type";
import { SortService } from "../../services/sort.service";
import {ListOfItemsIslandComponent} from "../../shared/ui/list-of-items-island/list-of-items-island.component";

@Component({
  selector: 'app-season',
  standalone: true,
  imports: [
    ListOfItemsIslandComponent
  ],
  templateUrl: './season.component.html',
})

export class SeasonComponent implements OnInit{
  constructor(
    public seasonService: SeasonService
  ) {}
  dataList$: Observable<IBaseIdElse[]> = of([]);

  // item: ISeason = {id:1, year:2000};

  mapItemToLabel(item: IBaseIdElse): string {
    return item.year?.toString() ?? '';
  }

  titleProperty: keyof IBaseIdElse = 'year';

  seasonRoute(item: IBaseIdElse): any[] {
    return [`/seasons/year/` + item.year];
  }

  seasonHref(item: IBaseIdElse): string {
    return `/seasons/${this.titleProperty}/${item.year}`;
  }



  ngOnInit() {
    this.dataList$ = this.seasonService.findAll().pipe(
      map(data => SortService.sort(data, 'year', false))
    );
  }

}
