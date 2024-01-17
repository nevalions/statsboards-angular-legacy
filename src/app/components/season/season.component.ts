import {Component, OnInit} from '@angular/core';
import {SeasonService} from "../../services/season.service";
import {map, Observable, of} from "rxjs";
import {IBaseIdElse} from "../../type/base.type";
import { SortService } from "../../services/sort.service";

@Component({
  selector: 'app-season',
  standalone: true,
  imports: [],
  templateUrl: './season.component.html',
})

export class SeasonComponent implements OnInit{
  constructor(
    public seasonService: SeasonService
  ) {}

  dataList$: Observable<IBaseIdElse[]> = of([]);

  mapItemToLabel(item: IBaseIdElse): string {
    return item.year?.toString() ?? '';
  }

  seasonRoute(item: IBaseIdElse): any[] {
    return ['/seasons/year/', item.year];
  }

  ngOnInit() {
    this.dataList$ = this.seasonService.findAll().pipe(
      map(data => SortService.sort(data, 'year', false))
    );
  }

}
