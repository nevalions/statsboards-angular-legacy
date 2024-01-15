import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {SeasonService} from "../services/season.service";
import {Observable, of} from "rxjs";
import {IBaseIdElse} from "../type/base.type";
import {TUI_ARROW} from "@taiga-ui/kit";
import {DropDownMenuComponent} from "../shared/ui/dropdownmenu/dropdownmenu.component";
import {TuiSvgModule} from "@taiga-ui/core";

@Component({
  selector: 'app-season',
  standalone: true,
  imports: [
    TuiSvgModule,
    DropDownMenuComponent
  ],
  templateUrl: './season.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SeasonComponent implements OnInit{
  constructor(
    public seasonService: SeasonService
  ) {
  }

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


  protected readonly arrow = TUI_ARROW;
}
