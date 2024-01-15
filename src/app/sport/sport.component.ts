import {Component, OnInit} from '@angular/core';
import {SportService} from "../services/sport.service";
import {IBaseIdElse} from "../type/base.type";
import {Observable, of} from "rxjs";


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

  mapItemToRoute(item: IBaseIdElse): any[] {
    return ['/', item.id];
  }

  ngOnInit() {
    this.dataList$ = this.sportService.findAll();
  }

}
