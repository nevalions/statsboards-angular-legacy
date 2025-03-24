import { Component, Input, ViewChild } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TuiDataList, TuiLoader, TuiDropdown, TuiDropdownOpen, TuiIcon, TuiButton } from '@taiga-ui/core';
import { IBaseIdElse } from '../../../type/base.type';
import { Observable } from 'rxjs';
import { PolymorpheusContent } from '@taiga-ui/polymorpheus';
import { ISeasonAndSport } from '../../../type/sport.type';

@Component({
  selector: 'app-dropdownmenu',
  standalone: true,
  imports: [
    AsyncPipe,
    RouterLink,
    RouterLinkActive,
    TuiButton,
    TuiDataList,
    TuiDropdown,
    TuiIcon,
    TuiLoader,
  ],
  templateUrl: './dropdownmenu.component.html',
  styleUrl: './dropdownmenu.component.less',
})
export class DropDownMenuComponent {
  @ViewChild(TuiDropdownOpen, { static: false }) dropdown:
    | TuiDropdownOpen
    | undefined;

  closeDropdown() {
    if (this.dropdown) {
      // this.dropdown.updateOpen(false);
    }
  }

  @Input() title: string = 'Menu';
  @Input() dataList: Observable<IBaseIdElse[]> | undefined;
  @Input() mapItemToLabel: (item: IBaseIdElse) => string = () => '';
  @Input() mapItemToRoute: (item: ISeasonAndSport) => any = () => [];
  @Input() arrow: PolymorpheusContent<any>;
  @Input() emptyMessage: string = 'No data available';
}
