import { Component, Input } from '@angular/core';
import { TuiDataList, TuiDropdown } from '@taiga-ui/core';
import { UpperCasePipe } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IBaseIdElse } from '../../../type/base.type';
import { ISport } from '../../../type/sport.type';

@Component({
  selector: 'app-header-menu',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    TuiDropdown,
    TuiDataList,
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

  isDropdownOpen = false;

  closeDropdown() {
    // console.log('click', this.closeDropdown);
    this.isDropdownOpen = false;
  }

  toggleDropdown() {
    // console.log('toggle click', this.closeDropdown);
    this.isDropdownOpen = !this.isDropdownOpen;
  }
}
