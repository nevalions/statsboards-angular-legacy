import { Component, Input } from '@angular/core';
import {
  TuiDataListModule,
  TuiDropdownModule,
  TuiLinkModule,
} from '@taiga-ui/core';
import { AsyncPipe, UpperCasePipe } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IBaseIdElse } from '../../../type/base.type';
import { ISport } from '../../../type/sport.type';

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
    UpperCasePipe,
  ],
  templateUrl: './header-menu.component.html',
  styleUrl: './header-menu.component.less',
})
export class HeaderMenuComponent {
  @Input() data: ISport[] = [];
  @Input() mapItemToLabel: (item: IBaseIdElse) => string = () => '';
  @Input() mapItemToSportRoute: (item: IBaseIdElse) => any[] = () => [];
  @Input() mapItemToTeamsRoute: (item: IBaseIdElse) => any[] = () => [];
  @Input() mapItemToPayersRoute: (item: IBaseIdElse) => any[] = () => [];
  @Input() mapItemToPositionRoute: (item: IBaseIdElse) => any[] = () => [];
}
