import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {SportService} from "../services/sport.service";
import {TuiSvgModule} from "@taiga-ui/core";

import {IBaseIdElse} from "../type/base.type";
import {Observable, of} from "rxjs";
import {DropDownMenuComponent} from "../shared/ui/dropdownmenu/dropdownmenu.component";


@Component({
  selector: 'app-sport',
  standalone: true,
  imports: [
    TuiSvgModule,
    DropDownMenuComponent
  ],
  templateUrl: './sport.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,

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
