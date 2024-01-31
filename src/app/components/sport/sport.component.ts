import {Component, OnInit} from '@angular/core';
import {SportService} from "../../services/sport.service";
import {IBaseIdElse} from "../../type/base.type";
import {map, Observable, of} from "rxjs";
import {SortService} from "../../services/sort.service";
import {tap} from "rxjs/operators";
import {currentYear} from "../../base/constants";
import {RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-sport',
  standalone: true,
  imports: [
    RouterOutlet
  ],
  templateUrl: './sport.component.html',
})

export class SportComponent{
  constructor(
    public sportService: SportService
  ) {}

  dataList$: Observable<IBaseIdElse[]> = of([]);

  mapItemToLabel(item: IBaseIdElse): string {
    return item.title ?? '';
  }

  sportRoutWithSeason(item: IBaseIdElse): any[] {
    return [`/sports/id/${item.id}/seasons/${currentYear}/tournaments`];
  }


  // ngOnInit() {
  //   this.dataList$ = this.sportService.findAll()
  //     .pipe(
  //       tap(data => console.log(data)),
  //       map(data => SortService.sort(data, 'title'))
  //   );
  // }

}
