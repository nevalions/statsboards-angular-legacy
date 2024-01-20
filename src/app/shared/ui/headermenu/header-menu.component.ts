import {Component, Input} from '@angular/core';
import {TuiDataListModule, TuiDropdownModule, TuiLinkModule} from "@taiga-ui/core";
import {AsyncPipe} from "@angular/common";
import {RouterLink, RouterLinkActive} from "@angular/router";
import {Observable} from "rxjs";
import {IBaseIdElse} from "../../../type/base.type";

@Component({
  selector: 'app-header-menu',
  standalone: true,
  imports: [
    TuiLinkModule,
    AsyncPipe,
    RouterLink,
    RouterLinkActive,
    TuiDropdownModule,
    TuiDataListModule,
  ],
  templateUrl: './header-menu.component.html',
  styleUrl: './header-menu.component.less',
})
export class HeaderMenuComponent {

  @Input() dataList: Observable<IBaseIdElse[]> | undefined;
  @Input() mapItemToLabel: (item: IBaseIdElse) => string = () => '';
  @Input() mapItemToSportRoute: (item: IBaseIdElse) => any[] = () => [];
  @Input() mapItemToTeamsRoute: (item: IBaseIdElse) => any[] = () => [];
  @Input() mapItemToPayersRoute: (item: IBaseIdElse) => any[] = () => [];

}
