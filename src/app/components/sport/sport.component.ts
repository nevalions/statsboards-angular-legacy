import {Component, OnInit} from '@angular/core';
import {SportService} from "../../services/sport.service";
import {IBaseIdElse} from "../../type/base.type";
import {map, Observable, of} from "rxjs";
import {SortService} from "../../services/sort.service";
import {tap} from "rxjs/operators";

@Component({
  selector: 'app-sport',
  standalone: true,
  imports: [],
  templateUrl: './sport.component.html',
})

export class SportComponent implements OnInit {
  constructor(
    public sportService: SportService
  ) {}

  dataList$: Observable<IBaseIdElse[]> = of([]);

  mapItemToLabel(item: IBaseIdElse): string {
    return item.title ?? '';
  }

  sportRout(item: IBaseIdElse): any[] {
    return [`/sports/id/`, item.id];
  }

  ngOnInit() {
    this.dataList$ = this.sportService.findAll()
      .pipe(
        tap(data => console.log(data)),
        map(data => SortService.sort(data, 'title', true))
    );
  }

}
