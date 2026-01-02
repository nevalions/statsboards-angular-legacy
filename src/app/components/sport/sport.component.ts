import { Component, OnInit, inject } from '@angular/core';
import { SportService } from './sport.service';
import { IBaseIdElse } from '../../type/base.type';
import { map, Observable, of } from 'rxjs';
import { SortService } from '../../services/sort.service';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-sport',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './sport.component.html',
})
export class SportComponent implements OnInit {
  constructor(public sportService: SportService) {}

  dataList$: Observable<IBaseIdElse[]> = of([]);

  mapItemToLabel(item: IBaseIdElse): string {
    return item.title ?? '';
  }

  sportRoutWithSeason(item: IBaseIdElse): any[] {
    return [`/sports/id/${item.id}/seasons/2024/tournaments`];
  }

  ngOnInit() {
    this.dataList$ = this.sportService
      .findAll()
      .pipe(map((data) => SortService.sort(data, 'title')));
  }
}
