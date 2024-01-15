import {Component, OnInit} from '@angular/core';
import {SeasonService} from "../services/season.service";
import {Observable, of} from "rxjs";
import {IBaseIdElse} from "../type/base.type";

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

  mapItemToRoute(item: IBaseIdElse): any[] {
    return ['/', item.id];
  }

  ngOnInit() {
    this.dataList$ = this.seasonService.findAll();
  }

}
