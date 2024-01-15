import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {SportService} from "../services/sport.service";
import {TuiSvgModule} from "@taiga-ui/core";
import {TUI_ARROW} from "@taiga-ui/kit";
import {IBaseIdTitle} from "../type/base.type";
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

  dataList$: Observable<IBaseIdTitle[]> = of([]);
  readonly arrow = TUI_ARROW;

  mapItemToLabel(item: IBaseIdTitle): string {
    return item.title ?? '';
  }

  mapItemToRoute(item: IBaseIdTitle): any[] {
    return ['/', item.id];
  }

  ngOnInit() {
    this.dataList$ = this.sportService.findAll();
  }

}
